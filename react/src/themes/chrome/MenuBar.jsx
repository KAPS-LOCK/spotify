import { useEffect, useState } from 'react';
import { usePlayer, useLibrary, useQueue, useDJ } from '../../core/hooks';
import { useDialogs } from './DialogContext';

const MENUS = [
  { id: 'file', label: 'File', items: [
    { cmd: 'burn', label: 'Burn Mix CD…' },
    { cmd: 'addcur', label: 'Add Current Track to Mix CD…' },
  ] },
  { id: 'edit', label: 'Edit', items: [
    { cmd: 'like', label: null }, // label computed dynamically
    { cmd: 'clearqueue', label: 'Clear Queue' },
  ] },
  { id: 'view', label: 'View', items: [
    { cmd: 'home', label: 'Home' },
    { cmd: 'search', label: 'Search' },
    { cmd: 'liked', label: 'Liked Songs' },
    { cmd: 'queue', label: 'Up Next' },
    { sep: true },
    { cmd: 'library', label: 'Library » Songs' },
    { cmd: 'playlists', label: 'Playlists' },
    { cmd: 'mixcds', label: 'Mix CDs' },
    { cmd: 'radio', label: 'Radio' },
    { cmd: 'downloads', label: 'Downloads' },
  ] },
  { id: 'controls', label: 'Controls', items: [
    { cmd: 'playpause', label: 'Play / Pause' },
    { cmd: 'prev', label: 'Previous Track' },
    { cmd: 'next', label: 'Next Track' },
    { sep: true },
    { cmd: 'shuffle', label: 'Toggle Shuffle' },
    { cmd: 'repeat', label: 'Toggle Repeat' },
  ] },
  { id: 'tools', label: 'Tools', items: [
    { cmd: 'talk', label: 'Talk to DJ_Sp1n…' },
    { cmd: 'buildmix', label: 'Build Mix from Session' },
  ] },
  { id: 'help', label: 'Help', items: [
    { cmd: 'about', label: 'About Spotify™ 2006…' },
  ] },
];

export function MenuBar({ nav, onOpenConsole }) {
  const [openMenu, setOpenMenu] = useState(null);
  const { current, toggle, prev, next, shuffle, repeat, toggleShuffle, toggleRepeat } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();
  const { clear } = useQueue();
  const { buildMix } = useDJ();
  const { openBurnDialog, promptAddToMix, openAboutDialog } = useDialogs();

  useEffect(() => {
    const close = () => setOpenMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  function runCmd(cmd) {
    setOpenMenu(null);
    switch (cmd) {
      case 'burn': openBurnDialog(null); break;
      case 'addcur': current ? promptAddToMix(current) : null; break;
      case 'like': current && toggleLike(current); break;
      case 'clearqueue': clear(); break;
      case 'home': nav('home'); break;
      case 'search': nav('search'); break;
      case 'liked': nav('liked'); break;
      case 'queue': nav('queue'); break;
      case 'library': nav('songs'); break;
      case 'playlists': nav('playlists'); break;
      case 'mixcds': nav('mixcds'); break;
      case 'radio': nav('radio'); break;
      case 'downloads': nav('downloads'); break;
      case 'playpause': toggle(); break;
      case 'prev': prev(); break;
      case 'next': next(true); break;
      case 'shuffle': toggleShuffle(); break;
      case 'repeat': toggleRepeat(); break;
      case 'talk': onOpenConsole?.(); break;
      case 'buildmix': buildMix(); break;
      case 'about': openAboutDialog(); break;
      default: break;
    }
  }

  return (
    <div className="menubar">
      {MENUS.map((m) => (
        <div key={m.id} className={'menu-item' + (openMenu === m.id ? ' open' : '')}
          onMouseEnter={() => { if (openMenu) setOpenMenu(m.id); }}>
          <button className="menu-label" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === m.id ? null : m.id); }}>
            {m.label}
          </button>
          <div className="menu-drop">
            {m.items.map((it, i) => it.sep
              ? <div className="menu-sep" key={i} />
              : (
                <button key={it.cmd} onClick={() => runCmd(it.cmd)}>
                  {it.cmd === 'like'
                    ? (current && isLiked(current.id) ? 'Unlike Current Track' : 'Like Current Track')
                    : it.label}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
