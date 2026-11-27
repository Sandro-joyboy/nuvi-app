"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowUpRight01Icon,
  InboxCheckIcon,
  Notification02Icon,
  Tick02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import PerformanceCard from "./PerformanceCard";
import { Card, EmptyState, SectionHeader, ViewAllButton } from "./ui";
import { useDashboard } from "./dashboard-context";
import { useProfile } from "./prefs";

const fmtKz = (n: number) => `${n.toLocaleString("pt-PT")} Kz`;

const ghostCta =
  "lg-control sq inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)";

/** Conteúdo do Início (/painel). */
export default function HomeView() {
  const { balance, openWallet } = useDashboard();
  const profile = useProfile();

  return (
    <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-5">
        <PerformanceCard />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card aria-labelledby="top-title" className="flex min-h-[260px] flex-col">
            <SectionHeader
              id="top-title"
              title="Top conteúdos"
              subtitle="Últimos 30 dias"
              actions={<ViewAllButton label="Ver todos os conteúdos" />}
            />
            <EmptyState
              icon={
                <SquircleTile size={48} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                  <HugeiconsIcon
                    icon={Video01Icon}
                    size={22}
                    strokeWidth={1.8}
                    className="text-[#4EA7EB]"
                  />
                </SquircleTile>
              }
              title="Sem vídeos ainda"
              action={
                <Link href="/painel/descobrir" className={ghostCta}>
                  Descobrir criadores
                </Link>
              }
            />
          </Card>

          <Card aria-labelledby="sub-title" className="flex min-h-[260px] flex-col">
            <SectionHeader
              id="sub-title"
              title="Novas entregas"
              subtitle="Por rever"
              actions={<ViewAllButton label="Ver todas as entregas" />}
            />
            <EmptyState
              icon={
                <SquircleTile size={48} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
                  <HugeiconsIcon
                    icon={InboxCheckIcon}
                    size={22}
                    strokeWidth={1.8}
                    className="text-(--nv-text-2)"
                  />
                </SquircleTile>
              }
              title="Nada por rever"
              action={
                <Link href="/onboarding" className={ghostCta}>
                  <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.2} />
                  Criar campanha
                </Link>
              }
            />
          </Card>
        </div>
      </div>

      {/* Coluna direita */}
      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 xl:flex">
        {/* Carteira — vidro azul */}
        <section
          id="carteira"
          aria-labelledby="wallet-title"
          className="sq relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#4EA7EB] to-[#0076E8] p-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_0_0_0.5px_rgba(255,255,255,0.3),0_18px_40px_-18px_rgba(0,118,232,0.6)] sm:p-6 md:col-span-2 xl:col-span-1"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-white/20 blur-3xl"
          />
          <div className="relative flex items-start justify-between">
            <div>
              <h2 id="wallet-title" className="text-[17px] font-bold tracking-[-0.022em]">
                Carteira
              </h2>
              <p className="text-[12.5px] font-medium text-white/70">{profile.name || "Nuvi"} · AOA</p>
            </div>
            <Link href="/painel/pagamentos" aria-label="Abrir pagamentos" className="lg-tint flex h-9 w-9 cursor-pointer items-center justify-center rounded-full">
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2.2} />
            </Link>
          </div>

          <p className="font-title relative mt-6 text-[40px] font-bold leading-none tracking-[-0.04em] tabular-nums">
            {fmtKz(balance)}
          </p>
          <p className="relative mt-1.5 text-[12.5px] font-medium text-white/70">
            Disponível
          </p>

          <dl className="relative mt-5 divide-y divide-white/15 border-t border-white/15 text-[13px]">
            <div className="flex justify-between py-2.5">
              <dt className="text-white/75">A pagar</dt>
              <dd className="font-semibold tabular-nums">{fmtKz(0)}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-white/75">Pendente</dt>
              <dd className="font-semibold tabular-nums">{fmtKz(0)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={openWallet}
            className="sq relative mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white text-[14px] font-semibold text-[#0A0A0A] shadow-[inset_0_-1px_0_rgba(15,23,42,0.06),0_6px_16px_-6px_rgba(0,40,100,0.4)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.98]"
          >
            <HugeiconsIcon
              icon={Add01Icon}
              size={16}
              strokeWidth={2.4}
              className="text-[#0076E8]"
            />
            Carregar
          </button>
        </section>

        <Card aria-labelledby="att-title">
          <SectionHeader id="att-title" title="Atenção" />
          <EmptyState
            compact
            icon={
              <SquircleTile size={40} colors={["var(--nv-success-soft)", "var(--nv-success-soft)"]} glass={false}>
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={20}
                  strokeWidth={2.4}
                  className="text-[#34C759]"
                />
              </SquircleTile>
            }
            title="Tudo em dia"
          />
        </Card>

        <Card aria-labelledby="act-title">
          <SectionHeader id="act-title" title="Atividade" />
          <EmptyState
            compact
            icon={
              <SquircleTile size={40} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
                <HugeiconsIcon
                  icon={Notification02Icon}
                  size={19}
                  strokeWidth={1.9}
                  className="text-(--nv-text-3)"
                />
              </SquircleTile>
            }
            title="Sem atividade"
          />
        </Card>
      </div>
    </div>
  );
}
