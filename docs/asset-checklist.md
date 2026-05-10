# Asset Checklist

This checklist separates present prototype assets from missing final-presentation assets. Do not mark source or rights status as verified unless the evidence has been supplied.

## Current Files on Disk

| Asset type | Present files | Status |
| --- | --- | --- |
| Mug images | `public/assets/archive/images/mug1.png`, `mug2.png`, `mug3.png` | Present for prototype display; rights/source verification still required |
| GLB model | `public/assets/archive/models/mug1.glb`, `mug2.glb`, `mug3.glb`, `sample-mug.glb`, `campaign-slogan-mug.glb` | Present; confirm exact mapping and scale before final assessment |
| Legacy marker files | files under `public/assets/archive/markers/` | Obsolete for the current core interaction |
| Audio files | none under `public/assets/archive/audio/` | Missing |
| Captions/transcripts | none | Missing until audio exists |
| QR codes | none under `public/assets/archive/qr/` | Optional; useful for linking to `/gesture/:id` or `/object/:id` |
| Camera gesture route | `/gesture/:id` | Implemented route |
| Projection route | `/projection` | Implemented route, not a file asset |

## Per-Mug Checklist

| Mug route ID | Object photograph | GLB model | Camera gesture route | Audio | Captions | Optional QR code | Verified metadata |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sample-mug` | `mug1.png` present | `mug1.glb` and `sample-mug.glb` present | `/gesture/sample-mug` | Missing | Missing | Missing | Partial / possible-match only |
| `campaign-slogan-mug` | `mug2.png` present | `mug2.glb` and `campaign-slogan-mug.glb` present | `/gesture/campaign-slogan-mug` | Missing | Missing | Missing | Partial / possible-match only |
| `commemorative-protest-mug` | `mug3.png` present | `mug3.glb` present | `/gesture/commemorative-protest-mug` | Missing | Missing | Missing | Partial / possible-match only |

## Required Final Assets

- High-quality object photograph for each mug, with rights status and credit line.
- Lightweight GLB model for each mug, checked for mobile performance.
- Projection audio files, if using sound wall:
  - `/assets/archive/audio/projection-surface.mp3`
  - `/assets/archive/audio/projection-middle.mp3`
  - `/assets/archive/audio/projection-core.mp3`
  - or per-object audio paths already listed in `src/data/mugs.ts`.
- Captions, transcripts, or written sound cue list for all audio.
- Verified collection metadata: maker, date, museum number, material, dimensions, rights, credit line, and source citation.
- Optional QR code SVGs that point to gesture or no-camera routes.

## Obsolete Assets

AR marker card images and `.patt` files are no longer required for the core prototype. They may remain in the repository as legacy assets, but final assessment should not depend on them.

## Rules

- A file being present does not mean its historical metadata is verified.
- A possible V&A object match must remain labelled as possible until confirmed.
- Visitor-contributed text is never an asset source for factual metadata.
- Camera gesture data is never an asset source for factual metadata.
- Missing audio must not block the projection route; the route should work silently.
