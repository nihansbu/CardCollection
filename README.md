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

## Cloud Save Foundation

The app currently runs local-first. Save data is still cached in the existing `localStorage` keys, but the code now has a central save layer under `src/storage/`.

The Account screen is available through `Character -> Account`. Without Supabase environment values, use the local demo account for testing:

- Username: `Admin`
- Password: `Admin`

This demo account is local-only and does not protect cloud data.

To prepare Supabase:

1. Create a Supabase project.
2. Run `supabase/migrations/20260621235000_initial_cloud_save.sql` in the Supabase SQL editor or via the Supabase CLI.
3. Copy `.env.example` to `.env.local`.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Without these environment values, the app continues to run fully local.

## Project Memory

The current technical foundation, product direction, data model notes, and update rules live in [`README_OFTEN.md`](README_OFTEN.md).

## Hosting

The app is deployed to GitHub Pages from the `main` branch through `.github/workflows/deploy-pages.yml`.

Live app: [https://nihansbu.github.io/CardCollection/](https://nihansbu.github.io/CardCollection/)
