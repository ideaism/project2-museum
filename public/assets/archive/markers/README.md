# AR.js Marker Assets

Store live `.patt` files and printable marker-card images for the AR marker route
in this folder.

Current `src/data/mugs.ts` marker paths:

```txt
/assets/archive/markers/sample-mug.patt
/assets/archive/markers/campaign-slogan-mug.patt
/assets/archive/markers/commemorative-protest-mug.patt
```

Place the files on disk at:

```txt
public/assets/archive/markers/sample-mug.patt
public/assets/archive/markers/campaign-slogan-mug.patt
public/assets/archive/markers/commemorative-protest-mug.patt
```

The sample marker files are:

```txt
sample-mug.patt
sample-mug-marker-card.png
```

For a live demo:

1. Generate or supply a high-contrast AR.js marker card and matching `.patt` file.
2. Save the `.patt` file here with the exact filename used by `markerPatternPath`.
3. Print the matching marker-card image for the physical cup label, plinth, or QR sheet.
4. Keep the marker square, flat, evenly lit, high contrast, black-bordered, and at
   least 6 cm wide for phone scanning.
5. Check `/ar/:id` after adding the file; missing marker files trigger a no-AR fallback.

Do not replace missing collection evidence with invented object metadata. The marker
only links the physical cup to the labelled archive layers.

Do not use a plain ceramic mug as the primary MVP tracking target. The cup is the
object anchor; the printed AR.js marker card is the reliable archive access target.
MindAR image tracking can be explored later for printed archive labels or target
images, but AR.js marker tracking remains the production prototype route.
