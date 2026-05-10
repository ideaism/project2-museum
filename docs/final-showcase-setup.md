# Final Showcase Setup

This setup describes the minimum room installation for assessment.

## Equipment

- One laptop running the production build or deployed HTTPS site.
- One phone for the mobile walkthrough.
- One physical ceramic cup or stand-in cup.
- Printed AR.js marker for the selected mug.
- Printed QR code linking to `/ar/sample-mug` or `/object/sample-mug`.
- Projector or large display for `/projection`.
- Speakers or room audio, if sound-wall audio is added.
- Optional printed wall label with the source-label key: fact, inference, speculation, visitor contribution, redacted.

## Room Layout

1. Place the cup on a small plinth or table.
2. Put the marker beside or under the cup where the phone camera can see it.
3. Put the QR code near the cup, with a short label such as `Scan to open the mug archive`.
4. Project `/projection` on a nearby wall.
5. Keep the phone route and projection route open at the same time so reviewers can see the private handheld reading and the public wall mode.

## Demo Script

1. Start at `/` and name the three archive layers.
2. Open `/object/sample-mug` first to show the no-AR route.
3. Move the pour slider from `surface` to `middle` to `core`.
4. Add a short local annotation and point out that it is stored only in this browser.
5. Open `/projection` and show the annotation appearing in wall mode.
6. Open `/ar/sample-mug` on the phone.
7. If camera and marker assets are ready, scan the printed marker.
8. If camera or marker tracking fails, use the visible fallback link and explain that no-AR access is part of the design.

## Reset Between Reviews

- Clear local annotation demo data from the object page or projection page.
- Refresh `/projection`.
- Check that the phone has camera permission available for the deployed HTTPS origin.
- Confirm marker and QR paths still resolve after deployment.

## Required Real Assets Before Public Presentation

- Verified object photographs.
- Verified object metadata or a clear note that metadata is intentionally withheld.
- Final AR.js marker pattern files.
- QR code SVGs pointing to the deployed site.
- Audio files and transcripts if sound is used.
- Any institutional credit, collection credit, or rights statement required by the source collection.

## Known Installation Limits

- Current mug records are placeholders for assessment and should not be treated as verified object records.
- LocalStorage annotations are per-browser and resettable; they are not a shared visitor archive.
- Projection audio is optional until final sound files and transcripts are supplied.
- AR marker tracking depends on lighting, camera permission, marker print quality, and HTTPS deployment.
