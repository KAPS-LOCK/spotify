import { SVG_ICONS } from '../../core/data';

export function IconDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9BD1F5" /><stop offset="1" stopColor="#2E7CC4" /></linearGradient>
        <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C9FA6A" /><stop offset="1" stopColor="#5BA30F" /></linearGradient>
        <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF9C9C" /><stop offset="1" stopColor="#C42A3A" /></linearGradient>
        <linearGradient id="gSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2F4F6" /><stop offset="1" stopColor="#9BA3AB" /></linearGradient>
        <linearGradient id="gManila" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE9A8" /><stop offset="1" stopColor="#D9A845" /></linearGradient>
        <radialGradient id="gDisc" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stopColor="#F8FAFC" /><stop offset="1" stopColor="#8FA0AC" /></radialGradient>
      </defs>
    </svg>
  );
}

export function Icon({ name }) {
  return (
    <svg className="ni" viewBox="0 0 16 16" aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: SVG_ICONS[name] || '' }} />
  );
}
