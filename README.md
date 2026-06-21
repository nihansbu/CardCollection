# RAP Card Collection

Personal Codex Collector prototype built with React and Vite.

## Development

```powershell
npm install
npm run dev
```

The dev server binds to `0.0.0.0`, so the app can also be opened from another device on the same network.

## Build

```powershell
npm run build
```

## Verify

```powershell
npm run dev
npm run verify
```

Run `npm run verify` in a second terminal while the dev server is running. The verification script checks the current mobile Skills flow, including offline skill-training settlement and the rule that only actively trained skills are highlighted.

## Project Memory

The current technical foundation, product direction, data model notes, and update rules live in [`README_OFTEN.md`](README_OFTEN.md).

## Hosting

The app is deployed to GitHub Pages from the `main` branch through `.github/workflows/deploy-pages.yml`.

Live app: [https://nihansbu.github.io/CardCollection/](https://nihansbu.github.io/CardCollection/)
