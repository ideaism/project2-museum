# Camera Gesture Pour Agent Notes

The current project direction is Camera Gesture Pour. The camera is a local input device for estimating a visitor's hand rotation and mapping that rotation to `pourValue`.

## Responsibilities

- Keep `/gesture/:id` focused on camera-based hand rotation.
- Keep `/object/:id` as the no-camera fallback.
- Keep camera privacy language visible: no recording, no upload, no microphone capture.
- Do not reintroduce marker tracking as the core interaction.

## Checks

- `npm run build`
- `/gesture/sample-mug`
- `/object/sample-mug`
- `/projection`
