# The Glitching Archive

The Glitching Archive is a mobile-first WebAR museum prototype for political ceramic mugs from a stored collection. It treats the mug as a double container: an everyday vessel for routine and a carrier of political memory.

The visitor scans a physical cup marker or QR code, then tilts the phone as if pouring from the cup. The pour reveals three labelled narrative layers:

- `surface`: visible object evidence, museum facts, source-linked metadata, and clearly marked placeholders.
- `middle`: labelled inference and speculation about political, social, domestic, and emotional readings.
- `core`: unresolved, redacted, disputed, or visitor-contributed memory.

The audience is museum visitors, tutors, reviewers, and collaborators assessing a speculative WebAR archive prototype. The experience is designed to remain understandable without camera, motion, audio, or AR permissions.

## Current Prototype

Implemented routes:

- `/`: entry route and project overview.
- `/ar/:id`: AR.js marker route with camera, marker, motion, and no-AR fallback states.
- `/object/:id`: camera-free object walkthrough with mug imagery/model, pour controls, source labels, and local annotations.
- `/projection`: projection / sound-wall mode for the installation wall.
- `/about`: design statement, ethics, references, source limits, and AI process note.

Current object IDs:

- `sample-mug`: Support the Miners.
- `campaign-slogan-mug`: Labour Red Rose.
- `commemorative-protest-mug`: People's March for Jobs.

Useful demo routes:

- `/object/sample-mug`
- `/object/campaign-slogan-mug`
- `/object/commemorative-protest-mug`
- `/ar/sample-mug`
- `/projection`
- `/about`

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- AR.js marker tracking through A-Frame runtime scripts
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

## Demo Without AR

Use `/object/sample-mug` as the primary assessment route. It does not require camera, AR marker tracking, or motion sensors. The manual pour slider and layer buttons move through `surface`, `middle`, and `core`.

Use `/projection` for wall mode. Projection mode reads the same archive records and can show local visitor contributions saved in this browser.

## Demo With AR

1. Serve the app from `localhost` or HTTPS. Camera access will not work from an insecure remote origin.
2. Open `/ar/sample-mug` on a phone.
3. Print `public/assets/archive/markers/sample-mug-marker-card.png` or another matching marker card.
4. Confirm `/assets/archive/markers/sample-mug.patt` loads from the deployed site.
5. Tap the camera request control.
6. Tilt the phone as if pouring to shift narrative layers.

Only `sample-mug` currently has a `.patt` file in the repository. The AR routes for `campaign-slogan-mug` and `commemorative-protest-mug` are expected to report missing marker files until their `.patt` files are generated and added.

## Asset Status

Present in `public/assets/archive/`:

- Mug images: `images/mug1.png`, `images/mug2.png`, `images/mug3.png`.
- Marker image: `markers/sample-mug-marker-card.png`.
- AR.js marker pattern: `markers/sample-mug.patt`.
- GLB models: `models/mug1.glb`, `models/mug2.glb`, `models/mug3.glb`, `models/sample-mug.glb`, `models/campaign-slogan-mug.glb`.

Missing or still required:

- `.patt` marker files for `campaign-slogan-mug` and `commemorative-protest-mug`.
- QR code SVGs for all three mugs.
- Projection audio files.
- Captions/transcripts or written sound cue lists for any final audio.
- Verified object metadata and rights information for public display.

See [docs/asset-checklist.md](docs/asset-checklist.md) and [docs/marker-workflow.md](docs/marker-workflow.md).

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
- [V&A East Storehouse](https://www.vam.ac.uk/east/storehouse/visit) and [Lookup](https://lookup.vam.ac.uk/), as references for open storage, object proximity, QR lookup, and visible museum infrastructure.

These are design/research precedents, not evidence for the mug records.

## Documentation

- [Final assessment setup](docs/final-assessment-setup.md)
- [Asset checklist](docs/asset-checklist.md)
- [Marker workflow](docs/marker-workflow.md)
- [AI ethics note](docs/ai-ethics-note.md)
- [Accessibility note](docs/accessibility-note.md)
- [QA checklist](docs/qa-checklist.md)
- [Deployment notes](docs/deployment.md)
- [Design statement](docs/design-statement.md)

## Current Limits

- Object metadata remains partial or possible-match material until verified collection records are supplied.
- Live AR depends on HTTPS or localhost, camera permission, AR.js/A-Frame script loading, marker print quality, lighting, and real `.patt` files.
- Audio is designed but not supplied; projection mode must work silently.
- LocalStorage annotations are demonstration data and are not shared across devices.
- The project currently has no automated `test` or `lint` npm scripts.
