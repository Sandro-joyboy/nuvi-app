import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";

/** Quem tem sessão iniciada (para o cliente mostrar o e-mail/nome). */
export function GET(request: NextRequest) {
  const s = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: { email: s.email, name: s.name ?? null, picture: s.picture ?? null, provider: s.provider } });
}
