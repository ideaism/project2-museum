# Final Assessment Setup

This document gives assessors enough context to understand and run The Glitching Archive without reading code.

## What to Present

The final assessment should present the project as an installation system:

- A physical ceramic cup or stand-in cup.
- A printed QR code for the phone route.
- A printed AR.js marker card for the live marker demo.
- A phone showing `/ar/sample-mug` or `/object/sample-mug`.
- A laptop or projector showing `/projection`.
- The `/about` page available as the one-page design statement and AI process note.

## Recommended Demo Order

1. Open `/about` and introduce the project concept: political mugs as containers of routine and memory.
2. Open `/object/sample-mug` to show the no-camera route.
3. Move the pour slider from `surface` to `middle` to `core`.
4. Point out visible source labels and the difference between fact, inference, speculation, visitor contribution, and redaction.
5. Add a short local annotation.
6. Open `/projection` and show how local annotations can enter wall mode.
7. Open `/ar/sample-mug` on a phone and scan the printed marker if camera permission, lighting, and marker tracking are available.
8. If AR fails, use the no-AR fallback link and explain that fallback access is part of the design.

## Room Layout

- Put the cup and printed marker on a small plinth or table.
- Keep the marker flat, high contrast, square, and evenly lit.
- Place the QR code near the cup with a short label such as `Open the mug archive`.
- Project `/projection` on a wall behind or beside the cup.
- Keep the phone and projection visible at the same time so the private handheld route and public wall mode can be compared.

## Required Checks Before Assessment

- [ ] `npm run build` passes.
- [ ] `/object/sample-mug` works without camera permission.
- [ ] `/ar/sample-mug` shows camera and marker states.
- [ ] `/projection` loads without camera permission.
- [ ] `/about` explains ethics, AI role, precedents, and prototype limits.
- [ ] At least one marker card and matching `.patt` file are present for the live AR route.
- [ ] Missing assets are named in [asset-checklist.md](asset-checklist.md).
- [ ] Audio either has captions/transcripts or remains disabled/silent.

## Assessment Framing

The prototype demonstrates interaction, source ethics, fallback design, and installation logic. It does not claim that all object metadata is verified. Possible collection matches, object titles, dates, makers, and rights status must be checked against supplied collection records before public use.

## Reset Between Runs

- Clear local annotations from the object page or projection page.
- Refresh `/projection`.
- Check the phone has camera permission available for the local or deployed HTTPS origin.
- Confirm `/assets/archive/markers/sample-mug.patt` still loads.
- Keep an offline no-AR route ready if network or camera access fails.
