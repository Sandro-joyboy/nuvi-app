"use client";

import Image from "next/image";
import { useRef } from "react";
import { useDialog } from "@/app/components/dashboard/useDialog";
import Confetti from "./Confetti";

/** Boas-vindas da marca na primeira vez que chega ao painel, com confete suave. */
export default function WelcomeDialog({
  email,
  brandName,
  campaignCreated,
  onClose,
}: {
  email: string;
  brandName?: string;
  campaignCreated: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useDialog(true, onClose, ref, btn);

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/20 backdrop-blur-[2px] dark:bg-black/45" />
      <Confetti />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-desc"
        className="nuvi-ui nuvi-welcome lg-surface sq relative w-full max-w-[400px] rounded-[32px] bg-(--nv-solid) px-7 pt-9 pb-7 text-center text-(--nv-text)"
      >
        <Image src="/Logo-icon.svg" alt="" width={250} height={167} unoptimized className="mx-auto h-[72px] w-auto" />
        <h2 id="welcome-title" className="mt-5 text-[26px] leading-tight font-bold tracking-[-0.03em] text-balance">
          {brandName ? `${brandName} já está na Nuvi` : "Bem-vindo à Nuvi"}
        </h2>
        <p id="welcome-desc" className="mt-2.5 text-[15px] leading-relaxed text-(--nv-text-2)">
          {campaignCreated ? "A tua conta e a tua primeira campanha estão criadas." : "A tua conta está criada."} Enviámos os
          próximos passos para <strong className="font-semibold break-all text-(--nv-text)">{email}</strong>.
        </p>
        <button ref={btn} type="button" onClick={onClose} className="nuvi-btn sq mt-7 w-full !h-12 !text-[15px]">
          Começar
        </button>
      </div>
    </div>
  );
}
