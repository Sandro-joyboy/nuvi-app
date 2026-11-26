// Orbe da Nuvi IA — anel de luz azul nítido, com núcleo branco.
// Três anéis em conic-gradient rodam a velocidades diferentes, com desfoque
// leve, para dar o efeito de redemoinho. Só anima transform; com
// "reduzir movimento" fica parada.

interface AiOrbProps {
  size?: number;
  className?: string;
}

const RING_MASK =
  "radial-gradient(circle, transparent 38%, #000 44%, #000 68%, transparent 74%)";

export default function AiOrb({ size = 40, className = "" }: AiOrbProps) {
  const blur = (k: number) => `blur(${size * k}px)`;

  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Halo exterior */}
      <span
        className="absolute -inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.35)_40%,rgba(167,139,250,0.12)_60%,transparent_72%)]"
        style={{ filter: blur(0.025) }}
      />

      {/* Anel principal */}
      <span
        className="ai-orb-clouds absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#BFE6FF,#6FC3FF_20%,#2F80F5_42%,#3B6CF6_55%,#9CD8FF_72%,#E3F4FF_86%,#BFE6FF)]"
        style={{ mask: RING_MASK, WebkitMask: RING_MASK, filter: blur(0.012) }}
      />

      {/* Anel secundário, deslocado — dá o redemoinho */}
      <span
        className="ai-orb-rim absolute inset-[6%] translate-x-[3%] rounded-full opacity-80 bg-[conic-gradient(from_40deg,transparent,#4FB4FF_18%,#1E6FF0_34%,transparent_52%,#8FD4FF_70%,#A78BFA_82%,transparent)]"
        style={{ mask: RING_MASK, WebkitMask: RING_MASK, filter: blur(0.008) }}
      />

      {/* Fio de luz ciano */}
      <span
        className="ai-orb-wobble absolute inset-[10%] rounded-full opacity-70 bg-[conic-gradient(from_300deg,transparent_55%,#5EEBFF_70%,transparent_82%)]"
        style={{ mask: RING_MASK, WebkitMask: RING_MASK, filter: blur(0.004) }}
      />

      {/* Núcleo branco */}
      <span
        className="absolute inset-[30%] rounded-full bg-white"
        style={{ filter: blur(0.01) }}
      />
    </span>
  );
}
