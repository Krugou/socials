# Aleksi Nokelainen: socials

Personal link page and portfolio entry point, live at **https://krugou.github.io/socials/**.

It lists social profiles, a featured project (AuroraWatcher) and an accordion of personal project sites with a short description, tech tags and a source link for each. The site is available in English and Finnish.

## Stack

- SvelteKit 2 and Svelte 5 (runes), prerendered to static files with `adapter-static`
- Tailwind CSS 4
- Firebase: anonymous page-view logging to Firestore and Analytics
- Playwright and axe for smoke and accessibility tests
- Prettier and oxlint, enforced by a Husky pre-commit hook

## Getting started

Requires Node.js 22.

```bash
npm ci
npm run dev
```

The dev server runs at http://localhost:3000.

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start the dev server                             |
| `npm run build`        | Build the static site into `build/`              |
| `npm run preview`      | Serve the production build locally               |
| `npm run check`        | Type-check with svelte-check                     |
| `npm run lint`         | Prettier check and oxlint                        |
| `npm run format`       | Format everything with Prettier                  |
| `npm run test:install` | Install the Playwright Chromium browser (once)   |
| `npm test`             | Run the Playwright smoke and accessibility tests |

## Project layout

- `src/lib/links.ts`: all link and project content (titles, URLs, descriptions, tags). Edit this to add or change a link.
- `src/lib/i18n.ts`: every UI string in English and Finnish. `src/lib/stores.ts` holds the selected language.
- `src/components/`: `Nav`, `Hero`, `Links`, `Footer` and the decorative particle layers (loaded lazily).
- `src/routes/`: home page, `/repositories` (GitHub repo list, cached per session) and the error page.
- `src/hooks.server.ts`: adds the canonical URL, `og:url` and Person structured data at build time.
- `static/`: icons (self-hosted under `static/icons/`), Open Graph image, `robots.txt`, `sitemap.xml`, web manifest.
- `tests/`: Playwright tests.
- `admin/`: weekly data export script (see below).
- `firestore.rules`: security rules for the Firestore collections the site writes to.

## Adding a project

1. Add an entry to `projects` in `src/lib/links.ts` with an English and Finnish description and a few tags.
2. Save its icon in `static/icons/` and reference it with the `icon()` helper.
3. Run `npm run lint && npm run check && npm test`.

## Privacy

The site logs one anonymous record per browser session to Firestore: timestamp, page path, referrer origin and a two-letter language code. There is no visitor ID and no device or location data. Firebase Analytics also loads. The weather in the navigation uses a fixed location (Espoo), so no geolocation permission is requested.

Deploy updated rules with `firebase deploy --only firestore:rules` after changing `firestore.rules`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. `pr-check.yml` runs lint, type-check, build and the Playwright tests on pull requests and pushes to `main`.

`weekly-data-export.yml` runs every Monday and publishes the generated visitor report to the `data-reports` branch (not `main`), so it does not trigger a deploy.
