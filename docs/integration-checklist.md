# Final Integration Checklist

Use this checklist during Agent 09 final integration. Do not mark an item complete unless it has been manually verified in the integrated app.

Agent 09 final QA pass completed on 2026-05-10 after Agents 00, 03, 06, and 07 revisions.

## Repository and Contracts

- [x] `AGENTS.md` has been read after the final merge.
- [x] Routes exist for `/`, `/ar/:id`, `/object/:id`, `/projection`, and `/about`.
- [x] Shared types include `LayerState`, `ArchiveSourceType`, `AnnotationType`, `MugRecord`, `NarrativeFragment`, `ArchiveFragment`, and `VisitorAnnotation`.
- [x] No duplicate layer union values exist outside `surface`, `middle`, and `core`.
- [x] No duplicate source-type union values exist outside `fact`, `inference`, `speculation`, `visitorContribution`, and `redacted`.
- [x] Mug records are centralized and reused by AR, object, projection, and annotation flows.

## AR Path

- [x] `/ar/:id` loads for a valid mug ID.
- [x] AR.js marker path is read from the mug record or a centralized asset map.
- [x] Camera permission prompt or camera initialization state is visible.
- [x] The AR route provides a no-camera fallback link to `/object/:id`.
- [ ] Camera permission denied state was not re-triggered during this QA pass.
- [ ] Live AR unsupported/error state was not re-triggered during this QA pass.
- [ ] Physical device tilt was not re-tested during this QA pass.
- [x] Non-sensor fallback controls also change between `surface`, `middle`, and `core`.

## No-AR Object Path

- [x] `/object/:id` loads for a valid mug ID.
- [x] Unknown mug IDs show a useful not-found state.
- [x] Surface facts are visually distinct from inference, speculation, redaction, and visitor contribution.
- [x] Object metadata does not fabricate missing maker, date, material, dimensions, or collection ID.
- [x] Placeholder media is clearly documented when real assets are missing.

## Projection Path

- [x] `/projection` loads without camera permission.
- [x] Projection mode uses the same mug records as object and AR views.
- [x] Projection route renders the wall-mode layout and layer controls.
- [x] Narrative layer labels remain visible.
- [x] Any motion or audio behavior has a reduced-motion or silent fallback.
- [x] Projection mode displays visitor contributions from LocalStorage as shadow archive fragments.

## Annotation Path

- [x] Visitor annotations are stored in LocalStorage only.
- [x] Annotations include mug ID, layer, type, text, and timestamp.
- [x] Annotation types are limited to `question`, `counterReading`, `memory`, and `dispute`.
- [x] The interface communicates that MVP annotations are local to the browser.
- [x] Empty, invalid, or excessively long annotation input is handled gracefully.
- [x] Existing annotations survive route changes and refresh through LocalStorage.

## About and Design Statement

- [x] `/about` explains the project concept.
- [x] The one-page design statement names the mug as a container of routine and political memory.
- [x] The AI process note describes how AI was used without overstating authorship or source certainty.
- [x] Right-to-opacity / redaction is included as a design principle.
- [x] Missing assets and source limitations are documented.

## Ethical and Interpretive Checks

- [x] Every narrative fragment has a visible source label.
- [x] Speculation is labelled as speculation.
- [x] Inference is labelled as inference.
- [x] Visitor contribution is labelled as visitor contribution.
- [x] Redacted or unresolved content is not rewritten as fact.
- [x] The UI does not imply archival certainty where only partial evidence exists.

## Accessibility and Mobile Checks

- [x] App is usable on a narrow mobile viewport.
- [x] All interactive controls are keyboard reachable.
- [x] Focus indicators are visible.
- [x] Buttons and links have accessible names.
- [x] Color is not the only way to distinguish source type or layer.
- [x] Camera prompt and no-AR fallback states are readable and actionable.
- [ ] Browser camera-denied state was not re-triggered during this QA pass.
- [x] Reduced-motion preference is respected where motion is used.

## Build and QA

- [x] `npm run build` passes.
- [x] `npm run test` checked with `--if-present`; no test script is currently defined.
- [x] `npm run lint` checked with `--if-present`; no lint script is currently defined.
- [x] Browser console has no route-load errors in the core paths.
- [x] Broken links and missing imported modules have been resolved.
- [x] Known limitations are listed in the final PR summary.

## Final Handoff

```md
Summary:
- Performed Agent 09 final QA after Agents 00, 03, 06, and 07 revisions.
- Verified route loading for `/`, `/object/sample-mug`, `/ar/sample-mug`, `/projection`, `/about`, and `/object/unknown-mug`.
- Verified manual pour layer switching, visible source labels, annotation save/clear, projection visitor fragments, AR no-AR fallback, mobile route loading, and production build.

Files changed:
- `docs/integration-checklist.md`

Design / implementation decisions:
- No runtime code changes were made in this QA pass.
- The checklist now distinguishes verified fallback/manual behavior from live camera-denied, live AR error, and physical-device tilt states that were not re-triggered.

Checks run:
- [x] `npm run build`
- [x] `npm run test --if-present` (no script defined)
- [x] `npm run lint --if-present` (no script defined)
- [x] Browser route smoke check for `/`, `/object/sample-mug`, `/ar/sample-mug`, `/projection`, `/about`, and `/object/unknown-mug`
- [x] Browser interaction check for object-page manual layer switching across `surface`, `middle`, and `core`
- [x] Browser source-label check for `Fact`, `Inference`, `Speculation`, `Redacted`, and `Visitor contribution`
- [x] Browser annotation check for LocalStorage save, projection display, and clear local demo data
- [x] Browser AR check for camera prompt, marker path display, no-AR fallback link, and manual pour fallback to `core`
- [x] Browser mobile-width route smoke check for `/`, `/object/sample-mug`, `/ar/sample-mug`, `/projection`, and `/about`
- [x] Browser console error check returned no errors

Known limitations / next agent handoff:
- Real object photographs, AR.js `.patt` marker files, QR codes, and audio assets still need to be supplied.
- AR live tracking depends on camera permission, HTTPS or localhost, third-party A-Frame/AR.js script availability, and real marker assets; live camera-denied, unsupported/error, and physical-device tilt states were not re-triggered in this QA pass.
- Object metadata remains placeholder-only until verified collection records are provided.
- LocalStorage annotations are MVP demo data and are not shared across devices.
- This repository currently has no automated `test` or `lint` npm scripts.
```
