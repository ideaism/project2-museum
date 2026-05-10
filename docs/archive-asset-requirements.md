# Archive Asset Requirements

Agent 02 uses placeholder paths for missing related assets. These files are required before the prototype can be presented as a verified object archive.

| Mug ID | Asset | Placeholder path | Purpose |
| --- | --- | --- | --- |
| `sample-mug` | Object photograph | `/assets/archive/images/sample-mug.jpg` | No-AR object page and archive cards |
| `sample-mug` | AR.js marker pattern | `/assets/archive/markers/sample-mug.patt` | Printed marker-card tracker for `/ar/sample-mug` |
| `sample-mug` | QR code | `/assets/archive/qr/sample-mug.svg` | Physical cup route entry |
| `sample-mug` | 3D model | `/assets/archive/models/sample-mug.glb` | No-AR object detail viewer |
| `sample-mug` | Projection audio | `/assets/archive/audio/sample-mug-projection.mp3` | Optional sound-wall loop |
| `campaign-slogan-mug` | Object photograph | `/assets/archive/images/campaign-slogan-mug.jpg` | No-AR object page and archive cards |
| `campaign-slogan-mug` | AR.js marker pattern | `/assets/archive/markers/campaign-slogan-mug.patt` | Printed marker-card tracker for `/ar/campaign-slogan-mug` |
| `campaign-slogan-mug` | QR code | `/assets/archive/qr/campaign-slogan-mug.svg` | Physical cup route entry |
| `campaign-slogan-mug` | 3D model | `/assets/archive/models/campaign-slogan-mug.glb` | Supplied GLB model for no-AR object detail viewer |
| `campaign-slogan-mug` | Projection audio | `/assets/archive/audio/campaign-slogan-mug-projection.mp3` | Optional sound-wall loop |
| `commemorative-protest-mug` | Object photograph | `/assets/archive/images/commemorative-protest-mug.jpg` | No-AR object page and archive cards |
| `commemorative-protest-mug` | AR.js marker pattern | `/assets/archive/markers/commemorative-protest-mug.patt` | Printed marker-card tracker for `/ar/commemorative-protest-mug` |
| `commemorative-protest-mug` | QR code | `/assets/archive/qr/commemorative-protest-mug.svg` | Physical cup route entry |
| `commemorative-protest-mug` | 3D model | `/assets/archive/models/commemorative-protest-mug.glb` | No-AR object detail viewer |
| `commemorative-protest-mug` | Projection audio | `/assets/archive/audio/commemorative-protest-mug-projection.mp3` | Optional sound-wall loop |

## 3D model requirements

Current supplied model assets:

| Mug ID | Model path | Source export | Size |
| --- | --- | --- | --- |
| `sample-mug` | `/assets/archive/models/sample-mug.glb` | Existing project asset | Existing lightweight GLB |
| `campaign-slogan-mug` | `/assets/archive/models/campaign-slogan-mug.glb` | `exports/labour_typography_mug/labour_typography_mug.glb` | 1.1 MB |

- Preferred format: `.glb` first, `.gltf` plus external `.bin` and texture files only when necessary.
- Location: place files under `public/assets/archive/models/` and reference them from `MugRecord.modelPath`, for example `/assets/archive/models/sample-mug.glb`.
- Usage: `/object/:id` renders `modelPath` in the no-AR object media panel. It does not require AR marker files, camera access, or motion permission.
- Budget: target 1-2 MB per model for mobile review, with an upper limit of 3 MB unless there is a documented reason. Keep geometry under roughly 20k triangles and textures at 1024 px square or smaller.
- Materials: bake labels or mug artwork into simple PBR/base-color textures where possible. Avoid runtime procedural materials, animation, or large texture atlases for the MVP.
- Scale: exported model should fit comfortably in a 1 m viewer scene with the mug centered around the origin. The no-AR viewer is tuned for supplied metric mugs about 0.12 m tall, using a close camera orbit rather than modifying model scale.
- Orientation: export GLB/GLTF as Y-up with the mug upright and centered around the origin. Put the front label/artwork facing positive Z.
- Fallback: if `modelPath` is missing from a mug record or the model cannot load, `/object/:id` falls back to the image or placeholder image panel.

## AR marker-card tracking

- Production prototype path: AR.js pattern tracking with a printed marker card.
- Sample marker URL: `/assets/archive/markers/sample-mug.patt`.
- Sample local file: `/Users/beijixinfei/project2/public/assets/archive/markers/sample-mug.patt`.
- Printable sample card: `/assets/archive/markers/sample-mug-marker-card.png`.
- The physical ceramic cup is the object anchor and installation prop. Do not use a plain ceramic cup as the primary MVP AR target.
- The marker card may use hand-drawn or archival styling, but the trackable marker structure must remain square, flat, high contrast, and framed by a black border.
- Future option: a MindAR image-tracking version could target a printed archive label or designed target image. Treat that as a later research path, not the production WebAR path for this prototype.

## Layer-reactive projection audio

The `/projection` route uses these optional canonical archive paths for
layer-reactive ambience:

| Layer | Path | Purpose |
| --- | --- | --- |
| Surface | `/assets/archive/audio/projection-surface.mp3` | Confirmed-record or catalogue-room ambience |
| Middle | `/assets/archive/audio/projection-middle.mp3` | Labelled inference/speculation ambience |
| Core | `/assets/archive/audio/projection-core.mp3` | Redaction, opacity, and visitor-memory ambience |

These files are not required for the MVP to function. Projection mode must remain
usable silently if the files are absent.

## Source Limits

- The sample records do not claim verified maker, date, accession number, dimensions, campaign, protest, donor, owner, or political affiliation.
- Facts in these records are either project-structure facts or explicitly labelled placeholders.
- Inference and speculation are included to test UI ethics, not to substitute for museum research.
