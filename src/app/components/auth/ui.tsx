// Primitivas dos ecrãs fora do painel (entrar, cadastro, onboarding, legais).
// Usam os mesmos tokens claro/escuro, vidro e cantos contínuos da dashboard.
import Image from "next/image";
import Link from "next/link";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

/* ---------------- Layout ---------------- */

interface AuthShellProps {
  children: ReactNode;
  /** Botão voltar: link ou ação. */
  back?: { href: string; label?: string } | { onClick: () => void; label?: string };
  /** Conteúdo à direita do topo (ex.: "Já tens conta? Entrar"). */
  aside?: ReactNode;
  /** Largura máxima do conteúdo. */
  width?: "sm" | "md" | "lg";
  footer?: boolean;
}

const WIDTHS = { sm: "max-w-[400px]", md: "max-w-[560px]", lg: "max-w-[760px]" };

export function AuthShell({ children, back, aside, width = "sm", footer = true }: AuthShellProps) {
  return (
    <div className="nuvi-ui relative flex min-h-dvh flex-col bg-(--nv-panel) font-sans text-(--nv-text)">
      {/* Luz ambiente — a mesma do painel */}
      <div
        aria-hidden
        style={{ opacity: "var(--nv-ambient)" }}
        className="pointer-events-none fixed inset-x-0 top-0 h-[560px] bg-[radial-gradient(55%_60%_at_20%_0%,rgba(78,167,235,0.2),transparent_70%),radial-gradient(40%_50%_at_85%_5%,rgba(175,82,222,0.1),transparent_70%)]"
      />

      <header className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          {back && <BackButton {...back} />}
          <Link href="/" aria-label="Nuvi — início" className="flex items-center gap-2.5 rounded-full">
            <Image src="/nuvi-cloud.png" alt="" width={36} height={36} priority className="h-9 w-9 rounded-full" />
            <span className="font-title text-[20px] font-bold tracking-[-0.03em]">nuvi</span>
          </Link>
        </div>
        {aside && <div className="text-[13.5px] text-(--nv-text-3)">{aside}</div>}
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 pt-4 pb-12 sm:pt-10">
        <div className={`w-full ${WIDTHS[width]}`}>{children}</div>
      </main>

      {footer && (
        <footer className="relative z-10 flex items-center justify-center gap-4 pb-6 text-[12.5px] text-(--nv-text-3)">
          <Link href="/termos" className="hover:text-(--nv-text)">Termos</Link>
          <span aria-hidden>·</span>
          <Link href="/privacidade" className="hover:text-(--nv-text)">Privacidade</Link>
        </footer>
      )}
    </div>
  );
}

function BackButton(props: { href: string; label?: string } | { onClick: () => void; label?: string }) {
  const cls =
    "lg-control flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--nv-text)";
  const icon = <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2} />;
  const label = props.label ?? "Voltar";
  return "href" in props ? (
    <Link href={props.href} aria-label={label} className={cls}>
      {icon}
    </Link>
  ) : (
    <button type="button" onClick={props.onClick} aria-label={label} className={cls}>
      {icon}
    </button>
  );
}

/* ---------------- Cabeçalho de página ---------------- */

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div>
      {eyebrow && (
        <p className="mb-2 text-[12.5px] font-semibold text-[#0082F6]">{eyebrow}</p>
      )}
      <h1 className="text-[28px] leading-[1.15] font-bold tracking-[-0.03em] text-balance sm:text-[32px]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[15px] leading-relaxed text-(--nv-text-2)">{subtitle}</p>
      )}
    </div>
  );
}

/* ---------------- Formulário ---------------- */

interface FieldProps extends ComponentProps<"input"> {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  icon?: typeof AlertCircleIcon;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, icon, id, className = "", ...props },
  ref
) {
  const inputId = id ?? `f-${label.toLowerCase().replace(/\W+/g, "-")}`;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-[13.5px] font-semibold text-(--nv-text)">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-(--nv-text-3)"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`sq h-12 w-full rounded-[14px] border bg-(--nv-solid) text-[15px] text-(--nv-text) outline-none transition-shadow placeholder:text-(--nv-text-3) ${
            icon ? "pl-10" : "pl-4"
          } pr-4 ${
            error
              ? "border-[#FF3B30] shadow-[0_0_0_4px_rgba(255,59,48,0.12)]"
              : "border-(--nv-line-strong) focus:border-[#0082F6] focus:shadow-[0_0_0_4px_rgba(0,130,246,0.15)]"
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#FF3B30]">
          <HugeiconsIcon icon={AlertCircleIcon} size={14} strokeWidth={2} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-[12.5px] text-(--nv-text-3)">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

/* ---------------- Botões ---------------- */

export function Spinner() {
  return (
    <span
      aria-hidden
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
    />
  );
}

interface PrimaryButtonProps extends ComponentProps<"button"> {
  loading?: boolean;
  loadingText?: string;
}

/** Botão principal (pílula azul brilhante do design system). */
export function PrimaryButton({ loading, loadingText, children, className = "", disabled, ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`nuvi-btn sq w-full !h-12 !text-[15px] ${className}`}
    >
      {loading ? (
        <>
          <Spinner />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Botão secundário em vidro. */
export const secondaryBtn =
  "lg-control sq inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-(--nv-text)";

export const textLink =
  "cursor-pointer font-semibold text-(--nv-text) underline decoration-(--nv-line-strong) underline-offset-4 transition-colors hover:decoration-current";

/* ---------------- Mensagens ---------------- */

export function Notice({ tone = "error", children }: { tone?: "error" | "info"; children: ReactNode }) {
  const styles =
    tone === "error"
      ? "bg-[#FF3B30]/10 text-[#D70015] dark:text-[#FF6961]"
      : "bg-(--nv-accent-soft) text-(--nv-text-2)";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`sq flex items-start gap-2.5 rounded-[14px] px-3.5 py-3 text-[13.5px] leading-snug ${styles}`}>
      <HugeiconsIcon icon={AlertCircleIcon} size={17} strokeWidth={2} className="mt-px shrink-0" />
      <div>{children}</div>
    </div>
  );
}
