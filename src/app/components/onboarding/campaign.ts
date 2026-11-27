"use client";

// Rascunho e campanha criada no onboarding (localStorage até existir API).
import { useSyncExternalStore } from "react";

export type Goal = "anuncios" | "organico" | "influenciadores";
export type Experience = "primeira" | "algumas" | "regular";
export type Budget = "ate-100" | "100-500" | "500-mais" | "nao-sei";
export type WinMetric = "views" | "installs" | "customers";

export interface TargetOption {
  value: number;
  label: string;
  shortLabel: string;
}

export const METRIC_META: Record<
  WinMetric,
  {
    label: string;
    unitPerMonth: string;
    info: string;
    targets: TargetOption[];
  }
> = {
  views: {
    label: "Visualizações",
    unitPerMonth: "visualizações / mês",
    info: "Otimizamos a campanha para máximo alcance e visualizações orgânicas.",
    targets: [
      { value: 100_000, label: "100K visualizações", shortLabel: "100K" },
      { value: 500_000, label: "500K visualizações", shortLabel: "500K" },
      { value: 1_000_000, label: "1M visualizações", shortLabel: "1M" },
      { value: 5_000_000, label: "5M visualizações", shortLabel: "5M" },
      { value: 10_000_000, label: "10M visualizações", shortLabel: "10M" },
      { value: 25_000_000, label: "25M+ visualizações", shortLabel: "25M+" },
    ],
  },
  installs: {
    label: "Instalações",
    unitPerMonth: "instalações / mês",
    info: "Focamos em criadores que geram cliques e descargas diretas da tua app.",
    targets: [
      { value: 500, label: "500 instalações", shortLabel: "500" },
      { value: 2_000, label: "2K instalações", shortLabel: "2K" },
      { value: 5_000, label: "5K instalações", shortLabel: "5K" },
      { value: 15_000, label: "15K instalações", shortLabel: "15K" },
      { value: 50_000, label: "50K instalações", shortLabel: "50K" },
      { value: 100_000, label: "100K+ instalações", shortLabel: "100K+" },
    ],
  },
  customers: {
    label: "Clientes",
    unitPerMonth: "clientes / mês",
    info: "Selecionamos criadores com alta intenção de compra e conversão real.",
    targets: [
      { value: 25, label: "25 clientes", shortLabel: "25" },
      { value: 50, label: "50 clientes", shortLabel: "50" },
      { value: 150, label: "150 clientes", shortLabel: "150" },
      { value: 500, label: "500 clientes", shortLabel: "500" },
      { value: 1_500, label: "1,5K clientes", shortLabel: "1,5K" },
      { value: 5_000, label: "5K+ clientes", shortLabel: "5K+" },
    ],
  },
};

const VIEWS_PER_POST = 14_553;
const INSTALL_RATE = 0.012;
const CUSTOMER_RATE = 0.001867;
const POSTS_PER_CREATOR = 30;
const COST_PER_POST_KZ = 15_000;

export function getPresetPosts(metric: WinMetric, targetValue: number): number {
  const rate = metric === "views" ? 1 : metric === "installs" ? INSTALL_RATE : CUSTOMER_RATE;
  const neededViews = targetValue / rate;
  const raw = Math.ceil(neededViews / VIEWS_PER_POST);
  // Mínimo 30 publicações/mês (1 criador ativo), arredondado em múltiplos de 10.
  return Math.max(30, Math.ceil(raw / 10) * 10);
}

export function getSliderBounds(presetPosts: number): { min: number; max: number; step: number } {
  const step = presetPosts >= 300 ? 30 : 10;
  const min = Math.min(30, presetPosts);
  const max = Math.max(300, Math.ceil((presetPosts * 2.5) / step) * step);
  return { min, max, step };
}

export function computePlanProjection(metric: WinMetric, posts: number) {
  const creators = Math.max(1, Math.ceil(posts / POSTS_PER_CREATOR));
  const views = Math.round(posts * VIEWS_PER_POST);
  const installs = Math.round(views * INSTALL_RATE);
  const customers = Math.round(views * CUSTOMER_RATE);
  const spendKz = posts * COST_PER_POST_KZ;
  const projectedOutcome = metric === "views" ? views : metric === "installs" ? installs : customers;
  return { creators, posts, views, installs, customers, spendKz, projectedOutcome };
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m >= 10 ? Math.round(m) : m.toFixed(1).replace(".", ",")}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${k >= 100 ? k.toFixed(1).replace(".", ",") : k >= 10 ? Math.round(k) : k.toFixed(1).replace(".", ",")}K`;
  }
  return n.toLocaleString("pt-PT");
}

export function formatKwanzas(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(".", ",")}M Kz`;
  }
  return `${amount.toLocaleString("pt-PT")} Kz`;
}

export interface CampaignDraft {
  step: number;
  goal: Goal | null;
  metric: WinMetric;
  targetValue: number | null;
  plannedPosts: number | null;
  experience: Experience | null;
  ages: string[];
  gender: "todos" | "mulheres" | "homens";
  regions: string[];
  brandName: string;
  website: string;
  instagram: string;
  source: string | null;
  budget: Budget | null;
}

export interface Campaign extends Omit<CampaignDraft, "step"> {
  createdAt: string;
  /** Mostrar a confirmação no painel uma vez. */
  justCreated: boolean;
}

const DRAFT_KEY = "nuvi-campaign-draft";
const CAMPAIGN_KEY = "nuvi-campaign";
const EVENT = "nuvi-campaign-change";

export const EMPTY_DRAFT: CampaignDraft = {
  step: 0,
  goal: null,
  metric: "views",
  targetValue: 100_000,
  plannedPosts: null,
  experience: null,
  ages: [],
  gender: "todos",
  regions: [],
  brandName: "",
  website: "",
  instagram: "",
  source: null,
  budget: null,
};

function safeParse<T>(raw: string | null): T | null {
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function loadDraft(): CampaignDraft {
  const d = safeParse<Partial<CampaignDraft>>(localStorage.getItem(DRAFT_KEY));
  return { ...EMPTY_DRAFT, ...(d ?? {}) };
}

export function saveDraft(d: CampaignDraft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* armazenamento indisponível: o rascunho vale só nesta sessão */
  }
}

export function createCampaign(d: CampaignDraft) {
  const { step: _step, ...rest } = d;
  void _step;
  const c: Campaign = { ...rest, createdAt: new Date().toISOString(), justCreated: true };
  try {
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(c));
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function markCampaignSeen() {
  const c = safeParse<Campaign>(localStorage.getItem(CAMPAIGN_KEY));
  if (!c) return;
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify({ ...c, justCreated: false }));
  window.dispatchEvent(new Event(EVENT));
}

/* Leitura reativa da campanha criada (para o painel). */
let cacheRaw: string | null = null;
let cache: Campaign | null = null;
function readCampaign(): Campaign | null {
  const raw = localStorage.getItem(CAMPAIGN_KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cache = safeParse<Campaign>(raw);
  }
  return cache;
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
export function useCampaign(): Campaign | null {
  return useSyncExternalStore(subscribe, readCampaign, () => null);
}

/** true só no browser (depois da hidratação). */
const noop = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
