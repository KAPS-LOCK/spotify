import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

const VIBES = [
  { key: 'chrome', to: '/chrome', name: 'Chrome & Acid', sub: 'Metallic energy', accent: 'oklch(0.74 0.19 152)', glow: 'oklch(0.74 0.19 152 / 0.65)', art: '/vinyl-chrome.png' },
  { key: 'aero', to: '/aero', name: 'Frutiger Aero', sub: 'Glossy water & glass', accent: 'oklch(0.74 0.19 224)', glow: 'oklch(0.74 0.19 224 / 0.65)', art: '/vinyl-aero.png', artZoom: 140 },
  { key: 'scrap', to: '/scrapbook', name: 'MySpace Scrapbook', sub: 'Glitter & collage', accent: 'oklch(0.74 0.19 340)', glow: 'oklch(0.74 0.19 340 / 0.65)', art: '/vinyl-scrapbook.png' },
];

const SPARKLES = [
  { left: '9%', top: '20%', size: 5, color: '#fff', delay: '0s', dur: '2.6s' },
  { left: '88%', top: '14%', size: 4, color: '#9ef7c8', delay: '0.4s', dur: '3.1s' },
  { left: '80%', top: '32%', size: 3, color: '#fff', delay: '0.8s', dur: '2.2s' },
  { left: '6%', top: '38%', size: 3, color: '#ffd9f2', delay: '1.1s', dur: '2.9s' },
];

function useStageScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function fit() {
      setScale(Math.min(window.innerWidth / 1440, window.innerHeight / 900));
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return scale;
}

export default function Landing() {
  const scale = useStageScale();
  const navigate = useNavigate();
  const [spinKey, setSpinKey] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function playVibe(vibe) {
    if (spinKey) return;
    setSpinKey(vibe.key);
    timers.current.push(setTimeout(() => {
      setOverlay({ label: vibe.name.toUpperCase(), accent: vibe.accent });
    }, 650));
    timers.current.push(setTimeout(() => {
      navigate(vibe.to);
    }, 1750));
  }

  return (
    <div className="stage-wrap">
      <div className="stage" style={{ transform: `scale(${scale})` }}>
        <div className="stage-floor" aria-hidden="true" />

        <div className="stage-beam stage-beam-l" aria-hidden="true" />
        <div className="stage-beam stage-beam-c" aria-hidden="true" />
        <div className="stage-beam stage-beam-r" aria-hidden="true" />

        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="stage-sparkle"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, background: s.color, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}

        <div className="stage-ball-wrap" aria-hidden="true">
          <div className="stage-ball-float">
            <img src="/disco-ball.png" alt="Spotify disco ball" className="stage-ball-img" />
          </div>
        </div>
        <div className="stage-ball-glow" aria-hidden="true" />

        <div className="stage-hero">
          <div className="stage-word">SPOTIFY</div>
          <div className="stage-year">2 0 0 6</div>
          <div className="stage-cta">PICK YOUR VIBE</div>
        </div>

        <div className="stage-vinyl-row">
          {VIBES.map((vibe) => (
            <div key={vibe.key} className="stage-vinyl">
              <div
                className={'stage-disc' + (spinKey === vibe.key ? ' stage-disc-spin' : '')}
                onClick={() => playVibe(vibe)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') playVibe(vibe); }}
              >
                {vibe.art ? (
                  <div className="stage-disc-art-wrap">
                    <img
                      className="stage-disc-art"
                      src={vibe.art}
                      alt=""
                      style={vibe.artZoom ? { width: vibe.artZoom + '%', height: vibe.artZoom + '%' } : undefined}
                    />
                  </div>
                ) : (
                  <div className="stage-disc-label" style={{ background: vibe.accent, boxShadow: `0 0 22px ${vibe.glow}, inset 0 0 0 3px rgba(0,0,0,.35)` }}>
                    <span className="stage-disc-bar stage-disc-bar-1" />
                    <span className="stage-disc-bar stage-disc-bar-2" />
                    <span className="stage-disc-bar stage-disc-bar-3" />
                  </div>
                )}
                <div className="stage-disc-sheen" />
                <div className="stage-disc-hole" />
              </div>
              <div className="stage-vinyl-text">
                <div className="stage-vinyl-name">{vibe.name}</div>
                <div className="stage-vinyl-sub">{vibe.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="stage-tagline">Three vibes. One club. Zero skips.</div>

        {overlay && (
          <div
            className="stage-overlay"
            style={{ background: `radial-gradient(circle at 50% 50%, ${overlay.accent}, #050505 72%)` }}
          >
            <div className="stage-overlay-label">ENTERING {overlay.label}</div>
          </div>
        )}
      </div>
    </div>
  );
}
