import { useEffect, useRef, useState } from 'react';
import { useDJ, usePlayer } from '../../core/hooks';
import { useAppStore } from '../../core/store';

const QUICK = [
  ['gym', 'WORKOUT'], ['road', 'ROAD TRIP'], ['late', 'LATE NIGHT'],
  ['party', 'PARTY'], ['chill', 'CHILL'],
];

function FeedEntry({ entry }) {
  return (
    <div className="feed-entry new">
      <div className="feed-time">{entry.time}</div>
      <div className="feed-txt">
        {entry.pending
          ? <i>{entry.lines[0]}</i>
          : entry.lines.map((l, i) => <span key={i}>{l}<br /></span>)}
      </div>
      {entry.actions && (
        <div className="feed-actions">
          {entry.actions.map((a, i) => (
            <button key={i} className={'btn-row' + (a.pink ? ' pink' : '')} onClick={a.fn}>{a.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatMsg({ msg }) {
  const { play } = usePlayer();
  return (
    <div className={'im-msg ' + msg.cls}>
      <span className="who">{msg.who}:</span>{' '}
      {msg.lines.map((l, i) => <span key={i}>{l}<br /></span>)}
      {msg.tracks && (
        <>
          <div className="im-tracklist">
            {msg.tracks.map((t, i) => (
              <div key={i}>&#9835; {t.name} — {t.artist}</div>
            ))}
          </div>
          <div className="im-actions">
            <button className="btn-row" onClick={() => play(msg.tracks, 0)}>&#9654; PLAY MIX</button>
            <ChatBurnBtn mixName={msg.mixName} tracks={msg.tracks} />
          </div>
        </>
      )}
    </div>
  );
}

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

export function DJConsole({ onClose, open }) {
  const { feed, status, found, trending, chatLog, busy, syncedAt, sendChat, quickMix, buildMix, loadTrending } = useDJ();
  const { play } = usePlayer();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const feedRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => { if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight; }, [feed]);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [chatLog]);
  useEffect(() => { loadTrending(); }, [loadTrending]);

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
        <div className="con-avatar">&#9835;</div>
        <div className="con-id">
          <div className="con-name">DJ_Sp1n</div>
          <div className="con-purpose">watches what you play. builds you mixes.</div>
          <div className="con-status">{status}</div>
        </div>
        <button className="con-close" aria-label="Close console" onClick={onClose}>&times;</button>
      </div>

      <div className="con-body">
        <div className="con-sec">
          <div className="con-cap">SESSION LOG {syncedAt && <span className="cap-note">&middot; synced {syncedAt}</span>}</div>
          <div className="dj-feed" ref={feedRef}>
            {feed.map((e) => <FeedEntry key={e.id} entry={e} />)}
          </div>
        </div>

        {!chatOpen && (
          <div className="con-mid">
            <div className="con-sec">
              <div className="con-cap">QUICK MIXES</div>
              <div className="quick-grid">
                {QUICK.map(([key, label]) => (
                  <button key={key} className="btn-row" disabled={busy} onClick={() => quickMix(key)}>{label}</button>
                ))}
              </div>
              <button className="build-mix" disabled={busy} onClick={buildMix}>
                &#9889; BUILD MIX <span>from this session</span>
              </button>
            </div>

            <div className="con-sec">
              <div className="con-cap">RECENTLY FOUND <span className="cap-note">&middot; this session</span></div>
              {found.length
                ? <div className="found-list">
                    {found.map((t, i) => (
                      <button className="found-row" key={t.id} onClick={() => play(found, i)}>
                        <img src={t.art} alt="" loading="lazy" />
                        <span className="fr-txt"><b>{t.name}</b><i>{t.artist}</i></span>
                      </button>
                    ))}
                  </div>
                : <div className="con-empty">nothing yet. he's listening.</div>}
            </div>

            <div className="con-sec">
              <div className="con-cap">HOT RIGHT NOW <span className="cap-note">&middot; updated this session</span></div>
              {trending && trending.length
                ? <div className="trend-list">
                    {trending.map((r, i) => (
                      <button className="trend-row" key={r.track.id}
                        onClick={() => play(trending.map((x) => x.track), i)}>
                        <span className="tr-txt"><b>{r.track.name}</b><i>{r.track.artist}</i></span>
                        <span className="tr-up">&#9650;{r.up}</span>
                      </button>
                    ))}
                  </div>
                : <div className="con-empty">the wire is quiet.</div>}
            </div>
          </div>
        )}

        {chatOpen && (
          <div className="con-chat">
            <div className="im-log" ref={logRef}>
              {chatLog.map((m) => <ChatMsg key={m.id} msg={m} />)}
            </div>
            <form className="im-inputrow" onSubmit={submitChat}>
              <input type="text" placeholder="throw me a mood..." spellCheck="false"
                value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
              <button type="submit" className="btn btn-aero">Send</button>
            </form>
          </div>
        )}
      </div>

      <button className="talk-btn" onClick={() => setChatOpen((o) => !o)}>
        {chatOpen ? '« back to console' : '✉ talk to dj »'}
      </button>
    </aside>
  );
}
