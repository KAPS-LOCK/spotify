import { Link } from 'react-router-dom';
import { usePlayer } from '../../core/hooks';
import './aero.css';

export default function ThemeApp() {
  const { current, isPlaying, toggle } = usePlayer();

  return (
    <div className="theme-aero-stub">
      <div className="aero-stub-card">
        <div className="aero-stub-banner">
          <span>🛠️ UNDER CONSTRUCTION 🛠️</span>
          <span>🛠️ UNDER CONSTRUCTION 🛠️</span>
        </div>
        <h1>Frutiger Aero</h1>
        <p className="aero-stub-credit">built by Parth</p>
        <p className="aero-stub-note">
          Glossy blue-green gradients, glass reflections, water droplets,
          bevels for days. Coming soon — see <code>THEME-GUIDE.md</code> in
          this folder for the hooks this theme has access to.
        </p>

        <div className="aero-stub-now-playing">
          <div className="aero-stub-label">now playing (shared player state)</div>
          {current
            ? <div className="aero-stub-track">{current.name} — {current.artist}</div>
            : <div className="aero-stub-track dim">nothing yet</div>}
          {current && (
            <button className="aero-stub-btn" onClick={toggle}>{isPlaying ? 'Pause' : 'Play'}</button>
          )}
        </div>

        <Link to="/" className="aero-stub-back">&larr; back to theme select</Link>
      </div>
    </div>
  );
}
