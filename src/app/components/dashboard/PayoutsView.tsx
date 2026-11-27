"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FlashIcon,
  Search01Icon,
  Shield01Icon,
  Tick02Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import { useCampaign } from "@/app/components/onboarding/campaign";
import { useDashboard } from "./dashboard-context";
import { Card, SectionHeader } from "./ui";

type PayoutTab = "pendentes" | "historico" | "disputas";
type StatusFilter = "todos" | "vencer" | "atrasados" | "bonus";

const TABS: { id: PayoutTab; label: string }[] = [
  { id: "pendentes", label: "Pendentes" },
  { id: "historico", label: "Histórico" },
  { id: "disputas", label: "Disputas" },
];

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "vencer", label: "A vencer" },
  { id: "atrasados", label: "Atrasados" },
  { id: "bonus", label: "Bónus" },
];

const RULES = [
  {
    title: "Aprovação antes de pagar",
    body: "Só libertas Kwanzas depois de aprovar cada vídeo.",
    icon: Shield01Icon,
    tint: ["var(--nv-accent-soft)", "var(--nv-accent-soft)"] as [string, string],
    color: "text-[#4EA7EB]",
  },
  {
    title: "Pagamento num clique",
    body: "Carrega por Multicaixa Express ou referência bancária.",
    icon: FlashIcon,
    tint: ["var(--nv-success-soft)", "var(--nv-success-soft)"] as [string, string],
    color: "text-[#34C759]",
  },
  {
    title: "Cálculo automático",
    body: "Valores fixos, CPM e bónus de views somados sem folhas de cálculo.",
    icon: CheckmarkCircle02Icon,
    tint: ["var(--nv-tile)", "var(--nv-tile)"] as [string, string],
    color: "text-(--nv-text-2)",
  },
];

const fmtKz = (n: number) => `${n.toLocaleString("pt-PT")} Kz`;

export default function PayoutsView() {
  const { balance, openWallet } = useDashboard();
  const campaign = useCampaign();

  const [tab, setTab] = useState<PayoutTab>("pendentes");
  const [filter, setFilter] = useState<StatusFilter>("todos");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* Coluna principal */}
      <div className="flex min-w-0 flex-col gap-5">
        {/* Resumo limpo de 2 cartões */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="flex items-center justify-between gap-4 !py-5">
            <div>
              <p className="text-[12.5px] font-medium text-(--nv-text-3)">A pagar agora</p>
              <p className="font-title mt-1.5 text-[30px] leading-none font-bold tracking-[-0.035em] text-(--nv-text) tabular-nums">
                {fmtKz(0)}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1E9E47] dark:text-[#34C759]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />
                Tudo em dia
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotice("Não tens pagamentos pendentes para aprovar neste momento.")}
              className="lg-control sq h-10 shrink-0 cursor-pointer rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
            >
              Rever e pagar
            </button>
          </Card>

          <Card className="flex items-center justify-between gap-4 !py-5">
            <div>
              <p className="text-[12.5px] font-medium text-(--nv-text-3)">Pago este mês</p>
              <p className="font-title mt-1.5 text-[30px] leading-none font-bold tracking-[-0.035em] text-(--nv-text) tabular-nums">
                {fmtKz(0)}
              </p>
              <p className="mt-2 text-[12px] font-medium text-(--nv-text-3)">
                0 transferências concluídas
              </p>
            </div>
            <SquircleTile size={46} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
              <HugeiconsIcon icon={Wallet02Icon} size={21} strokeWidth={1.8} className="text-[#4EA7EB]" />
            </SquircleTile>
          </Card>
        </div>

        {/* Aviso subtil */}
        {notice && (
          <div
            role="status"
            className="nuvi-step lg-surface sq flex items-center justify-between gap-3 rounded-[20px] px-4 py-3 text-[13.5px] text-(--nv-text)"
          >
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.4} className="text-[#34C759]" />
              {notice}
            </span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Fechar"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill)"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2.2} />
            </button>
          </div>
        )}

        {/* Cartão principal de movimentos */}
        <Card className="flex min-h-[440px] flex-col">
          {/* Topo: controlo segmentado + pesquisa */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Secções de pagamentos"
              className="sq inline-flex rounded-full bg-(--nv-fill) p-[3px]"
            >
              {TABS.map((t) => {
                const sel = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={sel}
                    onClick={() => setTab(t.id)}
                    className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold transition-all duration-200 ${
                      sel ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <label className="lg-control sq flex h-9 w-full items-center gap-2 rounded-full px-3.5 sm:w-56">
              <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
              <span className="sr-only">Pesquisar pagamentos</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar"
                className="w-full min-w-0 bg-transparent text-[13.5px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3) [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
          </div>

          {/* Filtros rápidos em pílulas leves (só em Pendentes) */}
          {tab === "pendentes" && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Filtrar pendentes">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFilter(f.id)}
                    className={`sq inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-all ${
                      active
                        ? "bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]"
                        : "text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-(--nv-text)"
                    }`}
                  >
                    {f.label}
                    <span className="text-[11px] opacity-70 tabular-nums">0</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Estado vazio 100% Nuvi */}
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-14 text-center">
            <Image
              src={tab === "pendentes" ? "/icons/wallet.svg" : tab === "historico" ? "/icons/tick.svg" : "/icons/info.svg"}
              alt=""
              width={78}
              height={68}
              className="select-none"
              draggable={false}
            />
            <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
              {tab === "pendentes"
                ? "Sem pagamentos pendentes"
                : tab === "historico"
                  ? "Sem movimentos ainda"
                  : "Sem disputas abertas"}
            </h2>
            <p className="mt-1.5 max-w-[360px] text-[13.5px] leading-relaxed text-(--nv-text-3)">
              {tab === "pendentes"
                ? "Os pagamentos aparecem aqui assim que aprovares conteúdos de criadores nas tuas campanhas."
                : tab === "historico"
                  ? "Todos os comprovativos e transferências em Kwanzas ficam guardados aqui."
                  : "Qualquer revisão de pagamento com um criador é tratada de forma simples por aqui."}
            </p>

            {tab === "pendentes" && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  href={campaign ? "/painel/descobrir" : "/onboarding"}
                  className="nuvi-btn-sm sq !h-11 !px-6"
                >
                  {campaign ? (
                    "Descobrir criadores"
                  ) : (
                    <>
                      <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
                      Criar campanha
                    </>
                  )}
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Coluna direita — Carteira Nuvi + Como funciona */}
      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 xl:flex">
        {/* Carteira — cartão vidro azul assinatura da Nuvi */}
        <section
          aria-labelledby="payouts-wallet-title"
          className="sq relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#4EA7EB] to-[#0076E8] p-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_0_0_0.5px_rgba(255,255,255,0.3),0_18px_40px_-18px_rgba(0,118,232,0.6)] sm:p-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-white/20 blur-3xl"
          />
          <div className="relative flex items-start justify-between">
            <div>
              <h2 id="payouts-wallet-title" className="text-[17px] font-bold tracking-[-0.022em]">
                Carteira
              </h2>
              <p className="text-[12.5px] font-medium text-white/75">
                {campaign?.brandName || "Nuvi"} · AOA
              </p>
            </div>
            <span className="lg-tint rounded-full px-2.5 py-1 text-[11px] font-semibold">
              Kwanzas
            </span>
          </div>

          <p className="font-title relative mt-6 text-[38px] leading-none font-bold tracking-[-0.04em] tabular-nums">
            {fmtKz(balance)}
          </p>
          <p className="relative mt-1.5 text-[12.5px] font-medium text-white/75">
            Saldo disponível
          </p>

          <dl className="relative mt-5 divide-y divide-white/15 border-t border-white/15 text-[13px]">
            <div className="flex justify-between py-2.5">
              <dt className="text-white/75">Reservado em campanhas</dt>
              <dd className="font-semibold tabular-nums">{fmtKz(0)}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-white/75">Em processamento</dt>
              <dd className="font-semibold tabular-nums">{fmtKz(0)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={openWallet}
            className="sq relative mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white text-[14px] font-semibold text-[#0A0A0A] shadow-[inset_0_-1px_0_rgba(15,23,42,0.06),0_6px_16px_-6px_rgba(0,40,100,0.4)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.98]"
          >
            <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} className="text-[#0076E8]" />
            Carregar carteira
          </button>
        </section>

        {/* Como funciona — cartão calmo estilo Apple */}
        <Card>
          <SectionHeader title="Pagamentos simples" subtitle="Feitos para marcas em Angola" />
          <ul className="mt-4 flex flex-col gap-3.5">
            {RULES.map((rule) => (
              <li key={rule.title} className="flex items-start gap-3">
                <SquircleTile size={38} colors={rule.tint} glass={false}>
                  <HugeiconsIcon icon={rule.icon} size={18} strokeWidth={1.9} className={rule.color} />
                </SquircleTile>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-(--nv-text)">{rule.title}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-(--nv-text-3)">{rule.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
