# Theme contract

A theme is a folder under `src/themes/<name>/` that exports one component,
`ThemeApp`, as its default export from `index.jsx`. The router renders it
directly at `/<name>` — it receives no props. Everything it needs comes from
the shared hooks in `src/core/hooks.js`.

**A theme owns 100% of its markup and CSS, 0% of its logic.** Don't call
`localStorage`, don't touch the `<audio>` element, don't fetch from the
iTunes API directly — go through the hooks below. That's what keeps three
teams shipping in parallel without merge conflicts.

## Hooks

### `usePlayer()`
```
{
  current,        // track object or null — the now-playing track
  queue,          // Track[]
  idx,            // number — index of `current` in `queue`, -1 if none
  isPlaying,      // boolean
  currentTime,    // seconds, live
  duration,       // seconds
  shuffle,        // boolean
  repeat,         // boolean
  play(tracks, startIdx),  // replace queue and play from startIdx
  toggle(),                // play/pause
  next(manual),            // manual=true when user clicked (feeds DJ skip-tracking)
  prev(),
  seek(seconds),
  setVolume(v),             // 0..1
  toggleShuffle(),
  toggleRepeat(),
}
```

### `useQueue()`
```
{
  queue, idx,
  jump(i), moveUp(i), remove(i), clear(),
}
```

### `useLibrary()`
```
{
  likes,                 // Track[]
  isLiked(id),
  toggleLike(track),
  mixes,                 // {name, tracks}[]
  burnMix(name, tracks),
  addToMix(mixIndex, track),
  removeFromMix(mixIndex, trackIndex),
  deleteMix(mixIndex),
  recent,                 // Track[] — recently played, most-recent first
  collectLibrary(),       // recent + mix tracks + session-found, deduped
}
```

### `useSearch()`
```
{
  query, results, filter,           // filter: 'all' | 'songs' | 'albums' | 'artists'
  setFilter(f),
  search(term),                     // fires a new search, updates query+results
  albums, artists,                  // lazy-loaded per query
  loadAlbums(), loadArtists(),
  albumTracks(albumId),             // Promise<Track[]>, cached
}
```

### `useDJ()`
```
{
  feed,               // session-log entries this console has shown
  status,             // rotating presence string, e.g. "♫ listening..."
  found,              // Track[] — "recently found" this session
  trending,           // {track, up}[] — lazy-loaded
  chatLog,            // im-style message list for the "talk to dj" pane
  sendChat(text),      // user message -> DJ reply + maybe a mix
  quickMix(key),       // 'gym' | 'road' | 'late' | 'party' | 'chill'
  buildMix(),          // build from this session's play history
}
```

### `useLibraryData()`
Curated 2006 catalog data theme UI can render directly (chart terms, staff
picks, stations, editorial playlists) — see `core/data.js` for the exact
shapes if you need to render your own version of Home/Radio/Playlists.

## Example — hello world theme

```jsx
// src/themes/aero/index.jsx
import { usePlayer } from '../../core/hooks';

export default function ThemeApp() {
  const { current, toggle, isPlaying } = usePlayer();
  return (
    <div style={{ padding: 24 }}>
      <h1>Aero theme — under construction</h1>
      <p>{current ? `Now playing: ${current.name} — ${current.artist}` : 'Nothing playing yet.'}</p>
      <button onClick={toggle}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
}
```

That's the whole contract. Build whatever markup and CSS you want around it.
