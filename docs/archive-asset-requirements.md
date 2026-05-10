# Archive Asset Requirements

These files and evidence sources are required before the prototype can be presented as a verified object archive. Legacy marker assets are not required for the current Camera Gesture Pour Experience.

| Mug ID | Asset / evidence | Placeholder path or route | Purpose |
| --- | --- | --- | --- |
| `sample-mug` | Object image | `/assets/archive/images/mug1.png` | Support the Miners cabinet card and no-camera fallback image |
| `sample-mug` | Camera gesture route | `/gesture/sample-mug` | Primary gesture-pour route |
| `sample-mug` | Optional QR code | `/assets/archive/qr/sample-mug.svg` | Physical label linking to `/gesture/sample-mug` or `/object/sample-mug` |
| `sample-mug` | 3D model | `/assets/archive/models/mug1.glb` | Support the Miners no-camera object detail viewer |
| `sample-mug` | Projection audio | `/assets/archive/audio/sample-mug-projection.mp3` | Optional sound-wall loop |
| `campaign-slogan-mug` | Object image | `/assets/archive/images/mug2.png` | Labour cabinet card and no-camera fallback image |
| `campaign-slogan-mug` | Camera gesture route | `/gesture/campaign-slogan-mug` | Primary gesture-pour route |
| `campaign-slogan-mug` | Optional QR code | `/assets/archive/qr/campaign-slogan-mug.svg` | Physical label linking to `/gesture/campaign-slogan-mug` or `/object/campaign-slogan-mug` |
| `campaign-slogan-mug` | 3D model | `/assets/archive/models/mug2.glb` | Labour no-camera object detail viewer |
| `campaign-slogan-mug` | Projection audio | `/assets/archive/audio/campaign-slogan-mug-projection.mp3` | Optional sound-wall loop |
| `commemorative-protest-mug` | Object image | `/assets/archive/images/mug3.png` | People's March for Jobs cabinet card and no-camera fallback image |
| `commemorative-protest-mug` | Camera gesture route | `/gesture/commemorative-protest-mug` | Primary gesture-pour route |
| `commemorative-protest-mug` | Optional QR code | `/assets/archive/qr/commemorative-protest-mug.svg` | Physical label linking to `/gesture/commemorative-protest-mug` or `/object/commemorative-protest-mug` |
| `commemorative-protest-mug` | 3D model | `/assets/archive/models/mug3.glb` | People's March for Jobs no-camera object detail viewer |
| `commemorative-protest-mug` | Projection audio | `/assets/archive/audio/commemorative-protest-mug-projection.mp3` | Optional sound-wall loop |

## 3D Model Requirements

Current supplied model assets:

| Mug ID | Model path | Source export | Size |
| --- | --- | --- | --- |
| `sample-mug` | `/assets/archive/models/mug1.glb` | `exports/texture_mapped_mugs/support_miners_mug/support_miners_mug_texture.glb` | 1.3 MB |
| `campaign-slogan-mug` | `/assets/archive/models/mug2.glb` | User-managed cabinet asset for Compartment 02 | Supplied GLB |
| `commemorative-protest-mug` | `/assets/archive/models/mug3.glb` | User-managed cabinet asset for Compartment 03 | Supplied GLB |

Current supplied cabinet image assets:

| Mug ID | Image path | Source export |
| --- | --- | --- |
| `sample-mug` | `/assets/archive/images/mug1.png` | `exports/texture_mapped_mugs/previews/support_miners_mug_texture.png` |
| `campaign-slogan-mug` | `/assets/archive/images/mug2.png` | User-managed cabinet image for Compartment 02 |
| `commemorative-protest-mug` | `/assets/archive/images/mug3.png` | User-managed cabinet image for Compartment 03 |

- Preferred format: `.glb` first, `.gltf` plus external `.bin` and texture files only when necessary.
- Location: place files under `public/assets/archive/models/` and reference them from `MugRecord.modelPath`, for example `/assets/archive/models/mug1.glb`.
- Usage: `/object/:id` renders `modelPath` in the no-camera object media panel. It does not require camera access, gesture tracking, or motion permission.
- Budget: target 1-2 MB per model for mobile review, with an upper limit of 3 MB unless there is a documented reason. Keep geometry under roughly 20k triangles and textures at 1024 px square or smaller.
- Materials: bake labels or mug artwork into simple PBR/base-color textures where possible. Avoid runtime procedural materials, animation, or large texture atlases for the MVP.
- Scale: exported model should fit comfortably in a 1 m viewer scene with the mug centered around the origin. The no-camera viewer is tuned for supplied metric mugs about 0.12 m tall, using a close camera orbit rather than modifying model scale.
- Orientation: export GLB/GLTF as Y-up with the mug upright and centered around the origin. Put the front label/artwork facing positive Z.
- Fallback: if `modelPath` is missing from a mug record or the model cannot load, `/object/:id` falls back to the image or placeholder image panel.

## Camera Gesture Requirements

- Primary route: `/gesture/:id`.
- Camera use: local hand rotation sensing only.
- Privacy: no recording, no upload, no microphone capture.
- Fallback: `/object/:id` manual slider if camera permission, lighting, hand tracking, or model loading fails.

## Legacy Marker Assets

Legacy AR marker files may remain under `public/assets/archive/markers/` and marker fields may remain in data records for compatibility. They are obsolete for the current core interaction and are not required for final assessment.

## Layer-Reactive Projection Audio

The `/projection` route uses these optional canonical archive paths for layer-reactive ambience:

| Layer | Path | Purpose |
| --- | --- | --- |
| Surface | `/assets/archive/audio/projection-surface.mp3` | Confirmed-record or catalogue-room ambience |
| Middle | `/assets/archive/audio/projection-middle.mp3` | Labelled inference/speculation ambience |
| Core | `/assets/archive/audio/projection-core.mp3` | Redaction, opacity, and visitor-memory ambience |

These files are not required for the MVP to function. Projection mode must remain usable silently if the files are absent.

## Source Limits

- The sample records do not claim verified maker, date, accession number, dimensions, campaign, protest, donor, owner, or political affiliation.
- Facts in these records are either project-structure facts or explicitly labelled placeholders.
- Inference and speculation are included to test UI ethics, not to substitute for museum research.
