# Spotify 2006

A one-file front-end tribute to the 2006 Spotify era: chrome UI, dark panels, dense library browsing, mix CDs, radio, and a DJ console.

## What it is

This project is a static HTML, CSS, and JavaScript app built to feel like an old desktop music client. There is no build step and no framework. The whole app lives in:

- [index.html](index.html)
- [style.css](style.css)
- [app.js](app.js)

## How it is made

The layout is a 3-column desktop shell:

- left: library explorer tree
- center: the main content area
- right: the DJ console
- footer: player controls, LCD now-playing strip, seek and volume

The styling leans hard into a 2006 UI look: gradient chrome, LCD green text, old-school buttons, sharp borders, and fixed desktop proportions. The app also keeps a few bits of state in `localStorage`, including:

- recently played tracks
- mix CDs
- search/cache data
- tree open state
- column widths
- visitor counter

## iTunes API

Track data comes from the iTunes Search API.

The app queries endpoints like:

```text
https://itunes.apple.com/search?media=music&entity=song&limit=25&term=...
```

Because this is a static client, the code uses JSONP instead of `fetch()` for the iTunes requests. In [app.js](app.js), the `jsonp()` helper injects a `<script>` tag, appends a temporary callback name, and resolves when iTunes returns the payload.

The raw API results are normalized into a simpler track shape with:

- `id`
- `name`
- `artist`
- `album`
- `art`
- `preview`
- `ms`
- `genre`

Curated sections like charts, staff picks, hidden gems, and playlists are built by searching the iTunes API with seeded artist/song strings and caching the results for 6 hours.

## Album covers

Album art is fetched from the iTunes `artworkUrl100` field. In [app.js](app.js), the URL is upgraded from the 100px version to 300px by replacing `100x100` with `300x300` during normalization.

That art is then rendered in a few places:

- the now-playing image in the footer player
- track tables throughout the app
- album cover grids in the library view
- featured artist cards and curated sections

The player bar updates the active cover by assigning the art URL to the `#playerArt` image element and unhiding it when a track has artwork. Album grids and track rows reuse the same normalized `art` field as regular `<img>` sources.

## Audio playback

Playback uses the 30-second preview URLs returned by iTunes. When a track starts, the app updates the LCD text, now-playing art, recent-history state, and the DJ console session log.

## Run it

Open `index.html` directly in a browser, or serve the folder with any static server if you prefer.

## Notes

- The app is intentionally desktop-first.
- It is designed to feel period-correct, not modern-minimal.
- Search results and curated sections depend on live iTunes responses.