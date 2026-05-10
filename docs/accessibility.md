# Accessibility Notes

The prototype is designed to remain usable when camera, gesture tracking, motion, sound, or projection conditions fail.

## No-Camera Path

`/object/:id` is the primary accessible fallback. It presents the same mug record without requiring camera access, gesture tracking, MediaPipe model loading, or motion sensors.

The manual pour slider and layer buttons expose the same `surface`, `middle`, and `core` layer changes that the camera gesture represents in `/gesture/:id`.

## Camera and Permission Fallbacks

The gesture route should communicate each state plainly:

- camera prompt
- permission checking
- permission denied
- unsupported browser or insecure origin
- camera already in use
- hand model loading
- searching for hand
- low-confidence tracking
- gesture unavailable

Each failure state should keep a visible path to the no-camera object route.

## Camera Privacy

Camera processing is local to the browser. The prototype does not record video, upload video, capture audio, or send camera frames to a backend. Camera frames are used only to estimate hand rotation for `pourValue`.

## Motion and Reduced Motion

Gesture is an enhancement, not the only route through the archive. Manual layer controls must remain available.

Decorative glitch, scanline, and projection movement should respect `prefers-reduced-motion: reduce`. In reduced-motion mode, content should remain visible and layer changes should happen without unnecessary animation.

## Keyboard and Screen Reader Use

- The skip link should move focus to the main content.
- Navigation links should expose the active route.
- Sliders need clear labels and useful `aria-valuetext`.
- Layer buttons should use pressed states where they behave like toggles.
- Form fields should use visible labels.
- Error and saved states should use alert or status semantics.
- Source labels should be text, not color-only indicators.
- Gesture status should be visible as text, not only preview movement.

## Audio, Captions, and Projection

Projection audio is optional in the current MVP. If final audio files are added, provide captions, transcripts, or a written sound cue list for assessment and for visitors who cannot hear the sound wall.

Projection mode should work silently when audio is unavailable, muted, or blocked by the browser. There should be no autoplay audio.

## Readability

Mobile screens and projection walls have opposite scale problems. Final QA should check:

- 320px mobile width.
- A normal phone viewport.
- A laptop viewport.
- The projector resolution used in the room.

Text should not rely on color alone. Layer names and source labels must remain readable in each layout.

## Privacy

MVP visitor annotations stay in LocalStorage. The form does not ask for name, email, phone, or identity fields. Before any public deployment with shared persistence, the project would need moderation, consent language, retention rules, and a deletion process.
