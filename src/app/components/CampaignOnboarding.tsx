"use client";

import { useState } from "react";
import Link from "next/link";
import { Megaphone, Target, TrendingUp, type LucideIcon } from "lucide-react";
import {
  Check16,
  ChevronRight16,
  Close24,
  Info16,
} from "@/app/components/icons";

const STEPS = [
  "Objetivo",
  "Experiência",
  "Público-alvo",
  "Website",
  "Pesquisa",
  "Plano",
  "Criar",
];

type GoalId = "anuncios" | "organico" | "influenciadores";

const GOALS: {
  id: GoalId;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "anuncios",
    title: "Criativos para anúncios pagos",
    description: "Vídeos feitos para correr como anúncios. Pagas por desempenho.",
    icon: Target,
  },
  {
    id: "organico",
    title: "Conteúdo orgânico",
    description: "Publicações que geram alcance no TikTok e no Instagram.",
    icon: TrendingUp,
  },
  {
    id: "influenciadores",
    title: "Publicações de influenciadores",
    description: "Marcamos uma chamada rápida contigo.",
    icon: Megaphone,
  },
];

export default function CampaignOnboarding() {
  const currentStep = 0;
  const [goal, setGoal] = useState<GoalId | null>(null);

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center bg-cover bg-center bg-no-repeat px-4 pt-6 pb-16 font-sans"
      style={{ backgroundImage: "url('/bg-choice.svg')" }}
    >
      {/* Botão Fechar (Liquid Glass 40x40) */}
      <Link
        href="/painel"
        aria-label="Ir para o painel"
        className="nuvi-glass-icon-btn !fixed top-6 left-6 z-10 md:left-[88px]"
      >
        <Close24 size={22} />
      </Link>

      {/* Etapas no Topo */}
      <nav
        aria-label="Etapas da campanha"
        className="nuvi-text flex w-full max-w-[760px] flex-wrap items-center justify-center gap-1.5 pt-12 text-[13px] font-medium sm:gap-2 md:pt-1"
      >
        {STEPS.map((label, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          if (isActive) {
            return (
              <span
                key={label}
                className="rounded-full bg-white px-4 py-1.5 text-[#0A0A0A] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              >
                {index + 1}. {label}
              </span>
            );
          }

          if (isDone) {
            return (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white/95"
              >
                <Check16 size={14} />
                {label}
              </span>
            );
          }

          return (
            <span key={label} className="px-3 py-1.5 text-white/75">
              {index + 1}. {label}
            </span>
          );
        })}
      </nav>

      {/* Conteúdo */}
      <section className="mt-14 w-full max-w-[490px] sm:mt-20">
        <p className="nuvi-text text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
          A tua primeira campanha
        </p>
        <h1 className="nuvi-title mt-2 text-[28px] leading-[1.15] text-white sm:text-[34px]">
          O que queres que os creators criem?
        </h1>
        <p className="nuvi-text mt-2 text-[14px] text-white/90">
          Escolhe uma. Podes adicionar as outras depois.
        </p>

        <div className="mt-10">
          <div className="nuvi-text flex items-center gap-1.5 text-[14px] font-medium text-white">
            O teu objetivo
            <span className="text-[#FCA5A5]">*</span>
            <Info16 size={14} className="text-white/70" />
          </div>
          <p className="nuvi-text mt-0.5 text-[12.5px] text-white/80">
            Escolhe uma e vamos construir toda a tua primeira campanha à volta
            dela.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {GOALS.map(({ id, title, description, icon: Icon }) => {
              const isSelected = goal === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGoal(id)}
                  aria-pressed={isSelected}
                  className={`group flex w-full cursor-pointer items-center gap-3.5 rounded-[14px] border px-4 py-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-white/45 bg-[#4EA7EB] text-white shadow-[inset_0_0_12px_rgba(255,255,255,0.42),inset_0_1.5px_2px_rgba(255,255,255,0.52),0_8px_24px_rgba(0,90,180,0.18)]"
                      : "border-white/80 bg-white text-[#0A0A0A] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#4EA7EB]/60 hover:bg-[#F4F9FF]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border ${
                      isSelected
                        ? "border-white/60 bg-white text-[#4EA7EB]"
                        : "border-[#E4E4E7] bg-white text-[#52525B]"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="nuvi-title block text-[15px] font-medium tracking-[-0.01em]">
                      {title}
                    </span>
                    <span
                      className={`nuvi-text mt-0.5 block text-[12.5px] leading-snug ${
                        isSelected ? "text-white/90" : "text-[#71717A]"
                      }`}
                    >
                      {description}
                    </span>
                  </span>

                  <ChevronRight16
                    size={16}
                    className={
                      isSelected
                        ? "text-white"
                        : "text-[#A1A1AA] transition-transform group-hover:translate-x-0.5"
                    }
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/painel"
              className="nuvi-text text-[13px] font-medium text-white/85 underline underline-offset-4 transition-opacity hover:opacity-100"
            >
              Fazer mais tarde no painel
            </Link>

            <Link
              href={goal ? `/painel?objetivo=${goal}` : "/painel"}
              className={`nuvi-btn-sm !h-11 !px-6 ${
                goal ? "" : "pointer-events-none opacity-60"
              }`}
              aria-disabled={!goal}
            >
              Continuar para o painel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
