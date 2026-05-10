# AR Marker Workflow

The production prototype uses AR.js marker tracking. Do not replace it with image tracking unless the project brief is changed later.

## Current Marker Status

| Mug route ID | Expected `.patt` path | File status |
| --- | --- | --- |
| `sample-mug` | `/assets/archive/markers/sample-mug.patt` | Present |
| `campaign-slogan-mug` | `/assets/archive/markers/campaign-slogan-mug.patt` | Missing |
| `commemorative-protest-mug` | `/assets/archive/markers/commemorative-protest-mug.patt` | Missing |

## Generate a Marker

1. Create or choose a high-contrast square marker image.
2. Use an AR.js marker training tool to generate a matching `.patt` file.
3. Save the `.patt` file under `public/assets/archive/markers/`.
4. Save the printable marker image in the same folder with a clear name.
5. Confirm the corresponding `MugRecord.markerPatternPath` points to the `.patt` file.
6. Print the marker image at least 6 cm wide, with strong contrast and a clear border.
7. Test on `/ar/:id` from `localhost` or HTTPS.

## File Naming

Use the route slug in the filename:

```txt
public/assets/archive/markers/sample-mug.patt
public/assets/archive/markers/sample-mug-marker-card.png
public/assets/archive/markers/campaign-slogan-mug.patt
public/assets/archive/markers/campaign-slogan-mug-marker-card.png
public/assets/archive/markers/commemorative-protest-mug.patt
public/assets/archive/markers/commemorative-protest-mug-marker-card.png
```

## Demo Conditions

- Use HTTPS or `localhost`; camera access is blocked on insecure remote origins.
- Keep the marker flat and evenly lit.
- Avoid glare from ceramic or laminated paper.
- Keep the phone close enough for the marker to fill a meaningful part of the camera frame.
- Expect tracking to fail in low light, strong reflection, blurred print, or unstable handheld conditions.

## Fallback Rule

The AR route must never be the only way into the archive. If camera access, marker validation, or AR.js loading fails, use `/object/:id` as the no-camera route. This fallback is part of the accessibility design, not a failure of the concept.
