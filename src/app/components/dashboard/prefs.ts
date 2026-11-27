"use client";

// Preferências locais do painel (tema e perfil), guardadas no localStorage.
// useSyncExternalStore mantém o render do servidor estável (snapshot fixo)
// e sincroniza entre separadores através do evento "storage".
import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./theme-boot";

export type ThemePref = "light" | "dark" | "system";

export interface Profile {
  name: string;
  /** Foto como data URL (escolhida no browser). */
  photo: string | null;
}

const PROFILE_KEY = "nuvi-profile";
const CHANGE_EVENT = "nuvi-prefs-change";

const EMPTY_PROFILE: Profile = { name: "", photo: null };

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Armazenamento cheio ou bloqueado: a preferência vale só nesta sessão.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/* ---------------- Tema ---------------- */

function readTheme(): ThemePref {
  const v = read(THEME_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

/** Aplica o tema resolvido no <html> (mesma lógica do script inline do layout). */
export function applyTheme(pref: ThemePref) {
  const dark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function setThemePref(pref: ThemePref) {
  write(THEME_KEY, pref);
  applyTheme(pref);
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(subscribe, readTheme, () => "system");
}

/* ---------------- Perfil ---------------- */

let profileCacheRaw: string | null = null;
let profileCache: Profile = EMPTY_PROFILE;

function readProfile(): Profile {
  const raw = read(PROFILE_KEY);
  if (raw === profileCacheRaw) return profileCache; // snapshot estável
  profileCacheRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<Profile>) : null;
    profileCache = {
      name: typeof parsed?.name === "string" ? parsed.name : "",
      photo: typeof parsed?.photo === "string" ? parsed.photo : null,
    };
  } catch {
    profileCache = EMPTY_PROFILE;
  }
  return profileCache;
}

export function saveProfile(profile: Profile) {
  write(PROFILE_KEY, JSON.stringify(profile));
}

export function useProfile(): Profile {
  return useSyncExternalStore(subscribe, readProfile, () => EMPTY_PROFILE);
}

/** Inicial para o avatar: nome do utilizador, senão a marca. */
export function initialOf(name: string, fallback = "M") {
  return (name.trim()[0] ?? fallback).toUpperCase();
}
