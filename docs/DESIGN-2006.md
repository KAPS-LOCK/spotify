# SPOTIFY 2006 — Era Authenticity Design Document

Research-backed analysis of what made 2004–2008 desktop software look the way it did,
an audit of our current mockup against it, and a phased redesign plan.
No code has been changed; this document is the deliverable.

---

## PART 1 — RESEARCH: the actual design language of 2004–2008

### 1.0 The single most important finding

Across Winamp 5, WMP 10/11, iTunes 7, Nero 7, MediaMonkey, foobar2000, MSN Messenger,
and XP/Vista Explorer, the era-read does **not** come from any color scheme.
Winamp Bento was near-black; iTunes 7 was flat gray; WMP11 was black glass; Explorer was
Luna blue. What they all share is **anatomy**:

> A 2006 application is a stack of horizontal bars around a splitter-divided pane area:
> **title bar → menu bar → toolbar → [tree pane | list pane | info pane] → status bar.**
> Every pane is either *raised chrome* (controls) or a *sunken well* (content).
> Content is a dense, sortable, striped LIST — never a card grid.

Our dark "Chrome & Acid" palette is period-legitimate — media players were the one
software category where full custom skins were expected (Winamp invented it, WMP shipped
skins, Bento shipped dark by default). What betrays us is *structure*, not color.

### 1.1 Layout philosophy

- **Frame, not canvas.** The app is a window with hard edges and visible machinery.
  Modern apps are a content canvas with floating controls; 2006 apps are a control
  chassis with content slotted into wells.
- **Splitter panes, not columns.** Panes are separated by draggable 4–6px splitters
  (we already have this — it's one of our most authentic features).
- **Every pane announces itself** with a caption bar or group header.
- **Nothing floats.** No floating action buttons, no overlays except dialogs and menus.
  Z-axis was reserved for windows, menus, tooltips.
- **Horizontal bars are sacred.** Toolbar buttons sit ON the bar; the bar itself is a
  gradient strip with a 1px border top and bottom.

### 1.2 Window chrome & panel hierarchy

- Title bar: app name + document, gradient, rounded top corners only (XP Luna).
  (We deliberately dropped min/max/close as no-value garnish — fine; the rest of the
  chrome carries the read.)
- **Menu bar: File Edit View ... Help.** THE canonical 2006 element. Even WMP11, which
  hid it, kept it one Alt-press away; iTunes 7 for Windows, Nero, MediaMonkey, MSN,
  foobar2000 all showed it permanently. Its mere presence dates an app instantly.
- Three depth levels, expressed with 1px bevels, not shadows:
  - **Raised** (buttons, toolbars, headers): light edge top/left, dark edge bottom/right.
  - **Flat** (bar background).
  - **Sunken** (text fields, list wells, LCDs): dark edge top/left, light bottom/right,
    plus `inset` shadow. Content ALWAYS lives in sunken wells.
- Status bar at the bottom, split into bordered segments, each a sunken cell, with a
  **size grip** (diagonal dots) in the corner. iTunes 7's bottom bar showed live totals:
  "3,204 items, 9.2 days, 13.63 GB" — the status bar *reports on the data*.

### 1.3 Borders, bevels, gradients, shadows

- Border radius: **0–3px on controls.** XP was rounded only at window title corners;
  controls were square-ish. Vista/Aero buttons ~3px. Pills and 8px+ radii read 2012+.
  (Exception: Web-2.0-styled *marketing* surfaces used pills and reflections — valid
  only for promos/badges, not for controls.)
- Gradients: vertical, 2-stop, with the signature **hard midpoint break** — light half
  on top, darker half below, edge at 45–52% ("glass split"). We already do this
  (`--chrome-grad`). WMP11/Aero variant: dark glass + white specular top edge +
  faint bottom glow.
- Shadows: almost none on controls. `inset 0 1px 0 rgba(255,255,255,x)` top highlight
  on raised, `inset 0 1–2px` dark on sunken. Drop shadows only on menus/dialogs/windows.
- 1px solid borders **everywhere**. A control without a border did not exist.

### 1.4 Typography

- **One UI font, one size: Tahoma 8pt (11px) — the entire OS ran on it.** Vista: Segoe UI
  9pt. Hierarchy came from **bold**, color, and CAPS — not size. A 2006 dialog might use
  a single font size for every element.
- Display type only for branding (Winamp's logotype, MSN's Trebuchet flavor).
  iTunes 7 used the system font even for headers (just bold).
- Trebuchet MS = XP title bars and MSN Messenger identity (we use this — correct).
- Dense line-height (~1.2–1.4), sentence case labels, colons after field labels
  ("Name your CD:"), ellipsis on commands that open dialogs ("Burn Disc…").

### 1.5 Density & spacing

- Control padding 2–4px. List rows **16–18px tall**. Toolbar height ~26–30px.
  A library view showed 25–40 rows at once; whitespace was considered waste.
- 16×16 icons in trees/lists/menus; 24×24 or 32×32 only on primary toolbars.
- Scrollbars visible and chunky (16px) with **arrow buttons at both ends** — a strong
  era marker now that every modern OS hides them.

### 1.6 Icon style (Silk / Fugue / Crystal / XP shell)

- 16×16 px, saturated candy colors, soft 3D shading, white or dark 1px outline,
  slight top-down perspective, tiny badge overlays (+ ✓ ✗ ★) composited on base glyphs.
- NEVER monochrome line icons — that's 2014+. Icons were tiny illustrations.
- famfamfam Silk (1,000 icons) was *the* mid-2000s web-app set and sat alongside the
  era's other tics: rounded corners, gradients, drop shadows on the web side.

### 1.7 Buttons & controls

- Chrome gradient + 1px border + bold 11px label. Pressed = gradient flips/darkens +
  content nudges 1px down-right (we do this — keep).
- **Toggle buttons stay visibly depressed** (sunken bevel + darker fill) — how
  shuffle/repeat rendered in every player (ours does this — keep).
- **Split buttons** (WMP11's Rip/Burn/Sync — button + thin dropdown strip).
- Default button gets a highlight ring in dialogs; Cancel is always rightmost-or-second
  per platform order.
- Filter/selector groups = **tabs or beveled toggle-button rows** — never pill chips.

### 1.8 Lists, trees, tables (the heart of every media app)

- **The list view IS the application.** iTunes 7, WMP11, foobar2000, MediaMonkey are all
  fundamentally a giant sortable table.
- Column headers: raised chrome cells, clickable, **sort arrow ▲▼ in header**,
  draggable-to-resize (at least visually implied by cell borders).
- **Alternating row striping** — iTunes' white/pale-blue banding is one of the most
  recognizable visuals of the decade.
- **Full-row selection highlight** (XP: solid #316AC5 blue with white text; iTunes:
  blue gradient bar). Selection ≠ hover; click selects, **double-click plays**.
- Tree views: +/− toggle boxes and **dotted connector lines** to parents; folder icons.
- **Star ratings column** (★★★☆☆) — iTunes and WMP both had it; instantly evocative.

### 1.9 Cards vs panels — information architecture

- **Cards did not exist.** The card-with-hover-affordance is 2013+ Material language.
- Grids of art existed only as *icon views* (Explorer Thumbnails, iTunes album grid):
  square tiles, tight gaps, caption text UNDER the item, **selection highlight on
  click**, action via double-click — not hover-revealed borders or buttons.
- Detail = **master-detail panes**, not detail pages: click artist in tree → songs in
  list. A dedicated "info pane" (album art bottom-left in iTunes; Nero's disc info)
  filled the third slot.

### 1.10 Interaction patterns

- Right-click **context menus everywhere** — the era's power-user surface.
- Tooltips on every toolbar icon; **balloon tips** from the tray (MSN's "so-and-so has
  signed in" slide-up toast).
- Status bar narrates state: "Ready." / "Ripping track 4 of 12…" / item counts.
- Web-style back/forward arrived in media apps ONLY with WMP11 (upper-left round glass
  buttons) — a legitimate 2006 pattern we can use for search/album navigation.
- Marquee/LED text, spectrum analyzers, kbps·kHz readouts — Winamp's LCD language
  (we have all of this — keep, it's our strongest asset).
- Known era usability sin (per Miksovsky's 2006 WMP11 critique): style over Fitts' Law
  (WMP11's paper-thin dropdown strips). We mimic the LOOK, not the mistakes.

---

## PART 2 — DESIGN DOCUMENT: the six questions

### Q1. What instantly communicates "2006 desktop application"?

Ranked by signal strength:
1. **Menu bar** (File Edit View Help) under the title bar.
2. **Dense sortable list view** with beveled column headers, sort arrows, alternating
   row striping, full-row blue selection, double-click-to-play.
3. **Status bar** with sunken segments, live counts, size grip.
4. **Beveled 3D controls** — raised buttons / sunken wells, 0–3px radii, 1px borders.
5. **One small UI font** (Tahoma 11px), bold-for-hierarchy, no display-size text.
6. **16×16 color icons** (Silk-style) in tree, lists, menus, buttons.
7. Tree view with +/− boxes and dotted connector lines.
8. Chunky scrollbars with end arrows.
9. Glass-split gradients with hard midpoint (already ours).
10. LCD/visualizer/kbps garnish (already ours).

### Q2. What parts of our current design already feel right / still feel modern?

**Already authentic (don't touch):**
- 3-pane splitter layout with draggable resize
- `--chrome-grad` hard-midpoint gradients; pressed-button bevel behavior
- Toggle-button sunken "on" state (SHFL/RPT)
- LCD player bar: Courier LCD, glow, viz bars, kbps·stereo·44khz readout
- Titlebar + statusbar existence; tree +/− toggles; Tahoma in `--font-ui`
- MSN buddy-window console with Trebuchet MS; Aero cameo dialog
- Dark skin itself (Winamp/Bento lineage — valid for a media player)

**Still reads modern (the tells), with file references:**
- Pill search field — `#searchInput` border-radius 12px (style.css:139)
- Pill filter chips — `.chip` border-radius 12px (style.css:459–477)
- Hover-border card grids — `.cover`, `.pl-card`, `.station`, `.top-result`
  (hover → acid border = Material affordance; no selection model)
- No menu bar at all
- Static status bar text; no live counts, no segments, no size grip
- Track table: no striping, no sortable beveled headers, no row selection,
  no double-click semantics, actions as always-visible chrome buttons per row
- Section headers use Arial Black display sizing (`.view h2` 18px, `.sec-head h3`)
  — modern "display type for headers" pattern
- 5–7px gaps between tiles (2006 grids were 1–3px + selection highlight)
- Border-radius creep: `.dialog` 10px, `.btn-aero` 16px pill, `.buddy-bubble`,
  bubble chat radii — some fine (Aero/MSN), some not (controls)
- Custom scrollbar is rounded-thumb modern hybrid; no arrow buttons

### Q3. Which components should be redesigned first? (impact order)

1. **Track table → real list view** — it's on screen in every view; highest area × signal.
2. **Menu bar** — cheapest single element with the loudest era signal.
3. **Search field + filter chips** — top-center focal point; the two loudest pills.
4. **Status bar** — bottom edge frame; segments + live counts + size grip.
5. **Cover/playlist grids → icon-view semantics** — selection instead of hover-borders.
6. Tree connector lines; scrollbars; typography flattening — after the above.

### Q4. Which modern UI patterns should be removed?

- Pill radii on controls (search, chips) → 0–2px sunken/raised rectangles
- Hover-revealed affordances as the *primary* action surface → selection + double-click
  (+ context menu), with row buttons kept but demoted visually
- Cards as containers → wells, group boxes, icon-view tiles
- Display-size headings inside content → 11px bold CAPS group headers with rule lines
- Static decorative status text → live, data-driven status segments
- Rounded borderless scrollbar thumb → squared XP-style with arrow buttons

### Q5. Which desktop-era conventions replace them?

| Modern pattern (ours) | 2006 replacement |
|---|---|
| Pill search input | Sunken rectangular field, 1px border, optional 16px magnifier icon inside |
| Filter chips ALL/SONGS/… | Beveled toggle-button row (or tab strip) — one visibly depressed |
| Card hover-border | Click = full-row/tile selection highlight; double-click = play |
| Per-row chrome buttons only | Right-click context menu (Play, Add to Queue, ♥, Burn to CD…) + demoted row buttons |
| h2/h3 display headers | 11px bold CAPS captions with 1px rule; panes get caption bars |
| No menus | Menu bar: File · Edit · View · Controls · Tools · Help (mostly functional, some gag items) |
| Static footer | Segmented status bar: item count · total time · cache size · "Ready." · size grip |
| Plain tree rows | +/− boxes (have) + dotted vertical connector lines + 16×16 color icons |
| No ratings | ★ rating column in track lists (persist per-track like likes) |
| No back/forward | WMP11-style round back/forward glass buttons left of search (search↔album drill-down) |

### Q6. What should remain modern for usability?

- **Mobile responsive layer entirely** — drawers, scrim, close buttons, big touch
  targets, wrapped player. 2006 had no phones; judges will use one. Skin it, keep it.
- Focus-visible outlines, `prefers-reduced-motion`, contrast ratios.
- Centered search (explicit product decision to mirror real Spotify).
- Click-once-to-play stays as a fallback alongside double-click (double-click is the
  garnish, not a gate); same for context menus — never the only path on touch.
- No fake latency, no fake dial-up limits (hackathon rule: modern functionality).
- Real scrolling performance: virtual-DOM-free but don't add layout-thrashing effects.

---

## PART 3 — PHASED REDESIGN PLAN

### Phase 1 — structural authenticity (highest impact, zero functionality change)

1. **Menu bar** below titlebar: `File  Edit  View  Controls  Tools  Help`.
   Real dropdowns (chrome-on-dark, 1px border, 16px icon gutter, separators,
   keyboard-underline accelerators). Wire items to existing functions:
   Controls→Play/Pause·Next·Shuffle·Repeat, View→panes toggle, File→"Burn Mix CD…",
   Tools→"Talk to DJ_Sp1n", Help→"About Spotify 2006…" gag dialog. Hidden on mobile.
2. **De-pill the toolbar**: search → sunken rectangle (radius 2px) with 16px magnifier;
   chips → beveled toggle-button row sharing edges (segmented control), active one
   depressed. SEARCH » button keeps chrome style.
3. **List-view the track table**: alternating row striping (panel/panel-2 banding);
   column headers as raised chrome cells with hover + click-to-sort + ▲▼ arrow
   (sort by name/artist/album/time); full-row selection highlight distinct from
   hover and from `.playing`; double-click plays (single click selects; row buttons
   still work). Row height stays tight on desktop.
4. **Status bar, alive**: segmented sunken cells — `N items · M:SS total` (current
   view), `sp06_cache` size, existing status message, size-grip glyph far right.
5. **Typography discipline**: content headers drop to 11–12px bold CAPS captions with
   rule lines (`.sec-head` pattern everywhere); Arial Black reserved for the logo and
   intro only. Base stays Tahoma.
6. **Square the controls**: border-radius audit — controls to 0–2px (buttons 2–3px OK);
   dialogs/bubbles keep their MSN/Aero radii deliberately.

### Phase 2 — component & interaction depth

7. **Context menus** (custom, styled like the menu bar dropdowns) on track rows, covers,
   mix cards, tree nodes: Play · Add to Queue · ♥ Like · Add to Mix CD… · Artist page.
   Long-press equivalent skipped on mobile (buttons already cover it).
8. **Star ratings**: ★★★★★ column in track tables, click-to-rate, `sp06_ratings` in
   localStorage; "top rated" auto-node under Library in the tree.
9. **Tree view dressing**: dotted vertical connector lines, 16×16 Silk-style icons
   (recolor existing SVG set toward candy-color + outline look), folder open/closed
   variants.
10. **Icon-view grids**: covers/playlists/stations get selection highlight + caption
    styling like Explorer Thumbnails; hover demoted to subtle; actions via dblclick +
    context menu + selection-aware toolbar row above grid ("PLAY  QUEUE  ♥" enabled
    when something selected).
11. **Back/forward glass buttons** beside home (WMP11 style) navigating the existing
    view history (search → album → back).
12. **Split button** for BURN: main = burn selected/current mix; dropdown strip =
    "Burn session…", "Burn liked songs…".
13. **Scrollbars**: squared thumb, track ticks, arrow buttons at ends (webkit
    `::-webkit-scrollbar-button`), console keeps thin variant.
14. **Dialog order & chrome**: XP-blue gradient caption strip on the burn dialog
    (keep Aero body), default-button ring, Enter/Escape wiring.

### Phase 3 — polish, animation, micro-interaction

15. **MSN balloon toasts**: DJ_Sp1n events ("DJ_Sp1n has signed in", "mix ready") as
    slide-up toast bottom-right with 16px avatar — replaces/augments buddy bubble on
    desktop.
16. **Nudge**: DJ chat gets a MSN nudge — window shake animation when DJ drops a mix.
17. **Pressed-state & focus polish**: 1px content nudge on all buttons (some have it),
    dotted focus rectangle (marching-ants style `outline: 1px dotted`) as the
    keyboard-focus look, chrome hover sheen on toolbar icons.
18. **Viz upgrade**: oscilloscope mode toggle on the LCD (click viz to switch bars ↔
    scope line), Winamp-style.
19. **Boot sequence**: after intro, 400ms "Loading library… / Connecting to store…"
    two-line LCD boot text in the player bar (fast, skippable, no fake limits).
20. **About dialog**: Help→About with build number, credits, an era EULA joke, and the
    disco ball PNG.
21. **Tooltips**: title attributes everywhere → optionally custom yellow balloon
    tooltips (#FFFFE1, 1px black border — the XP tooltip) for toolbar/transport.
22. **Sort/selection micro-anim**: none. 2006 had no animated list sorting — instant
    re-render IS the era behavior. (Restraint is polish here.)

### Sequencing note

Phase 1 items 1–4 are independent of each other and of Phases 2–3; any subset ships
value. Item 10 (grids) depends on 3's selection model. Ratings (8) and context menus
(7) share the row-interaction plumbing — build together.

---

## Sources

- Jan Miksovsky, *Windows Media Player 11: Early bit of Aero* (2006) — first-hand design
  critique: black glass, split buttons, breadcrumbs, Fitts' Law failure.
  https://jan.miksovsky.com/posts/2006/05-25-windows-media-player-11-early-bit-of-aero
- Phil Wylie, *Looking back at the Silk icon set* — 16×16 icon economics + mid-2000s
  web trends. https://www.philwylie.co.uk/2022/10/looking-back-at-the-silk-icon-set/
- Version Museum, *History of iTunes* — brushed metal → gray gradient (iTunes 5–7),
  Cover Flow in 7. https://www.versionmuseum.com/history-of/itunes-app
- 512 Pixels, *The History of Cover Flow* — 2006 acquisition & integration.
  https://512pixels.net/2023/10/the-history-of-cover-flow/
- Wikipedia: *Windows XP visual styles* (Luna, Frog Design, task panes),
  *Windows Aero* (glass, Segoe UI, guidelines), *Tahoma (typeface)* (8pt UI default),
  *foobar2000* (modular utilitarian UI), *Windows Media Player* (WMP11 redesign).
- Raymond Chen, *The look of Luna* — devblogs.microsoft.com/oldnewthing (design intent).
- Microsoft Learn: era *Toolbars/Menus/Status Bars design guidelines* (Win32 UX Guide).
- XP.css (botoxparty.github.io/XP.css) — pixel-accurate reference for XP control bevels.
- Winamp Heritage / Winamp Skin Museum — Bento (default 5.5 SUI, dark) anatomy.
