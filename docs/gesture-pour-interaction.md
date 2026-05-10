# Gesture Pour Interaction

The Camera Gesture Pour Experience is the core interaction for The Glitching Archive. The project moved away from AR marker tracking because the key conceptual act is not scanning a marker, but performing a bodily gesture of pouring. The camera becomes a way to sense the visitor's gesture, while the mug remains a container of political memory.

The gesture input uses the browser camera as a local sensing device. It does not use AR marker tracking, does not require `.patt` marker files, does not store camera images, and does not upload video.

## Runtime

- Camera access is requested with the browser `getUserMedia` flow.
- Audio is not requested.
- Hand landmarks are detected in the browser with `@mediapipe/tasks-vision` and the MediaPipe Hand Landmarker model.
- The current implementation detects one hand first (`numHands: 1`).
- MediaPipe WebAssembly and model files are fetched by the browser, but video frames remain local to the page.

## Route

- Primary route: `/gesture/:id`
- No-camera fallback: `/object/:id`
- Legacy route: `/ar/:id`, kept only as a compatibility redirect/path toward gesture mode.

## Mapping

`src/services/gesturePourMapping.ts` reads landmarks for the wrist, index MCP, middle MCP, and pinky MCP. It estimates palm rotation from the index-to-pinky knuckle axis.

- Neutral hand: `pourValue` near `0`, `layerState: "surface"`.
- Partial rotation: `pourValue` near `0.5`, `layerState: "middle"`.
- Strong pouring rotation: `pourValue` near `1`, `layerState: "core"`.

The hook smooths jitter with an exponential moving average before exposing `pourValue`. Values are clamped to `0..1` and layer thresholds are delegated to the shared pour mapping utility.

## Calibration

The component shows the visitor instruction:

> Hold your hand as if holding the mug. Rotate slowly to pour the archive.

Controls allow reviewers to set the current hand pose as neutral and to set a full-pour pose. If only neutral is set, the prototype assumes a strong pour is roughly a 95 degree wrist rotation from neutral.

## Confidence And Fallback

Confidence combines MediaPipe handedness score, landmark visibility where available, and basic palm geometry size checks.

- `tracking`: confidence is at least `0.45`.
- `lowConfidence`: a hand is present but confidence is below `0.45`.
- `searching`: no hand is detected.
- `failed` or `unavailable`: camera or hand model setup failed.

The gesture component emits an `ExternalPourInput` compatible with `usePourInteraction`. Gesture only drives the shared `pourValue` while status is `tracking`; otherwise the manual slider remains available and active. This keeps gesture optional for accessibility and assessment.

## No-Camera Fallback

The no-camera fallback exists because visitors may decline camera access, use an unsupported browser, have an occupied camera, or be in a room where lighting makes gesture detection unreliable.

`/object/:id` uses the same layer model and source labels with a manual slider. It is a core access path, not a degraded version of the work.

## Privacy

The camera is an input sensor for hand rotation only. The prototype does not record video, upload video, capture audio, or store images. Gesture confidence and `pourValue` are transient interface states.
