import { useEffect, useMemo, useRef, useState } from 'react';
import { useDJ, usePlayer } from '../../core/hooks';
import { useAppStore } from '../../core/store';
import { Icon } from './Icons';

function ChatBurnBtn({ mixName, tracks }) {
  const [burned, setBurned] = useState(false);
  const burnMixFromDJ = useAppStore((s) => s.burnMixFromDJ);
  return (
    <button className="btn-row pink" disabled={burned}
      onClick={() => { burnMixFromDJ(mixName, tracks); setBurned(true); }}>
      {burned ? '✓ BURNED' : '● BURN TO CD'}
    </button>
  );
}

function ThreadEntry({ entry }) {
  const { play } = usePlayer();
  const who = entry.kind === 'chat' ? entry.who : 'DJ_Sp1n';
  const cls = entry.kind === 'chat' ? entry.cls : 'bot';
  const typing = !!entry.pending || (entry.cls || '').includes('typing');
  return (
    <div className={'im-msg ' + cls + (typing ? ' typing' : '')}>
      <span className="who">{who === 'me' ? 'you' : who}:</span>{' '}
      {typing
        ? <><i>{entry.lines[0]}</i><span className="im-typing-dots"><i></i><i></i><i></i></span></>
        : entry.lines.map((l, i) => <span key={i}>{l}<br /></span>)}
      {entry.time && !typing && <span className="im-time">{entry.time}</span>}
      {entry.tracks && (
        <>
          <div className="im-tracklist">
            {entry.tracks.map((t, i) => <div key={i}>&#9835; {t.name} — {t.artist}</div>)}
          </div>
          <div className="im-actions">
            <button className="btn-row" onClick={() => play(entry.tracks, 0)}>&#9654; PLAY MIX</button>
            <ChatBurnBtn mixName={entry.mixName} tracks={entry.tracks} />
          </div>
        </>
      )}
      {entry.actions && (
        <div className="im-actions">
          {entry.actions.map((a, i) => (
            <button key={i} className={'btn-row' + (a.pink ? ' pink' : '')} onClick={a.fn}>{a.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DJConsole({ onClose, open }) {
  const { feed, status, chatLog, sendChat } = useDJ();
  const [chatInput, setChatInput] = useState('');
  const logRef = useRef(null);

  const thread = useMemo(() => {
    const feedItems = feed.map((e) => ({ ...e, kind: 'feed' }));
    const chatItems = chatLog.map((m) => ({ ...m, kind: 'chat' }));
    return [...feedItems, ...chatItems].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  }, [feed, chatLog]);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [thread]);

  function submitChat(e) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    sendChat(text);
  }

  return (
    <aside className={'console' + (open ? ' open' : '')}>
      <div className="con-head">
        <div className="con-avatar"><Icon name="djmark" /><span className="con-online-dot" title="online" /></div>
        <div className="con-id">
          <div className="con-name">DJ_Sp1n</div>
          <div className="con-purpose">watches what you play. builds you mixes.</div>
          <div className="con-status-strip"><span>{status}<i className="con-cursor">_</i></span></div>
        </div>
        <button className="con-close" aria-label="Close console" onClick={onClose}>&times;</button>
      </div>

      <div className="con-body">
        <div className="con-chat">
          <div className="im-log" ref={logRef}>
            {thread.map((e) => <ThreadEntry key={e.id} entry={e} />)}
          </div>
          <form className="im-inputrow" onSubmit={submitChat}>
            <input type="text" placeholder="throw me a mood..." spellCheck="false"
              value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
            <button type="submit" className="btn btn-row pink im-send">SEND &raquo;</button>
          </form>
        </div>
      </div>
    </aside>
  );
}
