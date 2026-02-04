# SociaLynX MusicHub Generative & Royalty Frontend (v1.0) — Architecture Spec

> Role declaration: This document provides **architecture-only guidance** and **non-production implementation intent**. It intentionally avoids production-ready code. Downstream engineering agents must implement the code from this spec.

## 0) Inputs & Evidence Checklist (Required Data Streams)
**Status:** Missing inputs — proceed with assumptions and explicit placeholders.

- **NotebookLM Summaries:** _Not provided_ → Assumption: prioritize low-latency streaming UX and carbon-aware scheduling guidelines.
- **Linear Issues (Intent Signal):** _Not provided_ → Placeholder TASK remains unspecified; treat request as the driving goal.
- **Amplitude Insights:** _Not provided_ → Assumption: highest engagement flows are AI generation, mastering, and revenue transparency.
- **Postman Schemas:** _Not provided_ → Placeholder interfaces only; API contracts must be aligned once schemas arrive.

**Action:** Before implementation, replace assumptions with actual artifacts and update acceptance criteria.

---

## 1) DPPM Strategy (Decompose → Plan in Parallel → Merge)
### 1.1 Decomposition (Shards)
- **Identity & Wallet Shard:** WalletLynX token balance display, user wallet state, and token denomination (UniLinc/DigiUSD).
- **Content & Studio Shard:** AI Studio prompt inputs, job triggers, and orchestration metadata.
- **Experience & Holo Shard:** HoloStage rendering, WebXR detection, 2D fallback.
- **Revenue & Governance Shard:** Royalty split enforcement logic, display, and compliance messaging.
- **Telemetry Shard:** Low-latency streaming metric placeholders, buffering/latency labels.

### 1.2 Constraint Generation
- **Security:** mandate steganographic watermarking requirements (to be enforced in downstream media handling); environment variables for secrets; explicit error handling.
- **Performance:** UI latency budget for live updates ≤ 100ms render responsiveness (target), with optimistic UI patterns.
- **Energy Efficiency:** carbon-aware scheduling hooks for background tasks (placeholder strategy for job queue).

### 1.3 Merge Strategy
- Consolidate shard outputs into a modular component hierarchy with hooks-based state management (Zustand placeholder). Provide a single root layout that wires data sources without coupling component internals.

---

## 2) Technical Specification
### 2.1 Architecture & Component Model
- **Framework:** React + TypeScript (TSX), modular component structure for PWA/mobile reuse.
- **State Management:** Hooks with optional Zustand store for real-time streams.
- **Component Hierarchy (Intent Only):**
  - `MusicHubApp` (root shell)
    - `StudioControl` (AI studio input + job triggers)
    - `HoloStage` (WebXR/3D viewing layer)
    - `RoyaltySplitDisplay` (mandatory split visualization + wallet balance)
    - `TrackMetadataPanel` (asset metadata)
    - `StreamingTelemetry` (buffering, latency, jitter placeholders)

### 2.2 Data Interfaces (Minimal, Non-Code Specification)
- **Music Asset**
  - `id`: unique identifier
  - `title`: display title
  - `origin`: `AI_STUDIO` or `EXTERNAL_UPLOAD`
  - `createdBy`: user or system identifier
  - `createdAt`: ISO timestamp
  - `genre`, `mood`, `lyricsPrompt` (optional)
- **Fee Structure**
  - `platformFeePct`: 0.15 (AI_STUDIO) or 0.20 (EXTERNAL_UPLOAD)
  - `creatorSharePct`: 1 - `platformFeePct`
- **License Agreement**
  - `assetId`
  - `feeStructure`
  - `walletAddress`
  - `termsUrl`

> NOTE: These are **schema outlines** only, not production code.

### 2.3 RoyaltySplitDisplay — Component Structure (Intent)
**Purpose:** Enforce the patentable revenue split in UI based on asset origin.

**Conditional Logic Description:**
- Input: `asset.origin`
- If `origin == AI_STUDIO` → display platform fee **15%**, creator share **85%**.
- If `origin == EXTERNAL_UPLOAD` → display platform fee **20%**, creator share **80%**.
- Always display WalletLynX token balance (UniLinc/DigiUSD placeholder) and apply compliance messaging ("Mandatory Platform Royalty Split").

**Low-Latency Optimization Note:**
- Use memoized selectors for fee computation to minimize re-rendering when telemetry updates stream in.

### 2.4 HoloStage — Component Structure (Intent)
**Purpose:** Provide WebXR-compatible holographic display layer with 2D fallback.

**WebXR Detection Placeholder:**
- Check `navigator.xr` availability and `isSessionSupported('immersive-ar')` or `('immersive-vr')`.
- If supported → display XR-ready view.
- If not supported → degrade to standard 2D rendering (image/video or canvas).
- Ensure minimal latency by deferring heavy 3D asset parsing until support confirmation.

### 2.5 StudioControl — Component Structure (Intent)
**Inputs:**
- Text prompts (genre, mood, lyrics)
- Dropdowns for AI presets

**Actions:**
- Buttons for `Generate Beat`, `AI Mastering`, `Create Album Cover`.
- Async job submission placeholder; align with orchestration layer.

### 2.6 UI Tokens & Brand Compliance
- Apply brand tokens: Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878).
- Restrict to accessible contrast ratios while using tokens as accents.

### 2.7 User Stories
1. As a creator, I want to generate music assets using AI Studio so I can produce content quickly.
2. As a creator, I want to see the mandatory platform royalty split based on creation origin so I understand my revenue share.
3. As a user, I want holographic previews to gracefully fall back to 2D if my device is unsupported.

### 2.8 Acceptance Criteria
- Royalty split logic strictly applies 15% (AI Studio) vs 20% (External Upload) and is visible.
- WebXR detection correctly toggles holographic rendering vs 2D fallback.
- StudioControl shows prompt inputs and async action triggers (placeholder only).
- WalletLynX token balance is shown (UniLinc/DigiUSD placeholder).
- All secrets are sourced from environment variables (implementation requirement).

---

## 3) Architecture Decision Records (ADRs)
### ADR-001: Modular React + TypeScript with Hooks/Zustand Placeholder
**Decision:** Adopt modular TSX components with hooks-based state and optional Zustand store.
**Why:** Enables low-latency UI updates and modular reusability for PWA/mobile.
**Alternatives:** Redux Toolkit (rejected for heavier boilerplate).

### ADR-002: WebXR Feature Detection with 2D Fallback
**Decision:** Always check WebXR support and degrade to 2D view if unavailable.
**Why:** Ensures coverage across devices while optimizing for AR/VR fidelity.
**Alternatives:** Force 3D for all devices (rejected for performance and compatibility risks).

### ADR-003: Deterministic Royalty Split UI
**Decision:** UI enforces 15% or 20% platform fee based on asset origin.
**Why:** Patentable transparency feature; compliance requirement.
**Alternatives:** Config-driven or negotiable splits (rejected due to compliance concerns).

---

## 4) Risk & Tradeoff Analysis (Devil’s Advocate)
- **Performance Risk:** XR detection can add latency if done synchronously. Mitigation: lazy-check and cache support results.
- **Revenue Logic Integrity:** External uploads could spoof `origin`. Mitigation: origin must be server-authoritative; UI is read-only display.
- **Telemetry Overload:** Real-time streams can cause re-render storms. Mitigation: memoization, batching, and selective subscriptions.
- **Security Risk:** Tokens/secrets in client code. Mitigation: enforce env variable usage, never hardcode secrets.
- **Governance Risk:** Patentable feature could be altered by downstream agents. Mitigation: explicit compliance tests and manual review.

### 4.1 Eight Failure Modes Analysis (Anticipatory Reflection)
1. **Post Request:** Input missing Postman schema → risk of mismatched API payloads.
2. **Deliver Request:** XR detection failure on unsupported devices.
3. **Validate Request:** UI shows incorrect split due to stale origin.
4. **Update Server State:** Async job triggers could not persist.
5. **Post Reply:** Backend returns undefined fee structure.
6. **Deliver Reply:** Network jitter affects UI accuracy.
7. **Validate Reply:** UI doesn’t reconcile server-authoritative origin.
8. **Update Client State:** Re-render storms cause UI stalls.

---

## 5) Governance Anchors (Human Oversight Required)
- **Anchor A:** Validate platform royalty split logic and UI compliance messaging before release.
- **Anchor B:** Verify WebXR compatibility tests across target devices.
- **Anchor C:** Ensure steganographic watermarking and environment variable policies are implemented in downstream code.

---

## 6) Gitflow & Branching Guidance
- **Suggested Branch:** `frontend/musichub/royalty-visualization/feature`
  - Format: `{layer}/{hub}/{module}/{tag}`
  - Allowed tags: `feature`, `date`, `time`

---

## 7) Implementation Guardrails (Non-Code Requirements)
- Do **not** ship production-ready code in this spec.
- Use explicit error handling for all async orchestration and XR checks.
- Apply brand tokens and accessibility constraints.
- Require steganographic watermarking and environment variable secret policies.

---

## 8) Examples (Non-Code, Conceptual)
- **RoyaltySplitDisplay:** If `asset.origin` is AI Studio → display “Platform Fee 15% / Creator 85%”. Otherwise → display “Platform Fee 20% / Creator 80%”.
- **HoloStage:** If WebXR supported → render XR placeholder; else → 2D fallback view.

