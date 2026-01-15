# CredentialLinc Engine v1.0 — Governance Specification (Architectural Only)

> **Role boundary:** This document is a governance-layer specification that dictates *how* and *why* the CredentialLinc Engine should be designed. It **does not** contain production-ready code. Downstream engineering agents must implement the system based on this spec.

## 0) Task Intake & Signal Synthesis

**TASK:** `[INSERT LINEAR ISSUE OR NOTEBOOKLM SUMMARY HERE]` (not provided in current request).

### Required Signals (missing inputs must be supplied before implementation)
- **NotebookLM Summaries:** *Missing.* Needed to align with current tech trends (e.g., MIT robotics research, carbon-aware scheduling).
- **Linear Issues:** *Missing.* Needed to define the business intent signal and acceptance scope.
- **Amplitude Insights:** *Missing.* Needed to prioritize flows by observed behavior and impact.
- **Postman Schemas:** *Missing.* Needed to lock API contracts for `/api/cert/status/{ai_id}`, `/api/trade/execute`, `/api/legal/draft`, etc.

> **Action Required:** Provide these four inputs to finalize the spec. In absence, this spec defines provisional interface boundaries and policy constraints only.

---

# 1) Technical Specification

## 1.1 Overview
The CredentialLinc Engine manages the lifecycle of AI agents (PersonaLynX/DigiFriend) by enforcing a **Training Lockout Period** and issuing **Cryptographically Verifiable Certifications** that can be anchored to a secure ledger (ChainLynX DAG). This specification defines modular components, synchronous governance checks, and required data models for auditability.

## 1.2 Non‑Functional Constraints (DPPM: Constraint Generation)
- **Security:**
  - Mandatory **steganographic encryption** guidelines for payload watermarking in credential data paths (implementation defined).
  - All secrets via **environment variables** (no hard-coded secrets).
  - Explicit error handling; no silent failures.
- **Performance:**
  - **Latency budget:** ≤ 200ms p95 for authority checks and lockout decisions.
  - **Throughput target:** 200 RPS per service instance for status retrieval.
- **Energy Efficiency:**
  - **Carbon-aware scheduling** for non-urgent DAG anchoring tasks (batch/low-carbon window).

## 1.3 Decomposition (DPPM: Decompose)
1. **Identity & Lifecycle Shard**
   - State machine for `status` transitions (`idle → in_training → certified`).
   - Training lockout policy enforcement.
2. **Credentialing Shard**
   - Verifiable credential issuance (JWT payload stub) and hash creation.
   - Async DAG anchor placeholder.
3. **Authority Gate (Governance Shard)**
   - Synchronous check for domain access against credential registry.
4. **Persistence Shard**
   - PostgreSQL-compatible schema placeholders for AI profiles, trainings, and certifications.

## 1.4 User Stories
- **US-1 (Lifecycle Enforcement):** As a governance layer, I must lock AI agents out of core functions while they are in training.
- **US-2 (Credentialing):** As a compliance auditor, I need cryptographically verifiable credentials tied to AI IDs and subjects.
- **US-3 (Authority Gate):** As a domain controller, I must veto domain requests if the AI lacks the required credential.
- **US-4 (Status Observability):** As an operator, I must query a single endpoint for training status and certification history.

## 1.5 Acceptance Criteria
- **AC-1:** When `status == in_training`, any request to a protected core function (e.g., `/api/trade/execute`) is vetoed with `423 Locked` (or `403 Forbidden`).
- **AC-2:** `/api/cert/status/{ai_id}` returns current training state, course, remaining duration, and certification history.
- **AC-3:** `issue_verifiable_credential(ai_id, subject, avg_score)` synchronously returns a signed-ish payload stub (JWT-like) with issue date, AI ID, and subject.
- **AC-4:** `anchor_cert_to_dag(credential_hash)` runs asynchronously and logs a placeholder “anchored” event.
- **AC-5:** `check_agent_authority(ai_id, required_domain)` vetoes any domain access if the required credential is missing.
- **AC-6:** Data models include `startTime` and `trainingEnds` fields.

## 1.6 Interface Contracts (Provisional, pending Postman schemas)

### GET `/api/cert/status/{ai_id}`
**Response (200):**
```json
{
  "ai_id": "string",
  "status": "idle | in_training | certified",
  "course": "string | null",
  "startTime": "ISO-8601 | null",
  "trainingEnds": "ISO-8601 | null",
  "durationLeftSeconds": 1234,
  "certificationHistory": [
    {
      "subject": "string",
      "issuedAt": "ISO-8601",
      "credentialHash": "hex-string"
    }
  ]
}
```

### POST `/api/trade/execute` (Protected)
**Policy:** If `status == in_training`, return `423 Locked` (or `403 Forbidden`).

### POST `/api/legal/draft` (Protected)
**Policy:** Must call `check_agent_authority(ai_id, required_domain="Paralegal")`; veto if missing.

---

# 2) Architecture Decision Records (ADRs)

## ADR-001: Modular FastAPI Service with Governance Gate
- **Decision:** Use a modular FastAPI architecture with explicit `EternaAI_Core` (state) and `Credentialing_Engine` (certification) components, plus a strict `Authority Gate`.
- **Why:** Separates lifecycle management from credential issuance and access control; supports auditability and independent scaling.
- **Alternatives Considered:** Monolith without modular boundaries (rejected due to governance risk and audit complexity).

## ADR-002: JWT-like Credential Payload + DAG Anchor Stub
- **Decision:** Use a JWT-like payload stub for credentials and a placeholder asynchronous `anchor_cert_to_dag` for DAG anchoring.
- **Why:** Preserves cryptographic verification semantics without locking into a specific ledger implementation at spec stage.
- **Alternatives Considered:** Direct blockchain writes for every issuance (rejected due to latency and energy constraints).

## ADR-003: Lockout Veto via HTTP 423/403
- **Decision:** Use HTTP `423 Locked` (preferred) or `403 Forbidden` to enforce training lockout.
- **Why:** Communicates governance-level restriction to callers; integrates cleanly with gateway policies.
- **Alternatives Considered:** 409 Conflict (rejected as semantically weaker).

---

# 3) Risk & Tradeoff Analysis (Devil’s Advocate)

## 3.1 Tradeoffs
- **JWT Stub vs. Full PKI:** Stub is fast but weak without PKI. Requires later cryptographic hardening.
- **Async DAG Anchor:** Improves latency but introduces eventual consistency; clients may see a delay in anchor confirmation.
- **Centralized Authority Check:** Simplifies governance but introduces a single policy point; requires strong availability.

## 3.2 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** Malformed request omits `ai_id` or subject.
2. **Deliver Request:** Network partition drops credential issuance request.
3. **Validate Request:** Authority gate validation fails due to stale credential cache.
4. **Update Server State:** Training status update fails mid-transaction, leaving `status` inconsistent.
5. **Post Reply:** Response payload omits `credentialHash` or issue date.
6. **Deliver Reply:** Client never receives lockout denial; retries cause duplicate audit noise.
7. **Validate Reply:** Client ignores `423` and proceeds locally.
8. **Update Client State:** UI fails to reflect training lockout or certification issuance.

---

# 4) Governance Anchors (Human Oversight)

1. **Credential Subject Registration:** Human approval required for new certification subjects (e.g., “Paralegal”, “Financial Trader”).
2. **Lockout Policy Overrides:** Any override or bypass of training lockout requires human sign-off.
3. **Ledger Anchor Finalization:** Human validation required before swapping the DAG stub for production anchoring.
4. **Security Compliance Review:** Human audit of steganographic watermarking approach and key management strategy.

---

# 5) Implementation Guidance (Non‑Code)

## 5.1 Data Models (Conceptual)
- **AIProfile**
  - `ai_id`, `status`, `course`, `startTime`, `trainingEnds`
- **Certification**
  - `ai_id`, `subject`, `issuedAt`, `avg_score`, `credentialHash`
- **AuditLog**
  - `eventType`, `timestamp`, `ai_id`, `details`

## 5.2 Governance Functions (Contracts)
- `check_agent_authority(ai_id, required_domain)` → **VETO** if credential missing.
- `issue_verifiable_credential(ai_id, subject, avg_score)` → returns JWT-like payload + `credentialHash`.
- `anchor_cert_to_dag(credential_hash)` → async placeholder logging DAG anchor intent.

## 5.3 Example Usage (Narrative)
- **Scenario A:** AI enters training (`status = in_training`), then attempts `/api/trade/execute`. The request is vetoed with `423 Locked`.
- **Scenario B:** AI completes training, `issue_verifiable_credential` returns a credential payload and hash, then the hash is asynchronously anchored.
- **Scenario C:** AI attempts `/api/legal/draft` without “Paralegal” credential; `check_agent_authority` vetoes.

## 5.4 Test Case Guidance (Non‑Executable)
1. **Lockout Veto:** Ensure core endpoint returns `423` when `status == in_training`.
2. **Authority Gate Veto:** Ensure `check_agent_authority` denies access for missing credential.
3. **Credential Issuance:** Ensure `issue_verifiable_credential` returns payload with AI ID, subject, issue date, and non-empty hash.

---

# 6) Gitflow & Brand Compliance

- **Branch naming suggestion:** `governance/core/credentiallinc/feature`
  - Format: `{layer}/{hub}/{module}/{tag}` with allowed tags: **feature**, **date**, **time**.
- **Brand tokens:** enforce use of
  - Ruby Red `#9B111E`
  - Yellow Gold `#FFD700`
  - Emerald `#50C878`
- **Code Integrity:**
  - Secrets via environment variables only.
  - Explicit error handling.
  - Steganographic watermarking required for credential payloads (implementation detail TBD).

---

# 7) Open Questions
1. Provide **NotebookLM Summaries** to validate technology direction.
2. Provide **Linear Issue** for acceptance scope and priority.
3. Provide **Amplitude Insights** to prioritize endpoints and flows.
4. Provide **Postman Schemas** to lock API contracts.
