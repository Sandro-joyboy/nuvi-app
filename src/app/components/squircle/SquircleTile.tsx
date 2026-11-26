// Tile com cantos contínuos (superelipse n=5) — geometria da skill
// .claude/skills/squircle. Tamanho fixo, por isso o path é calculado
// uma vez, sem medir o DOM.
import { useId, type ReactNode } from "react";
import { squirclePath } from "./superellipse";

interface SquircleTileProps {
  size: number;
  /** Raio antes do smoothing. Padrão Apple: ~0.42 do lado. */
  radius?: number;
  /** Cores do gradiente vertical do corpo. */
  colors: [string, string];
  /** Brilho interno (aresta de vidro). */
  glass?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function SquircleTile({
  size,
  radius = Math.round(size * 0.42),
  colors,
  glass = true,
  className = "",
  children,
}: SquircleTileProps) {
  const uid = useId().replace(/:/g, "");
  const d = squirclePath({ width: size, height: size, radius, smoothing: 1 });

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={colors[0]} />
            <stop offset="1" stopColor={colors[1]} />
          </linearGradient>
          <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id={`sheen-${uid}`} cx="0.3" cy="0" r="0.9">
            <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`clip-${uid}`}>
            <path d={d} />
          </clipPath>
        </defs>
        <path d={d} fill={`url(#body-${uid})`} />
        {glass && (
          <>
            <path d={d} fill={`url(#sheen-${uid})`} />
            <path
              d={d}
              fill="none"
              stroke={`url(#rim-${uid})`}
              strokeWidth={2}
              clipPath={`url(#clip-${uid})`}
            />
          </>
        )}
      </svg>
      <span className="relative z-[1] flex items-center justify-center">
        {children}
      </span>
    </span>
  );
}
