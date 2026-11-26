"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Card, SectionHeader, ViewAllButton } from "./ui";

type RangeKey = "7d" | "30d" | "90d";
type MetricKey = "views" | "engagement" | "likes" | "comments" | "shares";

interface Metric {
  key: MetricKey;
  label: string;
  /** Cor da série = cor principal do ícone. */
  color: string;
  tint: string;
  /** Ícone de vidro em /public, recolorido para a cor da série. */
  icon: string;
}

const METRICS: Metric[] = [
  { key: "views", label: "Visualizações", color: "#0082F6", tint: "#E8F3FF", icon: "/Show.svg" },
  { key: "engagement", label: "Engajamento", color: "#FF9500", tint: "#FFF4E5", icon: "/Chart.svg" },
  { key: "likes", label: "Curtidas", color: "#FF2D55", tint: "#FFEAEE", icon: "/Heart.svg" },
  { key: "comments", label: "Comentários", color: "#34C759", tint: "#EAF9EE", icon: "/Chat.svg" },
  { key: "shares", label: "Partilhas", color: "#AF52DE", tint: "#F6ECFB", icon: "/Send.svg" },
];

const RANGE_DAYS: Record<RangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const fmtDay = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
const fmtNumber = (n: number) => n.toLocaleString("pt-PT");

// "Hoje" só existe no browser: no prerender o snapshot é null.
const noopSubscribe = () => () => {};
const readTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};
const serverTodayKey = () => null;

function buildDays(todayKey: string | null, count: number): Date[] {
  if (!todayKey) return [];
  const [yy, mm, dd] = todayKey.split("-").map(Number);
  const today = new Date(yy, mm, dd);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (count - i));
    return d;
  });
}

/** Máximo "redondo" para o eixo Y (mínimo 4, como na referência). */
function niceMax(value: number) {
  if (value <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value / 4)!;
  return step * pow * 4;
}

const CHART_H = 232;
const PAD = { top: 16, right: 12, bottom: 28, left: 36 };

export default function PerformanceCard() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [visible, setVisible] = useState<MetricKey[]>(METRICS.map((m) => m.key));
  const [addOpen, setAddOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const plotRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

  // Mede a largura real para desenhar o SVG sem distorcer texto.
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!addOpen) return;
    const close = (e: PointerEvent) => {
      if (!addRef.current?.contains(e.target as Node)) setAddOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAddOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [addOpen]);

  const todayKey = useSyncExternalStore(noopSubscribe, readTodayKey, serverTodayKey);
  const days = useMemo(() => buildDays(todayKey, RANGE_DAYS[range]), [todayKey, range]);

  // Sem integrações ligadas ainda: séries a zero.
  const series = useMemo(
    () =>
      Object.fromEntries(METRICS.map((m) => [m.key, days.map(() => 0)])) as Record<
        MetricKey,
        number[]
      >,
    [days]
  );

  const totals = useMemo(
    () =>
      Object.fromEntries(
        METRICS.map((m) => [m.key, series[m.key].reduce((a, b) => a + b, 0)])
      ) as Record<MetricKey, number>,
    [series]
  );

  const shown = METRICS.filter((m) => visible.includes(m.key));
  const hidden = METRICS.filter((m) => !visible.includes(m.key));
  const isEmpty = shown.every((m) => totals[m.key] === 0);

  const yMax = niceMax(Math.max(0, ...shown.flatMap((m) => series[m.key])));
  const yTicks = [0, 1, 2, 3, 4].map((i) => (yMax / 4) * i);
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (days.length <= 1 ? 0 : (i / (days.length - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  const xLabelCount = width < 480 ? 4 : 7;
  const xLabelIdx = Array.from({ length: days.length ? xLabelCount : 0 }, (_, i) =>
    Math.round((i / (xLabelCount - 1)) * (days.length - 1))
  );

  const toggle = (key: MetricKey) =>
    setVisible((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((k) => k !== key)
          : prev
        : METRICS.map((m) => m.key).filter((k) => k === key || prev.includes(k))
    );

  const onPointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(days.length - 1, Math.round(rel * (days.length - 1)))));
  };

  // A série selecionada primeiro fica por cima (desenhada por último).
  const drawOrder = [...shown].reverse();

  return (
    <Card aria-labelledby="perf-title">
      <SectionHeader
        id="perf-title"
        title="Desempenho"
        subtitle={
          days.length ? `${fmtDay(days[0])} – ${fmtDay(days[days.length - 1])}` : "\u00a0"
        }
        size="lg"
        actions={
          <>
            <div
              role="radiogroup"
              aria-label="Período"
              className="sq inline-flex rounded-full bg-[#0F172A]/[0.05] p-[3px]"
            >
              {(Object.keys(RANGE_DAYS) as RangeKey[]).map((key) => {
                const sel = range === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => {
                      setRange(key);
                      setHover(null);
                    }}
                    className={`h-7 cursor-pointer rounded-full px-3 text-[12px] font-semibold whitespace-nowrap tabular-nums transition-all duration-300 ${
                      sel ? "lg-control text-[#0A0A0A]" : "text-[#6B7280] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {RANGE_DAYS[key]} dias
                  </button>
                );
              })}
            </div>
            <ViewAllButton label="Ver desempenho" />
          </>
        }
      />

      {/* KPIs — tocar liga/desliga a série no gráfico */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
        {METRICS.map((m) => {
          const on = visible.includes(m.key);
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => toggle(m.key)}
              aria-pressed={on}
              className={`sq group flex cursor-pointer flex-col gap-3 rounded-[20px] p-3.5 text-left transition-all duration-300 ${
                on
                  ? "bg-white shadow-[0_0_0_0.5px_rgba(15,23,42,0.08),0_4px_14px_-8px_rgba(15,23,42,0.14)]"
                  : "bg-[#0F172A]/[0.03] opacity-60 hover:opacity-90"
              }`}
            >
              <span className="flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático pequeno */}
                <img
                  src={m.icon}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
                <span className="rounded-full bg-[#0F172A]/[0.05] px-1.5 py-0.5 text-[11px] font-medium text-[#6B7280] tabular-nums">
                  0%
                </span>
              </span>
              <span className="min-w-0">
                <span className="font-title block text-[24px] font-bold leading-none tracking-[-0.03em] text-[#0A0A0A] tabular-nums">
                  {fmtNumber(totals[m.key])}
                </span>
                <span className="mt-1.5 block truncate text-[12px] font-medium text-[#6B7280]">
                  {m.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Gráfico */}
      <div className="sq relative mt-4 rounded-[22px] bg-gradient-to-b from-[#F8FAFD] to-white px-2 pt-3 pb-1 shadow-[inset_0_0_0_0.5px_rgba(15,23,42,0.06)] sm:px-3">
        <div ref={plotRef} className="relative" style={{ height: CHART_H }}>
          {width > 0 && (
            <svg
              width={width}
              height={CHART_H}
              role="img"
              aria-label={`Gráfico de ${shown.map((s) => s.label).join(", ")} — ${
                isEmpty ? "sem dados neste período" : "dados diários"
              }`}
              className="block"
            >
              <defs>
                {shown.map((m) => (
                  <linearGradient key={m.key} id={`area-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={m.color} stopOpacity="0.16" />
                    <stop offset="1" stopColor={m.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {yTicks.map((t) => (
                <g key={t}>
                  <line
                    x1={PAD.left}
                    x2={width - PAD.right}
                    y1={y(t)}
                    y2={y(t)}
                    stroke={t === 0 ? "#E2E8F0" : "#EEF2F6"}
                    strokeDasharray={t === 0 ? undefined : "2 4"}
                  />
                  <text
                    x={PAD.left - 12}
                    y={y(t) + 4}
                    textAnchor="end"
                    className="fill-[#9CA3AF] text-[11px] tabular-nums"
                  >
                    {fmtNumber(t)}
                  </text>
                </g>
              ))}

              {xLabelIdx.map((i, n) => (
                <text
                  key={i}
                  x={x(i)}
                  y={CHART_H - 8}
                  textAnchor={n === 0 ? "start" : n === xLabelIdx.length - 1 ? "end" : "middle"}
                  className="fill-[#9CA3AF] text-[11px]"
                >
                  {fmtDay(days[i])}
                </text>
              ))}

              {days.length > 0 && drawOrder.map((m) => {
                const pts = series[m.key].map((v, i) => `${x(i)},${y(v)}`);
                const line = `M${pts.join(" L")}`;
                const area = `${line} L${x(days.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
                return (
                  <g key={m.key}>
                    <path d={area} fill={`url(#area-${m.key})`} />
                    <path
                      d={line}
                      fill="none"
                      stroke={m.color}
                      strokeWidth={2.25}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {hover !== null && (
                <g pointerEvents="none">
                  <line
                    x1={x(hover)}
                    x2={x(hover)}
                    y1={PAD.top}
                    y2={PAD.top + plotH}
                    stroke="#0F172A"
                    strokeOpacity="0.12"
                  />
                  {drawOrder.map((m) => (
                    <circle
                      key={m.key}
                      cx={x(hover)}
                      cy={y(series[m.key][hover])}
                      r={4.5}
                      fill="#fff"
                      stroke={m.color}
                      strokeWidth={2}
                    />
                  ))}
                </g>
              )}

              <rect
                x={PAD.left}
                y={PAD.top}
                width={plotW}
                height={plotH}
                fill="transparent"
                onPointerMove={onPointerMove}
                onPointerLeave={() => setHover(null)}
              />
            </svg>
          )}

          {/* Tooltip em vidro */}
          {hover !== null && width > 0 && (
            <div
              role="status"
              className="lg-surface sq pointer-events-none absolute z-10 min-w-[150px] rounded-[16px] px-3 py-2.5"
              style={{
                top: PAD.top,
                left: x(hover) + 176 > width ? x(hover) - 164 : x(hover) + 12,
              }}
            >
              <p className="text-[11px] font-semibold text-[#6B7280]">{fmtDay(days[hover])}</p>
              <ul className="mt-1.5 space-y-1">
                {shown.map((m) => (
                  <li key={m.key} className="flex items-center justify-between gap-4 text-[12px]">
                    <span className="flex items-center gap-1.5 text-[#374151]">
                      <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                      {m.label}
                    </span>
                    <span className="font-semibold text-[#0A0A0A] tabular-nums">
                      {fmtNumber(series[m.key][hover])}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isEmpty && hover === null && (
            <p className="lg-surface pointer-events-none absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap text-[#6B7280]">
              Sem dados ainda
            </p>
          )}
        </div>
      </div>

      {/* Legenda / séries */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {shown.map((m) => (
          <span
            key={m.key}
            className="sq inline-flex h-8 items-center gap-1.5 rounded-full pr-1 pl-3 text-[12.5px] font-semibold"
            style={{ background: m.tint, color: m.color }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
            {m.label}
            <button
              type="button"
              onClick={() => toggle(m.key)}
              disabled={shown.length === 1}
              aria-label={`Ocultar ${m.label}`}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2.4} />
            </button>
          </span>
        ))}

        <div ref={addRef} className="relative">
          <button
            type="button"
            onClick={() => setAddOpen((v) => !v)}
            disabled={hidden.length === 0}
            aria-label="Adicionar métrica"
            aria-expanded={addOpen}
            aria-haspopup="menu"
            className="lg-control flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#374151]"
          >
            <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.2} />
          </button>
          {addOpen && hidden.length > 0 && (
            <div
              role="menu"
              className="lg-surface sq absolute bottom-10 left-1/2 z-20 w-48 -translate-x-1/2 rounded-[18px] p-1.5"
            >
              {hidden.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    toggle(m.key);
                    setAddOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-[12px] px-2.5 py-2 text-left text-[13px] font-medium text-[#0A0A0A] hover:bg-[#0F172A]/[0.05]"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
