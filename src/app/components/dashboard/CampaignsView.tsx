"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  Bookmark01Icon,
  Cancel01Icon,
  GridViewIcon,
  LayoutListIcon,
  Search01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Card } from "./ui";

type CampaignTab = "campanhas" | "entregas" | "candidatos" | "pedidos";
type StatusFilter = "ativas" | "arquivadas" | "rascunhos";
type ViewMode = "grid" | "list";

const TABS: { id: CampaignTab; label: string }[] = [
  { id: "campanhas", label: "Campanhas" },
  { id: "entregas", label: "Entregas" },
  { id: "candidatos", label: "Candidatos" },
  { id: "pedidos", label: "Pedidos" },
];

const TEMPLATES = [
  {
    title: "Lançamento de Produto",
    tag: "UGC · 30 posts/mês",
    desc: "Vídeos curtos de demonstração e primeiras impressões no TikTok e Instagram Reels.",
  },
  {
    title: "Anúncios de Performance",
    tag: "Anúncios pagos · 15 posts/mês",
    desc: "Variações de gancho nos primeiros 3 segundos focadas em cliques e vendas.",
  },
  {
    title: "Alcance Orgânico em Angola",
    tag: "Influenciadores · 20 posts/mês",
    desc: "Criadores de Luanda, Benguela e Huíla publicam nas próprias contas.",
  },
];

export default function CampaignsView() {
  const [tab, setTab] = useState<CampaignTab>("campanhas");
  const [status, setStatus] = useState<StatusFilter>("ativas");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);

  useEffect(() => {
    if (!templatesOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTemplatesOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [templatesOpen]);

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-5">
      {/* Barra superior em vidro líquido */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Secções de campanhas"
          className="sq inline-flex max-w-full overflow-x-auto rounded-full bg-(--nv-fill) p-[3px]"
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
                className={`h-9 shrink-0 cursor-pointer rounded-full px-4 text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200 ${
                  sel ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTemplatesOpen(true)}
            className="lg-control sq inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-(--nv-text)"
          >
            <HugeiconsIcon icon={Bookmark01Icon} size={15} strokeWidth={2} className="text-[#4EA7EB]" />
            Modelos
          </button>
          <Link href="/onboarding" className="nuvi-btn-sm sq !h-10 !px-5">
            <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
            Nova campanha
          </Link>
        </div>
      </div>

      {/* Tab: Campanhas */}
      {tab === "campanhas" ? (
        <>
          {/* Filtros de estado + pesquisa + grelha/lista */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Estado das campanhas">
              {(
                [
                  { id: "ativas", label: "Ativas" },
                  { id: "arquivadas", label: "Arquivadas" },
                  { id: "rascunhos", label: "Rascunhos" },
                ] as const
              ).map((s) => {
                const sel = status === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => setStatus(s.id)}
                    className={`sq inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-all ${
                      sel
                        ? "bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]"
                        : "text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-(--nv-text)"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="lg-control sq flex h-9 w-full items-center gap-2 rounded-full px-3.5 sm:w-56">
                <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
                <span className="sr-only">Pesquisar campanhas</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar"
                  className="w-full min-w-0 bg-transparent text-[13.5px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3) [&::-webkit-search-cancel-button]:hidden"
                />
              </label>

              <div className="sq inline-flex rounded-full bg-(--nv-fill) p-[3px]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Vista em grelha"
                  aria-pressed={viewMode === "grid"}
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all ${
                    viewMode === "grid" ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                  }`}
                >
                  <HugeiconsIcon icon={GridViewIcon} size={14} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="Vista em lista"
                  aria-pressed={viewMode === "list"}
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all ${
                    viewMode === "list" ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                  }`}
                >
                  <HugeiconsIcon icon={LayoutListIcon} size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Estado vazio limpo (sem campanhas mockadas) */}
          <Card className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <Image
              src={status === "ativas" ? "/icons/video.svg" : status === "arquivadas" ? "/icons/bag.svg" : "/icons/clock.svg"}
              alt=""
              width={80}
              height={70}
              className="select-none"
              draggable={false}
            />
            <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
              {status === "ativas"
                ? "Sem campanhas ativas"
                : status === "arquivadas"
                  ? "Sem campanhas arquivadas"
                  : "Sem rascunhos guardados"}
            </h2>
            <p className="mt-1.5 max-w-[340px] text-[13.5px] leading-relaxed text-(--nv-text-3)">
              {status === "ativas"
                ? "Lança a tua primeira campanha para começar a receber vídeos de criadores."
                : status === "arquivadas"
                  ? "Campanhas concluídas ou pausadas ficam guardadas aqui."
                  : "Se saíres a meio da criação de uma campanha, ela fica guardada aqui."}
            </p>
            {status === "ativas" && (
              <Link href="/onboarding" className="nuvi-btn-sm sq mt-6 !h-11 !px-6">
                <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
                Criar campanha
              </Link>
            )}
          </Card>
        </>
      ) : (
        /* Entregas, Candidatos, Pedidos */
        <Card className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <Image
            src={tab === "entregas" ? "/icons/video.svg" : tab === "candidatos" ? "/icons/profile.svg" : "/icons/discovery.svg"}
            alt=""
            width={80}
            height={70}
            className="select-none"
            draggable={false}
          />
          <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
            {tab === "entregas"
              ? "Nada por rever"
              : tab === "candidatos"
                ? "Sem candidaturas ainda"
                : "Sem pedidos pendentes"}
          </h2>
          <p className="mt-1.5 max-w-[360px] text-[13.5px] leading-relaxed text-(--nv-text-3)">
            {tab === "entregas"
              ? "Os vídeos enviados pelos criadores aparecem aqui para aprovares antes do pagamento."
              : tab === "candidatos"
                ? "Quando criadores se candidatarem às tuas campanhas, podes aceitá-los num toque."
                : "Convites enviados e respostas de criadores aparecem organizados aqui."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/painel/descobrir" className="lg-control sq inline-flex h-10 items-center rounded-full px-5 text-[13.5px] font-semibold text-(--nv-text)">
              Descobrir criadores
            </Link>
            <Link href="/onboarding" className="nuvi-btn-sm sq !h-10 !px-5">
              <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.4} />
              Nova campanha
            </Link>
          </div>
        </Card>
      )}

      {/* Modal de Modelos */}
      {templatesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Modelos de campanha"
          onClick={() => setTemplatesOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-(--nv-scrim) p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="nuvi-pop nuvi-modal-card sq !max-w-[520px] !items-stretch !rounded-[32px] !p-7 !text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-bold tracking-[-0.022em] text-(--nv-text)">Modelos prontos</h2>
                <p className="mt-0.5 text-[13px] text-(--nv-text-3)">Começa com uma estrutura já afinada.</p>
              </div>
              <button
                type="button"
                onClick={() => setTemplatesOpen(false)}
                aria-label="Fechar"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-(--nv-text)"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={17} strokeWidth={2} />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              {TEMPLATES.map((tpl) => (
                <Link
                  key={tpl.title}
                  href="/onboarding"
                  onClick={() => setTemplatesOpen(false)}
                  className="sq group flex items-start justify-between gap-4 rounded-[20px] border border-(--nv-line) bg-(--nv-solid) p-4 transition-all hover:border-[#4EA7EB]"
                >
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#4EA7EB]">
                      <HugeiconsIcon icon={SparklesIcon} size={12} strokeWidth={2.2} />
                      {tpl.tag}
                    </span>
                    <p className="mt-1 text-[15px] font-bold text-(--nv-text)">{tpl.title}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-(--nv-text-3)">{tpl.desc}</p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    strokeWidth={2}
                    className="mt-1 shrink-0 text-(--nv-text-3) transition-transform group-hover:translate-x-0.5 group-hover:text-[#4EA7EB]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
