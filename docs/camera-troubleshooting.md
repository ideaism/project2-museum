# Camera Troubleshooting

The Camera Gesture Pour Experience uses the browser camera as a local gesture input. It does not use AR marker tracking, does not need `.patt` files, does not record video, and does not upload video.

Use `/gesture/:id` directly for camera testing. The public diagnostic route has been retired so the final prototype presents the gesture experience as the camera entry point.

## Requirements

- Camera access requires HTTPS or localhost.
- `http://localhost:5173` and `http://127.0.0.1:5173` should be treated as secure development contexts by modern browsers.
- A deployed HTTPS URL should work if the browser permission prompt is granted.
- Opening the project from a LAN IP such as `http://192.168.x.x:5173` may fail on phones because that is usually not a secure context.

## Basic Test

1. Open `/gesture/sample-mug`.
2. Press `Start gesture camera`.
3. Confirm the camera background appears behind the mug.
4. Hold one hand clearly in view and rotate slowly as if pouring from a cup.

## Gesture Tracking Tips

- Keep the hand fully visible.
- Avoid fast rotation until tracking stabilizes.
- Avoid strong backlight, glare, and dark rooms.
- Use a plain background where possible.
- If confidence stays low, try recalibrating neutral and full-pour poses.
- If the gesture camera cannot start, use `/object/sample-mug` and the manual slider fallback.

## Permission Problems

- If camera permission was denied earlier, reset site camera permissions in the browser settings and reload `/gesture/sample-mug`.
- Safari and iOS Safari usually need camera access to start from a direct user button press. Use the page's `Start gesture camera` button rather than expecting automatic startup.
- If the page is running inside an iframe or preview environment, camera may be blocked unless the iframe includes `allow="camera"`.

## Device Problems

- Close Zoom, Teams, FaceTime, browser tabs, or other apps that may already be using the camera.
- If the back camera fails, test the basic camera first and avoid strict constraints such as `facingMode: { exact: "environment" }`.
- If no camera is found, check operating system camera privacy settings and confirm another website can access the camera.

## Error Names

- `NotAllowedError`: permission was denied or blocked. Reset site permissions and allow camera access.
- `NotFoundError`: no camera device was found.
- `NotReadableError`: the camera exists but another app or browser process may be occupying it.
- `OverconstrainedError`: requested constraints cannot be satisfied. Test `{ video: true, audio: false }` first.
- `SecurityError`: browser security policy blocked camera access. Use HTTPS, localhost, or iframe camera permission.
- `TypeError`: the request is invalid or camera APIs are unavailable in the current context.

## Privacy Notes

- Camera frames are processed locally in the browser for hand rotation.
- The prototype does not upload camera frames.
- The prototype does not record video.
- The prototype does not capture microphone audio.
- Visitor annotations are LocalStorage-only and are separate from camera input.
