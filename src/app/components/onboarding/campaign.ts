"use client";

// Rascunho e campanha criada no onboarding (localStorage até existir API).
import { useSyncExternalStore } from "react";

export type Goal = "anuncios" | "organico" | "influenciadores";
export type Experience = "primeira" | "algumas" | "regular";
export type Budget = "ate-100" | "100-500" | "500-mais" | "nao-sei";

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
