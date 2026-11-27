"use client";

// Conversas com criadores, guardadas no localStorage até existir API.
// Mesmo padrão de prefs.ts: useSyncExternalStore com snapshot estável
// e sincronização entre separadores pelo evento "storage".
import { useSyncExternalStore } from "react";

export interface ChatMessage {
  id: string;
  body: string;
  /** Epoch em ms. */
  at: number;
  /** true = enviada pela marca; false = recebida do criador. */
  mine: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  /** "@handle" normalizado, usado para não duplicar conversas. */
  handle: string;
  messages: ChatMessage[];
  unread: number;
  updatedAt: number;
}

const KEY = "nuvi-messages";
const CHANGE_EVENT = "nuvi-messages-change";
const EMPTY: Conversation[] = [];

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

let cacheRaw: string | null = null;
let cache: Conversation[] = EMPTY;

function readAll(): Conversation[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? (parsed as Conversation[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function writeAll(list: Conversation[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Armazenamento cheio ou bloqueado: nada a fazer além de avisar os ouvintes.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Conversas, mais recentes primeiro. */
export function useConversations(): Conversation[] {
  return useSyncExternalStore(subscribe, readAll, () => EMPTY);
}

/** "@Ana.Costa" ou "Ana Costa" → nome a mostrar e @handle estável. */
export function parseRecipient(input: string) {
  const raw = input.trim();
  const bare = raw.replace(/^@+/, "");
  const handle =
    "@" +
    bare
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9._]+/g, ".")
      .replace(/^\.+|\.+$/g, "");
  const name = raw.startsWith("@") ? bare : raw.replace(/\s+/g, " ");
  return { name, handle };
}

/** Abre (ou reutiliza) a conversa com o destinatário e envia a 1.ª mensagem. Devolve o id. */
export function startConversation(recipient: string, body: string): string {
  const { name, handle } = parseRecipient(recipient);
  const list = readAll();
  const existing = list.find((c) => c.handle === handle);
  if (existing) {
    sendMessage(existing.id, body);
    return existing.id;
  }
  const now = Date.now();
  const convo: Conversation = {
    id: uid(),
    name,
    handle,
    messages: [{ id: uid(), body: body.trim(), at: now, mine: true }],
    unread: 0,
    updatedAt: now,
  };
  writeAll([convo, ...list]);
  return convo.id;
}

export function sendMessage(id: string, body: string) {
  const text = body.trim();
  if (!text) return;
  const now = Date.now();
  const list = readAll();
  const convo = list.find((c) => c.id === id);
  if (!convo) return;
  const next: Conversation = {
    ...convo,
    messages: [...convo.messages, { id: uid(), body: text, at: now, mine: true }],
    updatedAt: now,
  };
  writeAll([next, ...list.filter((c) => c.id !== id)]);
}

export function markRead(id: string) {
  const list = readAll();
  if (!list.some((c) => c.id === id && c.unread > 0)) return;
  writeAll(list.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
}

export function deleteConversation(id: string) {
  writeAll(readAll().filter((c) => c.id !== id));
}

/* ---------------- Formatação ---------------- */

const DAY = 86_400_000;
const startOfDay = (t: number) => new Date(t).setHours(0, 0, 0, 0);

/** Hora na conversa: "14:05". */
export const fmtClock = (t: number) =>
  new Date(t).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

/** Na lista: hoje → hora; ontem → "Ontem"; resto → "12 nov". */
export function fmtListTime(t: number, now = Date.now()) {
  const diff = startOfDay(now) - startOfDay(t);
  if (diff <= 0) return fmtClock(t);
  if (diff <= DAY) return "Ontem";
  return new Date(t)
    .toLocaleDateString("pt-PT", { day: "numeric", month: "short" })
    .replace(".", "");
}

/** Separador de dia: "Hoje", "Ontem" ou "quinta, 12 de novembro". */
export function fmtDay(t: number, now = Date.now()) {
  const diff = startOfDay(now) - startOfDay(t);
  if (diff <= 0) return "Hoje";
  if (diff <= DAY) return "Ontem";
  return new Date(t).toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export const isSameDay = (a: number, b: number) => startOfDay(a) === startOfDay(b);
