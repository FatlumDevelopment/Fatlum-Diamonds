import type { Shape } from "@/lib/types";

const PATHS: Record<Shape, string> = {
  round: "M100 28 A72 72 0 1 1 99.9 28 Z",
  princess: "M40 40 H160 V160 H40 Z",
  cushion: "M72 34 H128 Q166 34 166 72 V128 Q166 166 128 166 H72 Q34 166 34 128 V72 Q34 34 72 34 Z",
  oval: "M100 22 C142 22 162 58 162 100 C162 142 142 178 100 178 C58 178 38 142 38 100 C38 58 58 22 100 22 Z",
  emerald: "M68 30 H132 L170 62 V138 L132 170 H68 L30 138 V62 Z",
  pear: "M100 24 C148 58 164 108 100 178 C36 108 52 58 100 24 Z",
  marquise: "M100 18 C152 52 166 100 100 182 C34 100 48 52 100 18 Z",
  radiant: "M56 36 H144 L172 64 V136 L144 164 H56 L28 136 V64 Z",
  asscher: "M62 36 H138 L164 62 V138 L138 164 H62 L36 138 V62 Z",
  heart: "M100 170 C28 118 30 70 62 52 C82 42 96 56 100 72 C104 56 118 42 138 52 C170 70 172 118 100 170 Z",
};

export function DiamondShape({ shape, title, className = "", idSuffix = "" }: { shape: Shape; title?: string; className?: string; idSuffix?: string }) {
  const id = `d-${shape}-${(idSuffix || title || "mark").replace(/[^a-z0-9]+/gi, "")}`;
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title || shape}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#e6eef8" />
          <stop offset="1" stopColor="#c5d0e2" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={PATHS[shape]} />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#f8f5ee" />
      <path d={PATHS[shape]} fill={`url(#${id}-fill)`} stroke="#bf9e50" strokeWidth="3" />
      <g clipPath={`url(#${id}-clip)`} stroke="#243673" strokeWidth="1.15" opacity="0.55">
        <path d="M100 36 L148 78 L100 100 L52 78 Z" fill="rgba(255,255,255,.72)" />
        <path d="M52 78 L100 100 L58 150 Z" fill="rgba(191,158,80,.18)" />
        <path d="M148 78 L100 100 L142 150 Z" fill="rgba(3,18,63,.08)" />
        <path d="M58 150 L100 100 L142 150 L100 168 Z" fill="rgba(255,255,255,.45)" />
        <path d="M100 36 V168 M52 78 H148 M58 150 H142 M76 58 L100 100 L124 58" fill="none" />
      </g>
      <path d="M100 86 L114 100 L100 114 L86 100 Z" fill="rgba(255,255,255,.9)" stroke="#bf9e50" strokeWidth="1.2" />
    </svg>
  );
}
