import { describe, it, expect, vi, beforeEach } from "vitest";
import { StellarAgentKit } from "../agent.js";
import { Horizon } from "@stellar/stellar-sdk";

// Mock Horizon server
const mockHorizon = {
  loadAccount: vi.fn(),
  submitTransaction: vi.fn(),
  transactions: vi.fn(() => mockHorizon),
  forAccount: vi.fn(() => mockHorizon),
  limit: vi.fn(() => mockHorizon),
  order: vi.fn(() => mockHorizon),
  call: vi.fn(),
} as unknown as Horizon.Server;

// Mock network config
const mockConfig = {
  horizonUrl: "https://horizon-testnet.stellar.org",
  sorobanRpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
};

// Mock StellarAgentKit dependencies
vi.mock("../config/networks.js", () => ({
  getNetworkConfig: vi.fn(() => mockConfig),
}));

vi.mock("../dex/index.js", () => ({
  createDexClient: vi.fn(() => ({ getQuote: vi.fn(), executeSwap: vi.fn() })),
}));

vi.mock("../oracle/index.js", () => ({
  createReflectorOracle: vi.fn(() => ({ lastprice: vi.fn() })),
}));

vi.mock("../lending/index.js", () => ({
  lendingSupply: vi.fn(),
  lendingBorrow: vi.fn(),
}));

describe("StellarAgentKit - getTransactionHistory", () => {
  let agent: StellarAgentKit;
  const testSecretKey = "SCZWJ5X5NPL6I6ET6QRTQZLXH6CCPIYKIACHGUPMAZHMFVYUL234JVXC";
  const testAccountId = "GAMVCXSK654EKLOWMPJZCGUXKEW7X5RF74YZ6GBZV2FUJGJT6XG7HMHI";

  beforeEach(() => {
    vi.clearAllMocks();
    agent = new StellarAgentKit(testSecretKey, "testnet");
    
    // Mock the Horizon server
    vi.spyOn(agent as any, "_horizon", "get").mockReturnValue(mockHorizon);
    vi.spyOn(agent as any, "_dex", "get").mockReturnValue({ getQuote: vi.fn(), executeSwap: vi.fn() });
    vi.spyOn(agent as any, "_oracle", "get").mockReturnValue({ lastprice: vi.fn() });
    vi.spyOn(agent as any, "_initialized", "get").mockReturnValue(true);
  });

  it("should fetch transaction history with decoded operations", async () => {
    const mockTransactions = {
      records: [
        {
          hash: "tx_hash_1",
          ledger: 12345,
          created_at: "2023-01-01T00:00:00Z",
          source_account: testAccountId,
          fee_paid: "100",
          memo: "test memo",
          operations: [
            {
              type: "payment",
              source_account: testAccountId,
              destination: "GDEST123...",
              amount: "10.0000000",
              asset_code: "native",
              asset_issuer: null,
            },
          ],
        },
      ],
    };

    mockHorizon.call.mockResolvedValue(mockTransactions);

    const result = await agent.getTransactionHistory(testAccountId, 5);

    expect(mockHorizon.transactions).toHaveBeenCalled();
    expect(mockHorizon.forAccount).toHaveBeenCalledWith(testAccountId);
    expect(mockHorizon.limit).toHaveBeenCalledWith(5);
    expect(mockHorizon.order).toHaveBeenCalledWith("desc");
    expect(mockHorizon.call).toHaveBeenCalled();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      hash: "tx_hash_1",
      ledger: 12345,
      createdAt: "2023-01-01T00:00:00Z",
      sourceAccount: testAccountId,
      fee: 100,
      memo: "test memo",
      operations: [
        {
          type: "payment",
          source: testAccountId,
          details: {
            to: "GDEST123...",
            amount: "10.0000000",
            asset: "XLM",
          },
        },
      ],
    });
  });

  it("should use agent's public key when no account ID is provided", async () => {
    const mockTransactions = { records: [] };
    mockHorizon.call.mockResolvedValue(mockTransactions);

    await agent.getTransactionHistory();

    expect(mockHorizon.forAccount).toHaveBeenCalledWith(agent.keypair.publicKey());
  });

  it("should clamp limit between 1 and 200", async () => {
    const mockTransactions = { records: [] };
    mockHorizon.call.mockResolvedValue(mockTransactions);

    await agent.getTransactionHistory(testAccountId, 0); // Below minimum
    expect(mockHorizon.limit).toHaveBeenCalledWith(1);

    await agent.getTransactionHistory(testAccountId, 300); // Above maximum
    expect(mockHorizon.limit).toHaveBeenCalledWith(200);
  });

  it("should handle different operation types correctly", async () => {
    const mockTransactions = {
      records: [
        {
          hash: "tx_hash_1",
          ledger: 12345,
          created_at: "2023-01-01T00:00:00Z",
          source_account: testAccountId,
          fee_paid: "100",
          operations: [
            {
              type: "create_account",
              destination: "GNEW123...",
              starting_balance: "1.0000000",
            },
            {
              type: "change_trust",
              asset_code: "USDC",
              asset_issuer: "GA5ZSEJYB37JIR5ST5BSUSMDT2J6J6K5JF7UVN2H3LWS5GXBWQY3ZVA",
              limit: "1000.0000000",
            },
          ],
        },
      ],
    };

    mockHorizon.call.mockResolvedValue(mockTransactions);

    const result = await agent.getTransactionHistory(testAccountId);

    expect(result[0].operations).toHaveLength(2);
    expect(result[0].operations[0]).toMatchObject({
      type: "create_account",
      details: {
        newAccount: "GNEW123...",
        startingBalance: "1.0000000",
      },
    });
    expect(result[0].operations[1]).toMatchObject({
      type: "change_trust",
      details: {
        asset: "USDC:GA5ZSEJYB37JIR5ST5BSUSMDT2J6J6K5JF7UVN2H3LWS5GXBWQY3ZVA",
        limit: "1000.0000000",
      },
    });
  });

  it("should throw error when Horizon is not initialized", async () => {
    vi.spyOn(agent as any, "_horizon", "get").mockReturnValue(null);

    await expect(agent.getTransactionHistory(testAccountId)).rejects.toThrow("Horizon not initialized");
  });

  it("should throw error when agent is not initialized", async () => {
    vi.spyOn(agent as any, "_initialized", "get").mockReturnValue(false);

    await expect(agent.getTransactionHistory(testAccountId)).rejects.toThrow("StellarAgentKit not initialized");
  });

  it("should handle API errors gracefully", async () => {
    mockHorizon.call.mockRejectedValue(new Error("Network error"));

    await expect(agent.getTransactionHistory(testAccountId)).rejects.toThrow("Failed to fetch transaction history: Network error");
  });

  it("should decode custom asset operations correctly", async () => {
    const mockTransactions = {
      records: [
        {
          hash: "tx_hash_1",
          ledger: 12345,
          created_at: "2023-01-01T00:00:00Z",
          source_account: testAccountId,
          fee_paid: "100",
          operations: [
            {
              type: "payment",
              destination: "GDEST123...",
              amount: "10.0000000",
              asset_code: "USDC",
              asset_issuer: "GA5ZSEJYB37JIR5ST5BSUSMDT2J6J6K5JF7UVN2H3LWS5GXBWQY3ZVA",
            },
          ],
        },
      ],
    };

    mockHorizon.call.mockResolvedValue(mockTransactions);

    const result = await agent.getTransactionHistory(testAccountId);

    expect(result[0].operations[0].details).toMatchObject({
      to: "GDEST123...",
      amount: "10.0000000",
      asset: "USDC:GA5ZSEJYB37JIR5ST5BSUSMDT2J6J6K5JF7UVN2H3LWS5GXBWQY3ZVA",
    });
  });

  it("should handle manage_data operations with base64 values", async () => {
    const mockTransactions = {
      records: [
        {
          hash: "tx_hash_1",
          ledger: 12345,
          created_at: "2023-01-01T00:00:00Z",
          source_account: testAccountId,
          fee_paid: "100",
          operations: [
            {
              type: "manage_data",
              name: "test_key",
              value: Buffer.from("test_value").toString("base64"),
            },
          ],
        },
      ],
    };

    mockHorizon.call.mockResolvedValue(mockTransactions);

    const result = await agent.getTransactionHistory(testAccountId);

    expect(result[0].operations[0].details).toMatchObject({
      name: "test_key",
      value: "test_value",
    });
  });
});
