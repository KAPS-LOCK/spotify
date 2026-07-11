import { useEffect, useState } from 'react';
import { usePlayer, useLibrary, useSearch, useDJ, useQueue } from '../../core/hooks';
import { useAppStore } from '../../core/store';
import { searchTracks, dedupe, shuffleArr } from '../../core/api';
import { loadTermSet } from '../../core/curated';
import { fmtTime } from '../../core/fmt';
import {
  CHART_2006, NEW_RELEASES, STAFF_PICKS, HIDDEN_GEMS, FEATURED_ARTIST,
  EDITORIAL, STATIONS,
} from '../../core/data';
import { TrackTable } from './TrackTable';
import { CoverGrid } from './CoverGrid';
import { useDialogs } from './DialogContext';

/* ---------------- home ---------------- */

function Section({ title, note, children }) {
  return (
    <div className="sec">
      <div className="sec-head"><h3>{title}</h3><span className="sec-note">{note}</span></div>
      {children}
    </div>
  );
}

export function Home({ nav }) {
  const { play } = usePlayer();
  const { addGemIds } = useDJ();
  const [chart, setChart] = useState(null);
  const [newRel, setNewRel] = useState(null);
  const [staff, setStaff] = useState(null);
  const [gems, setGems] = useState(null);
  const [featured, setFeatured] = useState(null);
  const recent = useAppStore((s) => s.recent);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = await loadTermSet('chart', CHART_2006).catch(() => []);
      if (!cancelled) setChart(c);
      const n = await loadTermSet('newrel', NEW_RELEASES).catch(() => []);
      if (!cancelled) setNewRel(n);
      const s = await loadTermSet('staff', STAFF_PICKS).catch(() => []);
      if (!cancelled) setStaff(s);
      const g = await loadTermSet('gems', HIDDEN_GEMS).catch(() => []);
      if (!cancelled) { setGems(g); addGemIds(g.map((t) => t.id)); }
      try {
        const feat = await searchTracks(FEATURED_ARTIST.name, 6);
        if (!cancelled) setFeatured(feat);
      } catch { if (!cancelled) setFeatured([]); }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="marquee-strip"><span>&#9835; every song on earth, streaming to your computer. yes, legally. we checked twice &middot; burn mix cds &middot; tune the radio &middot; dj_sp1n is watching the decks &#9835;</span></div>

      <Section title={<>TOP OF THE CHARTS <span className="zap">'06</span></>} note="what everyone's playing">
        {chart === null ? <div className="loading">loading</div> : <CoverGrid tracks={chart} ranked />}
      </Section>
      <Section title="NEW RELEASES" note="fresh off the press">
        {newRel === null ? <div className="loading">loading</div> : <CoverGrid tracks={newRel} />}
      </Section>
      <Section title="STAFF PICKS" note="the interns have taste">
        {staff === null ? <div className="loading">loading</div> : <CoverGrid tracks={staff} />}
      </Section>
      <Section title="HIDDEN GEMS" note="don't tell everyone">
        {gems === null ? <div className="loading">loading</div> : <CoverGrid tracks={gems} />}
      </Section>
      <Section title="FEATURED ARTIST" note="on rotation at hq">
        {featured === null ? <div className="loading">loading</div> : featured.length ? (
          <div className="featured">
            <img src={featured[0].art} alt="" />
            <div className="f-body">
              <div className="f-name">{FEATURED_ARTIST.name}</div>
              <div className="f-note">{FEATURED_ARTIST.note}</div>
              <div className="f-tracks">
                {featured.map((t, i) => (
                  <button className="f-track" key={t.id} onClick={() => play(featured, i)}>
                    <span className="f-no">{String(i + 1).padStart(2, '0')}</span>{t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Section>
      {recent.length > 0 && (
        <Section title="RECENTLY PLAYED" note="your last spins">
          <TrackTable tracks={recent} />
        </Section>
      )}
    </>
  );
}

/* ---------------- search ---------------- */

const SEARCH_CHIPS = [['all', 'ALL'], ['songs', 'SONGS'], ['albums', 'ALBUMS'], ['artists', 'ARTISTS']];

export function Search({ nav }) {
  const { query, results, filter, albums, artists, setFilter, loadAlbums, loadArtists, searchArtistDirect } = useSearch();
  const { play } = usePlayer();
  const { promptAddToMix } = useDialogs();

  useEffect(() => {
    if (filter === 'albums') loadAlbums();
    if (filter === 'artists') loadArtists();
  }, [filter, loadAlbums, loadArtists]);

  if (!query) {
    return (
      <>
        <h2>SEARCH</h2>
        <p className="view-sub">type something in the search box up top. anything. we dare you.</p>
        <div className="empty-note">[ no search yet ]</div>
      </>
    );
  }

  return (
    <>
      <h2>RESULTS: <span className="zap">"{query.toUpperCase()}"</span></h2>
      <div className="chip-row">
        {SEARCH_CHIPS.map(([id, label]) => (
          <button key={id} className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>

      {(filter === 'all' || filter === 'songs') && (
        results.length === 0
          ? <div className="empty-note">[ nothing found — check the spelling? ]</div>
          : filter === 'songs'
            ? <TrackTable tracks={results} />
            : <>
                <TopResult t={results[0]} onPlay={() => play(results, 0)} onAdd={() => promptAddToMix(results[0])} />
                <TrackTable tracks={results.slice(0, 10)} />
              </>
      )}

      {filter === 'albums' && (
        albums === null ? <div className="loading">digging</div>
          : albums.length === 0 ? <div className="empty-note">[ no albums found ]</div>
          : <div className="cover-strip">
              {albums.map((a) => (
                <button className="cover" key={a.id} onClick={() => nav('album:' + a.id, a)}>
                  <img src={a.art} alt="" loading="lazy" />
                  <div className="c-name">{a.name}</div>
                  <div className="c-artist">{a.artist}{a.year ? ' · ' + a.year : ''}</div>
                </button>
              ))}
            </div>
      )}

      {filter === 'artists' && (
        artists === null ? <div className="loading">digging</div>
          : artists.length === 0 ? <div className="empty-note">[ no artists found ]</div>
          : <div className="pl-grid">
              {artists.map((a) => (
                <button className="pl-card" key={a.name} onClick={() => { searchArtistDirect(a.name); }}>
                  <div className="pl-name">{a.name}</div>
                  <div className="pl-desc">ARTIST · {a.genre.toLowerCase()}</div>
                </button>
              ))}
            </div>
      )}
    </>
  );
}

function TopResult({ t, onPlay, onAdd }) {
  const { toggleLike, isLiked } = useLibrary();
  return (
    <div className="top-result">
      <img src={t.art} alt="" />
      <div className="tr-body">
        <div className="tr-name">{t.name}</div>
        <div className="tr-sub">SONG &middot; {t.artist}</div>
        <div className="tr-btns">
          <button className="btn-row" onClick={onPlay}>&#9654; PLAY</button>
          <button className={'btn-row heart' + (isLiked(t.id) ? ' on' : '')} onClick={() => toggleLike(t)}>&hearts;</button>
          <button className="btn-row pink" onClick={onAdd}>+CD</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- album detail ---------------- */

export function AlbumDetail({ albumId, albumMeta, nav }) {
  const { albumTracks } = useSearch();
  const { play } = usePlayer();
  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setTracks(null);
    albumTracks(albumId).then((t) => { if (!cancelled) setTracks(t); }).catch(() => { if (!cancelled) setTracks([]); });
    return () => { cancelled = true; };
  }, [albumId, albumTracks]);

  return (
    <>
      <h2><span className="zap">&#9678;</span> {albumMeta ? albumMeta.name.toUpperCase() : 'ALBUM'}</h2>
      <p className="view-sub">
        {albumMeta ? albumMeta.artist + (albumMeta.year ? ' · ' + albumMeta.year : '') + ' · ' : ''}
        <button className="btn-row" onClick={() => tracks && tracks.length && play(tracks, 0)}>&#9654; PLAY ALL</button>{' '}
        <button className="btn-row" onClick={() => nav('search')}>&laquo; BACK TO RESULTS</button>
      </p>
      {tracks === null
        ? <div className="loading">loading tracklist</div>
        : tracks.length === 0
          ? <div className="empty-note">[ no previews available for this one ]</div>
          : <TrackTable tracks={tracks} />}
    </>
  );
}

/* ---------------- liked ---------------- */

export function Liked() {
  const { likes } = useLibrary();
  const { play } = usePlayer();
  return (
    <>
      <h2><span className="zap">&hearts;</span> LIKED SONGS</h2>
      <p className="view-sub">
        {likes.length} song{likes.length === 1 ? '' : 's'} you couldn't leave alone
        {likes.length > 0 && <>{' '}&middot; <button className="btn-row" onClick={() => play(likes, 0)}>&#9654; PLAY ALL</button></>}
      </p>
      {likes.length === 0
        ? <div className="empty-note">[ nothing liked yet — hit the &hearts; on any track ]</div>
        : <TrackTable tracks={likes} />}
    </>
  );
}

/* ---------------- queue ---------------- */

export function Queue() {
  const { queue, idx, jump, moveUp, remove, clear } = useQueue();
  const { toggleLike, isLiked } = useLibrary();
  return (
    <>
      <h2><span className="zap">UP NEXT</span></h2>
      <p className="view-sub">
        {queue.length} in the queue
        {queue.length > 0 && <>{' '}&middot; <button className="btn-row pink" onClick={clear}>CLEAR QUEUE</button></>}
      </p>
      {queue.length === 0
        ? <div className="empty-note">[ queue empty — play something ]</div>
        : (
          <table className="track-table">
            <thead><tr><th></th><th>SONG</th><th>ARTIST</th><th style={{ textAlign: 'right' }}>TIME</th><th></th></tr></thead>
            <tbody>
              {queue.map((t, i) => (
                <tr key={t.id + '-' + i} className={i === idx ? 'playing' : ''}>
                  <td className="t-art"><img src={t.art} alt="" loading="lazy" /></td>
                  <td className="t-name">{t.name}</td>
                  <td className="t-artist">{t.artist}</td>
                  <td className="t-time">{fmtTime(t.ms / 1000)}</td>
                  <td className="t-actions">
                    <button className="btn-row" onClick={() => jump(i)}>&#9654;</button>
                    {i > 0 && <button className="btn-row" title="Move up" onClick={() => moveUp(i)}>&#9650;</button>}
                    <button className="btn-row pink" title="Remove" onClick={() => remove(i)}>&times;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </>
  );
}

/* ---------------- library: songs / artists / albums ---------------- */

export function Songs() {
  const { collectLibrary } = useLibrary();
  const lib = collectLibrary();
  return (
    <>
      <h2>LIBRARY &raquo; <span className="zap">SONGS</span></h2>
      <p className="view-sub">{lib.length} tracks — everything you've played, burned, or been handed by the dj</p>
      {lib.length === 0
        ? <div className="empty-note">[ empty — go play something ]</div>
        : <TrackTable tracks={lib} />}
    </>
  );
}

export function Artists({ nav }) {
  const { collectLibrary } = useLibrary();
  const { searchArtistDirect } = useSearch();
  const lib = collectLibrary();
  const byArtist = {};
  lib.forEach((t) => { (byArtist[t.artist] = byArtist[t.artist] || []).push(t); });
  const names = Object.keys(byArtist).sort();
  return (
    <>
      <h2>LIBRARY &raquo; <span className="zap">ARTISTS</span></h2>
      <p className="view-sub">{names.length} artists in your library — click one to dig deeper</p>
      {names.length === 0
        ? <div className="empty-note">[ empty — go play something ]</div>
        : (
          <div className="pl-grid">
            {names.map((n) => (
              <button className="pl-card" key={n} onClick={() => { searchArtistDirect(n); nav('search'); }}>
                <div className="pl-name">{n}</div>
                <div className="pl-desc">{byArtist[n].length} track{byArtist[n].length === 1 ? '' : 's'} in library</div>
              </button>
            ))}
          </div>
        )}
    </>
  );
}

export function Albums() {
  const { collectLibrary } = useLibrary();
  const { play } = usePlayer();
  const lib = collectLibrary();
  const byAlbum = {};
  lib.forEach((t) => { if (t.album) (byAlbum[t.album] = byAlbum[t.album] || []).push(t); });
  const albums = Object.keys(byAlbum).sort();
  return (
    <>
      <h2>LIBRARY &raquo; <span className="zap">ALBUMS</span></h2>
      <p className="view-sub">{albums.length} albums touched by your library</p>
      {albums.length === 0
        ? <div className="empty-note">[ empty — go play something ]</div>
        : (
          <div className="cover-strip">
            {albums.map((a) => (
              <button className="cover" key={a} onClick={() => play(byAlbum[a], 0)}>
                <img src={byAlbum[a][0].art} alt="" loading="lazy" />
                <div className="c-name">{a}</div>
                <div className="c-artist">{byAlbum[a][0].artist}</div>
              </button>
            ))}
          </div>
        )}
    </>
  );
}

/* ---------------- playlists (editorial) ---------------- */

export function Playlists({ nav }) {
  return (
    <>
      <h2><span className="zap">PLAYLISTS</span></h2>
      <p className="view-sub">hand-built at spotify hq. allegedly by humans.</p>
      <div className="pl-grid">
        {EDITORIAL.map((p, i) => (
          <button className="pl-card" key={i} onClick={() => nav('pl:' + i)}>
            <div className="pl-name">{p.name}</div>
            <div className="pl-desc">{p.desc}</div>
          </button>
        ))}
      </div>
    </>
  );
}

export function PlaylistDetail({ index, nav }) {
  const pl = EDITORIAL[index];
  const { play } = usePlayer();
  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    if (!pl) return;
    let cancelled = false;
    setTracks(null);
    loadTermSet('pl_' + index, pl.terms, 1).then((t) => { if (!cancelled) setTracks(t); }).catch(() => { if (!cancelled) setTracks([]); });
    return () => { cancelled = true; };
  }, [index, pl]);

  if (!pl) { nav('playlists'); return null; }

  return (
    <>
      <h2><span className="zap">&#9835;</span> {pl.name.toUpperCase()}</h2>
      <p className="view-sub">
        {pl.desc} &middot;{' '}
        <button className="btn-row" onClick={() => tracks && tracks.length && play(tracks, 0)}>&#9654; PLAY ALL</button>{' '}
        <button className="btn-row" onClick={() => nav('playlists')}>&laquo; ALL PLAYLISTS</button>
      </p>
      {tracks === null ? <div className="loading">loading</div> : <TrackTable tracks={tracks} />}
    </>
  );
}

/* ---------------- mix cds ---------------- */

export function MixCds({ nav }) {
  const { mixes, deleteMix } = useLibrary();
  const { play } = usePlayer();
  const { openBurnDialog } = useDialogs();

  return (
    <>
      <h2>MY <span className="zap">MIX CDs</span></h2>
      <p className="view-sub">
        like burning CDs for your friends, minus the coaster-shaped failures &middot;{' '}
        <button className="btn-row pink" onClick={() => openBurnDialog(null)}>+ BURN NEW</button>
      </p>
      {mixes.length === 0
        ? <div className="empty-note">[ no mix cds yet — hit "+ BURN NEW" ]</div>
        : (
          <div className="mix-grid">
            {mixes.map((m, i) => (
              <div className="mix-card" key={i}>
                <div className="cd-disc"></div>
                <div className="mix-name">{m.name}</div>
                <div className="mix-count">{m.tracks.length} track{m.tracks.length === 1 ? '' : 's'}</div>
                <div className="mix-btns">
                  <button className="btn-row" onClick={() => nav('mix:' + i)}>OPEN</button>
                  <button className="btn-row" onClick={() => m.tracks.length && play(m.tracks, 0)}>&#9654;</button>
                  <button className="btn-row pink" onClick={() => {
                    if (confirm('Snap "' + m.name + '" in half? (this deletes it)')) deleteMix(i);
                  }}>&times;</button>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}

export function MixDetail({ index, nav }) {
  const { mixes, removeFromMix } = useLibrary();
  const { play } = usePlayer();
  const mix = mixes[index];

  if (!mix) { nav('mixcds'); return null; }

  return (
    <>
      <h2><span className="zap">&#9678;</span> {mix.name.toUpperCase()}</h2>
      <p className="view-sub">
        {mix.tracks.length} tracks &middot;{' '}
        <button className="btn-row" onClick={() => mix.tracks.length && play(mix.tracks, 0)}>&#9654; PLAY ALL</button>{' '}
        <button className="btn-row" onClick={() => nav('mixcds')}>&laquo; ALL CDs</button>
      </p>
      {mix.tracks.length === 0
        ? <div className="empty-note">[ empty CD — add songs via "+CD" on any track ]</div>
        : <TrackTable tracks={mix.tracks} removable onRemove={(ti) => removeFromMix(index, ti)} />}
    </>
  );
}

/* ---------------- radio ---------------- */

export function Radio() {
  const { play, toggleShuffle, shuffle } = usePlayer();
  const setStatus = useAppStore((s) => s.setStatus);
  const { observe } = useDJ();

  async function tuneStation(st) {
    setStatus('tuning ' + st.freq + ' FM...');
    observe(['tuning ' + st.freq.toLowerCase() + ' fm...']);
    try {
      const picks = shuffleArr(st.artists).slice(0, 3);
      const results = await Promise.all(picks.map((a) => searchTracks(a, 8).catch(() => [])));
      const tracks = shuffleArr(dedupe(results.flat()));
      if (!tracks.length) { observe(['static.', 'try another station.']); return; }
      if (!shuffle) toggleShuffle();
      play(tracks, 0);
      observe(['station tuned.', "i'll keep it coming."]);
    } catch {
      observe(['static.', 'try another station.']);
    }
  }

  return (
    <>
      <h2><span className="zap">RADIO</span></h2>
      <p className="view-sub">six stations. zero ads. the fcc can't touch us here.</p>
      <div className="radio-grid">
        {STATIONS.map((s) => (
          <div className="station" key={s.freq}>
            <div className="st-freq">{s.freq} FM</div>
            <div className="st-name">{s.name}</div>
            <div className="st-artists">{s.artists.slice(0, 3).join(' · ')}...</div>
            <button className="btn-row" onClick={() => tuneStation(s)}>&#9654; TUNE IN</button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- downloads (a joke, period-accurate) ---------------- */

export function Downloads() {
  return (
    <>
      <h2><span className="zap">DOWNLOADS</span></h2>
      <p className="view-sub">manage your downloaded music files</p>
      <div className="dl-box">
        0 files. 0 bytes. <span className="zap">0 viruses.</span><br /><br />
        why download when you can stream?<br />
        limewire.exe not found — you don't need it anymore.<br /><br />
        welcome to the future.
      </div>
    </>
  );
}
