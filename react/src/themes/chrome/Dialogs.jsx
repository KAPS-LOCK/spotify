import { useEffect, useRef, useState } from 'react';

export function BurnDialog({ open, onConfirm, onCancel }) {
  const inputRef = useRef(null);
  const [name, setName] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (open) { setName(''); setShake(false); setTimeout(() => inputRef.current?.focus(), 0); }
  }, [open]);

  if (!open) return null;

  function confirm() {
    const trimmed = name.trim();
    if (!trimmed) { setShake(true); inputRef.current?.focus(); return; }
    onConfirm(trimmed);
  }

  return (
    <div className="dialog-backdrop">
      <div className={'dialog' + (shake ? ' shake' : '')} onAnimationEnd={() => setShake(false)}>
        <div className="dialog-title">Burn a new Mix CD</div>
        <div className="dialog-body">
          <label htmlFor="mixName">Name your CD (write it in sharpie):</label>
          <input ref={inputRef} type="text" id="mixName" maxLength={30} placeholder="summer jamz 2006"
            value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') confirm(); }} />
        </div>
        <div className="dialog-btns">
          <button className="btn-aero" onClick={confirm}>&#9679; Burn it</button>
          <button className="btn btn-chrome" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function AboutDialog({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <div className="dialog-title">About Spotify&trade; 2006</div>
        <div className="dialog-body">
          <p style={{ margin: '0 0 8px' }}>Spotify&trade; 2006 Consumer Preview<br />Build 0.91 beta &middot; iTunes Search API backend</p>
          <p style={{ margin: 0 }}>All music streams legally via 30-second previews. No napster lawsuits were involved in the making of this product.</p>
        </div>
        <div className="dialog-btns">
          <button className="btn-aero" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

export function AddToMixDialog({ open, track, mixes, onPick, onNew, onCancel }) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <div className="dialog-title">Add to a Mix CD</div>
        <div className="dialog-body">
          <label>Add "{track?.name}" to which Mix CD?</label>
          <div className="pick-list">
            {mixes.map((m, i) => (
              <button key={i} className="pick-row" onClick={() => onPick(i)}>{m.name}</button>
            ))}
            <button className="pick-row" onClick={onNew}>+ burn a new CD</button>
          </div>
        </div>
        <div className="dialog-btns">
          <button className="btn btn-chrome" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
