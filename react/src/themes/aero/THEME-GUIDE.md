# Aero theme — build guide

Owner: Parth. Route: `/aero`. Entry: `index.jsx` exports `ThemeApp` (default).

## What to build

Frutiger Aero — the mid/late-2000s Vista/iTunes/MobileMe look: glossy
blue-green gradients, glass reflections, water droplets, lens flares,
rounded bevels, "nature meets tech" photography. Reference points: Windows
Vista Aero glass, iTunes 7/8, MSN/Windows Live UI circa 2007-2009.

## Hooks available

Everything comes from `src/core/hooks.js` — see `../README.md` (theme
contract) for the full shape of `usePlayer`, `useQueue`, `useLibrary`,
`useSearch`, `useDJ`, `useStatusBar`. Import from `../../core/hooks`.

## What not to touch

- Don't import from `../chrome/*` or `../scrapbook/*` — no cross-theme
  imports, ever.
- Don't touch `src/core/*` unless you're adding a genuinely new shared
  capability (discuss first — most things belong in your own component).
- Don't call `localStorage` or the iTunes API directly — go through the
  hooks so Midnight/Silver-style persistence and caching stay centralized.

## Where things are

- `index.jsx` — currently a placeholder. Replace the JSX, keep the
  `export default function ThemeApp()` signature.
- `aero.css` — your stylesheet, imported by `index.jsx`. Scope your
  selectors under a root class (e.g. `.theme-aero`) so nothing leaks into
  the other themes if they're ever mounted in the same session.
- Add as many component files in this folder as you want.

## Suggested build order

1. Shell: gradient background, glass panel chrome, transport bar.
2. Track list / now-playing using `usePlayer()` + `useQueue()`.
3. Search using `useSearch()`.
4. DJ_Sp1n integration via `useDJ()` — this is the bonus-points AI feature,
   don't skip it. It doesn't need to look like the Chrome theme's MSN
   buddy window — reinterpret it in Aero's own visual language (a glass
   "assistant" panel, a water-drop avatar, whatever fits).
