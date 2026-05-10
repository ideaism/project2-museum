# Camera Gesture Pour Replan

This replan records the current direction: the core camera experience is now the Camera Gesture Pour Experience.

## Core Routes

- `/gesture/:id`
- `/object/:id`
- `/projection`
- `/about`

`/ar/:id` may remain only as a legacy compatibility path.

## Current Principle

The camera is an input device for gesture interaction, not a marker tracker. The no-camera fallback remains mandatory.

The visitor performs a bodily gesture of pouring. Hand rotation drives `pourValue`, which maps to `surface`, `middle`, and `core`.

## Current Documentation

Use these files for setup and assessment:

- [gesture-pour-interaction.md](gesture-pour-interaction.md)
- [camera-troubleshooting.md](camera-troubleshooting.md)
- [final-assessment-setup.md](final-assessment-setup.md)
- [accessibility-note.md](accessibility-note.md)
- [integration-checklist.md](integration-checklist.md)

Legacy marker assets and marker fields may remain in the repository, but they are not required for assessment.
