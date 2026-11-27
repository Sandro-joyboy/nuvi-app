"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  Calendar01Icon,
  Download01Icon,
  EyeIcon,
  File01Icon,
  Globe02Icon,
  Money01Icon,
  Search01Icon,
  TrendingUpIcon,
  UserGroupIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import { useCampaign } from "@/app/components/onboarding/campaign";
import { ALL_CREATORS } from "@/app/components/onboarding/creators";
import PerformanceCard from "./PerformanceCard";
import { Card, EmptyState, SectionHeader } from "./ui";

type AnalyticsTab = "visao" | "publicacoes" | "criadores" | "atribuicao";
type PostSort = "views" | "engajamento";

const TABS: { id: AnalyticsTab; label: string; icon: typeof AnalyticsUpIcon }[] = [
  { id: "visao", label: "Visão geral", icon: AnalyticsUpIcon },
  { id: "publicacoes", label: "Publicações", icon: File01Icon },
  { id: "criadores", label: "Criadores", icon: UserGroupIcon },
  { id: "atribuicao", label: "Atribuição", icon: TrendingUpIcon },
];

const WEEKDAYS = ["S", "T", "Q", "Q", "S", "S", "D"];
const HEATMAP_WEEKS = 14;

const ghostCta =
  "lg-control sq inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)";

export default function AnalyticsView() {
  const campaign = useCampaign();
  const [tab, setTab] = useState<AnalyticsTab>("visao");
  const [postSort, setPostSort] = useState<PostSort>("views");
  const [postQuery, setPostQuery] = useState("");
  const [creatorQuery, setCreatorQuery] = useState("");
  const [exported, setExported] = useState(false);

  const roster = useMemo(() => {
    const ids = campaign?.invitedCreators ?? [];
    return ALL_CREATORS.filter((c) => ids.includes(c.id));
  }, [campaign?.invitedCreators]);

  const filteredRoster = useMemo(() => {
    const q = creatorQuery.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter((c) => `${c.name} ${c.handle} ${c.location}`.toLowerCase().includes(q));
  }, [roster, creatorQuery]);

  const handleExport = () => {
    const rows = [
      ["Metrica", "Valor"],
      ["Visualizacoes", "0"],
      ["Engajamento", "0"],
      ["Curtidas", "0"],
      ["Comentarios", "0"],
      ["Partilhas", "0"],
      ["Total gasto (AOA)", "0"],
      ["Criadores convidados", String(roster.length)],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nuvi-analises.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2600);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-5">
      {/* Subtítulo */}
      <p className="-mt-2 text-[13.5px] font-medium text-(--nv-text-3)">
        Visão clara do desempenho das tuas campanhas, publicações e criadores.
      </p>

      {/* Separadores + ações */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--nv-line)">
        <div
          role="tablist"
          aria-label="Secções de análises"
          className="flex items-center gap-1 overflow-x-auto sm:gap-2"
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

        <div className="mb-2 flex items-center gap-2">
          <span className="lg-surface sq inline-flex h-9 items-center gap-2 rounded-full border border-(--nv-line) px-3.5 text-[12.5px] font-semibold text-(--nv-text-2)">
            <HugeiconsIcon icon={Calendar01Icon} size={14} strokeWidth={2} className="text-(--nv-text-3)" />
            Últimos 30 dias
          </span>

          <button
            type="button"
            onClick={handleExport}
            className="lg-control sq inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold text-(--nv-text)"
          >
            <HugeiconsIcon icon={Download01Icon} size={14} strokeWidth={2.1} className="text-[#4EA7EB]" />
            {exported ? "Exportado" : "Exportar"}
          </button>
        </div>
      </div>

      {/* Tab: Visão geral */}
      {tab === "visao" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_328px]">
          {/* Coluna principal */}
          <div className="flex min-w-0 flex-col gap-5">
            <PerformanceCard />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Top publicações */}
              <Card className="flex min-h-[260px] flex-col">
                <SectionHeader
                  title="Top publicações"
                  subtitle="Ordenado por impacto"
                  actions={
                    <div className="sq inline-flex rounded-full bg-(--nv-fill) p-[2px]">
                      {(
                        [
                          { id: "views", label: "Views" },
                          { id: "engajamento", label: "Eng." },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPostSort(opt.id)}
                          className={`h-7 cursor-pointer rounded-full px-2.5 text-[11.5px] font-semibold transition-all ${
                            postSort === opt.id
                              ? "lg-control text-(--nv-text)"
                              : "text-(--nv-text-3) hover:text-(--nv-text)"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  }
                />
                <EmptyState
                  icon={
                    <SquircleTile size={46} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                      <HugeiconsIcon icon={Video01Icon} size={21} strokeWidth={1.8} className="text-[#4EA7EB]" />
                    </SquircleTile>
                  }
                  title="Sem publicações ainda"
                  action={
                    <Link href="/painel/campanhas" className={ghostCta}>
                      Ver campanhas
                    </Link>
                  }
                />
              </Card>

              {/* Top criadores */}
              <Card className="flex min-h-[260px] flex-col">
                <SectionHeader
                  title="Top criadores"
                  subtitle={roster.length > 0 ? `${roster.length} convidados na campanha` : "Desempenho individual"}
                  actions={
                    <button
                      type="button"
                      onClick={() => setTab("criadores")}
                      className="cursor-pointer text-[12.5px] font-semibold text-[#4EA7EB] hover:underline"
                    >
                      Ver todos
                    </button>
                  }
                />
                {roster.length > 0 ? (
                  <ul className="mt-4 divide-y divide-(--nv-line)">
                    {roster.slice(0, 4).map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: c.avatarBg }}
                          >
                            {c.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-semibold text-(--nv-text)">{c.name}</p>
                            <p className="truncate text-[11.5px] text-(--nv-text-3)">{c.handle}</p>
                          </div>
                        </div>
                        <span className="sq rounded-full bg-(--nv-accent-soft) px-2.5 py-0.5 text-[11px] font-semibold text-[#4EA7EB]">
                          Convidado
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={
                      <SquircleTile size={46} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
                        <HugeiconsIcon icon={UserGroupIcon} size={21} strokeWidth={1.8} className="text-(--nv-text-2)" />
                      </SquircleTile>
                    }
                    title="Sem criadores ativos"
                    action={
                      <Link href="/painel/descobrir" className={ghostCta}>
                        Descobrir criadores
                      </Link>
                    }
                  />
                )}
              </Card>
            </div>

            {/* Visualizações por país */}
            <Card>
              <SectionHeader
                title="Audiência por país"
                subtitle="Explora onde os teus vídeos geram mais alcance"
                actions={
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-(--nv-text-3)">
                    <span>Menos</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4EA7EB]/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4EA7EB]/45" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4EA7EB]/75" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4EA7EB]" />
                    <span>Mais</span>
                  </div>
                }
              />
              <EmptyState
                compact
                icon={
                  <SquircleTile size={46} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                    <HugeiconsIcon icon={Globe02Icon} size={22} strokeWidth={1.8} className="text-[#4EA7EB]" />
                  </SquircleTile>
                }
                title="Sem dados de audiência ainda"
              />
            </Card>
          </div>

          {/* Coluna direita — Resumo + Atividade */}
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 xl:flex">
            {/* Resumo financeiro & CPM */}
            <Card>
              <SectionHeader title="Resumo do período" subtitle="Custos e eficiência" />
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  { label: "Média / vídeo", value: "0 Kz", icon: Money01Icon },
                  { label: "Vídeos pagos", value: "0", icon: Video01Icon },
                  { label: "Total gasto", value: "0 Kz", icon: Money01Icon },
                  { label: "Views totais", value: "0", icon: EyeIcon },
                  { label: "CPM atual", value: "—", icon: AnalyticsUpIcon },
                  { label: "CPM estimado", value: "1 150 Kz", icon: TrendingUpIcon },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="sq rounded-[18px] border border-(--nv-line) bg-(--nv-solid) p-3.5"
                  >
                    <div className="flex items-center gap-1.5 text-(--nv-text-3)">
                      <HugeiconsIcon icon={m.icon} size={13} strokeWidth={2} className="text-[#4EA7EB]" />
                      <span className="truncate text-[11px] font-medium">{m.label}</span>
                    </div>
                    <p className="font-title mt-2 truncate text-[19px] leading-none font-bold tracking-[-0.025em] text-(--nv-text) tabular-nums">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Atividade de publicações (heatmap minimalista) */}
            <Card>
              <SectionHeader title="Atividade de publicações" subtitle="Últimas 14 semanas" />
              <div className="mt-4 overflow-x-auto">
                <div className="inline-flex flex-col gap-1.5">
                  {WEEKDAYS.map((day, row) => (
                    <div key={`${day}-${row}`} className="flex items-center gap-1.5">
                      <span className="w-3 text-[10px] font-medium text-(--nv-text-3)">{day}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: HEATMAP_WEEKS }, (_, col) => (
                          <span
                            key={col}
                            aria-hidden
                            className="h-3 w-3 rounded-[3.5px] bg-(--nv-fill)"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-[12px] text-(--nv-text-3)">
                0 publicações registadas neste período.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Publicações */}
      {tab === "publicacoes" && (
        <Card className="overflow-hidden !p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--nv-line) px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-[17px] font-bold tracking-[-0.02em] text-(--nv-text)">Todas as publicações</h2>
              <p className="text-[12.5px] text-(--nv-text-3)">Entregas e métricas vídeo a vídeo</p>
            </div>
            <div className="lg-surface sq flex h-9 w-full items-center gap-2 rounded-full px-3.5 sm:w-64">
              <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
              <input
                type="search"
                value={postQuery}
                onChange={(e) => setPostQuery(e.target.value)}
                placeholder="Pesquisar por legenda…"
                aria-label="Pesquisar publicações"
                className="h-full w-full bg-transparent text-[13px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3)"
              />
            </div>
          </div>
          <EmptyState
            icon={
              <SquircleTile size={52} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                <HugeiconsIcon icon={File01Icon} size={23} strokeWidth={1.8} className="text-[#4EA7EB]" />
              </SquircleTile>
            }
            title="Sem publicações ainda"
            action={
              <Link href="/painel/descobrir" className={ghostCta}>
                Convidar criadores
              </Link>
            }
          />
        </Card>
      )}

      {/* Tab: Criadores */}
      {tab === "criadores" && (
        <Card className="overflow-hidden !p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--nv-line) px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-[17px] font-bold tracking-[-0.02em] text-(--nv-text)">Criadores na tua equipa</h2>
              <p className="text-[12.5px] text-(--nv-text-3)">
                {roster.length} {roster.length === 1 ? "criador convidado" : "criadores convidados"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="lg-surface sq flex h-9 w-52 items-center gap-2 rounded-full px-3.5">
                <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
                <input
                  type="search"
                  value={creatorQuery}
                  onChange={(e) => setCreatorQuery(e.target.value)}
                  placeholder="Pesquisar criador…"
                  aria-label="Pesquisar criadores"
                  className="h-full w-full bg-transparent text-[13px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3)"
                />
              </div>
              <Link href="/painel/descobrir" className={ghostCta}>
                Descobrir
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 border-b border-(--nv-line) bg-(--nv-fill-2) px-6 py-3 text-[12px] font-semibold text-(--nv-text-3)">
            <span className="col-span-2">Criador</span>
            <span>Estado</span>
            <span>Views (est.)</span>
            <span className="text-right">CPM médio</span>
          </div>

          {filteredRoster.length > 0 ? (
            <ul className="divide-y divide-(--nv-line)">
              {filteredRoster.map((c) => (
                <li key={c.id} className="grid grid-cols-5 items-center gap-3 px-6 py-3.5 text-[13.5px]">
                  <div className="col-span-2 flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                      style={{ background: c.avatarBg }}
                    >
                      {c.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-(--nv-text)">{c.name}</p>
                      <p className="truncate text-[12px] text-(--nv-text-3)">
                        {c.flag} {c.location}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="sq inline-flex items-center gap-1.5 rounded-full bg-(--nv-accent-soft) px-2.5 py-0.5 text-[11.5px] font-semibold text-[#4EA7EB]">
                      Convidado
                    </span>
                  </div>
                  <span className="font-semibold text-(--nv-text) tabular-nums">{c.views}</span>
                  <span className="text-right font-semibold text-(--nv-text-2) tabular-nums">{c.cpm}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={
                <SquircleTile size={52} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
                  <HugeiconsIcon icon={UserGroupIcon} size={23} strokeWidth={1.8} className="text-(--nv-text-2)" />
                </SquircleTile>
              }
              title="Sem criadores ativos ainda"
              action={
                <Link href="/painel/descobrir" className={ghostCta}>
                  Descobrir criadores
                </Link>
              }
            />
          )}
        </Card>
      )}

      {/* Tab: Atribuição */}
      {tab === "atribuicao" && (
        <Card>
          <SectionHeader
            title="Atribuição e conversões"
            subtitle="Liga o teu site ou códigos de desconto para acompanhar vendas geradas por cada criador"
          />
          <EmptyState
            icon={
              <SquircleTile size={52} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                <HugeiconsIcon icon={TrendingUpIcon} size={23} strokeWidth={1.8} className="text-[#4EA7EB]" />
              </SquircleTile>
            }
            title="Sem dados de atribuição ainda"
            action={
              <Link href="/onboarding" className={ghostCta}>
                Configurar campanha
              </Link>
            }
          />
        </Card>
      )}
    </div>
  );
}
