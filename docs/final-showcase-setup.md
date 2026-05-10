# Final Showcase Setup

This legacy-named setup document now reflects the current Camera Gesture Pour Experience.

## Equipment

- One laptop running the production build or deployed HTTPS site.
- One phone, tablet, or laptop with a camera for `/gesture/sample-mug`.
- One physical ceramic cup or stand-in cup.
- Projector or large display for `/projection`.
- Speakers or room audio, if sound-wall audio is added.
- Optional QR code linking to `/gesture/sample-mug` or `/object/sample-mug`.
- Optional printed wall label with the source-label key: fact, inference, speculation, visitor contribution, redacted.

## Room Layout

1. Place the cup on a small plinth or table.
2. Position the gesture device so the visitor's hand is visible in the camera preview.
3. Put the optional QR code near the cup, with a short label such as `Open the gesture archive`.
4. Project `/projection` on a nearby wall.
5. Keep the gesture route and projection route open at the same time so reviewers can see the bodily input and the public wall mode.

## Demo Script

1. Start at `/about` and name the three archive layers.
2. Open `/gesture/sample-mug`.
3. Start the gesture camera.
4. Rotate a hand as if pouring from a cup.
5. Show `surface`, `middle`, and `core` changing from the same pour value.
6. Open `/object/sample-mug` to show the no-camera slider fallback.
7. Add a short local annotation and point out that it is stored only in this browser.
8. Open `/projection` and show the annotation appearing in wall mode.

## Reset Between Reviews

- Stop the gesture camera.
- Clear local annotation demo data from the object page or projection page.
- Refresh `/projection`.
- Check that the camera device has permission available for the deployed HTTPS origin.

## Required Real Assets Before Public Presentation

- Verified object photographs.
- Verified object metadata or a clear note that metadata is intentionally withheld.
- Audio files and transcripts if sound is used.
- Any institutional credit, collection credit, or rights statement required by the source collection.
- Optional QR code SVGs that link to gesture or no-camera routes.

## Known Installation Limits

- Current mug records are placeholders or possible matches for assessment and should not be treated as verified object records.
- LocalStorage annotations are per-browser and resettable; they are not a shared visitor archive.
- Projection audio is optional until final sound files and transcripts are supplied.
- Gesture tracking depends on lighting, camera permission, browser support, hand visibility, and HTTPS or localhost.
- Legacy marker assets may remain in the repository but are not required for the current showcase.
