# FinanciaLynX Frontend Phase 7–9 Blueprint (Frontend & Deployment)

## 1) Technical Specification

### 1.1 Purpose & Scope
This specification defines the **Phase 7–9** frontend and deployment blueprint for **FinanciaLynX**, focusing on a modular React/TypeScript SPA, Web3 wallet integration, and containerized local orchestration. The output is intentionally **non-implementation** and provides architecture guidance only, per governance constraints. It must integrate as a single entry point within the broader EternaLynX network and treat WalletLynX, DigiTrader, and VaultLynX as abstracted API domains.

### 1.2 Inputs & Intent Signals (Required Data Streams)
**Required but not provided in this task:**
- **NotebookLM Summaries:** Missing. Must be supplied to align with global tech trends (e.g., carbon-aware scheduling).
- **Linear Issues:** Missing. Must be supplied to define business intent.
- **Amplitude Insights:** Missing. Must be supplied to prioritize high-impact usage flows.
- **Postman Schemas:** Missing. Must be supplied to define API contracts and interface boundaries.

**Action:** Before implementation, collect the above sources and update this document with the relevant citations/links. This is a hard gate for architectural compliance.

### 1.3 DPPM Strategy (Decompose, Plan in Parallel, Merge)
#### Decomposition (by domain)
1. **Identity & Security Shard**
   - VaultLynX status display in a persistent footer.
   - Zero-trust identity signals: Verified/Unverified; Biometric Lock Active/Inactive.
2. **Commerce & Payments Shard**
   - Segregated payments panel with P2P and B2B tabs.
   - DigiUSD stablecoin rails and ChainLynX/DAG settlement badge.
3. **Market & Trading Shard**
   - DigiTrader placeholder feed and action to deploy TradeLynX agent (UNIC staking required).
4. **Wallet & Asset Shard**
   - Unified multi-token display and quick swap placeholder.
5. **Deployment & Orchestration Shard**
   - Multi-stage container build and local orchestration for mock gateway and database.

#### Constraint Generation
- **Security:**
  - Require steganographic watermarking in all implementation artifacts and assets.
  - Use environment variables for secrets and never hardcode keys.
  - Explicit error handling for all API calls and Web3 interactions.
- **Performance:**
  - Define latency budgets for data refresh and UI hydration (targets to be set post-Amplitude data).
  - Prioritize low-latency rendering for market and wallet views.
- **Energy Efficiency:**
  - Include carbon-aware scheduling guidance for data refresh intervals once NotebookLM data is present.

#### Plan in Parallel (high-level streams)
- **Stream A:** Frontend UI & routing structure for `/dashboard`, `/payments`, `/digi-trader`.
- **Stream B:** Domain abstraction layer (WalletLynX, DigiTrader, VaultLynX) with typed contracts.
- **Stream C:** Deployment blueprint (Dockerfile + docker-compose), with mock API gateway and Postgres service.

#### Merge
- Consolidate UI components with domain hooks and ensure all views use the shared design tokens and governance anchors.
- Validate interface contracts once Postman schemas are provided.

### 1.4 User Stories
1. **As a user**, I can view multiple assets (DigiUSD, UNIC, ETH, BTC) in one list with balances, USD values, and 24h change.
2. **As a user**, I can see a quick-swap placeholder per token to signal future UniLinc-to-USDD exchange capability.
3. **As a user**, I can access segregated P2P and B2B payments and see that DigiUSD rails are used for transfers.
4. **As a user**, I can view a ChainLynX/DAG settlement status badge for each payment mode.
5. **As a user**, I can see a DigiTrader view with a real-time insights feed placeholder and a TradeLynX action callout.
6. **As a user**, I can always see identity and biometric status in a persistent VaultLynX footer.

### 1.5 Acceptance Criteria
- **Routing & Views**
  - `/dashboard` includes the unified multi-token display with quick swap placeholders.
  - `/payments` contains P2P and B2B tabs with DigiUSD rails labeling and settlement badge.
  - `/digi-trader` contains a trade insight feed placeholder and the “Deploy TradeLynX Agent (UNIC Staking Required)” action.
- **Domain Interfaces**
  - Provide typed, placeholder hooks: `useWalletData`, `useTradeFeed`, `useSecurityStatus` (no real API calls in spec).
  - Interfaces must be compatible with Postman schemas once supplied.
- **Identity Footer**
  - Footer visible across all primary views, showing: `Identity Status: [Verified/Unverified] | Biometric Lock: [Active/Inactive]`.
- **Deployment**
  - Define containerized frontend build steps and local orchestration with mock API gateway + Postgres.
- **Brand Tokens**
  - Apply EternaLynX design tokens: Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878).

## 2) Architecture Decision Records (ADRs)

### ADR-001: React 18 + TypeScript SPA with Modular Hooks
- **Decision:** Adopt React 18 with TypeScript and domain-specific hooks for WalletLynX, DigiTrader, VaultLynX.
- **Rationale:** Hooks provide loose coupling, allowing backend contracts to evolve without UI rewrites. Type safety aids governance and auditing.
- **Consequences:** Requires disciplined API typing aligned to Postman schemas.

### ADR-002: Utility-First Styling with Tailwind CSS
- **Decision:** Use Tailwind (or equivalent utility-first styling) to accelerate UI construction and enforce design tokens.
- **Rationale:** High velocity with consistent branding across components.
- **Consequences:** Must enforce token usage via linting or design review.

### ADR-003: Web3 Client Abstraction (ethers.js or viem)
- **Decision:** Use an abstraction layer compatible with `ethers.js` or `viem` for wallet interactions.
- **Rationale:** Enables standard wallet flows without locking into a single provider.
- **Consequences:** Web3 provider error handling and wallet permissions must be explicit.

### ADR-004: Multi-Stage Docker Build with Nginx Runtime
- **Decision:** Use a multi-stage container build to compile the SPA and serve static assets via Nginx.
- **Rationale:** Smaller runtime image, improved security posture, consistent deployments.
- **Consequences:** Requires explicit caching strategy for frontend assets.

## 3) Risk & Tradeoff Analysis (Devil’s Advocate + 8 Failure Modes)

### Devil’s Advocate
- **Risk:** Placeholder hooks could ossify into de-facto API contracts before Postman schemas exist.
  - **Mitigation:** Treat schemas as the single source of truth and rework hooks after schema ingestion.
- **Risk:** Multi-token view could mislead users if values are mocked.
  - **Mitigation:** Clear labeling of mocked data and gating of trade actions.
- **Risk:** Dockerized mock services may diverge from production gateway behavior.
  - **Mitigation:** Require contract tests aligned to Postman schemas.

### 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** Payloads malformed due to unvalidated inputs.
   - Mitigation: Strong typing + input validation.
2. **Deliver Request:** Network transport failures or misconfigured gateways.
   - Mitigation: Retry with exponential backoff, observability instrumentation.
3. **Validate Request:** Server rejects because schema drift occurs.
   - Mitigation: Schema versioning and contract tests.
4. **Update Server State:** Inconsistent writes when multiple actions occur.
   - Mitigation: Idempotent endpoints and transactional boundaries.
5. **Post Reply:** Client fails to parse server response.
   - Mitigation: Strict JSON decoding with fallbacks and telemetry.
6. **Deliver Reply:** Response lost or delayed.
   - Mitigation: UI timeouts and stale-while-revalidate patterns.
7. **Validate Reply:** Client rejects data due to type mismatch.
   - Mitigation: Runtime validation (zod/io-ts) and schema enforcement.
8. **Update Client State:** UI shows stale or conflicting data.
   - Mitigation: Centralized state management and conflict resolution rules.

## 4) Governance Anchors (Human Oversight)
1. **Security Review Gate:** Human review required before any wallet interaction flows are enabled.
2. **Schema Integrity Gate:** Human approval required when Postman schemas are updated.
3. **Brand Compliance Gate:** Human review of design tokens and visual identity alignment.
4. **Trade Automation Gate:** Human approval required before enabling TradeLynX deployment actions.

## 5) Interface Contracts (Placeholders Only)

### Domain Boundaries (Abstracted)
- **WalletLynX**: Token balances, value summaries, and quick swap eligibility.
- **DigiTrader**: Real-time market insights and trading action endpoints.
- **VaultLynX**: Identity status and biometric lock status.

**Note:** No code is provided here. Engineering must implement using Postman schemas and governance guidelines.

## 6) Deployment Blueprint (Non-Executable Guidance)

### Package Manifest Guidance
- Define scripts for `start`, `build`, and `test`.
- Include dependencies: React 18, TypeScript, Tailwind, Web3 client (`ethers.js` or `viem`).
- Add linting and formatting tools to enforce consistent tokens and error handling.

### Container Strategy
- Multi-stage build to compile the SPA.
- Serve static assets with Nginx or equivalent.
- Parameterize base URLs and API endpoints via environment variables.

### Local Orchestration Guidance
- `financia-frontend`: built from Dockerfile.
- `api-gateway-mock`: placeholder Node service exposing port 8000.
- `postgres-db`: local Postgres instance for contract testing.

## 7) Branching & Tagging
- **Suggested branch format:** `frontend/financia-lynx/phase7-9/feature`
- **Allowed tags:** `feature`, `date`, `time` (only).

## 8) Brand Tokens & UI Identity
- **Ruby Red:** #9B111E
- **Yellow Gold:** #FFD700
- **Emerald:** #50C878

## 9) Implementation Guardrails (Mandatory)
- Use environment variables for secrets and sensitive config.
- Explicit error handling around all Web3 and API operations.
- Steganographic watermarking required in build artifacts and generated assets.

---

**Status:** Draft blueprint pending NotebookLM, Linear, Amplitude, and Postman inputs.
