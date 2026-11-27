"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Archive01Icon,
  ArrowRight01Icon,
  Bookmark01Icon,
  Briefcase01Icon,
  Cancel01Icon,
  File01Icon,
  GridViewIcon,
  InboxCheckIcon,
  InstagramIcon,
  LayoutListIcon,
  Megaphone01Icon,
  Search01Icon,
  SparklesIcon,
  TiktokIcon,
  TrendingUpIcon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
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

type CampaignTab = "campanhas" | "entregas" | "candidatos" | "pedidos" | "briefings";
type StatusFilter = "ativas" | "arquivadas" | "rascunhos";
type ViewMode = "grid" | "list";

const TABS: { id: CampaignTab; label: string; icon: typeof Megaphone01Icon }[] = [
  { id: "campanhas", label: "Campanhas", icon: Megaphone01Icon },
  { id: "entregas", label: "Entregas", icon: InboxCheckIcon },
  { id: "candidatos", label: "Candidatos", icon: UserCheck01Icon },
  { id: "pedidos", label: "Pedidos", icon: File01Icon },
  { id: "briefings", label: "Briefings", icon: Briefcase01Icon },
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
    desc: "3 variações de gancho nos primeiros 3 segundos focadas em cliques e vendas.",
  },
  {
    title: "Alcance Orgânico em Angola",
    tag: "Influenciadores · 20 posts/mês",
    desc: "Criadores de Luanda, Benguela e Huíla publicam nas próprias contas para gerar descoberta.",
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
      {/* Subtítulo */}
      <p className="-mt-2 text-[13.5px] font-medium text-(--nv-text-3)">
        Gere e acompanha as tuas campanhas com criadores num só lugar.
      </p>

      {/* Separadores */}
      <div
        role="tablist"
        aria-label="Secções de campanhas"
        className="flex items-center gap-1 overflow-x-auto border-b border-(--nv-line) sm:gap-2"
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
              className={`relative inline-flex shrink-0 cursor-pointer items-center gap-2 px-3 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors ${
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

      {/* Tab: Campanhas */}
      {tab === "campanhas" ? (
        <>
          {/* Barra de ações */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/onboarding" className="nuvi-btn !h-10 !px-5 !text-[13.5px]">
                <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
                Nova campanha
              </Link>

              <div
                role="radiogroup"
                aria-label="Estado das campanhas"
                className="sq inline-flex rounded-full bg-(--nv-fill) p-[3px]"
              >
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
                      className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold transition-all duration-200 ${
                        sel ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                      }`}
                    >
                      {s.label}
                      {s.count > 0 && (
                        <span
                          className={`inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10.5px] font-bold tabular-nums ${
                            sel ? "bg-[#4EA7EB] text-white" : "bg-(--nv-fill) text-(--nv-text-2)"
                          }`}
                        >
                          {s.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="lg-surface sq flex h-10 w-full items-center gap-2 rounded-full px-3.5 transition-shadow focus-within:shadow-[0_0_0_2px_#4EA7EB] sm:w-56">
                <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar…"
                  aria-label="Pesquisar campanhas"
                  className="h-full w-full bg-transparent text-[13px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3)"
                />
              </div>

              <button
                type="button"
                onClick={() => setTemplatesOpen(true)}
                className="lg-control sq inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
              >
                <HugeiconsIcon icon={Bookmark01Icon} size={15} strokeWidth={2} className="text-[#4EA7EB]" />
                Modelos
              </button>

              <div className="sq inline-flex rounded-full bg-(--nv-fill) p-[3px]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Vista em grelha"
                  aria-pressed={viewMode === "grid"}
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all ${
                    viewMode === "grid" ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                  }`}
                >
                  <HugeiconsIcon icon={GridViewIcon} size={15} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="Vista em lista"
                  aria-pressed={viewMode === "list"}
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all ${
                    viewMode === "list" ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                  }`}
                >
                  <HugeiconsIcon icon={LayoutListIcon} size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Título da secção de estado */}
          <h2 className="text-[18px] font-bold tracking-[-0.022em] text-(--nv-text)">
            {status === "ativas" ? "Ativas" : status === "arquivadas" ? "Arquivadas" : "Rascunhos"}
          </h2>

          {/* Conteúdo: Ativas / Arquivadas */}
          {status !== "rascunhos" && showLiveCampaign && campaign && (
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3"}>
              <Card className={`flex flex-col gap-4 ${viewMode === "list" ? "sm:flex-row sm:items-center sm:justify-between" : ""}`}>
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

                  <h3 className="mt-2.5 truncate text-[18px] font-bold tracking-[-0.02em] text-(--nv-text)">
                    {campaignTitle}
                  </h3>
                  <p className="text-[13px] text-(--nv-text-3)">{campaignBrand}</p>

                  {viewMode === "grid" && campaign.campaignBrief && (
                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-(--nv-text-2)">
                      {campaign.campaignBrief}
                    </p>
                  )}
                </div>

                {/* Métricas + criadores */}
                <div className={`flex flex-wrap items-center gap-4 ${viewMode === "grid" ? "border-t border-(--nv-line) pt-4" : ""}`}>
                  <div>
                    <p className="text-[11px] font-medium text-(--nv-text-3)">Plano</p>
                    <p className="font-title text-[16px] font-bold text-(--nv-text) tabular-nums">
                      {formatKwanzas(plan.spendKz)}/mês
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-(--nv-text-3)">Volume</p>
                    <p className="font-title text-[16px] font-bold text-(--nv-text) tabular-nums">
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

                {/* Ações do cartão */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/painel/descobrir"
                    className="lg-control sq inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
                  >
                    Convidar criadores
                  </Link>
                  <button
                    type="button"
                    onClick={() => setArchived((v) => !v)}
                    aria-label={archived ? "Reativar campanha" : "Arquivar campanha"}
                    title={archived ? "Reativar campanha" : "Arquivar campanha"}
                    className="lg-control sq flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text-2) hover:text-(--nv-text)"
                  >
                    <HugeiconsIcon icon={Archive01Icon} size={15} strokeWidth={2} />
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Conteúdo: Rascunhos */}
          {status === "rascunhos" && hasDraft && draft && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card className="flex flex-col justify-between gap-4">
                <div>
                  <span className="sq inline-flex items-center gap-1.5 rounded-full bg-(--nv-accent-soft) px-2.5 py-0.5 text-[11.5px] font-semibold text-[#4EA7EB]">
                    Rascunho · Passo {Math.min(draft.step + 1, 8)}/8
                  </span>
                  <h3 className="mt-2.5 text-[18px] font-bold tracking-[-0.02em] text-(--nv-text)">
                    {draft.brandName.trim() || "Campanha em progresso"}
                  </h3>
                  <p className="mt-1 text-[13px] text-(--nv-text-3)">
                    {draft.goal ? GOAL_LABEL[draft.goal] : "Retoma exatamente onde paraste."}
                  </p>
                </div>
                <Link href="/onboarding" className="nuvi-btn !h-10 !text-[13.5px]">
                  Continuar rascunho
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.2} />
                </Link>
              </Card>
            </div>
          )}

          {/* Estado vazio quando não há campanha na vista atual */}
          {((status !== "rascunhos" && !showLiveCampaign) || (status === "rascunhos" && !hasDraft)) && (
            <Card className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <SquircleTile size={56} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                <HugeiconsIcon icon={TrendingUpIcon} size={24} strokeWidth={1.9} className="text-[#4EA7EB]" />
              </SquircleTile>
              <h3 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
                {status === "ativas"
                  ? "Sem campanhas ativas"
                  : status === "arquivadas"
                    ? "Sem campanhas arquivadas"
                    : "Sem rascunhos guardados"}
              </h3>
              <p className="mt-1.5 max-w-[360px] text-[14px] text-(--nv-text-3)">
                {status === "ativas"
                  ? "As campanhas que lançares vão aparecer aqui para acompanhares tudo."
                  : status === "arquivadas"
                    ? "Campanhas concluídas ou arquivadas ficam guardadas aqui."
                    : "Se saíres a meio da criação de uma campanha, ela fica guardada aqui."}
              </p>
              {status === "ativas" && (
                <Link href="/onboarding" className="nuvi-btn mt-6 !h-11 !px-6 !text-[14px]">
                  <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
                  Criar primeira campanha
                </Link>
              )}
            </Card>
          )}
        </>
      ) : (
        /* Outros separadores (Entregas, Candidatos, Pedidos, Briefings) */
        <Card className="flex min-h-[360px] flex-col items-center justify-center text-center">
          <SquircleTile size={56} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
            <HugeiconsIcon
              icon={TABS.find((t) => t.id === tab)!.icon}
              size={24}
              strokeWidth={1.8}
              className="text-(--nv-text-2)"
            />
          </SquircleTile>
          <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
            {tab === "entregas"
              ? "Sem entregas para rever"
              : tab === "candidatos"
                ? "Sem candidaturas ainda"
                : tab === "pedidos"
                  ? "Sem pedidos pendentes"
                  : "Sem briefings publicados"}
          </h2>
          <p className="mt-1.5 max-w-[380px] text-[14px] text-(--nv-text-3)">
            {tab === "entregas"
              ? "Os vídeos enviados pelos criadores aparecem aqui para aprovares antes do pagamento."
              : tab === "candidatos"
                ? "Quando criadores se candidatarem às tuas campanhas, podes aceitá-los num toque."
                : tab === "pedidos"
                  ? "Convites enviados e respostas de criadores aparecem organizados aqui."
                  : "Cria uma campanha para gerar o teu primeiro briefing para criadores."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/painel/descobrir" className="lg-control sq inline-flex h-10 items-center rounded-full px-5 text-[13.5px] font-semibold text-(--nv-text)">
              Descobrir criadores
            </Link>
            <Link href="/onboarding" className="nuvi-btn !h-10 !px-5 !text-[13.5px]">
              <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.4} />
              Nova campanha
            </Link>
          </div>
        </Card>
      )}

      {/* Modal de Modelos de campanha */}
      {templatesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Modelos de campanha"
          onClick={() => setTemplatesOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-(--nv-scrim) p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="nuvi-pop lg-surface sq w-full max-w-[540px] rounded-[28px] border border-(--nv-line) p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[19px] font-bold tracking-[-0.02em] text-(--nv-text)">Modelos prontos</h2>
                <p className="mt-0.5 text-[13px] text-(--nv-text-3)">Escolhe um ponto de partida para lançar mais depressa.</p>
              </div>
              <button
                type="button"
                onClick={() => setTemplatesOpen(false)}
                aria-label="Fechar"
                className="lg-control flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--nv-text-2)"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2.2} />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              {TEMPLATES.map((tpl) => (
                <Link
                  key={tpl.title}
                  href="/onboarding"
                  onClick={() => setTemplatesOpen(false)}
                  className="sq group flex items-start justify-between gap-4 rounded-[18px] border border-(--nv-line) bg-(--nv-solid) p-4 transition-all hover:border-[#4EA7EB]"
                >
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4EA7EB]">
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
