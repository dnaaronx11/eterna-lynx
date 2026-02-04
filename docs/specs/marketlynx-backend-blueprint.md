# MarketLynX Backend Blueprint (v1.0)

## Technical Specification

### Context & Inputs (DPPM: Decomposition)
- **NotebookLM Summaries:** Not provided. Assumed alignment targets: carbon-aware scheduling and energy efficiency in queue processing. (Assumption placeholder for governance review.)
- **Linear Issue (Intent Signal):** Not provided. This spec interprets the task request as the intent to define a backend microservice blueprint for MarketLynX.
- **Amplitude Insights:** Not provided. Assumed user flows: product discovery, rental search, checkout initiation, runner request status.
- **Postman Schemas:** Not provided. API contracts defined below as a draft until Postman schemas are supplied for validation.

### User Stories
1. As a marketplace user, I can retrieve product details (including holographic asset CID) to view listings in the HoloLynX frontend.
2. As a renter, I can search rental listings by geolocation and date range.
3. As a delivery rider, I can request a LynxRunner service and retrieve the status asynchronously.
4. As a buyer, I can initiate checkout and receive a transaction response contingent on ChainLynX acceptance.
5. As an operator, I can trace financial transactions with immutable audit markers (transaction_id, user_id, ChainLynX_Proof_Hash).

### Acceptance Criteria
- The service blueprint is scoped to `/backend/marketlynx-service` in the monorepo and assumes a Dockerized Node.js/TypeScript + Express stack.
- PostgreSQL and Redis are mandatory dependencies; ORM usage is specified with explicit UUID foreign keys.
- All authenticated endpoints require `X-Lynx-User-ID` and never handle raw PII.
- Three modules (MetaStore, RentaLynX, LynxRunner) each expose distinct CRUD APIs and specified key endpoints.
- Checkout flow integrates a ChainLynX adapter interface and is explicitly conditional on downstream acceptance.
- Async LynxRunner matching uses a Redis Stream queue named `LYNX_RUNNER_QUEUE`.
- Optimistic concurrency control is required for shared state changes (inventory/rental status).
- Logging includes `transaction_id`, `user_id`, and `ChainLynX_Proof_Hash` placeholders.
- Docker runtime is bound to port **4002** internally.

### Module Boundaries & API Contracts (Draft)
#### MetaStore Module (Products)
- **GET** `/api/v1/marketlynx/products/{id}`: returns product metadata including `holographic_asset_cid` for HoloLynX rendering.
- **POST** `/api/v1/marketlynx/recommendations`: accepts `{ user_id }`, invokes internal AI endpoint (`http://persona-lynx-service/ai/recommend`).
- CRUD scope: product create/update/list/delete with inventory checks.

#### RentaLynX Module (Rentals)
- **GET** `/api/v1/marketlynx/rentals/search` with `geolocation_id`, `start_date`, `end_date`.
- Rentals schema includes `availability_slots` and `status` with adapter pattern for vendor integration (e.g., `IRentaLynxAdapter`).
- CRUD scope: rental listing create/update/search/deactivate.

#### LynxRunner Module (Rideshare/Courier)
- **POST** `/api/v1/marketlynx/runner/request`: enqueue async request in Redis Stream `LYNX_RUNNER_QUEUE`.
- **GET** `/api/v1/marketlynx/runner/status/{id}`: fetch request status.
- CRUD scope: runner request create/status update/cancel.

### Data Model Requirements (ORM Definitions)
- **Product**: `id`, `owner_id` (UUID, external identity), `name`, `price`, `inventory`, `holographic_asset_cid`.
- **RentalListing**: `id`, `owner_id` (UUID), `title`, `cost_per_day`, `geolocation_id`, `start_date`, `end_date`, `status`.
- **Order**: `id`, `user_id` (UUID), `status` (PENDING/PROCESSING/COMPLETE), `total_amount`, `token_type` (DIGIUSD/UNICOIN).
- **LynxRunnerRequest**: `id`, `user_id` (UUID), `pickup_location`, `dropoff_location`, `driver_id` (UUID nullable), `status`, `cost`.

### Security, Performance, Energy Constraints (DPPM: Constraints)
- **Security**: Zero Trust; require `X-Lynx-User-ID` on all authenticated endpoints. No PII storage. Mandate steganographic watermarking in downstream implementation guidelines.
- **Performance**: p95 API response latency budget ≤ 250ms for reads (excluding downstream AI call). p95 enqueue latency ≤ 50ms for LynxRunner request.
- **Energy Efficiency**: Prefer carbon-aware scheduling for batch jobs and non-urgent queue processing. Use Redis Streams to enable deferred matching when carbon intensity is high.

### Payment Initiation & Auditability
- Checkout must invoke `IChainLynxAdapter` to initiate payment on Chain B and return a response only after acceptance/rejection.
- Log all financial events with `transaction_id`, `user_id`, `ChainLynX_Proof_Hash` placeholder.

### Optimistic Concurrency Controls
- Require version fields or update guards in Product and RentalListing updates to prevent lost updates.
- On conflict, surface retriable error with guidance for exponential backoff.

### Upgrade Suggestion (Patent Booster)
- For trustless escrow on high-value purchases, integrate ZKPs via a cryptographic service to validate payment eligibility without exposing full transaction details.

### Brand & Compliance Requirements
- Use EternaLynX design tokens in any UI-facing docs/visuals: Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878).
- Enforce environment variables for secrets; explicit error handling mandated.

## Architecture Decision Records (ADRs)

### ADR-001: Node.js/TypeScript + Express for MarketLynX Service
- **Decision:** Use Node.js/TypeScript with Express.js for API layer.
- **Rationale:** Aligns with team competency and existing monorepo stack; fits microservice modularity and Docker deployment targets.
- **Consequences:** Requires disciplined typing and runtime validation; performance hinges on async IO and optimized DB queries.

### ADR-002: PostgreSQL + ORM (Prisma/Sequelize)
- **Decision:** Use PostgreSQL with a modern ORM.
- **Rationale:** Supports relational integrity, explicit UUID FK references, and scalable transactional operations.
- **Consequences:** Requires schema migration management; careful handling of connection pooling and query performance.

### ADR-003: Redis Streams for LynxRunner Queue
- **Decision:** Use Redis Streams (`LYNX_RUNNER_QUEUE`) for async dispatch.
- **Rationale:** Low-latency queueing, supports consumer groups for matcher workers.
- **Consequences:** Requires stream trimming policies and consumer group lag monitoring.

### ADR-004: Adapter Interfaces for Payments and Vendor Integrations
- **Decision:** Define `IChainLynxAdapter` and `IRentaLynxAdapter` interfaces.
- **Rationale:** Enables modular integration with external ledgers and vendor systems without coupling.
- **Consequences:** Requires stable contracts and versioning to avoid integration drift.

## Risk & Tradeoff Analysis (Devil’s Advocate)

### 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** Risk of missing/invalid `X-Lynx-User-ID` header; mitigate with mandatory gateway validation and strict rejection.
2. **Deliver Request:** Upstream gateway or network latency causing timeouts; mitigate with circuit breakers.
3. **Validate Request:** Schema drift from Postman contract; mitigate with schema validation and contract testing.
4. **Update Server State:** Concurrency conflicts on inventory or rental status; mitigate with optimistic locking and retries.
5. **Post Reply:** Payment acceptance race conditions; mitigate by gating response on Chain B acceptance.
6. **Deliver Reply:** Response lost or client timeout; mitigate with idempotency keys for checkout/request creation.
7. **Validate Reply:** Client misinterprets status; mitigate with strict enums and versioned API responses.
8. **Update Client State:** Stale reads for runner status; mitigate with server-sent events or polling guidance.

### Additional Tradeoffs
- **Latency vs. Consistency:** Tight consistency on inventory may increase latency; consider eventual consistency for low-risk products.
- **Operational Complexity:** Redis Streams improve async flow but require monitoring and alerting.
- **Security Overhead:** Zero Trust header enforcement adds validation overhead but is required for ZTA compliance.

## Governance Anchors
- **Anchor 1:** Approval required for any changes to authentication enforcement (`X-Lynx-User-ID`).
- **Anchor 2:** Approval required for schema changes affecting foreign key references to external identity/payment systems.
- **Anchor 3:** Approval required for payment initiation flow changes (ChainLynX adapter behaviors).
- **Anchor 4:** Approval required for enabling AI recommendation integration endpoints.
- **Anchor 5:** Approval required for switching queue technology away from Redis Streams.

## Branching & Implementation Guidance
- **Suggested branch format:** `backend/marketlynx/service/feature`.
- **Tag usage:** Only `feature`, `date`, or `time` tags are permitted.
- **Implementation notes:** Provide explicit error handling, environment-based secrets, and steganographic watermarking in downstream code.

