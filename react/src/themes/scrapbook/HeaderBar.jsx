import { useEffect, useState } from 'react';
import { usePlayer } from '../../core/hooks';
import { fmtTime } from '../../core/fmt';
import { TYPING_PHRASES, MOODS } from './data';

function PixelBounce() {
  const letters = 'SPOTIFY'.split('');
  return (
    <div className="pixel-bounce">
      {letters.map((ch, i) => (
        <span className="letter" key={i} data-char={ch}>{ch}</span>
      ))}
      <span className="space-dot" />
      <span className="ver">'06</span>
    </div>
  );
}

function TypingText() {
  const [text, setText] = useState('');

  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 80;
    let timer;

    function tick() {
      const current = TYPING_PHRASES[phraseIdx];
      if (!isDeleting) {
        setText(current.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === current.length) {
          isDeleting = true;
          speed = 2000;
        } else {
          speed = 60 + Math.random() * 60;
        }
      } else {
        if (speed === 2000) {
          speed = 35;
          timer = setTimeout(tick, speed);
          return;
        }
        setText(current.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % TYPING_PHRASES.length;
          speed = 400;
        } else {
          speed = 25 + Math.random() * 25;
        }
      }
      timer = setTimeout(tick, speed);
    }

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="typing-wrap">
      <span className="typing-text">{text}</span><span className="typing-cursor" />
    </div>
  );
}

function HitCounter() {
  const [count, setCount] = useState(892401);
  return (
    <button className="hit-counter" title="click for luck" onClick={() => setCount((c) => c + Math.floor(Math.random() * 7) + 1)}>
      <div className="hc-label">SITE HIT COUNTER</div>
      <div className="hc-box"><span>{String(count).padStart(7, '0')}</span></div>
      <div className="hc-note">&#9733; click me &#9733;</div>
    </button>
  );
}

function MoodBadge() {
  const [idx, setIdx] = useState(0);
  const mood = MOODS[idx];
  return (
    <button className="mood-badge" style={{ background: mood.bg }} title="click to change mood" onClick={() => setIdx((i) => (i + 1) % MOODS.length)}>
      <div className="mb-label">CURRENT MOOD</div>
      <div className="mb-text">{mood.text}</div>
      <div className="mb-note">&#10022; tap to shuffle &#10022;</div>
    </button>
  );
}

function CassettePlayer() {
  const {
    current, isPlaying, currentTime, duration, shuffle, repeat,
    toggle, next, prev, seek, toggleShuffle, toggleRepeat,
  } = usePlayer();

  function handleSeekClick(e) {
    if (!current || !isFinite(duration) || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    seek(p * duration);
  }

  return (
    <div className="cassette">
      <div className="cassette-reels">
        <div className={'reel' + (isPlaying ? ' spinning' : '')} />
        <div className={'reel' + (isPlaying ? ' spinning' : '')} />
      </div>
      <div className="cassette-info">
        <div className="cassette-label">
          <div className="cs-name">{current ? current.name : 'no track selected'}</div>
          <div className="cs-artist">{current ? current.artist : 'click a song to play'}</div>
        </div>
        <div className="cassette-progress">
          <span>{current ? fmtTime(currentTime) : '0:00'}</span>
          <div className="cassette-progress-track" onClick={handleSeekClick}>
            <div className="cassette-progress-fill" style={{ width: (isFinite(duration) && duration ? (currentTime / duration) * 100 : 0) + '%' }} />
          </div>
          <span>{current && isFinite(duration) ? fmtTime(duration) : '0:30'}</span>
        </div>
      </div>
      <div className="cassette-transport">
        <div className="ct-row">
          <button className={'ct-tag' + (shuffle ? ' active' : '')} title="Shuffle" onClick={toggleShuffle}>SHUF</button>
          <button className={'ct-tag' + (repeat ? ' active' : '')} title="Repeat" onClick={toggleRepeat}>RPT</button>
        </div>
        <div className="ct-row ct-buttons">
          <button className="ct-btn" title="Previous" onClick={prev}>&#9668;&#9668;</button>
          <button className="ct-play" title="Play/Pause" onClick={toggle}>{isPlaying ? '▮▮' : '▶'}</button>
          <button className="ct-btn" title="Next" onClick={() => next(true)}>&#9658;&#9658;</button>
        </div>
      </div>
    </div>
  );
}

export function HeaderBar() {
  return (
    <div className="hdr">
      <div className="logo-sticker">
        <PixelBounce />
        <span className="mixtape-tag">mixtape deck</span>
      </div>
      <div className="hdr-center">
        <HitCounter />
        <CassettePlayer />
        <MoodBadge />
      </div>
      <TypingText />
    </div>
  );
}
