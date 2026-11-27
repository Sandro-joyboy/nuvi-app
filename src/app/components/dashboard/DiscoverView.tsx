"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark01Icon,
  Briefcase01Icon,
  Building03Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  CrownIcon,
  FilterHorizontalIcon,
  InstagramIcon,
  Mail01Icon,
  Megaphone01Icon,
  Message01Icon,
  MoreHorizontalIcon,
  ScissorIcon,
  Search01Icon,
  SparklesIcon,
  StarIcon,
  Tick02Icon,
  TiktokIcon,
  UserGroupIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import {
  ALL_CREATORS,
  type CreatorProfile,
  type DiscoverCategory,
} from "@/app/components/onboarding/creators";
import { useCampaign } from "@/app/components/onboarding/campaign";
import { useDashboard } from "./dashboard-context";

type PlatformFilter = "todos" | "tiktok" | "instagram" | "youtube";
type SortKey = "recomendados" | "views" | "engajamento" | "cpm";

const CATEGORIES: {
  id: DiscoverCategory;
  label: string;
  subtitle: string;
  icon: typeof UserGroupIcon;
}[] = [
  {
    id: "criadores",
    label: "Criadores",
    subtitle: "Criadores de UGC produzem vídeos para os teus anúncios, pagos por vídeo.",
    icon: UserGroupIcon,
  },
  {
    id: "influenciadores",
    label: "Influenciadores",
    subtitle: "Influenciadores publicam nas próprias contas para gerar alcance orgânico.",
    icon: Megaphone01Icon,
  },
  {
    id: "gestores",
    label: "Gestores de Campanha",
    subtitle: "Especialistas que coordenam briefings, entregas e criadores por ti.",
    icon: Briefcase01Icon,
  },
  {
    id: "agencias",
    label: "Agências UGC",
    subtitle: "Equipas prontas para produzir conteúdo em escala todos os meses.",
    icon: Building03Icon,
  },
  {
    id: "clipping",
    label: "Clipping",
    subtitle: "Editores transformam vídeos longos e podcasts em clips curtos virais.",
    icon: ScissorIcon,
  },
];

const REGIONS = ["Todas", "Luanda", "Benguela", "Huíla", "Huambo", "Lisboa"] as const;
const DAILY_INVITE_LIMIT = 30;

export default function DiscoverView() {
  const router = useRouter();
  const campaign = useCampaign();
  const { openCompose } = useDashboard();

  const [category, setCategory] = useState<DiscoverCategory>("criadores");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [platform, setPlatform] = useState<PlatformFilter>("todos");
  const [region, setRegion] = useState<string>("Todas");
  const [onlyTop, setOnlyTop] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("recomendados");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [extraInvitedIds, setExtraInvitedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [inspectCreator, setInspectCreator] = useState<CreatorProfile | null>(null);
  const [limitNotice, setLimitNotice] = useState(false);

  const invitedIds = useMemo(() => {
    const base = campaign?.invitedCreators ?? [];
    return Array.from(new Set([...base, ...extraInvitedIds]));
  }, [campaign?.invitedCreators, extraInvitedIds]);

  const invitesLeft = Math.max(0, DAILY_INVITE_LIMIT - extraInvitedIds.length);

  const activeFilterCount =
    (platform !== "todos" ? 1 : 0) +
    (region !== "Todas" ? 1 : 0) +
    (onlyTop ? 1 : 0) +
    (sortBy !== "recomendados" ? 1 : 0);

  const filteredCreators = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ALL_CREATORS.filter((c) => {
      if (!c.categories.includes(category)) return false;
      if (platform !== "todos" && !c.platforms.includes(platform)) return false;
      if (region !== "Todas" && c.regionKey !== region) return false;
      if (onlyTop && !c.topCreator) return false;
      if (q) {
        const hay = `${c.name} ${c.handle} ${c.location} ${c.niches.map((n) => n.label).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "views") return [...list].sort((a, b) => b.viewsNum - a.viewsNum);
    if (sortBy === "engajamento") return [...list].sort((a, b) => b.engagementNum - a.engagementNum);
    if (sortBy === "cpm") return [...list].sort((a, b) => a.cpmNum - b.cpmNum);
    return list;
  }, [category, platform, region, onlyTop, query, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleInvite = (id: string) => {
    setExtraInvitedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (DAILY_INVITE_LIMIT - prev.length <= 0) {
        setLimitNotice(true);
        return prev;
      }
      return [...prev, id];
    });
  };

  const inviteSelected = () => {
    setExtraInvitedIds((prev) => {
      const next = [...prev];
      for (const id of selectedIds) {
        if (!next.includes(id) && next.length < DAILY_INVITE_LIMIT) next.push(id);
      }
      return next;
    });
    setSelectedIds([]);
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearFilters = () => {
    setPlatform("todos");
    setRegion("Todas");
    setOnlyTop(false);
    setSortBy("recomendados");
  };

  // Fecha menu de contexto ao clicar fora
  useEffect(() => {
    if (!openMenuId) return;
    const onDown = () => setOpenMenuId(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenuId(null);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenuId]);

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-5">
      {/* Categorias em controlo segmentado Nuvi + convites restantes */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Categorias de criadores"
          className="sq inline-flex max-w-full overflow-x-auto rounded-full bg-(--nv-fill) p-[3px]"
        >
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c.id)}
                className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                  active ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                }`}
              >
                <HugeiconsIcon
                  icon={c.icon}
                  size={15}
                  strokeWidth={active ? 2.1 : 1.8}
                  className={active ? "text-[#4EA7EB]" : "text-(--nv-text-3)"}
                />
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="lg-surface sq inline-flex items-center gap-2 rounded-full py-1 pr-1.5 pl-3.5 text-[12.5px]">
          <HugeiconsIcon icon={Mail01Icon} size={14} strokeWidth={2} className="text-[#4EA7EB]" />
          <span className="font-semibold text-(--nv-text) tabular-nums">
            {invitesLeft} convites hoje
          </span>
          <button
            type="button"
            onClick={() => setLimitNotice(true)}
            className="sq cursor-pointer rounded-full bg-(--nv-accent-soft) px-3 py-1 text-[11.5px] font-semibold text-[#0076E8] transition-opacity hover:opacity-85 dark:text-[#60B5FF]"
          >
            Mais
          </button>
        </div>
      </div>

      {/* Pesquisa + Filtros */}
      <div className="flex items-center gap-2.5">
        <label className="lg-control sq flex h-11 flex-1 items-center gap-2.5 rounded-full px-4">
          <HugeiconsIcon icon={Search01Icon} size={17} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
          <span className="sr-only">Pesquisar criadores</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar criadores por nome, nicho ou cidade"
            className="h-full w-full bg-transparent text-[14px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3) [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar pesquisa"
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-(--nv-text)"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2.2} />
            </button>
          )}
        </label>

        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className={`lg-control sq inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-colors ${
            filtersOpen || activeFilterCount > 0 ? "text-[#0076E8] dark:text-[#60B5FF]" : "text-(--nv-text)"
          }`}
        >
          <HugeiconsIcon icon={FilterHorizontalIcon} size={16} strokeWidth={2} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4EA7EB] px-1 text-[11px] font-bold text-white tabular-nums">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Painel expansível de filtros */}
      {filtersOpen && (
        <div className="nuvi-step lg-surface sq flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[24px] p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[12px] font-semibold text-(--nv-text-3)">Rede</span>
            {(
              [
                { id: "todos", label: "Todas" },
                { id: "tiktok", label: "TikTok" },
                { id: "instagram", label: "Instagram" },
                { id: "youtube", label: "YouTube" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`sq h-8 cursor-pointer rounded-full px-3 text-[12.5px] font-semibold transition-all ${
                  platform === p.id
                    ? "bg-[#4EA7EB] text-white"
                    : "bg-(--nv-fill) text-(--nv-text-2) hover:text-(--nv-text)"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[12px] font-semibold text-(--nv-text-3)">Região</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`sq h-8 cursor-pointer rounded-full px-3 text-[12.5px] font-semibold transition-all ${
                  region === r
                    ? "bg-[#4EA7EB] text-white"
                    : "bg-(--nv-fill) text-(--nv-text-2) hover:text-(--nv-text)"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => setOnlyTop((v) => !v)}
              aria-pressed={onlyTop}
              className={`sq inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-all ${
                onlyTop ? "bg-[#4EA7EB] text-white" : "bg-(--nv-fill) text-(--nv-text-2) hover:text-(--nv-text)"
              }`}
            >
              <HugeiconsIcon icon={CrownIcon} size={13} strokeWidth={2.2} />
              Top Criadores
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              aria-label="Ordenar criadores"
              className="sq h-8 cursor-pointer rounded-full border border-(--nv-line) bg-(--nv-solid) px-3 text-[12.5px] font-semibold text-(--nv-text) outline-none"
            >
              <option value="recomendados">Ordenar: Recomendados</option>
              <option value="views">Mais visualizações</option>
              <option value="engajamento">Maior engajamento</option>
              <option value="cpm">Menor CPM</option>
            </select>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer text-[12.5px] font-semibold text-[#4EA7EB] hover:underline"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Aviso de limite / upgrade */}
      {limitNotice && (
        <div
          role="status"
          className="nuvi-step lg-surface sq flex items-center justify-between gap-3 rounded-[16px] border border-[#4EA7EB]/25 bg-(--nv-accent-soft)/60 px-4 py-2.5 text-[13px] text-(--nv-text)"
        >
          <span>
            Os convites diários renovam às 00:00. Planos com convites ilimitados chegam em breve à Nuvi.
          </span>
          <button
            type="button"
            onClick={() => setLimitNotice(false)}
            aria-label="Fechar"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* Grelha de criadores */}
      {filteredCreators.length === 0 ? (
        <div className="lg-surface sq flex flex-col items-center justify-center rounded-[26px] px-6 py-16 text-center">
          <p className="text-[16px] font-bold text-(--nv-text)">Nenhum criador encontrado</p>
          <p className="mt-1 text-[13.5px] text-(--nv-text-3)">
            Tenta outra pesquisa ou limpa os filtros aplicados.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              clearFilters();
            }}
            className="lg-control sq mt-4 h-10 cursor-pointer rounded-full px-5 text-[13.5px] font-semibold text-(--nv-text)"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredCreators.map((creator) => (
            <DiscoverCard
              key={creator.id}
              creator={creator}
              selected={selectedIds.includes(creator.id)}
              invited={invitedIds.includes(creator.id)}
              saved={savedIds.includes(creator.id)}
              menuOpen={openMenuId === creator.id}
              onToggleSelect={() => toggleSelect(creator.id)}
              onToggleInvite={() => toggleInvite(creator.id)}
              onToggleSave={() => toggleSave(creator.id)}
              onToggleMenu={() => setOpenMenuId((cur) => (cur === creator.id ? null : creator.id))}
              onInspect={() => {
                setOpenMenuId(null);
                setInspectCreator(creator);
              }}
              onMessage={() => {
                setOpenMenuId(null);
                router.push("/painel/mensagens");
                openCompose();
              }}
            />
          ))}
        </div>
      )}

      {/* Barra flutuante de seleção em lote */}
      {selectedIds.length > 0 && (
        <div className="nuvi-pop lg-surface sq fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-(--nv-line-strong) py-2 pr-2 pl-4 shadow-[0_16px_40px_-14px_var(--nv-shadow)] lg:bottom-6">
          <span className="text-[13.5px] font-semibold whitespace-nowrap text-(--nv-text) tabular-nums">
            {selectedIds.length} {selectedIds.length === 1 ? "selecionado" : "selecionados"}
          </span>
          <button
            type="button"
            onClick={inviteSelected}
            className="sq inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-b from-[#55B0F4] to-[#2684E6] px-4 text-[13px] font-semibold whitespace-nowrap text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105"
          >
            <HugeiconsIcon icon={Message01Icon} size={14} strokeWidth={2.2} />
            Convidar selecionados
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            aria-label="Limpar seleção"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-(--nv-text)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* Modal de perfil rápido do criador */}
      {inspectCreator && (
        <CreatorDetailModal
          creator={inspectCreator}
          invited={invitedIds.includes(inspectCreator.id)}
          saved={savedIds.includes(inspectCreator.id)}
          onToggleInvite={() => toggleInvite(inspectCreator.id)}
          onToggleSave={() => toggleSave(inspectCreator.id)}
          onClose={() => setInspectCreator(null)}
        />
      )}
    </div>
  );
}

/* ---------------- Cartão individual de criador ---------------- */

function DiscoverCard({
  creator,
  selected,
  invited,
  saved,
  menuOpen,
  onToggleSelect,
  onToggleInvite,
  onToggleSave,
  onToggleMenu,
  onInspect,
  onMessage,
}: {
  creator: CreatorProfile;
  selected: boolean;
  invited: boolean;
  saved: boolean;
  menuOpen: boolean;
  onToggleSelect: () => void;
  onToggleInvite: () => void;
  onToggleSave: () => void;
  onToggleMenu: () => void;
  onInspect: () => void;
  onMessage: () => void;
}) {
  return (
    <article
      className={`lg-surface sq group relative flex flex-col rounded-[22px] p-2.5 transition-all duration-200 ${
        selected
          ? "ring-2 ring-[#4EA7EB] shadow-[0_12px_30px_-14px_rgba(78,167,235,0.45)]"
          : "hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-16px_var(--nv-shadow)]"
      }`}
    >
      {/* Tira de 3 vídeos/reels + checkbox */}
      <div className="relative">
        <button
          type="button"
          onClick={onInspect}
          aria-label={`Ver portfólio de ${creator.name}`}
          className="sq grid h-[156px] w-full cursor-pointer grid-cols-3 gap-1 overflow-hidden rounded-[16px] text-left"
        >
          {creator.reels.map((reel) => (
            <span
              key={reel.caption}
              className="relative flex flex-col justify-between overflow-hidden p-2 text-white"
              style={{ background: reel.gradient }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-35 blur-xl"
                style={{ background: reel.accent }}
              />
              <span className="relative z-10 mt-auto mb-5 line-clamp-3 text-center text-[10.5px] leading-tight font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
                {reel.caption}
              </span>
            </span>
          ))}
        </button>

        {/* Checkbox de seleção múltipla no canto superior direito */}
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          aria-label={`Selecionar ${creator.name}`}
          onClick={onToggleSelect}
          className={`absolute top-2 right-2 z-20 flex h-5.5 w-5.5 cursor-pointer items-center justify-center rounded-[7px] border transition-all ${
            selected
              ? "border-[#4EA7EB] bg-[#4EA7EB] text-white shadow-sm"
              : "border-black/15 bg-white/90 text-transparent shadow-sm hover:border-[#4EA7EB]"
          }`}
        >
          <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={3} />
        </button>

        {/* Barra sobreposta: Avatar + redes + KPIs (ou badge "Novo na Nuvi") */}
        <div className="relative z-10 -mt-7 flex items-end gap-2 px-1.5">
          <button
            type="button"
            onClick={onInspect}
            aria-label={`Abrir perfil de ${creator.name}`}
            className="relative shrink-0 cursor-pointer"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-(--nv-solid) text-[13px] font-bold text-white shadow-[0_6px_14px_-4px_var(--nv-shadow)]"
              style={{ background: creator.avatarBg }}
            >
              {creator.initials}
            </span>
            <span className="absolute -right-1 -bottom-0.5 flex -space-x-1">
              {creator.platforms.includes("instagram") && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-(--nv-solid) bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                  <HugeiconsIcon icon={InstagramIcon} size={9} strokeWidth={2.2} />
                </span>
              )}
              {creator.platforms.includes("tiktok") && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-(--nv-solid) bg-[#111827] text-white">
                  <HugeiconsIcon icon={TiktokIcon} size={9} strokeWidth={2.2} />
                </span>
              )}
              {creator.platforms.includes("youtube") && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-(--nv-solid) bg-[#FF0000] text-white">
                  <HugeiconsIcon icon={YoutubeIcon} size={9} strokeWidth={2.2} />
                </span>
              )}
            </span>
          </button>

          {creator.newToNuvi ? (
            <div className="sq min-w-0 flex-1 rounded-[13px] border border-[#AF52DE]/20 bg-[#F5ECFF] px-2.5 py-1.5 shadow-[0_6px_16px_-8px_var(--nv-shadow)] dark:bg-[#2A1D38]">
              <p className="flex items-center gap-1 text-[11px] leading-tight font-semibold text-[#7E3AF2] dark:text-[#D8B4FE]">
                <HugeiconsIcon icon={SparklesIcon} size={11} strokeWidth={2.2} />
                Novo na Nuvi
              </p>
              <p className="mt-0.5 truncate text-[10px] text-(--nv-text-3)">{creator.newToNuvi}</p>
            </div>
          ) : (
            <div className="sq grid min-w-0 flex-1 grid-cols-3 divide-x divide-(--nv-line) rounded-[13px] border border-(--nv-line) bg-(--nv-solid) px-1 py-1.5 text-center shadow-[0_6px_18px_-8px_var(--nv-shadow)]">
              <div className="min-w-0 px-0.5">
                <p className="text-[9.5px] font-medium text-(--nv-text-3)">Views</p>
                <p className="font-title truncate text-[12.5px] font-bold text-(--nv-text) tabular-nums">
                  {creator.views}
                </p>
              </div>
              <div className="min-w-0 px-0.5">
                <p className="text-[9.5px] font-medium text-(--nv-text-3)">Eng.</p>
                <p className="font-title truncate text-[12.5px] font-bold text-(--nv-text) tabular-nums">
                  {creator.engagement}
                </p>
              </div>
              <div className="min-w-0 px-0.5">
                <p className="text-[9.5px] font-medium text-(--nv-text-3)">CPM</p>
                <p className="font-title truncate text-[11px] font-bold text-(--nv-text) tabular-nums">
                  {creator.cpm}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nome, selos, avaliação e localização */}
      <div className="mt-2.5 px-1">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex min-w-0 items-center gap-1">
            <button
              type="button"
              onClick={onInspect}
              className="cursor-pointer truncate text-[13.5px] font-bold tracking-[-0.015em] text-(--nv-text) hover:text-[#4EA7EB]"
            >
              {creator.name}
            </button>
            {creator.topCreator && (
              <span title="Top criador Nuvi" className="shrink-0 text-[#4EA7EB]">
                <HugeiconsIcon icon={CrownIcon} size={13} strokeWidth={2.2} />
              </span>
            )}
            {creator.verified && (
              <span title="Verificado" className="shrink-0 text-[#34C759]">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={13} strokeWidth={2.2} />
              </span>
            )}
          </div>

          {creator.rating && (
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold text-(--nv-text-2) tabular-nums">
              <HugeiconsIcon icon={StarIcon} size={12} strokeWidth={2.2} className="fill-[#FF9500] text-[#FF9500]" />
              {creator.rating.toFixed(1).replace(".", ",")}
              {creator.reviewsCount ? (
                <span className="font-normal text-(--nv-text-3)">({creator.reviewsCount})</span>
              ) : null}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-(--nv-text-3)">
          <span className="mr-1">{creator.flag}</span>
          {creator.location}
        </p>
      </div>

      {/* Botão Convidar + Menu ••• */}
      <div className="relative mt-3 flex items-center gap-1.5 px-0.5">
        <button
          type="button"
          onClick={onToggleInvite}
          className={`sq flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[12px] text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] ${
            invited
              ? "border border-[#34C759]/30 bg-(--nv-success-soft) text-[#1E9E47] dark:text-[#34C759]"
              : "border border-white/25 bg-gradient-to-b from-[#55B0F4] to-[#2684E6] text-white shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.4),0_6px_16px_-8px_rgba(0,118,232,0.55)] hover:brightness-105"
          }`}
        >
          <HugeiconsIcon icon={invited ? Tick02Icon : Message01Icon} size={14} strokeWidth={2.2} />
          {invited ? "Convidado" : "Convidar"}
        </button>

        <div className="relative" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label={`Mais opções para ${creator.name}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="lg-control sq flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[12px] text-(--nv-text-2) hover:text-(--nv-text)"
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} size={16} strokeWidth={2.2} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="nuvi-pop lg-surface sq absolute right-0 bottom-11 z-30 w-44 rounded-[16px] border border-(--nv-line) p-1.5 shadow-[0_14px_34px_-10px_var(--nv-shadow)]"
            >
              <button
                type="button"
                role="menuitem"
                onClick={onInspect}
                className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[12.5px] font-medium text-(--nv-text) hover:bg-(--nv-fill)"
              >
                <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={2} className="text-(--nv-text-3)" />
                Ver perfil completo
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={onToggleSave}
                className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[12.5px] font-medium text-(--nv-text) hover:bg-(--nv-fill)"
              >
                <HugeiconsIcon
                  icon={Bookmark01Icon}
                  size={14}
                  strokeWidth={2}
                  className={saved ? "text-[#4EA7EB]" : "text-(--nv-text-3)"}
                />
                {saved ? "Remover dos guardados" : "Guardar criador"}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={onMessage}
                className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[12.5px] font-medium text-(--nv-text) hover:bg-(--nv-fill)"
              >
                <HugeiconsIcon icon={Message01Icon} size={14} strokeWidth={2} className="text-(--nv-text-3)" />
                Enviar mensagem
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ---------------- Modal de perfil completo do criador ---------------- */

function CreatorDetailModal({
  creator,
  invited,
  saved,
  onToggleInvite,
  onToggleSave,
  onClose,
}: {
  creator: CreatorProfile;
  invited: boolean;
  saved: boolean;
  onToggleInvite: () => void;
  onToggleSave: () => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const maxAge = Math.max(...creator.ages.map((a) => a.pct), 1);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${creator.name}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--nv-scrim) p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="nuvi-pop lg-surface sq max-h-[90dvh] w-full max-w-[680px] overflow-y-auto rounded-[28px] border border-(--nv-line) p-5 sm:p-6"
      >
        {/* Topo */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[17px] font-bold text-white"
              style={{ background: creator.avatarBg }}
            >
              {creator.initials}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[19px] font-bold tracking-[-0.02em] text-(--nv-text)">{creator.name}</h2>
                {creator.topCreator && <HugeiconsIcon icon={CrownIcon} size={16} strokeWidth={2.2} className="text-[#4EA7EB]" />}
                {creator.verified && <HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} strokeWidth={2.2} className="text-[#34C759]" />}
              </div>
              <p className="text-[13px] text-(--nv-text-3)">
                {creator.handle} · {creator.flag} {creator.location}
              </p>
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="lg-control flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text-2)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2.2} />
          </button>
        </div>

        {/* KPIs */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {[
            { label: "Visualizações", value: creator.views },
            { label: "Engajamento", value: creator.engagement },
            { label: "CPM médio", value: creator.cpm },
          ].map((k) => (
            <div key={k.label} className="sq rounded-[16px] border border-(--nv-line) bg-(--nv-solid) p-3.5 text-center">
              <p className="font-title text-[20px] font-bold text-(--nv-text) tabular-nums">{k.value}</p>
              <p className="mt-0.5 text-[11.5px] font-medium text-(--nv-text-3)">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Experiências */}
        <div className="mt-5">
          <p className="mb-2 text-[13px] font-semibold text-(--nv-text)">Experiências com marcas</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {creator.experiences.map((exp) => (
              <div
                key={exp.brand}
                className="sq flex items-center gap-3 rounded-[16px] border border-(--nv-line) bg-(--nv-solid) px-3.5 py-2.5"
              >
                <span
                  className="sq flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[12px] font-bold text-white"
                  style={{ background: exp.bg }}
                >
                  {exp.monogram}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-(--nv-text)">{exp.brand}</p>
                  <p className="text-[12px] text-(--nv-text-3) tabular-nums">
                    {[exp.instagram && `IG ${exp.instagram}`, exp.tiktok && `TikTok ${exp.tiktok}`, exp.platformOnly]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Público */}
        <div className="mt-5">
          <p className="mb-2 text-[13px] font-semibold text-(--nv-text)">
            Público <span className="font-normal text-(--nv-text-3)">· {creator.audienceSource}</span>
          </p>
          <div className="sq grid grid-cols-1 gap-4 rounded-[18px] border border-(--nv-line) bg-(--nv-solid) p-4 sm:grid-cols-2">
            <div>
              <p className="text-[11.5px] font-medium text-(--nv-text-3)">Idade</p>
              <div className="mt-2 flex items-end gap-1.5 pt-3">
                {creator.ages.map((a) => (
                  <div key={a.label} className="flex flex-1 flex-col items-center">
                    <span className="mb-1 text-[9.5px] font-semibold text-(--nv-text-2) tabular-nums">{a.pct}%</span>
                    <div
                      className="w-full rounded-t-[5px] bg-gradient-to-b from-[#55B0F4] to-[#2684E6]"
                      style={{ height: `${Math.max(4, Math.round((a.pct / maxAge) * 76))}px` }}
                    />
                    <span className="mt-1 text-[9px] text-(--nv-text-3)">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3">
              <div>
                <p className="text-[11.5px] font-medium text-(--nv-text-3)">Género</p>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-(--nv-fill)">
                  <span style={{ width: `${creator.gender.female}%` }} className="bg-[#4EA7EB]" />
                  <span style={{ width: `${creator.gender.male}%` }} className="bg-[#34C759]" />
                  <span style={{ width: `${creator.gender.unknown}%` }} className="bg-[#FF5A5F]" />
                </div>
                <p className="mt-1.5 text-[11px] text-(--nv-text-3) tabular-nums">
                  Mulheres {creator.gender.female}% · Homens {creator.gender.male}% · Outro {creator.gender.unknown}%
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                {creator.countries.map((c) => (
                  <div key={c.code} className="flex items-center gap-2 text-[11.5px]">
                    <span className="w-11 font-semibold text-(--nv-text-2)">
                      {c.flag} {c.code}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--nv-fill)">
                      <span className="block h-full rounded-full bg-[#4EA7EB]" style={{ width: `${c.pct}%` }} />
                    </span>
                    <span className="w-8 text-right font-semibold text-(--nv-text) tabular-nums">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleSave}
            className="lg-control sq inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-[14px] font-semibold text-(--nv-text)"
          >
            <HugeiconsIcon icon={Bookmark01Icon} size={16} strokeWidth={2} className={saved ? "text-[#4EA7EB]" : undefined} />
            {saved ? "Guardado" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onToggleInvite}
            className={`sq flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-[14.5px] font-semibold transition-all ${
              invited
                ? "border border-[#34C759]/30 bg-(--nv-success-soft) text-[#1E9E47] dark:text-[#34C759]"
                : "nuvi-btn !h-11 !text-[14.5px]"
            }`}
          >
            <HugeiconsIcon icon={invited ? Tick02Icon : Message01Icon} size={16} strokeWidth={2.2} />
            {invited ? "Criador convidado" : "Convidar para campanha"}
          </button>
        </div>
      </div>
    </div>
  );
}
