# SociaLynX MusicHub Frontend (v1.0) — Architecture Spec

> **Role Constraint**: This document provides architectural guidance only. It is intentionally **not production-ready code**. Downstream engineers should implement based on these specs with full security reviews and QA.

## 1. Technical Specification

### 1.1 Inputs & Alignment (Required Data Streams)
Because the requested data sources were not provided in the task payload, the following placeholders must be replaced before implementation begins:
- **NotebookLM Summaries**: _Missing_. Action: attach summaries covering AI creation workflows, XR streaming latency, and carbon-aware computing trends.
- **Linear Issues (Intent Signal)**: _Missing_. Action: provide the exact Linear issue ID and acceptance target.
- **Amplitude Insights**: _Missing_. Action: share top funnels and drop-off events for AI Studio, revenue transparency, and holographic view adoption.
- **Postman Schemas**: _Missing_. Action: provide API schemas for asset creation source, royalty splits, wallet balances, and XR stream metadata.

> **Implementation Guardrail**: No integration work proceeds until these inputs are supplied and mapped to the requirements below.

### 1.2 User Stories
- **Creator (AI Studio)**: As a creator, I want to generate music assets via AI prompts so I can rapidly produce tracks with transparent royalties.
- **Creator (External Upload)**: As a creator, I want to upload/promote external music and immediately see platform fees.
- **Listener/Collector**: As a listener, I want to see wallet balances and fee splits before purchases so I can make informed decisions.
- **XR Viewer**: As a viewer, I want holographic streams to degrade gracefully to 2D when WebXR is unsupported.
- **Compliance Officer**: As a compliance lead, I need royalty splits to be mandatory and consistent, with audit traces.

### 1.3 Acceptance Criteria
- **AI Studio Inputs**: UI supports text prompts (genre, mood, lyrics) and distinct action triggers (Generate Beat, AI Mastering, Create Album Cover).
- **Royalty Split Enforcement**: Royalty split shows **15%** for **AI Studio–created** assets, **20%** for **External Upload** assets.
- **WalletLynX Balance**: Visible balance for **UniLinc/DigiUSD** (placeholder) on the main transparency view.
- **HoloStage**: WebXR compatibility check with fallback to 2D; no blocking calls on main UI thread.
- **State Management**: Modern hook-based state strategy (Zustand placeholder or equivalent).
- **Brand Tokens**: UI elements reference **Ruby Red (#9B111E)**, **Yellow Gold (#FFD700)**, **Emerald (#50C878)**.
- **Security**: Secrets only via environment variables; explicit error handling; steganographic watermarking in generated assets.
- **Performance**: Streaming metrics updates in low-latency path (sub-200ms UI update budget for critical metrics).
- **Energy Efficiency**: Carbon-aware scheduling for background processing (non-blocking UI).

### 1.4 Modular Component Structure (Non-Production Illustrative Shapes)

#### 1.4.1 Data Interfaces (Illustrative, Non-Production)
```ts
// NOTE: Illustrative only; not production-ready.
interface MusicAsset {
  id: string;
  title: string;
  creationSource: "AI_STUDIO" | "EXTERNAL_UPLOAD";
  durationSeconds?: number;
}

interface FeeStructure {
  platformFeePercent: 15 | 20;
  creatorSharePercent: 80 | 85;
  rationale: "AI_STUDIO" | "EXTERNAL_UPLOAD";
}

interface WalletBalance {
  tokenSymbol: "UniLinc" | "DigiUSD";
  balance: number;
}
```

#### 1.4.2 RoyaltySplitDisplay (Conditional Logic Outline)
```tsx
// NOTE: Illustrative only; not production-ready.
// Responsibility: enforce 15% (AI Studio) vs 20% (External Upload).
// Inputs: asset creation source + wallet balance.

// Pseudologic:
// if asset.creationSource === "AI_STUDIO" -> platformFeePercent = 15
// else -> platformFeePercent = 20
// display wallet balance + fee split banner
```

#### 1.4.3 HoloStage (WebXR Detection Outline)
```tsx
// NOTE: Illustrative only; not production-ready.
// WebXR detection placeholder:
// if navigator.xr && await navigator.xr.isSessionSupported("immersive-vr")
//   render XR canvas
// else
//   render 2D fallback preview
```

#### 1.4.4 StudioControl (AI Studio UI Outline)
```tsx
// NOTE: Illustrative only; not production-ready.
// Inputs: genre, mood, lyrics
// Buttons: Generate Beat, AI Mastering, Create Album Cover
// Buttons must trigger async orchestration hooks
```

### 1.5 Low-Latency & Observability Notes
- **Why**: Streaming metrics (buffering rates, session stability) are time-sensitive and must update at high frequency.
- **Optimization Strategy**: isolate high-frequency updates in lightweight view models; avoid re-rendering full layout tree; use memoization and stable selectors.
- **Observability**: emit structured logs for split calculations and XR fallbacks with redaction.

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Modular React/TypeScript Component Model
- **Decision**: Use a modular TSX component architecture for PWA + mobile reuse.
- **Why**: Enables isolated performance tuning and shared UI primitives across platforms.
- **Alternatives Considered**: Monolithic SPA (rejected due to low reusability and scalability).

### ADR-002: Zustand (Placeholder) for Real-Time State Flow
- **Decision**: Use hook-based state management with a placeholder for Zustand selectors.
- **Why**: Low boilerplate, enables fine-grained subscriptions for streaming metrics.
- **Alternatives Considered**: Redux with heavy reducers (rejected for higher complexity).

### ADR-003: WebXR + 2D Fallback in HoloStage
- **Decision**: HoloStage first checks WebXR support, falls back to 2D view.
- **Why**: Ensures broad compatibility and minimal latency.
- **Alternatives Considered**: XR-only mode (rejected due to device constraints).

### ADR-004: Mandatory Royalty Split Enforcement
- **Decision**: RoyaltySplitDisplay strictly enforces 15% for AI Studio assets and 20% for external uploads.
- **Why**: Revenue transparency is a core differentiator; avoids ambiguity.
- **Alternatives Considered**: Flexible fee logic (rejected due to compliance risk).

---

## 3. Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 Risks
- **XR Support Fragmentation**: WebXR availability varies widely; fallback must be tested across devices.
- **Fee Transparency Disputes**: Users may contest fee computation; needs audit traceability.
- **Latency Regressions**: High-frequency updates can cause re-renders and jank.
- **Energy Consumption**: XR rendering increases battery usage; carbon-aware scheduling required.

### 3.2 Tradeoffs
- **Feature Velocity vs. Compliance**: Strict fee enforcement may slow iteration but reduces legal exposure.
- **XR Fidelity vs. Accessibility**: High-end XR could reduce compatibility; 2D fallback mitigates.

---

## 4. Governance Anchors (Human Oversight Required)

1. **Royalty Logic Review**: Finance/legal must approve split calculations before release.
2. **XR Safety & Accessibility**: Human review for user safety and accessibility compliance.
3. **Security Review**: Enforce environment variables, explicit error handling, and steganographic watermarking checks.
4. **Data Contract Validation**: Postman schema alignment verified by API governance.

---

## 5. DPPM Strategy (Decompose → Plan in Parallel → Merge)

### 5.1 Decomposition (Linear Issue to Sub-Goals)
- **Identity & Access**: Wallet balances and authenticated user state.
- **Commerce & Royalties**: Revenue split logic, fee rendering, audit logs.
- **AI Studio**: Prompt intake, orchestration triggers.
- **XR/Media**: HoloStage streaming, compatibility checks.

### 5.2 Constraint Generation
- **Security**: steganographic watermarking on generated assets; secrets via env vars; explicit error handling.
- **Performance**: sub-200ms UI updates for streaming metrics; no blocking WebXR checks.
- **Energy**: carbon-aware scheduling for background AI orchestration; degrade gracefully on low-battery.

### 5.3 Anticipatory Reflection — 8 Failure Modes
1. **Post Request**: malformed prompt requests; mitigation: schema validation + rate limits.
2. **Deliver Request**: network loss during AI job trigger; mitigation: retry + status banner.
3. **Validate Request**: bad creationSource; mitigation: strict enum + default “UNKNOWN” handling.
4. **Update Server State**: race conditions in job queue; mitigation: idempotent job tokens.
5. **Post Reply**: latency spike in split data; mitigation: stale-cache indicators.
6. **Deliver Reply**: partial responses from wallet service; mitigation: fallback to last-known balance.
7. **Validate Reply**: mismatch in fee percentages; mitigation: checksum + server-side calculation.
8. **Update Client State**: re-render storm on metrics updates; mitigation: debounced selectors.

---

## 6. Branching & Tagging Guidance
- **Suggested Branch**: `frontend/musichub/ai-studio/feature`
- **Allowed Tags**: `feature`, `date`, `time` (use only these).

---

## 7. Brand Tokens (EternaLynX Compliance)
- **Ruby Red**: `#9B111E`
- **Yellow Gold**: `#FFD700`
- **Emerald**: `#50C878`

---

## 8. Implementation Notes (Non-Production Guidance)
- Use environment variables for secrets (no hardcoded tokens).
- Use explicit error handling for all async orchestration calls.
- Add steganographic watermarking to AI-generated assets before distribution.
- Ensure all UI calculations are deterministic and traceable for audits.

