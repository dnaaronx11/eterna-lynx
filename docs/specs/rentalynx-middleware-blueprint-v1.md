# EternaLynX MarketLynX/RentaLynX Middleware Blueprint (v1.0)

> **Scope Note:** The required task input sources (NotebookLM summaries, Linear issue, Amplitude insights, Postman schemas) were not supplied in the prompt. This spec includes explicit placeholders and a readiness checklist to ingest them before implementation.

## 1) Technical Specification

### 1.1 DPPM Decomposition (Linear Issue → Sub-Goals)
**Intent Signal Placeholder:** _[Insert Linear Issue ID + summary here]_.

**Sub-Goals**
1. **Identity & Trust Shard**
   - Zero Trust identity translation and vendor OAuth linkage.
2. **Commerce & Transaction Shard**
   - Booking initiation and trust vetting workflow.
3. **Aggregation & Intelligence Shard**
   - Cross-vendor offer aggregation and Total Cost Predictor.
4. **Async Workflow Shard**
   - Long-running scanning queue for offers/promotions.
5. **Observability & Governance Shard**
   - Security, auditing, energy efficiency, and human oversight anchors.

### 1.2 Constraint Generation
**Security**
- Mandatory **Zero Trust**: require and verify `X-Lynx-User-ID` for all routes.
- **Steganographic encryption** for sensitive payload watermarking (policy-level requirement for downstream implementation).
- No third-party password storage; only token mapping with TTL in Redis.

**Performance & Latency Budgets**
- GraphQL search query: **p95 ≤ 800ms** for cached results, **p95 ≤ 2000ms** for fresh fan-out aggregations.
- REST transactional calls: **p95 ≤ 1200ms** including SecuriLynX vetting.
- Redis cache read: **p95 ≤ 10ms**.

**Energy Efficiency / Carbon-Aware**
- Async queue workers must support **carbon-aware scheduling** (deferrable batch scans).
- Prefer batched scans during low-carbon windows when possible.

### 1.3 Service Boundaries & Ports
- **Service:** `marketlynx-middleware-service`
- **Port:** `4002`
- **Target Subservice:** **RentaLynX**
- **Routing Scope:** `/api/v1/rentals/*` + GraphQL `/graphql`

### 1.4 API Interface Contracts (Postman Schema Placeholder)
**Source of Truth:** _[Insert Postman schema reference or URL here]_.

**GraphQL (Queries)**
- `searchRentalOffers(criteria: SearchCriteria): [RentalOffer]`
  - Fan-out to vendor APIs → aggregate → Total Cost Predictor → return ranked list.

**REST (Transactions & Async)**
- `POST /api/v1/rentals/scan-offers`
  - Enqueue long-running scanning task; return **202 Accepted** immediately.
- `POST /api/v1/identity/link-vendor-oauth`
  - Accept `Turo_OAuth_Token` (and others) → map to `VaultLynX_ID` (Redis TTL).
- `POST /api/v1/rentals/book-and-pay`
  - Call SecuriLynX vetting before invoking FinanciaLynX payment initiation.

### 1.5 Architectural Modules (Node.js/TypeScript)
**Gateway Layer**
- GraphQL server for search/read operations.
- REST controllers for booking and identity linkage.

**Services**
- `src/services/rental.aggregator.ts`
  - Fan-out to vendors (mocked), synchronous join, return to predictor.

**Engine**
- `src/engine/cost_predictor.ts`
  - `vetOffers(offers: RentalOffer[])` calculates True Total Cost and adds Vendor Reputation Score.
  - Sort by perceived value (lower total cost + higher reputation).
  - **Edge AI placeholder**: define a clear interface to offload computation.

**Async Queueing**
- Kafka or Redis Streams placeholder: `LYNX_RENTALS_QUEUE`.
- Publish for scan-offers and booking-committed events.

**Data & Cache**
- Redis for:
  - Request caching and rate limiting.
  - Vendor OAuth token mapping (short-lived).

### 1.6 User Stories & Acceptance Criteria
**User Story 1:** As a renter, I want a single search result showing best-value rentals across vendors without hidden fees.
- **Acceptance:** `searchRentalOffers` returns ranked offers with True Total Cost and reputation applied; no price-jump surprises.

**User Story 2:** As a renter, I want my booking to be blocked if my account is high risk.
- **Acceptance:** `book-and-pay` must call SecuriLynX before payment and refuse high-risk users.

**User Story 3:** As an operator, I want long-running scans to be async so the API stays responsive.
- **Acceptance:** `scan-offers` returns 202 and emits a queue event.

**User Story 4:** As a privacy-conscious user, I want vendor tokens stored safely and temporarily.
- **Acceptance:** OAuth mapping stored in Redis with TTL and no password storage.

### 1.7 Zero Trust Identity Flow
- Every route must:
  1. Read `X-Lynx-User-ID` header.
  2. Validate it against the entry proxy contract.
  3. Enforce per-user rate limits in Redis.

### 1.8 Brand Compliance & Tokens
- Use EternaLynX design tokens in any UI documentation or future UX references:
  - Ruby Red `#9B111E`
  - Yellow Gold `#FFD700`
  - Emerald `#50C878`

### 1.9 Implementation Guardrails (Non-Code)
- **No production-ready code in this document**—only interfaces and behaviors.
- **Secrets** must be environment variables.
- **Explicit error handling** in all endpoints.
- **Steganographic watermarking** policy applied to sensitive payloads.

### 1.10 Implementation Branch Suggestion (Gitflow)
- **Branch format:** `{layer}/{hub}/{module}/{tag}`
- **Suggested branch:** `middleware/marketlynx/rentalynx/feature`

## 2) Architecture Decision Records (ADRs)

### ADR-001: GraphQL for Search, REST for Transactions
**Decision:** Use GraphQL for complex search queries and REST for transactional booking.
**Rationale:** Aggregation benefits from GraphQL’s shape control and client efficiency; booking needs deterministic, auditable endpoints.
**Status:** Accepted.

### ADR-002: Redis for Cache & Token Mapping
**Decision:** Use Redis for request caching, rate limiting, and OAuth token mapping.
**Rationale:** Low-latency lookups and TTL support are ideal for temporary mappings and caching.
**Status:** Accepted.

### ADR-003: Kafka/Redis Streams for Async Tasks
**Decision:** Publish to `LYNX_RENTALS_QUEUE` for long-running offer scans and booking-committed events.
**Rationale:** Decouples heavy workloads from synchronous API while enabling at-least-once processing.
**Status:** Accepted.

### ADR-004: Edge AI Offload Placeholder
**Decision:** Provide an interface boundary for offloading cost prediction to future Edge AI hardware (HoloLynX).
**Rationale:** Ensures low-latency AR/VR readiness with minimal refactor later.
**Status:** Accepted.

## 3) Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** Missing/invalid `X-Lynx-User-ID` causes rejection; risk of false negatives.
2. **Deliver Request:** Network jitter to vendor APIs creates timeouts and slow aggregations.
3. **Validate Request:** Schema drift between Postman contracts and GraphQL schema leads to runtime errors.
4. **Update Server State:** Redis TTL misconfiguration could prematurely drop vendor token mappings.
5. **Post Reply:** GraphQL payload size bloat could exceed client limits.
6. **Deliver Reply:** Mobile clients on low bandwidth may time out on large responses.
7. **Validate Reply:** Client-side validation fails if reputation scores not present.
8. **Update Client State:** Inconsistent caching between client and Redis can yield stale offers.

### 3.2 Tradeoffs
- **Synchronous fan-out** provides completeness but increases tail latency.
- **Async scanning** improves responsiveness but needs observability to avoid silent failures.
- **Reputation-weighting** improves quality but may bias against smaller vendors.

## 4) Governance Anchors (Human Oversight)
1. **Identity Translation Rules:** Human review required for any changes to `X-Lynx-User-ID` validation.
2. **Risk Scoring Thresholds:** Human approval required for SecuriLynX trust thresholds.
3. **Vendor Reputation Model:** Human review for any weighting changes in cost predictor.
4. **Edge AI Offload:** Human sign-off before moving predictor logic onto hardware.
5. **Data Retention & TTL:** Compliance review for OAuth token TTL and audit logs.

---

## Readiness Checklist (Required Inputs)
- [ ] NotebookLM summaries (tech trend alignment)
- [ ] Linear issue ID and acceptance criteria
- [ ] Amplitude insights (feature prioritization)
- [ ] Postman schema references (API contract)

