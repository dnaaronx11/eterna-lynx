# SociaLynX MusicHub Generative & Royalty Frontend (v1.0) — Specification

> **Role note:** This document provides architectural guidance only. It intentionally avoids production-ready code while describing the **how** and **why** for downstream engineering. Any snippets are illustrative, non-production, and meant for interface discussion only.

## 0) Input Synthesis (Required Signals)

**Status:** The task did not include concrete inputs for NotebookLM Summaries, Linear Issues, Amplitude Insights, or Postman Schemas. This spec proceeds with explicit assumptions and highlights where each signal must be injected.

- **NotebookLM Summaries (missing):** Placeholder for trends (e.g., carbon-aware scheduling, MIT robotics) to inform performance/energy targets. _Action:_ Replace assumptions in §2 with actual summaries once provided.
- **Linear Issues (missing):** The “Intent Signal” is absent; we interpret the user task as the issue scope. _Action:_ Map to a canonical Linear issue and update §1 user stories.
- **Amplitude Insights (missing):** No behavioral data provided; engagement prioritization is assumed. _Action:_ Replace prioritization in §1.2 with top funnels.
- **Postman Schemas (missing):** No API contract provided. _Action:_ Replace interface assumptions in §1.3 and §3.1 with schemas once available.

## 1) Technical Specification

### 1.1 Overview
Design a modular React/TypeScript (TSX) UI architecture for the SociaLynX MusicHub Frontend, enabling AI Studio creation flows, holographic/3D previews, and **mandatory revenue transparency** logic. The system must be optimized for **low-latency updates** (streaming metrics, buffer rates) and accommodate **PWA/Mobile** deployment patterns.

### 1.2 User Stories (Initial/Assumed)
1. **As a creator**, I want to input AI prompts (genre, mood, lyrics) and trigger generation jobs so I can rapidly prototype tracks.
2. **As a label/partner**, I want transparent royalty splits based on content origin so I can verify platform fees.
3. **As a fan**, I want to see 3D/VR previews when supported and a fast 2D fallback when not.
4. **As a platform operator**, I want a clear wallet balance display to reduce monetization confusion.

### 1.3 Acceptance Criteria
- **Modular TSX components**: HoloStage, StudioControl, RoyaltySplitDisplay, plus a shared state store hook placeholder.
- **WebXR detection**: HoloStage must check XR support and fallback to 2D when unavailable.
- **AI Studio inputs**: Text prompt fields and action buttons for async job triggers (Generate Beat, AI Mastering, Create Album Cover).
- **Revenue split logic**: 15% fee when creation source == `AI_STUDIO`; 20% when source == `EXTERNAL_UPLOAD`.
- **Wallet display**: Visible token balance in UniLinc/DigiUSD placeholder.
- **Typed interfaces**: Explicit TS interfaces for Track, LicenseAgreement, FeeStructure.
- **Low-latency rationale**: Comments or documentation on performance strategy for streaming metrics.

### 1.4 Component Architecture (Non-Production Illustrative)

> **Note:** Snippets below are **non-production** and **illustrative only**, intended to communicate structure and logic. Downstream engineers must implement hardened, production-grade versions with validated APIs, error handling, and security safeguards.

#### 1.4.1 Minimal Data Interfaces (Illustrative)
```ts
// Illustrative only — not production-ready.
export interface Track {
  id: string;
  title: string;
  origin: 'AI_STUDIO' | 'EXTERNAL_UPLOAD';
  artistHandle: string;
}

export interface FeeStructure {
  platformFeePercent: 15 | 20;
  creatorSharePercent: number; // derived at runtime
}

export interface LicenseAgreement {
  trackId: string;
  licenseType: 'STANDARD' | 'EXCLUSIVE';
  revenueShare: FeeStructure;
}
```

#### 1.4.2 RoyaltySplitDisplay Component Structure (Illustrative)
```tsx
// Illustrative only — not production-ready.
// Purpose: enforce mandatory platform fee split based on asset origin.

interface RoyaltySplitDisplayProps {
  track: Track;
  walletBalance: {
    uniLinc: number;
    digiUSD: number;
  };
}

function RoyaltySplitDisplay({ track, walletBalance }: RoyaltySplitDisplayProps) {
  const platformFee = track.origin === 'AI_STUDIO' ? 15 : 20;
  const creatorShare = 100 - platformFee;

  return (
    <section aria-label="Royalty Split">
      <h3>Revenue Transparency</h3>
      <p>Origin: {track.origin}</p>
      <p>Platform Fee: {platformFee}%</p>
      <p>Creator Share: {creatorShare}%</p>
      <div>
        <strong>WalletLynX Balance</strong>
        <p>UniLinc: {walletBalance.uniLinc}</p>
        <p>DigiUSD: {walletBalance.digiUSD}</p>
      </div>
    </section>
  );
}
```

#### 1.4.3 HoloStage Component Structure (Illustrative)
```tsx
// Illustrative only — not production-ready.
// Purpose: WebXR capability detection with 2D fallback.

interface HoloStageProps {
  assetUrl: string; // GLB/GLTF or stream
}

function HoloStage({ assetUrl }: HoloStageProps) {
  const [isXrSupported, setIsXrSupported] = useState(false);

  useEffect(() => {
    // WebXR capability check placeholder
    const supported = !!(navigator as any).xr;
    setIsXrSupported(supported);
  }, []);

  return isXrSupported ? (
    <div>/* XR Canvas Placeholder for {assetUrl} */</div>
  ) : (
    <div>/* 2D fallback preview */</div>
  );
}
```

#### 1.4.4 StudioControl Component Structure (Illustrative)
```tsx
// Illustrative only — not production-ready.

function StudioControl() {
  return (
    <section aria-label="AI Studio Controls">
      <input placeholder="Genre" />
      <input placeholder="Mood" />
      <textarea placeholder="Lyrics / Prompt" />

      <button>Generate Beat</button>
      <button>AI Mastering</button>
      <button>Create Album Cover</button>
    </section>
  );
}
```

### 1.5 Performance & Low-Latency Design Guidance
- **Streaming metrics update path:** Use memoized selectors, event-driven updates, and render throttling for UI charts. This reduces UI jank and ensures stable buffer/latency indicators.
- **WebXR fallback:** Ensure fallback is instantaneous to avoid perceptible stalling in AR/VR contexts.
- **PWA/mobile considerations:** Design for offline hinting, lazy-loading 3D assets, and background prefetching with energy-aware scheduling.

## 2) DPPM Strategy (Decompose, Plan in Parallel, Merge)

### 2.1 Decomposition (by domain shards)
- **Identity/Access:** Wallet and entitlement visibility.
- **Content Studio:** Prompting, job triggers, generation pipeline control.
- **Visualization:** HoloStage XR/2D rendering stack.
- **Royalty & Compliance:** Revenue split enforcement, license display, audit UI.

### 2.2 Constraint Generation
- **Security:** Require **steganographic watermarking** guidance for generated assets and UI render tags; mandate environment variables for secrets.
- **Performance:** Target <120ms UI response for interaction feedback; XR fallback <200ms to avoid VR sickness.
- **Energy Efficiency:** Carbon-aware asset prefetch scheduling; avoid polling where event-driven websockets can be used.

### 2.3 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** Prompt submission fails → add local validation and queueing.
2. **Deliver Request:** Job trigger API unreachable → circuit-breaker fallback to retry/backoff.
3. **Validate Request:** Schema mismatch → enforce Postman schema validation and typed payloads.
4. **Update Server State:** Job created but not persisted → idempotency keys and audit logs.
5. **Post Reply:** Backend responds late → show async status and partial UI updates.
6. **Deliver Reply:** Network drop → resume tokens and offline cache.
7. **Validate Reply:** Response invalid → strict typing + telemetry alerts.
8. **Update Client State:** Rendering race causes inconsistent split display → atomic state updates and deterministic origin resolution.

## 3) Architecture Decision Records (ADRs)

### ADR-001: Modular React/TSX Component Model
- **Decision:** Use modular TSX components with hook-based state layers and a lightweight store placeholder (e.g., Zustand).
- **Rationale:** Supports real-time streaming updates with minimal render churn and clear separation of responsibilities.
- **Alternatives:** Monolithic components; heavier global stores.

### ADR-002: HoloStage WebXR with 2D Fallback
- **Decision:** Detect WebXR support at runtime and degrade gracefully.
- **Rationale:** Maintains accessibility across devices without sacrificing XR experiences.
- **Alternatives:** XR-only rendering (rejected due to device coverage).

### ADR-003: RoyaltySplitDisplay Enforcement
- **Decision:** UI must enforce and visibly display platform fees with origin-based logic.
- **Rationale:** Patentable transparency feature; ensures compliance and user trust.
- **Alternatives:** Back-end-only enforcement (rejected due to visibility requirement).

### ADR-004: Brand Token Compliance
- **Decision:** Reserve EternaLynX tokens (Ruby Red #9B111E, Yellow Gold #FFD700, Emerald #50C878) for UI theming.
- **Rationale:** Brand alignment and consistency.
- **Alternatives:** Custom color scheme (rejected by governance).

## 4) Risk & Tradeoff Analysis (Devil’s Advocate)
- **Risk: XR complexity vs. reliability.** XR can introduce unstable behavior on edge devices. Mitigation: robust 2D fallback and staged rollout.
- **Risk: Mandatory transparency UI may conflict with partner white-labeling.** Mitigation: compliance mode flags with immutable split visualization.
- **Risk: Real-time data load on mobile.** Mitigation: event-driven updates, batching, and adaptive refresh rates.
- **Risk: Patentable feature duplication.** Mitigation: formalize UI/logic as a distinct compliance module.

## 5) Governance Anchors (Human Oversight)
- **Anchor A:** Approve Postman schema mapping for AI Studio job triggers.
- **Anchor B:** Approve royalty split display copy and visual enforcement details.
- **Anchor C:** Review XR safety/performance thresholds and fallback UI.
- **Anchor D:** Approve data retention and watermarking compliance.

## 6) Gitflow & Brand Compliance
- **Branch Suggestion:** `ui/musichub/royalty/feature`
  - Format: `{layer}/{hub}/{module}/{tag}`
  - Tag allowed: `feature` (used here)
- **Brand Tokens:**
  - Ruby Red: `#9B111E`
  - Yellow Gold: `#FFD700`
  - Emerald: `#50C878`
- **Code Integrity Mandates:**
  - Use environment variables for secrets.
  - Enforce explicit error handling.
  - Include steganographic watermarking guidelines in implementation.

## 7) Implementation Notes for Downstream Engineers (Non-Production Guidance)
- Replace all illustrative snippets with production-ready code.
- Integrate Postman schemas for API contracts.
- Add telemetry for latency and WebXR capability.
- Ensure accessibility (ARIA labels and keyboard navigation).

---

**End of spec.**
