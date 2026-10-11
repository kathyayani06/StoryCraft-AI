import React from 'react';
import { CoverTheme } from '../types';

interface CoverArtProps {
  title: string;
  subtitle?: string;
  author: string;
  genre: string;
  theme?: CoverTheme;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

const THEME_STYLES: Record<CoverTheme, {
  bgGradient: string;
  borderColor: string;
  innerBorderColor: string;
  accentText: string;
  titleColor: string;
  emblemColor: string;
  ribbonBg: string;
}> = {
  'antique-gold': {
    bgGradient: 'bg-gradient-to-b from-[#231d17] via-[#1a140f] to-[#120d09]',
    borderColor: 'border-[#c8a951]/60',
    innerBorderColor: 'border-[#c8a951]/30',
    accentText: 'text-[#d4af37]',
    titleColor: 'text-[#fbf7ee]',
    emblemColor: '#d4af37',
    ribbonBg: 'bg-[#c8a951]',
  },
  'midnight-ink': {
    bgGradient: 'bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#030712]',
    borderColor: 'border-sky-400/50',
    innerBorderColor: 'border-sky-400/25',
    accentText: 'text-sky-300',
    titleColor: 'text-slate-100',
    emblemColor: '#7dd3fc',
    ribbonBg: 'bg-sky-400',
  },
  'moss-emerald': {
    bgGradient: 'bg-gradient-to-b from-[#14261c] via-[#0d1a13] to-[#07100b]',
    borderColor: 'border-emerald-400/50',
    innerBorderColor: 'border-emerald-400/25',
    accentText: 'text-emerald-300',
    titleColor: 'text-emerald-50',
    emblemColor: '#6ee7b7',
    ribbonBg: 'bg-emerald-400',
  },
  'crimson-velvet': {
    bgGradient: 'bg-gradient-to-b from-[#330c14] via-[#24080e] to-[#140407]',
    borderColor: 'border-rose-400/50',
    innerBorderColor: 'border-rose-400/25',
    accentText: 'text-rose-300',
    titleColor: 'text-rose-50',
    emblemColor: '#f43f5e',
    ribbonBg: 'bg-rose-400',
  },
  'celestial-sapphire': {
    bgGradient: 'bg-gradient-to-b from-[#171b3d] via-[#0f122c] to-[#090a19]',
    borderColor: 'border-amber-300/60',
    innerBorderColor: 'border-amber-300/30',
    accentText: 'text-amber-300',
    titleColor: 'text-indigo-50',
    emblemColor: '#fcd34d',
    ribbonBg: 'bg-amber-300',
  },
};

export const CoverArt: React.FC<CoverArtProps> = ({
  title,
  subtitle,
  author,
  genre,
  theme = 'antique-gold',
  size = 'md',
  className = '',
}) => {
  const currentTheme = THEME_STYLES[theme] || THEME_STYLES['antique-gold'];

  // Size configurations
  const dimensions = {
    sm: 'w-36 h-52 text-[10px]',
    md: 'w-56 h-80 text-xs',
    lg: 'w-72 h-[410px] text-sm',
    hero: 'w-full max-w-[340px] h-[480px] text-sm',
  }[size];

  return (
    <div
      className={`relative select-none aspect-[3/4.2] rounded-md shadow-2xl overflow-hidden flex flex-col justify-between p-5 border transition-transform duration-300 ${dimensions} ${currentTheme.bgGradient} border-stone-800/80 ${className}`}
      style={{
        boxShadow: '0 20px 35px -10px rgba(0,0,0,0.6), inset -6px 0 12px rgba(0,0,0,0.5), inset 3px 0 6px rgba(255,255,255,0.06)',
      }}
    >
      {/* Book spine shadow simulation on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10 pointer-events-none z-10" />

      {/* Outer filigree frame */}
      <div className={`absolute inset-2.5 rounded-sm border ${currentTheme.borderColor} pointer-events-none`} />
      <div className={`absolute inset-3.5 rounded-sm border ${currentTheme.innerBorderColor} pointer-events-none`} />

      {/* Decorative corner florets */}
      <div className="absolute top-3.5 left-3.5 w-2 h-2 border-t-2 border-l-2 border-current pointer-events-none text-amber-200/40" />
      <div className="absolute top-3.5 right-3.5 w-2 h-2 border-t-2 border-r-2 border-current pointer-events-none text-amber-200/40" />
      <div className="absolute bottom-3.5 left-3.5 w-2 h-2 border-b-2 border-l-2 border-current pointer-events-none text-amber-200/40" />
      <div className="absolute bottom-3.5 right-3.5 w-2 h-2 border-b-2 border-r-2 border-current pointer-events-none text-amber-200/40" />

      {/* Top Header: Genre */}
      <div className="relative z-10 text-center pt-2">
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.25em] font-medium opacity-90 ${currentTheme.accentText}`}
        >
          {genre || 'LITERARY NOVEL'}
        </span>
      </div>

      {/* Centerpiece: Title, Subtitle & Emblem */}
      <div className="relative z-10 my-auto text-center px-2 flex flex-col items-center">
        {/* Emblem SVG */}
        <div className="mb-3 opacity-90">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={currentTheme.emblemColor} strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
            <path d="M12 3v18M3 12h18" strokeWidth="0.8" />
            <polygon points="12,7 14,12 12,17 10,12" fill={currentTheme.emblemColor} fillOpacity="0.25" />
          </svg>
        </div>

        {/* Title */}
        <h2
          className={`font-editorial font-bold leading-tight tracking-tight px-1 ${currentTheme.titleColor} ${
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
          }`}
          style={{ textWrap: 'balance' }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="mt-1.5 text-[11px] font-serif italic text-stone-300/80 leading-snug line-clamp-2 max-w-[90%]"
          >
            {subtitle}
          </p>
        )}

        {/* Decorative divider */}
        <div className="w-12 h-px bg-current my-2.5 opacity-40 mx-auto" />
      </div>

      {/* Bottom Author Byline */}
      <div className="relative z-10 text-center pb-2">
        <span className="block font-mono text-[8px] uppercase tracking-widest text-stone-400/80">
          WRITTEN BY
        </span>
        <span
          className={`font-sans font-semibold text-xs tracking-wide ${currentTheme.titleColor}`}
        >
          {author || 'Author'}
        </span>
      </div>
    </div>
  );
};
