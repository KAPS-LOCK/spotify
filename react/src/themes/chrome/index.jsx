import { useEffect, useRef, useState } from 'react';
import './chrome.css';
import { useLibrary, useSearch, useStatusBar } from '../../core/hooks';
import { store, cacheSizeKb } from '../../core/persist';
import { fmtTime } from '../../core/fmt';
import { IconDefs } from './Icons';
import { ExplorerTree } from './ExplorerTree';
import { MenuBar } from './MenuBar';
import { PlayerBar } from './PlayerBar';
import { DJConsole } from './DJConsole';
import { BurnDialog, AboutDialog, AddToMixDialog } from './Dialogs';
import { DialogContext } from './DialogContext';
import {
  Home, Search, AlbumDetail, Liked, Queue, Songs, Artists, Albums,
  Playlists, PlaylistDetail, MixCds, MixDetail, Radio, Downloads,
} from './views';

function useSplitter(frameRef) {
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const saved = store.get('sp06_cols', null);
    if (saved) {
      if (saved.l) frame.style.setProperty('--col-l', saved.l);
      if (saved.r) frame.style.setProperty('--col-r', saved.r);
    }
    const splitters = frame.querySelectorAll('.splitter');
    const cleanups = [];
    splitters.forEach((sp) => {
      const onDown = (e) => {
        e.preventDefault();
        sp.classList.add('dragging');
        const side = sp.dataset.side;
        const onMove = (ev) => {
          const rect = frame.getBoundingClientRect();
          if (side === 'l') {
            const w = Math.min(320, Math.max(148, ev.clientX - rect.left));
            frame.style.setProperty('--col-l', w + 'px');
          } else {
            const w = Math.min(400, Math.max(205, rect.right - ev.clientX));
            frame.style.setProperty('--col-r', w + 'px');
          }
        };
        const onUp = () => {
          sp.classList.remove('dragging');
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          store.set('sp06_cols', {
            l: frame.style.getPropertyValue('--col-l'),
            r: frame.style.getPropertyValue('--col-r'),
          });
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      };
      sp.addEventListener('mousedown', onDown);
      cleanups.push(() => sp.removeEventListener('mousedown', onDown));
    });
    return () => cleanups.forEach((c) => c());
  }, [frameRef]);
}

function OdoCell({ children }) {
  return <span className="odo" key={String(children)}>{children}</span>;
}

function isMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
}

function useBootSequence() {
  const [booting, setBooting] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !window.sessionStorage.getItem('sp06_booted');
  });
  useEffect(() => {
    if (!booting) return;
    window.sessionStorage.setItem('sp06_booted', '1');
    const t = setTimeout(() => setBooting(false), 600);
    return () => clearTimeout(t);
  }, [booting]);
  return [booting, () => setBooting(false)];
}

export default function ThemeApp() {
  const [view, setView] = useState('home');
  const [curAlbum, setCurAlbum] = useState(null);
  const [skin, setSkin] = useState(() => store.get('sp06_skin', 'midnight'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [burnOpen, setBurnOpen] = useState(false);
  const [burnTrack, setBurnTrack] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [pickTrack, setPickTrack] = useState(null);
  const [searchGlitch, setSearchGlitch] = useState(false);
  const [degauss, setDegauss] = useState(false);

  const { search } = useSearch();
  const { mixes, burnMix, addToMix } = useLibrary();
  const statusBar = useStatusBar();
  const [searchInput, setSearchInput] = useState('');
  const frameRef = useRef(null);
  useSplitter(frameRef);
  const [booting, skipBoot] = useBootSequence();

  useEffect(() => { store.set('sp06_skin', skin); }, [skin]);

  const scrimVisible = sidebarOpen || consoleOpen;

  function nav(id, meta) {
    if (id.startsWith('album:') && meta) setCurAlbum(meta);
    setView(id);
    if (isMobile()) { setSidebarOpen(false); setConsoleOpen(false); }
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    nav('search');
    search(q);
    setSearchGlitch(true);
  }

  function openBurnDialog(track) { setBurnTrack(track); setBurnOpen(true); }
  function closeBurnDialog() { setBurnOpen(false); setBurnTrack(null); }
  function confirmBurn(name) {
    const finalName = name || 'untitled mix ' + (mixes.length + 1);
    burnMix(finalName, burnTrack ? [burnTrack] : []);
    closeBurnDialog();
  }

  function promptAddToMix(track) {
    if (!mixes.length) { openBurnDialog(track); return; }
    setPickTrack(track);
  }

  const dialogsApi = {
    promptAddToMix,
    openBurnDialog,
    openAboutDialog: () => setAboutOpen(true),
  };

  const lib = statusBar.collectLibrary();
  const totalSec = lib.reduce((s, t) => s + (t.ms || 0), 0) / 1000;
  const itemsLabel = lib.length + ' item' + (lib.length === 1 ? '' : 's');
  const timeLabel = fmtTime(totalSec) + ' total';
  const cacheLabel = 'cache: ' + cacheSizeKb() + 'kb';

  let ViewEl;
  if (view === 'home') ViewEl = <Home nav={nav} />;
  else if (view === 'search') ViewEl = <Search nav={nav} />;
  else if (view === 'liked') ViewEl = <Liked />;
  else if (view === 'queue') ViewEl = <Queue />;
  else if (view.startsWith('album:')) ViewEl = <AlbumDetail albumId={view.slice(6)} albumMeta={curAlbum} nav={nav} />;
  else if (view === 'songs') ViewEl = <Songs />;
  else if (view === 'artists') ViewEl = <Artists nav={nav} />;
  else if (view === 'albums') ViewEl = <Albums />;
  else if (view === 'playlists') ViewEl = <Playlists nav={nav} />;
  else if (view.startsWith('pl:')) ViewEl = <PlaylistDetail index={Number(view.slice(3))} nav={nav} />;
  else if (view === 'mixcds') ViewEl = <MixCds nav={nav} />;
  else if (view.startsWith('mix:')) ViewEl = <MixDetail index={Number(view.slice(4))} nav={nav} />;
  else if (view === 'radio') ViewEl = <Radio />;
  else if (view === 'downloads') ViewEl = <Downloads />;

  return (
    <DialogContext.Provider value={dialogsApi}>
      <div className={'theme-chrome' + (booting ? ' boot-play' : '')} data-skin={skin}
        onClick={booting ? skipBoot : undefined}>
        <IconDefs />
        {booting && <div className="boot-overlay" aria-hidden="true" />}
        {degauss && <div className="degauss-overlay" aria-hidden="true" onAnimationEnd={() => setDegauss(false)} />}

        <div className="boot-region-1">
          <div className="titlebar">
            <button className="nav-toggle" aria-label="Menu" onClick={() => { setConsoleOpen(false); setSidebarOpen((o) => !o); }}>&#9776;</button>
            <div className="logo">SPOTIFY<span className="tm">&trade;</span><span className="ver">2006</span></div>
            <div className="title-tag">your music. your player. no napster lawsuits.</div>
            <button className="btn-row" style={{ marginLeft: 'auto' }}
              onClick={() => { setSkin((s) => (s === 'midnight' ? 'silver' : 'midnight')); setDegauss(true); }}
              title="Toggle Midnight Chrome / Daylight Silver">
              {skin === 'midnight' ? '☀ SILVER' : '🌙 MIDNIGHT'}
            </button>
          </div>

          <MenuBar nav={nav} onOpenConsole={() => { if (isMobile()) { setSidebarOpen(false); setConsoleOpen(true); } }} />

          <div className="toolbar">
            <button className="btn btn-chrome tool-home" title="Home" aria-label="Home" onClick={() => nav('home')}>&#8962;</button>
            <form onSubmit={onSubmitSearch} autoComplete="off">
              <input type="text" placeholder="artist, song or album..." spellCheck="false"
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)} id="searchInput"
                className={searchGlitch ? 'lcd-glitch' : undefined}
                onAnimationEnd={() => setSearchGlitch(false)} />
              <button type="submit" className="btn btn-chrome">SEARCH &raquo;</button>
            </form>
          </div>
        </div>

        <div className="frame boot-region-2" ref={frameRef}>
          <ExplorerTree view={view} onNav={nav} onClose={() => setSidebarOpen(false)} open={sidebarOpen} />

          <div className="splitter" data-side="l" title="drag to resize"></div>

          <main className="view">{ViewEl}</main>

          <div className="splitter" data-side="r" title="drag to resize"></div>

          <DJConsole onClose={() => setConsoleOpen(false)} open={consoleOpen} />
        </div>

        <div className="boot-region-3">
          <PlayerBar />

          <div className="statusbar">
            <span className="sb-cell sb-msg">{statusBar.message}</span>
            <span className="sb-cell"><OdoCell>{itemsLabel}</OdoCell></span>
            <span className="sb-cell"><OdoCell>{timeLabel}</OdoCell></span>
            <span className="sb-cell"><OdoCell>{cacheLabel}</OdoCell></span>
            <span className="sb-grip" aria-hidden="true"></span>
          </div>
        </div>

        {/* mobile-only vinyl toggle */}
        <button className="buddy-toggle" title="DJ_Sp1n is online" aria-label="Open DJ console"
          onClick={() => { setSidebarOpen(false); setConsoleOpen((o) => !o); }}>
          <span className="vinyl"><span className="vinyl-label">DJ</span></span>
        </button>

        {scrimVisible && (
          <div className="drawer-scrim" onClick={() => { setSidebarOpen(false); setConsoleOpen(false); }}></div>
        )}

        <BurnDialog open={burnOpen} onConfirm={confirmBurn} onCancel={closeBurnDialog} />
        <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
        <AddToMixDialog
          open={!!pickTrack}
          track={pickTrack}
          mixes={mixes}
          onPick={(i) => { addToMix(i, pickTrack); setPickTrack(null); }}
          onNew={() => { const t = pickTrack; setPickTrack(null); openBurnDialog(t); }}
          onCancel={() => setPickTrack(null)}
        />
      </div>
    </DialogContext.Provider>
  );
}
