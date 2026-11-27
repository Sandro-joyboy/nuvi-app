"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { useDialog } from "./useDialog";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  /** Etiqueta curta (categoria). */
  tag: string;
  read: boolean;
}

interface NotificationsSheetProps {
  open: boolean;
  items: NotificationItem[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

type Filter = "all" | "unread";

export default function NotificationsSheet(props: NotificationsSheetProps) {
  if (!props.open) return null;
  return <SheetBody {...props} />;
}

function SheetBody({ items, onClose, onMarkRead, onMarkAllRead }: NotificationsSheetProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, panelRef);

  const unread = items.filter((n) => !n.read).length;
  const shown = filter === "unread" ? items.filter((n) => !n.read) : items;

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-(--nv-scrim) backdrop-blur-[2px] lg:p-2"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-title"
        className="nuvi-sheet sq flex h-full w-full max-w-[420px] flex-col bg-(--nv-panel) shadow-[0_0_0_0.5px_var(--nv-line),-20px_0_60px_-20px_var(--nv-shadow)] lg:rounded-[28px]"
      >
        <header className="flex items-center justify-between gap-3 px-5 pt-5">
          <h2 id="notif-title" className="text-[22px] font-bold tracking-[-0.025em] text-(--nv-text)">
            Notificações
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={unread === 0}
              className="lg-control sq h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold text-(--nv-text)"
            >
              Marcar tudo como lido
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar notificações"
              className="lg-control flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--nv-text)"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* Filtro */}
        <div role="radiogroup" aria-label="Filtrar notificações" className="mx-5 mt-4 inline-flex w-fit rounded-full bg-(--nv-fill) p-[3px]">
          {(
            [
              ["all", "Todas", items.length],
              ["unread", "Não lidas", unread],
            ] as const
          ).map(([key, label, count]) => {
            const sel = filter === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={sel}
                onClick={() => setFilter(key)}
                className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-all ${
                  sel ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
                }`}
              >
                {label}
                <span className="text-[12px] font-medium text-(--nv-text-3) tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="nuvi-scroll mt-4 min-h-0 flex-1 overflow-y-auto border-t border-(--nv-line) px-3 pb-4">
          {shown.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--nv-success-soft) text-[#34C759]">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} strokeWidth={2} />
              </span>
              <p className="mt-3 text-[14px] font-semibold text-(--nv-text)">Tudo lido</p>
            </div>
          ) : (
            <>
              <p className="px-2 pt-4 pb-2 text-[12.5px] font-semibold text-(--nv-text-3)">Da Nuvi</p>
              <ul className="flex flex-col gap-2">
                {shown.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => onMarkRead(n.id)}
                      className="lg-surface sq flex w-full cursor-pointer items-start gap-3 rounded-[20px] p-4 text-left transition-transform active:scale-[0.99]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-(--nv-accent-soft) text-[#4EA7EB]">
                        <HugeiconsIcon icon={InformationCircleIcon} size={19} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold text-(--nv-text)">{n.title}</span>
                        <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-(--nv-text-2)">{n.body}</span>
                        <span className="mt-2 block text-[12px] text-(--nv-text-3)">{n.tag}</span>
                      </span>
                      <span className="flex items-center gap-2 self-center">
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-[#4EA7EB]">
                            <span className="sr-only">Não lida</span>
                          </span>
                        )}
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} className="text-(--nv-text-3)" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
