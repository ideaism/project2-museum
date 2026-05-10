# The Glitching Archive: Multi-Agent Build Guide

This file is the source of truth for all Codex agents working on The Glitching Archive. Read it before editing the repository.

## Project Concept

The Glitching Archive is a mobile-first WebAR museum prototype for a constellation of political ceramic mugs from a stored collection. The mug is treated as a dual container: daily routine and political memory.

The visitor scans a mug marker and tilts the phone as if pouring from the cup. Tilt reveals three labelled narrative layers:

- `surface`: official museum facts and object metadata.
- `middle`: speculative political, social, or emotional readings.
- `core`: unresolved, redacted, or visitor-contributed memory.

The final prototype should communicate a walkable installation system, not only a screen interface. It must include:

- A mobile walkthrough.
- A physical cup plus QR/AR marker.
- A projection or sound-wall mode.
- Co-curation and annotation tools.
- A one-page design statement / AI process note.

## Audience

Primary users are museum visitors, tutors, reviewers, and project collaborators evaluating a speculative WebAR archive prototype. The experience should be legible to people who cannot or do not grant camera or motion permissions.

## Technical Stack

- React + TypeScript + Vite.
- React Router routes:
  - `/`
  - `/ar/:id`
  - `/object/:id`
  - `/projection`
  - `/about`
- WebAR first prototype: AR.js marker tracking before more fragile image-tracking approaches.
- LocalStorage for MVP annotations.
- No backend unless explicitly requested later.
- No heavy UI library. Use semantic HTML, plain CSS, CSS modules, or small reusable components.
- Mobile-first layout with accessible fallbacks for camera, sensor, and AR permission failures.

## Shared TypeScript Contracts

Agents must reuse these names and values. If implementation files are added later, place shared types in `src/types/archive.ts` or the closest existing shared-types location.

```ts
export type LayerState = 'surface' | 'middle' | 'core';

export type ArchiveSourceType =
  | 'fact'
  | 'inference'
  | 'speculation'
  | 'visitorContribution'
  | 'redacted';

export type AnnotationType =
  | 'question'
  | 'counterReading'
  | 'memory'
  | 'dispute';

export interface ArchiveSource {
  id: string;
  type: ArchiveSourceType;
  label: string;
  citation?: string;
  confidence?: 'confirmed' | 'partial' | 'unknown';
}

export interface NarrativeFragment {
  id: string;
  layer: LayerState;
  title: string;
  text: string;
  sourceType: ArchiveSourceType;
  sourceIds: string[];
}

export interface MugRecord {
  id: string;
  slug: string;
  title: string;
  maker?: string;
  dateRange?: string;
  collectionId?: string;
  material?: string;
  dimensions?: string;
  markerPatternPath: string;
  qrPath?: string;
  modelPath?: string;
  imagePath?: string;
  facts: NarrativeFragment[];
  middleReadings: NarrativeFragment[];
  coreFragments: NarrativeFragment[];
  sources: ArchiveSource[];
}

export interface VisitorAnnotation {
  id: string;
  mugId: string;
  type: AnnotationType;
  layer: LayerState;
  text: string;
  createdAt: string;
  displayName?: string;
}
```

## Ethical Rules

- Never present speculation, inference, or visitor memory as confirmed fact.
- Every narrative fragment must carry a visible source label: fact, inference, speculation, visitor contribution, or redacted.
- Keep unresolved or redacted material visible as a legitimate archive state. Do not force closure where the archive is uncertain.
- Include a right-to-opacity / redaction principle in the design statement and UI copy where relevant.
- Do not fabricate museum metadata. Use placeholders when source data is missing and document what asset or evidence is needed.
- Visitor-contributed content in the MVP must remain local-only unless a backend is explicitly requested.

## Coding Conventions

- Inspect the existing repository before editing and follow its current structure.
- Keep components small and named for their role in the installation.
- Prefer semantic HTML and accessible controls over purely visual elements.
- Use route-level pages for major views and reusable components for layer controls, object cards, source labels, annotation forms, and fallback notices.
- Keep CSS scoped and predictable. Avoid global resets or broad selectors unless the integration agent approves them.
- Use placeholder media paths when assets do not exist, and list the needed real assets in the handoff.
- Run relevant checks before handing off:
  - `npm run build`
  - `npm run test`, if available
  - `npm run lint`, if available

## Folder Ownership

| Agent | Suggested branch | Primary responsibility | Owns / can edit | Avoid editing |
| --- | --- | --- | --- | --- |
| 00 | `agent-00-orchestrator` | Project contracts, merge order, integration checklist | `AGENTS.md`, `docs/agent-handoff.md`, `docs/integration-checklist.md`, README planning sections | Feature implementation files except final integration notes |
| 01 | `agent-01-foundation` | Vite, React Router, base app shell, shared types | `package.json`, `vite.config.*`, `src/main.*`, `src/App.*`, `src/types/*`, `src/routes/*` | Content data and AR implementation unless needed for route stubs |
| 02 | `agent-02-archive-data` | Mug records, source labels, placeholder asset manifest | `src/data/*`, `public/assets/archive/*`, data docs | Router and page layout |
| 03 | `agent-03-ar-walkthrough` | AR.js marker route, permission fallback, tilt layer mapping | `src/pages/ARPage.*`, `src/components/ar/*`, `public/assets/markers/*` | Projection and about pages |
| 04 | `agent-04-object-detail` | Object pages, layer viewer, source labelling | `src/pages/ObjectPage.*`, `src/components/object/*` | AR tracking internals |
| 05 | `agent-05-annotations` | LocalStorage annotations and co-curation UI | `src/components/annotations/*`, `src/hooks/useAnnotations.*`, annotation tests | Core archive data model names |
| 06 | `agent-06-projection` | Projection / sound-wall route | `src/pages/ProjectionPage.*`, `src/components/projection/*` | Mobile AR controls |
| 07 | `agent-07-design-system` | Visual system, responsive layout, accessibility polish | `src/styles/*`, shared layout components, tokens | Data semantics and source labels |
| 08 | `agent-08-statement-docs` | About page, design statement, AI process note, asset requirements | `src/pages/AboutPage.*`, `docs/design-statement.md`, README narrative sections | Runtime AR code |
| 09 | `agent-09-final-integration` | Merge resolution, final QA, acceptance checklist | Cross-cutting integration edits after reviewing all branches | Rewriting agent-owned features without preserving intent |

## Conflict Prevention

- Agent 01 must establish shared routes and type locations before feature agents begin.
- Agents 02, 03, 04, 05, 06, 07, and 08 can work in parallel after Agent 01, provided they respect ownership boundaries.
- Agent 09 integrates after all feature branches and uses `docs/integration-checklist.md` as the final source of truth.
- Do not rename shared type values or route paths without updating this file and the handoff document.
- Do not introduce a second data model for mug records, annotations, or narrative layers.
- Keep AR asset paths, QR paths, and placeholder image paths centralized in mug records.

## Required Final Checks

The final integrated prototype must demonstrate:

- AR path: marker route loads and handles camera permission state.
- No-AR path: object detail pages work without camera or sensor access.
- Projection path: `/projection` can be used as installation wall mode.
- Mobile sensor path: tilt or fallback controls change narrative layers.
- Annotation path: LocalStorage annotations can be created, displayed, and cleared or managed.
- Ethical labelling: all facts, inferences, speculation, visitor contributions, and redactions are visibly labelled.
- Build: production build succeeds.
- Accessibility fallback: keyboard, reduced capability, and permission-denied states remain usable.
