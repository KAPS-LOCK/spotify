import { searchTracks, dedupe } from './api';
import { cachedTracks } from './persist';

export function loadTermSet(key, terms, per = 1) {
  return cachedTracks(key, () =>
    Promise.all(terms.map((t) => searchTracks(t, per).catch(() => [])))
      .then((r) => dedupe(r.flat())));
}
