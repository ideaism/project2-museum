# Final Assessment Setup

This document gives assessors enough context to understand and run The Glitching Archive without reading code.

## What to Present

The final assessment should present the project as a camera gesture installation system:

- A physical ceramic cup or stand-in cup.
- A phone, tablet, or laptop with camera access for `/gesture/sample-mug`.
- A no-camera fallback device or browser tab showing `/object/sample-mug`.
- A laptop or projector showing `/projection`.
- The `/about` page available as the one-page design statement and AI process note.
- Optional QR code linking directly to `/gesture/sample-mug` or `/object/sample-mug`.

No AR marker card or `.patt` file is required for the current core interaction.

## Recommended Demo Order

1. Open `/about` and introduce the project concept: political mugs as containers of routine and memory.
2. Open `/gesture/sample-mug`.
3. Start the gesture camera.
4. Hold a hand as if holding a mug, then rotate the hand as if pouring.
5. Show how the camera gesture changes `pourValue` and moves the archive from `surface` to `middle` to `core`.
6. Open `/object/sample-mug` and show the manual slider fallback.
7. Point out visible source labels and the difference between fact, inference, speculation, visitor contribution, and redaction.
8. Add a short local annotation.
9. Open `/projection` and show how local annotations can enter wall mode.

## Room Layout

- Put the cup on a small plinth or table as the physical memory object.
- Keep the gesture device close enough for the visitor's hand to be clearly visible.
- Avoid backlighting and strong glare.
- Place any optional QR code near the cup with a short label such as `Open the gesture archive`.
- Project `/projection` on a wall behind or beside the cup.
- Keep the gesture route and projection route visible at the same time so the private bodily gesture and public wall mode can be compared.

## Camera Gesture Check

- Use `localhost` or HTTPS.
- Open `/gesture/sample-mug`.
- Press `Start gesture camera`.
- Wait for the hand tracking status to move from loading/searching to tracking.
- Rotate slowly; fast movement can reduce confidence.
- If tracking fails, use [camera-troubleshooting.md](camera-troubleshooting.md), then fall back to `/object/sample-mug`.

## Required Checks Before Assessment

- [ ] `npm run build` passes.
- [ ] `/gesture/sample-mug` loads and shows gesture status.
- [ ] Hand rotation changes `pourValue` when tracking confidence is sufficient.
- [ ] `/object/sample-mug` works without camera permission.
- [ ] Manual slider fallback changes `surface`, `middle`, and `core`.
- [ ] `/projection` loads without camera permission.
- [ ] `/about` explains ethics, AI role, precedents, gesture-pour direction, and prototype limits.
- [ ] Missing assets are named in [asset-checklist.md](asset-checklist.md).
- [ ] Audio either has captions/transcripts or remains disabled/silent.

## Assessment Framing

The prototype moved away from AR marker tracking because the key conceptual act is not scanning a marker, but performing a bodily gesture of pouring. The camera becomes a way to sense the visitor's gesture, while the mug remains a container of political memory.

The prototype demonstrates interaction, source ethics, fallback design, and installation logic. It does not claim that all object metadata is verified. Possible collection matches, object titles, dates, makers, and rights status must be checked against supplied collection records before public use.

## Privacy

Camera processing is local to the browser. The prototype does not record video, upload video, or send camera frames to a project backend. The camera stream is used only to estimate a hand rotation for `pourValue`.

## Reset Between Runs

- Stop the gesture camera when the demo ends.
- Clear local annotations from the object page or projection page.
- Refresh `/projection`.
- Check the phone or laptop still has camera permission available for the local or deployed HTTPS origin.
- Keep `/object/sample-mug` ready if network, permission, lighting, or hand tracking conditions fail.
