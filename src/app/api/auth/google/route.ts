import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_STATE_COOKIE, safeNext } from "@/lib/session";

/** Início do login com Google: redireciona para o ecrã de consentimento. */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const intent = params.get("intent") === "signup" ? "signup" : "login";
  const from = intent === "signup" ? "/cadastro/marca" : "/entrar";
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();

  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET?.trim()) {
    return NextResponse.redirect(new URL(`${from}?erro=google-indisponivel`, request.url));
  }

  const state = crypto.randomBytes(24).toString("base64url");
  const next = safeNext(params.get("next"), intent === "signup" ? "/onboarding" : "/painel");

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${request.nextUrl.origin}/api/auth/google/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(url);
  res.cookies.set(GOOGLE_STATE_COOKIE, JSON.stringify({ state, next, intent, from }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google",
    maxAge: 10 * 60,
  });
  return res;
}
