# EternaLynX GalleriaHub/ArtistHub Frontend v1.0 — Technical Specification

## 0) Task Input & Context Anchors
**TASK:** *(not provided in prompt; placeholder)*

### 0.1 Required Input Streams (Currently Missing)
To align with the governance-layer protocol, the following inputs must be attached to the Linear issue before implementation begins:
- **NotebookLM Summaries:** (e.g., MIT robotics research trends, carbon-aware computing guidance).
- **Linear Issues:** Primary intent signal (feature narrative, scope, priority).
- **Amplitude Insights:** User behavior analytics that prioritize high-impact flows.
- **Postman Schemas:** API contracts for upload, asset listing, rights checks, wallet balance, and revenue split endpoints.

**Blocking Impact:** The architecture below assumes placeholders for each stream. Implementation MUST bind to these inputs before coding. This is a governance anchor and human oversight checkpoint.

---

## 1) Technical Specification

### 1.1 Goals & Non-Goals
**Goals**
- Define a **modular React/TypeScript** architecture optimized for reusability across web and PWA contexts.
- Provide a **3D viewer placeholder** component for GLTF/GLB asset inspection (Three.js or R3F integration points).
- Specify an **Upload Asset** flow supporting image/video input and AI prompt/seed capture.
- Integrate a **real-time IP compliance badge** with polling or subscription updates and a release-document upload pathway.
- Display **mandatory revenue split transparency** and WalletLynX token balance.

**Non-Goals**
- Production-ready code implementations are expressly out of scope (governance directive).
- Exact API payloads are deferred to Postman schemas.

---

### 1.2 User Stories
1. **As an artist**, I can upload an asset with media files and enter the AI prompt/seed to prove provenance.
2. **As a collector**, I can see compliance status (verified / review / veto) and attach release documents when required.
3. **As a buyer**, I can view the mandatory revenue split and wallet balance before purchase.
4. **As a platform steward**, I can enforce governance transparency and consistent design tokens across UI.

### 1.3 Acceptance Criteria
- **UploadAssetScreen** supports file input, AI prompt/seed field, and merchandising cues (NEW/Auction/Commission).
- **ComplianceStatusBadge** persists on asset listing and updates status via polling/subscription.
- **Release upload** exists for flagged assets (placeholder handler).
- **RoyaltySplitDisplay** shows split breakdown on detail and checkout views.
- **WalletLynX** placeholder shows token balance.
- **Design tokens** applied: Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878).
- **Interfaces defined**: `Asset`, `RightsCheckResult`, `Payout`, and `AssetListing` including `CID_Ref`, `RoyaltyRate`, `IPHash`.

---

### 1.4 Data Interfaces (Illustrative, Non-Production)
> **Note:** These are *illustrative interface shapes* for governance alignment only. Implementers must bind to Postman schemas.

- **Asset**
  - id, title, description, ownerId, mediaType, mediaUrl, promptSeed, merchandisingCue, usageRightsTier
- **RightsCheckResult**
  - status: `GREEN | YELLOW | RED`, detailMessage, transactionId, updatedAt
- **Payout**
  - creatorPct, platformPct, aidPoolPct, totalAmount
- **AssetListing** *(required fields)*
  - `CID_Ref` (string)
  - `RoyaltyRate` (number)
  - `IPHash` (string)

---

### 1.5 Component Architecture (Modular)
**Proposed Directory Structure (Conceptual):**
- `src/components/`
  - `AssetHoloViewer` (3D viewer placeholder; R3F/Three integration points)
  - `ComplianceStatusBadge` (polling/subscription update, status display)
  - `RoyaltySplitDisplay` (mandatory split breakdown)
  - `WalletLynX` (balance placeholder)
- `src/screens/`
  - `UploadAssetScreen` (upload inputs + prompt/seed)
  - `AssetDetailScreen` (3D viewer, compliance status, royalty split)
  - `CheckoutScreen` (royalty split + wallet balance)

---

### 1.6 ComplianceStatusBadge (Structure & Behavior)
**Display Rules (Non-Production Spec):**
- **GREEN:** IP Verified (Emerald #50C878).
- **YELLOW:** Review Required (Yellow Gold #FFD700).
- **RED:** Hard Veto, >41% Rule Violation (Ruby Red #9B111E).

**Polling/Subscription Contract (Placeholder):**
- During asset listing, badge queries Rights Engine using `transactionId`.
- Update cadence should honor latency budgets (see §2.2 Performance Constraints).

**Release Upload Flow:**
- If status is **YELLOW** or **RED**, show "Attach Release Document" affordance.
- Upload handler is placeholder; storage endpoint must be defined via Postman schemas.

---

### 1.7 UploadAssetScreen (Flow Specification)
- **Inputs:** image/video file(s), title, description, owner, usage rights tier, prompt/seed.
- **Merchandising cues:** fetched list (NEW/Auction/Commission) and must be rendered as selectable tags or badges.
- **Validation:** client-side format checks and file size warnings.

---

### 1.8 RoyaltySplitDisplay (Visual Spec)
- **Required split:** Creator 60%, Platform 30%, Aid Pool 10% (example; Postman overrides).
- **Presentation:** stacked bar or segmented row with labeled percentages.

**Example (Non-Production Visual Description):**
- 60% Emerald segment labeled “Creator”.
- 30% Ruby segment labeled “Platform”.
- 10% Gold segment labeled “Aid Pool”.

---

### 1.9 WalletLynX (Placeholder)
- Display token balance before purchase/payout.
- Error state if balance is unavailable (explicit error handling required).

---

## 2) Architecture Decision Records (ADRs)

### ADR-001: Modular React/TypeScript + PWA-Oriented Design
**Decision:** Use modular component architecture with clear interface contracts to support web + PWA reuse.
**Rationale:** Ensures composability, unit-level testability, and reuse across surfaces.
**Alternatives:** Monolithic view modules (rejected due to maintenance risks).

### ADR-002: 3D Viewer Placeholder via Three.js or R3F
**Decision:** Define placeholder component with integration points for GLTF/GLB loading.
**Rationale:** Provides a clear upgrade path without locking implementation details.

### ADR-003: Polling/Subscription Compliance Badge
**Decision:** Compliance status updates are delivered via polling or subscription (Postman-defined).
**Rationale:** Enables synchronous governance feedback during listing lifecycle.

### ADR-004: Mandatory Revenue Split Transparency
**Decision:** Dedicated UI component to enforce transparency on detail + checkout.
**Rationale:** Explicit alignment with platform governance and user trust.

---

## 3) DPPM Strategy

### 3.1 Decomposition (Linear Issue Shards)
- **Identity Shard:** WalletLynX identity + balance presence.
- **Commerce Shard:** Royalty split breakdown and checkout display.
- **Data Shard:** Asset upload data model + AI prompt/seed.
- **Enterprise Shard:** Compliance governance and release upload workflows.

### 3.2 Constraint Generation
- **Security:** steganographic encryption for asset metadata; environment variables for secrets.
- **Performance:** low-latency status updates; limit 3D viewer load time for GLB under defined budgets.
- **Energy Efficiency:** carbon-aware scheduling for heavy asset processing (async/off-peak guidance).

### 3.3 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** upload payload rejected by schema mismatch.
2. **Deliver Request:** network degradation causes incomplete file transfer.
3. **Validate Request:** client validation incorrectly blocks valid assets.
4. **Update Server State:** rights engine produces stale status due to cache invalidation.
5. **Post Reply:** compliance response format mismatches UI expectations.
6. **Deliver Reply:** polling interval misses updates, causing stale badge.
7. **Validate Reply:** UI misinterprets status enum.
8. **Update Client State:** compliance badge fails to re-render on status change.

---

## 4) Risk & Tradeoff Analysis (Devil’s Advocate)
- **Risk: Overhead from real-time polling** may increase battery/network usage in PWA.
  - *Mitigation:* server-sent events or WebSockets; adaptive polling intervals.
- **Risk: 3D viewer load times** might harm low-end devices.
  - *Mitigation:* progressive loading, LOD assets, and caching.
- **Risk: Revenue split confusion** if split overrides are dynamic.
  - *Mitigation:* canonical display component with clear labels and source-of-truth API.
- **Risk: Compliance badge trust** if latency is high.
  - *Mitigation:* display last-updated time and strong error states.

---

## 5) Governance Anchors (Human Oversight)
1. **Input stream validation:** Verify NotebookLM, Linear, Amplitude, Postman inputs are attached before implementation.
2. **Compliance policy review:** Human review for RED/YELLOW thresholds and >41% rule enforcement.
3. **Revenue split verification:** Legal/finance sign-off for split values.
4. **Security sign-off:** Confirm steganographic watermarking and env-var secret usage.

---

## 6) Brand & Design Tokens
- **Ruby Red:** #9B111E
- **Yellow Gold:** #FFD700
- **Emerald:** #50C878

**Enforcement:** All compliance and revenue split visual states must map to tokens above.

---

## 7) Branching Recommendation (Gitflow)
**Suggested branch name format:** `{layer}/{hub}/{module}/{tag}`
- Example: `frontend/galleriahub/compliance/feature`

---

## 8) Implementation Guidance (Non-Production, Example-Only)
**Component Structure (ComplianceStatusBadge):**
- Inputs: `status`, `lastUpdated`, `transactionId`
- Behaviors: poll/subscribe, map status -> token color, render attach-release CTA

**AssetListing Interface (Required Fields):**
- `CID_Ref: string`
- `RoyaltyRate: number`
- `IPHash: string`

**RoyaltySplitDisplay Example (Visual Outline):**
- Render labeled segments: Creator 60%, Platform 30%, Aid Pool 10%
- Use Emerald / Ruby / Gold tokens
- Present on asset detail + checkout pages

---

## 9) Explicit Non-Production Directive
No production-ready code is provided here. This document defines architecture and governance intent only. Implementation teams must translate these specs into code and bind to the Postman schemas.
