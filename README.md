# EternaLynX Phase 1 Foundation

Production foundation bootstrap using Turborepo with strict planar isolation and local-first identity/audit logging.

## Tech choices
- **Monorepo:** Turborepo + npm workspaces.
- **API:** Fastify (lightweight Node runtime).
- **Web Console:** Vite + React (fast local development).
- **Runtime validation:** Zod schemas in shared package.
- **Logging:** structured JSON + hash-chained audit log.

## Repository tree

```text
.
├── AGENTS.md
├── .env.example
├── docker-compose.yml
├── turbo.json
├── tsconfig.base.json
├── apps
│   ├── api-gateway
│   │   ├── src
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   └── test
│   │       └── smoke.test.ts
│   └── console-web
│       ├── index.html
│       ├── src
│       │   └── main.tsx
│       └── vite.config.ts
├── packages
│   ├── bridge/src/index.ts
│   ├── identity/src/index.ts
│   ├── kernel/src/index.ts
│   ├── logging/src/index.ts
│   ├── odd-runtime
│   │   ├── odd_runtime/__init__.py
│   │   └── pyproject.toml
│   ├── security/src/index.ts
│   └── shared-types/src/index.ts
├── planes
│   ├── capitalinx/src/index.ts
│   ├── omnilinx/src/index.ts
│   └── socialinx/src/index.ts
├── infra
│   └── docker
│       ├── Dockerfile.api
│       └── Dockerfile.web
└── docs
    └── architecture
        └── phase1-foundation.md
```

## Local setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build all packages:
   ```bash
   npm run build
   ```
4. Run services locally:
   ```bash
   npm run dev
   ```
5. Open console: `http://localhost:5173`
6. Health endpoint: `http://localhost:3001/health`

## First runnable slice
`console-web -> api-gateway -> kernel -> bridge -> omnilinx`

## API usage sample

```bash
curl -sS http://localhost:3001/health
```

```bash
curl -sS http://localhost:3001/api/v1/execute \
  -H 'content-type: application/json' \
  -d '{
    "requestId":"5d4e5b52-c0b1-4be5-ad6d-4a7d58ce7dbe",
    "identityId":"user-local-1",
    "plane":"omnilinx",
    "action":"echo",
    "payload":{"hello":"lynxverse"},
    "timestamp":"2026-01-01T00:00:00.000Z"
  }'
```

## Docker Compose

```bash
docker compose up --build
```

## Smoke tests

```bash
npm run smoke
```

## Audit log example
Audit lines are appended as JSONL to `./logs/audit.log`:

```json
{"requestId":"5d4e5b52-c0b1-4be5-ad6d-4a7d58ce7dbe","identityId":"user-local-1","plane":"omnilinx","action":"echo","outcome":"ok","payloadDigest":"...","timestamp":"2026-04-14T00:00:00.000Z","prev":"GENESIS","hash":"..."}
```

## Constraints honored
- No blockchain/smart-contract/trading/AR/VR/hardware/cloud-only implementation.
- No direct plane-to-plane or app-to-plane calls; only bridge contract execution path.
- `capitalinx`, `socialinx`, and `odd-runtime` are explicit stubs for later phases.
