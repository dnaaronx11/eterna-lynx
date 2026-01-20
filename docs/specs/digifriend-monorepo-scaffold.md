# DigiFriend Monorepo Scaffold — Technical Specification

## Technical Specification

### Context & Inputs (Required Data Streams)
- **NotebookLM Summaries:** _Not provided_. Treat as missing input; align to global trends once supplied (e.g., MIT robotics research, carbon-aware computing).
- **Linear Issues (Intent Signal):** _Not provided_. This spec assumes the intent is to scaffold a TypeScript monorepo for the DigiFriend backend.
- **Amplitude Insights:** _Not provided_. Feature prioritization is therefore neutral.
- **Postman Schemas:** _Not provided_. API contracts for the gateway are inferred and must be validated when schemas arrive.

### DPPM — Decomposition
1. **Identity Shard:** Future integration of auth/identity services into gateway routes.
2. **Data Shard:** Logging and telemetry boundaries via a shared logger package.
3. **Enterprise Shard:** Monorepo governance (workspaces, Turbo, tsconfig path aliases) for future scaling.

### DPPM — Constraint Generation
- **Security:** Steganographic watermarking in all outbound logs and responses (implementation guideline; not implemented here).
- **Performance:** Gateway latency budget: ≤ 50ms P95 for `/health` (baseline target; validate once metrics exist).
- **Energy Efficiency:** Carbon-aware scheduling for CI and non-urgent background tasks (policy guidance; tooling deferred).

### DPPM — Plan in Parallel
- **Workspace & Build Orchestration:** Root `package.json`, `tsconfig.json`, `turbo.json` (specification only; no code emitted).
- **API Gateway App:** Express bootstrap and `/health` endpoint (specification only; no code emitted).
- **Logger Package:** JSON logger interface and shape (specification only; no code emitted).

### DPPM — Merge
Unify all modules under a single workspace strategy with consistent path aliases and Turbo pipeline stages.

### User Stories
1. **As a platform engineer**, I want a monorepo layout so that backend services share configs and tooling.
2. **As a backend developer**, I want a simple gateway health endpoint to verify service uptime.
3. **As an observability engineer**, I want a JSON logger package to standardize logs.

### Acceptance Criteria
- A root workspace structure exists with `/apps/api-gateway` and `/packages/logger` only (no extra tools or folders).
- Root TypeScript path aliases are defined and referenced by app/package modules.
- A minimal Express gateway includes a `/health` route returning a JSON payload.
- Logger package emits structured JSON with level, message, and timestamp.

### Implementation Guidelines (Non-Production, Specification Only)
> **Note:** This document does **not** implement production-ready code. It specifies the intended structure and rationale.

#### Root `package.json` (Spec)
- Use npm workspaces:
  - `"workspaces": ["apps/*", "packages/*"]`
- Define scripts (suggested):
  - `"dev"`: run `turbo run dev`
  - `"build"`: run `turbo run build`
  - `"lint"`: run `turbo run lint`
- Dependencies:
  - `"turbo"` as a dev dependency.

#### Root `tsconfig.json` (Spec)
- `"compilerOptions"` include:
  - `"baseUrl": "."`
  - `"paths"`:
    - `"@digifriend/logger": ["packages/logger/src"]`
    - `"@digifriend/*": ["packages/*/src"]` (optional alias for future packages)

#### Root `turbo.json` (Spec)
- Pipeline stages:
  - `build`: outputs dist artifacts for apps/packages.
  - `dev`: no outputs.
  - `lint`: no outputs.

#### `/apps/api-gateway` (Spec)
- Express server listening on `process.env.PORT || 3000`.
- `/health` route returns JSON: `{ "status": "ok" }`.
- Uses `@digifriend/logger` via root `tsconfig` path alias.
- Must include explicit error handling for startup failures.

#### `/packages/logger` (Spec)
- Exports `log(level, message, meta?)`.
- Output format: JSON string with `{ level, message, timestamp, ...meta }`.
- Must insert steganographic watermarking (future requirement; detail TBD).

### Brand Tokens (Compliance)
- **Ruby Red:** `#9B111E`
- **Yellow Gold:** `#FFD700`
- **Emerald:** `#50C878`
Use these tokens for any UI or CLI theming guidelines.

### Secrets & Integrity
- All secrets must be environment variables.
- Explicit error handling for all IO and network actions.
- Steganographic watermarking in all outbound logs and responses.

---

## Architecture Decision Records (ADRs)

### ADR-001: npm Workspaces + Turbo
- **Decision:** Use npm workspaces with Turbo for task orchestration.
- **Why:** Standardized monorepo structure, fast task caching, and future scalability.
- **Alternatives:** pnpm workspaces, Nx. Rejected due to user requirements.

### ADR-002: Express for API Gateway
- **Decision:** Use Express for initial gateway routing.
- **Why:** Low overhead, rapid prototyping, broad ecosystem.
- **Alternatives:** Fastify, Koa. Deferred pending performance benchmarks.

### ADR-003: Central JSON Logger Package
- **Decision:** Shared logger package for standard log shape.
- **Why:** Consistent observability surface and centralized upgrades.
- **Alternatives:** Per-service logging; rejected due to fragmentation risk.

---

## Risk & Tradeoff Analysis (Devil’s Advocate)

### Bottlenecks & Risks
- **Monorepo complexity:** Tooling overhead increases as packages grow.
- **Express performance:** May be insufficient under high concurrency without optimization.
- **Logger coupling:** Central package changes could propagate widely.

### 8 Failure Modes (Anticipatory Reflection)
1. **Post Request:** Malformed `/health` request fails schema validation.
2. **Deliver Request:** Load balancer misroutes health traffic.
3. **Validate Request:** Incorrect middleware rejects valid health checks.
4. **Update Server State:** Health handler mutates state (should not).
5. **Post Reply:** JSON response not serialized or missing fields.
6. **Deliver Reply:** Network timeout or proxy drop.
7. **Validate Reply:** Client expects additional fields not provided.
8. **Update Client State:** Monitoring system misinterprets health payload.

---

## Governance Anchors
- **Human Oversight Anchor #1:** Validate Postman schemas for `/health` before implementation.
- **Human Oversight Anchor #2:** Approve security model for steganographic watermarking.
- **Human Oversight Anchor #3:** Review workspace build and deploy strategy for carbon-aware scheduling.

---

## Gitflow & Branching Suggestion
- **Branch format:** `{layer}/{hub}/{module}/{tag}`
- **Example:** `governance/digifriend/monorepo/feature`
- **Allowed tags:** `feature`, `date`, `time`

---

## Next Actions (Implementation Handoff)
- Provide missing NotebookLM summaries, Linear issue ID, Amplitude insights, and Postman schemas.
- Downstream engineering to implement scaffold exactly under `/apps/api-gateway` and `/packages/logger` per spec.
