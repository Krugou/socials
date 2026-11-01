# Portfolio Site Improvement Report

Site: https://krugou.github.io/socials/ · Stack: SvelteKit 2, Svelte 5, Tailwind 4, Firebase
First written: 2026-11-01 · Updated after the first round of fixes (same day)

Legend: ✅ done · ⚠️ done, needs a manual step · ⏳ not done yet · 🟡 partly done

## Status at a glance

| Area                                                                             | Status                    |
| -------------------------------------------------------------------------------- | ------------------------- |
| Project descriptions, tags and source links                                      | ✅                        |
| Open Graph image, canonical, sitemap, robots, JSON-LD, favicons, manifest        | ✅                        |
| Privacy: data minimisation, no geolocation, weather email removed                | ✅                        |
| Firestore rules tightened                                                        | ⚠️ rules must be deployed |
| Content Security Policy                                                          | ✅                        |
| EN/FI for every string, dynamic `<html lang>`, alt text, skip link, focus styles | ✅                        |
| Reduced motion, lazy and capped particles, self-hosted icons                     | ✅                        |
| Svelte 5 runes, `links.ts`, library packaging removed, README, tests, workflows  | ✅                        |
| Consent banner or privacy page                                                   | ⏳                        |
| Weekly export script and the published visitor reports                           | ⏳                        |

Verification run for this round: `npm run lint`, `npm run check`, `npm run build` and `npm test` (10 Playwright tests, 2 browsers) all pass, and a production-build page load showed no CSP violations or failed requests.

---

## 1. Content and first impression

| #   | Suggestion                                                                                                                                                                  | Status                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1.1 | One-line description and tech tags for each project, shown in the accordion (EN and FI), plus a Source link to the repo. Descriptions were written from each repo's README. | ✅                                                                                            |
| 1.2 | AuroraWatcher spotlight: larger card with description, tags and Source link.                                                                                                | 🟡 No screenshot or "Live demo" button yet. A preview image is the biggest remaining upgrade. |
| 1.3 | "What I'm looking for / currently working on" line                                                                                                                          | ⏳                                                                                            |
| 1.4 | CV download and a clearer email call to action near the top                                                                                                                 | ⏳                                                                                            |
| 1.5 | Remove the "Portfolio" nav link                                                                                                                                             | ✅                                                                                            |
| 1.6 | GitHub stats or pinned repos on the home page                                                                                                                               | ⏳                                                                                            |

## 2. Link previews and SEO

| Item                                                                                                                   | Status                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `og:image` and `twitter:image` enabled, with a 1200×630 image at `static/og-image.png` (name, title, skills)           | ✅ Replace it with a designed image whenever you like.                                                        |
| Canonical link and `og:url` per page, generated at build time in `src/hooks.server.ts`                                 | ✅                                                                                                            |
| `sitemap.xml` and `robots.txt`                                                                                         | ✅ The sitemap is a static file with two URLs.                                                                |
| JSON-LD `Person` (name, job title, `sameAs` from the links data)                                                       | ✅ Home page only.                                                                                            |
| Favicon set (16, 32, apple-touch 180), web manifest, `theme-color`                                                     | ✅ Icons are generated from the existing 128 px favicon, so they are simple. A proper logo would look better. |
| Removed `keywords`, `revisit-after`, `language`, `generator`, the unused font preconnects and the commented-out blocks | ✅                                                                                                            |
| One description used everywhere ("Portfolio of …")                                                                     | ✅                                                                                                            |
| Page-specific `<title>` and description for Repositories, plus titles on the home and error pages                      | ✅                                                                                                            |

Note: the title, description and Open Graph tags in `app.html` are the same for every page. Only the canonical URL and `og:url` change per page. Link previews of `/repositories` therefore show the home page text.

## 3. Privacy and security

| Item                                                                                                                                                                                                                                                                                                                                                | Status                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Data minimisation.** The page-view record is now timestamp, page path, referrer origin and a two-letter language code. Removed: visitor ID and visit count, user agent, screen size, platform, device memory, CPU cores, connection info, time zone, preferences, performance data. The old `localStorage` ID keys are deleted on the next visit. | ✅                                                                                                                                         |
| **Geolocation removed.** The navigation weather used to ask every visitor for their location and save the coordinates to Firestore (`savedgps`). It now uses a fixed location (Espoo). No permission prompt, no coordinates stored. This was worse than the report originally described.                                                            | ✅                                                                                                                                         |
| Personal email removed from the weather `User-Agent` (now the repo URL)                                                                                                                                                                                                                                                                             | ✅                                                                                                                                         |
| Navigation click logging reduced to path, label and language                                                                                                                                                                                                                                                                                        | ✅                                                                                                                                         |
| **Firestore rules.** `visitorsV2` allows create only, with a fixed field list, types and size limits. `savedgps` is no longer writable.                                                                                                                                                                                                             | ⚠️ Edited in `firestore.rules` but **not deployed**. Run `firebase deploy --only firestore:rules`. Until then the old open rules are live. |
| Content Security Policy via `<meta>`, limited to this site, GitHub API, MET Norway, Firebase and Google Analytics                                                                                                                                                                                                                                   | ✅ Uses `'unsafe-inline'` for scripts and styles because SvelteKit inlines its bootstrap script.                                           |
| **Consent or privacy notice.** Still no banner or privacy page, and Firebase Analytics still sets identifiers. The README now documents what is collected.                                                                                                                                                                                          | ⏳ Needs a decision: add a banner, or remove Analytics (`getAnalytics` in `src/lib/firebase.ts`) and keep only the anonymous record.       |
| **Published visitor data.** `DATA_REPORT.md`, `visitors.json` and `visitors.html` on `main` still contain per-visitor rows from before this change (IDs, platforms, screen sizes, GPS clusters).                                                                                                                                                    | ⏳ See section 8.                                                                                                                          |
| App Check and a Firebase budget alert                                                                                                                                                                                                                                                                                                               | ⏳ Console settings, not code.                                                                                                             |
| Navigation click logging writes to `navigation_events`, which the rules deny, so every click logs a console error and stores nothing.                                                                                                                                                                                                               | ⏳ Either allow it with a rule like `visitorsV2`, or delete `logNavigationEvent` and its call in `Nav.svelte`.                             |

## 4. Accessibility

| Item                                                                                                                                                                                                                | Status                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Every UI string (nav, hero, links, accordion, footer, repositories, error page) is in one file, `src/lib/i18n.ts`, in English and Finnish. The language is remembered and defaults to Finnish for Finnish browsers. | ✅                                                                                                 |
| `<html lang>` follows the selected language                                                                                                                                                                         | ✅                                                                                                 |
| Profile image alt text is "Portrait of Aleksi Nokelainen" (translated)                                                                                                                                              | ✅                                                                                                 |
| Decorative icons use `alt=""`                                                                                                                                                                                       | ✅                                                                                                 |
| "Skip to content" link and a focusable `<main>`                                                                                                                                                                     | ✅                                                                                                 |
| Visible focus outline (yellow) for all links and buttons, including the accordion                                                                                                                                   | ✅                                                                                                 |
| `prefers-reduced-motion`: particles, parallax, mouse spotlight, fly-in and hover motion are switched off, and a global CSS rule shortens remaining animations                                                       | ✅                                                                                                 |
| Axe check (WCAG 2 A/AA) in the test suite. It found and I fixed: invalid list structure in the nav, and button or link names that did not contain their visible text.                                               | ✅ Passes                                                                                          |
| **Light theme was unreadable** (white text on a white page, also in the original code). The design is dark-only, so the theme is now fixed to dark instead of following the system setting.                         | ✅ Decision for you: if you want a real light theme, it needs its own colours.                     |
| Contrast of the purple-to-blue subtitle                                                                                                                                                                             | 🟡 Axe reports no violation, but it cannot measure gradient text reliably. Worth one manual check. |

## 5. Performance

| Item                                                                                                                                                                    | Status                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Particle layers load after first paint (idle callback)                                                                                                                  | ✅                                                                                  |
| Particle count capped at 10 on low-power devices (4 cores or fewer, or 4 GB or less memory), none with reduced motion. This reads the device locally and sends nothing. | ✅                                                                                  |
| Animations pause when the tab is hidden                                                                                                                                 | ✅                                                                                  |
| Unnecessary 3-D container removed from the links list                                                                                                                   | ✅                                                                                  |
| Project and social icons self-hosted in `static/icons/` with width and height set                                                                                       | ✅ Copied from the live sites. If a project changes its icon, update the file here. |
| `lodash-es` removed (the mouse spotlight now throttles with `requestAnimationFrame`)                                                                                    | ✅                                                                                  |
| Repositories page: results cached for 10 minutes per session, forks hidden, up to 100 repos                                                                             | ✅ Still fetched in the browser, not at build time.                                 |
| Profile photo still loads from `avatars.githubusercontent.com`                                                                                                          | ⏳ Could be self-hosted.                                                            |
| Firebase and Analytics still load on every visit                                                                                                                        | ⏳ Larger than everything else combined. Removing Analytics would help most.        |

## 6. Code quality and maintenance

| Item                                                                                                                                | Status                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Migrated to Svelte 5 runes (`$props`, `$state`, `$derived`, `onclick`, snippets, `Spring`). Stores are kept for language and theme. | ✅                                                                    |
| Link data moved to `src/lib/links.ts` (descriptions, tags, repo, `sameAs`)                                                          | ✅ Drives the UI and the JSON-LD. The sitemap is still a static file. |
| Library packaging removed (`files`, `exports`, `svelte-package`, `publint`) and `build` is now just `vite build`                    | ✅                                                                    |
| README rewritten for this site (layout, commands, adding a project, privacy, deploy)                                                | ✅                                                                    |
| Playwright smoke tests (home, accordion, language toggle, skip link) and an axe accessibility test, run in CI                       | ✅ Run `npm run test:install` once locally.                           |
| `npm run dev` no longer runs `npm i`                                                                                                | ✅                                                                    |
| Husky hook: the deprecated lines were already gone from the file                                                                    | ✅                                                                    |
| Weekly export now pushes to a `data-reports` branch instead of `main`, so it no longer triggers a deploy                            | ⚠️ Untested until the next scheduled or manual run.                   |
| Node 20 action warnings: `configure-pages` v6, `upload-pages-artifact` v5, `deploy-pages` v5                                        | ✅ Checked by the deploy run.                                         |

## 7. Smaller things noticed

- Several class names used in the components (for example `bg-card-80`, `bg-white-10`, `text-white-60`) are not defined anywhere, so they do nothing. They are left as they were. Defining them, or deleting them, would clean up the styling.
- `adapter-auto` is installed but unused.
- `.agent/workflows/setup-playwright.md` still describes a five-browser setup on port 5173. The real config uses two projects on port 4173.

## 8. What is left, in order

1. **Deploy the Firestore rules** (`firebase deploy --only firestore:rules`). Until then the privacy fix is only half in effect.
2. **Decide on Analytics and consent.** Remove Analytics, or add a consent banner and privacy page.
3. **Fix the weekly export.** `admin/export-data.ts` still expects the old fields (visitor ID, platform, screen) and reads the GPS collection. With the new records its tables will be mostly empty. Rewrite it for the new fields and decide what to do with the old per-visitor files on `main`. They remain in git history either way.
4. Navigation click logging: allow it in the rules or remove it.
5. AuroraWatcher screenshot, "Live demo" button, CV link and a short "currently looking for" line.
6. Self-host the profile photo.

## Appendix: what was already good

- Clean component split with typed props.
- Static build deployed through GitHub Pages with lint, type-check and format gates in a pre-commit hook and in CI.
- External links use `rel="noopener noreferrer"`.
- Dark theme, EN/FI toggle and a build date in the footer.
