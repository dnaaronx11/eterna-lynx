# SoulTies (DateHub) Ethical Frontend v1.0 — Governance Spec

> Role constraint: This document specifies **how and why** the system should be built. It intentionally avoids production-ready code and limits itself to architectural guidance, interfaces, and governance requirements.

## 1. Technical Specification

### 1.1 Scope & Intent
Build a mobile-first, accessibility-forward SoulTies frontend with a retro 90s aesthetic that visualizes AIGD transactional compliance and enforces ethical UX constraints. The implementation must be React Native/Expo-based with modular UI primitives and a simplified API client. The UX must prioritize trust, transparency, and low-complexity interaction.

### 1.2 Required Inputs (Multi-Stream Synthesis)
All architecture decisions must be grounded in the following streams. Missing data blocks must be resolved before implementation:

| Stream | Status | Required Artifacts | Impact on Design |
| --- | --- | --- | --- |
| NotebookLM Summaries | **Missing** | Trend summary for trust/safety UX, accessibility, carbon-aware compute | Guides UX norms and energy constraints |
| Linear Issues | **Missing** | Primary issue/epic defining scope | Defines goals, milestones, and acceptance |
| Amplitude Insights | **Missing** | Top flows + retention/funnel drop-offs | Prioritizes screens, copy, and defaults |
| Postman Schemas | **Missing** | `/matches`, `/dates`, `/limits`, `/tournaments` schemas | Defines API contracts and errors |

**Gate**: Implementation must not proceed without these inputs. In absence, only placeholders and interface stubs may be used.

### 1.3 User Stories
1. **Compliance transparency:** As a user, I can see weekly/monthly paid-date usage against hard limits so I can stay compliant.
2. **Ethical clarity:** As a user, I can read clear, non-negotiable guidance that “No sexual expectations—ever. Payments do not imply intimacy.”
3. **Match discovery:** As a user, I can browse suggested matches with a retro, accessible UI.
4. **Assisted conversation:** As a user, I can tap “AI Suggested Opener” to insert a personality-aligned starter.
5. **Light engagement:** As a user, I can view mini-games and tournaments to stay engaged without coercion.
6. **Privacy clarity:** As a user, I see a “Privacy Policy Active” shield when cross-network consent is not granted.

### 1.4 Acceptance Criteria
**Core UI & Accessibility**
- Mobile-first layout with large typography and high-contrast theme tokens (Ruby Red #9B111E, Yellow Gold #FFD700, Emerald #50C878).
- Modular components (e.g., `STButton`, `STText`) ensure consistent large tap targets and accessible text sizing.
- Retro 90s-inspired style: flat surfaces, bold borders, minimal depth, simple menus.

**Compliance & Ethics**
- Limits screen must display **weekly** and **monthly** paid-date usage vs policy caps.
- Ethical guideline screen displays the clause: **“No sexual expectations—ever. Payments do not imply intimacy.”**
- Any AI assistance must be explainable and non-coercive; allow user control before sending.

**Engagement**
- Games screen lists at least: Mahjong Master, Tetris Clone, Sudoku, Crossword Puzzle.
- Tournaments screen shows a leaderboard (user ID + score) and a visible “Join” button.

**Privacy**
- When `crossnet` consent is not granted, show “Privacy Policy Active” shield prominently.

### 1.5 Required Screens (Placeholders Only)
- `LimitsScreen`: Displays AIGD compliance usage with static policy caps.
- `YoungerInterestInfo`: Displays ethical clause.
- `GamesScreen`: Displays game list.
- `TournamentsScreen`: Displays leaderboard with Join CTA.
- `MatchesScreen`: Lists suggested matches.
- `ChatScreen`: Provides “AI Suggested Opener” that inserts text (client-side only) prior to send.

### 1.6 API Contracts (Stubbed)
- `/matches`: returns suggested matches (IDs, names, persona traits, safety flags).
- `/dates`: returns date history and paid interaction markers.
- `/limits`: returns usage counters and policy caps.
- `/tournaments`: returns leaderboard entries and tournament metadata.

All fields must align with Postman schemas once provided. Errors must be explicit and user-readable.

### 1.7 Design Tokens (Brand Compliance)
- Ruby Red `#9B111E`
- Yellow Gold `#FFD700`
- Emerald `#50C878`

### 1.8 Upgrade & Alternative Guidance
1. **Performance Upgrade**: Offload high-frequency game logic (Tetris physics, Mahjong pathfinding) to native RN modules or WASM for low latency on older devices.
2. **Security Enhancement**: Always display “Privacy Policy Active” shield if cross-network consent is absent, and require explicit consent UX for any crossnet linkage.
3. **Match Visualization Alternative**: Replace percentage scores with a **Persona Trait Visualization** (three overlapping circles for Analytical, Nurturing, Adventurous).

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: React Native + Expo
**Decision**: Use React Native with Expo for iOS/Android parity.
**Why**: Single codebase, accessible component ecosystem, mature deployment pipeline.
**Consequences**: Must validate performance hotspots and platform-specific accessibility defaults.

### ADR-002: Modular Components (`ST*`)
**Decision**: Introduce `STButton`, `STText`, `STCard`, etc.
**Why**: Enforces accessible sizes, consistent typography, and brand tokens across screens.
**Consequences**: Requires shared design token layer and linting/usage enforcement.

### ADR-003: Simplified API Client
**Decision**: Centralized API client with explicit error handling and schema validation.
**Why**: Clear request/response contract and better observability for compliance screens.
**Consequences**: Additional upfront work for typed DTOs; must align with Postman schemas.

### ADR-004: AIGD Compliance Screen
**Decision**: Dedicated `LimitsScreen` with hard-coded policy caps displayed alongside live counters.
**Why**: Transparency is core to safety UX; reduces misuse and protects users.
**Consequences**: Requires reliable backend counters and fallback messaging.

### ADR-005: Privacy Policy Active Shield
**Decision**: Surface a privacy shield if `crossnet` consent missing.
**Why**: Reinforces Privacy by Design and prevents accidental data linkage.
**Consequences**: Must be persistent and non-dismissable until consent is granted.

---

## 3. Risk & Tradeoff Analysis (Devil’s Advocate)

### 3.1 DPPM Decomposition (Intent Signal: **Missing Linear Issue**)
**Sub-goals (Shards):**
1. **Identity & Consent**: consent status retrieval, privacy shield.
2. **Compliance & Limits**: counters, caps, explanatory text.
3. **Engagement**: games and tournaments views.
4. **Matchmaking & AI Assist**: matches list and suggested opener.

### 3.2 Constraint Generation
- **Security**: Steganographic watermarking for media, explicit error handling for all API calls, secrets only via environment variables.
- **Performance**: < 150ms UI response time for tap interactions; < 1s to render compliance data after fetch.
- **Energy Efficiency**: Carbon-aware scheduling; defer non-critical calls to low-carbon windows when possible.

### 3.3 8 Failure Modes (Anticipatory Reflection)
1. **Post Request**: API call fails due to missing auth; must display safe fallback and retry affordance.
2. **Deliver Request**: Network latency causes timeout; must show offline/slow state.
3. **Validate Request**: Schema mismatch; must log and block rendering of invalid fields.
4. **Update Server State**: Tournament join fails; must avoid optimistic success until confirmed.
5. **Post Reply**: API responds with partial data; must degrade gracefully.
6. **Deliver Reply**: Data corruption in transit; must checksum/validate (where supported).
7. **Validate Reply**: Response fails validation; must show “data unavailable” messaging.
8. **Update Client State**: State desync; must provide refresh and state reconciliation.

### 3.4 Tradeoffs
- **Retro UI vs. Modern UI**: Retro simplifies visual density but may limit discoverability; mitigate with clear labels.
- **Hard Caps Display vs. Dynamic Rules**: Hard-coded caps improve clarity but risk divergence from backend rules; show “policy source” metadata.
- **Privacy Shield Persistence**: Non-dismissable UI may frustrate users; mitigate with clear consent steps.

---

## 4. Governance Anchors (Human Oversight)
1. **Consent Flow Review**: Human approval required before enabling cross-network data linkage.
2. **Ethics Copy Review**: Human review of any edits to the non-negotiable clause.
3. **AIGD Compliance Logic**: Human verification of policy caps and usage calculations.
4. **AI Suggested Opener**: Human review of prompt templates and filtering policy.
5. **Games/Tournaments Monetization**: Human approval for any point/score incentives.

---

## 5. Implementation Guidance (Non-Code)

### 5.1 Branch Naming (Gitflow)
Use the format `{layer}/{hub}/{module}/{tag}` with `tag ∈ {feature, date, time}`.
**Suggested branch**: `mobile/datehub/frontend/feature`

### 5.2 Security & Integrity
- Secrets must come from environment variables only.
- Explicit error handling in all API calls.
- Steganographic watermarking required for any user-generated media.

### 5.3 Thematic & Accessibility Rules
- Default font size large; ensure dynamic type support.
- Buttons must exceed minimum tap target size; ensure generous padding.
- High contrast (Ruby Red, Yellow Gold, Emerald) with neutral backgrounds.

---

## 6. Deliverables Checklist
- [ ] `retro90s` theme tokens defined (colors, font sizes, padding).
- [ ] Placeholder `LimitsScreen` spec aligned with `/limits` schema.
- [ ] Placeholder `ChatScreen` spec with “AI Suggested Opener” UX.
- [ ] Placeholder `GamesScreen`, `TournamentsScreen`, `MatchesScreen`, `YoungerInterestInfo`.
- [ ] API client contract spec (aligned to Postman schema).
