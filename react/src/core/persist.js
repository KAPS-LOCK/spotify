export const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
};

export const CACHE_TTL = 6 * 60 * 60 * 1000; // curated content refreshes every 6h

export async function cachedTracks(key, loader) {
  const cache = store.get('sp06_cache', {});
  if (cache[key] && Date.now() - cache[key].t < CACHE_TTL) return cache[key].v;
  const v = await loader();
  cache[key] = { t: Date.now(), v };
  store.set('sp06_cache', cache);
  return v;
}

export function cacheSizeKb() {
  const cache = localStorage.getItem('sp06_cache') || '';
  return Math.round(new Blob([cache]).size / 1024);
}
