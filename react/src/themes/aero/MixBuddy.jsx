import { useEffect, useRef, useState } from 'react';
import { useDJ } from '../../core/hooks';
import { askBuddy } from './buddyAI';

const QUICK = [
  ['gym', '🏋️ gym'], ['road', '🚗 road trip'], ['late', '🌙 late night'],
  ['party', '🎉 party'], ['chill', '😌 chill'],
];

function FeedEntry({ entry }){
  return (
    <div className="bmsg bot">
      {entry.lines.map((l, i) => <span key={i}>{l}<br /></span>)}
      {entry.actions && (
        <div className="bmsg-tracks">
          {entry.actions.map((a, i) => (
            <button key={i} className="bmsg-track-btn" onClick={a.fn}>{a.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

let aiMsgId = 0;

function AiMsg({ msg }){
  return (
    <div className={`bmsg ${msg.who === 'me' ? 'me' : 'bot'}`}>
      {msg.text.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
    </div>
  );
}

export default function MixBuddy(){
  const { feed, status, busy, quickMix, buildMix } = useDJ();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [aiChat, setAiChat] = useState([
    { id: aiMsgId++, who: 'DJ_Sp1n', text: "yo, it's DJ_Sp1n. throw me a mood, an artist, whatever's on your mind." },
  ]);
  const [aiBusy, setAiBusy] = useState(false);
  const feedRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => { if(feedRef.current) feedRef.current.scrollTop = 999999; }, [feed, open]);
  useEffect(() => { if(logRef.current) logRef.current.scrollTop = 999999; }, [aiChat, aiBusy, open, chatOpen]);

  async function send(){
    const val = input.trim();
    if(!val || aiBusy) return;
    setInput('');
    const history = aiChat;
    setAiChat((c) => [...c, { id: aiMsgId++, who: 'me', text: val }]);
    setAiBusy(true);
    try {
      const reply = await askBuddy(val, history);
      setAiChat((c) => [...c, { id: aiMsgId++, who: 'DJ_Sp1n', text: reply }]);
    } catch {
      setAiChat((c) => [...c, { id: aiMsgId++, who: 'DJ_Sp1n', text: "modem's down... try again in a sec." }]);
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <>
      <button className="buddy-toggle" title="Talk to DJ_Sp1n" onClick={() => setOpen(o => !o)}>💬</button>
      <div className={`buddy-window ${open ? 'show' : ''}`}>
        <div className="buddy-head">
          <span>guestbook_chat.exe — DJ_Sp1n</span>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="buddy-status">
          {status}
          <button className="buddy-switch" onClick={() => setChatOpen(o => !o)}>
            {chatOpen ? '« back to console' : 'talk to dj »'}
          </button>
        </div>

        {!chatOpen && (
          <>
            <div className="buddy-quick">
              {QUICK.map(([key, label]) => (
                <button key={key} disabled={busy} onClick={() => quickMix(key)}>{label}</button>
              ))}
              <button disabled={busy} onClick={buildMix}>⚡ build from today</button>
            </div>
            <div className="buddy-msgs" ref={feedRef}>
              {feed.length
                ? feed.map(e => <FeedEntry key={e.id} entry={e} />)
                : <div className="bmsg bot">still booting up...</div>}
            </div>
          </>
        )}

        {chatOpen && (
          <div className="buddy-msgs" ref={logRef}>
            {aiChat.map(m => <AiMsg key={m.id} msg={m} />)}
            {aiBusy && <div className="bmsg bot typing">...</div>}
          </div>
        )}

        <div className="buddy-input">
          <input
            type="text" placeholder="throw me a mood..."
            value={input}
            disabled={aiBusy}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setChatOpen(true)}
            onKeyDown={e => { if(e.key === 'Enter') send(); }}
          />
          <button disabled={aiBusy} onClick={() => { setChatOpen(true); send(); }}>send</button>
        </div>
      </div>
    </>
  );
}
