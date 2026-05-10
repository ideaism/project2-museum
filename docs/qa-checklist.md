# QA Checklist

Use this checklist during final preparation. Mark an item complete only after checking it in the integrated app.

## Build and Tooling

- [ ] `npm install` completes from a clean checkout.
- [ ] `npm run build` passes.
- [ ] `npm run preview` serves the built app.
- [ ] `npm run test` passes, if a test script has been added.
- [ ] `npm run lint` passes, if a lint script has been added.
- [ ] Browser console has no route-load errors on `/`, `/object/sample-mug`, `/ar/sample-mug`, `/projection`, and `/about`.

## Routes

- [ ] `/` loads and links to the AR and no-AR object paths.
- [ ] `/object/sample-mug` loads without camera permission.
- [ ] `/object/campaign-slogan-mug` loads without camera permission.
- [ ] `/object/commemorative-protest-mug` loads without camera permission.
- [ ] Unknown `/object/:id` routes show a useful not-found state.
- [ ] `/ar/sample-mug` loads and shows camera permission state before AR starts.
- [ ] Unknown `/ar/:id` routes show a useful not-found state.
- [ ] `/projection` loads without camera or motion permission.
- [ ] `/about` explains the project, source limits, redaction principle, and AI process.

## Mobile and Fallbacks

- [ ] The app is usable at 320px width.
- [ ] Header navigation wraps without covering page content.
- [ ] Object page manual pour slider changes between `surface`, `middle`, and `core`.
- [ ] Layer buttons change between `surface`, `middle`, and `core`.
- [ ] AR route offers a no-camera fallback link.
- [ ] Camera denied, unsupported, marker-missing, and AR script failure states remain readable.
- [ ] Tilt interaction changes layers on supported devices.
- [ ] Manual controls remain available when motion sensors are unavailable.

## Annotations

- [ ] Visitor annotation form accepts `question`, `counterReading`, `memory`, and `dispute`.
- [ ] Empty annotation text is rejected.
- [ ] Long annotation text is limited to 280 characters.
- [ ] Saved annotations survive refresh in the same browser.
- [ ] Clear local demo data removes stored annotations.
- [ ] Projection page displays local visitor contributions.
- [ ] UI states clearly say annotations are local-only visitor contributions.
- [ ] No name, email, phone, or other personal data field is collected.

## Source and Ethics

- [ ] Every narrative fragment displays a source label.
- [ ] Facts, inference, speculation, visitor contribution, and redaction are visually distinguishable.
- [ ] Placeholder object metadata is not presented as verified museum data.
- [ ] Redacted or unresolved material remains visible as a valid archive state.
- [ ] Visitor memory is not presented as institutional fact.
- [ ] Right-to-opacity is included in `/about` and relevant documentation.

## Projection and Sound Wall

- [ ] `/projection` can be displayed full-screen on the projector machine.
- [ ] Text remains readable from room distance.
- [ ] Layer controls are keyboard reachable.
- [ ] Projection mode works silently if audio files are missing or muted.
- [ ] Reduced-motion preference reduces decorative motion.
- [ ] Local contributions can be cleared before or after a demo.

## Accessibility

- [ ] Skip link works.
- [ ] All interactive controls are keyboard reachable.
- [ ] Focus indicators are visible.
- [ ] Buttons, links, form fields, and sliders have accessible names.
- [ ] Color is not the only way to distinguish source type or layer.
- [ ] Permission-denied and unsupported states include actionable next steps.
- [ ] Text remains readable at mobile and projector scales.
- [ ] Captions or transcripts are supplied for final audio assets, if audio is used.
