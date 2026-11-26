// Primitivas do painel: um só sítio para raios, vidro e tipografia.
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

/** Raio do cartão = 28; conteúdo interno usa 20–22 (cantos concêntricos). */
export function Card({ className = "", children, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={`lg-surface sq rounded-[28px] p-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  id?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  size?: "md" | "lg";
}

export function SectionHeader({ id, title, subtitle, actions, size = "md" }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2
          id={id}
          className={`font-bold tracking-[-0.022em] text-[#0A0A0A] ${
            size === "lg" ? "text-[22px] leading-7" : "text-[17px] leading-6"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[12.5px] font-medium text-[#8A919E]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** "Ver tudo" em vidro. `label` dá contexto a leitores de ecrã. */
export function ViewAllButton({ label, href }: { label: string; href?: string }) {
  const cls =
    "lg-control sq inline-flex h-8 cursor-pointer items-center gap-1 rounded-full pr-2.5 pl-3.5 text-[12.5px] font-semibold text-[#0A0A0A]";
  const inner = (
    <>
      Ver tudo
      <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={2.1} />
    </>
  );
  return href ? (
    <Link href={href} aria-label={label} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" aria-label={label} className={cls}>
      {inner}
    </button>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon, title, action, compact }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-5" : "flex-1 py-10"
      }`}
    >
      {icon}
      <p className="mt-3 text-[13.5px] font-semibold text-[#374151]">{title}</p>
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
}
