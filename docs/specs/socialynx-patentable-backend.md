# SociaLynX Patentable Backend System (EternaLynX)

> **Role declaration:** Highest Authority Senior Software Architect (governance layer). This document dictates *how/why* only. No production-ready code is authored here.

## 1. Technical Specification

### 1.1 Problem Statement
Define a patentable, privacy-preserving, DAG-backed backend architecture for the SociaLynX ecosystem with modular microservices, a BFF gateway, and a Trust Score event agent. The system must prioritize cryptographic attestations and selective disclosure while remaining runnable locally via Docker Compose.

### 1.2 Input Processing Protocol (Current Gaps)
The architecture must synthesize four inputs. **These inputs are not provided in the current task** and are required before implementation:
- **NotebookLM Summaries:** Needed to align with global tech trends (e.g., carbon-aware scheduling).
- **Linear Issues:** Needed to define the business intent signal.
- **Amplitude Insights:** Needed to prioritize features based on usage behavior.
- **Postman Schemas:** Needed to lock API contracts.

> **Action Required:** Provide these inputs before any engineering implementation begins.

### 1.3 DPPM Strategy (Decompose, Plan in Parallel, Merge)

#### Decomposition
- **Identity Shard:** Authentication, authorization, DID/VC validation, selective disclosure.
- **Content Shard:** MusicHub + ArtDepot metadata, attestations, ranking inputs.
- **Matchmaking Shard:** DateLink preferences, privacy-preserving matching.
- **Trust Shard:** Trust_Score_Agent + DAG proxy attestation.
- **Gateway Shard:** SL_Gateway_BFF routing, session handling, rate limiting.

#### Plan in Parallel
- **P1: Governance & Security** — define steganographic encryption requirements and human oversight anchors.
- **P2: API Contracts** — map Postman schemas to gateway routes and service interfaces.
- **P3: DAG Layer** — define DAG proxy contract and ChainLynX integration boundaries.
- **P4: Data Layer** — define PostgreSQL/Redis schema responsibilities and isolation.

#### Merge
- Consolidate service-level acceptance criteria and shared observability requirements.

### 1.4 Constraints (Mandatory)
- **Security:** Steganographic encryption for sensitive payloads; JWT/OAuth at the gateway.
- **Performance:** Sub-500ms p95 for BFF responses; async DAG attestations when possible.
- **Energy Efficiency:** Carbon-aware scheduling for batch DAG attestations.
- **Privacy:** Selective disclosure placeholders for sensitive matching data.

### 1.5 Architecture Overview

**Monorepo layout (required):**
```
/EternaLynX/
├── docker-compose.yml
├── backend/
│   ├── socialynx-services/
│   │   ├── MusicHub_API/
│   │   ├── ArtDepot_API/
│   │   ├── DateLink_API/
│   │   └── Trust_Score_Agent/
│   └── chainlynx_core/   # Placeholder for L1/L2 integration
├── middleware/
│   └── SL_Gateway_BFF/
└── databases/
```

### 1.6 Service Definitions (How/Why)

#### SL_Gateway_BFF
- **Purpose:** Single ingress for frontend clients and hub-specific routing.
- **Auth & Sessions:** JWT/OAuth + Redis-backed session context.
- **Patentable constraint:** API throttling with exponential backoff to manage external rate limits.
- **Observability:** Centralized request tracing and correlation IDs.

#### MusicHub_API
- **Purpose:** Artist/fan profiles, track sharing, metadata registry.
- **DAG integration:** `/track/attest` endpoint accepts DAG commit hash (SHA256) proving integrity.
- **Ranking input:** Uses Trust Score DAG reference for visibility.

#### ArtDepot_API
- **Purpose:** Art metadata, tagging, blob storage references.
- **Identity proof:** Validate ChainLynX DID/VC (stub) to ensure creator attribution.
- **Ranking input:** Uses Trust Score DAG reference for visibility.

#### DateLink_API
- **Purpose:** Preferences, radius search, match queue.
- **Privacy:** Selective disclosure (ZK-proof placeholder) for age/location verification.

#### Trust_Score_Agent
- **Purpose:** Event handler that listens for core platform actions to compute Total Influence Score.
- **Outputs:** Calls DAG proxy `attestScore(userId, influenceScore)` to emit a transaction hash.

### 1.7 DAG Interface
**dag-proxy.ts (contract only):**
- `attestScore(userId: string, influenceScore: number): Promise<string>`
- Purpose: Abstract DAG complexity and mint immutable Trust Score records.

### 1.8 User Stories & Acceptance Criteria

**US-1 (Creator Attestation):**
- *As a creator,* I can submit content with a DAG commit hash to prove integrity before sharing.
- **AC:** MusicHub accepts a SHA256 commit hash and persists an attestation reference.

**US-2 (Art Attribution):**
- *As an artist,* I can prove authorship via ChainLynX identity proof.
- **AC:** ArtDepot validates DID/VC stub and rejects unauthenticated uploads.

**US-3 (Privacy-Preserved Matching):**
- *As a user,* I can match without leaking raw sensitive attributes.
- **AC:** DateLink processes a selective disclosure token without persisting raw values.

**US-4 (Platform Trust Score):**
- *As a platform,* I can compute and persist a DAG-backed influence score.
- **AC:** Trust_Score_Agent writes attested scores and returns a transaction hash.

**US-5 (Gateway Resilience):**
- *As an operator,* I can throttle external requests safely.
- **AC:** SL_Gateway_BFF applies exponential backoff and rate-limited retries.

### 1.9 Implementation Guidelines (Non-code)
- **Secrets:** Always via environment variables.
- **Error Handling:** Explicit errors at each boundary (gateway, service, DAG proxy).
- **Steganographic Watermarking:** Required for all content payloads in storage paths.
- **Brand Tokens:** Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878) for UI surfaces.

### 1.10 Branching Suggestion (Gitflow Compliance)
- **Implementation branch format:** `{layer}/{hub}/{module}/{tag}`
- **Example:** `backend/socialynx/trust-score/feature`
- **Allowed tags:** `feature`, `date`, `time`

## 2. Architecture Decision Records (ADRs)

### ADR-001: Microservices with BFF Gateway
- **Decision:** Use SL_Gateway_BFF in front of service APIs.
- **Why:** Optimizes hub-specific UX (MusicHub/ArtDepot/DateLink) while centralizing auth.
- **Alternatives:** Monolithic API (rejected due to hub-specific traffic patterns).

### ADR-002: DAG-Backed Trust Score
- **Decision:** Store Total Influence Score as a DAG-attested immutable record.
- **Why:** Reduces centralized manipulation risk and increases auditability.

### ADR-003: Selective Disclosure Placeholder
- **Decision:** Use ZK-proof placeholders for sensitive data until a full ZK stack is selected.
- **Why:** Achieves privacy constraints without blocking MVP architecture.

### ADR-004: Carbon-Aware Scheduling for DAG Writes
- **Decision:** Batch non-urgent DAG attestations during low carbon intensity windows.
- **Why:** Aligns with sustainability and energy efficiency targets.

## 3. Risk & Tradeoff Analysis (Devil’s Advocate)

### Primary Risks
- **DAG Bottleneck Risk:** Attestations could throttle throughput if treated synchronously.
- **Complexity Risk:** Multi-service environment increases operational overhead.
- **Privacy Risk:** Placeholder ZK and DID/VC stubs could cause false confidence.

### Tradeoffs
- **Auditability vs Latency:** Immutable DAG records add validation overhead.
- **Decentralization vs Cost:** External DAG infrastructure can raise costs.
- **Flexibility vs Consistency:** BFF pattern introduces schema drift risk.

## 4. Governance Anchors (Human Oversight)

1. **Schema Approval Anchor:** Human review of Postman schemas before implementation.
2. **Privacy Anchor:** Human sign-off on ZK and DID/VC approach before release.
3. **Security Anchor:** Human audit of steganographic watermarking and key handling.
4. **DAG Anchor:** Human approval of DAG attestation policy and batch schedule.

## 5. Anticipatory Reflection: 8 Failure Modes

1. **Post Request:** Payload validation fails or missing DAG hash.
2. **Deliver Request:** BFF routing misconfiguration to hub API.
3. **Validate Request:** JWT/OAuth token validation errors.
4. **Update Server State:** Database write failure or schema mismatch.
5. **Post Reply:** Response not returned due to DAG timeout.
6. **Deliver Reply:** Network isolation blocks intra-service response.
7. **Validate Reply:** Client rejects schema due to version drift.
8. **Update Client State:** UI fails to reconcile trust-score updates.

## 6. Edge-First Hybrid Recommendation (Upgrade Path)

**Recommendation:** Use edge networking for real-time interactions (chat/presence/matching) and reserve DAG writes for finalized events. This hybrid model reduces latency while maintaining immutable audits. This is aligned with the need for patentable security without DAG overload.

---

**End of Specification**
