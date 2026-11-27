import { NextRequest, NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";

/**
 * Só quem tem sessão entra na plataforma. Sem sessão → /entrar?next=<página>.
 * Com sessão, /entrar leva direto ao painel.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/entrar") {
    if (!session) return NextResponse.next();
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  if (!session) {
    const url = new URL("/entrar", request.url);
    url.searchParams.set("next", pathname + search);
    const res = NextResponse.redirect(url);
    // Cookie inválido ou expirado: limpa-o.
    if (request.cookies.has(SESSION_COOKIE)) res.cookies.delete(SESSION_COOKIE);
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*", "/onboarding/:path*", "/dashboard/:path*", "/entrar"],
};
