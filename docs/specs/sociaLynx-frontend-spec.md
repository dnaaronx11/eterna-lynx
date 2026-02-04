# SociaLynX Frontend Specification (Spatial UI / Holographic Vision)

> **Role Constraint:** This document is an architectural specification only. It is intentionally **not** production-ready code and must be implemented by downstream engineers.

## 0) Inputs & Traceability (Required Data Streams)

**Status:** Inputs not provided in this task payload. The following placeholders must be replaced with actual data prior to implementation.

- **NotebookLM Summaries (Global Trends Alignment):** _Missing_.
  - Placeholder assumptions: Carbon-aware scheduling, accessibility-first UI, AR/VR interaction trends.
- **Linear Issues (Intent Signal):** _Missing_.
  - Placeholder assumption: “Build SociaLynX spatial UI frontend with modular hubs.”
- **Amplitude Insights (Behavioral Priority):** _Missing_.
  - Placeholder assumption: High engagement on swipe-based discovery, rapid content preview, and wallet visibility.
- **Postman Schemas (API Contracts):** _Missing_.
  - Placeholder assumption: REST/GraphQL endpoints for feeds, profiles, wallet balances, media assets.

> **Action Required:** Replace all placeholders with live inputs before engineering begins.

---

## 1) DPPM Architectural Reasoning Loop

### 1.1 Decomposition (Sub-Goals / Shards)
- **Identity Shard:** Wallet/UniLinc integration; consent/visibility controls.
- **Media Shard:** MusicHub feed, ArtDepot gallery, spatial media rendering.
- **Social Shard:** Comments, critiques, following, engagement signals.
- **Discovery Shard:** Datelink carousel + filters.
- **Platform Shard:** Routing/state orchestration, performance budgets, PWA shell.

### 1.2 Constraint Generation (Mandatory)
- **Security:**
  - Steganographic encryption/watermarking required for user-generated visual assets.
  - Secrets must be injected via environment variables only.
  - Explicit error handling in all IO + async flows.
- **Performance:**
  - Target **<120ms** interaction latency on primary navigation transitions (cold cache).
  - First meaningful render in **<2.5s** on mid-tier mobile hardware.
- **Energy Efficiency:**
  - Carbon-aware scheduling for heavy asset prefetch.
  - Adaptive fidelity based on device power state and thermal budget.

### 1.3 Anticipatory Reflection (8 Failure Modes)
| Failure Mode | Risk | Mitigation Anchor |
| --- | --- | --- |
| Post Request | Oversized payloads for spatial assets | Enforce size budgets + compression in API contracts |
| Deliver Request | Network jitter causing R3F scene stalls | Progressive hydration + LOD fallbacks |
| Validate Request | Schema mismatches (REST/GraphQL) | Strict schema validation + versioned contracts |
| Update Server State | Inconsistent engagement writes | Idempotent writes + conflict resolution |
| Post Reply | Unbounded feed payloads | Pagination + cursor-based fetching |
| Deliver Reply | Slow responses for gallery | CDN edge caching + placeholders |
| Validate Reply | Corrupted media assets | Checksums + failover asset sources |
| Update Client State | UI state desync between hubs | Centralized state machine + event bus |

---

## 2) Technical Specification

### 2.1 User Stories
- **As a user**, I can navigate a spatial 3D hub that visually separates MusicHub, ArtDepot, and Datelink without full page reloads.
- **As a creator**, I can view a holographic feed of posts with visible metadata and media previews.
- **As a user**, I can access my Holo-Wallet widget at any time and see token balances.
- **As a dater**, I can swipe profile cards with clear consent/privacy indicators.
- **As an artist**, I can open critiques and annotate a spatial canvas.

### 2.2 Acceptance Criteria
- Spatial UI renders navigation planes via R3F for all three hubs.
- Hub transitions preserve UI state and do not cause full page reloads.
- Holo-Wallet widget remains fixed and visible; displays mock balances until API is wired.
- All data reads are async and use a defined contract stub aligned to Postman schemas.
- Brand tokens are enforced in primary UI accents: Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878).

### 2.3 Frontend Architecture & Modules
- **Framework:** React + TypeScript + Vite.
- **Styling:** Tailwind CSS.
- **3D Layer:** React Three Fiber (R3F) + Three.js.
- **State Orchestration:** Single event bus or deterministic state machine (framework-agnostic).
- **Routing:** Client-side transitions only (no full reloads).

### 2.4 Spatial UI Directives
- **Volumetric Main Menu:** A rotatable, transparent holographic plane with 3D lighting and depth.
- **Environmental Effects:** PBR materials, ambient + directional lighting, and depth-of-field for focus zones.
- **Anchor Points:** Each hub is a spatial plane that can be “pulled” into focus.

### 2.5 Hub Specifications (Modular Components)

#### MusicHub
- **Holographic Feed** (floating cards):
  - Schema: `PostID`, `AuthorID`, `TrackTitle`, `AlbumArtURL`, `WaveformLink`.
- **Artist Profile View**:
  - Schema: `ArtistName`, `FollowerCount`, `TotalInfluenceScore`.
- **Music Player Control**:
  - Schema: `CurrentTrackID`, `PlaybackState`.

#### ArtDepot
- **Spatial Gallery View**:
  - Schema: `ArtID`, `CreatorID`, `AssetURL`, `CritiqueCount`.
- **LynXpen Integration Module**:
  - Schema: `PenStatus`, `StyleProfile`.
- **Critique/Comment Pane**:
  - Schema: `CommentID`, `UserID`, `Timestamp`, `TextBody`.

#### Datelink
- **Profile Card Carousel**:
  - Schema: `ProfileID`, `AggregatorSource`, `Intent`, `BiometricMatchScore`.
- **Preference Filter Pane**:
  - Schema: `AgeRange`, `GenderPreference`, `OrientationSetting`.
- **External Linkage Status**:
  - Schema: `TinderStatus`, `HingeStatus`, `POFStatus`.

---

## 3) Architecture Decision Records (ADRs)

### ADR-001: Spatial UI via R3F for Primary Navigation
- **Decision:** Use React Three Fiber to render main navigation as spatial planes.
- **Why:** Patentability and differentiation through volumetric interaction.
- **Alternatives:** Standard 2D navigation (rejected: insufficient novelty).

### ADR-002: Modular Hub Components
- **Decision:** Build MusicHub, ArtDepot, Datelink as isolated modules.
- **Why:** Enables future micro-frontend migration and reduces coupling.
- **Alternatives:** Monolithic UI tree (rejected: limits scalability).

### ADR-003: Async Data Access Layer with Contract Stubs
- **Decision:** All data access via async functions aligned to Postman schemas.
- **Why:** Enforces contract-driven development and future backend alignment.
- **Alternatives:** Direct inline fetch calls (rejected: brittle, untestable).

### ADR-004: Brand Token Enforcement
- **Decision:** Color tokens restricted to Ruby Red, Yellow Gold, Emerald.
- **Why:** Brand cohesion and visual consistency in spatial UI.

---

## 4) Risk & Tradeoff Analysis (Devil’s Advocate)

- **Risk:** R3F performance on mid-tier mobile.
  - **Tradeoff:** Limit draw calls, aggressive LOD, reduced post-processing.
- **Risk:** Complex state synchronization across hubs.
  - **Tradeoff:** Introduce deterministic state machine and event bus.
- **Risk:** User confusion in spatial UI navigation.
  - **Tradeoff:** Provide 2D fallback overlay for accessibility.
- **Risk:** High bandwidth asset loading for ArtDepot.
  - **Tradeoff:** Progressive loading, CDN caching, compress assets.

---

## 5) Governance Anchors (Human Oversight Required)

1. **Schema Approval Gate:** A human must validate Postman schemas before UI integration.
2. **Security Review Gate:** Validate steganographic watermarking strategy and secret handling.
3. **Performance Budget Gate:** Validate mobile performance with real device benchmarks.
4. **Brand Review Gate:** Confirm spatial UI uses brand token palette.
5. **Ethics & Consent Gate:** Ensure Datelink privacy cues and consent indicators align with policy.

---

## 6) Implementation Guidance (Non-Code)

- **Branching Format:** `{layer}/{hub}/{module}/{tag}` where tag ∈ {feature, date, time}.
  - Example: `frontend/socialynx/spatial-hub/feature`.
- **Micro-Frontend Upgrade Path:** Wrap hubs as Web Components when scaling teams.
- **Mobile Delivery Upgrade Path:** Plan for React Native or Flutter wrapper after PWA stabilization.
- **Realtime Upgrade Path:** Introduce Pub/Sub (Redis Streams or Kafka) for activity feeds.

---

## 7) Open Questions / Required Inputs

- Provide NotebookLM Summaries to validate trend alignment.
- Provide Linear Issue ID and description (Intent Signal).
- Provide Amplitude Insights (top user actions, drop-offs).
- Provide Postman schemas for all endpoints.

