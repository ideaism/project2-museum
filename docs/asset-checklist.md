# Asset Checklist

This checklist separates present prototype assets from missing final-presentation assets. Do not mark source or rights status as verified unless the evidence has been supplied.

## Current Files on Disk

| Asset type | Present files | Status |
| --- | --- | --- |
| Mug images | `public/assets/archive/images/mug1.png`, `mug2.png`, `mug3.png` | Present for prototype display; rights/source verification still required |
| Marker image | `public/assets/archive/markers/sample-mug-marker.png`, `sample-mug-marker-card.png` | Present for `sample-mug` only |
| `.patt` marker file | `public/assets/archive/markers/sample-mug.patt` | Present for `sample-mug` only |
| GLB model | `public/assets/archive/models/mug1.glb`, `mug2.glb`, `mug3.glb`, `sample-mug.glb`, `campaign-slogan-mug.glb` | Present; confirm exact mapping and scale before final assessment |
| Audio files | none under `public/assets/archive/audio/` | Missing |
| Captions/transcripts | none | Missing until audio exists |
| QR codes | none under `public/assets/archive/qr/` | Missing |
| Projection route | `/projection` | Implemented route, not a file asset |

## Per-Mug Checklist

| Mug route ID | Object photograph | Marker image | `.patt` marker | GLB model | Audio | Captions | QR code | Verified metadata |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sample-mug` | `mug1.png` present | `sample-mug-marker.png` present; `sample-mug-marker-card.png` retained | `sample-mug.patt` present | `mug1.glb` and `sample-mug.glb` present | Missing | Missing | Missing | Partial / possible-match only |
| `campaign-slogan-mug` | `mug2.png` present | Missing | Missing | `mug2.glb` and `campaign-slogan-mug.glb` present | Missing | Missing | Missing | Partial / possible-match only |
| `commemorative-protest-mug` | `mug3.png` present | Missing | Missing | `mug3.glb` present | Missing | Missing | Missing | Partial / possible-match only |

## Required Final Assets

- High-quality object photograph for each mug, with rights status and credit line.
- Printable marker image for each AR-enabled mug.
- Matching AR.js `.patt` marker file for each marker image.
- QR code SVG for each mug route.
- Lightweight GLB model for each mug, checked for mobile performance.
- Projection audio files, if using sound wall:
  - `/assets/archive/audio/projection-surface.mp3`
  - `/assets/archive/audio/projection-middle.mp3`
  - `/assets/archive/audio/projection-core.mp3`
  - or per-object audio paths already listed in `src/data/mugs.ts`.
- Captions, transcripts, or written sound cue list for all audio.
- Verified collection metadata: maker, date, museum number, material, dimensions, rights, credit line, and source citation.

## Rules

- A file being present does not mean its historical metadata is verified.
- A possible V&A object match must remain labelled as possible until confirmed.
- Visitor-contributed text is never an asset source for factual metadata.
- Missing audio must not block the projection route; the route should work silently.
