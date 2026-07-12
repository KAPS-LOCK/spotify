import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../core/hooks';
import { fmtTime } from '../../core/fmt';

const VIZ_BARS = 28;

function Visualizer({ isPlaying }) {
  const ref = useRef(null);
  const heightsRef = useRef(new Array(VIZ_BARS).fill(8));

  useEffect(() => {
    const bars = ref.current?.children;
    if (!bars) return;
    const id = setInterval(() => {
      for (let i = 0; i < VIZ_BARS; i++) {
        const target = !isPlaying ? 8 : 15 + Math.random() * 85 * (0.5 + 0.5 * Math.sin(i / 3 + Date.now() / 300));
        heightsRef.current[i] += (target - heightsRef.current[i]) * 0.45;
        if (bars[i]) bars[i].style.height = Math.max(8, heightsRef.current[i]) + '%';
      }
    }, 100);
    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <div className="viz" ref={ref}>
      {Array.from({ length: VIZ_BARS }).map((_, i) => <i key={i}></i>)}
    </div>
  );
}

export function PlayerBar() {
  const {
    current, isPlaying, currentTime, duration, shuffle, repeat, volume,
    toggle, next, prev, seek, setVolume, toggleShuffle, toggleRepeat,
  } = usePlayer();
  const [seekVal, setSeekVal] = useState(0);
  const [seekDragging, setSeekDragging] = useState(false);
  const [trackGlitch, setTrackGlitch] = useState(false);
  const [playPulse, setPlayPulse] = useState(false);
  const prevIdRef = useRef(current?.id);

  useEffect(() => {
    if (!seekDragging && isFinite(duration) && duration > 0) {
      setSeekVal((currentTime / duration) * 100);
    }
  }, [currentTime, duration, seekDragging]);

  useEffect(() => {
    if (current?.id !== prevIdRef.current) {
      prevIdRef.current = current?.id;
      setTrackGlitch(true);
    }
  }, [current?.id]);

  function handleToggle() {
    toggle();
    setPlayPulse(true);
    setTimeout(() => setPlayPulse(false), 350);
  }

  const lcdText = current ? '♫ ' + current.name + ' — ' + current.artist + ' ' : 'SPOTIFY™ 2006 ··· insert coin to rock ··· search for a song to begin';

  return (
    <footer className="player">
      <div className={'lcd' + (trackGlitch ? ' lcd-glitch' : '')} onAnimationEnd={() => setTrackGlitch(false)}>
        <div className={'lcd-track' + (current ? ' scrolling' : '')}>
          <span>{lcdText}{current ? '··· ' + lcdText + '··· ' : ''}</span>
        </div>
        <div className="lcd-sub">
          <span>{current ? fmtTime(currentTime) + ' / ' + fmtTime(duration) : '--:-- / --:--'}</span>
          <span className="lcd-meta">128kbps &middot; stereo &middot; 44khz</span>
        </div>
        <Visualizer isPlaying={isPlaying} />
      </div>

      <div className="transport">
        <button className="btn btn-chrome" title="Previous" onClick={prev}>&#9198;</button>
        <button className={'btn btn-play' + (playPulse ? ' pulse' : '')} title="Play/Pause" onClick={handleToggle}>{isPlaying ? '⏸' : '▶'}</button>
        <button className="btn btn-chrome" title="Next" onClick={() => next(true)}>&#9197;</button>
        <button className={'btn btn-chrome btn-toggle' + (shuffle ? ' on' : '')} title="Shuffle" onClick={toggleShuffle}>SHFL</button>
        <button className={'btn btn-chrome btn-toggle' + (repeat ? ' on' : '')} title="Repeat queue" onClick={toggleRepeat}>RPT</button>
      </div>

      <div className="sliders">
        <input type="range" className="slider seek" min="0" max="100" step="0.1" aria-label="Seek"
          value={seekVal}
          onChange={(e) => { setSeekDragging(true); setSeekVal(Number(e.target.value)); }}
          onMouseUp={() => { if (isFinite(duration)) seek((seekVal / 100) * duration); setSeekDragging(false); }}
          onTouchEnd={() => { if (isFinite(duration)) seek((seekVal / 100) * duration); setSeekDragging(false); }} />
        <div className="vol-row">
          <span className="vol-icon">VOL</span>
          <input type="range" className="slider vol" min="0" max="1" step="0.01" aria-label="Volume"
            value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
        </div>
      </div>

      {current?.art && <img className="player-art" src={current.art} alt="" />}
    </footer>
  );
}
