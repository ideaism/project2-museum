# Final Integration Checklist

Use this checklist during final integration. Do not mark an item complete unless it has been manually verified in the integrated app.

## Repository and Contracts

- [x] `AGENTS.md` has been read after the final merge.
- [x] Routes exist for `/`, `/gesture/:id`, `/object/:id`, `/projection`, and `/about`.
- [x] `/ar/:id` redirects or clearly points to `/gesture/:id` as a legacy compatibility route.
- [x] Shared types include `LayerState`, `ArchiveSourceType`, `AnnotationType`, `MugRecord`, `NarrativeFragment`, and `VisitorAnnotation`.
- [x] No duplicate layer union values exist outside `surface`, `middle`, and `core`.
- [x] No duplicate source-type union values exist outside `fact`, `inference`, `speculation`, `visitorContribution`, and `redacted`.
- [x] Mug records are centralized and reused by gesture, object, projection, and annotation flows.

## Camera Gesture Path

- [x] `/camera-test` is retired from public navigation and redirects safely to `/gesture/sample-mug`.
- [x] `/gesture/:id` loads for a valid mug ID.
- [ ] Unknown mug IDs show a useful not-found state.
- [x] Camera permission prompt or initialization state is visible.
- [ ] Camera denied or unsupported state provides a no-camera fallback link or control.
- [ ] Hand rotation changes `pourValue`.
- [x] `pourValue` changes between `surface`, `middle`, and `core`.
- [x] Low-confidence, searching, failed, and unavailable gesture states remain readable.
- [x] The UI states that camera processing is local and no video is recorded or uploaded.
- [x] No microphone access is requested.
- [x] Manual fallback controls also change between `surface`, `middle`, and `core`.

## No-Camera Object Path

- [x] `/object/:id` loads for a valid mug ID.
- [ ] Unknown mug IDs show a useful not-found state.
- [x] Surface facts are visually distinct from inference, speculation, redaction, and visitor contribution.
- [x] Object metadata does not fabricate missing maker, date, material, dimensions, or collection ID.
- [x] Placeholder media and unverified metadata are clearly documented.

## Projection Path

- [x] `/projection` loads without camera permission.
- [x] Projection mode uses the same mug records as object and gesture views.
- [x] Text is readable at wall-display scale.
- [x] Narrative layer labels remain visible.
- [x] Any motion or audio behavior has a reduced-motion or silent fallback.

## Annotation Path

- [ ] Visitor annotations are stored in LocalStorage only.
- [ ] Annotations include mug ID, layer, type, text, and timestamp.
- [ ] Annotation types are limited to `question`, `counterReading`, `memory`, and `dispute`.
- [ ] The interface communicates that MVP annotations are local to the browser.
- [ ] Empty, invalid, or excessively long annotation input is handled gracefully.
- [ ] Existing annotations survive refresh.

## About and Design Statement

- [x] `/about` explains the project concept.
- [x] The one-page design statement names the mug as a container of routine and political memory.
- [x] The design statement explains the move from marker tracking to camera gesture pouring.
- [x] The AI process note describes how AI was used without overstating authorship or source certainty.
- [x] Right-to-opacity / redaction is included as a design principle.
- [x] Missing assets and source limitations are documented.

## Ethical and Interpretive Checks

- [x] Every narrative fragment has a visible source label.
- [x] Speculation is labelled as speculation.
- [x] Inference is labelled as inference.
- [x] Visitor contribution is labelled as visitor contribution.
- [x] Redacted or unresolved content is not rewritten as fact.
- [x] Gesture tracking data is not treated as historical evidence.
- [x] The UI does not imply archival certainty where only partial evidence exists.

## Accessibility and Mobile Checks

- [ ] App is usable on a narrow mobile viewport.
- [ ] All interactive controls are keyboard reachable.
- [ ] Focus indicators are visible.
- [ ] Buttons and links have accessible names.
- [ ] Color is not the only way to distinguish source type or layer.
- [ ] Permission-denied states are readable and actionable.
- [ ] Reduced-motion preference is respected where motion is used.

## Build and QA

- [x] `npm run build` passes.
- [ ] `npm run test` passes, if available.
- [ ] `npm run lint` passes, if available.
- [x] Browser console has no route-load errors in the core paths.
- [x] Broken links and missing imported modules have been resolved.
- [x] Known limitations are listed in the final PR summary.

## Agent 09 Verification Notes

Verified on 2026-05-10 against the local Vite app at `http://127.0.0.1:5173`.

- `/`, `/gesture/sample-mug`, `/object/sample-mug`, `/projection`, and `/about` loaded without console errors.
- `/ar/sample-mug` redirected to `/gesture/sample-mug`.
- `/gesture/sample-mug` manual fallback slider changed `pourValue` through `0%`, `50%`, and `100%`, mapping to `surface`, `middle`, and `core`.
- Mug image mapping was verified for all three records: `sample-mug` uses `mug3.png`, `campaign-slogan-mug` uses `mug2.png`, and `commemorative-protest-mug` uses `mug1.png`.
- `/object/sample-mug` worked without camera controls and preserved source labels.
- `/projection` core layer showed redaction notes and source labels.

Known limitations from this pass:

- Live hand tracking was not started because browser camera permission requires user action on the assessment device.
- Device orientation was not verified in the desktop in-app browser.
- No automated `lint` or `test` scripts are present in `package.json`.
