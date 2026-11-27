"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, PencilEdit02Icon, SentIcon } from "@hugeicons/core-free-icons";
import { Field, Notice, PageTitle, PrimaryButton, secondaryBtn, textLink } from "./ui";

const RESEND_SECONDS = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Abre a caixa de correio certa a partir do domínio (só os mais comuns). */
function inboxFor(email: string): { label: string; href: string } | null {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (["gmail.com", "googlemail.com"].includes(domain)) return { label: "Abrir Gmail", href: "https://mail.google.com/" };
  if (/^(outlook|hotmail|live|msn)\./.test(domain)) return { label: "Abrir Outlook", href: "https://outlook.live.com/mail/" };
  if (domain.startsWith("yahoo.")) return { label: "Abrir Yahoo Mail", href: "https://mail.yahoo.com/" };
  if (["icloud.com", "me.com", "mac.com"].includes(domain)) return { label: "Abrir iCloud Mail", href: "https://www.icloud.com/mail" };
  return null;
}

interface EmailCodeFlowProps {
  /** Textos do passo do e-mail. */
  title: string;
  subtitle: string;
  eyebrow?: string;
  submitLabel: string;
  emailLabel?: string;
  /** Exemplo no campo (marca: e-mail de trabalho; criador: pessoal). */
  emailPlaceholder?: string;
  /** Conteúdo extra por baixo do formulário (links, termos). */
  below?: React.ReactNode;
  onVerified: (email: string) => void;
  /** Enviado com a verificação (ex.: cadastro de marca → e-mail de boas-vindas). */
  verifyExtra?: { intent: "signup" | "login"; role?: "marca" | "criador" };
  /** Muda o botão voltar do ecrã conforme o passo. */
  onStepChange?: (step: "email" | "code") => void;
}

export default function EmailCodeFlow({
  title,
  subtitle,
  eyebrow,
  submitLabel,
  emailLabel = "E-mail",
  emailPlaceholder = "nome@email.com",
  below,
  onVerified,
  verifyExtra,
  onStepChange,
}: EmailCodeFlowProps) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const goTo = (next: "email" | "code") => {
    setStep(next);
    onStepChange?.(next);
  };

  const sendCode = async (): Promise<boolean> => {
    setSendError(null);
    setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; previewUrl?: string };
      if (!res.ok || !data.ok) {
        setSendError(data.error ?? "Não foi possível enviar o código. Tenta de novo.");
        return false;
      }
      setPreviewUrl(data.previewUrl ?? null);
      return true;
    } catch {
      setSendError("Sem ligação. Verifica a internet e tenta de novo.");
      return false;
    } finally {
      setSending(false);
    }
  };

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setEmailError(`Escreve um e-mail válido, ex.: ${emailPlaceholder}`);
      return;
    }
    setEmail(value);
    if (await sendCode()) goTo("code");
  };

  if (step === "code") {
    return (
      <CodeStep
        email={email}
        resend={sendCode}
        resending={sending}
        resendError={sendError}
        previewUrl={previewUrl}
        onChangeEmail={() => goTo("email")}
        onVerified={() => onVerified(email)}
        verifyExtra={verifyExtra}
      />
    );
  }

  return (
    <div>
      <PageTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <form noValidate onSubmit={onEmailSubmit} className="mt-8 flex flex-col gap-4">
        <Field
          label={emailLabel}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          icon={Mail01Icon}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
            setSendError(null);
          }}
          placeholder={emailPlaceholder}
          error={emailError}
          hint="Enviamos um código de 6 dígitos para confirmar."
        />
        {sendError && <Notice>{sendError}</Notice>}
        <PrimaryButton type="submit" loading={sending} loadingText="A enviar código…">
          {submitLabel}
        </PrimaryButton>
      </form>

      {below && <div className="mt-6">{below}</div>}
    </div>
  );
}

/* ---------------- Passo do código ---------------- */

function CodeStep({
  email,
  resend,
  resending,
  resendError,
  previewUrl,
  onChangeEmail,
  onVerified,
  verifyExtra,
}: {
  email: string;
  resend: () => Promise<boolean>;
  resending: boolean;
  resendError: string | null;
  previewUrl: string | null;
  onChangeEmail: () => void;
  onVerified: () => void;
  verifyExtra?: EmailCodeFlowProps["verifyExtra"];
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const inbox = inboxFor(email);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const verify = async (value: string) => {
    if (value.length !== 6 || verifying) return;
    setError(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: value, ...verifyExtra }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Código incorreto. Confirma e tenta de novo.");
        setCode("");
        return;
      }
      onVerified();
    } catch {
      setError("Sem ligação. Verifica a internet e tenta de novo.");
    } finally {
      setVerifying(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setCode("");
    if (await resend()) {
      setCountdown(RESEND_SECONDS);
      setResent(true);
    }
  };

  return (
    <div>
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-(--nv-accent-soft) text-[#4EA7EB]">
        <HugeiconsIcon icon={SentIcon} size={26} strokeWidth={1.8} />
      </span>
      <PageTitle
        title="Confirma o teu e-mail"
        subtitle={
          <>
            Escreve o código que enviámos para{" "}
            <strong className="font-semibold break-all text-(--nv-text)">{email}</strong>. É válido por 10 minutos.
          </>
        }
      />

      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          verify(code);
        }}
      >
        <OtpInput
          value={code}
          disabled={verifying}
          invalid={!!error}
          onChange={(v) => {
            setCode(v);
            setError(null);
            if (v.length === 6) verify(v); // envia sozinho ao completar
          }}
        />
        {error && <Notice>{error}</Notice>}
        {resendError && <Notice>{resendError}</Notice>}
        {resent && !error && !resendError && <Notice tone="info">Enviámos um novo código.</Notice>}

        <PrimaryButton type="submit" loading={verifying} loadingText="A confirmar…" disabled={code.length !== 6}>
          Confirmar
        </PrimaryButton>
        {inbox && (
          <a href={inbox.href} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
            <HugeiconsIcon icon={Mail01Icon} size={17} strokeWidth={1.8} />
            {inbox.label}
          </a>
        )}
        {previewUrl && (
          <Notice tone="info">
            Modo de desenvolvimento:{" "}
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className={textLink}>
              ver o e-mail de teste
            </a>
          </Notice>
        )}
      </form>

      <div className="mt-6 flex flex-col items-center gap-2.5 text-[13.5px] text-(--nv-text-3)">
        {countdown > 0 ? (
          <p aria-live="polite">Reenviar código em {countdown}s</p>
        ) : (
          <button type="button" onClick={onResend} disabled={resending} className={textLink}>
            {resending ? "A reenviar…" : "Reenviar código"}
          </button>
        )}
        <button type="button" onClick={onChangeEmail} className="inline-flex cursor-pointer items-center gap-1.5 font-medium hover:text-(--nv-text)">
          <HugeiconsIcon icon={PencilEdit02Icon} size={14} strokeWidth={2} />
          Usar outro e-mail
        </button>
      </div>
    </div>
  );
}

/* ---------------- Campo do código (6 caixas) ---------------- */

/**
 * Um único <input> real (transparente) por cima de 6 caixas visuais:
 * preenchimento automático do SMS/e-mail, colar e apagar funcionam nativamente,
 * e o leitor de ecrã vê um só campo com rótulo.
 */
function OtpInput({
  value,
  onChange,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="relative">
      <label htmlFor="otp" className="sr-only">
        Código de 6 dígitos
      </label>
      <input
        ref={ref}
        id="otp"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
      />
      <div aria-hidden className="grid grid-cols-6 gap-2 sm:gap-2.5">
        {Array.from({ length: 6 }, (_, i) => {
          const char = value[i] ?? "";
          const isCurrent = focused && i === Math.min(value.length, 5);
          return (
            <div
              key={i}
              className={`sq flex h-14 items-center justify-center rounded-[14px] border bg-(--nv-solid) text-[24px] font-semibold tabular-nums transition-all sm:h-16 ${
                invalid
                  ? "border-[#FF3B30]"
                  : isCurrent
                    ? "border-[#4EA7EB] shadow-[0_0_0_4px_rgba(78,167,235,0.15)]"
                    : "border-(--nv-line-strong)"
              }`}
            >
              {char || (isCurrent ? <span className="h-6 w-px animate-pulse bg-(--nv-text) motion-reduce:animate-none" /> : null)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
