"use client";

// Marca "conta acabada de criar" para celebrar uma vez no primeiro ecrã a seguir.
import { useSyncExternalStore } from "react";

const KEY = "nuvi-welcome";

export interface Welcome {
  role: "marca" | "criador";
  email: string;
}

export function markWelcome(w: Welcome) {
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    /* sem armazenamento: só não há celebração */
  }
}

/** Lê e apaga (a celebração acontece uma única vez). */
export function takeWelcome(): Welcome | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    return JSON.parse(raw) as Welcome;
  } catch {
    return null;
  }
}

/* Leitura reativa (painel): mostra a celebração até ser fechada. */

const EVENT = "nuvi-welcome-change";
let cacheRaw: string | null = null;
let cache: Welcome | null = null;
function read(): Welcome | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? (JSON.parse(raw) as Welcome) : null;
    } catch {
      cache = null;
    }
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
export function useWelcome(): Welcome | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
export function dismissWelcome() {
  takeWelcome();
  window.dispatchEvent(new Event(EVENT));
}
