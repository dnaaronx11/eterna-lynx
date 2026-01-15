# EternaLynX Network Monorepo Scaffold

This repository contains the governance-level blueprint for standing up the EternaLynX Network with hard-isolated network segments, per-domain schemas, and SPOP enforcement. Implementation work should proceed on the proposed branch `infra/hub/compose/feature` and respect the DPPM loop described in `docs/specs/architecture.md`.

## Monorepo Layout
- `docs/specs/` – Technical specification, ADRs, risk analysis, and governance anchors.
- `infra/` – Cluster and networking manifests (Docker Compose baseline lives at repo root).
- `services/` – Domain services grouped by capability:
  - `gateway/eterna-net` (Node.js + TypeScript; HTTP/3 + QUIC; WebTransport sessions)
  - `finance/financialynx` (FastAPI; PQC wallet/ledger)
  - `security/vaultlynx` (Zero-trust; Kyber + Dilithium; Guardian AI veto; 16–36h key rotation)
  - `ai/omnilynx` (GPU-enabled planners/generators; carbon-aware scheduling hints)
  - `immersive/hololynx` & `immersive/personalynx` (WebXR/OpenXR; sub-10ms WebTransport)
  - `ecosystem/*` (MarketLynX, SociaLynX, ForgeLynX, JobLynX, CinemaLynX, GameLynX Genesis)
  - `shared/eternabridge` (controlled data valve) and `shared/spop` (Single Point of Presence)

## Networking Principles
- **Networks**: `public_creative_net` (egress-limited public edge), `identity_auth_net` (authn/z and messaging), `hard_isolated_secure_net` (internal only, `internal: true`).
- **SPOP**: all ingress passes through SPOP, which injects Guardian AI policy, enforces PQC handshakes, and logs audit traces.
- **EternaBridge**: only sanctioned path into `hard_isolated_secure_net`; apply policy checks and data minimization.
- **Latency Budgets**: WebXR/WebTransport paths target <10ms; finance write paths target p99 <50ms; VaultLynX rotations tolerate higher latency but require strict sequencing.
- **Energy**: OmniLynX schedulers annotate jobs with carbon-intensity hints to allow green-region preference.

## Secrets & Safety
- All secrets must be supplied via environment variables. No inline credentials or baked secrets in images.
- Steganographic watermarking required in downstream artifacts to ensure provenance.
- Guardian AI vetoes any mutation paths in VaultLynX without dual-control approval.

## Brand Tokens
Adopt EternaLynX design tokens in UI surfaces: Ruby Red (#9B111E), Yellow Gold (#FFD700), Emerald (#50C878).

## How to Run (Bootstrap)
```bash
docker-compose pull
# populate environment variables before starting (see `.env.sample` guidance below)
docker-compose up -d
```

### Environment Variable Expectations
Prepare a `.env` with values similar to:
```
POSTGRES_USER=eterna_admin
POSTGRES_PASSWORD=change_me
POSTGRES_DB=eterna_meta
REDIS_PASSWORD=change_me
NATS_USER=eterna
NATS_PASSWORD=change_me
SPOP_HOST=0.0.0.0
SPOP_PORT=443
BRIDGE_POLICY_PATH=/policies/bridge.yaml
GPU_RUNTIME=nvidia
```

## Implementation Notes
- Respect the DPPM strategy: decompose domain work, plan in parallel per shard, and merge with rigorous validation.
- Apply explicit error handling and PQC primitives (Kyber/Dilithium) in downstream code; avoid implicit trust between schemas.
- Enforce HTTP/3 + QUIC for gateway paths and WebTransport for XR services.
- Kafka may be swapped in for NATS if DAG frequency demands; maintain compatibility in message contracts.

## Governance Anchors
Human review is mandatory for SPOP changes, EternaBridge policy updates, schema privilege alterations, and PQC rotation schedules.
