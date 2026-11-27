"use client";

import { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark01Icon,
  Cancel01Icon,
  CrownIcon,
  InstagramIcon,
  StarIcon,
  Tick02Icon,
  TiktokIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { useDialog } from "./useDialog";

export type PlatformFilter = "todos" | "tiktok" | "instagram" | "youtube";
export type SortKey = "recomendados" | "views" | "engajamento" | "cpm";
export type MinViewsFilter = 0 | 500_000 | 2_000_000 | 4_000_000;

export interface DiscoverFilters {
  sortBy: SortKey;
  platform: PlatformFilter;
  regions: string[];
  niches: string[];
  minViews: MinViewsFilter;
  maxCpm: number; // 2000 = sem limite
  onlyTop: boolean;
  onlyRated: boolean;
  onlySaved: boolean;
}

export const MAX_CPM_LIMIT = 2000;

export const DEFAULT_FILTERS: DiscoverFilters = {
  sortBy: "recomendados",
  platform: "todos",
  regions: [],
  niches: [],
  minViews: 0,
  maxCpm: MAX_CPM_LIMIT,
  onlyTop: false,
  onlyRated: false,
  onlySaved: false,
};

export const FILTER_REGIONS = ["Luanda", "Benguela", "Huíla", "Huambo", "Lisboa"] as const;

export const FILTER_NICHES = [
  { id: "ugc", label: "UGC & Anúncios", keywords: ["ugc", "anúncios", "reviews", "escala"] },
  { id: "moda", label: "Moda & Beleza", keywords: ["moda", "beleza", "skincare", "compras"] },
  { id: "entretenimento", label: "Entretenimento", keywords: ["entretenimento", "humor", "música", "mídia"] },
  { id: "tech", label: "Tecnologia & Apps", keywords: ["tecnologia", "apps"] },
  { id: "financas", label: "Finanças & Negócios", keywords: ["finanças", "comércio", "negócios"] },
  { id: "gastronomia", label: "Gastronomia", keywords: ["gastronomia", "café", "lifestyle"] },
  { id: "fitness", label: "Fitness & Saúde", keywords: ["fitness", "bem-estar"] },
] as const;

export const SORT_OPTIONS: { id: SortKey; label: string; hint: string }[] = [
  { id: "recomendados", label: "Recomendados", hint: "Melhor combinação" },
  { id: "views", label: "Mais views", hint: "Maior alcance" },
  { id: "engajamento", label: "Engajamento", hint: "Mais interação" },
  { id: "cpm", label: "Menor CPM", hint: "Melhor custo" },
];

export const MIN_VIEWS_OPTIONS: { value: MinViewsFilter; label: string }[] = [
  { value: 0, label: "Qualquer" },
  { value: 500_000, label: "500K+" },
  { value: 2_000_000, label: "2M+" },
  { value: 4_000_000, label: "4M+" },
];

export function countActiveFilters(f: DiscoverFilters): number {
  return (
    (f.sortBy !== "recomendados" ? 1 : 0) +
    (f.platform !== "todos" ? 1 : 0) +
    f.regions.length +
    f.niches.length +
    (f.minViews > 0 ? 1 : 0) +
    (f.maxCpm < MAX_CPM_LIMIT ? 1 : 0) +
    (f.onlyTop ? 1 : 0) +
    (f.onlyRated ? 1 : 0) +
    (f.onlySaved ? 1 : 0)
  );
}

interface DiscoverFilterSheetProps {
  open: boolean;
  filters: DiscoverFilters;
  resultCount: number;
  savedCount: number;
  onChange: (next: DiscoverFilters) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function DiscoverFilterSheet(props: DiscoverFilterSheetProps) {
  if (!props.open) return null;
  return <SheetContent {...props} />;
}

function SheetContent({
  filters,
  resultCount,
  savedCount,
  onChange,
  onReset,
  onClose,
}: DiscoverFilterSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, panelRef);

  const activeCount = countActiveFilters(filters);

  const set = <K extends keyof DiscoverFilters>(key: K, value: DiscoverFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleItem = (key: "regions" | "niches", item: string) => {
    const list = filters[key];
    set(key, list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const cpmPct = ((filters.maxCpm - 800) / (MAX_CPM_LIMIT - 800)) * 100;

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-(--nv-scrim) backdrop-blur-[2px] lg:p-2"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="discover-filters-title"
        className="nuvi-sheet sq flex h-full w-full max-w-[440px] flex-col bg-(--nv-panel) shadow-[0_0_0_0.5px_var(--nv-line),-20px_0_60px_-20px_var(--nv-shadow)] lg:rounded-[28px]"
      >
        {/* Cabeçalho */}
        <header className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <h2
              id="discover-filters-title"
              className="text-[22px] font-bold tracking-[-0.025em] text-(--nv-text)"
            >
              Filtros
            </h2>
            {activeCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-(--nv-accent-soft) px-2 text-[12px] font-bold text-[#0076E8] tabular-nums dark:text-[#60B5FF]">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              disabled={activeCount === 0}
              className="lg-control sq h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold text-(--nv-text)"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar filtros"
              className="lg-control flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--nv-text)"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* Corpo com grupos em vidro */}
        <div className="nuvi-scroll min-h-0 flex-1 space-y-3.5 overflow-y-auto border-t border-(--nv-line) px-4 py-4">
          {/* 1. Ordenação */}
          <FilterGroup title="Ordenar por">
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Ordenar por">
              {SORT_OPTIONS.map((opt) => {
                const active = filters.sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set("sortBy", opt.id)}
                    className={`sq flex cursor-pointer flex-col rounded-[16px] px-3.5 py-2.5 text-left transition-all ${
                      active
                        ? "bg-(--nv-accent-soft) shadow-[inset_0_0_0_1.5px_#4EA7EB]"
                        : "bg-(--nv-solid) shadow-[0_0_0_0.5px_var(--nv-line)] hover:bg-(--nv-fill)"
                    }`}
                  >
                    <span
                      className={`text-[13px] font-semibold ${
                        active ? "text-[#0076E8] dark:text-[#60B5FF]" : "text-(--nv-text)"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="mt-0.5 text-[11.5px] text-(--nv-text-3)">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* 2. Plataforma */}
          <FilterGroup title="Rede social">
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Rede social">
              {(
                [
                  { id: "todos", label: "Todas" },
                  { id: "tiktok", label: "TikTok", icon: TiktokIcon },
                  { id: "instagram", label: "Instagram", icon: InstagramIcon },
                  { id: "youtube", label: "YouTube", icon: YoutubeIcon },
                ] as const
              ).map((p) => {
                const active = filters.platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set("platform", p.id)}
                    className={`sq flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[14px] text-[13px] font-semibold transition-all ${
                      active
                        ? "bg-[#4EA7EB] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                        : "bg-(--nv-solid) text-(--nv-text-2) shadow-[0_0_0_0.5px_var(--nv-line)] hover:text-(--nv-text)"
                    }`}
                  >
                    {"icon" in p && <HugeiconsIcon icon={p.icon} size={15} strokeWidth={2} />}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* 3. Nicho */}
          <FilterGroup title="Nicho" hint="Várias opções">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Nichos">
              {FILTER_NICHES.map((n) => {
                const active = filters.niches.includes(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleItem("niches", n.id)}
                    className={`sq inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold transition-all ${
                      active
                        ? "bg-[#4EA7EB] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                        : "bg-(--nv-solid) text-(--nv-text-2) shadow-[0_0_0_0.5px_var(--nv-line)] hover:text-(--nv-text)"
                    }`}
                  >
                    {active && <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />}
                    {n.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* 4. Região */}
          <FilterGroup title="Localização" hint="Várias opções">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Localização">
              {FILTER_REGIONS.map((r) => {
                const active = filters.regions.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleItem("regions", r)}
                    className={`sq inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold transition-all ${
                      active
                        ? "bg-[#4EA7EB] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                        : "bg-(--nv-solid) text-(--nv-text-2) shadow-[0_0_0_0.5px_var(--nv-line)] hover:text-(--nv-text)"
                    }`}
                  >
                    {active && <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />}
                    {r}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* 5. Alcance & CPM */}
          <FilterGroup title="Alcance e preço">
            <div>
              <p className="text-[12px] font-medium text-(--nv-text-3)">Visualizações mínimas</p>
              <div
                role="radiogroup"
                aria-label="Visualizações mínimas"
                className="sq mt-2 grid grid-cols-4 rounded-full bg-(--nv-fill) p-[3px]"
              >
                {MIN_VIEWS_OPTIONS.map((opt) => {
                  const active = filters.minViews === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => set("minViews", opt.value)}
                      className={`h-8 cursor-pointer rounded-full text-[12px] font-semibold tabular-nums transition-all ${
                        active ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 border-t border-(--nv-line) pt-4">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor="discover-cpm-slider" className="text-[12px] font-medium text-(--nv-text-3)">
                  CPM máximo
                </label>
                <span className="font-title text-[14px] font-bold text-(--nv-text) tabular-nums">
                  {filters.maxCpm >= MAX_CPM_LIMIT
                    ? "Sem limite"
                    : `Até ${filters.maxCpm.toLocaleString("pt-PT")} Kz`}
                </span>
              </div>
              <div className="mt-3 flex items-center">
                <input
                  id="discover-cpm-slider"
                  type="range"
                  min={800}
                  max={MAX_CPM_LIMIT}
                  step={50}
                  value={filters.maxCpm}
                  onChange={(e) => set("maxCpm", Number(e.target.value))}
                  className="nuvi-range"
                  style={{
                    background: `linear-gradient(to right, #4EA7EB 0%, #4EA7EB ${cpmPct}%, var(--nv-line-strong) ${cpmPct}%, var(--nv-line-strong) 100%)`,
                  }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-(--nv-text-3) tabular-nums">
                <span>800 Kz</span>
                <span>Sem limite</span>
              </div>
            </div>
          </FilterGroup>

          {/* 6. Preferências (interruptores Apple) */}
          <FilterGroup title="Preferências">
            <div className="divide-y divide-(--nv-line)">
              <SwitchRow
                icon={CrownIcon}
                iconClass="text-[#4EA7EB]"
                label="Apenas Top Criadores"
                hint="Histórico comprovado na Nuvi"
                checked={filters.onlyTop}
                onToggle={() => set("onlyTop", !filters.onlyTop)}
              />
              <SwitchRow
                icon={StarIcon}
                iconClass="text-[#FF9500]"
                label="Com avaliações de marcas"
                hint="Criadores já avaliados com estrelas"
                checked={filters.onlyRated}
                onToggle={() => set("onlyRated", !filters.onlyRated)}
              />
              <SwitchRow
                icon={Bookmark01Icon}
                iconClass="text-[#4EA7EB]"
                label={`Apenas guardados${savedCount > 0 ? ` (${savedCount})` : ""}`}
                hint="A tua lista pessoal de favoritos"
                checked={filters.onlySaved}
                onToggle={() => set("onlySaved", !filters.onlySaved)}
              />
            </div>
          </FilterGroup>
        </div>

        {/* Rodapé fixo com contagem ao vivo */}
        <footer className="border-t border-(--nv-line) p-4">
          <button
            type="button"
            onClick={onClose}
            className="nuvi-btn sq w-full !h-12 !text-[15px]"
          >
            {resultCount === 0
              ? "Nenhum criador corresponde"
              : resultCount === 1
                ? "Mostrar 1 criador"
                : `Mostrar ${resultCount} criadores`}
          </button>
        </footer>
      </aside>
    </div>
  );
}

function FilterGroup({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="lg-surface sq rounded-[22px] p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-[13.5px] font-bold tracking-[-0.01em] text-(--nv-text)">{title}</h3>
        {hint && <span className="text-[11.5px] text-(--nv-text-3)">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function SwitchRow({
  icon,
  iconClass,
  label,
  hint,
  checked,
  onToggle,
}: {
  icon: typeof CrownIcon;
  iconClass: string;
  label: string;
  hint: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left first:pt-0 last:pb-0"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-(--nv-fill)">
          <HugeiconsIcon icon={icon} size={15} strokeWidth={2} className={iconClass} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-(--nv-text)">{label}</p>
          <p className="truncate text-[11.5px] text-(--nv-text-3)">{hint}</p>
        </div>
      </div>

      {/* Interruptor estilo Apple iOS */}
      <span
        aria-hidden
        className={`relative inline-flex h-6 w-10.5 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
          checked ? "bg-[#4EA7EB]" : "bg-(--nv-line-strong)"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.22)] transition-transform duration-200 ${
            checked ? "translate-x-4.5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
