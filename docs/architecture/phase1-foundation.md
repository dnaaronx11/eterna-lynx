# EternaLynX Phase 1 Foundation Architecture

```mermaid
flowchart LR
  CW[apps/console-web] --> AG[apps/api-gateway]
  AG --> K[packages/kernel]
  K --> B[packages/bridge]
  B --> O[planes/omnilinx]

  I[packages/identity] --> AG
  L[packages/logging] --> AG
  S[packages/security] --> AG
  T[packages/shared-types] --> AG
  T --> K
  T --> B

  So[planes/socialinx stub]:::stub
  Ca[planes/capitalinx stub]:::stub
  Or[packages/odd-runtime stub]:::stub

  classDef stub fill:#2d2d2d,stroke:#777,stroke-dasharray: 5 5,color:#ddd;
```

## Planar Isolation Rule
- `kernel` never calls plane internals directly; it only uses `bridge.execute(...)`.
- planes expose handlers registered into bridge; no plane-to-plane imports.
- `socialinx` and `capitalinx` remain non-operational stubs in this phase.

## Local-first identity + audit
- identity keys are generated and persisted locally at `./.local/identity.json`.
- audit events are hash-chained and appended to `./logs/audit.log`.
