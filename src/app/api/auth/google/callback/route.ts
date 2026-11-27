import crypto from "crypto";
import { NextRequest, NextResponse, after } from "next/server";
import {
  GOOGLE_STATE_COOKIE,
  createSessionToken,
  safeNext,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/email";

interface GoogleIdToken {
  aud: string;
  iss: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  exp: number;
}

/** Regresso do Google: valida o state, troca o código e cria a sessão. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  let saved: { state: string; next: string; intent: "login" | "signup"; from: string } | null = null;
  try {
    saved = JSON.parse(request.cookies.get(GOOGLE_STATE_COOKIE)?.value ?? "null");
  } catch {
    saved = null;
  }
  const from = saved?.from === "/cadastro/marca" ? "/cadastro/marca" : "/entrar";
  const fail = (code: string) => {
    const res = NextResponse.redirect(new URL(`${from}?erro=${code}`, request.url));
    res.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/api/auth/google" });
    return res;
  };

  if (params.get("error")) return fail("google-cancelado");

  const state = params.get("state") ?? "";
  const code = params.get("code");
  if (
    !saved ||
    !code ||
    state.length !== saved.state.length ||
    !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(saved.state))
  ) {
    return fail("google-falhou");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return fail("google-indisponivel");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokens = (await tokenRes.json()) as { id_token?: string };
    if (!tokenRes.ok || !tokens.id_token) return fail("google-falhou");

    // O id_token veio diretamente do Google por TLS (fluxo de servidor), por isso
    // basta confirmar a quem se destina, quem o emitiu e a validade.
    const claims = JSON.parse(
      Buffer.from(tokens.id_token.split(".")[1] ?? "", "base64url").toString("utf8")
    ) as GoogleIdToken;
    const issuerOk = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
    if (claims.aud !== clientId || !issuerOk || claims.exp * 1000 < Date.now()) return fail("google-falhou");
    if (!claims.email || !claims.email_verified) return fail("google-sem-email");

    const email = claims.email.toLowerCase();
    const res = NextResponse.redirect(new URL(safeNext(saved.next), request.url));
    res.cookies.set(
      SESSION_COOKIE,
      createSessionToken({ email, name: claims.name, picture: claims.picture, provider: "google" }),
      sessionCookieOptions
    );
    res.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/api/auth/google" });

    if (saved.intent === "signup") {
      const appUrl = request.nextUrl.origin;
      after(async () => {
        const sent = await sendWelcomeEmail({ email, role: "marca", appUrl });
        if (!sent.success) console.error("[Nuvi] Boas-vindas não enviadas para:", email);
      });
    }
    return res;
  } catch (error) {
    console.error("[Nuvi] Login com Google falhou:", error);
    return fail("google-falhou");
  }
}
