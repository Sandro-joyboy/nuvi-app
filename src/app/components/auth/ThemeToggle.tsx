"use client";

import { useSyncExternalStore } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { setThemePref } from "@/app/components/dashboard/prefs";

/* Tema efetivo no <html> (inclui "Sistema" já resolvido). */
function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
const read = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

const OPTIONS = [
  { key: "light", label: "Claro", icon: Sun03Icon },
  { key: "dark", label: "Escuro", icon: Moon02Icon },
] as const;

/** Alternar claro/escuro (a mesma preferência do menu da conta no painel). */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => null);

  return (
    <div role="radiogroup" aria-label="Aparência" className="lg-control flex gap-0.5 rounded-full p-[3px]">
      {OPTIONS.map((o) => {
        const sel = theme === o.key;
        return (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={sel}
            aria-label={o.label}
            title={o.label}
            onClick={() => setThemePref(o.key)}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
              sel ? "bg-[#4EA7EB] text-white" : "text-(--nv-text-3) hover:text-(--nv-text)"
            }`}
          >
            <HugeiconsIcon icon={o.icon} size={16} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
