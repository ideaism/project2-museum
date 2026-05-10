# The Glitching Archive

The Glitching Archive is a mobile-first WebAR museum prototype for political ceramic mugs from a stored collection. It treats the mug as a double container: an everyday vessel for routine and a carrier of political memory.

Visitors scan a physical cup marker or QR code, then tilt the phone as if pouring from the cup. The interface reveals three labelled narrative layers:

- `surface`: museum facts, object metadata, and clearly marked placeholders.
- `middle`: labelled inference and speculation about political, social, or emotional readings.
- `core`: unresolved, redacted, disputed, or visitor-contributed memory.

The prototype is designed for museum visitors, tutors, reviewers, and collaborators. It remains legible without camera, motion, audio, or AR permissions.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- AR.js marker tracking through A-Frame runtime scripts
- LocalStorage-only MVP annotations
- Plain CSS with small reusable components

No backend is required for the current prototype.

## Routes

- `/`: walkthrough entry points and project overview.
- `/ar/:id`: marker-based AR route with camera and marker fallback states.
- `/object/:id`: camera-free object page with manual pour controls.
- `/projection`: projection and sound-wall mode for installation use.
- `/about`: one-page design statement and AI process note.

Current sample IDs:

- `sample-mug`
- `campaign-slogan-mug`
- `commemorative-protest-mug`

Example routes:

- `/ar/sample-mug`
- `/object/sample-mug`
- `/object/campaign-slogan-mug`
- `/projection`

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Build the production bundle:

```bash
npm run build
```

Preview the built bundle:

```bash
npm run preview
```

## Demo Without AR

Use `/object/sample-mug` for the complete no-camera path. The object page includes a keyboard-accessible pour slider and layer buttons, so reviewers can move between `surface`, `middle`, and `core` without granting camera or motion permissions.

Use `/projection` for the installation wall mode. It does not require camera access and can display archive fragments plus local visitor annotations.

## Demo With AR

1. Serve the app from `localhost` or HTTPS. Camera access will not work from an insecure remote origin.
2. Open `/ar/sample-mug` on a phone.
3. Add a real AR.js `.patt` marker at the path listed in the mug record, then print the marker beside or under the physical cup.
4. Tap the camera request control.
5. Tilt the phone as if pouring to shift narrative layers.

If the marker file is missing, the AR route shows a marker-missing state and links to the no-AR object walkthrough.

## Required Showcase Assets

The current repository uses placeholder paths. Before a final public showcase, provide:

- Object photographs for each mug under `public/assets/archive/images/`.
- AR.js marker pattern files under `public/assets/archive/markers/`.
- QR code SVGs under `public/assets/archive/qr/`.
- Optional projection audio under `public/assets/archive/audio/`.
- Optional model or texture assets if the AR stand-in is replaced.

See [docs/archive-asset-requirements.md](docs/archive-asset-requirements.md) for the tracked placeholder paths.

## Ethics and Source Labelling

The prototype must not invent museum metadata. Missing maker, date, accession number, dimensions, campaign, protest, donor, owner, or affiliation data stays marked as placeholder or unknown until supplied by evidence.

Every narrative fragment carries a visible source label:

- `fact`
- `inference`
- `speculation`
- `visitorContribution`
- `redacted`

Visitor annotations are stored only in the browser's LocalStorage. They are not submitted to a server and must not be treated as verified museum facts.

## Documentation

- [QA checklist](docs/qa-checklist.md)
- [Deployment notes](docs/deployment.md)
- [Accessibility notes](docs/accessibility.md)
- [AI process note](docs/ai-process-note.md)
- [Final showcase setup](docs/final-showcase-setup.md)
- [Design statement](docs/design-statement.md)
- [Final integration checklist](docs/integration-checklist.md)

## Known Limitations

- Archive object metadata is placeholder material until source records and object photographs are supplied.
- AR.js marker files and QR code files are not yet present at all placeholder paths.
- Projection audio paths are planned assets; sound-wall audio should be added before installation use.
- LocalStorage annotations are suitable for MVP demonstration only and are not shared across devices.
- This repository currently has no `npm run test` or `npm run lint` script.
