# Agent Handoff Plan

This document defines the recommended merge order, dependency map, branch responsibilities, and known integration risks for The Glitching Archive.

## Recommended Merge Order

1. Agent 00: `agent-00-orchestrator`
   - Merge first.
   - Establishes shared contracts, ownership, route expectations, and acceptance checks.

2. Agent 01: `agent-01-foundation`
   - Merge second.
   - Creates the React + TypeScript + Vite foundation, route stubs, shared type file, and base app shell.

3. Agent 02: `agent-02-archive-data`
   - Merge third.
   - Adds mug records, source labels, placeholder media paths, and asset manifest.

4. Agents 03, 04, 05, 06, 07, and 08
   - Work in parallel after Agents 00-02.
   - Merge in this preferred order if conflicts appear:
     - Agent 07 design tokens and layout primitives.
     - Agent 04 object detail and layer viewer.
     - Agent 05 annotations.
     - Agent 03 AR walkthrough.
     - Agent 06 projection mode.
     - Agent 08 about page and design statement.

5. Agent 09: `agent-09-final-integration`
   - Merge last.
   - Resolves conflicts, checks routes, validates data contracts, runs QA, and completes the final acceptance checklist.

## Dependency Map

| Agent | Can start after | Blocks | Parallel-safe with | Notes |
| --- | --- | --- | --- | --- |
| 00 | Immediately | All agents | None | Must remain the coordination source throughout the build. |
| 01 | 00 | 02-08 | None until foundation is stable | Creates shared app skeleton and type location. |
| 02 | 01 | 03, 04, 05, 06 | 07, 08 | Supplies mug records and placeholder paths. |
| 03 | 01, 02 | 09 | 04, 05, 06, 07, 08 | Needs stable mug IDs and marker paths. |
| 04 | 01, 02 | 05, 09 | 03, 06, 07, 08 | Should reuse shared layer and source labels. |
| 05 | 01, 02, 04 contract | 09 | 03, 06, 07, 08 | Uses `AnnotationType`, `LayerState`, and mug IDs. |
| 06 | 01, 02 | 09 | 03, 04, 05, 07, 08 | Uses same mug records but different presentation mode. |
| 07 | 01 | 03-06 UI polish, 09 | 02, 08 | Avoid broad CSS that breaks agent-owned components. |
| 08 | 00, 01 | 09 | 02-07 | Must reflect actual implemented prototype and source limits. |
| 09 | All prior branches | Final delivery | None | Performs final integration only. |

## Agent Responsibilities

### Agent 01: Foundation

- Initialize or adapt React + TypeScript + Vite.
- Add React Router with `/`, `/ar/:id`, `/object/:id`, `/projection`, and `/about`.
- Create shared type contracts exactly matching `AGENTS.md`.
- Add minimal route stubs only where needed to unblock other agents.
- Avoid implementing content-heavy UI.

### Agent 02: Archive Data

- Create mug records using the shared `MugRecord` shape.
- Label every source as `fact`, `inference`, `speculation`, `visitorContribution`, or `redacted`.
- Use placeholder media paths where assets are missing.
- Maintain an asset requirements list with exact filenames and intended use.

### Agent 03: AR Walkthrough

- Build `/ar/:id` using AR.js marker tracking for the first prototype.
- Handle camera permission denied, camera unavailable, and unsupported AR cases.
- Map tilt or fallback controls to `surface`, `middle`, and `core`.
- Avoid inventing new layer names or unlabelled narrative states.

### Agent 04: Object Detail

- Build `/object/:id` as the accessible no-camera path.
- Show object metadata, layer narratives, source labels, and route links.
- Keep speculative and redacted material visibly marked.

### Agent 05: Annotations

- Implement LocalStorage-only annotations for MVP.
- Use the shared `VisitorAnnotation`, `AnnotationType`, and `LayerState` contract.
- Include a clear local-only privacy note.
- Do not introduce a backend or network persistence.

### Agent 06: Projection

- Build `/projection` as installation wall mode.
- Reuse mug records and narrative layers.
- Use large, legible text and motion/audio fallbacks where appropriate.
- Avoid depending on camera permission.

### Agent 07: Design System

- Define responsive layout, color tokens, typography, source labels, and control states.
- Keep mobile-first interaction comfortable for handheld use.
- Preserve semantic HTML and focus visibility.
- Avoid global CSS changes that accidentally restyle AR.js internals or third-party DOM.

### Agent 08: Statement and Process Note

- Build `/about`.
- Draft a one-page design statement and AI process note.
- Include right-to-opacity / redaction as a design principle.
- Document missing assets and source limitations.

### Agent 09: Final Integration

- Merge all prior work.
- Resolve route, CSS, data, and asset conflicts.
- Run build, tests if available, and lint if available.
- Complete `docs/integration-checklist.md`.
- Return a concise PR-style summary.

## Conflict-Avoidance Rules

- Shared routes are fixed: `/`, `/ar/:id`, `/object/:id`, `/projection`, `/about`.
- Shared type names and union values are fixed unless Agent 09 updates all references.
- Mug IDs and slugs must remain stable after Agent 02.
- Keep placeholder assets under a predictable public path, preferably `public/assets/...`.
- Do not duplicate archive data in page components.
- Do not duplicate annotation persistence logic across components.
- Prefer additive CSS classes over broad element selectors.
- When two branches touch the same file, the later agent should preserve both responsibilities and document the merge decision.

## Running Integration Risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Conflicting CSS | Mobile AR, projection, and object pages need different density and scale. | Agent 07 defines tokens; feature agents use scoped classes. |
| Duplicate data models | Components may invent incompatible mug or layer fields. | Reuse `AGENTS.md` shared contracts and central data files. |
| Mismatched routes | Links and router paths may diverge. | Agent 01 owns route skeleton; later agents fill route components. |
| AR asset path differences | AR.js marker paths, QR paths, and object images can drift. | Agent 02 centralizes paths in `MugRecord`. |
| Mobile permission issues | Camera and sensor permissions can fail or be denied. | Agent 03 adds explicit fallback controls and messages. |
| Unlabelled speculation | Ethical requirement could be broken by narrative UI. | Agent 04 and 08 verify visible source labels. |
| LocalStorage schema drift | Annotation data may become unreadable between components. | Agent 05 owns the hook and storage key. |
| Projection readability | Wall mode can become too small or too detailed. | Agent 06 tests large-screen and mobile browser fallbacks. |

## Asset Requirements To Track

Agents should document missing assets in README or `docs/design-statement.md` as they appear:

- Mug object photographs.
- AR.js marker pattern files.
- QR code files.
- Optional 3D mug model or lightweight stand-in.
- Projection background or texture assets, if used.
- Sound files, if sound-wall behavior is implemented.

## PR Summary Template

```md
Summary:
- 

Files changed:
- 

Design / implementation decisions:
- 

Checks run:
- [ ] npm run build
- [ ] npm run test, if available
- [ ] npm run lint, if available

Known limitations / next agent handoff:
- 
```
