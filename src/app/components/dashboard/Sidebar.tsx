"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  ChartColumnIcon,
  DiscoverCircleIcon,
  DollarCircleIcon,
  Globe02Icon,
  Megaphone01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import { NuviMark } from "@/app/components/brand/NuviLogo";

export type NavKey =
  | "inicio"
  | "ia"
  | "descobrir"
  | "campanhas"
  | "mensagens"
  | "anuncios"
  | "analises"
  | "pagamentos";

interface NavItem {
  key: Exclude<NavKey, "inicio" | "ia">;
  label: string;
  icon: typeof DiscoverCircleIcon;
  badge?: string;
  /** Aparece na tab bar mobile; os restantes vão para "Mais". */
  primary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "descobrir", label: "Descobrir", icon: DiscoverCircleIcon, primary: true },
  { key: "campanhas", label: "Campanhas", icon: Globe02Icon, primary: true },
  { key: "mensagens", label: "Mensagens", icon: BubbleChatIcon, primary: true },
  { key: "anuncios", label: "Anúncios", icon: Megaphone01Icon, badge: "Novo" },
  { key: "analises", label: "Análises", icon: ChartColumnIcon },
  { key: "pagamentos", label: "Pagamentos", icon: DollarCircleIcon, primary: true },
];

interface SidebarProps {
  active: NavKey;
  onChange: (key: NavKey) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside
      aria-label="Navegação principal"
      className="hidden h-dvh w-[84px] shrink-0 flex-col items-center justify-between py-4 lg:flex"
    >
      <div className="flex w-full flex-col items-center">
        <button
          type="button"
          onClick={() => onChange("inicio")}
          aria-label="Início"
          aria-current={active === "inicio" ? "page" : undefined}
          className="rounded-[14px] transition-transform duration-300 hover:scale-[1.05] active:scale-95"
        >
          <SquircleTile
            size={44}
            colors={["#5DB6F5", "#0076E8"]}
          >
            <NuviMark className="h-[17px] w-[26px] text-white" />
          </SquircleTile>
        </button>

        <nav className="mt-6 flex w-full flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChange(item.key)}
                aria-current={isActive ? "page" : undefined}
                className="group flex w-[72px] cursor-pointer flex-col items-center gap-1 rounded-[16px] py-1.5"
              >
                <span
                  className={`sq relative flex h-9 w-11 items-center justify-center rounded-[13px] transition-all duration-300 ${
                    isActive
                      ? "lg-control text-[#0076E8]"
                      : "text-[#5B6474] group-hover:bg-[#0F172A]/[0.05] group-hover:text-[#0A0A0A]"
                  }`}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={21}
                    strokeWidth={isActive ? 1.9 : 1.6}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 rounded-full bg-[#0082F6] px-1.5 py-px text-[9px] font-semibold leading-[14px] text-white ring-2 ring-[#EEF1F5]">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10.5px] leading-none tracking-[-0.01em] ${
                    isActive
                      ? "font-semibold text-[#0A0A0A]"
                      : "font-medium text-[#6B7280] group-hover:text-[#0A0A0A]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          aria-label="Conta Moco"
          title="Moco"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#0A0A0A] text-[14px] font-semibold text-white ring-2 ring-white shadow-[0_4px_12px_-4px_rgba(15,23,42,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          M
        </button>
      </div>
    </aside>
  );
}

/** Tab bar flutuante em vidro (mobile): o essencial + "Mais". */
export function MobileTabBar({ active, onChange }: SidebarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const primary = NAV_ITEMS.filter((i) => i.primary);
  const secondary = NAV_ITEMS.filter((i) => !i.primary);
  const moreActive = secondary.some((i) => i.key === active);
  const moreBadge = secondary.some((i) => i.badge);

  useEffect(() => {
    if (!moreOpen) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [moreOpen]);

  const tab = (isActive: boolean) =>
    `relative flex h-12 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors ${
      isActive ? "bg-[#0082F6]/10 text-[#0076E8]" : "text-[#5B6474]"
    }`;

  return (
    <div ref={ref} className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      {moreOpen && (
        <div
          id="mais-menu"
          role="menu"
          className="lg-surface sq absolute right-0 bottom-[68px] w-56 rounded-[22px] p-1.5"
        >
          {secondary.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              onClick={() => {
                onChange(item.key);
                setMoreOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-[16px] px-3 py-2.5 text-[14px] font-medium ${
                active === item.key ? "bg-[#0082F6]/10 text-[#0076E8]" : "text-[#0A0A0A] hover:bg-[#0F172A]/[0.05]"
              }`}
            >
              <HugeiconsIcon icon={item.icon} size={20} strokeWidth={1.7} />
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded-full bg-[#0082F6] px-2 py-0.5 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <nav
        aria-label="Navegação principal"
        className="lg-surface flex items-center gap-1 rounded-full px-1.5 py-1.5"
      >
        {primary.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={tab(isActive)}
            >
              <HugeiconsIcon icon={item.icon} size={21} strokeWidth={isActive ? 1.9 : 1.6} />
              {item.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          aria-controls="mais-menu"
          className={tab(moreActive || moreOpen)}
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={21} strokeWidth={1.9} />
          Mais
          {moreBadge && (
            <span className="absolute top-1.5 right-[calc(50%-14px)] h-2 w-2 rounded-full bg-[#0082F6] ring-2 ring-white" />
          )}
        </button>
      </nav>
    </div>
  );
}
