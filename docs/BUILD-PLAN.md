# BUILD PLAN — Spotify 2006 React App

## Locked decisions

- Palette stays as-is (chrome grays, `#161816` panels, off-white text) **except** the acid green, which gets swapped — the original `#9BF00B` sits at the lime/yellow boundary every AI "Y2K" generator defaults to. Swapped to `#17D95C` (Spotify CRT green) as `--acid`. Fully retired in Phase D — zero `#9BF00B`-lineage hex (or its decimal rgba equivalents) left in `chrome.css` or `core/data.js`.
- Chrome & Acid theme ships with **light + dark mode**, framed as two eras-authentic "skins" (à la Winamp/WMP), not a generic toggle.
- Landing page: full Y2K maximalism, but **no fake visitor counter** and **no "best viewed in 1024×768" badge**.
- Routes: `/chrome` (mine), `/aero` (Parth), `/scrapbook` (Pratima). `/` is the landing page and is never skipped or auto-redirected.
- Stack: Vite + React (JS, not TS), react-router, Zustand, shared core / theme-skin architecture.

## Progress

- [x] Phase A — Scaffold & core extraction
- [x] Phase B — Chrome & Acid theme port
- [x] Phase C — Light/dark mode for Chrome & Acid
- [x] Phase D — Chrome & Acid UI/UX upgrade (animations, micro-interactions, finish the green swap)
- [ ] Phase E — Aero theme (Parth)
- [x] Phase F — Scrapbook theme (Pratima)
- [ ] Phase G — Polish & presentation

## Phase A — Scaffold & core extraction *(done)*

`npm create vite@latest` in `react/`, react-router-dom + zustand. Core logic extracted into `core/` behind hooks (`usePlayer`, `useLibrary`, `useSearch`, `useDJ`, `useQueue`), same localStorage keys preserved (`sp06_likes`, `sp06_cache`, …). Single `<audio>` mounted above the router so playback survives theme-internal navigation.

## Phase B — Chrome & Acid theme port *(done)*

Shell (TitleBar, MenuBar, Toolbar, StatusBar, PlayerBar), panes (ExplorerTree, ContentView, DJConsole, splitters), all views (Home, Search, Album, Artist, Liked, Songs, Artists, Albums, Playlists, Mix CDs, Radio, Downloads, Queue), shared `TrackTable`, dialogs (Burn, About, Add-to-Mix), mobile drawers + scrim + vinyl toggle. Feature-parity checklist against the vanilla prototype, desktop + mobile.

## Phase C — Light/dark mode for Chrome & Acid *(done)*

**Midnight Chrome** (dark) / **Daylight Silver** (light) skins, XP Luna / WMP10 silver lineage. All colors live in CSS variables; `[data-skin="silver"]` override block, no component changes needed. Toggle in the titlebar, persisted to `localStorage` (`sp06_skin`).

## Phase D — Chrome & Acid UI/UX upgrade *(done, chrome-only — Aero/Scrapbook/Landing untouched)*

Goal: the theme should read as a *dense, alive 2006 desktop app*, not a static skin. Everything below stays inside `react/src/themes/chrome/` + `core/data.js` for icon content.

### Motion language
Y2K UI motion is **mechanical, not buttery** — Winamp/WMP/XP snapped, it didn't ease like iOS.
- Durations: 80–220ms for most things, nothing above ~350ms except the one-time boot sequence.
- Easing: `linear` / `ease-out` by default. No spring physics.
- Bounce used on purpose in exactly two places (dialog pop, LCD channel-glitch), not as a default feel.
- Every new keyframe folds into the existing `prefers-reduced-motion: reduce` block.

### D0. Finish the green swap
Derive a phosphor-green bevel family from `--acid` (`#17D95C`) with the same light→base→dark-ridge→rebound curve the old lime gradient used, and retire `#9BF00B` everywhere:

| Role | Old (lime) | New (phosphor) |
|---|---|---|
| light tint | `#C9FA6A` | `#8FFAC0` |
| base | `#9BF00B` | `#17D95C` (`--acid`) |
| dark ridge | `#6CBE08` | `#0E9E45` |
| rebound | `#8FDC12` | `#3FE07A` |
| border | `#4E8A06` | `#0C8542` |
| on-accent text | `#14230A` | `#0A2116` |
| icon stroke / secondary | `#2E6A08` / `#5BA30F` | `#0E6B3A` / `#12A24C` |

New CSS vars: `--acid-hi`, `--acid-lo`, `--acid-rebound`, `--acid-border`, `--acid-ink`. Apply to `.btn-row.pink`, `.build-mix`, `.talk-btn`, `.btn-play`, `.vinyl-label`, and `SVG_ICONS.gGreen` + related strokes in `core/data.js`.

### D1. Y2K icon pack (no emoji)
Extend the existing hand-built `SVG_ICONS` bevel system (gradient fill + 1px darker stroke, 16×16, same technique as the sidebar icons) — new icons: workout, road trip, late night, party, chill, build-mix (lightning bolt), DJ avatar mark (headphones-on-note). Used in the DJ console quick-mixes and header.

### D2. DJ console restructure
- Cut **Recently Found** and **Hot Right Now** — redundant with the session feed, weakest visual fidelity in the panel.
- Merge **Talk to DJ** chat into the main feed instead of a separate toggled mode — one continuous buddy conversation, not two screens.
- **Quick Mixes** go from a tiny flex-wrap row to a 2-column grid of chunky chrome buttons with the new icons.
- **Build Mix** stays the one pink→phosphor-green standout CTA, sized to match.
- Avatar gets a subtle idle pulse (low-amplitude glow loop) so it reads as alive.
- Status line becomes a small marquee ticker (reuse `.marquee-strip`) instead of static italic text.
- "DJ is typing…" indicator (styling exists, currently unused) fires for chat *and* quick-mix/build-mix latency.

### D3. Boot moment
One-time ~600ms "power-on" sequence on first `/chrome` load: horizontal scan-line sweep + brightness ramp, shell chrome snapping in top-to-bottom in three steps. Skippable on any click, session-flagged so it doesn't repeat on nav. Instant under reduced-motion.

### D4. Shell chrome micro-interactions
- Skin toggle: ~200ms "degauss" white-flash sweep across the shell while CSS vars swap, instead of a hard cut.
- Menu dropdowns: instant-open (period accurate), but a 1-frame chunky scale-in (`.97→1`, ~80ms).
- Search submit: brief LCD static/glitch flicker before results render (same beat reused on the player LCD, D6).
- Splitters: resize grip glows acid-green while dragging.
- Status bar: numeric cells (item count, cache size, total time) tick up/down like an odometer on change instead of snapping.

### D5. Content view micro-interactions
- Cover art (grid/top-result/featured): diagonal chrome "sheen sweep" on hover, one-shot ~400ms.
- Track table: playing row gets a tiny animated equalizer glyph (reuses `.viz` bar animation at micro scale) instead of a static `♫`.
- Explorer tree: expand/collapse animates height instead of snapping.
- Dialogs: glass "pop" entrance (scale .92→1 + fade, ~150ms, slight overshoot — intentional bounce #1). Empty-required-field submit triggers a short shake.
- Buttons/chips: press-down bevel-invert (exists) + a one-frame brightness flash before settling.

### D6. Player bar micro-interactions
- Track change: brief LCD static/glitch flicker before the new marquee text scrolls in (intentional bounce/glitch #2, mirrors D4's search glitch).
- Play/pause: radial acid-glow pulse on press, not just bevel invert.
- Seek/volume thumbs: brief glow-scale on drag start, settle on release.

### Non-goals for Phase D
- No iOS-style spring/parallax anywhere.
- No hover-tilt/3D-perspective cards (that's Aero's language).
- No sound effects (no audio assets in scope).
- No IA changes beyond the DJ console restructure above — this phase is shell + view polish + console cleanup, not a new layout.

**Exit criteria:** every micro-interaction above implemented in Midnight + Daylight skins, `prefers-reduced-motion` verified, no `#9BF00B`-lineage hex left anywhere in `chrome.css` or `core/data.js`, existing feature-parity checklist re-verified (nothing broken by the console restructure).

### Shipped

D0–D6 all landed. Notes on a few calls made along the way:
- **D0**: new `--acid-hi/-lo/-rebound/-border/-ink/-ink-2/-stroke/-stroke-2` vars plus a `--acid-wash-hi/-lo` pair for the olive-toned hover/active backgrounds (menu-item hover, active tree row, toggled player buttons) that were part of the same lime lineage but weren't literally `#9BF00B` — hue-shifted to match the new phosphor green. Caught three `rgba(155,240,11,…)` decimal instances the hex-only grep would've missed (build-mix glow, play button glow, buddy bubble glow).
- **D1**: 7 new icons — `workout`, `roadtrip`, `latenight`, `party`, `chill`, `buildmix`, `djmark` — same hand-bevel technique as the sidebar set.
- **D2**: feed + chat now render as one interleaved thread (sorted by id, which is a monotonic timestamp+counter string already shared by both), so ambient DJ asides and explicit chat messages appear in true chronological order without needing a store change. Quick Mixes are a 2-col icon grid. Also fixed a pre-existing dead `#imInput` CSS selector (the input never had that id) while rewriting the console — it was rendering unstyled before.
- **D3**: boot sequence gates on `sessionStorage` (not per-mount), so it plays once per browser session, not once per app lifetime or every `/chrome` nav.
- **D4**: LCD glitch keyframe (`.lcd-glitch`) built shared so D6's player track-change reuses the exact same beat as the search-submit glitch, per the spec's "same beat reused" note.
- **D5**: cover-art sheen and the skin-toggle degauss flash both needed to stay visible against the Daylight Silver skin's near-white surfaces — sheen color is now a skin-aware `--sheen-color` var, degauss dropped `mix-blend-mode: overlay` (invisible on white) for a plain opacity flash.
- **D6**: play/pause glow-pulse and track-change glitch are both one-shot, cleared via `onAnimationEnd`/timeout so they don't loop.
- Reduced-motion: the theme already had a blanket `.theme-chrome * { animation: none !important; transition: none !important; }` rule, so every keyframe added in D0–D6 is covered automatically — no per-animation override needed. The boot sequence additionally skips its `sessionStorage`-gated state entirely under reduced motion (checked in JS), not just visually suppressed.

## Phase F — Scrapbook theme port *(done)*

1:1 React port of Pratima's `scrapbook.html` mockup, exact layout/copy/songs preserved — `data.js` (TRACKS list), `scrapbook.css` (scoped to `.theme-scrapbook`), `LoadingScreen.jsx` (with the loading-screen banner text added above the loading box), `HeaderBar.jsx`, `IpodBar.jsx`, `Sidebar.jsx`, `QueuePanel.jsx`, `views.jsx`, `index.jsx`. Playback/queue/search routed through the shared `core/hooks.js` store instead of the mockup's standalone `<audio>`/local fetch — the one unavoidable deviation from the vanilla mockup. Post-port layout fixes: header bar spans full width (`grid-template-areas` reflow), sidebar/queue panels lowered to match, duplicate "spotify" wordmark removed from the sidebar title, iPod widened to fill the freed space.

## Landing page — entrance & transition polish *(done, cross-theme)*

Ambient stage animation on load: disco ball fades in from above the frame then settles into its float loop; the three spotlight beams sway independently (distinct duration + negative delay per beam so they read as separate rigs, not a synced wipe); vinyl discs fade in from below staggered per-card, then spin continuously in place (art/label layer rotates, sheen highlight and center hole stay fixed, mimicking a light glinting off a spinning record rather than the whole disc assembly rotating as one rigid unit).

Click transition replaced the old "ENTERING X" text-overlay wipe: clicking a vinyl card grows it into a fixed-position overlay that flies to viewport-center, keeps spinning, then fades into the selected theme (`ThemeTransition.jsx` + `theme-transition.css`), state lifted into a `ThemeTransitionProvider` mounted alongside `<Routes>` in `App.jsx` so it survives the route unmount. Full `prefers-reduced-motion` support throughout — reduced-motion users skip straight to the resting/final state with no animation.

## Phase G — Polish & presentation

- Responsive pass (landing + all three themes), keyboard/Escape behaviors re-verified, cross-browser sanity check.
- Judge-facing `README.md`: concept, the 3-theme bake-off, how to run.
- Documented 2-minute demo path: landing chaos → enter Chrome & Acid → search/play → DJ builds a mix → flip to Daylight Silver skin → peek at teammate stubs.

## Sequencing & risks

Order is A → B → C → D → (E/F in parallel, owned by teammates) → G. Phase D's biggest risk is scope creep on the animation list — ship D0–D2 (colors, icons, console) first since they're structural; D3–D6 are additive polish and can be trimmed individually if time runs short. Second risk carried over from Phase B: JSONP inside React needed a script-injection hook (`useJsonp`), solved in `core/api.js`.
