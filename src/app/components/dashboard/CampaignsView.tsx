"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Archive01Icon,
  ArrowRight01Icon,
  Bookmark01Icon,
  Cancel01Icon,
  GridViewIcon,
  InstagramIcon,
  LayoutListIcon,
  Search01Icon,
  SparklesIcon,
  TiktokIcon,
} from "@hugeicons/core-free-icons";
import {
  computePlanProjection,
  formatKwanzas,
  getPresetPostsForBudget,
  loadDraft,
  useCampaign,
  useHydrated,
  type CampaignDraft,
  type Goal,
} from "@/app/components/onboarding/campaign";
import { ALL_CREATORS } from "@/app/components/onboarding/creators";
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

const GOAL_LABEL: Record<Goal, string> = {
  anuncios: "UGC para Anúncios",
  organico: "Conteúdo Orgânico",
  influenciadores: "Influenciadores",
};

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
  const hydrated = useHydrated();
  const campaign = useCampaign();

  const [tab, setTab] = useState<CampaignTab>("campanhas");
  const [status, setStatus] = useState<StatusFilter>("ativas");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [archived, setArchived] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  const draft: CampaignDraft | null = hydrated ? loadDraft() : null;
  const hasDraft = !!draft && (!!draft.goal || !!draft.brandName.trim() || draft.step > 0);

  const activeCount = campaign && !archived ? 1 : 0;
  const archivedCount = campaign && archived ? 1 : 0;
  const draftsCount = hasDraft ? 1 : 0;

  const campaignTitle = campaign?.campaignTitle || "Campanha de Criadores";
  const campaignBrand = campaign?.brandName || "A tua marca";
  const campaignMatchesQuery =
    !query.trim() ||
    `${campaignTitle} ${campaignBrand} ${campaign?.campaignBrief ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());

  const showLiveCampaign =
    !!campaign &&
    campaignMatchesQuery &&
    ((status === "ativas" && !archived) || (status === "arquivadas" && archived));

  const invitedCreators = ALL_CREATORS.filter((c) => campaign?.invitedCreators?.includes(c.id));
  const posts = campaign?.plannedPosts ?? getPresetPostsForBudget(campaign?.budget ?? null);
  const plan = computePlanProjection(posts);

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
                  { id: "ativas", label: "Ativas", count: activeCount },
                  { id: "arquivadas", label: "Arquivadas", count: archivedCount },
                  { id: "rascunhos", label: "Rascunhos", count: draftsCount },
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
                    {s.count > 0 && (
                      <span className="text-[11.5px] opacity-75 tabular-nums">{s.count}</span>
                    )}
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

          {/* Campanha ativa / arquivada */}
          {status !== "rascunhos" && showLiveCampaign && campaign && (
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3"}>
              <Card className={`flex flex-col gap-5 ${viewMode === "list" ? "sm:flex-row sm:items-center sm:justify-between" : ""}`}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`sq inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
                        archived
                          ? "bg-(--nv-fill) text-(--nv-text-3)"
                          : "bg-(--nv-success-soft) text-[#188038] dark:text-[#34C759]"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${archived ? "bg-(--nv-text-3)" : "bg-[#34C759]"}`} />
                      {archived ? "Arquivada" : "Ativa"}
                    </span>
                    <span className="text-[12px] font-medium text-(--nv-text-3)">
                      {GOAL_LABEL[campaign.goal ?? "organico"]}
                    </span>
                  </div>

                  <h2 className="mt-3 truncate text-[19px] font-bold tracking-[-0.025em] text-(--nv-text)">
                    {campaignTitle}
                  </h2>
                  <p className="text-[13px] text-(--nv-text-3)">{campaignBrand}</p>

                  {viewMode === "grid" && campaign.campaignBrief && (
                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-(--nv-text-2)">
                      {campaign.campaignBrief}
                    </p>
                  )}
                </div>

                <div className={`flex flex-wrap items-center gap-5 ${viewMode === "grid" ? "border-t border-(--nv-line) pt-4" : ""}`}>
                  <div>
                    <p className="text-[11px] font-medium text-(--nv-text-3)">Orçamento</p>
                    <p className="font-title text-[17px] font-bold text-(--nv-text) tabular-nums">
                      {formatKwanzas(plan.spendKz)}/mês
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-(--nv-text-3)">Volume</p>
                    <p className="font-title text-[17px] font-bold text-(--nv-text) tabular-nums">
                      {plan.posts} posts
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(campaign.platforms ?? ["tiktok", "instagram"]).map((p) => (
                      <span
                        key={p}
                        title={p === "instagram" ? "Instagram" : "TikTok"}
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${
                          p === "instagram"
                            ? "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
                            : "bg-[#111827] dark:bg-white/15"
                        }`}
                      >
                        <HugeiconsIcon icon={p === "instagram" ? InstagramIcon : TiktokIcon} size={13} strokeWidth={2.2} />
                      </span>
                    ))}
                  </div>
                  {invitedCreators.length > 0 && (
                    <div className="flex -space-x-2">
                      {invitedCreators.slice(0, 3).map((c) => (
                        <span
                          key={c.id}
                          title={c.name}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--nv-solid) text-[10px] font-bold text-white"
                          style={{ background: c.avatarBg }}
                        >
                          {c.initials}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/painel/descobrir"
                    className="lg-control sq inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-(--nv-text)"
                  >
                    Convidar criadores
                  </Link>
                  <button
                    type="button"
                    onClick={() => setArchived((v) => !v)}
                    aria-label={archived ? "Reativar campanha" : "Arquivar campanha"}
                    title={archived ? "Reativar campanha" : "Arquivar campanha"}
                    className="lg-control sq flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text-2) hover:text-(--nv-text)"
                  >
                    <HugeiconsIcon icon={Archive01Icon} size={16} strokeWidth={2} />
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Rascunho guardado */}
          {status === "rascunhos" && hasDraft && draft && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Card className="flex flex-col justify-between gap-5">
                <div>
                  <span className="sq inline-flex items-center rounded-full bg-(--nv-accent-soft) px-2.5 py-0.5 text-[11.5px] font-semibold text-[#0076E8] dark:text-[#60B5FF]">
                    Rascunho · Passo {Math.min(draft.step + 1, 8)}/8
                  </span>
                  <h2 className="mt-3 text-[19px] font-bold tracking-[-0.025em] text-(--nv-text)">
                    {draft.brandName.trim() || "Campanha em progresso"}
                  </h2>
                  <p className="mt-1 text-[13px] text-(--nv-text-3)">
                    {draft.goal ? GOAL_LABEL[draft.goal] : "Retoma exatamente onde paraste."}
                  </p>
                </div>
                <Link href="/onboarding" className="nuvi-btn-sm sq !h-10 w-full">
                  Continuar rascunho
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.2} />
                </Link>
              </Card>
            </div>
          )}

          {/* Estado vazio 100% Nuvi */}
          {((status !== "rascunhos" && !showLiveCampaign) || (status === "rascunhos" && !hasDraft)) && (
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
          )}
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
