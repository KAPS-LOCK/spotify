export function fmtTime(sec) {
  if (!isFinite(sec)) return '--:--';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

export function feedTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
}
