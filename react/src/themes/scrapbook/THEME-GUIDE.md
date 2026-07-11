# Scrapbook theme — build guide

Owner: Pratima. Route: `/scrapbook`. Entry: `index.jsx` exports `ThemeApp`
(default).

## What to build

MySpace scrapbook — 2005-2008 profile-page collage energy: tiled
backgrounds, glitter text/gifs, Comic Sans, washi-tape photo corners,
"Top 8" friends-style grids, layered stickers, deliberately imperfect
rotated cards. Reference: the Katy Perry 2006 fan-site mockup and classic
MySpace profile customization culture.

## Hooks available

Everything comes from `src/core/hooks.js` — see `../README.md` (theme
contract) for the full shape of `usePlayer`, `useQueue`, `useLibrary`,
`useSearch`, `useDJ`, `useStatusBar`. Import from `../../core/hooks`.

## What not to touch

- Don't import from `../chrome/*` or `../aero/*` — no cross-theme imports.
- Don't touch `src/core/*` unless adding a genuinely new shared capability
  (discuss first).
- Don't call `localStorage` or the iTunes API directly — go through the
  hooks.

## Where things are

- `index.jsx` — currently a placeholder. Replace the JSX, keep the
  `export default function ThemeApp()` signature.
- `scrapbook.css` — your stylesheet, imported by `index.jsx`. Scope your
  selectors under a root class (e.g. `.theme-scrapbook`).
- Add as many component files in this folder as you want.

## Suggested build order

1. Shell: collage background, taped-photo panels, sticker garnish.
2. Track list / now-playing using `usePlayer()` + `useQueue()` — maybe as
   a "Top 8 tracks" grid.
3. Search using `useSearch()`.
4. DJ_Sp1n integration via `useDJ()` — bonus-points AI feature, don't skip
   it. Reinterpret the buddy console as a scrapbook guestbook or sticky-note
   wall instead of copying Chrome's MSN window look.
