import { useMemo, useState } from 'react';
import { usePlayer, useLibrary } from '../../core/hooks';
import { fmtTime } from '../../core/fmt';
import { useDialogs } from './DialogContext';

const SORT_KEYS = {
  name: (t) => (t.name || '').toLowerCase(),
  artist: (t) => (t.artist || '').toLowerCase(),
  album: (t) => (t.album || '').toLowerCase(),
  time: (t) => t.ms || 0,
};

export function TrackTable({ tracks, removable = false, onRemove }) {
  const { queue, idx, play } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();
  const { promptAddToMix } = useDialogs();
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [selected, setSelected] = useState(null);

  const current = queue[idx];

  const sorted = useMemo(() => {
    if (!sortCol) return tracks;
    const key = SORT_KEYS[sortCol];
    return tracks.slice().sort((a, b) => {
      const av = key(a), bv = key(b);
      if (av < bv) return -sortDir;
      if (av > bv) return sortDir;
      return 0;
    });
  }, [tracks, sortCol, sortDir]);

  function handleSort(col) {
    if (sortCol === col) setSortDir((d) => -d);
    else { setSortCol(col); setSortDir(1); }
  }

  function th(col, label, alignRight) {
    const sorted_ = sortCol === col;
    return (
      <th data-sort={col} style={alignRight ? { textAlign: 'right' } : undefined}
        className={sorted_ ? 'sorted' + (sortDir === -1 ? ' sort-desc' : '') : ''}
        onClick={() => handleSort(col)}>
        {label}<i className="sort-arrow"></i>
      </th>
    );
  }

  return (
    <table className="track-table">
      <thead>
        <tr>
          <th></th>
          {th('name', 'SONG')}
          {th('artist', 'ARTIST')}
          {th('album', 'ALBUM')}
          {th('time', 'TIME', true)}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((t, i) => (
          <tr key={t.id + '-' + i}
            className={[
              current && current.id === t.id ? 'playing' : '',
              selected === i ? 'selected' : '',
            ].filter(Boolean).join(' ')}
            onClick={(e) => { if (!e.target.closest('button')) setSelected(i); }}
            onDoubleClick={(e) => { if (!e.target.closest('button')) play(sorted, i); }}>
            <td className="t-art"><img src={t.art} alt="" loading="lazy" /></td>
            <td className="t-name">
              {current && current.id === t.id && (
                <span className="mini-viz" aria-hidden="true"><i></i><i></i><i></i></span>
              )}
              {t.name}
            </td>
            <td className="t-artist">{t.artist}</td>
            <td className="t-album">{t.album}</td>
            <td className="t-time">{fmtTime(t.ms / 1000)}</td>
            <td className="t-actions">
              <button className="btn-row" onClick={(e) => { e.stopPropagation(); play(sorted, i); }}>&#9654;</button>
              <button className={'btn-row heart' + (isLiked(t.id) ? ' on' : '')} title="Like"
                onClick={(e) => { e.stopPropagation(); toggleLike(t); }}>&hearts;</button>
              {removable
                ? <button className="btn-row pink" title="Remove" onClick={(e) => { e.stopPropagation(); onRemove?.(i); }}>&times;</button>
                : <button className="btn-row pink" title="Add to a Mix CD" onClick={(e) => { e.stopPropagation(); promptAddToMix(t); }}>+CD</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
