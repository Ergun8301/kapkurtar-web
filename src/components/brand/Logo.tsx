import { useId } from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
}

// Icône KapKurtar : carré arrondi menthe "croqué", bol + point citron
export function LogoMark({ size = 36, className }: LogoMarkProps) {
  const maskId = `kk-bite-${useId().replace(/:/g, '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="64" height="64" fill="white" />
          <circle cx="58" cy="6" r="13" fill="black" />
        </mask>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="19" fill="#00E0B8" mask={`url(#${maskId})`} />
      <circle cx="54" cy="10" r="5" fill="#D7FF3C" />
      <path d="M16 30 Q32 52 48 30" fill="none" stroke="#0D0E12" strokeWidth="7" strokeLinecap="round" />
      <circle cx="32" cy="22" r="5" fill="#0D0E12" />
    </svg>
  );
}

interface LogoProps {
  size?: number;
  tone?: 'light' | 'dark';
  className?: string;
}

// Logo complet : icône + "kapkurtar" (tone="light" sur fond sombre)
export default function Logo({ size = 34, tone = 'light', className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span
        className={`font-display font-extrabold tracking-tight ${tone === 'light' ? 'text-white' : 'text-kk-night'}`}
        style={{ fontSize: Math.round(size * 0.68), letterSpacing: '-0.04em', lineHeight: 1 }}
      >
        kapkurtar
      </span>
    </span>
  );
}
