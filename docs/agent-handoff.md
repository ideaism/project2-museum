# Agent Handoff Plan

This handoff reflects the current direction: The Glitching Archive is a Camera Gesture Pour Experience, not an AR marker prototype.

## Current Core Routes

- `/`: project entry.
- `/gesture/:id`: primary camera gesture pour route.
- `/object/:id`: no-camera fallback with manual pour slider.
- `/projection`: wall / sound mode.
- `/about`: design statement and AI process note.
- `/ar/:id`: legacy compatibility path only.

## Integration Priorities

1. Keep `surface`, `middle`, and `core` as the only layer values.
2. Keep source labels visible: `fact`, `inference`, `speculation`, `visitorContribution`, `redacted`.
3. Treat camera gesture data as interaction input only, not historical evidence.
4. Keep `/object/:id` fully usable without camera permission.
5. Keep visitor contributions LocalStorage-only unless a backend is explicitly requested.
6. Keep projection usable silently when audio files are missing.
7. Keep missing metadata visible as missing or partial.

## Asset Priorities

- Verified object images and rights information.
- Lightweight GLB models.
- Optional QR codes linking to `/gesture/:id` or `/object/:id`.
- Optional projection audio plus captions/transcripts.
- Legacy marker files may remain in the repository but are not required for the current prototype.

## Final Checks

- `npm run build`
- `/gesture/sample-mug`
- `/object/sample-mug`
- `/projection`
- `/about`

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
