# Accessibility Note

The prototype must remain assessable when camera, AR, motion, audio, or projection conditions fail.

## No-Camera Fallback

`/object/:id` is the primary no-camera path. It presents the mug, source-labelled fragments, pour layers, and annotation form without requiring camera permission or marker tracking.

The AR route should always keep a visible link to `/object/:id`.

## Keyboard and Slider Fallback

The pour interaction must be usable without device motion. Keyboard and pointer users can use:

- the range slider on `/object/:id`
- layer buttons where available
- manual pour controls in AR fallback states

The selected layer should be announced through readable text, not only color or motion.

## Reduced Motion

Glitch, scanline, projection, and pour movement should respect `prefers-reduced-motion: reduce`. Reduced-motion mode should preserve content and source labels while removing unnecessary animation intensity.

## Readable Labels

- Source labels must be visible text: fact, inference, speculation, visitor contribution, redacted.
- Buttons and links need clear accessible names.
- Form fields need visible labels.
- Error and saved states should use status or alert semantics.
- Color must not be the only distinction between layer or source status.

## Audio and Captions

There should be no autoplay audio. If audio is added, visitors should initiate playback or have a clear control state.

Every final audio file needs one of:

- captions
- transcript
- written sound cue list

Projection mode must remain usable silently if audio is missing, muted, blocked, or inappropriate for the assessment room.

## Permission States

The AR route should make these states readable and actionable:

- camera prompt
- permission checking
- permission denied
- unsupported browser or insecure origin
- marker asset missing
- marker asset invalid
- AR.js runtime failure

Each state should explain how to continue without AR.

## Privacy

The MVP does not ask for name, email, phone number, or identity fields. Local annotations stay in the same browser and can be cleared as demo data.
