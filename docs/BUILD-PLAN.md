# BUILD PLAN — Spotify 2006 React App

## Locked decisions

- Palette stays as-is (chrome grays, `#161816` panels, off-white text) **except** the acid green, which gets swapped — the current `#9BF00B` sits at the lime/yellow boundary every AI "Y2K" generator defaults to.
- Chrome & Acid theme ships with **light + dark mode**, framed as two eras-authentic "skins" (à la Winamp/WMP), not a generic toggle.
- Landing page: full Y2K maximalism, but **no fake visitor counter** and **no "best viewed in 1024×768" badge**.
- Routes: `/chrome` (mine), `/aero` (Parth), `/scrapbook` (Pratima). `/` is the landing page and is never skipped or auto-redirected.
- Stack: Vite + React (JS, not TS), react-router, Zustand, shared core / theme-skin architecture.

## 0. The green swap (do first, in the vanilla prototype)

`--acid: #9BF00B` reads AI-slop because it sits at the lime/yellow boundary. Swap to:

| Option | Value | Story |
|---|---|---|
| **Spotify CRT green (recommended)** | `#17D95C` | Pulled toward phosphor from Spotify's actual brand green — "we found their 2006 green," unambiguously green not lime |
| Winamp LCD green | `#00E800` | Classic Winamp playlist text; harsher, more terminal |

Re-derive `--acid-glow` from whichever wins. Since `--acid` is already a CSS variable everywhere in `style.css`, this is a two-line change, done before the port so the palette is frozen going in.

## 1. Phase A — Scaffold & core extraction

- `npm create vite@latest` in `react/` subfolder, add react-router-dom + zustand.
- Folder skeleton:
  ```
  react/src/
    core/        # api.js (iTunes JSONP), player.js, store.js, dj.js, persist.js, fmt.js
    landing/
    themes/
      chrome/
      aero/        # Parth
      scrapbook/   # Pratima
      README.md    # the theme contract
    App.jsx        # router only
  ```
- Extract `app.js` logic into `core/` behind hooks: `usePlayer`, `useLibrary`, `useSearch`, `useDJ`, `useQueue`. Keep existing localStorage keys (`sp06_likes`, `sp06_cache`, …) so no user data is lost in the port.
- Single `<audio>` element mounted in `App.jsx` above the router so playback survives theme-internal navigation.
- **Exit criteria:** a bare unstyled test page can search, play a preview, like a track, and see DJ_Sp1n log it.

## 2. Phase B — Chrome & Acid theme port

Component breakdown (each maps to an existing chunk of `index.html`/`app.js`):

- **Shell:** `TitleBar`, `MenuBar` (File/Edit/View/Controls/Tools/Help, existing command wiring), `Toolbar` (home + search), `StatusBar` (live segmented cells), `PlayerBar` (LCD, transport, sliders, viz).
- **Panes:** `ExplorerTree`, `ContentView` (view switcher), `DJConsole` (buddy window, quick mixes, chat), splitters as a `useSplitter` hook.
- **Views:** Home, Search (chips + top result), Album, Artist, Liked, Library Songs, Playlists, Playlist detail, Mix CDs, Mix detail, Radio, Downloads, Queue.
- **Shared bits:** `TrackTable` (sortable/striped/selectable/dblclick — one component instead of 9 inline call sites), dialogs (Burn, About), mobile drawers + scrim + vinyl toggle.
- Port `style.css` scoped to the theme.
- **Exit criteria:** feature-parity checklist ticked item-by-item against the vanilla prototype, desktop and mobile widths.

## 3. Phase C — Light/dark mode for Chrome & Acid

- **Midnight Chrome** (current dark) and **Daylight Silver** (light): XP Luna / WMP10 silver lineage — `#ECE9D8`-family panels, darker chrome gradients for contrast, same acid-green accent (verify contrast on light; darken slightly if it washes out), sunken white content wells like Explorer list views.
- Mechanics: all colors already live in CSS variables, so light mode is a `[data-skin="silver"]` override block on the theme root — no component changes needed. Toggle lives in **View → Skin ▸ Midnight Chrome / Daylight Silver**, persisted to `localStorage` (`sp06_skin`).
- **Exit criteria:** every view legible in both skins; skin persists across reloads; no hardcoded hex left in chrome-theme component styles.

## 4. Phase D — Landing page

- Full Y2K per spec: chrome/metallic wordmark, chunky stretched display type with hard shadows, neon pink/blue/purple/green liquid gradients, scattered pixel stars/butterflies/hearts/starbursts, asymmetric overlapping layout with gentle float animation.
- Three **CD jewel-case cards**: theme name, owner credit, 3-word vibe line, hover preview. Click → route.
- Disco-ball three.js scene becomes the landing backdrop (port `disco.js`); static-PNG `prefers-reduced-motion` fallback carries over.
- Non-skippable: `/` always renders the picker, no stored redirect. Direct links to `/chrome` etc. still work.
- **Exit criteria:** landing renders at mobile + desktop, all three cards navigate, backdrop degrades gracefully.

## 5. Phase E — Teammate stubs + contract docs

- `/aero` and `/scrapbook` render an era-styled UNDER CONSTRUCTION placeholder that already consumes shared hooks (shows the now-playing track) — proves the contract works before Parth/Pratima start.
- `THEME-GUIDE.md` in each folder: hooks available with return shapes, what to build, what never to touch, a ~20-line hello-world theme example.
- **Exit criteria:** a teammate can clone, `npm install && npm run dev`, and start building inside their folder without asking questions.

## 6. Phase F — Polish & presentation

- Responsive pass (landing + chrome theme), keyboard/Escape behaviors re-verified, cross-browser sanity check.
- Update `.claude/launch.json` to the Vite dev server; retire the http-server config.
- Judge-facing `README.md`: concept, the 3-theme bake-off, AI integration (DJ_Sp1n works in all themes), how to run.
- Documented 2-minute demo path: landing chaos → enter Chrome & Acid → search/play → DJ builds a mix → flip to Daylight Silver skin → peek at teammate stubs.

## Sequencing & risks

Order is A → B → C → D → E → F; C and D can swap if the landing needs to be visible for a team check-in sooner. Biggest risk is Phase B scope — the parity checklist is the guardrail against silent feature loss. Second risk: JSONP inside React needs a small script-injection hook (`useJsonp`) since there's no `fetch` equivalent — solved once in `core/api.js`.
