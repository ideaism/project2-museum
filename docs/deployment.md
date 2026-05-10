# Deployment Notes

The app is a static Vite build. Deploy the generated `dist/` directory to any static host.

## Required Preflight

```bash
npm install
npm run build
```

Camera access for gesture mode requires `localhost` during development or HTTPS in production. Do not demo `/gesture/:id` from an insecure remote origin.

## Vercel

Recommended for the final prototype because it gives HTTPS by default.

1. Import the repository into Vercel.
2. Set framework preset to `Vite`.
3. Use build command `npm run build`.
4. Use output directory `dist`.
5. Deploy.
6. Test `/`, `/gesture/sample-mug`, `/object/sample-mug`, `/projection`, and `/about` on the deployed HTTPS URL.

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

- `/assets/archive/images/*.png`
- `/assets/archive/models/*.glb`
- `/assets/archive/audio/*.mp3`
- optional `/assets/archive/qr/*.svg` files that link to gesture or object routes

Legacy marker files may remain under `/assets/archive/markers/`, but they are not required for the current Camera Gesture Pour Experience.

## Final Deployment Smoke Test

- [ ] Production site loads on HTTPS.
- [ ] `/gesture/sample-mug` loads after a hard refresh.
- [ ] Gesture camera can start on the target assessment device.
- [ ] Hand rotation changes the pour layer when tracking confidence is sufficient.
- [ ] `/object/sample-mug` works after a hard refresh and without camera permission.
- [ ] `/projection` works after a hard refresh.
- [ ] LocalStorage annotations save and clear on the deployed site.
