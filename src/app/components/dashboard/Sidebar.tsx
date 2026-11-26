"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  ChartColumnIcon,
  DiscoverCircleIcon,
  DollarCircleIcon,
  Globe02Icon,
  Megaphone01Icon,
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
}

export const NAV_ITEMS: NavItem[] = [
  { key: "descobrir", label: "Descobrir", icon: DiscoverCircleIcon },
  { key: "campanhas", label: "Campanhas", icon: Globe02Icon },
  { key: "mensagens", label: "Mensagens", icon: BubbleChatIcon },
  { key: "anuncios", label: "Anúncios", icon: Megaphone01Icon, badge: "Novo" },
  { key: "analises", label: "Análises", icon: ChartColumnIcon },
  { key: "pagamentos", label: "Pagamentos", icon: DollarCircleIcon },
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

/** Tab bar flutuante em vidro (mobile / tablet). */
export function MobileTabBar({ active, onChange }: SidebarProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="lg-surface fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full px-2 py-1.5 lg:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex h-11 flex-1 items-center justify-center rounded-full transition-colors ${
              isActive ? "bg-[#0082F6]/10 text-[#0076E8]" : "text-[#5B6474]"
            }`}
          >
            <HugeiconsIcon
              icon={item.icon}
              size={21}
              strokeWidth={isActive ? 1.9 : 1.6}
            />
            {item.badge && (
              <span className="absolute top-2 right-[calc(50%-14px)] h-2 w-2 rounded-full bg-[#0082F6] ring-2 ring-white" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
