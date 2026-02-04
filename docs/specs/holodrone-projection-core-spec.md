# EternaLynX Holodrone X Projection Core (v1.0) — Technical Specification

> **Role Notice (Governance Only):** This document defines the architectural “how” and “why.” It deliberately avoids production-ready code and limits itself to specifications, interfaces, and governance anchors.

## 0) Task Context & Input Gaps
**Task Placeholder Provided:** `TASK: [INSERT LINEAR ISSUE OR NOTEBOOKLM SUMMARY HERE]`.

**Required data streams are missing from the prompt** (NotebookLM Summaries, Linear Issues, Amplitude Insights, Postman Schemas). This spec **explicitly flags missing inputs** and provides a structured placeholder for when they are supplied.

### 0.1 Required Inputs (for completion)
- **NotebookLM Summaries:** _Missing_ → Needed for alignment with current robotics/CAIS trends and carbon-aware scheduling benchmarks.
- **Linear Issues:** _Missing_ → Needed to anchor scope and intent signal.
- **Amplitude Insights:** _Missing_ → Needed to prioritize endpoints/telemetry behavior based on user/operator patterns.
- **Postman Schemas:** _Missing_ → Needed to finalize API contracts and validation rules.

> **Governance Gate:** This spec is valid for architectural scaffolding but requires the above inputs before implementation execution.

---

## 1) Technical Specification

### 1.1 User Stories
1. **Operator**: As a HOLOLYNX_OPERATOR, I need to start a multi-drone projection for a scene so that the hologram appears as a coherent 3D structure.
2. **System Controller**: As the Core Service, I need to verify all mission-critical commands with ChainLynX so that unauthorized drone actions are impossible.
3. **Drone Agent**: As a Worker Drone Agent, I need telemetry and correction events so that my projection aligns with the swarm.
4. **Safety Officer**: As a governance stakeholder, I need human oversight anchors so that policy and compliance can veto risky operations.

### 1.2 Acceptance Criteria
- **AC-01**: Service runs on **port 4003** and exposes only validated endpoints behind EternaLynX middleware (requires `X-Lynx-User-ID` + `HOLOLYNX_OPERATOR`).
- **AC-02**: Drone telemetry updates are ingested via `/ws/drone-telemetry`, persisted in **Redis Streams**, and cached as `drone:<id>:position`.
- **AC-03**: **Mission-critical commands** must pass synchronous vetting against `securilynx-core-service:4005/vetting/request` before execution.
- **AC-04**: Worker agents compute and apply **Distributed Projection Calculation (DPC)** correction outputs (placeholder for kinematic/projection alignment algorithms).
- **AC-05**: Database schema includes `DroneState` and `HoloScene` as described.
- **AC-06**: All secrets are environment variables and logging includes steganographic watermarking tokens (policy requirement).

### 1.3 System Components (High-Level)
- **Backend Service**: Node.js/TypeScript service (Express or Fastify) using Redis Streams for internal queues.
- **Sync Manager**: Telemetry ingestion and state consistency logic.
- **Manager Agent**: Orchestration and assignment of projection segments.
- **Worker Drone Agents**: Per-drone execution of projection DPC logic.
- **Chain Vetting Proxy**: Synchronous authorization guardrails.
- **LightAdapter Module**: Placeholder for AI-based ambient light compensation.

### 1.4 Data Models (PostgreSQL ORM Placeholder)
#### DroneState
- `drone_id (UUID, PK)`
- `last_known_position (JSONB: {x, y, z}, meters)`
- `current_projection_segment (INT: 1 to 4)`
- `projection_status (ENUM: IDLE, WARMUP, ACTIVE, ERROR)`
- `battery_level (DECIMAL)`
- `projection_intensity (DECIMAL, 0.0–1.0)`

#### HoloScene
- `scene_id (UUID, PK)`
- `owner_id (UUID, VaultLynX ID)`
- `hologram_asset_cid (STRING, IPFS/HoloLynX)`
- `projection_target_box (JSONB: {center_x, center_y, size_x, size_y})`
- `required_drones (INT: 2–4)`

### 1.5 API Boundary (Postman Schemas Required)
**Status:** _Deferred pending Postman schema input._

Planned endpoints:
- `POST /mission/start` → requires `HOLOLYNX_OPERATOR` + ChainLynX vetting.
- `POST /mission/abort` → requires `HOLOLYNX_OPERATOR` + ChainLynX vetting.
- `/ws/drone-telemetry` (WebSocket) → bi-directional telemetry & correction stream.

---

## 2) Architecture Decision Records (ADRs)

### ADR-001: Redis Streams for Telemetry and Command Queues
**Decision:** Use Redis Streams for high-volume, low-latency telemetry and command distribution.
**Why:** Redis Streams provide ordered, durable, low-latency queueing with consumer groups; aligns with multi-drone concurrency needs.
**Alternatives:** Kafka (heavier operational footprint), NATS (less persistence by default).

### ADR-002: HMAS (Hierarchical Multi-Agent System)
**Decision:** Use Manager Agent → Worker Drone Agents.
**Why:** Supports Contract Net style resource allocation and coordination, improves resilience to node variance.
**Alternatives:** Fully decentralized swarm (more complex consensus) or single-threaded controller (scaling bottleneck).

### ADR-003: ChainLynX Vetting Gate for Mission-Critical Commands
**Decision:** Synchronous vetting for START_FLIGHT, RELEASE_PROJECTION_LOCK, EMERGENCY_LANDING.
**Why:** Enforces zero-trust and policy compliance with immutable verification.

### ADR-004: LightAdapter AI Enhancement Stub
**Decision:** Provide placeholder module for future CV/Edge AI integration.
**Why:** Creates clear integration surface for OpenVINO/TFLite without blocking core rollout.

### ADR-005: Port & Network Compliance
**Decision:** Service must run on **port 4003** and be attached to internal service mesh (postgres, redis, middleware).
**Why:** Standard HoloLynX allocation and deterministic routing.

---

## 3) Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 Risks
- **Telemetry Flooding**: High-frequency updates can cause Redis hot partitions.
  - Mitigation: Stream partitioning by drone, TTL cache, backpressure on WebSocket.
- **Chain Vetting Latency**: Synchronous call can introduce mission start latency.
  - Mitigation: Pre-vet scene configs; maintain policy cache with strict TTL.
- **DPC Complexity**: Projection alignment may be computationally heavy.
  - Mitigation: Offload to optimized worker module and GPU/edge acceleration.
- **Zero-Trust Enforcement Gaps**: Header validation alone is insufficient without gateway verification.
  - Mitigation: enforce internal service token & role claims verification.

### 3.2 Tradeoffs
- **Redis Streams vs Kafka**: Redis easier to operate but may cap throughput vs Kafka.
- **WebSocket vs gRPC**: WebSocket is simpler for browsers; gRPC better for structured binary telemetry.
- **Centralized Manager vs Fully Distributed**: Manager simplifies orchestration but is a single-point-of-decision.

---

## 4) DPPM Strategy (Decompose → Plan in Parallel → Merge)

### 4.1 Decomposition (by Shards)
1. **Identity & Trust Shard**: Zero-trust header validation, role claims enforcement, ChainLynX vetting.
2. **Data & Telemetry Shard**: Redis Streams, telemetry cache, websocket pipeline.
3. **Agent Orchestration Shard**: Manager Agent + Worker Agents logic.
4. **AI/Light Shard**: LightAdapter integration surface and performance/quality interface.

### 4.2 Constraints Generation
- **Security:** Steganographic watermarking in logs; environment variable secrets; synchronous chain vetting for critical commands.
- **Performance:** Telemetry latency budget ≤ 50ms end-to-end; correction dispatch ≤ 20ms.
- **Energy Efficiency:** Carbon-aware scheduling for non-urgent jobs (e.g., hologram preprocessing).

### 4.3 Merge Plan
- Reconcile Identity + Data + Orchestration in a single event flow: telemetry update → state cache → correction queue → worker agent response.
- Ensure LightAdapter feedback loops do not block core control path.

---

## 5) “8 Failure Modes” Anticipatory Reflection
1. **Post Request**: Invalid payload/role bypass → enforce strict schema validation & role checks.
2. **Deliver Request**: Network jitter/packet loss → WebSocket backpressure + retry logic.
3. **Validate Request**: Missing claims or tampered headers → rely on gateway-signed claims + internal token.
4. **Update Server State**: Redis write failure → fail-safe caching & circuit breaker.
5. **Post Reply**: Oversized correction payload → apply chunking and compression.
6. **Deliver Reply**: Drone offline → queue retention + dead-letter policy.
7. **Validate Reply**: Malformed drone telemetry → strict schema and sanity bounds.
8. **Update Client State**: Projection drift not corrected → DPC thresholds + re-sync triggers.

---

## 6) Governance Anchors (Human Oversight)
1. **Mission Start Gate**: Human review before initiating any new HoloScene run.
2. **Chain Vetting Override**: Human authorization required for vetting bypass (emergency only).
3. **DPC Algorithm Revision**: Any change to DPC logic requires signed-off review from safety + robotics leads.
4. **LightAdapter Model Update**: CV/AI model updates require ethical and compliance review.

---

## 7) Brand & Compliance Requirements
- **Design Tokens:** Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878) — apply to UI or status dashboards.
- **Secrets:** Must be provided via environment variables only.
- **Error Handling:** Explicit handling for all mission-critical paths.
- **Watermarking:** Steganographic watermark required in logs and projection metadata.

---

## 8) Implementation Branch Recommendation (Gitflow)
**Required format:** `{layer}/{hub}/{module}/{tag}` with tag ∈ {feature, date, time}.
- **Suggested branch:** `backend/holodrone/projection-service/feature`

---

## 9) Appendices
### 9.1 Mapping to User-Provided Requirements
- Monorepo location: `/backend/holodrone-projection-service` (implementation target).
- Port: `4003`.
- Redis Streams: primary internal queue.
- Zero-Trust: `X-Lynx-User-ID` + `HOLOLYNX_OPERATOR` requirement.
- Telemetry channel: `DRONE_TELEMETRY_UPDATE` stream.
- External vetting: `securilynx-core-service:4005/vetting/request`.

### 9.2 Open Questions (Must be Resolved)
- Provide actual Linear Issue or NotebookLM Summary.
- Provide Postman schemas for endpoint contracts.
- Provide Amplitude usage insights for telemetry priority.
