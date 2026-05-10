# Deployment Notes

The app is a static Vite build. Deploy the generated `dist/` directory to any static host.

## Required Preflight

```bash
npm install
npm run build
```

Camera access for the AR route requires `localhost` during development or HTTPS in production. Do not demo live camera AR from an insecure remote origin.

## Vercel

Recommended for the final prototype because it gives HTTPS by default.

1. Import the repository into Vercel.
2. Set framework preset to `Vite`.
3. Use build command `npm run build`.
4. Use output directory `dist`.
5. Deploy.
6. Test `/`, `/object/sample-mug`, `/ar/sample-mug`, `/projection`, and `/about` on the deployed HTTPS URL.

If direct route refreshes fail, add a SPA rewrite in `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## GitHub Pages

GitHub Pages can work, but Vite must know the repository subpath unless deploying to a custom domain root.

For a repository site such as `https://USER.github.io/REPO/`, build with:

```bash
npm run build -- --base=/REPO/
```

Then publish `dist/` through the Pages workflow or a deploy action.

For a custom domain or user site root, the default base `/` is suitable:

```bash
npm run build
```

React Router routes need a static-host fallback to `index.html`. If Pages cannot provide fallback rewrites, use hash routing or keep demo links starting from the root page.

## Asset Paths

Public files should be placed under `public/` so Vite copies them into `dist/` unchanged. The current planned asset paths include:

- `/assets/archive/images/*.jpg`
- `/assets/archive/markers/*.patt`
- `/assets/archive/qr/*.svg`
- `/assets/archive/audio/*.mp3`
- `/assets/archive/audio/projection-surface.mp3`, `/assets/archive/audio/projection-middle.mp3`, `/assets/archive/audio/projection-core.mp3` for optional projection layer audio

After deployment, open the marker and audio URLs directly to confirm they return `200`.

## Final Deployment Smoke Test

- [ ] Production site loads on HTTPS.
- [ ] `/object/sample-mug` works after a hard refresh.
- [ ] `/projection` works after a hard refresh.
- [ ] `/ar/sample-mug` shows a camera request state.
- [ ] Camera permission denied state links to the object fallback.
- [ ] Missing marker assets are reported clearly.
- [ ] LocalStorage annotations save and clear on the deployed site.
