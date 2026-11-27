"use client";

import { useRef } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDataTransferHorizontalIcon,
  ComputerIcon,
  Logout01Icon,
  Moon02Icon,
  PaintBoardIcon,
  Settings01Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { useDialog } from "./useDialog";
import { setThemePref, useProfile, useThemePref, type ThemePref } from "./prefs";

const THEMES: { key: ThemePref; label: string; icon: typeof Sun03Icon }[] = [
  { key: "light", label: "Claro", icon: Sun03Icon },
  { key: "dark", label: "Escuro", icon: Moon02Icon },
  { key: "system", label: "Sistema", icon: ComputerIcon },
];

interface AccountMenuProps {
  open: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  avatar: React.ReactNode;
}

export default function AccountMenu(props: AccountMenuProps) {
  if (!props.open) return null;
  return <MenuBody {...props} />;
}

const itemBase =
  "flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-[14px] font-medium transition-colors hover:bg-(--nv-fill)";
const itemCls = `${itemBase} text-(--nv-text)`;

function MenuBody({ onClose, onEditProfile, avatar }: AccountMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useThemePref();
  const profile = useProfile();
  useDialog(true, onClose, ref);

  return (
    <>
      {/* Clique fora fecha */}
      <div className="fixed inset-0 z-[55]" onPointerDown={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-label="Conta"
        className="nuvi-pop sq fixed bottom-3 left-[92px] z-[56] w-[272px] rounded-[22px] bg-(--nv-glass-strong) p-1.5 shadow-[inset_0_1px_0_var(--nv-glass-edge),0_0_0_0.5px_var(--nv-line),0_20px_50px_-16px_var(--nv-shadow)] backdrop-blur-2xl"
      >
        <button type="button" onClick={onEditProfile} className="flex w-full cursor-pointer items-center gap-3 rounded-[16px] p-2.5 text-left hover:bg-(--nv-fill)">
          {avatar}
          <span className="min-w-0">
            <span className="block truncate text-[16px] font-bold tracking-[-0.02em] text-(--nv-text)">
              {profile.name || "A tua marca"}
            </span>
            <span className="block text-[11px] font-semibold tracking-[0.08em] text-(--nv-text-3) uppercase">Gratuito</span>
          </span>
        </button>

        <div className="my-1.5 h-px bg-(--nv-line)" />

        <button type="button" className={itemCls} onClick={onClose}>
          <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={18} strokeWidth={1.8} />
          Mudar empresa
        </button>
        <Link href="/painel/definicoes" className={itemCls} onClick={onClose}>
          <HugeiconsIcon icon={Settings01Icon} size={18} strokeWidth={1.8} />
          Definições
        </Link>

        {/* Aparência */}
        <div className="px-3 pt-2.5 pb-2">
          <p className="flex items-center gap-3 text-[14px] font-medium text-(--nv-text)">
            <HugeiconsIcon icon={PaintBoardIcon} size={18} strokeWidth={1.8} />
            Aparência
          </p>
          <div role="radiogroup" aria-label="Aparência" className="mt-2 grid grid-cols-3 gap-0.5 rounded-full bg-(--nv-fill) p-[3px]">
            {THEMES.map((t) => {
              const sel = theme === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="radio"
                  aria-checked={sel}
                  onClick={() => setThemePref(t.key)}
                  className={`flex h-7 cursor-pointer items-center justify-center gap-1 rounded-full text-[11.5px] font-semibold transition-all ${
                    sel ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                  }`}
                >
                  <HugeiconsIcon icon={t.icon} size={13} strokeWidth={2} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="my-1.5 h-px bg-(--nv-line)" />

        <form method="post" action="/api/auth/logout">
          <button type="submit" className={`${itemBase} w-full cursor-pointer text-[#FF3B30]`}>
            <HugeiconsIcon icon={Logout01Icon} size={18} strokeWidth={1.8} />
            Terminar sessão
          </button>
        </form>
      </div>
    </>
  );
}
