"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  JusticeScale01Icon,
  Money01Icon,
  ReceiptIcon,
  Search01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import { useCampaign } from "@/app/components/onboarding/campaign";
import { useDashboard } from "./dashboard-context";
import { Card } from "./ui";

type PayoutTab = "pagamentos" | "historico" | "disputas";
type StatusFilter = "todos" | "vencer" | "atrasados" | "bonus";

const TABS: { id: PayoutTab; label: string; icon: typeof Money01Icon }[] = [
  { id: "pagamentos", label: "Pagamentos", icon: Money01Icon },
  { id: "historico", label: "Histórico", icon: ReceiptIcon },
  { id: "disputas", label: "Disputas", icon: JusticeScale01Icon },
];

const FILTERS: { id: StatusFilter; label: string; dot?: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "vencer", label: "A vencer" },
  { id: "atrasados", label: "Atrasados", dot: "#FF3B30" },
  { id: "bonus", label: "Bónus" },
];

const BENEFITS = [
  "Cálculos automáticos",
  "Controlo de desempenho",
  "Pagamento num clique",
  "Regras claras (CPM, fixo e bónus)",
];

const fmtKz = (n: number) => `${n.toLocaleString("pt-PT")} Kz`;

export default function PayoutsView() {
  const { balance, openWallet } = useDashboard();
  const campaign = useCampaign();

  const [tab, setTab] = useState<PayoutTab>("pagamentos");
  const [filter, setFilter] = useState<StatusFilter>("todos");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-5">
      {/* Saldo discreto abaixo do título */}
      <p className="-mt-2 text-[13.5px] font-medium text-(--nv-text-3) tabular-nums">
        Saldo Nuvi: <strong className="font-semibold text-(--nv-text)">{fmtKz(balance)}</strong>
      </p>

      {/* Separadores */}
      <div
        role="tablist"
        aria-label="Secções de pagamentos"
        className="flex items-center gap-1 border-b border-(--nv-line) sm:gap-2"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`relative inline-flex cursor-pointer items-center gap-2 px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
                active ? "text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
              }`}
            >
              <HugeiconsIcon
                icon={t.icon}
                size={16}
                strokeWidth={active ? 2.1 : 1.8}
                className={active ? "text-[#4EA7EB]" : "text-(--nv-text-3)"}
              />
              {t.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-[#4EA7EB]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Barra de ações estilo Apple */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pílula de valor a pagar + Rever e pagar */}
          <div className="sq inline-flex items-center gap-2.5 rounded-full border border-[#34C759]/25 bg-(--nv-success-soft) py-1 pr-1.5 pl-3.5">
            <span className="h-2 w-2 rounded-full bg-[#34C759]" />
            <span className="text-[13.5px] font-semibold text-[#188038] tabular-nums dark:text-[#34C759]">
              0 Kz a pagar
            </span>
            <button
              type="button"
              onClick={() => setNotice("Não tens pagamentos pendentes para rever neste momento.")}
              className="sq cursor-pointer rounded-full bg-(--nv-solid) px-3 py-1 text-[12px] font-semibold text-(--nv-text) shadow-[0_1px_4px_rgba(15,23,42,0.08)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Rever e pagar
            </button>
          </div>

          {/* Botão Carteira */}
          <button
            type="button"
            onClick={openWallet}
            className="lg-control sq inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold text-(--nv-text)"
          >
            <HugeiconsIcon icon={Wallet01Icon} size={16} strokeWidth={1.9} className="text-[#4EA7EB]" />
            Carteira
            <span className="rounded-full bg-(--nv-fill) px-2 py-0.5 text-[11.5px] font-semibold text-(--nv-text-2) tabular-nums">
              {fmtKz(balance)}
            </span>
          </button>
        </div>

        {/* Filtros + pesquisa (no separador Pagamentos) */}
        {tab === "pagamentos" && (
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="radiogroup"
              aria-label="Filtrar pagamentos"
              className="sq inline-flex rounded-full bg-(--nv-fill) p-[3px]"
            >
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFilter(f.id)}
                    className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-all duration-200 ${
                      active ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                    }`}
                  >
                    {f.label}
                    <span
                      className={`inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10.5px] font-semibold tabular-nums ${
                        active
                          ? "bg-(--nv-text) text-(--nv-solid)"
                          : f.dot
                            ? "bg-[#FF3B30]/12 text-[#FF3B30]"
                            : "bg-(--nv-fill) text-(--nv-text-3)"
                      }`}
                    >
                      0
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="lg-surface sq flex h-9 w-full items-center gap-2 rounded-full px-3.5 transition-shadow focus-within:shadow-[0_0_0_2px_#4EA7EB] sm:w-56">
              <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar pagamentos…"
                aria-label="Pesquisar pagamentos"
                className="h-full w-full bg-transparent text-[13px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3)"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notificação discreta */}
      {notice && (
        <div
          role="status"
          className="nuvi-step lg-surface sq flex items-center justify-between gap-3 rounded-[16px] border border-[#4EA7EB]/25 bg-(--nv-accent-soft)/60 px-4 py-2.5 text-[13px] text-(--nv-text)"
        >
          <span>{notice}</span>
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

      {/* Cartão principal da tabela */}
      <Card className="overflow-hidden !p-0">
        {/* Cabeçalho da tabela */}
        <div className="grid grid-cols-4 gap-3 border-b border-(--nv-line) bg-(--nv-fill-2) px-6 py-3 text-[12px] font-semibold text-(--nv-text-3)">
          <span>{tab === "disputas" ? "Criador" : "Nome"}</span>
          <span>Campanha</span>
          <span>{tab === "historico" ? "Data" : tab === "disputas" ? "Estado" : "Ciclo"}</span>
          <span className="text-right">Valor</span>
        </div>

        {/* Estado vazio sereno estilo Apple */}
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
          <SquircleTile
            size={56}
            colors={
              tab === "pagamentos"
                ? ["var(--nv-accent-soft)", "var(--nv-accent-soft)"]
                : ["var(--nv-tile)", "var(--nv-tile)"]
            }
            glass={false}
          >
            <HugeiconsIcon
              icon={tab === "pagamentos" ? Money01Icon : tab === "historico" ? ReceiptIcon : JusticeScale01Icon}
              size={24}
              strokeWidth={1.8}
              className={tab === "pagamentos" ? "text-[#4EA7EB]" : "text-(--nv-text-2)"}
            />
          </SquircleTile>

          <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
            {tab === "pagamentos"
              ? "Sem pagamentos pendentes"
              : tab === "historico"
                ? "Ainda não fizeste pagamentos"
                : "Sem disputas abertas"}
          </h2>

          <p className="mt-1.5 max-w-[400px] text-[14px] leading-relaxed text-(--nv-text-3)">
            {tab === "pagamentos"
              ? "Cria a tua primeira campanha e aprova conteúdos de criadores. Só pagas o que aprovares."
              : tab === "historico"
                ? "Todos os recibos e transferências em Kwanzas ficam arquivados aqui automaticamente."
                : "Quando houver alguma revisão de pagamento com um criador, acompanhas tudo por aqui."}
          </p>

          {tab === "pagamentos" && (
            <>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {campaign ? (
                  <Link href="/painel/descobrir" className="nuvi-btn !h-11 !px-6 !text-[14px]">
                    Descobrir criadores
                  </Link>
                ) : (
                  <Link href="/onboarding" className="nuvi-btn !h-11 !px-6 !text-[14px]">
                    <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
                    Criar a tua primeira campanha
                  </Link>
                )}
                <button
                  type="button"
                  onClick={openWallet}
                  className="lg-control sq inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-5 text-[14px] font-semibold text-(--nv-text)"
                >
                  Carregar carteira
                </button>
              </div>

              {/* Pílulas de confiança */}
              <div className="mt-8 flex max-w-[560px] flex-wrap items-center justify-center gap-2">
                {BENEFITS.map((b) => (
                  <span
                    key={b}
                    className="sq inline-flex items-center gap-2 rounded-full border border-(--nv-line) bg-(--nv-solid) px-3.5 py-1.5 text-[12px] font-medium text-(--nv-text-2)"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />
                    {b}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
