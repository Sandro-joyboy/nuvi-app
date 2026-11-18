"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft24,
  Eye16,
  EyeOff16,
  GoogleIcon,
} from "@/app/components/icons";

interface SignupCardProps {
  role: "criador" | "marca";
}

export default function SignupCard({ role }: SignupCardProps) {
  const isCreator = role === "criador";
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
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 font-sans"
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

      {step === "email" ? (
        /* ETAPA 1: Card Inicial de E-mail */
        <div className="w-full max-w-[420px] rounded-[28px] bg-white px-[32px] py-[36px] text-[#0A0A0A] shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          {/* Cabeçalho */}
          <div>
            <h1 className="nuvi-title text-[24px] leading-tight text-[#0A0A0A]">
              Crie sua conta gratis
            </h1>
            <p className="nuvi-text mt-1 text-[14px] text-[#71717A]">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
              >
                Entrar
              </Link>
            </p>
          </div>

          {/* Botão Continuar com o Google */}
          <button
            type="button"
            className="nuvi-text mt-6 flex h-[44px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border border-[#E4E4E7] bg-white px-4 text-[14px] font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#F9FAFB]"
          >
            <GoogleIcon size={18} />
            Continuar com o Google
          </button>

          {/* Divisor OU */}
          <div className="my-5 flex items-center">
            <div className="h-px flex-1 bg-[#F0F0F2]" />
            <span className="nuvi-text px-3 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
              OU
            </span>
            <div className="h-px flex-1 bg-[#F0F0F2]" />
          </div>

          {/* Formulário de E-mail */}
          <form className="flex flex-col" onSubmit={handleEmailSubmit}>
            <label
              htmlFor="email"
              className="nuvi-text mb-1.5 text-[13px] font-normal text-[#71717A]"
            >
              Endereço de e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="nuvi-text h-[44px] w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3.5 text-[14px] text-[#0A0A0A] placeholder:text-[#A1A1AA] outline-none transition-colors focus:border-[#4EA7EB]"
            />

            <p className="nuvi-text mt-2 text-[12.5px] leading-snug text-[#71717A]">
              {isCreator
                ? "Cadastro grátis. Seja contratado por marcas reais e receba."
                : "Cadastro grátis. Lance campanhas de UGC e acompanhe criadores."}
            </p>

            {/* Botão Principal Nuvi Design System */}
            <button
              type="submit"
              className="nuvi-btn mt-5 w-full !h-[46px] !rounded-[12px] !text-[15px]"
            >
              Criar conta
            </button>
          </form>

          {/* Alternar entre Criador e Marca */}
          <div className="nuvi-text mt-5 text-center text-[13px] text-[#71717A]">
            {isCreator ? (
              <>
                Tem uma marca?{" "}
                <Link
                  href="/cadastro/marca"
                  className="font-medium text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
                >
                  Cadastre-se como marca
                </Link>
              </>
            ) : (
              <>
                É um criador?{" "}
                <Link
                  href="/cadastro/criador"
                  className="font-medium text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
                >
                  Cadastre-se como criador
                </Link>
              </>
            )}
          </div>

          {/* Termos e Privacidade */}
          <p className="nuvi-text mt-5 text-center text-[11px] leading-[1.45] text-[#A1A1AA]">
            Ao continuar, você concorda com os{" "}
            <Link
              href="/termos"
              className="underline transition-colors hover:text-[#71717A]"
            >
              Termos de Uso
            </Link>{" "}
            e
            <br />
            reconhece a{" "}
            <Link
              href="/privacidade"
              className="underline transition-colors hover:text-[#71717A]"
            >
              Política de Privacidade
            </Link>{" "}
            da Nuvi.
          </p>
        </div>
      ) : (
        /* ETAPA 2: Card Empilhado de Senha (conforme referência) */
        <div className="flex w-full max-w-[420px] flex-col items-center">
          {/* Card Traseiro (Topo com E-mail + Botão Alterar) */}
          <div className="-mb-5 flex w-[calc(100%-36px)] items-center justify-between gap-3 rounded-t-[22px] border border-[#E4E4E7] bg-white/95 px-5 pt-3.5 pb-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="min-w-0 flex-1">
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
              Digite sua senha
            </h1>

            <form className="mt-6 flex flex-col" onSubmit={handlePasswordSubmit}>
              <label
                htmlFor="password"
                className="nuvi-text mb-1.5 text-[13px] font-normal text-[#71717A]"
              >
                Senha
              </label>

              <div className="relative flex items-center">
                <input
                  id="password"
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
                  className="absolute right-3.5 flex items-center justify-center text-[#71717A] transition-colors hover:text-[#0A0A0A] cursor-pointer"
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
                Criar conta
              </button>
            </form>

            <div className="nuvi-text mt-5 flex flex-col items-center gap-2 text-center text-[13px] text-[#71717A]">
              <p>
                Não quer usar sua senha?{" "}
                <button
                  type="button"
                  className="font-medium text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75 cursor-pointer"
                >
                  Código de acesso por e-mail
                </button>
              </p>
              <p>
                Esqueceu sua senha?{" "}
                <Link
                  href="/recuperar-senha"
                  className="font-medium text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
                >
                  Redefinir senha
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
