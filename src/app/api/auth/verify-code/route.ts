import { NextRequest, NextResponse, after } from "next/server";
import { cookies } from "next/headers";
import { OTP_COOKIE_NAME, verifyOtpToken } from "@/lib/otp";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      code?: string;
      /** Cadastro (envia boas-vindas) ou entrada. */
      intent?: "signup" | "login";
      role?: "marca" | "criador";
    };
    const email = body.email?.trim().toLowerCase();
    const code = body.code?.trim();

    if (!email || !code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Escreve os 6 dígitos do código." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(OTP_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Este código já não é válido. Pede um novo." },
        { status: 400 }
      );
    }

    const result = verifyOtpToken(token, email, code);
    if (!result.valid) {
      return NextResponse.json(
        { error: result.reason || "Código inválido." },
        { status: 400 }
      );
    }

    cookieStore.delete(OTP_COOKIE_NAME);
    // Código certo: a sessão fica iniciada neste browser.
    cookieStore.set(SESSION_COOKIE, createSessionToken({ email, provider: "email" }), sessionCookieOptions);

    // Conta nova: e-mail de boas-vindas depois de responder (não atrasa o ecrã).
    const role = body.role === "marca" || body.role === "criador" ? body.role : null;
    if (body.intent === "signup" && role) {
      const appUrl = request.nextUrl.origin;
      after(async () => {
        const sent = await sendWelcomeEmail({ email, role, appUrl });
        if (!sent.success) console.error("[Nuvi] Boas-vindas não enviadas para:", email);
      });
    }

    return NextResponse.json({
      ok: true,
      message: "E-mail confirmado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao verificar código OTP:", error);
    return NextResponse.json(
      { error: "Não foi possível validar o código." },
      { status: 500 }
    );
  }
}
