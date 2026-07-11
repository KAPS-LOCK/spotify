export function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = 'itunes_cb_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const timer = setTimeout(() => fail(new Error('timeout')), 10000);
    function cleanup() {
      clearTimeout(timer);
      delete window[cb];
      script.remove();
    }
    function fail(err) { cleanup(); reject(err); }
    window[cb] = (data) => { cleanup(); resolve(data); };
    script.onerror = () => fail(new Error('network error'));
    script.src = url + '&callback=' + cb;
    document.head.appendChild(script);
  });
}

export function normalizeTrack(r) {
  return {
    id: r.trackId,
    name: r.trackName,
    artist: r.artistName,
    album: r.collectionName || '',
    art: (r.artworkUrl100 || '').replace('100x100', '300x300'),
    preview: r.previewUrl,
    ms: r.trackTimeMillis || 30000,
    genre: r.primaryGenreName || '',
  };
}

export async function searchTracks(term, limit = 25) {
  const url = 'https://itunes.apple.com/search?media=music&entity=song'
    + '&limit=' + limit + '&term=' + encodeURIComponent(term);
  const data = await jsonp(url);
  return (data.results || []).filter(r => r.previewUrl).map(normalizeTrack);
}

export async function searchAlbumsApi(term) {
  const url = 'https://itunes.apple.com/search?media=music&entity=album'
    + '&limit=12&term=' + encodeURIComponent(term);
  const data = await jsonp(url);
  return (data.results || []).map(r => ({
    id: r.collectionId,
    name: r.collectionName,
    artist: r.artistName,
    art: (r.artworkUrl100 || '').replace('100x100', '300x300'),
    count: r.trackCount,
    year: (r.releaseDate || '').slice(0, 4),
  }));
}

export async function searchArtistsApi(term) {
  const url = 'https://itunes.apple.com/search?media=music&entity=musicArtist'
    + '&limit=12&term=' + encodeURIComponent(term);
  const data = await jsonp(url);
  return (data.results || []).map(r => ({
    name: r.artistName,
    genre: r.primaryGenreName || 'music',
  }));
}

export async function albumTracksApi(albumId) {
  const data = await jsonp('https://itunes.apple.com/lookup?id=' + albumId + '&entity=song&limit=30');
  return (data.results || [])
    .filter(r => r.wrapperType === 'track' && r.previewUrl)
    .map(normalizeTrack);
}

export function dedupe(tracks) {
  const seen = new Set();
  return tracks.filter(t => !seen.has(t.id) && seen.add(t.id));
}

export function shuffleArr(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
