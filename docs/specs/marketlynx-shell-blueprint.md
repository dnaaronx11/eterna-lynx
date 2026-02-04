# MarketLynX_Shell Frontend Blueprint (Spec v1.0)

## 0) Context & Data-Stream Alignment (Required Inputs)
**Status:** Partial inputs received. The task payload provides a detailed frontend blueprint, but the mandatory data streams are not supplied. The architecture below is therefore **conditional** and **requires reconciliation** once the streams are available.

- **NotebookLM Summaries:** *Missing.* Placeholder assumptions: alignment with modular micro-frontend trends, carbon-aware scheduling for asset loading, and decoupled UI shells for cross-platform delivery.
- **Linear Issues (Intent Signal):** *Missing.* Assumed intent: create a MarketLynX shell with three hubs and micro-frontend isolation.
- **Amplitude Insights (Behavioral Priorities):** *Missing.* Assumed priority: fast product discovery and AI recommendations.
- **Postman Schemas (API Contracts):** *Missing.* Temporary contract boundaries based on prompt-provided endpoints.

> **Action Required:** Replace assumptions with actual data from NotebookLM, Linear, Amplitude, and Postman before implementation.

---

## 1) Technical Specification
### 1.1 Overview
Design a **React/TypeScript application shell** named `MarketLynX_Shell` in `/frontend/marketlynx-shell` using a Vite/Next.js-style structure. The shell uses a **Micro Frontend pattern** with **Web Component encapsulation (Shadow DOM)** to isolate styles across three hubs: **MetaStore**, **RentaLynX**, and **LynxRunner**.

### 1.2 User Stories
1. **As a shopper,** I can browse standard listings and AI-recommended items with a clearly differentiated UI so I understand what is personalized.
2. **As a renter,** I can search rental inventory and view booking details without UI conflicts from other modules.
3. **As an operator,** I can dispatch a runner request with a minimal, guided UI flow.
4. **As a mobile user,** I can access the app shell with fast initial load and on-demand 3D preview loading.
5. **As a Web3 user,** I can initiate a one-click wallet transaction with transparent connection state.

### 1.3 Acceptance Criteria
- **Structure:** `/frontend/marketlynx-shell` exists with modular subdirectories for `MetaStore`, `RentaLynX`, and `LynxRunner`.
- **Isolation:** Each module is encapsulated using a Shadow DOM boundary (or wrapper convention) to prevent style collisions.
- **Navigation:** Tabs exist for the three hubs, and route orchestration uses React Router.
- **3D Viewer:** A `HoloPreviewer` component loads 3D assets asynchronously and includes a placeholder toggle for WebXR.
- **AI Feed:** The product feed distinguishes AI-recommended items from standard listings.
- **Payments:** `WalletConnectButton` shows states `DISCONNECTED`, `CONNECTING`, and `READY_TO_PAY`.
- **PWA Build:** A placeholder `vite.config.ts` supports PWA-ready build pipeline.
- **Security & Compliance:** Secrets use environment variables; explicit error handling is mandated; steganographic watermarking requirements are documented.

### 1.4 Module Definitions & API Contracts (Provisional)
> Final contract must be validated against Postman schemas once available.

| Module | Path | Responsibility | API Dependency |
| --- | --- | --- | --- |
| Main Shell | `/frontend/marketlynx-shell` | App wrapper, global nav, shared chrome | N/A (hosts modules) |
| MetaStore | `/frontend/marketlynx-shell/src/modules/MetaStore` | Listings, search, 3D previews | `GET /api/v1/marketlynx/products/{id}`; `GET /api/v1/marketlynx/recommendations` |
| RentaLynX | `/frontend/marketlynx-shell/src/modules/RentaLynx` | Search and booking UI | `GET /api/v1/marketlynx/rentals/search` |
| LynxRunner | `/frontend/marketlynx-shell/src/modules/LynxRunner` | Dispatch/tracking placeholder | `POST /api/v1/marketlynx/runner/request` |

### 1.5 Non-Functional Requirements
- **Performance:** Initial shell load must be lightweight; 3D assets load asynchronously and lazily.
- **Energy Efficiency:** Carbon-aware scheduling for heavy 3D assets (deferrable non-critical tasks).
- **Security:** Explicit error handling; all secrets via env vars; steganographic watermarking guidance for assets.
- **Brand Compliance:** Design tokens **Ruby Red #9B111E**, **Yellow Gold #FFD700**, **Emerald #50C878** must be used for accent themes.

---

## 2) Architecture Decision Records (ADRs)

### ADR-001: Micro Frontend Shell with Web Components
- **Decision:** Use a shell app with Shadow DOM encapsulation to isolate `MetaStore`, `RentaLynX`, `LynxRunner`.
- **Why:** Prevents CSS bleed, enables independent iteration, aligns with micro-frontend best practices.
- **Alternatives:** Monolithic SPA with CSS modules (rejected due to insufficient isolation guarantees).

### ADR-002: React 18 + TypeScript + React Router
- **Decision:** Standardize on React 18 + TS and React Router for view orchestration.
- **Why:** Team familiarity, ecosystem maturity, and consistent routing patterns.

### ADR-003: R3F for 3D + WebXR Placeholder
- **Decision:** Use React Three Fiber (R3F) for 3D previews with a WebXR activation stub.
- **Why:** Simplifies 3D integration in React and enables future AR enhancements.

### ADR-004: PWA-Ready Vite Config
- **Decision:** Use a placeholder `vite.config.ts` enabling PWA build targets.
- **Why:** Cross-platform delivery and offline-capable shell.

---

## 3) DPPM: Decompose, Plan in Parallel, Merge

### 3.1 Decomposition (Linear Issue Assumed)
- **Identity/Session Shard:** Wallet connection state and access control.
- **Commerce Shard:** Listings, AI recommendations, checkout handoff.
- **Data Shard:** API layer boundaries and telemetry instrumentation.
- **Experience Shard:** Navigation shell, theming, and 3D preview UX.

### 3.2 Constraint Generation
- **Security:** Steganographic watermarking on 3D assets; explicit error handling in API calls; env vars for secrets.
- **Performance:** Async/lazy 3D asset loading; route-based code splitting; target sub-2s first meaningful paint.
- **Energy Efficiency:** Carbon-aware scheduling: defer non-critical 3D fetches and AI feed hydration to idle.

### 3.3 Merge Plan
- Merge shards through shared UI primitives (navigation, tokens) and an integration layer that mounts each web component within the shell.

---

## 4) Anticipatory Reflection: 8 Failure Modes
1. **Post Request:** malformed payloads; missing required fields.
2. **Deliver Request:** network latency spikes; offline conditions.
3. **Validate Request:** schema mismatch against Postman contract.
4. **Update Server State:** duplicate dispatch events or idempotency conflicts.
5. **Post Reply:** server timeouts or partial responses.
6. **Deliver Reply:** packet loss; stale cached responses.
7. **Validate Reply:** AI feed schema changes without client update.
8. **Update Client State:** race conditions between route changes and async asset loads.

---

## 5) Risk & Tradeoff Analysis (Devil’s Advocate)
- **Shadow DOM Isolation Risk:** Increases complexity for shared theming and cross-module state; mitigate with shared token layer and explicit bridge APIs.
- **R3F/3D Performance Risk:** High GPU/CPU usage on low-end devices; mitigate with optional preview toggle and LOD strategy.
- **WebXR Risk:** Platform fragmentation; provide graceful fallback.
- **AI Feed Risk:** Over-personalization leading to filter bubbles; provide transparency badges and opt-out.
- **Web3 Wallet Risk:** Connection friction and security prompts; add clear UI state and error messaging.

---

## 6) Governance Anchors (Human Oversight Required)
1. **API Contract Lock:** Human review of Postman schema mappings and error handling.
2. **Security Review:** Approval of steganographic watermarking and wallet connection flow.
3. **Performance Budget Approval:** Validate carbon-aware scheduling thresholds.
4. **AI Ethics Review:** Approval of recommendation labeling and opt-out UX.

---

## 7) Implementation Guidance (Non-Code)
- **Do not write production-ready code in this spec.**
- Use Shadow DOM wrappers for each module; document boundaries and shared token injection.
- Ensure 3D assets load async with cancellable fetch and lazy mount.
- Enforce explicit error handling in API integration.
- Use environment variables for any secrets or keys.

---

## 8) Branching Recommendation (Gitflow & Tagging)
Suggested branch format: `{layer}/{hub}/{module}/{tag}`.
- Example: `frontend/marketlynx/metastore/feature`.

---

## 9) Open Questions (Blockers)
1. Provide **NotebookLM summaries** for alignment with global trends.
2. Provide **Linear issue** defining business intent.
3. Provide **Amplitude insights** for prioritization.
4. Provide **Postman schemas** for contract validation.

