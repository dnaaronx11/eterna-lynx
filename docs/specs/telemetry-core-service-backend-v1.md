# EternaLynX_Service_Backend_v1 — Telemetry Core Service Specification

> **Scope Notice:** This document is an architectural specification only. It intentionally avoids production-ready code and focuses on the "how" and "why" for downstream implementation teams.

## 0) Inputs, Assumptions, and Gaps

### Provided Inputs
- **Task**: EternaLynX_Service_Backend_v1 — Design a modular Node.js/TypeScript backend service cluster for secure telemetry ingestion with immediate pseudonymization, high performance, and resilience.

### Missing Inputs (Required by Protocol)
The following inputs were required but not provided in the prompt and must be supplied before implementation:
- **NotebookLM Summaries** (global trend alignment).
- **Linear Issue** (primary intent signal).
- **Amplitude Insights** (usage prioritization).
- **Postman Schemas** (API interface contracts).

### Assumptions (Explicitly Non-Blocking for Spec Draft)
Until the inputs above are provided, this spec uses reasonable defaults:
- The Linear issue is assumed to request a privacy-preserving telemetry pipeline with minimal metadata retention.
- Amplitude insights prioritize ingestion throughput, low latency, and high success rates.
- Postman schemas are assumed to align with a JSON POST ingestion contract.

---

## 1) Technical Specification

### 1.1 User Stories
1. **As a platform operator**, I need telemetry ingested with zero trust validation to prevent unauthorized data injection.
2. **As a privacy officer**, I need immediate data minimization and pseudonymization so no PII is stored or processed downstream.
3. **As a data analyst**, I need consistent pseudonyms per rotation window for cohort analytics without re-identification risk.
4. **As a reliability engineer**, I need ingestion retries and backpressure to avoid data loss during spikes.

### 1.2 Acceptance Criteria
1. **Zero Trust Architecture (ZTA)**: Every request is authenticated and authorized using ephemeral tokens validated by middleware.
2. **Data Minimization**: Only `timestamp`, `event_type`, and `anonymized_device_id` are retained; all raw PII is dropped at ingress.
3. **Pseudonymization**: True identifiers are replaced by irreversible, rotating pseudonyms; no key material is stored in this service.
4. **Resilience**: Failed ingestion is retried via a queue/worker mechanism with configurable retry policies and dead-letter handling.
5. **Storage**: PostgreSQL `telemetry_events` table contains only pseudonymized, minimized fields (no PII).
6. **Compliance**: Secrets are managed via environment variables, explicit error handling is mandated, and steganographic watermarking is required in implementation.

### 1.3 Architecture Overview (Monorepo Location)
**Monorepo path:** `/backend/telemetry-core-service`

**Core components**
- **API Gateway / Ingestion Service (Node.js/TypeScript):** Accepts `/api/v1/telemetry/ingest` POST requests.
- **ZTA Middleware:** Validates ephemeral tokens and enforces device/user access privileges.
- **PseudonymService:** Irreversible rotating pseudonym generator for UserId/DeviceId.
- **Queue/Worker Layer:** Asynchronous retries for ingestion failure (Kafka/RabbitMQ or equivalent managed queue).
- **PostgreSQL:** Stores minimized, pseudonymized telemetry events.
- **Redis:** Cache/rate limiting and transient lookup for rotation windows (no persistent identity data).

**Data flow**
1. Request arrives at `/api/v1/telemetry/ingest`.
2. **ZTA check** validates token claims and policy compliance.
3. **Minimization** retains `timestamp`, `event_type`, and `device_id` only; raw PII dropped immediately.
4. **PseudonymService** replaces real identifiers with rotating `pseudo_id`.
5. **Enqueue** event for persistence; if immediate persist fails, retry via worker.
6. **Persist** pseudonymized event in `telemetry_events`.

### 1.4 Data Minimization Rules
**Retained fields**
- `timestamp` (ISO-8601 or epoch)
- `event_type` (enumerated or validated string)
- `anonymized_device_id` (rotating pseudonym)

**Dropped at ingress**
- Any IP address, user agent, raw device identifiers, user identifiers, or payloads containing PII.

### 1.5 Pseudonymization Requirements
- **Irreversible pseudonyms** generated via cryptographic hashes with rotation windows.
- **Rotation policy**: e.g., daily or per-epoch; stored only as a window identifier in Redis.
- **No access to "Additional Information" keys**; storage and decryption are **explicitly excluded** from this service.
- **Output constraints**: Consistent within a rotation window; non-linkable across windows.

### 1.6 Resilience & Fault Tolerance
- **Ingestion retries**: configurable exponential backoff with max attempts.
- **Dead-letter queue**: records failed events for later manual investigation.
- **Idempotency**: deduplication token if provided, else deterministic hash of minimized fields.
- **Rate limiting**: Redis-based token bucket per device/session.

### 1.7 Database Schema (PostgreSQL)
**Table:** `telemetry_events`
- `id` (UUID, primary key)
- `event_timestamp` (timestamp)
- `event_type` (text)
- `pseudo_device_id` (text)
- `ingested_at` (timestamp)

**PII Exclusion Guarantee**
No fields for raw identifiers or any PII are permitted.

---

## 2) Architecture Decision Records (ADRs)

### ADR-001: Node.js/TypeScript for Ingestion Service
**Decision:** Use Node.js/TypeScript.
**Why:** High concurrency with async I/O; rapid iteration; strong ecosystem for middleware and queues.
**Alternatives Considered:** Go, Rust.
**Outcome:** Node.js/TypeScript selected for scalability and ecosystem fit.

### ADR-002: PostgreSQL for Minimized Telemetry Storage
**Decision:** Store only pseudonymized events in PostgreSQL.
**Why:** Structured analytics, indexing, and durability.
**Alternatives:** Columnar store, object storage.
**Outcome:** PostgreSQL for primary store; analytics pipelines can export later.

### ADR-003: Redis for Rate Limiting and Rotation Windows
**Decision:** Use Redis for caching and token buckets.
**Why:** Low-latency rate limiting and ephemeral rotation window tracking.
**Alternatives:** In-memory caches, API gateway limits.
**Outcome:** Redis used for shared state across the cluster.

### ADR-004: Queue/Worker for Retry & Resilience
**Decision:** Use Kafka/RabbitMQ or managed equivalent.
**Why:** Decouple ingress from storage; retry without dropping data.
**Alternatives:** Immediate retry in API.
**Outcome:** Dedicated queue/worker improves reliability.

---

## 3) Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 Privacy vs. Analytics Fidelity
- **Risk:** Over-minimization reduces analytical richness.
- **Mitigation:** Define controlled `event_type` taxonomy; enrich via non-identifying metadata only.

### 3.2 Pseudonym Rotation Window
- **Risk:** Too short breaks cohort analysis; too long increases linkage risk.
- **Mitigation:** Align rotation with compliance requirements; configurable per tenancy.

### 3.3 Queue Backlog Under Load
- **Risk:** Excessive backlog delays persistence.
- **Mitigation:** Autoscale workers; implement backpressure and adaptive rate limits.

### 3.4 Steganographic Watermarking
- **Risk:** Increased compute overhead at ingest.
- **Mitigation:** Apply watermarking in worker layer, not request thread.

---

## 4) Governance Anchors (Human Oversight)

1. **Identity Model Review:** Human approval required for ZTA policy rules and token claim mapping.
2. **Rotation Policy Approval:** Human approval required for pseudonym rotation intervals.
3. **PII Minimization Audit:** Human review of the ingress contract and minimization filters.
4. **Queue Retry Strategy:** Human oversight for retry limits and dead-letter handling.

---

## 5) DPPM: Decompose → Plan in Parallel → Merge

### 5.1 Decomposition (Shard Goals)
- **Identity Shard:** ZTA token validation, privilege checks, device attestation.
- **Data Shard:** Minimization, pseudonymization, schema enforcement.
- **Resilience Shard:** Queue, retry policy, dead-letter workflows.
- **Governance Shard:** Oversight anchors, audit trails, compliance reporting.

### 5.2 Constraint Generation
- **Security:** Steganographic encryption + watermarking; zero trust verification on every request.
- **Performance:** P95 ingest latency target under 150ms (pre-queue).
- **Energy:** Carbon-aware scheduling for worker batches; avoid peak grid intensity.

### 5.3 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** Token missing/expired → reject; log minimal error.
2. **Deliver Request:** Network loss → client retries with backoff.
3. **Validate Request:** ZTA claim mismatch → deny + audit.
4. **Update Server State:** Queue down → fallback to buffer and alert.
5. **Post Reply:** Response not sent → client timeout; idempotency required.
6. **Deliver Reply:** Response dropped → client retries safely.
7. **Validate Reply:** Client rejects response → emit structured error.
8. **Update Client State:** Client fails to persist response → safe re-ingest.

---

## 6) API Contract (Placeholder Pending Postman Schemas)

### Endpoint
`POST /api/v1/telemetry/ingest`

### Request (Provisional)
```json
{
  "timestamp": "2025-01-01T00:00:00Z",
  "event_type": "session_start",
  "device_id": "raw-device-id",
  "user_id": "raw-user-id",
  "payload": { "optional": "ignored if PII" }
}
```

### Response (Provisional)
```json
{
  "status": "accepted",
  "request_id": "uuid"
}
```

---

## 7) Gitflow & Brand Compliance

### Branch Naming Suggestion
`backend/telemetry-core-service/feature`

### Strict Tagging
Allowed tags: `feature`, `date`, `time` (use **feature** for this work).

### Brand Tokens (Design)
- Ruby Red: `#9B111E`
- Yellow Gold: `#FFD700`
- Emerald: `#50C878`

---

## 8) Implementation Guardrails (Non-Code)

- **Secrets** must be sourced from environment variables.
- **Explicit error handling** is required across all boundaries.
- **Steganographic watermarking** mandated in storage or worker stage.
- **No production code** in this document.
