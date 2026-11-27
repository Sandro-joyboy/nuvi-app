"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  Download01Icon,
  EyeIcon,
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

const TABS: { id: AnalyticsTab; label: string }[] = [
  { id: "visao", label: "Visão geral" },
  { id: "publicacoes", label: "Publicações" },
  { id: "criadores", label: "Criadores" },
  { id: "atribuicao", label: "Atribuição" },
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
      {/* Barra superior em vidro líquido (controlo segmentado + exportar) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Secções de análises"
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

        <button
          type="button"
          onClick={handleExport}
          className="lg-control sq inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
        >
          <HugeiconsIcon icon={Download01Icon} size={15} strokeWidth={2.1} className="text-[#4EA7EB]" />
          {exported ? "Exportado" : "Exportar CSV"}
        </button>
      </div>

      {/* Tab: Visão geral */}
      {tab === "visao" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col gap-5">
            <PerformanceCard />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Card className="flex min-h-[260px] flex-col">
                <SectionHeader
                  title="Top publicações"
                  subtitle="Por desempenho"
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
                    <SquircleTile size={48} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                      <HugeiconsIcon icon={Video01Icon} size={22} strokeWidth={1.8} className="text-[#4EA7EB]" />
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

              <Card className="flex min-h-[260px] flex-col">
                <SectionHeader
                  title="Top criadores"
                  subtitle={roster.length > 0 ? `${roster.length} convidados` : "Equipa ativa"}
                  actions={
                    <button
                      type="button"
                      onClick={() => setTab("criadores")}
                      className="lg-control sq inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-[12px] font-semibold text-(--nv-text)"
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
                        <span className="sq rounded-full bg-(--nv-accent-soft) px-2.5 py-0.5 text-[11px] font-semibold text-[#0076E8] dark:text-[#60B5FF]">
                          Convidado
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={
                      <SquircleTile size={48} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
                        <HugeiconsIcon icon={UserGroupIcon} size={22} strokeWidth={1.8} className="text-(--nv-text-2)" />
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

            <Card>
              <SectionHeader
                title="Audiência por país"
                subtitle="Onde os teus conteúdos geram mais alcance"
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

          {/* Coluna direita */}
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 xl:flex">
            <Card>
              <SectionHeader title="Resumo" subtitle="Custos e eficiência" />
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
                    className="sq rounded-[20px] bg-(--nv-solid) p-3.5 shadow-[0_0_0_0.5px_var(--nv-hairline),0_4px_14px_-8px_var(--nv-shadow)]"
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

            <Card>
              <SectionHeader title="Atividade" subtitle="Últimas 14 semanas" />
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
                            className="h-3 w-3 rounded-[4px] bg-(--nv-fill)"
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
        <Card className="flex min-h-[420px] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader title="Publicações" subtitle="Métricas vídeo a vídeo" />
            <label className="lg-control sq flex h-9 w-full items-center gap-2 rounded-full px-3.5 sm:w-60">
              <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
              <span className="sr-only">Pesquisar publicações</span>
              <input
                type="search"
                value={postQuery}
                onChange={(e) => setPostQuery(e.target.value)}
                placeholder="Pesquisar legenda"
                className="w-full min-w-0 bg-transparent text-[13.5px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3) [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-14 text-center">
            <Image src="/icons/video.svg" alt="" width={78} height={68} className="select-none" draggable={false} />
            <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">Sem publicações ainda</h2>
            <p className="mt-1.5 max-w-[340px] text-[13.5px] text-(--nv-text-3)">
              Os vídeos publicados pelos teus criadores aparecem aqui com métricas diárias.
            </p>
            <Link href="/painel/descobrir" className="nuvi-btn-sm sq mt-6 !h-11 !px-6">
              Descobrir criadores
            </Link>
          </div>
        </Card>
      )}

      {/* Tab: Criadores */}
      {tab === "criadores" && (
        <Card className="flex min-h-[420px] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader
              title="Criadores"
              subtitle={roster.length > 0 ? `${roster.length} na tua lista` : "Desempenho da equipa"}
            />
            <div className="flex items-center gap-2">
              <label className="lg-control sq flex h-9 w-52 items-center gap-2 rounded-full px-3.5">
                <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
                <span className="sr-only">Pesquisar criadores</span>
                <input
                  type="search"
                  value={creatorQuery}
                  onChange={(e) => setCreatorQuery(e.target.value)}
                  placeholder="Pesquisar"
                  className="w-full min-w-0 bg-transparent text-[13.5px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3) [&::-webkit-search-cancel-button]:hidden"
                />
              </label>
              <Link href="/painel/descobrir" className={ghostCta}>
                Descobrir
              </Link>
            </div>
          </div>

          {filteredRoster.length > 0 ? (
            <ul className="mt-5 divide-y divide-(--nv-line)">
              {filteredRoster.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-3.5 text-[13.5px]">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
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
                  <div className="flex items-center gap-5 tabular-nums">
                    <span className="sq rounded-full bg-(--nv-accent-soft) px-2.5 py-0.5 text-[11.5px] font-semibold text-[#0076E8] dark:text-[#60B5FF]">
                      Convidado
                    </span>
                    <div className="text-right">
                      <p className="font-semibold text-(--nv-text)">{c.views}</p>
                      <p className="text-[11px] text-(--nv-text-3)">Views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-(--nv-text)">{c.cpm}</p>
                      <p className="text-[11px] text-(--nv-text-3)">CPM</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-14 text-center">
              <Image src="/icons/profile.svg" alt="" width={78} height={68} className="select-none" draggable={false} />
              <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">Sem criadores ativos</h2>
              <p className="mt-1.5 max-w-[340px] text-[13.5px] text-(--nv-text-3)">
                Convida criadores para acompanhar visualizações, engajamento e retorno por pessoa.
              </p>
              <Link href="/painel/descobrir" className="nuvi-btn-sm sq mt-6 !h-11 !px-6">
                Descobrir criadores
              </Link>
            </div>
          )}
        </Card>
      )}

      {/* Tab: Atribuição */}
      {tab === "atribuicao" && (
        <Card className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <Image src="/icons/graph.svg" alt="" width={78} height={68} className="select-none" draggable={false} />
          <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">Atribuição e vendas</h2>
          <p className="mt-1.5 max-w-[360px] text-[13.5px] leading-relaxed text-(--nv-text-3)">
            Liga o teu site ou códigos de desconto para ver que criadores trazem mais clientes.
          </p>
          <Link href="/onboarding" className="nuvi-btn-sm sq mt-6 !h-11 !px-6">
            Configurar campanha
          </Link>
        </Card>
      )}
    </div>
  );
}
