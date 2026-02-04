# EternaLynX_Frontend_v1 — WebLynX Shell (Architecture Spec)

## Task Context & Input Streams
**Task:** EternaLynX_Frontend_v1 (design a WebLynX shell for EternaLynX).  
**Required input streams:** NotebookLM Summaries, Linear Issues, Amplitude Insights, Postman Schemas.  
**Status:** These streams were **not provided** in the request. This spec proceeds with placeholders and explicit assumptions; it must be updated once the streams are supplied.  

---

## 1. Technical Specification

### 1.1 Scope
Design a robust, cross-platform application shell named **WebLynX** using React/Next.js (or equivalent), located at `/frontend/weblynx-shell`, that houses multiple **Micro Frontends** as **Web Components** with **Shadow DOM** encapsulation. The shell must support **dual-mode browsing (Web2 vs Web3)**, **Unified Identity + Continuous Authentication**, and a persistent **Transparency & Controls** panel for consent and GDPR Right to Erasure.

### 1.2 Decompose (DPPM Strategy — Decomposition)
**Linear Issue (Intent Signal):** *Not provided — placeholder.*  
Decomposed sub-goals:
1. **Identity & Access Shard**  
   - Unified Identity login (middleware).  
   - Continuous Authentication (session validation).
2. **Browsing Shard**  
   - Dual-mode Web2 vs Web3 browsing switch and routing.  
3. **Micro Frontend Shard**  
   - Web Components (Shadow DOM) for SociaLynX, MarketLynX, HoloLynX Hub.  
4. **Wallet & MCP Shard**  
   - MetaMask Wallet Toolkit MCP client integration (no private keys in host).  
5. **Transparency & Controls Shard**  
   - Persistent panel for data processing policies, consent management, Right to Erasure.  
6. **Cross-Device UX Shard**  
   - Responsive UI across desktop/tablet/mobile.  

### 1.3 Plan in Parallel (DPPM Strategy — Parallel Planning)
Parallel design tracks (to be refined with actual input streams):
1. **Identity track:** Auth flows, token lifetimes, session refresh cadence.  
2. **MFE track:** Web Component lifecycle, lazy loading, isolation boundaries.  
3. **Browsing track:** Web2 proxy vs Web3 dApp/DAG entry points.  
4. **Wallet/MCP track:** API contracts, consent gating, safe read-only intents.  
5. **Transparency track:** Data policy JSON schema, UI entrypoints, GDPR controls.  
6. **UX track:** Responsive layout grid, adaptive navigation.  

### 1.4 Merge (DPPM Strategy — Merge)
Integrate tracks via **shared interface contracts** (from Postman schemas once available) and a **shell-owned routing contract** that determines when Micro Frontends are mounted, with **strict sandbox isolation** enforced by Web Components.

### 1.5 Mandatory Constraints (Security, Performance, Energy)
**Security**
- **Steganographic encryption/watermarking** for sensitive data flows and internal artifacts.  
- **No secrets in code**: enforce environment variables for all keys/tokens.  
- **Explicit error handling** for all cross-module boundaries.  

**Performance**
- **Latency budget:** UI navigation ≤ 150ms perceived response for shell-level navigation; MFE mount within 1s.  
- **Continuous Auth check** in background must not add >50ms to interactive UI.  

**Energy Efficiency**
- **Carbon-aware scheduling**: defer non-critical fetches/telemetry during high carbon intensity windows (requires NotebookLM guidance on latest practices).  

### 1.6 User Stories
1. As a user, I can switch between **Web2** and **Web3** browsing modes with clear visual differentiation.  
2. As a user, I can log in once and remain continuously authenticated without repeated prompts.  
3. As a user, I can access SociaLynX, MarketLynX, and HoloLynX as isolated modules that never conflict in styles or dependencies.  
4. As a user, I can view and control how my data is processed, including a right to erasure.  
5. As a user, I can query on-chain balances through a secure MCP interface without exposing private keys to the host app.  

### 1.7 Acceptance Criteria
- WebLynX shell provides clear Web2 vs Web3 mode UI.  
- Unified Identity login is accessible via middleware layer and supports continuous session validation.  
- Micro Frontends are mounted as Web Components with Shadow DOM and can be dynamically loaded/unloaded.  
- MetaMask Wallet Toolkit MCP integration supports natural language queries for balances without exposing private keys.  
- Transparency panel is persistent, accessible, and provides consent controls + Right to Erasure.  
- Responsive layout works across desktop/tablet/mobile breakpoints.  

### 1.8 UI & Design Tokens
Enforce EternaLynX brand tokens for all UI elements:
- Ruby Red `#9B111E`  
- Yellow Gold `#FFD700`  
- Emerald `#50C878`  

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Micro Frontends via Web Components + Shadow DOM
**Decision:** Use Web Components with Shadow DOM for SociaLynX, MarketLynX, HoloLynX.  
**Why:** Ensures encapsulation, avoids CSS/JS conflicts, supports independent deployments.  
**Alternatives:** Module Federation; iframe isolation.  
**Tradeoff:** Web Components require stricter contract design and event bridging.  

### ADR-002: Dual-Mode Browsing (Web2/Web3)
**Decision:** Provide explicit mode selector at shell level with clearly distinct routes and UI cues.  
**Why:** Prevents user confusion and allows policy differences between Web2 proxy and Web3 dApp/DAG access.  
**Alternatives:** Auto-detect mode per URL; single unified mode.  
**Tradeoff:** Adds UI complexity, but improves transparency and safety.  

### ADR-003: Continuous Authentication
**Decision:** Continuous session validation enforced by middleware layer with background refresh.  
**Why:** Reduces friction while maintaining security posture.  
**Tradeoff:** Requires careful performance budgeting and error handling.  

### ADR-004: MetaMask Wallet Toolkit MCP Client
**Decision:** Use MCP client for natural-language queries to on-chain resources.  
**Why:** Enables safe access to balances without exposing private keys to the shell.  
**Tradeoff:** Requires strict intent validation and consent gating.  

---

## 3. Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 Key Bottlenecks
- **MFE Load Time:** dynamic modules could slow first interaction.  
- **Shadow DOM Interop:** cross-MFE communication can become brittle without strict contracts.  
- **Web3 Mode Security:** untrusted dApps may push UI manipulations or phishing attempts.  
- **Transparency Panel:** risk of becoming a legal artifact without true user comprehension.  

### 3.2 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** malformed request to middleware or MCP API.  
2. **Deliver Request:** proxy/MCP transport interception or timing out.  
3. **Validate Request:** missing consent or invalid intent signature.  
4. **Update Server State:** session refresh fails, leading to ghost sessions.  
5. **Post Reply:** incomplete or corrupted response payload.  
6. **Deliver Reply:** response delays cause UI to show stale data.  
7. **Validate Reply:** invalid schema; rejected by Postman-derived contracts.  
8. **Update Client State:** UI state mismatch between shell and MFEs.  

### 3.3 Mitigations
- Strict Postman schema enforcement for all API boundaries.  
- Explicit error handling and user-visible fallback states.  
- Micro frontend contract versioning with compatibility checks.  
- Consent gating for MCP requests (human-readable intent prompts).  

---

## 4. Governance Anchors (Human Oversight)
1. **Identity & Continuous Auth changes** must be reviewed by a human security lead.  
2. **Web3 access policy changes** require legal/compliance review.  
3. **Transparency panel updates** require UX and compliance approval.  
4. **MFE contract changes** must be approved by ecosystem platform governance.  

---

## 5. Implementation Guidance (Non-Code)
**Note:** This spec is intentionally non-implementation; it dictates how and why only.

### 5.1 Repository Structure
- Monorepo path: `/frontend/weblynx-shell`.  
- MFE modules should be registered as Web Components and mounted into the shell by name.  

### 5.2 Contracts & APIs
- Use Postman schemas (once provided) to define all API contracts.  
- All secrets via environment variables only.  
- Explicit error handling and telemetry at every boundary.  

### 5.3 Compliance & Trust
- Transparency panel must clearly expose data processing and consent state.  
- Provide Right to Erasure controls with human-readable confirmation flow.  

---

## 6. Branching Recommendation (Gitflow)
Suggested implementation branch format:  
`frontend/weblynx-shell/feature`  
*(Layer: frontend, Hub: weblynx-shell, Tag: feature — must adhere to allowed tags: feature/date/time.)*  

