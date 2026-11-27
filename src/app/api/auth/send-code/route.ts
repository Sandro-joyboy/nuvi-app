import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendVerificationCodeEmail } from "@/lib/email";
import {
  createOtpToken,
  generateSixDigitCode,
  OTP_COOKIE_NAME,
  OTP_TTL_MS,
} from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Escreve um e-mail válido." },
        { status: 400 }
      );
    }

    const code = generateSixDigitCode();
    const token = createOtpToken(email, code);

    const result = await sendVerificationCodeEmail({ email, code });

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error || "Não foi possível enviar o código de verificação.",
        },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(OTP_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(OTP_TTL_MS / 1000),
    });

    return NextResponse.json({
      ok: true,
      message: "Código enviado com sucesso.",
      ...(result.previewUrl ? { previewUrl: result.previewUrl } : {}),
    });
  } catch (error) {
    console.error("Erro ao processar envio de código:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar o código de verificação." },
      { status: 500 }
    );
  }
}
