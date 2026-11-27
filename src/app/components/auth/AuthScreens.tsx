"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import EmailCodeFlow from "./EmailCodeFlow";
import { GoogleButton, GoogleError, useQueryParam } from "./GoogleButton";
import ThemeToggle from "./ThemeToggle";
import Confetti from "@/app/components/celebration/Confetti";
import { markWelcome } from "@/app/components/celebration/welcome";
import { AuthShell, PageTitle, secondaryBtn, textLink } from "./ui";
import { safeNextClient } from "./next";

/* ---------------- Entrar ---------------- */

export function LoginScreen() {
  const router = useRouter();
  const [codeStep, setCodeStep] = useState(false);
  const next = safeNextClient(useQueryParam("next"));
  return (
    <AuthShell back={{ href: "/" }} logo={!codeStep} corner={<ThemeToggle />}>
      <EmailCodeFlow
        title="Entrar na Nuvi"
        subtitle="Entra com o Google ou recebe um código no teu e-mail. Sem senhas."
        submitLabel="Continuar"
        verifyExtra={{ intent: "login" }}
        onVerified={() => router.replace(next)}
        above={
          <div className="flex flex-col gap-4">
            <GoogleError />
            <GoogleButton intent="login" />
          </div>
        }
        onStepChange={(s) => setCodeStep(s === "code")}
        below={
          <p className="text-center text-[13.5px] text-(--nv-text-3)">
            Novo na Nuvi?{" "}
            <Link href="/" className={textLink}>
              Criar conta
            </Link>
          </p>
        }
      />
    </AuthShell>
  );
}

/* ---------------- Cadastro ---------------- */

const COPY = {
  marca: {
    eyebrow: "Para marcas",
    title: "Cria a conta da tua marca",
    subtitle: "Lança campanhas com criadores e paga em Kwanzas. Grátis para começar.",
    emailLabel: "E-mail de trabalho",
    emailPlaceholder: "nome@empresa.ao",
    switch: { text: "És criador?", cta: "Criar conta de criador", href: "/cadastro/criador" },
  },
  criador: {
    eyebrow: "Para criadores",
    title: "Cria a tua conta de criador",
    subtitle: "Cria conteúdo para marcas de que gostas e recebe por isso.",
    emailLabel: "E-mail",
    emailPlaceholder: "nome@email.com",
    switch: { text: "Tens uma marca?", cta: "Criar conta de marca", href: "/cadastro/marca" },
  },
} as const;

export function SignupScreen({ role }: { role: "marca" | "criador" }) {
  const router = useRouter();
  const [done, setDone] = useState<string | null>(null);
  const [codeStep, setCodeStep] = useState(false);
  const c = COPY[role];

  if (done) return <CreatorWelcome email={done} />;

  return (
    <AuthShell back={{ href: "/" }} logo={!codeStep} corner={<ThemeToggle />}>
      <EmailCodeFlow
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={c.subtitle}
        emailLabel={c.emailLabel}
        emailPlaceholder={c.emailPlaceholder}
        submitLabel="Criar conta"
        verifyExtra={{ intent: "signup", role }}
        above={
          role === "marca" ? (
            <div className="flex flex-col gap-4">
              <GoogleError />
              <GoogleButton intent="signup" />
            </div>
          ) : undefined
        }
        onVerified={(email) => {
          if (role === "marca") {
            // Celebração no painel, quando a marca lá chegar pela primeira vez.
            markWelcome({ role, email });
            router.push("/onboarding");
          } else setDone(email);
        }}
        onStepChange={(s) => setCodeStep(s === "code")}
        below={
          <div className="flex flex-col items-center gap-1.5 text-[13.5px] text-(--nv-text-3)">
              <p>
                Já tens conta?{" "}
                <Link href="/entrar" className={textLink}>
                  Entrar
                </Link>
              </p>
              <p>
                {c.switch.text}{" "}
                <Link href={c.switch.href} className={textLink}>
                  {c.switch.cta}
                </Link>
              </p>
          </div>
        }
      />
    </AuthShell>
  );
}

/* ---------------- Criador: conta criada ---------------- */

function CreatorWelcome({ email }: { email: string }) {
  return (
    <AuthShell logo={false} corner={<ThemeToggle />}>
      <Confetti />
      <div className="nuvi-welcome text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-(--nv-success-soft) text-[#34C759]">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} strokeWidth={1.8} />
        </span>
        <PageTitle
          title="Conta criada"
          subtitle={
            <>
              Bem-vindo à Nuvi. Avisamos-te em{" "}
              <strong className="font-semibold break-all text-(--nv-text)">{email}</strong> quando houver
              campanhas para ti. Enviámos-te um e-mail de boas-vindas.
            </>
          }
        />
        <ol className="lg-surface sq mt-8 flex flex-col gap-4 rounded-[24px] p-5 text-left">
          {[
            ["Completa o teu perfil", "Nicho, redes sociais e exemplos de conteúdo."],
            ["Recebe convites", "As marcas encontram-te em Descobrir."],
            ["Cria e recebe", "Pagamento em Kwanzas após aprovação."],
          ].map(([t, d], i) => (
            <li key={t} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--nv-accent-soft) text-[13px] font-bold text-[#4EA7EB]">
                {i + 1}
              </span>
              <span>
                <span className="block text-[14.5px] font-semibold">{t}</span>
                <span className="block text-[13.5px] text-(--nv-text-3)">{d}</span>
              </span>
            </li>
          ))}
        </ol>
        <Link href="/" className={`${secondaryBtn} mt-6`}>
          Voltar ao início
        </Link>
      </div>
    </AuthShell>
  );
}
