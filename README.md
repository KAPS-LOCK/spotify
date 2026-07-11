# Spotify 2006

A hackathon rebuild of Spotify as if it launched in 2006: Y2K/MySpace/Frutiger Aero design language wrapped around full modern functionality (real search, playback, playlists, AI recs). No simulated technical limits from the era — only the look and feel.

## Where the app lives

The active app is in [react/](react/) (Vite + React + react-router-dom + zustand). Run it via the `spotify-2006-react` config in `.claude/launch.json`, or:

```
cd react
npm install
npm run dev
```

- `react/src/core/` — shared logic (store, iTunes Search API client, curated data, persistence), exposed only via hooks. See [react/src/themes/README.md](react/src/themes/README.md) for the contract theme authors build against.
- `react/src/landing/` — the `/` landing page (three.js disco-ball backdrop + vinyl-record theme picker).
- `react/src/themes/chrome/` — "Chrome & Acid" theme at `/chrome`, the full-featured build (3-column desktop shell, DJ console, dialogs, mobile drawers).
- `react/src/themes/aero/`, `react/src/themes/scrapbook/` — Frutiger Aero and MySpace Scrapbook theme stubs at `/aero` and `/scrapbook`.

## Docs

- [docs/DESIGN-2006.md](docs/DESIGN-2006.md) — 2004–2008 desktop UI research and design audit.
- [docs/BUILD-PLAN.md](docs/BUILD-PLAN.md) — the React conversion plan.

## Assets

- `spotifylogo.png` — source logo art (favicon and reference asset; `react/public/favicon.png` is a copy of it).

## iTunes API

Track data comes from the iTunes Search API (`https://itunes.apple.com/search`), no key required.
