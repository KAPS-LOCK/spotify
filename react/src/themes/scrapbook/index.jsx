import { Link } from 'react-router-dom';
import { usePlayer } from '../../core/hooks';
import './scrapbook.css';

export default function ThemeApp() {
  const { current, isPlaying, toggle } = usePlayer();

  return (
    <div className="theme-scrapbook-stub">
      <div className="scrap-tape scrap-tape-l">SCOTCH</div>
      <div className="scrap-tape scrap-tape-r">SCOTCH</div>
      <div className="scrap-stub-card">
        <div className="scrap-stub-banner">*** UNDER CONSTRUCTION ***</div>
        <h1>MySpace Scrapbook</h1>
        <p className="scrap-stub-credit">built by Pratima</p>
        <p className="scrap-stub-note">
          Collage layout, glitter gifs, comic sans, sticker chaos, "Top 8"
          energy. Coming soon — see <code>THEME-GUIDE.md</code> in this
          folder for the hooks this theme has access to.
        </p>

        <div className="scrap-stub-now-playing">
          <div className="scrap-stub-label">now playing (shared player state)</div>
          {current
            ? <div className="scrap-stub-track">♪ {current.name} — {current.artist}</div>
            : <div className="scrap-stub-track dim">nothing yet</div>}
          {current && (
            <button className="scrap-stub-btn" onClick={toggle}>{isPlaying ? 'pause plz' : 'play!!'}</button>
          )}
        </div>

        <Link to="/" className="scrap-stub-back">&larr; back to theme select</Link>
      </div>
    </div>
  );
}
