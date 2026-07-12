import { create } from 'zustand';
import {
  searchTracks, searchAlbumsApi, searchArtistsApi, albumTracksApi,
  dedupe,
} from './api';
import { store, cachedTracks } from './persist';
import { feedTime } from './fmt';
import { MOODS, AMBIENT, EGGS, STATUS_IDLE, STATUS_PLAY, PROCESS_STEPS, TREND_SEED } from './data';
import { djReply } from './groq';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let uid = 0;
const cuid = () => 'id' + Date.now().toString(36) + (uid++).toString(36);

export const audio = typeof Audio !== 'undefined' ? new Audio() : null;
if (audio) {
  audio.preload = 'auto';
  audio.volume = 0.8;
}

/* ---- DJ "brain" mutable meta — doesn't need to be reactive on its own ---- */
const buddyMeta = {
  lastTrackId: null, lastGenre: '', loopStreak: 0, skipTimes: [],
  lastAmbient: 0, saidLateNight: false, saidLongSession: false,
  sessionStart: null, gemsSeen: new Set(),
};

function pushObserve(set, get, lines, opts = {}) {
  const entry = { id: cuid(), time: feedTime(), lines, actions: opts.actions || null };
  set((s) => ({ feed: [...s.feed, entry].slice(-40), syncedAt: feedTime() }));
  return entry;
}

async function djProcessTheater(set) {
  const id = cuid();
  set((s) => ({ feed: [...s.feed, { id, time: feedTime(), lines: [PROCESS_STEPS[0]], pending: true }] }));
  for (const step of PROCESS_STEPS) {
    set((s) => ({ feed: s.feed.map((e) => (e.id === id ? { ...e, lines: [step] } : e)) }));
    await sleep(230 + Math.random() * 160);
  }
  set((s) => ({ feed: s.feed.map((e) => (e.id === id ? { ...e, lines: ['done.'] } : e)) }));
  await sleep(300);
  set((s) => ({ feed: s.feed.filter((e) => e.id !== id) }));
}

async function djBoot(set, get) {
  await sleep(1000);
  pushObserve(set, get, ['yo.']);
  await sleep(2600);
  set({ status: '♫ digging through crates' });
  pushObserve(set, get, ['currently digging through', 'your library...']);
  await sleep(9000 + Math.random() * 5000);
  const lib = get().collectLibrary();
  const genres = {};
  lib.forEach((t) => { if (t.genre) genres[t.genre] = (genres[t.genre] || 0) + 1; });
  const top = Object.entries(genres).sort((a, b) => b[1] - a[1]).map((e) => e[0].toLowerCase());
  if (top.length >= 2) {
    pushObserve(set, get, ['huh.', "you've been bouncing between", top[0] + ' and ' + top[1] + ' lately.']);
  } else if (lib.length) {
    pushObserve(set, get, ['solid collection.', 'small. but solid.']);
  } else {
    pushObserve(set, get, ["library's empty.", "play something. i'll wait."]);
  }
  set({ status: '♫ listening...' });
}

function buddyOnPlay(t, set, get) {
  if (!buddyMeta.sessionStart) buddyMeta.sessionStart = Date.now();

  if (t.id === buddyMeta.lastTrackId) {
    buddyMeta.loopStreak++;
    if (buddyMeta.loopStreak === 2) { pushObserve(set, get, ['again?', 'respect.']); return; }
  } else {
    buddyMeta.loopStreak = 1;
    buddyMeta.lastTrackId = t.id;
  }

  const counts = store.get('sp06_playcounts', {});
  counts[t.id] = (counts[t.id] || 0) + 1;
  store.set('sp06_playcounts', counts);
  if (counts[t.id] === 5) { pushObserve(set, get, ['fifth time.', 'still not tired of it?']); return; }
  if (counts[t.id] === 17) {
    pushObserve(set, get, ["you've played", '"' + t.name.toLowerCase() + '" 17 times.', 'rough week?']);
    return;
  }

  if (get().gemIds.has(t.id) && !buddyMeta.gemsSeen.has(t.id)) {
    buddyMeta.gemsSeen.add(t.id);
    pushObserve(set, get, ['this one never got the attention it deserved.', 'good find.']);
    return;
  }

  const h = new Date().getHours();
  if (!buddyMeta.saidLateNight && h >= 0 && h < 5) {
    buddyMeta.saidLateNight = true;
    pushObserve(set, get, ['late one tonight.']);
    return;
  }

  if (!buddyMeta.saidLongSession && Date.now() - buddyMeta.sessionStart > 30 * 60 * 1000) {
    buddyMeta.saidLongSession = true;
    pushObserve(set, get, ["we've been at this a while.", 'no complaints.']);
    return;
  }

  if (buddyMeta.lastGenre && t.genre && t.genre !== buddyMeta.lastGenre
      && Date.now() - buddyMeta.lastAmbient > 120000 && Math.random() < 0.4) {
    buddyMeta.lastGenre = t.genre;
    buddyMeta.lastAmbient = Date.now();
    pushObserve(set, get, ['switching gears.', 'ok. i see you.']);
    return;
  }
  if (t.genre) buddyMeta.lastGenre = t.genre;

  if (Date.now() - buddyMeta.lastAmbient > 120000 && Math.random() < 0.22) {
    buddyMeta.lastAmbient = Date.now();
    pushObserve(set, get, AMBIENT[Math.floor(Math.random() * AMBIENT.length)]);
  }
}

function buddyOnSkip(set, get) {
  const now = Date.now();
  buddyMeta.skipTimes = buddyMeta.skipTimes.filter((ts) => now - ts < 30000);
  buddyMeta.skipTimes.push(now);
  if (buddyMeta.skipTimes.length >= 5) {
    buddyMeta.skipTimes = [];
    pushObserve(set, get, ['alright...', 'tough crowd today.']);
  }
}

export const useAppStore = create((set, get) => ({
  /* ---------------- player ---------------- */
  queue: [],
  idx: -1,
  shuffle: false,
  repeat: false,
  isPlaying: false,
  currentTime: 0,
  duration: NaN,
  volume: 0.8,
  session: [],
  gemIds: new Set(),
  albumCache: {},
  statusMessage: 'ready.',

  setStatus: (msg) => set({ statusMessage: msg }),

  playQueue: (tracks, startIdx) => {
    set({ queue: tracks.slice(), idx: startIdx });
    get().playCurrent();
  },
  playCurrent: () => {
    const { queue, idx } = get();
    const t = queue[idx];
    if (!t || !audio) return;
    audio.src = t.preview;
    audio.play().catch(() => get().setStatus('click PLAY to start audio.'));
    set((s) => ({ session: [...s.session, t].slice(-50) }));
    get().addRecent(t);
    get().setStatus('now playing: ' + t.name);
    buddyOnPlay(t, set, get);
  },
  toggle: () => {
    if (!audio || !audio.src) return;
    audio.paused ? audio.play() : audio.pause();
  },
  next: (manual = false) => {
    const { queue, idx, shuffle, repeat } = get();
    if (!queue.length) return;
    if (manual) buddyOnSkip(set, get);
    let newIdx;
    if (shuffle && queue.length > 1) {
      do { newIdx = Math.floor(Math.random() * queue.length); } while (newIdx === idx);
    } else if (!manual && !repeat && idx === queue.length - 1) {
      get().setStatus('end of queue. repeat is off.');
      return;
    } else {
      newIdx = (idx + 1) % queue.length;
    }
    set({ idx: newIdx });
    get().playCurrent();
  },
  prev: () => {
    const { queue, idx } = get();
    if (!queue.length || !audio) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    set({ idx: (idx - 1 + queue.length) % queue.length });
    get().playCurrent();
  },
  seek: (seconds) => { if (audio && isFinite(audio.duration)) audio.currentTime = seconds; },
  setVolume: (v) => { if (audio) audio.volume = v; set({ volume: v }); },
  toggleShuffle: () => set((s) => {
    const shuffle = !s.shuffle;
    get().setStatus('shuffle ' + (shuffle ? 'ON — chaos mode' : 'off'));
    return { shuffle };
  }),
  toggleRepeat: () => set((s) => {
    const repeat = !s.repeat;
    get().setStatus('repeat ' + (repeat ? 'ON — round and round' : 'off'));
    return { repeat };
  }),
  addGemIds: (ids) => set((s) => {
    const gemIds = new Set(s.gemIds);
    ids.forEach((id) => gemIds.add(id));
    return { gemIds };
  }),

  queueJump: (i) => { set({ idx: i }); get().playCurrent(); },
  queueMoveUp: (i) => {
    if (i <= 0) return;
    const queue = get().queue.slice();
    [queue[i - 1], queue[i]] = [queue[i], queue[i - 1]];
    let idx = get().idx;
    if (idx === i) idx = i - 1; else if (idx === i - 1) idx = i;
    set({ queue, idx });
  },
  queueRemove: (i) => {
    const queue = get().queue.slice();
    queue.splice(i, 1);
    let idx = get().idx;
    if (i < idx) idx--; else if (idx >= queue.length) idx = queue.length - 1;
    set({ queue, idx });
  },
  queueClear: () => {
    const { queue, idx } = get();
    const cur = queue[idx];
    set({ queue: cur ? [cur] : [], idx: cur ? 0 : -1 });
    get().setStatus('queue cleared.');
  },

  /* ---------------- library ---------------- */
  likes: store.get('sp06_likes', []),
  mixes: store.get('sp06_mixes', []),
  recent: store.get('sp06_recent', []),

  addRecent: (t) => {
    const recent = [t, ...get().recent.filter((r) => r.id !== t.id)].slice(0, 12);
    store.set('sp06_recent', recent);
    set({ recent });
  },
  toggleLike: (t) => {
    const likes = get().likes;
    let next;
    if (likes.some((x) => x.id === t.id)) {
      next = likes.filter((x) => x.id !== t.id);
      get().setStatus('removed from liked songs.');
    } else {
      next = [t, ...likes];
      get().setStatus('liked. good taste.');
    }
    store.set('sp06_likes', next);
    set({ likes: next });
  },
  burnMix: (name, tracks) => {
    const mixes = get().mixes.concat([{ name, tracks }]);
    store.set('sp06_mixes', mixes);
    set({ mixes });
    return mixes.length - 1;
  },
  burnMixFromDJ: (name, tracks) => {
    get().burnMix(name, tracks);
    pushObserve(set, get, ['burned.', '"' + name + '" is on the shelf.', "don't scratch it."]);
  },
  addToMix: (mixIndex, track) => {
    const mixes = get().mixes.map((m) => ({ ...m, tracks: m.tracks.slice() }));
    const mix = mixes[mixIndex];
    if (!mix) return false;
    if (mix.tracks.some((t) => t.id === track.id)) { get().setStatus('already on that CD!'); return false; }
    mix.tracks.push(track);
    store.set('sp06_mixes', mixes);
    set({ mixes });
    get().setStatus('added to "' + mix.name + '".');
    return true;
  },
  removeFromMix: (mixIndex, trackIndex) => {
    const mixes = get().mixes.map((m) => ({ ...m, tracks: m.tracks.slice() }));
    mixes[mixIndex].tracks.splice(trackIndex, 1);
    store.set('sp06_mixes', mixes);
    set({ mixes });
  },
  deleteMix: (mixIndex) => {
    const mixes = get().mixes.slice();
    mixes.splice(mixIndex, 1);
    store.set('sp06_mixes', mixes);
    set({ mixes });
  },
  collectLibrary: () => {
    const { recent, mixes, found } = get();
    const mixTracks = mixes.flatMap((m) => m.tracks);
    return dedupe([...recent, ...mixTracks, ...found]);
  },

  /* ---------------- search ---------------- */
  query: '',
  results: [],
  filter: 'all',
  albums: null,
  artists: null,

  search: async (term) => {
    set({ query: term, filter: 'all', albums: null, artists: null });
    get().setStatus('searching for "' + term + '"...');
    if (/\bparty\b/i.test(term)) pushObserve(set, get, ['say less.']);
    try {
      const results = await searchTracks(term);
      set({ results });
      get().setStatus(results.length + ' results.');
    } catch {
      set({ results: [] });
      get().setStatus('search failed — modem trouble?');
    }
  },
  searchArtistDirect: async (name) => {
    set({ query: name, filter: 'songs' });
    get().setStatus('loading ' + name + '...');
    try { set({ results: await searchTracks(name) }); } catch { set({ results: [] }); }
  },
  setFilter: (f) => set({ filter: f }),
  loadAlbums: async () => {
    if (get().albums) return get().albums;
    try { const albums = await searchAlbumsApi(get().query); set({ albums }); return albums; }
    catch { set({ albums: [] }); return []; }
  },
  loadArtists: async () => {
    if (get().artists) return get().artists;
    try { const artists = await searchArtistsApi(get().query); set({ artists }); return artists; }
    catch { set({ artists: [] }); return []; }
  },
  getAlbumTracks: async (albumId) => {
    const cache = get().albumCache;
    if (cache[albumId]) return cache[albumId];
    const tracks = await albumTracksApi(albumId);
    set((s) => ({ albumCache: { ...s.albumCache, [albumId]: tracks } }));
    return tracks;
  },

  /* ---------------- dj ---------------- */
  feed: [],
  status: '♫ listening...',
  found: [],
  chatLog: [],
  djBusy: false,
  trending: null,
  syncedAt: null,

  addFound: (tracks) => set((s) => ({ found: dedupe([...tracks, ...s.found]).slice(0, 8) })),
  pushFeed: (lines, opts) => pushObserve(set, get, lines, opts),

  loadTrending: async () => {
    if (get().trending) return get().trending;
    try {
      const tracks = await cachedTracks('trending', async () => {
        const r = await Promise.all(TREND_SEED.map((s) => searchTracks(s.term, 1).catch(() => [])));
        return r.map((a) => a[0] || null);
      });
      const rows = tracks.map((t, i) => (t ? { track: t, up: TREND_SEED[i].up } : null)).filter(Boolean);
      set({ trending: rows });
      return rows;
    } catch { set({ trending: [] }); return []; }
  },

  quickMix: async (key) => {
    const mood = MOODS.find((m) => m.keys.includes(key));
    if (!mood || get().djBusy) return;
    set({ djBusy: true, status: '♫ building mix' });
    await djProcessTheater(set);
    try {
      const results = await Promise.all(mood.terms.map((t) => searchTracks(t, 2).catch(() => [])));
      const tracks = dedupe(results.flat()).slice(0, 8);
      if (!tracks.length) { pushObserve(set, get, ['crates came up empty.', 'try again in a sec.']); return; }
      get().playQueue(tracks, 0);
      get().addFound(tracks.slice(0, 3));
      pushObserve(set, get, [...mood.reply, 'playing now.'], {
        actions: [{ label: '● BURN TO CD', pink: true, fn: () => get().burnMixFromDJ(mood.name, tracks) }],
      });
    } catch {
      pushObserve(set, get, ['modem dropped.', 'try again.']);
    } finally {
      set({ djBusy: false, status: '♫ on air' });
    }
  },

  buildMix: async () => {
    if (get().djBusy) return { ok: false };
    const session = dedupe(get().session);
    if (!session.length) {
      pushObserve(set, get, ['play something first.', "then i'll know what today sounds like."]);
      return { ok: false };
    }
    set({ djBusy: true, status: '♫ building mix' });
    pushObserve(set, get, ['reading the session...']);
    await djProcessTheater(set);
    const freq = {};
    session.forEach((t) => { freq[t.artist] = (freq[t.artist] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3).map((e) => e[0]);
    let ok = false;
    try {
      const fetched = (await Promise.all(top.map((a) => searchTracks(a, 5).catch(() => [])))).flat();
      const known = new Set(session.map((t) => t.id));
      const fresh = dedupe(fetched).filter((t) => !known.has(t.id));
      const tracks = dedupe([...session.slice(-4), ...fresh]).slice(0, 10);
      if (tracks.length) {
        get().playQueue(tracks, 0);
        get().addFound(fresh.slice(0, 3));
        pushObserve(set, get, ['done.', 'this is what today sounded like.'], {
          actions: [{ label: '● BURN TO CD', pink: true, fn: () => get().burnMixFromDJ("today's session", tracks) }],
        });
        ok = true;
      }
    } catch { /* modem trouble */ }
    set({ djBusy: false, status: '♫ on air' });
    return { ok };
  },

  sendChat: async (text) => {
    const userMsg = { id: cuid(), who: 'me', lines: [text], cls: 'me', time: feedTime() };
    set((s) => ({ chatLog: [...s.chatLog, userMsg] }));

    const egg = EGGS.find((e) => e.re.test(text));
    if (egg) {
      await sleep(700);
      set((s) => ({ chatLog: [...s.chatLog, { id: cuid(), who: 'DJ_Sp1n', lines: egg.lines, cls: 'bot', time: feedTime() }] }));
      return;
    }

    const lower = text.toLowerCase();
    const mood = MOODS.find((m) => m.keys.some((k) => lower.includes(k)));
    let mixName, fetchPromise;
    if (mood) {
      mixName = mood.name;
      fetchPromise = Promise.all(mood.terms.map((t) => searchTracks(t, 2).catch(() => [])))
        .then((r) => dedupe(r.flat()).slice(0, 8));
    } else {
      mixName = text.slice(0, 24) + ' mix';
      fetchPromise = searchTracks(text, 8);
    }

    const history = get().chatLog
      .filter((m) => m.who === 'me' || m.who === 'DJ_Sp1n')
      .slice(-8)
      .map((m) => ({ role: m.who === 'me' ? 'user' : 'assistant', content: m.lines.join(' ') }));
    const fallback = mood ? mood.reply : ['hm.', 'digging for that the old-fashioned way...'];
    const reply = await djReply(history, text)
      .then((r) => (r ? r.split('\n').map((l) => l.trim()).filter(Boolean) : fallback))
      .catch(() => fallback);
    set((s) => ({ chatLog: [...s.chatLog, { id: cuid(), who: 'DJ_Sp1n', lines: reply, cls: 'bot', time: feedTime() }] }));

    const typingId = cuid();
    set((s) => ({ chatLog: [...s.chatLog, { id: typingId, who: 'DJ_Sp1n', lines: [PROCESS_STEPS[0]], cls: 'bot typing' }] }));
    for (const step of PROCESS_STEPS) {
      set((s) => ({ chatLog: s.chatLog.map((m) => (m.id === typingId ? { ...m, lines: [step] } : m)) }));
      await sleep(300 + Math.random() * 200);
    }
    try {
      const tracks = await fetchPromise;
      set((s) => ({ chatLog: s.chatLog.filter((m) => m.id !== typingId) }));
      if (!tracks.length) {
        const emptyFallback = ['crates came up empty.', 'try different words?'];
        const emptyReply = await djReply(history, '(the crate search for "' + text + '" came up empty. tell the user, in your voice, 1 line.)')
          .then((r) => (r ? r.split('\n').map((l) => l.trim()).filter(Boolean) : emptyFallback))
          .catch(() => emptyFallback);
        set((s) => ({ chatLog: [...s.chatLog, { id: cuid(), who: 'DJ_Sp1n', lines: emptyReply, cls: 'bot', time: feedTime() }] }));
        return;
      }
      const trackList = tracks.slice(0, 5).map((t) => t.name + ' by ' + t.artist).join(', ');
      const revealFallback = ['got something.', 'trust me.'];
      const revealReply = await djReply(history, '(you just pulled these for the mix: ' + trackList + '. tell the user you found it, in your voice, 1-2 lines. do not list the tracks back, they can already see them.)')
        .then((r) => (r ? r.split('\n').map((l) => l.trim()).filter(Boolean) : revealFallback))
        .catch(() => revealFallback);
      set((s) => ({ chatLog: [...s.chatLog, {
        id: cuid(), who: 'DJ_Sp1n', lines: revealReply, cls: 'bot', tracks, mixName, time: feedTime(),
      }] }));
      get().addFound(tracks.slice(0, 3));
    } catch {
      set((s) => ({ chatLog: s.chatLog.filter((m) => m.id !== typingId) }));
      set((s) => ({ chatLog: [...s.chatLog, { id: cuid(), who: 'DJ_Sp1n', lines: ['modem dropped.', 'try again in a sec.'], cls: 'bot', time: feedTime() }] }));
    }
  },

  /* ---- boot the DJ's ambient life; idempotent, call once from App root ---- */
  startDjLife: () => {
    if (get()._djLifeStarted) return;
    set({ _djLifeStarted: true });
    djBoot(set, get);

    (function statusLoop() {
      const delay = 14000 + Math.random() * 16000;
      setTimeout(() => {
        if (!get().djBusy) {
          const pool = (!audio || audio.paused || !audio.src) ? STATUS_IDLE : STATUS_PLAY;
          set({ status: pool[Math.floor(Math.random() * pool.length)] });
        }
        statusLoop();
      }, delay);
    })();

    let lastLife = Date.now();
    setInterval(async () => {
      if (!audio || audio.paused || !audio.src) return;
      if (Date.now() - lastLife < 200000) return;
      if (Math.random() < 0.45) return;
      lastLife = Date.now();
      const { queue, idx } = get();
      const cur = queue[idx];
      const roll = Math.random();
      try {
        if (roll < 0.3 && cur) {
          set({ status: '♫ digging through crates' });
          const dug = (await searchTracks(cur.artist, 6)).filter((t) => t.id !== cur.id && !get().queue.some((q) => q.id === t.id));
          if (dug.length) {
            get().addFound([dug[Math.floor(Math.random() * dug.length)]]);
            pushObserve(set, get, ['found another one.']);
          }
          set({ status: '♫ on air' });
        } else if (roll < 0.55 && cur) {
          set({ status: '♫ matching bpm' });
          const more = (await searchTracks(cur.artist, 8)).filter((t) => t.id !== cur.id && !get().queue.some((q) => q.id === t.id));
          if (more.length) {
            const pick = more[Math.floor(Math.random() * more.length)];
            set((s) => ({ queue: [...s.queue, pick] }));
            get().addFound([pick]);
            pushObserve(set, get, ['queued something', 'you might like.']);
          }
          set({ status: '♫ on air' });
        } else {
          pushObserve(set, get, AMBIENT[Math.floor(Math.random() * AMBIENT.length)]);
        }
      } catch { /* crates were locked */ }
    }, 45000);
  },
}));

if (audio) {
  audio.addEventListener('ended', () => useAppStore.getState().next(false));
  audio.addEventListener('play', () => useAppStore.setState({ isPlaying: true }));
  audio.addEventListener('pause', () => useAppStore.setState({ isPlaying: false }));
  audio.addEventListener('timeupdate', () => {
    useAppStore.setState({ currentTime: audio.currentTime, duration: audio.duration });
  });
}
