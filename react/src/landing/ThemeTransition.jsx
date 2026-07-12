import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './theme-transition.css';

const TransitionCtx = createContext(null);

export function useThemeTransition() {
  return useContext(TransitionCtx);
}

const FLY_SIZE = 640;
const NAVIGATE_AT = 470;
const FADE_AT = 820;
const CLEAR_AT = 1150;

export function ThemeTransitionProvider({ children }) {
  const navigate = useNavigate();
  const [fly, setFly] = useState(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start(vibe, rect) {
    if (fly) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { navigate(vibe.to); return; }

    const startRect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    const endRect = {
      top: window.innerHeight / 2 - FLY_SIZE / 2,
      left: window.innerWidth / 2 - FLY_SIZE / 2,
      width: FLY_SIZE,
      height: FLY_SIZE,
    };

    setFly({ vibe, rect: startRect, phase: 'grow' });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setFly((f) => (f ? { ...f, rect: endRect, phase: 'center' } : f));
    }));
    timers.current.push(setTimeout(() => navigate(vibe.to), NAVIGATE_AT));
    timers.current.push(setTimeout(() => setFly((f) => (f ? { ...f, phase: 'fade' } : f)), FADE_AT));
    timers.current.push(setTimeout(() => setFly(null), CLEAR_AT));
  }

  return (
    <TransitionCtx.Provider value={start}>
      {children}
      {fly && (
        <div
          className={'theme-fly' + (fly.phase === 'fade' ? ' theme-fly-fade' : '')}
          style={{ top: fly.rect.top, left: fly.rect.left, width: fly.rect.width, height: fly.rect.height }}
          aria-hidden="true"
        >
          <div className="theme-fly-spin" style={{ background: fly.vibe.accent }}>
            {fly.vibe.art && <img src={fly.vibe.art} alt="" />}
          </div>
        </div>
      )}
    </TransitionCtx.Provider>
  );
}
