# EternaLynX Agent Rules

## Scope
These rules apply to the entire repository.

## Coding Standards
- TypeScript must use strict mode and explicit runtime validation for inbound data.
- Cross-plane calls are forbidden. Only `packages/bridge` may invoke plane handlers.
- Every externally initiated action must create an audit log record.
- Keep packages composable and side-effect minimal.
- Avoid TODO placeholders; implement working logic with tests.

## Security Rules
- Validate untrusted input with Zod schemas from `packages/shared-types`.
- Never log secrets, keys, or raw private material.
- Default-deny unknown actions in bridge routing.

## Testing Rules
- Add smoke tests for API health and execution flow.
- Keep tests deterministic and local-only.

## Documentation
- Update `docs/architecture` when architecture or flow changes.
