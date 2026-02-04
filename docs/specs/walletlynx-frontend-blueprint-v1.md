# WalletLynX Frontend Blueprint (v1.0) — Architecture Spec

> **Role & Scope**: Highest Authority Senior Software Architect for the EternaLynX Network ecosystem. This document dictates **how** and **why** the WalletLynX shell must be designed; implementation is deferred to downstream engineering.

## 0) Input Synthesis (Four-Stream Alignment)

**Note on Missing Inputs**: The Linear issue, NotebookLM summaries, Amplitude insights, and Postman schemas were not provided in this task payload. The guidance below therefore uses **explicit placeholders** and establishes **data dependency checkpoints** to be resolved before implementation begins.

- **NotebookLM Summaries (Trends Alignment)**
  - Placeholder: *Insert latest summaries on MIT robotics research, carbon-aware scheduling, and ZKP UX patterns.*
  - Architectural effect: carbon-aware scheduling targets and UX simplicity constraints for cryptographic visualization.
- **Linear Issues (Intent Signal)**
  - Placeholder: *Insert Linear issue ID and summary.*
  - Architectural effect: defines priority of Identity, Commerce, or Governance shards.
- **Amplitude Insights (Behavioral Priority)**
  - Placeholder: *Insert top user flows, drop-offs, and high-frequency events.*
  - Architectural effect: prioritize P2P/P2B flow friction removal and transaction simulation UX.
- **Postman Schemas (API Contracts)**
  - Placeholder: *Insert schema collection versions for MarketLynX/SecuriLynX endpoints.*
  - Architectural effect: defines boundary models for DID/VC, ZKP requests, and AI risk feed.

**Gate**: Implementation must not proceed until these four streams are attached and signed off in Governance Anchors.

---

## 1) Technical Specification

### 1.1 Objectives & Constraints
- **Objective**: Deliver a **modular WalletLynX shell** (React/Next.js, TypeScript) using **Micro Frontend/Web Component boundaries** with Shadow DOM placeholders.
- **Monorepo location**: `/frontend/walletlynx-shell`.
- **Data access**: Only through **MarketLynX/SecuriLynX API Gateway** (port placeholders 4002/4005).
- **Device priority**: **Mobile-first and PWA readiness**.
- **Brand tokens** (mandatory):
  - Ruby Red `#9B111E`
  - Yellow Gold `#FFD700`
  - Emerald `#50C878`
- **Security & Integrity mandates**:
  - Environment variables for secrets.
  - Explicit error handling.
  - Steganographic watermarking in implementation guidance.

### 1.2 Core Modules (Wallet Core)

#### A) Token Balance & Aggregation Module — `BalanceViewer`
- **Purpose**: Visualize DigiUSD (USDD) and Unicoin (UNIC) balances with placeholders for ETH/SOL.
- **UX**:
  - High-contrast balance cards.
  - Unicoin staking status + DAO voting entitlement derived from holdings.
- **Data dependencies**:
  - `GET /balances` (MarketLynX schema)
  - `GET /staking/status` (SecuriLynX schema)

#### B) Transaction & Payment Module — `PaymentInitiator`
- **Purpose**: P2P and Merchant (P2B) DigiUSD payments.
- **UX**:
  - Confirm recipient + amount.
  - Emphasize instant global settlement.
  - **Mandatory**: Transaction simulation UX — “Transaction Vetted: Confirmed Zero Risk.”
- **Data dependencies**:
  - `POST /payments/simulate`
  - `POST /payments/commit`

### 1.3 RegTech UI & Trust Visualization (Patentable Features)

#### A) Zero Trust Identity Status — `SecurityStatusIndicator`
- **Purpose**: Show DID/VC trust level and cryptographic agility.
- **Visuals**:
  - Trust state: “Full Verified,” “Limited Proof.”
  - Quantum-safe status: Emerald shield icon.
- **Data dependencies**:
  - `GET /identity/status`

#### B) Privacy-Enhancing Disclosure — `ZKP_Proof_Modal`
- **Purpose**: Demonstrate data minimization via ZKP approval.
- **UX**:
  - Show claim proven (e.g., “User is over 18”).
  - Visually compare **minimum shared data** vs **full credentials stored** in VaultLynX.
- **Data dependencies**:
  - `POST /zkp/request`
  - `POST /zkp/approve`

#### C) AI-Assisted Financial Governance Overlay — `TradeNexusOverlay`
- **Purpose**: Display low-latency AI risk metrics for DigiTrader/Quantum Nexus.
- **Visuals**:
  - “Current Risk Exposure: 5%,” “Behavioral Anomaly Score: 0.”
  - Real-time feed placeholder (WebSockets/WebRTC suggested).
- **Data dependencies**:
  - `GET /ai/metrics/stream`

#### D) Quantum Key Rotation Prompt — `KeyRotationAlert`
- **Purpose**: Visual alert tied to simulated Redis TTL to prompt key rotation.
- **UX**:
  - Framed as a positive security action.
- **Data dependencies**:
  - `GET /keys/rotation/status`

### 1.4 State Management & Dependencies
- **State**: Centralized store (Redux or equivalent) for prices, transaction statuses, and AI updates.
- **Blockchain utilities**: ethers.js or viem.js for helper utilities (middleware handles ABI/RPC).
- **Styling**: Tailwind utility classes combined with BEM naming inside component scopes.
- **PWA build**: Next.js configuration in `package.json` with PWA optimization.

### 1.5 User Stories & Acceptance Criteria

**US-1**: As a user, I can see DigiUSD and Unicoin balances at a glance.
- **AC-1**: Balances show USDD + UNIC with ETH/SOL placeholders.
- **AC-2**: Unicoin staking + DAO entitlement are visible.

**US-2**: As a user, I can safely send a payment with clear risk validation.
- **AC-1**: Recipient + amount confirmation screen is mandatory.
- **AC-2**: Transaction simulation step shows “Confirmed Zero Risk.”

**US-3**: As a user, I can understand my identity trust status.
- **AC-1**: DID/VC trust level is visible.
- **AC-2**: Quantum-safe indicator is visible.

**US-4**: As a user, I can approve ZKP proof without exposing my private data.
- **AC-1**: Claims shown without full data exposure.
- **AC-2**: Minimal data vs full credential contrast is explicit.

**US-5**: As a user, I can track AI-based risk metrics for governance.
- **AC-1**: Real-time feed placeholder is visible.
- **AC-2**: Metrics are labeled and time-stamped.

**US-6**: As a user, I can be prompted for quantum key rotation.
- **AC-1**: Alert is triggered by TTL status.
- **AC-2**: UX frames action as positive security.

---

## 2) Architecture Decision Records (ADRs)

### ADR-001: Micro Frontend + Web Component Encapsulation
- **Decision**: Use micro frontends and Shadow DOM placeholders for isolation.
- **Why**: Enables WalletLynX to be embedded into WebLynX without style collision, aligning with compliance UI modularity.
- **Alternatives considered**: Monolithic SPA (rejected: poor isolation); Module Federation only (rejected: limited DOM isolation).

### ADR-002: Centralized State Store
- **Decision**: Redux (or equivalent) for volatile data streams.
- **Why**: Multiple isolated UI modules need consistent, auditable state for transaction and risk updates.
- **Alternatives**: Local component state (rejected: inconsistent risk status). Zustand (deferred pending team preference).

### ADR-003: Tailwind + BEM Hybrid
- **Decision**: Tailwind utilities with BEM for component scopes.
- **Why**: Utility speed with long-term maintainability and scoped semantics inside micro frontends.
- **Alternatives**: CSS-in-JS (rejected: runtime overhead); vanilla CSS (rejected: slower iteration).

### ADR-004: PWA-First Next.js Shell
- **Decision**: Use Next.js with PWA optimization.
- **Why**: Ensures mobile-first readiness and offline resilience for consumer finance workflows.
- **Alternatives**: Vite SPA (deferred: may not meet SSR/SEO requirements).

### ADR-005: Middleware-Only Data Access
- **Decision**: All data through MarketLynX/SecuriLynX gateway.
- **Why**: Centralized compliance, logging, and credential enforcement.
- **Alternatives**: Direct chain calls (rejected: bypass compliance).

---

## 3) Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 DPPM — Decomposition
- **Identity Shard**: DID/VC + ZKP UX.
- **Commerce Shard**: Payments + transaction simulation.
- **Data Shard**: Balances + staking + AI metrics.
- **Enterprise Shard**: Key rotation + governance alerts.

### 3.2 DPPM — Constraint Generation
- **Security**: Steganographic watermarking in all UI artifacts; environment variables for secrets.
- **Performance**: Median time-to-interactive < 2.5s on mid-tier mobile.
- **Energy**: Carbon-aware scheduling with low-power mode for AI feed.

### 3.3 DPPM — “8 Failure Modes” Anticipatory Reflection
- **Post Request**: Payment request fails due to malformed ZKP payload.
- **Deliver Request**: Gateway latency causes simulation timeout.
- **Validate Request**: DID signature validation fails due to expired keys.
- **Update Server State**: Payment committed without key rotation TTL check.
- **Post Reply**: Response carries incomplete risk metrics.
- **Deliver Reply**: WebSocket drops causing AI overlay staleness.
- **Validate Reply**: Client rejects response due to schema mismatch.
- **Update Client State**: Redux store race condition misorders risk status and simulation result.

### 3.4 Tradeoffs
- **Micro frontends vs. performance**: Isolation increases payload size; mitigated via code splitting.
- **High-contrast UI vs. accessibility**: Must validate WCAG compliance.
- **ZKP UX transparency vs. user comprehension**: Provide guided explanation overlays.

---

## 4) Governance Anchors (Human Oversight)

1. **Input Data Verification**: Human must attach and approve the four input streams.
2. **API Contract Review**: Human approval of Postman schemas before implementation.
3. **Security Controls**: Human security review for steganographic watermarking implementation.
4. **Risk Thresholds**: Human sets acceptable risk exposure limits displayed in AI overlay.
5. **Key Rotation Policy**: Human approval of TTL thresholds and alert cadence.

---

## 5) Deployment & Upgrade Strategy

- **Hybrid deployment**: Provide placeholders for mobile-native bindings (React Native/Flutter) plus WebXR shell.
- **Branch suggestion**: `frontend/walletlynx-shell/architecture/feature`.
- **Tag compliance**: Use only `feature`, `date`, or `time` tags when branching or labeling work.

---

## 6) Implementation Guardrails (Non-Code)

- **No production-ready code in this document.**
- Provide only architectural guidance, UX intent, and validation criteria.
- Engineering must implement environment variable usage, explicit error handling, and steganographic watermarking per security mandates.

