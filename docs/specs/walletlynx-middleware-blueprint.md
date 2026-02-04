# SecuriLynX/FinanciaLynX (WalletLynX) Middleware Blueprint v2.0

> **Role & Scope**: Highest Authority Senior Software Architect for the EternaLynX Network ecosystem. This document **dictates the how and why** only. It is intentionally **non-production** and must be translated into implementation by downstream engineering agents.

## Task Context (Required Inputs)
**TASK**: _Not provided in the prompt; insertion pending._

**Mandatory Input Streams (must be provided before implementation):**
- **NotebookLM Summaries** (global tech trend alignment: e.g., MIT robotics, carbon-aware scheduling).
- **Linear Issues** (primary intent signal and business goal).
- **Amplitude Insights** (behavioral prioritization signals).
- **Postman Schemas** (API structure/contract boundaries).

> **Action Required**: Implementation teams must attach the four input streams above to this spec before work begins. Missing inputs imply incomplete governance approval.

---

## 1) Technical Specification

### 1.1 User Stories
1. **As a WalletLynX customer**, I want my high-value transactions to be vetted through identity, compliance, and safety simulation so that my funds are protected from fraud and malicious execution.
2. **As a compliance officer**, I need a zero-knowledge compliance check for large transfers to ensure regulatory adherence without exposing PII.
3. **As a security operator**, I must confirm quantum-crypto agility status per transaction to maintain post-quantum readiness.
4. **As a trading user (DigiTrader_Pro)**, I need fast, vetted access to trading endpoints with asynchronous dispatch to a trading bot worker pool.

### 1.2 Acceptance Criteria
- **Monorepo Location**: Service is defined under `/gateway/walletlynx-middleware-service` (directory scope defined). 
- **Port**: Internal service runs on **port 4005**.
- **Protocol Split**: 
  - **GraphQL** exclusively for **Queries** (read operations).
  - **REST JSON** exclusively for **Mutations** (write operations).
- **Triple-Filtered Trust Layer**: All critical mutations must synchronously pass:
  1. **Identity Vetting** (DID + VC + RBAC + X-Lynx-User-ID).
  2. **Compliance/ZKP** (policy rules + ZKP placeholder + quantum readiness check).
  3. **Transaction Simulation** (outcome prediction + fee/gas estimate + reentrancy/malicious anomaly detection).
- **Synchronous SecuriLynX Integration**: For credential verification and PQC status checks, middleware must query **securilynx-core-service:4005** prior to approval.
- **Async Dispatcher**: A dedicated Kafka/Redis Streams producer handles time-consuming tasks such as trading bots, complex reporting, and ledger sync.

### 1.3 Core Components (Conceptual, Non-Production)
- **API Gateway / BFF**: Orchestrates GraphQL reads and REST writes.
- **Auth Middleware (ZTA)**: Requires and validates **X-Lynx-User-ID** plus session metadata.
- **DecentralizedIdentityService**: Validates DID + required VCs via VaultLynX (Chain A).
- **ComplianceService**: Policy engine for AML/KYC, spending limits, velocity.
- **ZKP Verification Adapter**: Placeholder to ChainLynx endpoint for proofs > $1,000 USD.
- **SimulationService**: Predicts transaction outcome, gas/fees, and anomalies.
- **QCNP Escalation Adapter**: External AI-driven anomaly review for vetoed transactions.
- **Async Producer**: Kafka/Redis Streams producer for heavy tasks.

### 1.4 GraphQL Schema Snippet (Non-Executable Example)
> **Note**: This is **illustrative only** and **not production-ready**.

- **Query: `myFinancialDashboard`**
  - **Aggregates**: balances, asset positions, transaction summary, security posture.
  - **Data Sources**: FinanciaLynX-Service + SecuriLynX-Core + Trading Bot Service.

### 1.5 Routing Definition (Design Intent)
| API Path / Query | Target Service(s) | Notes |
| --- | --- | --- |
| `Query { myFinancialDashboard }` | FinanciaLynX-Service + SecuriLynX-Core | Aggregated GraphQL resolver. |
| `POST /api/v1/transfer/initiate` | Vetting Layer → FinanciaLynX-Service | Must pass Identity, Compliance/ZKP, Simulation. |
| `POST /api/v1/digitrader/start` | Vetting Layer → Kafka/Redis Stream | Asynchronous dispatch to bot worker pool. |

### 1.6 Security, Performance, and Energy Constraints (Constraint Generation)
- **Security**: Enforce **Zero Trust** with DID + VC validation, mandatory headers, and RBAC gating. Require **steganographic watermarking** in any log payloads (non-PII) for audit traceability. Secrets **must be environment variables** only.
- **Performance**: Define per-request latency budget (example: < 200ms for queries, < 400ms for sync vetting). Budget should be revised using real Amplitude insights.
- **Energy Efficiency**: Apply **carbon-aware scheduling** for non-urgent tasks (async jobs), prioritizing low-carbon windows.

---

## 2) Architecture Decision Records (ADRs)

### ADR-001: BFF + Triple-Filtered Trust Layer
**Decision**: Adopt a BFF pattern with **Identity, Compliance/ZKP, and Simulation** gates on every critical mutation.
**Why**: Provides layered defense-in-depth to prevent fraud and policy bypass, while maintaining auditable, synchronous checks.
**Alternatives Considered**: Single-pass policy gateway (rejected due to reduced assurance).

### ADR-002: GraphQL Queries + REST Mutations
**Decision**: Use **GraphQL** for reads and **REST JSON** for writes.
**Why**: GraphQL optimizes aggregation and payload minimization for dashboards; REST offers clear transactional semantics for mutating operations.
**Alternatives Considered**: Full GraphQL (rejected due to mutation auditing and regulatory auditability constraints).

### ADR-003: ZKP Placeholder via ChainLynx
**Decision**: Integrate a **ZKP proof verification placeholder** for transfers > $1,000 USD.
**Why**: Enables privacy-preserving compliance validation without exposing PII.
**Alternatives Considered**: Full KYC payload transfer (rejected for privacy risk).

### ADR-004: Async Kafka/Redis Streams Producer
**Decision**: Use asynchronous streaming for long-running tasks (bots, reporting, ledger sync).
**Why**: Prevents synchronous API latency inflation and supports carbon-aware scheduling.
**Alternatives Considered**: Direct synchronous calls (rejected due to latency and energy impact).

### ADR-005: Port Alignment with SecuriLynX
**Decision**: Middleware service runs on port **4005**, and queries **securilynx-core-service:4005** for credential/PQC checks.
**Why**: Maintains compatibility with security service network topology in the platform.

---

## 3) Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 Devil’s Advocate: High-Risk Bottlenecks
- **ZKP Verification Latency**: Could slow high-value transfers; must be budgeted and profiled.
- **Simulation Accuracy**: Overly conservative simulations may block legitimate transactions.
- **Cross-Service Aggregation**: GraphQL aggregation risks partial data if backend services degrade.
- **Quantum Readiness Gate**: Hard dependency on SecuriLynX core could throttle throughput.

### 3.2 “8 Failure Modes” Anticipatory Reflection
1. **Post Request**: Client sends malformed request or missing headers (X-Lynx-User-ID, X-Lynx-User-Role).
2. **Deliver Request**: Network delays or routing errors to middleware.
3. **Validate Request**: DID/VC or RBAC fails due to stale credentials or policy mismatch.
4. **Update Server State**: Synchronous mutation partially executed; must be atomic or rolled back.
5. **Post Reply**: Middleware cannot finalize response due to downstream timeout.
6. **Deliver Reply**: Response dropped or delayed, causing retries and duplicate risk.
7. **Validate Reply**: Client rejects response due to mismatch in expected schema.
8. **Update Client State**: Client caches inconsistent state if dashboard aggregation stale.

### 3.3 Mitigation Signals (Non-Implementation)
- Maintain strong idempotency policies for write endpoints.
- Use circuit breakers for degraded dependencies.
- Provide explicit retry semantics for async workflows.

---

## 4) Governance Anchors (Human Oversight)
Human review **must** be required at the following checkpoints:
1. **Security Policy Changes**: Any change to compliance thresholds, RBAC grants, or DID/VC requirements.
2. **ZKP Threshold Modifications**: Any shift in the $1,000 threshold or proof mechanism.
3. **Quantum Readiness Policy**: Any change in PQC validation requirements.
4. **Simulation Logic Updates**: Any modifications to veto thresholds or anomaly detection logic.

---

## 5) DPPM Strategy (Decompose → Plan in Parallel → Merge)

### 5.1 Decomposition
- **Identity Shard**: Auth middleware + DID/VC checks + RBAC rules.
- **Compliance Shard**: Policy engine + ZKP verification + PQC status check.
- **Safety Shard**: Transaction simulation + anomaly detection + QCNP escalation.
- **Aggregation Shard**: GraphQL query orchestration.
- **Async Shard**: Kafka/Redis Streams producer for long-running tasks.

### 5.2 Plan in Parallel
- Draft API contracts (Postman schemas input required).
- Define identity and compliance policy sets (Linear issues required).
- Simulate performance budget and energy plan (Amplitude + NotebookLM inputs required).

### 5.3 Merge
- Consolidate into a unified middleware workflow.
- Validate governance anchors and human oversight boundaries.
- Produce an auditable architecture map.

---

## 6) Deployment & Upgrade Path (Non-Executable Guidance)

### 6.1 Docker Integration (Conceptual)
- Add a service entry for `walletlynx-middleware-service:4005` in `docker-compose.yml`.
- Link to `redis:6379` and a simulated `kafka-broker`.

### 6.2 Future Upgrade Suggestion
- **Confidential Computing (TEE)**: Recommend TEEs for ZKP verification to prevent runtime exposure of sensitive proofs.

### 6.3 Latency Optimization Recommendation
- Use **WebSockets** or **gRPC** for internal service-to-service updates (e.g., real-time transaction status, trade stream data).

---

## 7) Brand & Implementation Guardrails
- **Brand Tokens**: Enforce design token compliance in UI telemetry and dashboards: 
  - Ruby Red **#9B111E**
  - Yellow Gold **#FFD700**
  - Emerald **#50C878**
- **Code Integrity**: Require environment variables for secrets, explicit error handling, and steganographic watermarking in logs.

---

## 8) Suggested Branch Naming (Gitflow)
**Branch format**: `{layer}/{hub}/{module}/{tag}` where **tag** ∈ {feature, date, time}.
- Example: `gateway/walletlynx/middleware/feature`

---

## 9) Non-Production Implementation Guardrail
This document is **not production-ready**. It provides architectural intent only. Implementation must be performed by downstream engineering agents with full security review.
