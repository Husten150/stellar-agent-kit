/**
 * StellarAgentKit – unified DeFi agent (MNTAgentKit-style API for Stellar).
 * Constructor(secretKey, network) + initialize() then protocol methods.
 */

import { Keypair, Asset, TransactionBuilder, Operation, Networks, Horizon } from "@stellar/stellar-sdk";
import { getNetworkConfig, type NetworkConfig } from "./config/networks.js";
import { createDexClient, type DexAsset, type QuoteResult, type SwapResult } from "./dex/index.js";
import { createReflectorOracle, type OracleAsset, type PriceData } from "./oracle/index.js";
import { lendingSupply as blendSupply, lendingBorrow as blendBorrow, type LendingSupplyArgs, type LendingBorrowArgs, type LendingResult } from "./lending/index.js";

/** This project is mainnet-only. */
export type StellarNetwork = "mainnet" | "testnet";

export class StellarAgentKit {
  public readonly keypair: Keypair;
  public readonly network: StellarNetwork;
  public readonly config: NetworkConfig;
  private _initialized = false;
  private _dex: ReturnType<typeof createDexClient> | null = null;
  private _horizon: Horizon.Server | null = null;
  private _oracle: ReturnType<typeof createReflectorOracle> | null = null;

  constructor(secretKey: string, network: StellarNetwork = "mainnet") {
    this.keypair = Keypair.fromSecret(secretKey.trim());
    this.network = network;
    this.config = getNetworkConfig(network);
  }

  /**
   * Initialize clients (Horizon, Soroban RPC, protocol wrappers).
   * Call after construction before using protocol methods.
   */
  async initialize(): Promise<this> {
    this._horizon = new Horizon.Server(this.config.horizonUrl);
    this._dex = createDexClient(this.config, process.env.SOROSWAP_API_KEY);
    this._oracle = createReflectorOracle({ networkConfig: this.config });
    this._initialized = true;
    return this;
  }

  private ensureInitialized(): void {
    if (!this._initialized || !this._dex) {
      throw new Error("StellarAgentKit not initialized. Call await agent.initialize() first.");
    }
  }

  // ─── DEX Operations (mirror Mantle agniSwap / executeSwap) ─────────────────

  /**
   * Get a swap quote (exact-in). Uses SoroSwap aggregator (SoroSwap, Phoenix, Aqua).
   */
  async dexGetQuote(
    fromAsset: DexAsset,
    toAsset: DexAsset,
    amount: string
  ): Promise<QuoteResult> {
    this.ensureInitialized();
    return this._dex!.getQuote(fromAsset, toAsset, amount);
  }

  /**
   * Execute a swap using a prior quote.
   */
  async dexSwap(quote: QuoteResult): Promise<SwapResult> {
    this.ensureInitialized();
    return this._dex!.executeSwap(this.keypair.secret(), quote);
  }

  /**
   * One-shot: get quote and execute swap (convenience).
   */
  async dexSwapExactIn(
    fromAsset: DexAsset,
    toAsset: DexAsset,
    amount: string
  ): Promise<SwapResult> {
    const quote = await this.dexGetQuote(fromAsset, toAsset, amount);
    return this.dexSwap(quote);
  }

  // ─── Account & balances ────────────────────────────────────────────────────

  /**
   * Get balances for an account (native + trustlines).
   * @param accountId - Stellar account ID (G...); defaults to this agent's public key
   * @returns List of balances: asset code, issuer (if not native), balance string, and optional limit
   */
  async getBalances(accountId?: string): Promise<Array<{ assetCode: string; issuer?: string; balance: string; limit?: string }>> {
    this.ensureInitialized();
    if (!this._horizon) throw new Error("Horizon not initialized");
    const id = accountId ?? this.keypair.publicKey();
    const account = await this._horizon.loadAccount(id);
    return (account.balances as Array<{ asset_code: string; asset_issuer?: string; balance: string; limit?: string }>).map((b) => ({
      assetCode: b.asset_code === "native" ? "XLM" : b.asset_code,
      issuer: b.asset_issuer,
      balance: b.balance,
      limit: b.limit,
    }));
  }

  /**
   * Create a new Stellar account (funding from this agent's account).
   * @param destination - New account's public key (G...)
   * @param startingBalance - Amount of XLM to send (e.g. "1" for 1 XLM; minimum ~1 XLM for base reserve)
   * @returns Transaction hash
   */
  async createAccount(destination: string, startingBalance: string): Promise<{ hash: string }> {
    this.ensureInitialized();
    if (!this._horizon) throw new Error("Horizon not initialized");
    const networkPassphrase =
      this.network === "testnet" ? Networks.TESTNET : Networks.PUBLIC;
    const sourceAccount = await this._horizon.loadAccount(this.keypair.publicKey());
    const tx = new TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase,
    })
      .addOperation(Operation.createAccount({ destination, startingBalance }))
      .setTimeout(180)
      .build();
    tx.sign(this.keypair);
    const result = await this._horizon.submitTransaction(tx);
    return { hash: result.hash };
  }

  // ─── Payments (Horizon) ────────────────────────────────────────────────────

  /**
   * Send a native or custom-asset payment (Horizon).
   * @param to - Destination account (G...)
   * @param amount - Amount in display units (e.g. "10" for 10 XLM)
   * @param assetCode - Optional; omit for native XLM
   * @param assetIssuer - Optional; required if assetCode is set
   */
  async sendPayment(
    to: string,
    amount: string,
    assetCode?: string,
    assetIssuer?: string
  ): Promise<{ hash: string }> {
    this.ensureInitialized();
    if (!this._horizon) throw new Error("Horizon not initialized");

    const networkPassphrase =
      this.network === "testnet" ? Networks.TESTNET : Networks.PUBLIC;
    const sourceAccount = await this._horizon.loadAccount(this.keypair.publicKey());

    const asset =
      assetCode && assetIssuer
        ? new Asset(assetCode, assetIssuer)
        : Asset.native();

    const tx = new TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase,
    })
      .addOperation(Operation.payment({ destination: to, asset, amount }))
      .setTimeout(180)
      .build();

    tx.sign(this.keypair);
    const result = await this._horizon.submitTransaction(tx);
    return { hash: result.hash };
  }

  /**
   * Path payment (strict receive): send up to sendMax of sendAsset so destination receives exactly destAmount of destAsset.
   * @param sendAsset - Asset to send (native or { code, issuer })
   * @param sendMax - Maximum amount of sendAsset to send (display units)
   * @param destination - Recipient account (G...)
   * @param destAsset - Asset the recipient receives
   * @param destAmount - Exact amount of destAsset the recipient gets (display units)
   * @param path - Optional intermediate assets for the path
   */
  async pathPayment(
    sendAsset: { assetCode: string; issuer?: string },
    sendMax: string,
    destination: string,
    destAsset: { assetCode: string; issuer?: string },
    destAmount: string,
    path: Array<{ assetCode: string; issuer?: string }> = []
  ): Promise<{ hash: string }> {
    this.ensureInitialized();
    if (!this._horizon) throw new Error("Horizon not initialized");
    const send =
      sendAsset.assetCode === "XLM" && !sendAsset.issuer
        ? Asset.native()
        : new Asset(sendAsset.assetCode, sendAsset.issuer!);
    const dest =
      destAsset.assetCode === "XLM" && !destAsset.issuer
        ? Asset.native()
        : new Asset(destAsset.assetCode, destAsset.issuer!);
    const pathAssets = path.map((p) =>
      p.assetCode === "XLM" && !p.issuer ? Asset.native() : new Asset(p.assetCode, p.issuer!)
    );
    const networkPassphrase =
      this.network === "testnet" ? Networks.TESTNET : Networks.PUBLIC;
    const sourceAccount = await this._horizon.loadAccount(this.keypair.publicKey());
    const tx = new TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase,
    })
      .addOperation(
        Operation.pathPaymentStrictReceive({
          sendAsset: send,
          sendMax,
          destination,
          destAsset: dest,
          destAmount,
          path: pathAssets,
        })
      )
      .setTimeout(180)
      .build();
    tx.sign(this.keypair);
    const result = await this._horizon.submitTransaction(tx);
    return { hash: result.hash };
  }

  // ─── Oracle (Reflector SEP-40) ─────────────────────────────────────────────

  /**
   * Get latest price for an asset from Reflector oracle.
   * @param asset - { contractId: "C..." } for on-chain token or { symbol: "XLM" } for ticker
   */
  async getPrice(asset: OracleAsset): Promise<PriceData> {
    this.ensureInitialized();
    if (!this._oracle) throw new Error("Oracle not initialized");
    return this._oracle.lastprice(asset);
  }

  // ─── Lending (Blend) ───────────────────────────────────────────────────────

  /**
   * Supply (deposit) an asset to a Blend pool.
   */
  async lendingSupply(args: LendingSupplyArgs): Promise<LendingResult> {
    this.ensureInitialized();
    return blendSupply(this.config, this.keypair.secret(), args);
  }

  /**
   * Borrow an asset from a Blend pool.
   */
  async lendingBorrow(args: LendingBorrowArgs): Promise<LendingResult> {
    this.ensureInitialized();
    return blendBorrow(this.config, this.keypair.secret(), args);
  }

  //  Transaction history helpers

  /**
   * Get transaction history for an account with decoded operations.
   * @param accountId - Stellar account ID (G...); defaults to this agent's public key
   * @param limit - Maximum number of transactions to fetch (default: 10, max: 200)
   * @returns Array of transactions with decoded operation details
   */
  async getTransactionHistory(
    accountId?: string,
    limit: number = 10
  ): Promise<Array<{
    hash: string;
    ledger: number;
    createdAt: string;
    sourceAccount: string;
    fee: number;
    memo?: string;
    operations: Array<{
      type: string;
      source?: string;
      details: Record<string, unknown>;
    }>;
  }>> {
    this.ensureInitialized();
    if (!this._horizon) throw new Error("Horizon not initialized");
    
    const id = accountId ?? this.keypair.publicKey();
    const actualLimit = Math.min(Math.max(limit, 1), 200); // Clamp between 1-200
    
    try {
      const transactions = await this._horizon
        .transactions()
        .forAccount(id)
        .limit(actualLimit)
        .order("desc")
        .call();

      return transactions.records.map((tx) => ({
        hash: tx.hash,
        ledger: tx.ledger,
        createdAt: tx.created_at,
        sourceAccount: tx.source_account,
        fee: parseInt(tx.fee_paid, 10),
        memo: tx.memo ? tx.memo : undefined,
        operations: tx.operations.map((op) => ({
          type: op.type,
          source: op.source_account,
          details: this.decodeOperationDetails(op),
        })),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Decode operation details into a human-readable format.
   * @private
   */
  private decodeOperationDetails(operation: Horizon.BaseOperationResponse): Record<string, unknown> {
    switch (operation.type) {
      case "payment":
        return {
          to: operation.destination,
          amount: operation.amount,
          asset: operation.asset_code === "native" ? "XLM" : `${operation.asset_code}:${operation.asset_issuer}`,
        };
      case "create_account":
        return {
          newAccount: operation.destination,
          startingBalance: operation.starting_balance,
        };
      case "path_payment":
        return {
          to: operation.destination,
          sendMax: operation.send_max,
          sendAsset: operation.send_asset_code === "native" ? "XLM" : `${operation.send_asset_code}:${operation.send_asset_issuer}`,
          destAmount: operation.dest_amount,
          destAsset: operation.dest_asset_code === "native" ? "XLM" : `${operation.dest_asset_code}:${operation.dest_asset_issuer}`,
        };
      case "manage_offer":
        return {
          selling: operation.selling_asset_code === "native" ? "XLM" : `${operation.selling_asset_code}:${operation.selling_asset_issuer}`,
          buying: operation.buying_asset_code === "native" ? "XLM" : `${operation.buying_asset_code}:${operation.buying_asset_issuer}`,
          amount: operation.amount,
          price: operation.price,
        };
      case "create_passive_sell_offer":
        return {
          selling: operation.selling_asset_code === "native" ? "XLM" : `${operation.selling_asset_code}:${operation.selling_asset_issuer}`,
          buying: operation.buying_asset_code === "native" ? "XLM" : `${operation.buying_asset_code}:${operation.buying_asset_issuer}`,
          amount: operation.amount,
          price: operation.price,
        };
      case "set_options":
        return {
          signer: operation.signer_key ? { key: operation.signer_key, weight: operation.signer_weight } : undefined,
          masterWeight: operation.master_weight,
          lowThreshold: operation.low_threshold,
          medThreshold: operation.med_threshold,
          highThreshold: operation.high_threshold,
          homeDomain: operation.home_domain,
          inflationDest: operation.inflation_destination,
        };
      case "change_trust":
        return {
          asset: operation.asset_code === "native" ? "XLM" : `${operation.asset_code}:${operation.asset_issuer}`,
          limit: operation.limit,
        };
      case "allow_trust":
        return {
          trustor: operation.trustor,
          assetCode: operation.asset_code,
          authorize: operation.authorize,
        };
      case "account_merge":
        return {
          destination: operation.destination,
        };
      case "inflation":
        return {};
      case "manage_data":
        return {
          name: operation.name,
          value: operation.value ? Buffer.from(operation.value, "base64").toString("utf8") : undefined,
        };
      case "bump_sequence":
        return {
          bumpTo: operation.bump_to,
        };
      default:
        return { raw: operation };
    }
  }
}
