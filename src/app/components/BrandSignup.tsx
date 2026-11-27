"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft24,
  Check16,
  ExternalLink16,
  Eye16,
  EyeOff16,
  GoogleIcon,
  Mail16,
} from "@/app/components/icons";

type Step = "email" | "confirm-email" | "verified-password";

export default function BrandSignup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estado do código de 6 dígitos e timer de reenvio
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "confirm-email" || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, countdown]);

  useEffect(() => {
    if (step === "confirm-email") {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  const sendVerificationCode = async () => {
    setErrorMsg(null);
    setIsSending(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.error || "Não foi possível enviar o código. Tente novamente."
        );
        return;
      }

      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);
      setStep("confirm-email");
    } catch {
      setErrorMsg("Erro de conexão ao enviar o código.");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSending) return;
    await sendVerificationCode();
  };

  const handleOtpChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }

    if (digits.length > 1) {
      const next = [...otp];
      for (let i = 0; i < 6 - index && i < digits.length; i++) {
        next[index + i] = digits[i];
      }
      setOtp(next);
      const focusIdx = Math.min(index + digits.length, 5);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otp];
    next[index] = digits;
    setOtp(next);
    setErrorMsg(null);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const next = [...otp];
        next[index - 1] = "";
        setOtp(next);
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtp(next);
    setErrorMsg(null);

    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMsg("Insere os 6 dígitos do código enviado para o teu e-mail.");
      return;
    }

    setErrorMsg(null);
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Código inválido. Tente novamente.");
        return;
      }

      setPassword("");
      setShowPassword(false);
      setStep("verified-password");
    } catch {
      setErrorMsg("Erro de conexão ao verificar o código.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setErrorMsg(null);
    router.push("/onboarding");
  };

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-12 font-sans"
      style={{ backgroundImage: "url('/bg-choice.svg')" }}
    >
      {/* Botão Voltar (Liquid Glass 40x40 + Ícone Luma 24px) */}
      {step === "email" ? (
        <Link
          href="/"
          aria-label="Voltar"
          className="nuvi-glass-icon-btn !fixed top-6 left-6 z-10 md:top-[52px] md:left-[88px]"
        >
          <ArrowLeft24 size={24} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setStep("email");
          }}
          aria-label="Voltar"
          className="nuvi-glass-icon-btn !fixed top-6 left-6 z-10 md:top-[52px] md:left-[88px]"
        >
          <ArrowLeft24 size={24} />
        </button>
      )}

      {/* Bloco Coeso Centralizado */}
      <div className="flex w-full max-w-[540px] flex-col items-center pt-10 sm:pt-0">
        {/* Barra de Progresso / Etapas no Topo */}
        <nav
          aria-label="Etapas do cadastro"
          className="nuvi-text flex flex-wrap items-center justify-center gap-2 text-[13px] font-medium sm:gap-4"
        >
          {step === "email" ? (
            <span className="rounded-full bg-white px-4 py-1.5 text-[#0A0A0A] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
              1. Criar conta
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white/95">
              <Check16 size={14} />
              Criar conta
            </span>
          )}

          {step === "confirm-email" || step === "verified-password" ? (
            <span className="rounded-full bg-white px-4 py-1.5 text-[#0A0A0A] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
              2. Confirmar e-mail
            </span>
          ) : (
            <span className="px-3 py-1.5 text-white/90">
              2. Confirmar e-mail
            </span>
          )}

          <span className="px-3 py-1.5 text-white/90">
            3. Cria a tua campanha
          </span>
        </nav>

        {/* ETAPA 1: Criar Conta */}
        {step === "email" && (
          <div className="mt-10 flex w-full flex-col items-center text-center sm:mt-12">
            {/* Título e Subtítulo */}
            <h1 className="nuvi-title text-[28px] leading-[1.15] text-white sm:text-[36px]">
              Começa grátis em 30 segundos
            </h1>
            <p className="nuvi-text mt-2 text-[14px] text-white/90 sm:text-[15px]">
              Junta-te a milhares de negócios que crescem todos os dias
            </p>

            {/* Stack de Autenticação */}
            <div className="mt-8 w-full max-w-[380px]">
              {/* Botão Google */}
              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="nuvi-text flex h-[44px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[12px] border border-white/80 bg-white px-4 text-[14px] font-medium text-[#0A0A0A] shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#F9FAFB]"
              >
                <GoogleIcon size={18} />
                Continuar com o Google
              </button>

              {/* Divisor OU */}
              <div className="my-5 flex items-center">
                <div className="h-px flex-1 bg-white/35" />
                <span className="nuvi-text px-3 text-[11px] font-medium uppercase tracking-wider text-white/90">
                  OU
                </span>
                <div className="h-px flex-1 bg-white/35" />
              </div>

              {/* Formulário de E-mail de Trabalho */}
              <form className="flex flex-col" onSubmit={handleEmailSubmit}>
                <div className="relative flex items-center">
                  <Mail16
                    size={16}
                    className="pointer-events-none absolute left-3.5 text-[#71717A]"
                  />
                  <input
                    id="work-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="E-mail de trabalho"
                    aria-label="E-mail de trabalho"
                    className="nuvi-text h-[44px] w-full rounded-[12px] border border-white/80 bg-white pl-10 pr-3.5 text-[14px] text-[#0A0A0A] placeholder:text-[#71717A] shadow-[0_4px_16px_rgba(0,0,0,0.06)] outline-none transition-colors focus:border-[#4EA7EB]"
                  />
                </div>

                {errorMsg && (
                  <p className="nuvi-text mt-2 text-left text-[12.5px] font-medium text-red-700">
                    {errorMsg}
                  </p>
                )}

                {/* Botão Principal Nuvi Design System com Estado de Envio */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="nuvi-btn mt-3 w-full !h-[46px] !rounded-[12px] !text-[15px]"
                >
                  {isSending ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-hidden="true"
                      />
                      A enviar código...
                    </>
                  ) : (
                    "Criar minha conta grátis"
                  )}
                </button>
              </form>

              {/* Links de Conta / Troca de Perfil */}
              <div className="nuvi-text mt-5 flex flex-col items-center gap-1 text-[12.5px] text-[#52525B]">
                <p>
                  Já tens uma conta?{" "}
                  <Link
                    href="/painel"
                    className="font-semibold text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
                  >
                    Entrar
                  </Link>
                </p>
                <p>
                  És creator?{" "}
                  <Link
                    href="/cadastro/criador"
                    className="font-semibold text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
                  >
                    Regista-se como creator
                  </Link>
                </p>
              </div>

              {/* Termos e Privacidade */}
              <p className="nuvi-text mt-5 text-[11px] leading-[1.45] text-[#52525B]">
                Ao continuar, você concorda com os{" "}
                <Link
                  href="/termos"
                  className="underline transition-colors hover:text-[#0A0A0A]"
                >
                  Termos de Uso
                </Link>{" "}
                e
                <br />
                reconhece a{" "}
                <Link
                  href="/privacidade"
                  className="underline transition-colors hover:text-[#0A0A0A]"
                >
                  Política de Privacidade
                </Link>{" "}
                da Nuvi.
              </p>
            </div>
          </div>
        )}

        {/* ETAPA 2: Confirmar E-mail (Código 6 Dígitos) */}
        {step === "confirm-email" && (
          <div className="mt-10 flex w-full max-w-[400px] flex-col items-center text-center sm:mt-12">
            <h1 className="nuvi-title text-[28px] leading-[1.15] text-white sm:text-[34px]">
              Verifica o teu e-mail
            </h1>
            <p className="nuvi-text mt-2 text-[14px] leading-snug text-white/90 sm:text-[15px]">
              Insere o código de 6 dígitos que enviámos para
              <br />
              <strong className="font-semibold text-white">{email}</strong>
            </p>

            <form
              className="mt-7 flex w-full flex-col items-center"
              onSubmit={handleVerifySubmit}
            >
              {/* 6 Caixas de Dígito */}
              <div className="grid w-full grid-cols-6 gap-2.5 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={6}
                    value={digit}
                    aria-label={`Dígito ${index + 1} do código`}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="nuvi-text h-[54px] w-full rounded-[12px] border border-white/90 bg-white text-center text-[22px] font-semibold text-[#0A0A0A] shadow-[0_4px_16px_rgba(0,0,0,0.06)] outline-none transition-all focus:border-[#4EA7EB] focus:ring-2 focus:ring-[#4EA7EB]/25 sm:h-[58px]"
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="nuvi-text mt-3 text-center text-[13px] font-medium text-red-700">
                  {errorMsg}
                </p>
              )}

              {/* Botão Confirmar meu e-mail (Nuvi Glossy Blue) */}
              <button
                type="submit"
                disabled={isVerifying}
                className="nuvi-btn mt-5 w-full !h-[46px] !rounded-[12px] !text-[15px]"
              >
                {isVerifying ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      aria-hidden="true"
                    />
                    A confirmar...
                  </>
                ) : (
                  "Confirmar meu e-mail"
                )}
              </button>

              {/* Botão Abrir Gmail */}
              <a
                href="https://mail.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="nuvi-text mt-2.5 flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] border border-white/80 bg-white px-4 text-[14px] font-medium text-[#0A0A0A] shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#F9FAFB]"
              >
                <Mail16 size={16} />
                <span>Abrir Gmail</span>
                <ExternalLink16 size={15} className="text-[#52525B]" />
              </a>
            </form>

            {/* Reenviar código e Alterar e-mail */}
            <div className="nuvi-text mt-5 flex flex-col items-center gap-1.5 text-[13px] text-[#52525B]">
              {countdown > 0 ? (
                <p>Reenviar código em {countdown}s</p>
              ) : (
                <button
                  type="button"
                  disabled={isSending}
                  onClick={sendVerificationCode}
                  className="cursor-pointer font-semibold text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75 disabled:opacity-50"
                >
                  {isSending ? "A reenviar código..." : "Reenviar código"}
                </button>
              )}

              <p>
                E-mail errado?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setStep("email");
                  }}
                  className="cursor-pointer font-semibold text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
                >
                  Alterar
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ETAPA 2B: E-mail Verificado (Crie uma conta) */}
        {step === "verified-password" && (
          <div className="mt-10 flex w-full max-w-[400px] flex-col items-center text-center sm:mt-12">
            <Image
              src="/Tick.svg"
              alt="E-mail verificado"
              width={68}
              height={64}
              className="mb-3"
            />
            <h1 className="nuvi-title text-[28px] leading-[1.15] text-white sm:text-[34px]">
              E-mail verificado
            </h1>
            <p className="nuvi-text mt-2 text-[14px] leading-snug text-white/90 sm:text-[15px]">
              Define uma senha para concluir a criação da tua conta.
            </p>

            {/* Card Resumo do E-mail + Botão Alterar (Nuvi Design System) */}
            <div className="mt-7 flex w-full items-center justify-between gap-3 rounded-[16px] border border-white/80 bg-white px-5 py-3.5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
              <div className="min-w-0 flex-1">
                <p className="nuvi-text text-[12px] leading-tight text-[#71717A]">
                  Criando conta para:
                </p>
                <p className="nuvi-text mt-0.5 truncate text-[14px] font-semibold text-[#0A0A0A]">
                  {email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setStep("email");
                }}
                className="nuvi-btn-sm !h-[32px] !px-3.5 !text-[13px] shrink-0"
              >
                Alterar
              </button>
            </div>

            {/* Formulário de Criação de Senha */}
            <form
              className="mt-5 flex w-full flex-col"
              onSubmit={handlePasswordSubmit}
            >
              <label
                htmlFor="brand-verified-password"
                className="nuvi-text mb-1.5 text-left text-[13px] font-medium text-white/95"
              >
                Crie uma senha
              </label>

              <div className="relative flex items-center">
                <input
                  id="brand-verified-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Senha"
                  className="nuvi-text h-[46px] w-full rounded-[12px] border border-white/80 bg-white pl-3.5 pr-10 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] shadow-[0_4px_16px_rgba(0,0,0,0.06)] outline-none transition-colors focus:border-[#4EA7EB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3.5 flex cursor-pointer items-center justify-center text-[#71717A] transition-colors hover:text-[#0A0A0A]"
                >
                  {showPassword ? (
                    <Eye16 size={18} />
                  ) : (
                    <EyeOff16 size={18} />
                  )}
                </button>
              </div>

              {errorMsg && (
                <p className="nuvi-text mt-2 text-left text-[12.5px] font-medium text-red-700">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="nuvi-btn mt-4 w-full !h-[46px] !rounded-[12px] !text-[15px]"
              >
                Crie uma conta
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}
