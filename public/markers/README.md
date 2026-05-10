# Marker Setup

This legacy folder is kept only for compatibility with the Agent 04 brief.
The current archive asset manifest uses `public/assets/archive/markers/`.

Place AR.js marker pattern files in `public/assets/archive/markers/` and
reference them from `src/data/mugs.ts` through each mug record's
`markerPatternPath`.

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

For a live demo:

1. Generate a `.patt` marker with the AR.js marker training tool.
2. Save the pattern file in `public/assets/archive/markers/`.
3. Print the matching marker image and attach it to the physical cup label or plinth.
4. Keep the marker flat, high contrast, and at least 6 cm wide for phone scanning.
5. Update the relevant `MugRecord.markerPatternPath` if the filename changes.

If the marker file is missing, `/ar/:id` keeps the archive layer overlay visible and
links visitors to `/object/:id` as the no-camera fallback.
