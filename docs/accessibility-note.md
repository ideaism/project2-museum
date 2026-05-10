# Accessibility Note

The prototype must remain assessable when camera, gesture tracking, motion, audio, or projection conditions fail.

## No-Camera Fallback

`/object/:id` is the primary no-camera path. It presents the mug, source-labelled fragments, pour layers, and annotation form without requiring camera permission, gesture tracking, or motion sensors.

The no-camera fallback exists because camera access is uneven across browsers, devices, permissions, room lighting, and visitor comfort. The project concept depends on the pour relation, not on forcing everyone to use a camera.

## Keyboard and Slider Fallback

The pour interaction must be usable without camera or device motion. Keyboard and pointer users can use:

- the range slider on `/object/:id`
- layer buttons where available
- manual pour controls when gesture confidence is low or unavailable

The selected layer should be announced through readable text, not only color, animation, sound, or camera status.

## Camera Gesture Access

Gesture mode uses the browser camera as a local input device. A visitor may decline camera access and still complete the experience through `/object/:id`.

Good gesture conditions:

- hand visible in the camera preview
- stable lighting
- slow rotation
- plain background where possible
- secure context, meaning HTTPS or localhost

The camera preview must not autoplay audio and must not record or upload video.

## Reduced Motion

Glitch, scanline, projection, and pour movement should respect `prefers-reduced-motion: reduce`. Reduced-motion mode should preserve content and source labels while removing unnecessary animation intensity.

## Readable Labels

- Source labels must be visible text: fact, inference, speculation, visitor contribution, redacted.
- Buttons and links need clear accessible names.
- Form fields need visible labels.
- Gesture status should be expressed in text, such as searching, low confidence, or tracking.
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

The camera gesture route should make these states readable and actionable:

- camera prompt
- permission checking
- permission denied
- unsupported browser or insecure origin
- camera already in use
- hand model loading
- searching for hand
- low confidence
- tracking
- gesture unavailable

Each state should explain how to continue without camera.

## Privacy

Camera frames are used locally in the browser to estimate hand rotation. The prototype does not record video, upload video, capture audio, or send camera frames to a backend.

The MVP does not ask for name, email, phone number, or identity fields. Local annotations stay in the same browser and can be cleared as demo data.
