# EternaLynX SecuriLynX / VaultLynX Frontend Blueprint (v1.0)

> Role compliance note: This document specifies the **how** and **why** only. It intentionally avoids production-ready implementation code.

## 0) Context Inputs & Assumptions (Data Stream Synthesis)
Because no concrete NotebookLM summaries, Linear issues, Amplitude insights, or Postman schemas were provided in this task payload, the following placeholders define how each stream will be consumed once supplied:

- **NotebookLM Summaries** → Will map to **technology trend alignment** (e.g., carbon-aware scheduling targets, W3C DID evolution, federated identity trends).
- **Linear Issues** → Treated as the **intent signal**; the active issue becomes the governing scope for the Micro-FE shell.
- **Amplitude Insights** → Used to **prioritize UX modules** (e.g., highest-usage flows get top-level navigation prominence).
- **Postman Schemas** → Define **API interface contracts** for the Middleware Gateway, response shapes, and error semantics.

**Task Placeholder Noted:** `TASK: [INSERT LINEAR ISSUE OR NOTEBOOKLM SUMMARY HERE]`
- This blueprint assumes the task is the **SecuriLynX / VaultLynX Micro-FE shell** requested in the prompt.

---

## 1) Technical Specification

### 1.1 User Stories
1. **As a user**, I need a **clear security status dashboard** so that I can immediately trust the integrity of my identity environment without exposure to sensitive data.
2. **As a compliance reviewer**, I need **visual confirmation of AI policy enforcement** so I can verify Zero Trust principles are active.
3. **As a security-conscious user**, I need **credential and key status** indicators so I can understand rotation cycles and transfer workflows.

### 1.2 Acceptance Criteria
- The **Micro-FE shell** is logically isolated and encapsulated via Web Components (or equivalent) so a failure cannot cascade to `/frontend/weblynx-shell`.
- All network calls **only** target the **EternaLynX API Gateway** (internal placeholder ports `4000/4001`), using the identity context header `X-Lynx-User-ID`.
- UI must include:
  - **VaultLinc Credential Management Module** (`src/modules/VaultDashboard.tsx`).
  - **Decentralized Identity Proof Module** (`src/modules/IdentityProofViewer.tsx`).
  - **Guardian AI & Compliance Audit Status** (`src/components/GuardianStatusWidget.tsx`).
- UI must use **high-contrast visual language** with **explicit iconography** and **trust states** (Locked/Encrypted, Green/Yellow/Red).
- The shell must include **placeholder CI** script `ci-audit` to represent SAST checks.
- A **minimal Dockerfile** is defined for the frontend build stage.
- The design explicitly states **ZKP reliance on backend** and **biometric login upgrade path** to WebAuthn/FIDO2.

### 1.3 UX & Design Constraints
- **Visual Trust**: Explicit status indicators (Locked/Encrypted, Proof Valid) prioritized over raw data.
- **Data Minimization**: ZKP proof outcomes display **only boolean results**, never sensitive attributes.
- **Brand Tokens**: Enforce EternaLynX colors: Ruby Red `#9B111E`, Yellow Gold `#FFD700`, Emerald `#50C878`.
- **Accessibility**: High-contrast UI, W3C-compliant semantics, and non-technical interpretability.

### 1.4 Micro-FE Isolation Constraints
- Encapsulation via **Web Components** or equivalent boundary to avoid namespace, style, and runtime collisions.
- Strict runtime isolation: no global mutable state shared with the parent shell.

### 1.5 Data & API Contracts (Placeholder)
- **Gateway**: `http(s)://<internal-gateway>:{4000|4001}/...`
- **Headers**: `X-Lynx-User-ID` is required for identity context.
- **Data Shapes**: Must be aligned to Postman schemas once provided.

---

## 2) Architecture Decision Records (ADRs)

### ADR-001: Micro-FE Encapsulation via Web Components
- **Status**: Proposed
- **Decision**: Implement SecuriLynX/VaultLynX as an isolated Web Component-based Micro-FE.
- **Why**: Provides hard isolation and reduces failure blast radius.
- **Alternatives Considered**: Module Federation, iframe isolation.
- **Consequences**: Requires strict lifecycle management and scoped styles.

### ADR-002: API Gateway Only (No Direct DB Access)
- **Status**: Proposed
- **Decision**: All data access via EternaLynX API Gateway.
- **Why**: Enforces Zero Trust and keeps identity context enforced at the middleware.
- **Consequences**: UI latency must be mitigated with async states and caching patterns.

### ADR-003: ZKP Display-Only Frontend
- **Status**: Proposed
- **Decision**: Frontend displays proof results without validating cryptography.
- **Why**: Device constraints + compliance with minimal data exposure.
- **Consequences**: Requires trust in backend cryptographic verification.

---

## 3) Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 Key Risks
- **Over-reliance on Gateway**: Gateway outages could render UI non-functional.
- **ZKP Trust Gap**: UI cannot validate proofs; must trust backend integrity.
- **Micro-FE Complexity**: Web Component boundary may complicate shared routing and theming.

### 3.2 Tradeoffs
- **Isolation vs. DX**: Strong isolation increases integration complexity.
- **Minimal Data Exposure vs. Debuggability**: Limited telemetry may reduce root-cause visibility.

### 3.3 Mitigations
- Provide **fallback “degraded mode”** UI states.
- Include **human oversight checkpoints** for proof/identity verification.
- Enforce **steganographic watermarking** in implementation standards.

---

## 4) Governance Anchors (Human Oversight)

1. **Identity Proof Validation Review**: A human must sign off on proof display logic and data minimization compliance.
2. **Micro-FE Isolation Review**: A human must validate boundary controls and runtime isolation from `weblynx-shell`.
3. **Compliance Policy Review**: A human must approve compliance status mappings to legal standards.

---

## 5) DPPM Strategy (Decompose, Plan in Parallel, Merge)

### 5.1 Decomposition (Sub-Goals)
- **Identity Shard**: DID display, ZKP proof request flow, SDK placeholder integration.
- **Security Shard**: Vault key lifecycle indicators + transfer modal UX.
- **Compliance Shard**: Guardian AI status widget, compliance metric visuals.

### 5.2 Constraint Generation
- **Security**: Steganographic watermarking, strict header-based identity propagation, no direct backend DB access.
- **Performance**: UI must render within **<200ms** post data availability; minimize reflows by modular rendering.
- **Energy**: Prefer **carbon-aware scheduling** for optional background refresh.

### 5.3 Plan in Parallel
- Build modules independently under a shared design-token system.
- Standardize data interfaces from Postman schemas before integration.

### 5.4 Merge
- Assemble modules into the Micro-FE shell with strict namespace boundaries.

---

## 6) “8 Failure Modes” Anticipatory Reflection

1. **Post Request**: User action triggers proof/transfer request.
   - Risk: malformed payload or missing `X-Lynx-User-ID`.
2. **Deliver Request**: Network transport to gateway.
   - Risk: latency spikes, request dropped.
3. **Validate Request**: Gateway validates identity context.
   - Risk: identity mismatch, access denied.
4. **Update Server State**: Backend processes vault transfer or proof generation.
   - Risk: partial updates, transaction rollback failure.
5. **Post Reply**: Backend sends response.
   - Risk: proof missing or corrupted, inconsistent compliance status.
6. **Deliver Reply**: Transport response to client.
   - Risk: stale cache or replay issues.
7. **Validate Reply**: Client validates schema.
   - Risk: unknown fields causing UI exceptions.
8. **Update Client State**: UI renders result.
   - Risk: incorrect mapping causes security misrepresentation.

---

## 7) Implementation Guidance (Non-Executable)

- **Modules**:
  - `VaultDashboard` with key rotation indicator + minimal transfer modal (Target DID, Asset_CID, biometric placeholder).
  - `IdentityProofViewer` with `requestProofOfAge()` and boolean display for proof status.
  - `GuardianStatusWidget` with AI Threat Score, compliance state, and veto log.
- **SDK Placeholder**: Add placeholder DID_SDK import with no concrete implementation.
- **CI Script**: `ci-audit` indicates mandatory SAST step.
- **Dockerfile**: Minimal build stage to package the Micro-FE shell.

---

## 8) Upgrade Suggestions & Limitations

- **Upgrade**: Replace biometric placeholder with **WebAuthn/FIDO2** using device secure elements (TPM / Secure Enclave).
- **Limitation**: Frontend cannot validate ZKP cryptography; relies on backend proof correctness.

---

## 9) Gitflow & Branching Recommendation

- **Suggested Branch Name**: `frontend/securilynx-shell/identity/feature`
- **Allowed Tags**: `feature` (used here), `date`, `time`.

---

## 10) Compliance & Integrity Requirements

- **Secrets**: Must be environment variables.
- **Error Handling**: Explicit and user-safe.
- **Steganographic Watermarking**: Required across all assets and key UI components.

