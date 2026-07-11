import { usePlayer } from '../../core/hooks';

export function CoverGrid({ tracks, ranked = false }) {
  const { play } = usePlayer();
  if (!tracks.length) return <div className="empty-note">nothing here.</div>;
  return (
    <div className="cover-strip">
      {tracks.map((t, i) => (
        <button className="cover" key={t.id + '-' + i} onClick={() => play(tracks, i)}>
          {ranked && <span className="chart-rank">#{i + 1}</span>}
          <img src={t.art} alt="" loading="lazy" />
          <div className="c-name">{t.name}</div>
          <div className="c-artist">{t.artist}</div>
        </button>
      ))}
    </div>
  );
}
