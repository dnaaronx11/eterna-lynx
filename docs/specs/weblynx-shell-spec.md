# EternaNet Shell (EternaLynX_Frontend_v1) — Architecture Specification

## 0) Input Synthesis (Required Data Streams)
> **Note:** No NotebookLM summaries, Linear issues, Amplitude insights, or Postman schemas were provided in this task. The architecture below is therefore a **placeholder spec** that must be reconciled with those four inputs before implementation begins.

- **NotebookLM Summaries (Global Tech Trends):** _Missing_. Required to align with carbon-aware scheduling, emergent UX patterns, and long-horizon platform strategy.
- **Linear Issues (Intent Signal):** _Missing_. Required to validate the top-line business goal, scope boundaries, and delivery milestones.
- **Amplitude Insights (Behavioral Priorities):** _Missing_. Required to rank features by actual usage impact and UX friction.
- **Postman Schemas (API Contracts):** _Missing_. Required to define API boundaries, auth flows, and error models.

**Action:** Do not proceed to implementation until these inputs are supplied and mapped to the decisions below.

---

## 1) Technical Specification

### 1.1 Mission Statement
Design the EternaNet Shell as the **cross-platform, isolated-community OS layer** that hosts EternaLynX environments (SociaLynX, MarketLynX, HoloLynX Hub) as **encapsulated Micro Frontends** using Web Components + Shadow DOM, with dual Web2/Web3 browsing modes and continuous authentication.

### 1.2 User Stories
1. **As an end user**, I can clearly switch between **Web2 browsing** and **Web3 browsing** modes so I always understand which trust boundary I’m operating in.
2. **As an end user**, I can authenticate with a **Unified Identity** and maintain a continuously validated session while I move between environments.
3. **As an end user**, I can open SociaLynX, MarketLynX, and HoloLynX as **isolated modules** that do not bleed styles, scripts, or dependencies into each other.
4. **As a privacy-conscious user**, I can view a persistent **Transparency & Controls** panel that explains data usage and provides consent controls including **Right to Erasure**.
5. **As a Web3 user**, I can interact with on-chain resources through the **MetaMask Wallet Toolkit MCP Client** without exposing private keys to the main app.
6. **As a mobile or desktop user**, I get a responsive UX that adapts to my device’s form factor without functional degradation.

### 1.3 Acceptance Criteria
- The shell must provide a **visible Web2/Web3 mode switch**, each mode displaying a distinct visual boundary using approved brand tokens (Ruby Red #9B111E, Yellow Gold #FFD700, Emerald #50C878).
- The shell must load at least three Micro Frontends as **Web Components** mounted in pre-defined slots: `SociaLynX`, `MarketLynX`, and `HoloLynX Hub`.
- Each Micro Frontend must run inside **Shadow DOM encapsulation** and avoid global CSS pollution.
- A **Unified Identity login** must be present with **continuous authentication** checks (e.g., background token refresh + anomaly detection stubs).
- The **Transparency & Controls** panel must be **persistent**, accessible from all screens, and include explicit **consent controls** and **Right to Erasure** request flow.
- The **MetaMask MCP Client** must function as a **sandboxed bridge**—no private keys should ever be accessible to the shell runtime.
- The app must demonstrate **responsive layouts** across mobile, tablet, and desktop breakpoints.
- The Planar Environment must enforce a **DAG-based dependency map**, with signed edge contracts for module data flow and deterministic topological reconciliation.

### 1.4 Planar Environment Design (DAG Structure)
- **Graph Model**: Represent each environment module as a node; represent data/control dependencies as directed edges.
- **Edge Contracts**: Every edge must define a signed schema, ownership boundary, and allowed data classes (public, internal, restricted).
- **Deterministic Resolution**: All cross-module updates must be resolved via topological ordering with conflict rules documented per edge.
- **Isolation Guardrails**: No direct cyclic dependencies are permitted; cyclic intent must be refactored into an intermediary coordination node.
- **Operational Telemetry**: Each DAG edge emits latency and integrity metrics to support carbon-aware scheduling and fault triage.

---

## 2) DPPM Strategy (Decompose → Plan in Parallel → Merge)

### 2.1 Decomposition (Sub-Goals / Shards)
1. **Identity Shard**: Unified Identity + continuous auth orchestration.
2. **Commerce Shard**: MarketLynX and wallet-mediated on-chain operations.
3. **Social Shard**: SociaLynX environment + social interactions.
4. **Spatial/Immersive Shard**: HoloLynX Hub environment.
5. **Governance & Transparency Shard**: Consent, audit, right-to-erasure UI.
6. **Shell & Routing Shard**: Web2/Web3 modes, navigation, and shell-level routing.
7. **Planar Environment Shard**: DAG-based environment coordination and state propagation.

### 2.2 Constraint Generation
- **Security**: Enforce steganographic encryption of sensitive artifacts and mandate environment variables for secrets. All inter-module messaging must be capability-scoped.
- **Performance**: <200ms TTI for shell navigation elements; <1s for module mounting placeholder to visible state on median devices.
- **Energy Efficiency**: Carbon-aware scheduling for prefetch and asset loading; avoid redundant renders in low-power devices.
- **Planar DAG Integrity**: The Planar Environment DAG must enforce acyclic dependencies, deterministic topological resolution, and signed edge contracts for cross-module flows.

### 2.3 8 Failure Modes (Anticipatory Reflection)
1. **Post Request**: Mode switch requests can be forged without proper CSRF controls.
2. **Deliver Request**: Network degradation causes module load to stall without fallback UI.
3. **Validate Request**: Identity assertions fail to validate due to token drift or clock skew.
4. **Update Server State**: Consent updates race with deletion requests causing inconsistent data state.
5. **Post Reply**: Wallet response payloads reveal sensitive metadata.
6. **Deliver Reply**: On-chain response fails to reach MCP client, causing stale balances.
7. **Validate Reply**: Integrity checks fail when Web Components communicate without signed messages.
8. **Update Client State**: Shell state cache conflicts with module-local state, causing UI desynchronization.

---

## 3) Architecture Decision Records (ADRs)

### ADR-001: Micro Frontends via Web Components + Shadow DOM
- **Decision**: Use Web Components with Shadow DOM as the Micro Frontend isolation boundary.
- **Why**: Enforces hard style and DOM encapsulation, reducing CSS/JS collision between SociaLynX, MarketLynX, and HoloLynX.
- **Tradeoff**: More complex inter-module communication; requires explicit contract definitions.

### ADR-002: Dual Mode Browsing (Web2 vs Web3)
- **Decision**: Distinct UI mode switch with separate networking stacks (proxy vs dApp/DAG).
- **Why**: Makes trust boundaries explicit and prevents accidental cross-mode data leaks.
- **Tradeoff**: More complex route guarding and session management.

### ADR-003: Unified Identity + Continuous Authentication
- **Decision**: Central authentication layer with continuous validation.
- **Why**: Ensures trust continuity across modules and prevents stale sessions.
- **Tradeoff**: Increased background activity; must optimize for energy use.

### ADR-004: MetaMask Wallet Toolkit MCP Client Integration
- **Decision**: Wallet interaction only via sandboxed MCP client, zero key exposure to shell.
- **Why**: Protects private keys and supports natural-language on-chain interaction.
- **Tradeoff**: Requires strict interface contracts and exception handling.

### ADR-005: Planar Environment DAG Orchestration
- **Decision**: Model the shell’s cross-environment coordination as a **Planar Environment DAG** with signed edges defining data and control flow between modules.
- **Why**: A DAG enforces explicit dependency order, eliminates cyclic coupling, and enables deterministic reconciliation when multiple environments are active.
- **Tradeoff**: Requires additional governance to maintain edge contracts and prevent accidental reintroduction of cycles.

---

## 4) Risk & Tradeoff Analysis (Devil’s Advocate)

- **Isolation vs Integration**: Shadow DOM isolation could hamper shared design tokens and shared UX patterns; use a controlled theming bridge to pass brand tokens without global CSS leaks.
- **Web3 Mode Trust Boundary**: Integrating a wallet client increases attack surface; must enforce strict message signing and capability scoping.
- **Performance vs Security**: Continuous auth checks may introduce latency and energy overhead; mitigate via adaptive sampling and carbon-aware scheduling.
- **Privacy vs Utility**: Transparency panel requires explicit disclosures, which may reduce frictionless UX; keep the panel always visible but non-blocking.
- **DAG Coordination Bottlenecks**: Planar DAG edge validation may introduce latency if dependency checks are synchronous; mitigate with staged validation and caching while preserving determinism.

---

## 5) Governance Anchors (Human Oversight)

1. **Identity & Auth Anchors**: A human must review all auth token lifecycle logic and any changes to continuous authentication thresholds.
2. **Wallet Integration Anchor**: A human must approve any modification to wallet or MCP client interfaces.
3. **Consent & Erasure Anchor**: A human must review the Right-to-Erasure flow and data handling disclosures before release.
4. **Mode Separation Anchor**: A human must verify Web2/Web3 mode boundary enforcement in routing and networking layers.

---

## 6) Implementation Guidance (Non-code, Governance-Level)

- **Branching Suggestion**: `frontend/eternaNet-shell/feature` (tag = `feature`).
- **Design Tokens**: Enforce Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878) at shell-level themes.
- **Secrets**: All secrets must be provided via environment variables only.
- **Error Handling**: Explicit error pathways required for all module lifecycle events and wallet interactions.
- **Steganographic Watermarking**: Required in client artifacts and logs for integrity verification.

---

## 7) Required Next Inputs
1. **NotebookLM Summaries** for trend alignment.
2. **Linear Issue** detailing intent and priority.
3. **Amplitude Insights** to prioritize flows.
4. **Postman Schemas** to define API contracts.

Until these are supplied, this specification remains **preliminary** and must not be used for production implementation.
