# The Glitching Archive

The Glitching Archive is a mobile-first camera gesture museum prototype for political ceramic mugs from a stored collection. It treats the mug as a double container: an everyday vessel for routine and a carrier of political memory.

The core interaction is now the **Camera Gesture Pour Experience**. Instead of scanning an AR marker, the visitor uses the camera as a local gesture input: hold a hand as if holding a mug, rotate the hand as if pouring, and the archive moves through three labelled narrative layers.

- `surface`: visible object evidence, museum facts, source-linked metadata, and clearly marked placeholders.
- `middle`: labelled inference and speculation about political, social, domestic, and emotional readings.
- `core`: unresolved, redacted, disputed, or visitor-contributed memory.

The audience is museum visitors, tutors, reviewers, and collaborators assessing a speculative archive prototype. The experience remains understandable without camera, motion, audio, or gesture tracking because the no-camera object route includes a manual slider fallback.

## Current Prototype

Implemented routes:

- `/`: entry route and project overview.
- `/gesture/:id`: primary camera gesture pouring route.
- `/ar/:id`: legacy compatibility route that redirects to `/gesture/:id`.
- `/object/:id`: camera-free object walkthrough with mug imagery/model, pour controls, source labels, and local annotations.
- `/projection`: projection / sound-wall mode for the installation wall.
- `/about`: design statement, ethics, references, source limits, and AI process note.

Current object IDs:

- `sample-mug`: Support the Miners.
- `campaign-slogan-mug`: Labour Red Rose.
- `commemorative-protest-mug`: People's March for Jobs.

Useful demo routes:

- `/gesture/sample-mug`
- `/object/sample-mug`
- `/object/campaign-slogan-mug`
- `/object/commemorative-protest-mug`
- `/projection`
- `/about`

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Browser camera access through `getUserMedia`
- MediaPipe hand landmarks for local gesture sensing
- LocalStorage-only MVP annotations
- Plain CSS and small reusable components

No backend is used in the current prototype.

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

## Demo Camera Gesture Pour

1. Serve the app from `localhost` or HTTPS. Camera access will not work from an insecure remote origin.
2. Open `/gesture/sample-mug` on a phone or laptop.
3. Press `Start gesture camera`.
4. Hold a hand as if holding a cup.
5. Rotate the hand as if pouring. Hand rotation controls `pourValue`, moving from `surface` through `middle` into `core`.
6. If tracking is low-confidence, use the calibration controls or switch to the manual slider fallback on `/object/sample-mug`.

Camera processing is local to the browser. The prototype does not record video, upload video, or send camera frames to a project backend.

## Demo Without Camera

Use `/object/sample-mug` as the primary no-camera assessment route. It does not require camera permission, gesture tracking, or motion sensors. The manual pour slider and layer buttons move through the same `surface`, `middle`, and `core` layers.

Use `/projection` for wall mode. Projection mode reads the same archive records and can show local visitor contributions saved in this browser.

## Obsolete Marker Workflow

AR.js marker tracking and `.patt` files are no longer the core interaction. The repository may still contain legacy marker assets or data fields from earlier prototypes, but assessors do **not** need to provide marker pattern files to run the current Camera Gesture Pour Experience.

The conceptual act is not scanning a marker. It is performing the bodily gesture of pouring while the mug remains a container of political memory.

## Asset Status

Present in `public/assets/archive/`:

- Mug images: `images/mug1.png`, `images/mug2.png`, `images/mug3.png`.
- GLB models: `models/mug1.glb`, `models/mug2.glb`, `models/mug3.glb`, `models/sample-mug.glb`, `models/campaign-slogan-mug.glb`.
- Legacy marker files retained from an older route; not required for the current core experience.

Missing or still required for final presentation:

- Projection audio files.
- Captions/transcripts or written sound cue lists for any final audio.
- Verified object metadata and rights information for public display.
- Optional QR code linking to `/gesture/sample-mug` or `/object/sample-mug`.

See [docs/gesture-pour-interaction.md](docs/gesture-pour-interaction.md), [docs/camera-troubleshooting.md](docs/camera-troubleshooting.md), and [docs/asset-checklist.md](docs/asset-checklist.md).

## Ethics and Source Labelling

The prototype must not invent museum metadata. Missing maker, date, accession number, dimensions, campaign, protest, donor, owner, affiliation, or rights data must remain marked as missing, partial, possible, or placeholder until verified by evidence.

Every narrative fragment carries a visible label:

- `fact`
- `inference`
- `speculation`
- `visitorContribution`
- `redacted`

Visitor annotations are stored only in the browser's LocalStorage. They are not submitted to a server and must not be treated as verified museum facts.

## Design References

The project positions itself near immersive documentary, glitch studies, sound archives, and open-storage museum practice:

- Karim Ben Khelifa, [The Enemy](https://arts.mit.edu/the-enemy/) / [NFB installation page](https://ennemi.onf.ca/the-installation), as a precedent for spatial encounter and contested testimony.
- Rosa Menkman, [The Glitch Moment(um)](https://networkcultures.org/_uploads/NN%234_RosaMenkman.pdf), as a reference for glitch as critical interruption rather than surface decoration.
- [BBC Sound Effects Archive](https://sound-effects.bbcrewind.co.uk/), as a reference for searchable sound archive and remixable sound material.
- [V&A East Storehouse](https://www.vam.ac.uk/east/storehouse/visit) and [Lookup](https://lookup.vam.ac.uk/), as references for open storage, object proximity, lookup, and visible museum infrastructure.

These are design/research precedents, not evidence for the mug records.

## Documentation

- [Final assessment setup](docs/final-assessment-setup.md)
- [Gesture pour interaction](docs/gesture-pour-interaction.md)
- [Camera troubleshooting](docs/camera-troubleshooting.md)
- [Asset checklist](docs/asset-checklist.md)
- [AI ethics note](docs/ai-ethics-note.md)
- [Accessibility note](docs/accessibility-note.md)
- [QA checklist](docs/qa-checklist.md)
- [Deployment notes](docs/deployment.md)
- [Design statement](docs/design-statement.md)

## Current Limits

- Object metadata remains partial or possible-match material until verified collection records are supplied.
- Gesture mode depends on HTTPS or localhost, camera permission, browser support, lighting, hand visibility, and MediaPipe model loading.
- Gesture tracking is an input method, not historical evidence.
- Audio is designed but not supplied; projection mode must work silently.
- LocalStorage annotations are demonstration data and are not shared across devices.
- The project currently has no automated `test` or `lint` npm scripts.
