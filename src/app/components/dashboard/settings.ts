"use client";

import { useSyncExternalStore } from "react";

export type CompanyStage = "" | "inicio" | "crescimento" | "estabelecida" | "agencia";
export type NotifyChannel = "email" | "app" | "whatsapp";

export interface NotificationPrefs {
  all: boolean;
  messages: boolean;
  applicants: boolean;
  videoReview: boolean;
  payoutReceipts: boolean;
  pendingPayouts: boolean;
  weeklySummary: boolean;
}

export interface MocoStore {
  id: string;
  name: string;
  domain: string;
  connectedAt: string;
}

export interface PixelSite {
  id: string;
  domain: string;
  connectedAt: string;
}

export interface TeamMember {
  id: string;
  email: string;
  role: "admin" | "gestor";
  status: "ativo" | "convidado";
}

export interface WorkspaceSettings {
  email: string;
  twoFactor: boolean;
  companyName: string;
  companyLogo: string | null;
  companyStage: CompanyStage;
  website: string;
  phone: string;
  address: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  whatsapp: string;
  nif: string;
  verificationSubmitted: boolean;
  notifications: Record<NotifyChannel, NotificationPrefs>;
  mocoStores: MocoStore[];
  pixelSites: PixelSite[];
  members: TeamMember[];
}

const SETTINGS_KEY = "nuvi-workspace-settings";
const EVENT = "nuvi-settings-change";

const DEFAULT_CHANNEL: NotificationPrefs = {
  all: true,
  messages: true,
  applicants: true,
  videoReview: true,
  payoutReceipts: true,
  pendingPayouts: false,
  weeklySummary: false,
};

export const DEFAULT_SETTINGS: WorkspaceSettings = {
  email: "",
  twoFactor: false,
  companyName: "",
  companyLogo: null,
  companyStage: "",
  website: "",
  phone: "",
  address: "",
  instagram: "",
  tiktok: "",
  linkedin: "",
  whatsapp: "",
  nif: "",
  verificationSubmitted: false,
  notifications: {
    email: { ...DEFAULT_CHANNEL },
    app: { ...DEFAULT_CHANNEL },
    whatsapp: {
      all: false,
      messages: true,
      applicants: false,
      videoReview: true,
      payoutReceipts: true,
      pendingPayouts: false,
      weeklySummary: false,
    },
  },
  mocoStores: [],
  pixelSites: [],
  members: [],
};

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

let cacheRaw: string | null = null;
let cacheVal: WorkspaceSettings = DEFAULT_SETTINGS;

function readSettings(): WorkspaceSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw === cacheRaw) return cacheVal;
    cacheRaw = raw;
    if (!raw) {
      cacheVal = DEFAULT_SETTINGS;
      return cacheVal;
    }
    const parsed = JSON.parse(raw) as Partial<WorkspaceSettings>;
    cacheVal = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: {
        email: { ...DEFAULT_SETTINGS.notifications.email, ...(parsed.notifications?.email ?? {}) },
        app: { ...DEFAULT_SETTINGS.notifications.app, ...(parsed.notifications?.app ?? {}) },
        whatsapp: { ...DEFAULT_SETTINGS.notifications.whatsapp, ...(parsed.notifications?.whatsapp ?? {}) },
      },
      mocoStores: Array.isArray(parsed.mocoStores) ? parsed.mocoStores : [],
      pixelSites: Array.isArray(parsed.pixelSites) ? parsed.pixelSites : [],
      members: Array.isArray(parsed.members) ? parsed.members : [],
    };
    return cacheVal;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(next: WorkspaceSettings) {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    /* armazenamento indisponível */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function updateSettings(patch: Partial<WorkspaceSettings>) {
  saveSettings({ ...readSettings(), ...patch });
}

export function useWorkspaceSettings(): WorkspaceSettings {
  return useSyncExternalStore(subscribe, readSettings, () => DEFAULT_SETTINGS);
}
