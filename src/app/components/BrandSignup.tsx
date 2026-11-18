"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft24,
  Check16,
  Eye16,
  EyeOff16,
  GoogleIcon,
  Mail16,
} from "@/app/components/icons";

export default function BrandSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de criação de conta / autenticação futura
  };

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-between bg-cover bg-center bg-no-repeat px-4 py-8 font-sans sm:py-10"
      style={{ backgroundImage: "url('/bg-choice.svg')" }}
    >
      {/* Botão Voltar (Liquid Glass 40x40 + Ícone Luma 24px) */}
      {step === "password" ? (
        <button
          type="button"
          onClick={() => setStep("email")}
          aria-label="Voltar para o e-mail"
          className="nuvi-glass-icon-btn !fixed top-6 left-6 z-10 md:top-[52px] md:left-[88px]"
        >
          <ArrowLeft24 size={24} />
        </button>
      ) : (
        <Link
          href="/"
          aria-label="Voltar"
          className="nuvi-glass-icon-btn !fixed top-6 left-6 z-10 md:top-[52px] md:left-[88px]"
        >
          <ArrowLeft24 size={24} />
        </Link>
      )}

      {/* Barra de Progresso / Etapas no Topo */}
      <nav
        aria-label="Etapas do cadastro"
        className="nuvi-text flex flex-wrap items-center justify-center gap-2 pt-10 text-[13px] font-medium sm:gap-4 sm:pt-2"
      >
        <span
          className={
            step === "email"
              ? "rounded-full bg-white px-4 py-1.5 text-[#0A0A0A] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              : "px-3 py-1.5 text-white/85"
          }
        >
          1. Criar conta
        </span>
        <span
          className={
            step === "password"
              ? "rounded-full bg-white px-4 py-1.5 text-[#0A0A0A] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              : "px-3 py-1.5 text-white/90"
          }
        >
          2. Confirmar e-mail
        </span>
        <span className="px-3 py-1.5 text-white/90">
          3. Cria a tua campanha
        </span>
      </nav>

      {/* Conteúdo Central */}
      {step === "email" ? (
        <div className="my-auto flex w-full max-w-[540px] flex-col items-center py-8 text-center">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail de trabalho"
                  aria-label="E-mail de trabalho"
                  className="nuvi-text h-[44px] w-full rounded-[12px] border border-white/80 bg-white pl-10 pr-3.5 text-[14px] text-[#0A0A0A] placeholder:text-[#71717A] shadow-[0_4px_16px_rgba(0,0,0,0.06)] outline-none transition-colors focus:border-[#4EA7EB]"
                />
              </div>

              {/* Botão Principal Nuvi Design System */}
              <button
                type="submit"
                className="nuvi-btn mt-3 w-full !h-[46px] !rounded-[12px] !text-[15px]"
              >
                Criar minha conta grátis
              </button>
            </form>

            {/* Benefício Free Trial */}
            <div className="nuvi-text mt-3.5 flex items-center justify-center gap-1.5 text-[13px] text-[#3F3F46]">
              <Check16 size={14} className="text-[#16A34A]" />
              <span>
                <strong className="font-semibold text-[#16A34A]">$0 Hoje</strong>{" "}
                · 14 dias grátis · Cancela quando quiseres
              </span>
            </div>

            {/* Links de Conta / Troca de Perfil */}
            <div className="nuvi-text mt-5 flex flex-col items-center gap-1 text-[12.5px] text-[#52525B]">
              <p>
                Já tens uma conta?{" "}
                <Link
                  href="/login"
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
      ) : (
        /* ETAPA 2: Card Empilhado de Senha */
        <div className="my-auto flex w-full max-w-[420px] flex-col items-center py-8">
          {/* Card Traseiro (Topo com E-mail + Botão Alterar) */}
          <div className="-mb-5 flex w-[calc(100%-36px)] items-center justify-between gap-3 rounded-t-[22px] border border-[#E4E4E7] bg-white/95 px-5 pt-3.5 pb-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="min-w-0 flex-1 text-left">
              <p className="nuvi-text text-[12px] leading-tight text-[#71717A]">
                Entrando com:
              </p>
              <p className="nuvi-text mt-0.5 truncate text-[14px] font-semibold text-[#0A0A0A]">
                {email}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="nuvi-btn-sm !h-[32px] !px-3.5 !text-[13px] shrink-0"
            >
              Alterar
            </button>
          </div>

          {/* Card Frontal (Digite sua senha) */}
          <div className="relative z-10 w-full rounded-[28px] border border-[#EBEBEB] bg-white px-[32px] py-[34px] text-[#0A0A0A] shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
            <h1 className="nuvi-title text-[24px] leading-tight text-[#0A0A0A]">
              Crie sua senha
            </h1>

            <form className="mt-6 flex flex-col" onSubmit={handlePasswordSubmit}>
              <label
                htmlFor="brand-password"
                className="nuvi-text mb-1.5 text-[13px] font-normal text-[#71717A]"
              >
                Senha
              </label>

              <div className="relative flex items-center">
                <input
                  id="brand-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="nuvi-text h-[46px] w-full rounded-[12px] border border-[#E4E4E7] bg-white pl-3.5 pr-10 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] outline-none transition-colors focus:border-[#4EA7EB]"
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

              <button
                type="submit"
                className="nuvi-btn mt-5 w-full !h-[46px] !rounded-[12px] !text-[15px]"
              >
                Criar minha conta grátis
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rodapé: Prova Social com Logos de Public */}
      <footer className="flex flex-col items-center pb-4 text-center">
        <p className="nuvi-text text-[14px] font-medium text-[#52525B]">
          A confiança de mais de +3 marcas
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          <Image
            src="/Slotify-logo.svg"
            alt="Slotify"
            width={40}
            height={40}
            className="h-9 w-auto opacity-85"
          />
          <Image
            src="/Moco-Logo.svg"
            alt="Moco"
            width={82}
            height={20}
            className="h-5 w-auto opacity-85"
          />
          <Image
            src="/Lazy-logo.svg"
            alt="LAZY"
            width={50}
            height={15}
            className="h-4 w-auto opacity-85"
          />
        </div>
      </footer>
    </main>
  );
}
