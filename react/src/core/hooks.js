import { useEffect } from 'react';
import { useAppStore } from './store';

export function usePlayer() {
  const queue = useAppStore((s) => s.queue);
  const idx = useAppStore((s) => s.idx);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const currentTime = useAppStore((s) => s.currentTime);
  const duration = useAppStore((s) => s.duration);
  const shuffle = useAppStore((s) => s.shuffle);
  const repeat = useAppStore((s) => s.repeat);
  const volume = useAppStore((s) => s.volume);
  const play = useAppStore((s) => s.playQueue);
  const toggle = useAppStore((s) => s.toggle);
  const next = useAppStore((s) => s.next);
  const prev = useAppStore((s) => s.prev);
  const seek = useAppStore((s) => s.seek);
  const setVolume = useAppStore((s) => s.setVolume);
  const toggleShuffle = useAppStore((s) => s.toggleShuffle);
  const toggleRepeat = useAppStore((s) => s.toggleRepeat);

  return {
    current: queue[idx] || null,
    queue, idx, isPlaying, currentTime, duration, shuffle, repeat, volume,
    play, toggle, next, prev, seek, setVolume, toggleShuffle, toggleRepeat,
  };
}

export function useQueue() {
  const queue = useAppStore((s) => s.queue);
  const idx = useAppStore((s) => s.idx);
  const jump = useAppStore((s) => s.queueJump);
  const moveUp = useAppStore((s) => s.queueMoveUp);
  const remove = useAppStore((s) => s.queueRemove);
  const clear = useAppStore((s) => s.queueClear);
  return { queue, idx, jump, moveUp, remove, clear };
}

export function useLibrary() {
  const likes = useAppStore((s) => s.likes);
  const mixes = useAppStore((s) => s.mixes);
  const recent = useAppStore((s) => s.recent);
  const toggleLike = useAppStore((s) => s.toggleLike);
  const burnMix = useAppStore((s) => s.burnMix);
  const addToMix = useAppStore((s) => s.addToMix);
  const removeFromMix = useAppStore((s) => s.removeFromMix);
  const deleteMix = useAppStore((s) => s.deleteMix);
  const collectLibrary = useAppStore((s) => s.collectLibrary);

  return {
    likes,
    isLiked: (id) => likes.some((t) => t.id === id),
    toggleLike,
    mixes,
    burnMix,
    addToMix,
    removeFromMix,
    deleteMix,
    recent,
    collectLibrary,
  };
}

export function useSearch() {
  const query = useAppStore((s) => s.query);
  const results = useAppStore((s) => s.results);
  const filter = useAppStore((s) => s.filter);
  const albums = useAppStore((s) => s.albums);
  const artists = useAppStore((s) => s.artists);
  const setFilter = useAppStore((s) => s.setFilter);
  const search = useAppStore((s) => s.search);
  const searchArtistDirect = useAppStore((s) => s.searchArtistDirect);
  const loadAlbums = useAppStore((s) => s.loadAlbums);
  const loadArtists = useAppStore((s) => s.loadArtists);
  const getAlbumTracks = useAppStore((s) => s.getAlbumTracks);

  return {
    query, results, filter, albums, artists,
    setFilter, search, searchArtistDirect, loadAlbums, loadArtists,
    albumTracks: getAlbumTracks,
  };
}

export function useDJ() {
  const feed = useAppStore((s) => s.feed);
  const status = useAppStore((s) => s.status);
  const found = useAppStore((s) => s.found);
  const trending = useAppStore((s) => s.trending);
  const chatLog = useAppStore((s) => s.chatLog);
  const djBusy = useAppStore((s) => s.djBusy);
  const syncedAt = useAppStore((s) => s.syncedAt);
  const sendChat = useAppStore((s) => s.sendChat);
  const quickMix = useAppStore((s) => s.quickMix);
  const buildMix = useAppStore((s) => s.buildMix);
  const loadTrending = useAppStore((s) => s.loadTrending);
  const startDjLife = useAppStore((s) => s.startDjLife);
  const addGemIds = useAppStore((s) => s.addGemIds);
  const observe = useAppStore((s) => s.pushFeed);

  // boot the DJ's ambient life exactly once, wherever a theme first mounts the console
  useEffect(() => { startDjLife(); }, [startDjLife]);

  return {
    feed, status, found, trending, chatLog, busy: djBusy, syncedAt,
    sendChat, quickMix, buildMix, loadTrending, addGemIds, observe,
  };
}

export function useStatusBar() {
  const message = useAppStore((s) => s.statusMessage);
  const collectLibrary = useAppStore((s) => s.collectLibrary);
  return { message, collectLibrary };
}
