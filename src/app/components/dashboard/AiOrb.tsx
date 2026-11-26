"use client";

// Orbe da Nuvi IA — bolha de vidro líquido com interior azul nebuloso.
// Camadas: corpo azul → nuvens internas a rodar → aro de vidro espesso com
// refrações claras/escuras → reflexos especulares. Um filtro SVG de
// turbulência deforma o contorno para parecer líquido. Só anima transform e
// o filtro; com "reduzir movimento" fica parada.
import { useId } from "react";

interface AiOrbProps {
  size?: number;
  className?: string;
}

export default function AiOrb({ size = 40, className = "" }: AiOrbProps) {
  const fid = `orb-liquid-${useId().replace(/:/g, "")}`;

  return (
    <span
      aria-hidden
      className={`ai-orb relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width="0" height="0" className="absolute">
        <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="noise">
            <animate
              className="ai-orb-anim"
              attributeName="baseFrequency"
              dur="9s"
              values="0.016;0.024;0.016"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={size * 0.13} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <span className="ai-orb-wobble absolute inset-0" style={{ filter: `url(#${fid})` }}>
        {/* Corpo */}
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_55%,#A9DAF5_0%,#73BCE6_42%,#4A9CCF_68%,#2C6F9E_88%,#1B4C70_100%)]" />

        {/* Nuvens internas */}
        <span className="ai-orb-clouds absolute inset-[10%] rounded-full opacity-90 blur-[2px] bg-[radial-gradient(40%_32%_at_35%_40%,rgba(255,255,255,0.55),transparent_70%),radial-gradient(35%_30%_at_68%_62%,rgba(214,240,255,0.5),transparent_70%),radial-gradient(30%_25%_at_55%_25%,rgba(130,190,230,0.6),transparent_70%)]" />

        {/* Aro de vidro espesso: refrações claras e escuras */}
        <span className="ai-orb-rim absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,rgba(255,255,255,0.95),rgba(40,48,58,0.55)_8%,rgba(255,255,255,0.7)_15%,rgba(180,205,222,0.3)_24%,rgba(30,36,44,0.6)_33%,rgba(255,255,255,0.9)_41%,rgba(160,190,210,0.25)_52%,rgba(255,255,255,0.85)_60%,rgba(35,42,52,0.55)_70%,rgba(230,242,250,0.8)_80%,rgba(60,70,82,0.45)_90%,rgba(255,255,255,0.95))] [mask:radial-gradient(circle,transparent_54%,#000_66%,#000_100%)]" />

        {/* Sombra interna do vidro espesso (dá volume ao aro) */}
        <span className="absolute inset-0 rounded-full shadow-[inset_0_0_6px_1px_rgba(20,40,60,0.35),inset_0_-3px_6px_rgba(255,255,255,0.35)]" />
        {/* Refrações escuras a rodar dentro do aro */}
        <span className="ai-orb-clouds absolute inset-[4%] rounded-full opacity-70 bg-[conic-gradient(from_120deg,transparent,rgba(25,32,40,0.55)_6%,transparent_14%,transparent_45%,rgba(240,250,255,0.8)_50%,transparent_56%,transparent_78%,rgba(25,32,40,0.45)_84%,transparent_90%)] [mask:radial-gradient(circle,transparent_60%,#000_72%,transparent_100%)]" />

        {/* Reflexos especulares */}
        <span className="absolute top-[12%] left-[24%] h-[18%] w-[34%] -rotate-[18deg] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),rgba(255,255,255,0))]" />
        <span className="absolute right-[16%] bottom-[16%] h-[9%] w-[14%] rotate-[30deg] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.85),rgba(255,255,255,0))]" />
      </span>

      {/* Contorno e sombra de contacto (fora do filtro, para ficar nítido) */}
      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_6px_14px_-6px_rgba(27,76,112,0.55)]" />
    </span>
  );
}
