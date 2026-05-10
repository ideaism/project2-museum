# Legacy Audio Placeholder Folder

The runtime now uses the canonical archive asset directory:

- `/assets/archive/audio/projection-surface.mp3`
- `/assets/archive/audio/projection-middle.mp3`
- `/assets/archive/audio/projection-core.mp3`

This `/audio` folder is kept only as an intentional legacy note from the Agent 06
prototype. Keep final sound-wall files under `public/assets/archive/audio/` so
all archive assets share one manifest path. Sound remains optional; the
projection route must work when files are missing, muted, or blocked by the
browser. Do not use copyrighted audio in the final presentation unless rights
are cleared.
