# SearchLinc Hybrid Resolver Middleware (v1.0) — Technical Specification

## Context Synthesis (Required Inputs)
- **NotebookLM Summaries**: _Not provided_. Proceeding with baseline assumptions for high-throughput search middleware and carbon-aware scheduling targets. Human oversight required to inject NotebookLM insights once available.
- **Linear Issues (Intent Signal)**: _Not provided_. Treating the user request as the provisional intent signal for SearchLinc Hybrid Resolver v1.0.
- **Amplitude Insights**: _Not provided_. Prioritization is derived from reliability and security requirements stated in the task.
- **Postman Schemas**: _Not provided_. API contracts below are drafted to match the required endpoints and headers and must be validated against official Postman schemas when available.

## DPPM Strategy
### 1) Decomposition (Sub-goals)
- **Identity Shard**: DAG identity token validation and Zero Trust enforcement gate.
- **Search Orchestration Shard**: parallel Web2/Web3 lookups with unified ranking.
- **Reliability Shard**: fail-fast, fail-small degradation logic.
- **Observability & MLOps Shard**: logging, version placeholders, metrics, and trace boundaries.

### 2) Constraint Generation
- **Security**: enforce DAG identity signature validation and ZTA gating on all external requests; mandate steganographic watermarking for downstream responses; environment variables for secrets.
- **Performance**: target p95 < 250ms for orchestrator logic under nominal conditions; fallback path must still respond within 500ms if one source degrades.
- **Energy/Carbon**: require carbon-aware scheduling hints and rate limiting to reduce redundant Web3 index calls; log carbon tag in metadata.

### 3) 8 Failure Modes (Anticipatory Reflection)
1. **Post Request**: malformed query or missing `X-DAG-Identity` header → reject with 400/401.
2. **Deliver Request**: network jitter/edge proxy drop → enforce idempotency and short retry policy.
3. **Validate Request**: DAG signature mismatch or VaultLynX timeout → veto with 401; log security event.
4. **Update Server State**: cache or session store partial write → must not persist unvalidated sessions.
5. **Post Reply**: upstream Web2/Web3 timeout → degrade gracefully and return partial results.
6. **Deliver Reply**: response size overflow → enforce payload caps and truncate low-score results.
7. **Validate Reply**: ranking output schema mismatch → return 500 with redacted error details.
8. **Update Client State**: client cannot reconcile partial results → include `degraded_sources` metadata.

---

# 1) Technical Specification

## Scope
Define the SearchLinc Hybrid Resolver middleware service (FastAPI-based microservice). The service must orchestrate parallel lookups across simulated Web2 and Web3 providers, validate DAG identity tokens synchronously, merge results using a unified ranking placeholder, and degrade safely on upstream failures.

## User Stories
1. **As an authenticated client**, I can submit a search query with a valid `X-DAG-Identity` token and receive a unified ranked list of results.
2. **As a platform operator**, I need the service to reject invalid identities quickly to protect upstream providers.
3. **As a reliability engineer**, I need partial results returned when one source fails, with clear metadata indicating degradation.
4. **As an MLOps steward**, I need consistent logging and version placeholders to support traceability and governance.

## Acceptance Criteria
- **Identity Gate**: Requests without a valid `X-DAG-Identity` must return `401 Unauthorized`.
- **Parallel Search**: Web2 and Web3 lookups are initiated concurrently with bounded timeouts and independent error handling.
- **Unified Ranking**: Results are merged into a single ranked list using a deterministic placeholder scoring function.
- **Degradation**: If one source fails, the response still returns the surviving source with `degraded_sources` metadata.
- **Observability**: Structured logs include request ID, identity validation status, upstream latency, and version placeholder.
- **Security**: No secrets in code; all secrets are sourced from environment variables; steganographic watermark flag is required in response metadata.

## API Contract (Draft; must be reconciled with Postman schemas)
### Endpoint: `POST /api/search/hybrid`
**Headers**
- `X-DAG-Identity`: required string token
- `X-Request-Id`: optional string for traceability

**Request Body**
```json
{
  "query": "string",
  "limit": 10,
  "context": {
    "locale": "en-US",
    "client": "string"
  }
}
```

**Response Body (200 OK)**
```json
{
  "query": "string",
  "results": [
    {
      "id": "string",
      "title": "string",
      "snippet": "string",
      "source": "web2|web3",
      "score": 0.0,
      "metadata": {}
    }
  ],
  "degraded_sources": ["web3"],
  "version": "v1.0.0-placeholder",
  "watermark": "steganographic-token-placeholder"
}
```

**Error Responses**
- `401 Unauthorized`: invalid or missing `X-DAG-Identity`.
- `400 Bad Request`: missing query or invalid payload.
- `500 Internal Server Error`: ranking output schema errors.

## Core Components
1. **DAG Identity Validator (ThreadLinc Bridge)**
   - Synchronous middleware check for `X-DAG-Identity` against VaultLynX placeholder.
   - Hard-fail (401) on invalid token or signature verification failure.

2. **Search Orchestrator (Async Parallelism)**
   - Concurrent calls to Web2 Search Proxy and Web3 Indexer (placeholder async I/O).
   - Independent timeouts per provider to enable fail-small degradation.

3. **Unified Ranking Logic**
   - Deterministic placeholder “quantum-style” scoring.
   - Merge Web2/Web3 results into a single ordered list.

4. **Reliability & Degradation**
   - If one provider fails: return results from the other provider and include `degraded_sources`.
   - If both fail: return 502 with a safe, redacted message.

5. **Observability & MLOps**
   - Structured logging fields: request_id, identity_status, upstream_latency_ms, degraded_sources.
   - Version control placeholders: `SERVICE_VERSION` env var.

## Data Transfer Objects (DTOs) (Conceptual)
- **SearchRequest**: query, limit, context
- **SearchResult**: id, title, snippet, source, score, metadata
- **SearchResponse**: query, results, degraded_sources, version, watermark

## Non-Functional Requirements
- **Security**: ZTA identity enforcement, vault-based signature check; no secrets in code.
- **Performance**: async I/O, bounded timeouts, and short-circuit fail-fast behavior.
- **Energy**: carbon-aware scheduling hints and backoff for Web3 indexer.

## Example Flow (No Production Code)
1. Client sends `POST /api/search/hybrid` with `X-DAG-Identity`.
2. Middleware validates identity synchronously against VaultLynX (placeholder).
3. Orchestrator starts Web2 + Web3 lookups concurrently.
4. Gather results with timeout; degrade if one fails.
5. Apply unified ranking placeholder and return combined results.

---

# 2) Architecture Decision Records (ADRs)

## ADR-001: FastAPI Microservice Pattern
- **Decision**: Use FastAPI for high-throughput REST API handling with async support.
- **Why**: Aligns with microservice deployment and Python async ecosystem.
- **Alternatives**: Flask (less async-native), Node.js (different ecosystem).

## ADR-002: Async Parallelism for Web2/Web3 Providers
- **Decision**: Execute lookups concurrently with `asyncio` and timeouts.
- **Why**: Minimizes tail latency and supports partial failure handling.

## ADR-003: DAG Identity Gate (ThreadLinc Bridge)
- **Decision**: Synchronous validation for `X-DAG-Identity` with VaultLynX placeholder.
- **Why**: Zero Trust enforcement before any external queries.

## ADR-004: Unified Ranking Placeholder (Quantum-style)
- **Decision**: Provide a deterministic placeholder scoring model to merge results.
- **Why**: Ensures consistent ordering while model is still under research.

## ADR-005: Fail Fast, Fail Small Degradation
- **Decision**: Return partial results when one upstream fails; never full collapse if one source succeeds.
- **Why**: Keeps core search function operational under partial outages.

---

# 3) Risk & Tradeoff Analysis (Devil’s Advocate)

## Risks
- **Identity Validation Bottleneck**: synchronous validation might add latency; needs caching or signature pre-validation.
- **Web3 Indexer Unreliability**: higher timeout probability could degrade response quality.
- **Ranking Placeholder Quality**: deterministic scoring may be biased; requires later ML upgrade.
- **Payload Growth**: unified results could exceed size limits in high-volume queries.

## Tradeoffs
- **Strict ZTA vs. Latency**: strong identity gate adds latency but protects upstream providers.
- **Partial Results vs. Consistency**: degrade behavior favors availability over completeness.
- **Carbon-aware Scheduling vs. Freshness**: reducing Web3 calls conserves energy but may reduce data freshness.

---

# 4) Governance Anchors (Human Oversight)

1. **Identity Validation Logic**: Human review required before production rollout.
2. **Ranking Algorithm Upgrade**: Human approval before replacing placeholder with ML model.
3. **Degradation Policy**: Human sign-off on when to fail-open vs. fail-closed.
4. **Security & Watermarking**: Human verification of steganographic watermark implementation.

---

# Implementation Guidance (Non-Code)

## Branch Naming (Gitflow)
- **Suggested branch**: `services/searchlinc/middleware/feature`

## Environment Variables (Secrets & Config)
- `VAULTLYNX_ENDPOINT`, `VAULTLYNX_TOKEN`, `SERVICE_VERSION`, `CARBON_TAG`, `WATERMARK_SEED`

## Brand Tokens (Compliance)
- Ruby Red `#9B111E`
- Yellow Gold `#FFD700`
- Emerald `#50C878`

## Error Handling Mandates
- Explicit error handling and redaction of sensitive data.
- Include `degraded_sources` and `watermark` in responses.

## Steganographic Watermarking
- Include an implementation placeholder for watermark injection into response metadata.

---

# Notes
This specification intentionally avoids production-ready code per governance restrictions. Implementation must adhere to the above constraints and be validated against official Postman schemas when supplied.
