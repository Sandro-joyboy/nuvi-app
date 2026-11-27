"use client";

import { useEffect, useRef } from "react";

/** Tons do azul Nuvi + branco: festa suave, sem arco-íris. */
const COLORS = ["#4EA7EB", "#8FCBF5", "#CFE8FB", "#2F8BE0", "#FFFFFF"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  sway: number;
  phase: number;
  color: string;
  round: boolean;
}

/**
 * Confete leve em <canvas>: cai devagar, balança e desaparece em ~3,5 s.
 * Não intercepta cliques, é ignorado por leitores de ecrã e não aparece
 * com "reduzir movimento".
 */
export default function Confetti({ count = 90, duration = 3600 }: { count?: number; duration?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = window.innerWidth;
    const pieces: Piece[] = Array.from({ length: count }, () => ({
      x: w * (0.15 + Math.random() * 0.7),
      y: -20 - Math.random() * window.innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.2 + Math.random() * 1.6,
      size: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.12,
      sway: 0.6 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() < 0.35,
    }));

    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = now - start;
      const fade = t > duration - 900 ? Math.max(0, (duration - t) / 900) : 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx + Math.sin(t / 380 + p.phase) * p.sway * 0.35;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = fade * 0.95;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        // peças brancas com contorno azul ténue para se verem no fundo claro
        if (p.color === "#FFFFFF") {
          ctx.strokeStyle = "rgba(78,167,235,0.45)";
          ctx.lineWidth = 1;
        }
        ctx.beginPath();
        if (p.round) ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        else ctx.roundRect(-p.size / 2, -p.size / 3.2, p.size, p.size / 1.6, 2);
        ctx.fill();
        if (p.color === "#FFFFFF") ctx.stroke();
        ctx.restore();
      }
      if (t < duration) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, duration]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[80] h-full w-full" />;
}
