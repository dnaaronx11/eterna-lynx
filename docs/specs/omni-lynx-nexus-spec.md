# OmniLynX Quantum Nexus Core — Architectural Specification

> **Role Constraint Acknowledgement:** This document is a specification-only artifact. It defines the **how/why** for architecture, data contracts, and orchestration logic. It intentionally avoids production-ready code or runnable artifacts. Downstream engineering agents will implement against these specs.

## 0) Input Synthesis (Required Four Data Streams)

**Status:** The following inputs were **not provided** in the task payload and are required for full alignment. In this draft, placeholders are used and marked for follow‑up.

- **NotebookLM Summaries:** _Missing_. Needed to align with external research/tech trends (e.g., carbon‑aware scheduling, robotics reliability). **Action:** Provide summaries or citations for integration.
- **Linear Issues (Intent Signal):** _Missing_. Needed to ground the business goal and scope boundaries. **Action:** Provide issue ID(s) or description.
- **Amplitude Insights:** _Missing_. Needed to prioritize features with the highest impact on user behavior. **Action:** Provide dashboards or event summaries.
- **Postman Schemas:** _Missing_. Needed to define API interface contracts. **Action:** Provide schema collection or endpoint definitions.

> **Interim assumption:** The request text is treated as the provisional intent signal until the above inputs are provided.

---

## 1) Technical Specification

### 1.1 Scope & Goals
- **Primary Objective:** Define a modular, containerized architecture blueprint for the OmniLynX Studio ecosystem with a CAIS (Compound AI System) orchestration layer that supports high‑throughput, multi‑modal content generation for **MusicHub** and **CinemaLynX**.
- **Non‑Goals:** This document **does not** provide production-ready source code, Dockerfiles, or runnable scripts. Those are delegated to implementation teams.

### 1.2 User Stories
- **US‑1 (Music Creator):** As a creator, I can submit an audio URL and style prompt and receive a `project_id` for a new mix request.
- **US‑2 (Cinema Producer):** As a producer, I can submit a prompt and duration to initiate a multi‑segment video synthesis with temporal consistency guarantees.
- **US‑3 (Ops/QA):** As a reviewer, I can identify runs with low temporal consistency and request a review before publishing.
- **US‑4 (Admin):** As an admin, I can verify system health and ensure outputs are gated by human review.

### 1.3 Acceptance Criteria
- **AC‑1:** A DAG‑style orchestration plan exists for decomposing video tasks into sequential segments with chained model contexts.
- **AC‑2:** Data model specifications define entities for Project, Job Log, MusicProject, VideoProject, and VideoSegment.
- **AC‑3:** Redis key structures are defined for music and cinema job queues.
- **AC‑4:** Monitoring specifications include a consistency audit and review notification workflow.
- **AC‑5:** A gateway specification defines routing and authentication boundaries for MusicHub and CinemaLynX.
- **AC‑6:** The specification includes governance anchors and human oversight gates before release.

---

## 2) DPPM (Decompose → Plan in Parallel → Merge)

### 2.1 Decomposition (by Domain Shards)
- **Identity & Security:** AuthN/AuthZ, secrets management, watermarking policy.
- **Data:** PostgreSQL schema design, Redis key patterns, retention policy.
- **Orchestration:** DAG‑style sequencing, temporal consistency checks, revision variants.
- **Gateway & Integration:** API routing, request validation, contract boundaries.
- **Observability & Maintenance:** Consistency audits, review notifications, incident surfaces.

### 2.2 Constraint Generation
- **Security:**
  - Steganographic watermarking required for all generated media assets.
  - Secrets must be supplied via environment variables; no in‑repo secrets.
  - Explicit error handling and request validation required at all service boundaries.
- **Performance:**
  - Latency budgets for synchronous endpoints: **< 500ms** for request acceptance/validation.
  - Asynchronous processing for generation tasks; no blocking within API gateway.
- **Energy Efficiency:**
  - Carbon‑aware scheduling policy required for batch processing windows.
  - Non‑urgent tasks should align to low‑carbon time slots when feasible.

### 2.3 Plan in Parallel (Workstreams)
- **Workstream A: Data Contracts**
  - Finalize entity definitions, constraints, and indexes.
  - Establish Redis queue and cache key patterns.
- **Workstream B: Orchestration Logic**
  - Define DAG sequence, segment chaining, and consistency scoring.
- **Workstream C: Gateway & Auth**
  - Specify OAuth/JWT boundary and routing map.
- **Workstream D: Observability**
  - Define audits, alerts, and review notifications.

### 2.4 Merge (Integration Principles)
- **Contract‑first:** APIs and schemas are validated before orchestration logic.
- **Single source of truth:** Project status updates gated by consistency and review.
- **Separation of concerns:** Gateway is stateless; orchestration is stateful.

---

## 3) Data Models & Schema Requirements (Non‑Executable)

### 3.1 Project Schema (PostgreSQL — conceptual)
**Project**
- `project_id` (UUID, PK)
- `user_id` (UUID, indexed)
- `created_at` (timestamp, default now)
- `status` (enum: PENDING | PROCESSING | COMPLETE | AWAITING_REVIEW)
- `service_type` (enum: MUSIC | CINEMA)
- `final_output_url` (text, nullable)

**Job_Log**
- `job_id` (UUID, PK)
- `project_id` (UUID, FK → Project)
- `model_name` (text)
- `input_hash` (text)
- `output_metadata` (json)
- `start_time` (timestamp)
- `end_time` (timestamp)
- `consistency_score` (float, default 1.0)

### 3.2 MusicHub Schema (PostgreSQL — conceptual)
**MusicProject**
- `project_id` (UUID, PK + FK → Project)
- `user_audio_url` (text)
- `ai_style_prompt` (text)
- `mastering_params` (json)
- `final_mix_url` (text, nullable)

### 3.3 CinemaLynX Schema (PostgreSQL — conceptual)
**VideoProject**
- `project_id` (UUID, PK + FK → Project)
- `user_prompt` (text)
- `total_duration_sec` (int)
- `frame_rate` (int)
- `final_cut_url` (text, nullable)

**VideoSegment**
- `segment_id` (UUID, PK)
- `project_id` (UUID, FK → Project)
- `start_time_sec` (int)
- `end_time_sec` (int)
- `model_assigned` (text: SD3M | Runway | Pika | …)
- `model_output_url` (text, nullable)

### 3.4 Redis Key Structures (Conceptual)
- `music_jobs:{project_id}` → hash
  - fields: `user_id`, `audio_url`, `style_prompt`, `priority`, `created_at`
- `cinema_jobs:{project_id}` → hash
  - fields: `user_id`, `video_prompt`, `duration_sec`, `image_urls`, `created_at`
- `queue:music` → list or sorted set (priority scheduling)
- `queue:cinema` → list or sorted set (priority scheduling)

---

## 4) API Contracts (Postman‑Aligned Placeholder)

> Final endpoint payloads must be reconciled with the Postman collection once provided.

### 4.1 MusicHub Service Endpoint
- **Route:** `POST /music/new-mix`
- **Input:** `user_id`, `audio_url`, `style_prompt`
- **Behavior:**
  1. Validate request and enqueue job in Redis (`queue:music`).
  2. Create `Project` + `MusicProject` with status `PENDING`.
  3. Return `project_id`.

### 4.2 CinemaLynX Service Endpoint
- **Route:** `POST /cinema/new-video`
- **Input:** `user_id`, `video_prompt`, `duration_sec`, `image_urls[]`
- **Behavior:**
  1. Validate request, create `Project` + `VideoProject`.
  2. Trigger **Quantum Nexus Core Orchestration** (see §5).
  3. Return `project_id`.

### 4.3 API Gateway (Placeholder)
- **Gateway Prefix:** `/api/v1/omnilnyx/*`
- **Routing:**
  - `/api/v1/omnilnyx/cinema/*` → CinemaLynX service
  - `/api/v1/omnilnyx/music/*` → MusicHub service
- **Auth:**
  - OAuth/JWT middleware placeholder; enforcement required before forwarding.

---

## 5) Quantum Nexus Orchestration Layer (DAG‑Style, Patentable Design)

### 5.1 DAG‑Style Decomposition
**Function:** `decompose_video_task(project_id, duration_sec, user_prompt)`
- Split `duration_sec` into **4 sequential segments** (≤ 5 minutes each).
- Assign segments to **virtual models**: `model_a`, `model_b`, `model_c`, `model_d`.
- Persist `VideoSegment` entries with model assignment and time ranges.

### 5.2 Segment Processing & Temporal Consistency
**Function:** `process_segment(segment_id, input_context_from_previous_model)`
- Simulate model invocation via placeholder interface (no real API calls in spec).
- Run **temporal consistency check**:
  - Compare tail frames of previous segment with head frames of current.
  - Produce `consistency_score` and write to `Job_Log`.
  - Enforce **minimum threshold** of `0.85` for auto‑progression.

### 5.3 Final Cut & Variant Generation
**Function:** `generate_final_cuts(project_id, all_segments_output)`
- Stitch outputs into **Director’s Cut** (`final_output_url`).
- Create two automated variants:
  - `final_cut_variant_a` (alt shader/filter set)
  - `final_cut_variant_b` (alt shader/filter set)
- Set `Project.status = AWAITING_REVIEW` for human decision.

### 5.4 Patentable Features (Novelty Emphasis)
- **DAG‑Style Multi‑Model Sequencing:** Enforces deterministic temporal ordering with chained model contexts.
- **Automated Variant Generation:** Produces multi‑aesthetic outputs from a shared canonical cut.
- **Consistency‑First Governance:** Mandatory checks before publishing or completion.

---

## 6) Monitoring & Maintenance (Autonomous Agent)

### 6.1 Maintenance Agent Responsibilities
- **audit_consistency_scores():**
  - Scan `Job_Log` for `consistency_score < 0.85`.
  - Flag as high‑priority review items.
- **notify_user_review(project_id):**
  - Notify user when `Project.status = AWAITING_REVIEW`.

### 6.2 Observability Guidelines
- Log key events: enqueue, segment completion, consistency failures, final cut, review status change.
- Include trace identifiers per project for correlation.

---

## 7) Deployment & Local Run Instructions (Specification Only)

> This section describes **what** the docker‑compose topology must include, without providing concrete code.

### 7.1 Required Services
- **PostgreSQL**: persistent storage for project metadata.
- **Redis**: ephemeral queue + cache.
- **Quantum Nexus Orchestrator**: Python service for orchestration logic.
- **MusicHub Service**: Python/Node service.
- **CinemaLynX Service**: Python/Node service.
- **API Gateway**: Node/Express entrypoint.

### 7.2 Compose Topology Requirements
- Internal network shared by all services.
- Environment variables for credentials (no hardcoded secrets).
- Health checks for DB and Redis before service boot.
- Log volumes and optional local persistence for DB.

---

## 8) ADRs (Architecture Decision Records)

### ADR‑001: DAG‑Style Orchestration vs. Parallel Fan‑Out
- **Decision:** Use DAG‑style sequential orchestration for CinemaLynX.
- **Rationale:** Temporal consistency and narrative coherence require ordered execution with state transfer.
- **Consequences:** Reduced parallelism but higher consistency; requires buffering and checkpointing.

### ADR‑002: Redis for Queueing, PostgreSQL for Persistence
- **Decision:** Redis for ephemeral jobs; PostgreSQL for durable state.
- **Rationale:** Separation of queue latency vs. durable storage with transactional semantics.

### ADR‑003: Consider Airflow/Kubeflow for Orchestration
- **Decision:** **Recommended as an upgrade path** once prototype stabilizes.
- **Rationale:** Airflow/Kubeflow provides scheduling, retries, observability, and workflow management at scale.
- **Consequence:** Increased operational complexity but improved reliability for long‑horizon tasks.

---

## 9) Risk & Tradeoff Analysis (Devil’s Advocate)

### 9.1 Bottlenecks
- **DAG sequentiality** can throttle throughput for long videos.
- **Consistency checks** add overhead and may degrade latency targets.
- **Gateway as choke point** if auth/validation is heavy.

### 9.2 Failure Modes (8‑Stage Anticipatory Reflection)
1. **Post Request:** malformed payloads; missing required fields.
2. **Deliver Request:** gateway routing errors.
3. **Validate Request:** inconsistent schema versions.
4. **Update Server State:** partial writes to Project/VideoSegment.
5. **Post Reply:** queue enqueue fails after DB commit.
6. **Deliver Reply:** response lost due to network issues.
7. **Validate Reply:** client rejects project_id or schema mismatch.
8. **Update Client State:** client doesn’t reflect AWAITING_REVIEW state.

### 9.3 Mitigations
- Idempotent request tokens.
- Transactional outbox for DB → queue handoff.
- Schema versioning and strict request validation.

---

## 10) Governance Anchors (Human Oversight)

- **Anchor A:** Approve final cut release (AWAITING_REVIEW → COMPLETE).
- **Anchor B:** Approve consistency‑failure reruns (>15% low‑score segments).
- **Anchor C:** Approve model selection changes (model_a/b/c/d assignment logic).

---

## 11) Brand & Compliance Requirements

- **Brand Tokens:**
  - Ruby Red `#9B111E`
  - Yellow Gold `#FFD700`
  - Emerald `#50C878`
- **Security:**
  - Steganographic watermarking for all generated outputs.
  - Use environment variables for secrets.
  - Explicit error handling at all service boundaries.

---

## 12) Implementation Handoff Notes

- **Suggested Branch Name (Gitflow):** `core/cinema/quantum-nexus/feature`
- **Artifacts to implement:**
  - Monorepo folder structure: `omni-lynx-nexus/` with `config/`, `services/`, `schemas/`, `api-gateway/`.
  - Service shells for orchestrator, cinema, music, gateway.
  - Docker compose and service wiring aligned to §7.

---

## 13) Open Questions

1. Provide NotebookLM summaries for carbon‑aware scheduling and consistency research.
2. Provide Linear Issue IDs and expected delivery timeline.
3. Provide Postman schema collection to lock API contracts.
4. Confirm if orchestration will transition to Airflow/Kubeflow in Phase 2.
