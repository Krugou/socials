# Project Instructions for AI Agents

## Project Overview

This repository (`socials`) is a personal portfolio and socials website built with SvelteKit. It showcases links, a hero section with particle animations, and integrates with Firebase for basic analytics.

## Tech Stack

- **Framework**: Svelte 5 (Note: Currently uses Svelte 4 syntax/patterns like stores and `export let`. New code should generally follow existing patterns unless refactoring to Runes is explicitly requested).
- **Build Tool**: Vite.
- **Language**: TypeScript.
- **Styling**: Tailwind CSS (v3). Configured with `typography`, `forms`, `container-queries`, and `aspect-ratio` plugins.
- **Backend/Services**: Firebase (Analytics, Firestore) for visitor tracking.
- **Utilities**: `lodash-es` for utility functions (e.g., throttling).

## Directory Structure

- `src/routes`: SvelteKit routes (File-based routing).
- `src/components`: Reusable UI components.
- `src/lib`: Shared utilities, types, and logic (e.g., `visitorTracking.ts`).
- `static`: Static assets.
- `.github/workflows`: CI/CD pipelines (Deploy to GitHub Pages).

## Key Conventions

- **Styling**: Use Tailwind CSS utility classes. Custom colors are defined in `tailwind.config.ts` (e.g., `background`, `primary`, `secondary`).
- **Icons**: Lucide-svelte (if used) or SVG icons.
- **State Management**: Uses Svelte stores (`svelte/store`) and `svelte/motion` for animations.
- **Environment**: Use `$app/environment` to check for browser environment (`if (browser) ...`).
- **Linting/Formatting**: Prettier and ESLint are configured.

## Development Commands

- `npm run dev`: Start local development server.
- `npm run build`: Build for production (Static adapter).
- `npm run check`: Check Typescript and Svelte types.
- `npm run lint`: Run linting checks.
- `npm run format`: Format code with Prettier.

## Deployment

The project is deployed to GitHub Pages via GitHub Actions.

- **Workflow**: `.github/workflows/deploy.yml`
- **Adapter**: `@sveltejs/adapter-static`
- **Base Path**: Configured in `svelte.config.js` (path: `/socials` for production).

## Notes for Future Changes

- When adding new pages, ensure they are compatible with the static adapter (prerendered).
- Maintain responsiveness using Tailwind's breakpoints.
- Ensure `CONVERSION_SUMMARY.md` or similar temp files are removed if not needed (Cleaned up in Feb 2026).
