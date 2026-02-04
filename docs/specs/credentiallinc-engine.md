# CredentialLinc Engine (v1.0) — Technical Specification

> **Role Notice**: As the Highest Authority Senior Software Architect, I am **forbidden** from writing production-ready code. This document provides the **how/why** specification only; downstream engineering will implement.  
> **Task Placeholder**: The TASK field referenced a missing Linear issue / NotebookLM summary. This spec proceeds with an explicit **Assumptions & Gaps** section below.

---

## 0) Inputs, Assumptions, and Gaps (Required by Governance)

### 0.1 Required Data Streams (Not Provided)
- **NotebookLM Summaries**: *Not provided.*
- **Linear Issues (Intent Signal)**: *Not provided.*
- **Amplitude Insights (Behavioral Priorities)**: *Not provided.*
- **Postman Schemas (API Contracts)**: *Not provided.*

### 0.2 Assumptions to Proceed
- The **primary intent** is to design a CredentialLinc Engine service for AI lifecycle management, training lockout, and verifiable credentialing.
- The **implementation** is expected to use Python/FastAPI with modular components and PostgreSQL-compatible persistence placeholders.
- The **core domains** include training lifecycle, authority gates for restricted domains (e.g., trading/legal), and ledger anchoring.

### 0.3 Action Required (Follow-up)
- Provide the missing data streams to reconcile acceptance criteria, prioritize endpoints, and finalize schemas.

---

## 1) Decomposition (DPPM — Decompose Phase)

### 1.1 Sub-goals (Shards)
1. **Identity & Lifecycle Shard**: AI profile state, training status, and lockout enforcement.
2. **Credentialing Shard**: Verifiable credential issuance and immutable proof anchoring.
3. **Authority Gate Shard**: Domain access checks based on credentials.
4. **Persistence & Audit Shard**: PostgreSQL-compatible schema placeholders for AI/user linkage, training records, and credentials.
5. **API Contract Shard**: Endpoint definitions, standard errors, status retrieval, and training lockout veto rules.

---

## 2) Constraint Generation (DPPM — Constraints Phase)

### 2.1 Security Constraints
- **Steganographic encryption**: all credentials and ledger anchor payloads must include a watermarking strategy and be prepared for steganographic embedding in transport/at-rest logs.
- **Environment-variable-based secrets**: signing keys and sensitive tokens must be injected by env vars (no inline secrets).
- **Explicit error handling**: every API path must return clear, deterministic errors (e.g., 403/423 for lockout).

### 2.2 Performance Constraints
- **Latency budgets**: status retrieval and authority checks should be constant-time or indexed lookup patterns.
- **Async ledger anchoring**: non-blocking anchoring with clear status tracking.

### 2.3 Energy/Carbon Constraints
- **Carbon-aware scheduling**: deferred anchoring jobs should be schedulable to low-carbon windows (configurable); plan for a “deferred anchor” queue.

---

## 3) “8 Failure Modes” Anticipatory Reflection (DPPM)

1. **Post Request**: malformed payloads (missing ai_id, subject, avg_score) should be rejected deterministically.
2. **Deliver Request**: authorization failures for domain APIs (e.g., trading) must be explicit and logged.
3. **Validate Request**: training lockout check may be bypassed if not centralized; ensure it is a mandatory gate.
4. **Update Server State**: concurrent training enrollments could cause conflicting `status` updates.
5. **Post Reply**: credential issuance responses may leak sensitive metadata if not properly scrubbed.
6. **Deliver Reply**: client may not receive ledger anchor outcome due to async; require a pollable status.
7. **Validate Reply**: verify API response consistency (status/cert history fields).
8. **Update Client State**: client may proceed despite lockout; enforce server-side veto and clear remediation steps.

---

## 4) Technical Specification (Requirements, User Stories, Acceptance Criteria)

### 4.1 Core Requirements
- **Modular architecture** with two primary components:
  - `EternaAI_Core`: profile state management, training lifecycle.
  - `Credentialing_Engine`: credential issuance and ledger anchoring.
- **Training lockout enforcement**:
  - If `status == in_training`, **veto** domain actions (e.g., trading) with **423 Locked** or **403 Forbidden**.
- **Verifiable credentialing**:
  - Synchronous issuance function generating a cryptographic proof (JWT payload stub acceptable).
  - Asynchronous ledger anchoring placeholder that records credential hash to DAG.
- **Authority gate**:
  - Synchronous `check_agent_authority(ai_id, required_domain)` required before any domain API.
- **Persistence compatibility**:
  - PostgreSQL schema placeholders for AI↔user linkage, training status, credential history, anchor status.
- **API status endpoint**:
  - `GET /api/cert/status/{ai_id}` returns training status, course details, time left, and certification history.

### 4.2 User Stories
- **US-1**: As a platform admin, I want to ensure AIs in training cannot execute restricted actions.
- **US-2**: As an auditor, I want verifiable credentials with a ledger anchor to prove completion.
- **US-3**: As a domain owner (e.g., finance/legal), I want a mandatory authority gate before any domain action.

### 4.3 Acceptance Criteria
- **AC-1**: AIs in `in_training` status are blocked from domain actions with 423 or 403.
- **AC-2**: `GET /api/cert/status/{ai_id}` returns training status, course, duration left, and credential history.
- **AC-3**: Credential issuance returns a signed payload stub and triggers an async ledger anchor placeholder.
- **AC-4**: `check_agent_authority` denies access without a matching credential.
- **AC-5**: All models include `startTime` and `trainingEnds` for audit logging.

---

## 5) Architecture Decision Records (ADRs)

### ADR-001: FastAPI for Core Service
- **Decision**: Use FastAPI for asynchronous API structure.
- **Rationale**: Async support and clear type modeling for stateful operations.
- **Alternatives**: Flask (lacks native async), Django (heavier).  

### ADR-002: EternaAI_Core / Credentialing_Engine Split
- **Decision**: Separate state management from credentialing.
- **Rationale**: Enables isolated governance and audit controls for credentialing.

### ADR-003: DAG-based Anchor Placeholder (ChainLynX)
- **Decision**: Use a ChainLynX DAG anchor placeholder.
- **Rationale**: Provides tamper-proof verification primitives and aligns with long-term ledger roadmap.

### ADR-004: Authority Gate as Mandatory Synchronous Check
- **Decision**: Enforce synchronous `check_agent_authority` before any domain-specific action.
- **Rationale**: Guarantees immediate veto and simplifies audit controls.

---

## 6) Risk & Tradeoff Analysis (Devil’s Advocate)

- **Ledger anchoring latency**: Async anchor may delay verifiability. Mitigation: allow status polling + anchor confirmations.
- **Training lockout edge cases**: Race conditions on status transitions. Mitigation: transactional updates and centralized gate.
- **Credential misuse**: Stubs or mis-issued credentials could bypass gates. Mitigation: include issuance audit trail and revocation list.
- **DAG scalability**: High-frequency anchors may cause throughput bottlenecks. Mitigation: batching anchors and carbon-aware scheduling.

---

## 7) Governance Anchors (Human Oversight)

1. **Credential issuance policy review**: Human sign-off required for new credential types.
2. **Authority mapping changes**: Human review for any domain-to-credential mapping updates.
3. **Ledger anchor policy**: Human sign-off for anchor scheduling, batching, and revocation logic.

---

## 8) API Contracts (Spec-level, No Implementation)

### 8.1 Lifecycle Status
- **GET** `/api/cert/status/{ai_id}`
  - Response fields: `status`, `course`, `duration_left`, `startTime`, `trainingEnds`, `certifications[]`.

### 8.2 Domain Action Stub
- **POST** `/api/trade/execute`
  - **Precondition**: `check_agent_authority(ai_id, 'FinancialTrading')` must pass.
  - **Lockout**: if `status == in_training`, return **423 Locked** or **403 Forbidden**.

---

## 9) Data Model Requirements (PostgreSQL-Compatible)

### 9.1 AI Agent
- `ai_id` (PK), `user_id` (FK), `status`, `course`, `startTime`, `trainingEnds`.

### 9.2 Credential
- `credential_id` (PK), `ai_id` (FK), `subject`, `issued_at`, `credential_hash`, `anchor_status`.

### 9.3 Audit Log
- `event_id` (PK), `ai_id` (FK), `event_type`, `timestamp`, `metadata`.

---

## 10) Quality Assurance Plan (Spec-level)

### 10.1 Example Usage (Spec)
- Enroll AI into training; status changes to `in_training` with `startTime` and `trainingEnds`.
- Attempt domain action → **vetoed** with 423/403.
- On completion, issue verifiable credential; anchor hash to DAG; update status.

### 10.2 Test Cases (Spec-level)
1. **Lockout VETO**: AI in training tries `/api/trade/execute` → expect 423/403.
2. **Authority Gate Denial**: AI lacks required credential → expect 403.
3. **Credential Issuance Success**: Credential created and anchor placeholder triggered; status reflects issuance.

---

## 11) Brand Compliance & Tokens
- Use **Ruby Red** (#9B111E), **Yellow Gold** (#FFD700), **Emerald** (#50C878) in UI or dashboard visuals.

---

## 12) Gitflow & Implementation Guidance

### 12.1 Branch Suggestion
- **Format**: `{layer}/{hub}/{module}/{tag}`
- **Suggested branch**: `api/credentiallinc/engine/feature`

### 12.2 Code Integrity Mandates
- Use **environment variables** for secrets.
- **Explicit error handling** is required for all endpoints.
- **Steganographic watermarking** must be integrated into credential payload handling/logs.

---

## 13) Merge Phase (DPPM)

- Combine lifecycle enforcement + credentialing into a single service surface, but preserve module isolation.
- Require authority gate to be invoked before all domain endpoints.
- Ensure the ledger anchor is async and carbon-aware.

---

**End of Spec**
