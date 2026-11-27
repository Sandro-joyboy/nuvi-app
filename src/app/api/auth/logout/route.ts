import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

/** Termina a sessão (POST, para não poder ser disparado por um simples link externo). */
export function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/entrar", request.url), 303);
  res.cookies.delete({ name: SESSION_COOKIE, path: "/" });
  return res;
}
