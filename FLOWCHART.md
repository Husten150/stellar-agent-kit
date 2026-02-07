# Stellar DeFi Agent Kit — Flowchart & Progress

High-level plan and current progress for the hackathon agent kit.

---

## 1. Overall architecture (current)

```mermaid
flowchart LR
    subgraph User
        U[User / Chat]
    end

    subgraph Agent["Agent layer"]
        A[LLM / Orchestrator]
    end

    subgraph Tools["Tools"]
        T1[check_balance]
        T2[swap_asset]
        T3[create_trustline]
        T4[get_swap_quote]
    end

    subgraph Core["Core & DeFi"]
        C[StellarClient]
        D[SoroSwapClient]
    end

    subgraph Config["Config"]
        N[networks]
    end

    subgraph External["External"]
        H[Horizon]
        R[Soroban RPC]
        API[SoroSwap API]
    end

    U --> A
    A --> T1
    A --> T2
    A --> T3
    A --> T4
    T1 --> C
    T2 --> D
    T3 --> N
    T4 --> D
    C --> N
    D --> N
    C --> H
    T3 --> H
    D --> R
    D --> API
    N --> H
    N --> R
```

---

## 2. Progress: what’s done vs what’s next

```mermaid
flowchart TB
    subgraph Done["✅ Done"]
        D1[config/networks.ts]
        D2[core/stellarClient.ts]
        D3[defi/soroSwapClient.ts]
        D4[tools/agentTools.ts]
        D5[create_trustline]
        D6[get_swap_quote]
        D7[Agent loop + CLI]
        D8[Mainnet RPC Gateway]
    end

    subgraph Next["🔲 Optional"]
        N1[send_payment tool]
        N2[Tests & README]
    end

    D1 --> D2
    D1 --> D3
    D2 --> D4
    D3 --> D4
    D4 --> D5
    D4 --> D6
    D4 --> D7
    D1 --> D8
```

---

## 3. check_balance flow

```mermaid
flowchart LR
    A[check_balance tool] --> B[getNetworkConfig]
    B --> C[StellarClient]
    C --> D[Horizon Server]
    D --> E[GET /accounts/:id]
    E --> F[balances array]
    F --> G[return balances]
```

---

## 4. swap_asset flow

```mermaid
flowchart TB
    A[swap_asset tool] --> B{Resolve assets}
    B --> C[XLM / USDC / AUSDC...]
    C --> D[toRawAmount]
    D --> E[SoroSwapClient.getQuote]
    E --> F{API key?}
    F -->|Yes| G[API /quote]
    F -->|No| H[Contract simulate]
    G --> I[QuoteResponse]
    H --> I
    I --> J{privateKey?}
    J -->|No| K[return quote only]
    J -->|Yes| L[API /quote/build]
    L --> M[Sign tx]
    M --> N[Soroban RPC sendTransaction]
    N --> O[return txHash + quote]
```

---

## 5. create_trustline flow

```mermaid
flowchart TB
    A[create_trustline tool] --> B[getNetworkConfig]
    B --> C[Horizon.Server]
    C --> D[Load account]
    D --> E{Trustline exists?}
    E -->|Yes| F[return existing]
    E -->|No| G[TransactionBuilder]
    G --> H[Operation.changeTrust]
    H --> I[Sign with keypair]
    I --> J[submitTransaction]
    J --> K[return txHash]
```

---

## 6. get_swap_quote flow

```mermaid
flowchart LR
    A[get_swap_quote tool] --> B[getNetworkConfig]
    B --> C[SoroSwapClient]
    C --> D[SoroSwap API /quote]
    D --> E[QuoteResponse]
    E --> F[Human-readable summary]
    F --> G[return quote only]
```

---

## 7. Module dependency map

```mermaid
flowchart TD
    cliAgent["demo/cliAgent.ts"]
    agentTools["tools/agentTools.ts"]
    stellarClient["core/stellarClient.ts"]
    soroSwapClient["defi/soroSwapClient.ts"]
    networks["config/networks.ts"]

    cliAgent --> agentTools
    agentTools --> networks
    agentTools --> stellarClient
    agentTools --> defi["defi/index.js"]
    stellarClient --> networks
    soroSwapClient --> networks
    defi --> soroSwapClient
```

---

## 8. Legend

| Symbol | Meaning |
|--------|--------|
| ✅ Done | Implemented and in repo |
| 🔲 Optional | Possible next steps |
| Agent layer | LLM/orchestrator (CLI loop) that chooses and calls tools |
| Tools | check_balance, swap_asset, create_trustline, get_swap_quote |
| Mainnet RPC | Gateway URL (`soroban-rpc.mainnet.stellar.gateway.fm`) |

---

## 9. Suggested next steps (optional)

1. **send_payment** — Tool wrapping `StellarClient.sendPayment` for simple XLM/asset transfers.
2. **Tests** — Unit tests for tools and SoroSwap client.
3. **README** — Update with agent usage, env vars (`GROQ_API_KEY`, `SOROSWAP_API_KEY`), and mainnet vs testnet.
