import crypto from "crypto";
import { getOtpSecret } from "./otp";

// Sessão sem base de dados: um cookie httpOnly assinado com HMAC.
// Usa SESSION_SECRET se existir; senão deriva da OTP_SECRET (com separação
// de domínio, para um token de sessão nunca valer como código OTP e vice-versa).

export const SESSION_COOKIE = "nuvi_session";
export const GOOGLE_STATE_COOKIE = "nuvi_google_state";
export const SESSION_TTL_S = 30 * 24 * 60 * 60; // 30 dias

export interface Session {
  email: string;
  name?: string;
  picture?: string;
  provider: "email" | "google";
  exp: number;
}

function secret(): string {
  const own = process.env.SESSION_SECRET?.trim();
  if (own && own.length >= 32) return own;
  return `session:${getOtpSecret()}`;
}

const sign = (data: string) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");

export function createSessionToken(s: Omit<Session, "exp">): string {
  const payload: Session = { ...s, email: s.email.toLowerCase().trim(), exp: Date.now() + SESSION_TTL_S * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function readSessionToken(token: string | undefined | null): Session | null {
  if (!token) return null;
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;
    const a = Buffer.from(sig);
    const b = Buffer.from(sign(encoded));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Session;
    if (typeof payload.email !== "string" || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_S,
};

/** Só caminhos internos (evita redirecionar para outro site depois do login). */
export function safeNext(next: string | null | undefined, fallback = "/painel"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
