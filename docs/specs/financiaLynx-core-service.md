# FinanciaLynX Core Service (FinanciaLynx-API) — Architecture Specification (MVP)

> **Role boundary:** This document defines **how** and **why** the system is structured. It is a **non-code** specification intended for downstream engineering implementation only.

## 0) Input Synthesis & Gaps (Required Data Streams)

**Observed inputs:** The request references NotebookLM summaries, Linear issues, Amplitude insights, and Postman schemas, but none were supplied in this task. This spec proceeds with placeholders and flags all dependent decisions as **Pending Input**. Provide the missing artifacts to finalize requirements.

- **NotebookLM Summaries:** _Missing — Pending Input._
- **Linear Issue(s):** _Missing — Pending Input._
- **Amplitude Insights:** _Missing — Pending Input._
- **Postman Schemas:** _Missing — Pending Input._

## 1) DPPM Strategy (Decompose → Plan in Parallel → Merge)

### 1.1 Decomposition (Linear Issue → Sub-goals)
- **Identity & Access Shard:** Token-based auth (JWT/OAuth) passthrough from API-Gateway, VaultLynX checks.
- **Commerce & Token Shard:** Mint/Burn/Transfer for USDD/UNIC, governance guardrails, proxy to ChainLynX.
- **Data & Ledger Shard:** Postgres-backed financial identity, balances, transaction history.
- **Compliance Shard:** KYC/AML & sanctions placeholders, pre-chain gating.
- **Ops & Observability Shard:** Dockerization, Redis caching/rate-limits, async confirmation worker.

### 1.2 Constraint Generation
- **Security:**
  - Steganographic watermarking policy for all critical transaction records.
  - Secrets **must** be environment variables; no hard-coded secrets.
  - Explicit error handling for all cross-service calls with retry/backoff.
- **Performance:**
  - Target P95 latency for read endpoints ≤ 250ms.
  - Target P95 latency for write endpoints ≤ 750ms (excluding chain finality).
- **Energy Efficiency:**
  - Carbon-aware scheduling for async worker where possible.

### 1.3 Plan in Parallel
- **Track A (Service Architecture):** Module boundaries + SRP services.
- **Track B (Security & Compliance):** Auth middleware, compliance gating, VaultLynX check.
- **Track C (Data/Infra):** Postgres/Redis integration, Docker/Docker Compose.
- **Track D (Async Finality):** Redis pub/sub, confirmation worker design.

### 1.4 Merge (Unified Blueprint)
- Merge cross-cutting concerns: all write endpoints flow through Compliance + VaultLynX checks, enforced via shared middleware/service layer.

## 2) Technical Specification

### 2.1 Service Definition
- **Service name:** `FinanciaLynx-API`
- **Monorepo location:** `/backend/financial-lynx-api/`
- **Stack:** Node.js + TypeScript (framework choice permitted: NestJS, Fastify, or Express; prefer enterprise modularity).

### 2.2 Data Stores
- **Primary DB:** PostgreSQL (`financalynx_db`) for transactional data.
- **Cache/Queue:** Redis for session/rate limiting and pub/sub coordination.

### 2.3 Required Environment Variables (No Secrets in Code)
- `CHAINLYNX_API_URL`
- `VAULTLYNX_API_KEY`
- `POSTGRES_URL`
- `REDIS_URL`

### 2.4 API Contracts (Gateway-facing)
- **Auth:** Token-based authentication (JWT/OAuth) from upstream API-Gateway; service must validate token + user context on all endpoints.
- **Read Endpoints:**
  - `GET /api/v1/balance/:user_id` → multi-token balances (USDD, UNIC, ETH/other).
  - `GET /api/v1/transactions/:user_id` → paginated ledger transactions.
- **Write Endpoints:**
  - `POST /api/v1/token/transfer` → calls `TokenService.transferUnicoin`.
  - `POST /api/v1/token/mint/request` → calls `TokenService.mintDigiUSD`.
- **Rate Limiting:** Redis-backed rate limit middleware for all write endpoints.

### 2.5 Service Modules (SRP)
- **WalletService**
  - Responsibilities: user registration, balance queries, transaction history retrieval.
  - Constraint: must interface only with ChainLynX proxy for validated ledger reads.
- **TokenService**
  - Responsibilities: mint/burn/transfer for USDD/UNIC.
  - Constraint: enforce compliance + VaultLynX checks prior to chain submission.
- **ComplianceService**
  - Responsibilities: KYC/AML + sanction screening placeholders.
  - Constraint: all mint/transfer routes must call it before chain submission.
- **TradeEngineProxy (MVP Placeholder)**
  - Responsibilities: future integration stubs for DigiTrader + Quantum AI Trade Nexus.

### 2.6 ChainLynX Proxy Interface
- Define an internal TypeScript interface (`ChainLynxAPI.ts`) with:
  - `submitTransaction(payload, signature)`
  - `getLatestBlock()`
  - `getWalletBalance(address)`

### 2.7 TokenService Logic (Core Flows)
- **mintDigiUSD(amount, user_id)**
  - Compliance pre-check: `runKYCAmlCheck(user_id)` → fail → HTTP 403.
  - Treasury guardrail: `MAX_DAILY_MINT_LIMIT` check (config).
  - Proxy submission: formulate ChainLynX payload for USDD mint.
  - Expected response: `tx_hash` from ChainLynX (DAG consensus).
- **transferUnicoin(sender, recipient, amount)**
  - VaultLynX auth pre-check using `VAULTLYNX_API_KEY`.
  - Proxy submission: ABI/function signature compliant payload.
  - Error handling: explicit chain failure/revert trapping with reason string.

### 2.8 Orchestration & Async Finality
- **Redis Pub/Sub:** `chainlynx:tx_confirmed` topic for finalized transactions.
- **Worker Role:** Async worker updates `financalynx_db` only after finality event.
- **Retry:** External API calls use exponential backoff with capped retries.

### 2.9 Deployability
- **Multi-stage Dockerfile:** Build TypeScript → runtime image minimal.
- **docker-compose:** service + DB + Redis and dedicated network/volumes.
- **Local test script:** `./scripts/test-local-api.sh` with docker compose + curl check.

### 2.10 Patentable Concepts (IP Notice)
- **Compliance-Gated Proxy Model:** compliance + VaultLynX checks prior to chain submission.
- **Asynchronous Finality Worker:** decoupled submission vs confirmation via Redis.

### 2.11 MVP Status
- MVP ready when Mint/Transfer/Balance flows are defined; DigiTrader/CreditLynX placeholders only.

### 2.12 Brand Compliance (Design Tokens)
- Required tokens for UI/system references: **Ruby Red (#9B111E)**, **Yellow Gold (#FFD700)**, **Emerald (#50C878)**.

### 2.13 Gitflow Recommendation
- Suggested branch naming: `backend/financial-lynx-api/feature`.

## 3) Architecture Decision Records (ADRs)

### ADR-001: Modular Service Architecture (SRP)
- **Decision:** Adopt service-layer modules (Wallet/Token/Compliance/TradeEngineProxy).
- **Why:** Enforces SRP, reduces coupling, enables isolated security reviews.
- **Alternatives:** Monolithic controller logic; rejected for security audit complexity.

### ADR-002: ChainLynX Proxy Pattern
- **Decision:** All chain interactions routed via ChainLynX proxy interface.
- **Why:** Centralizes validation, prevents direct chain access, ensures compliance gating.
- **Alternatives:** Direct chain calls; rejected due to audit/traceability risks.

### ADR-003: Redis Pub/Sub Finality Worker
- **Decision:** Use Redis topic `chainlynx:tx_confirmed` to finalize transactions.
- **Why:** Decouples submission from confirmation; reliable eventual consistency.
- **Alternatives:** Synchronous confirmation; rejected for latency and resilience issues.

### ADR-004: Postgres for Transactional Core
- **Decision:** Postgres as system of record for balances and transaction history.
- **Why:** ACID guarantees for financial data.
- **Alternatives:** NoSQL-only; rejected for transactional integrity concerns.

## 4) Risk & Tradeoff Analysis (Devil’s Advocate)

- **Risk:** Compliance checks add latency to write endpoints.
  - **Mitigation:** Cache non-sensitive results in Redis with short TTL.
- **Risk:** Redis pub/sub message loss in edge cases.
  - **Mitigation:** Optionally introduce Redis Streams or DLQ in future.
- **Risk:** ChainLynX proxy becomes a single point of failure.
  - **Mitigation:** Add circuit breakers + fallback to queued retries.
- **Risk:** VaultLynX API outage blocks transfers.
  - **Mitigation:** Degraded mode (read-only) with clear UX messaging.
- **Risk:** Carbon-aware scheduling may delay processing.
  - **Mitigation:** Allow overrides for high-priority confirmations.

## 5) The “8 Failure Modes” Analysis (Anticipatory Reflection)

1. **Post Request:** Rate limit misconfiguration blocks valid traffic.
2. **Deliver Request:** Network routing issues between API-Gateway and FinanciaLynx-API.
3. **Validate Request:** JWT/OAuth signature failures due to clock skew.
4. **Update Server State:** DB transaction conflicts under concurrent mint requests.
5. **Post Reply:** ChainLynX returns ambiguous error without reason string.
6. **Deliver Reply:** Response timeout on high chain latency.
7. **Validate Reply:** Client misinterprets tx_hash format.
8. **Update Client State:** UI marks transfer complete before confirmation event.

## 6) Governance Anchors (Human Oversight)

- **Anchor A:** Approval required before enabling production mint limits.
- **Anchor B:** Approval required for compliance policy changes.
- **Anchor C:** Approval required for ChainLynX ABI/function signature updates.
- **Anchor D:** Approval required to change VaultLynX authentication strategy.

## 7) Implementation Guardrails (for downstream engineers)

- Use environment variables for all secrets.
- Implement explicit error handling and retry logic with backoff.
- Embed steganographic watermarking in critical transaction record storage.
- Avoid direct chain calls; use the ChainLynX proxy exclusively.

