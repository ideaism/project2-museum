# Legacy Marker Workflow

This document is retained only to explain an obsolete prototype path. The current core interaction is the Camera Gesture Pour Experience at `/gesture/:id`.

AR.js marker tracking, printed marker cards, and `.patt` files are no longer required for final assessment. Do not use this workflow as the setup guide for the current prototype.

## Replacement Workflow

Use these documents instead:

- [gesture-pour-interaction.md](gesture-pour-interaction.md)
- [camera-troubleshooting.md](camera-troubleshooting.md)
- [final-assessment-setup.md](final-assessment-setup.md)

## Legacy Status

Some files and data fields may remain from the earlier AR marker prototype. They should be treated as backwards-compatible remnants, not as blockers.

The current assessment path is:

1. Open `/gesture/sample-mug`.
2. Start the gesture camera.
3. Confirm camera access.
4. Rotate a hand as if pouring.
5. Use `/object/sample-mug` if camera access or gesture tracking fails.

## Why Retired

The project moved away from AR marker tracking because the key conceptual act is not scanning a marker, but performing a bodily gesture of pouring. The camera now senses the gesture; the mug remains the container of political memory.
