"use client";

// Rascunho e campanha criada no onboarding (localStorage até existir API).
import { useSyncExternalStore } from "react";

export type Goal = "anuncios" | "organico" | "influenciadores";
export type Experience = "primeira" | "algumas" | "regular";
export type Budget = "ate-100" | "100-500" | "500-mais" | "nao-sei";

export const BUDGET_META: Record<
  Budget,
  {
    shortLabel: string;
    unitLabel: string;
    presetPosts: number;
    maxKz: number | null;
  }
> = {
  "ate-100": {
    shortLabel: "Até 100K",
    unitLabel: "Kz / mês",
    presetPosts: 10,
    maxKz: 100_000,
  },
  "100-500": {
    shortLabel: "100K – 500K",
    unitLabel: "Kz / mês",
    presetPosts: 30,
    maxKz: 500_000,
  },
  "500-mais": {
    shortLabel: "500K+",
    unitLabel: "Kz / mês",
    presetPosts: 60,
    maxKz: null,
  },
  "nao-sei": {
    shortLabel: "Flexível",
    unitLabel: "plano sugerido",
    presetPosts: 30,
    maxKz: null,
  },
};

const VIEWS_PER_POST = 14_553;
const POSTS_PER_CREATOR = 30;
const COST_PER_POST_KZ = 10_000;

export function getPresetPostsForBudget(budget: Budget | null): number {
  return BUDGET_META[budget ?? "nao-sei"].presetPosts;
}

export function getSliderBounds(presetPosts: number): { min: number; max: number; step: number } {
  const step = presetPosts >= 60 ? 10 : 5;
  const min = presetPosts <= 10 ? 5 : 10;
  const max = Math.max(150, Math.ceil((presetPosts * 3) / step) * step);
  return { min, max, step };
}

export function computePlanProjection(posts: number) {
  const creators = Math.max(1, Math.ceil(posts / POSTS_PER_CREATOR));
  const views = Math.round(posts * VIEWS_PER_POST);
  const spendKz = posts * COST_PER_POST_KZ;
  return { creators, posts, views, spendKz };
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
  experience: Experience | null;
  ages: string[];
  gender: "todos" | "mulheres" | "homens";
  regions: string[];
  brandName: string;
  website: string;
  instagram: string;
  source: string | null;
  budget: Budget | null;
  plannedPosts: number | null;
}

export type CampaignPlatform = "tiktok" | "instagram";

export interface Campaign extends Omit<CampaignDraft, "step"> {
  createdAt: string;
  /** Mostrar a confirmação no painel uma vez. */
  justCreated: boolean;
  /** Criadores convidados no ecrã pós-onboarding. */
  invitedCreators?: string[];
  /** Personalização feita no ecrã de lançamento da campanha. */
  campaignTitle?: string;
  campaignBrief?: string;
  platforms?: CampaignPlatform[];
}

const DRAFT_KEY = "nuvi-campaign-draft";
const CAMPAIGN_KEY = "nuvi-campaign";
const EVENT = "nuvi-campaign-change";

export const EMPTY_DRAFT: CampaignDraft = {
  step: 0,
  goal: null,
  experience: null,
  ages: [],
  gender: "todos",
  regions: [],
  brandName: "",
  website: "",
  instagram: "",
  source: null,
  budget: null,
  plannedPosts: null,
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

export function saveCampaignLaunch(data: {
  invitedCreators: string[];
  campaignTitle: string;
  campaignBrief: string;
  platforms: CampaignPlatform[];
}) {
  const c = safeParse<Campaign>(localStorage.getItem(CAMPAIGN_KEY));
  if (!c) return;
  try {
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify({ ...c, ...data }));
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
