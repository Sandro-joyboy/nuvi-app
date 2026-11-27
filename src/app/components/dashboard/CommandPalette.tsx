"use client";

import { useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  BubbleChatIcon,
  ChartColumnIcon,
  DiscoverCircleIcon,
  DollarCircleIcon,
  Globe02Icon,
  Logout01Icon,
  Megaphone01Icon,
  PencilEdit02Icon,
  Search01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { useDialog } from "./useDialog";

export type CommandId =
  | "nav:descobrir"
  | "nav:campanhas"
  | "nav:mensagens"
  | "nav:anuncios"
  | "nav:analises"
  | "nav:pagamentos"
  | "create-campaign"
  | "new-message"
  | "add-funds"
  | "logout";

interface Command {
  id: CommandId;
  label: string;
  /** Caminho mostrado por baixo, ex.: ["Campanhas", "Criar campanha"]. */
  path?: string[];
  icon: typeof Search01Icon;
  group: "Sugestões" | "Ações";
  keywords?: string;
}

const COMMANDS: Command[] = [
  { id: "nav:descobrir", label: "Descobrir", icon: DiscoverCircleIcon, group: "Sugestões", keywords: "criadores explorar" },
  { id: "nav:mensagens", label: "Mensagens", icon: BubbleChatIcon, group: "Sugestões", keywords: "chat conversas" },
  { id: "nav:campanhas", label: "Campanhas", icon: Globe02Icon, group: "Sugestões" },
  { id: "create-campaign", label: "Criar campanha", path: ["Campanhas", "Criar campanha"], icon: Add01Icon, group: "Sugestões", keywords: "nova" },
  { id: "nav:pagamentos", label: "Pagamentos", icon: DollarCircleIcon, group: "Sugestões", keywords: "payouts dinheiro" },
  { id: "logout", label: "Terminar sessão", path: ["Conta", "Terminar sessão"], icon: Logout01Icon, group: "Sugestões", keywords: "sair logout" },
  { id: "new-message", label: "Nova mensagem", path: ["Mensagens", "Nova mensagem"], icon: PencilEdit02Icon, group: "Ações", keywords: "escrever" },
  { id: "add-funds", label: "Carregar carteira", path: ["Carteira", "Carregar"], icon: Wallet01Icon, group: "Ações", keywords: "saldo kwanzas multicaixa" },
  { id: "nav:anuncios", label: "Anúncios", icon: Megaphone01Icon, group: "Ações", keywords: "ads meta tiktok" },
  { id: "nav:analises", label: "Análises", icon: ChartColumnIcon, group: "Ações", keywords: "métricas analytics" },
];

/** Pesquisa sem acentos nem maiúsculas ("analises" encontra "Análises"). */
const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onRun: (id: CommandId) => void;
}

export default function CommandPalette({ open, onClose, onRun }: CommandPaletteProps) {
  if (!open) return null;
  // Montado só quando aberto: a pesquisa e a seleção começam sempre limpas.
  return <PaletteBody onClose={onClose} onRun={onRun} />;
}

function PaletteBody({ onClose, onRun }: Omit<CommandPaletteProps, "open">) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, panelRef, inputRef);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) =>
      norm([c.label, ...(c.path ?? []), c.keywords ?? ""].join(" ")).includes(q)
    );
  }, [query]);

  const run = (c: Command) => {
    onClose();
    onRun(c.id);
  };

  const move = (delta: number) => {
    if (results.length === 0) return;
    const next = (active + delta + results.length) % results.length;
    setActive(next);
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${next}"]`)
      ?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    }
  };

  let index = -1;
  const groups = (["Sugestões", "Ações"] as const)
    .map((g) => ({ g, items: results.filter((c) => c.group === g) }))
    .filter((x) => x.items.length > 0);
  const activeId = results[active] ? `cmd-${results[active].id}` : undefined;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-(--nv-scrim) px-4 pt-[12vh] backdrop-blur-[3px]"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Pesquisar"
        className="sq flex max-h-[70vh] w-full max-w-[620px] flex-col overflow-hidden rounded-[28px] bg-(--nv-glass-strong) shadow-[inset_0_1px_0_var(--nv-glass-edge),0_0_0_0.5px_var(--nv-line),0_30px_80px_-20px_var(--nv-shadow)] backdrop-blur-2xl"
        onKeyDown={onKeyDown}
      >
        {/* Campo de pesquisa */}
        <div className="p-2">
          <label className="lg-control sq flex h-10 items-center gap-2.5 rounded-[16px] px-3.5">
            <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
            <span className="sr-only">Pesquisar na Nuvi</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="Pesquisar na Nuvi"
              role="combobox"
              aria-expanded="true"
              aria-controls="cmd-list"
              aria-activedescendant={activeId}
              className="w-full bg-transparent text-[14px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3)"
            />
          </label>
        </div>

        {/* Resultados */}
        <div ref={listRef} id="cmd-list" role="listbox" className="nuvi-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {groups.length === 0 && (
            <p className="px-3 py-8 text-center text-[13.5px] text-(--nv-text-3)">
              Sem resultados para “{query}”
            </p>
          )}
          {groups.map(({ g, items }) => (
            <div key={g} role="group" aria-label={g} className="pt-1">
              <p className="px-3 pt-2 pb-1.5 text-[12px] font-medium text-(--nv-text-3)">{g}</p>
              {items.map((c) => {
                index += 1;
                const i = index;
                const selected = i === active;
                return (
                  <div
                    key={c.id}
                    id={`cmd-${c.id}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    onPointerMove={() => setActive(i)}
                    onClick={() => run(c)}
                    className={`sq flex cursor-pointer items-start gap-3 rounded-[14px] px-3 py-2.5 transition-colors ${
                      selected ? "bg-(--nv-fill)" : ""
                    } ${c.id === "logout" ? "text-[#FF3B30]" : "text-(--nv-text)"}`}
                  >
                    <HugeiconsIcon icon={c.icon} size={18} strokeWidth={1.8} className="mt-px shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium leading-5">{c.label}</span>
                      {c.path && (
                        <span className="mt-0.5 flex items-center gap-1 text-[12px] text-(--nv-text-3)">
                          {c.path.map((p, n) => (
                            <span key={p} className="flex items-center gap-1">
                              {n > 0 && <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2} />}
                              {p}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                    {selected && (
                      <kbd className="mt-0.5 rounded-[6px] bg-(--nv-fill) px-1.5 text-[11px] font-medium text-(--nv-text-3)">↵</kbd>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Ajudas de teclado */}
        <div className="flex items-center gap-4 border-t border-(--nv-line) px-4 py-2.5 text-[12px] text-(--nv-text-3)">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded-[6px] bg-(--nv-fill) px-1.5 font-sans">↑↓</kbd> Selecionar
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded-[6px] bg-(--nv-fill) px-1.5 font-sans">↵</kbd> Abrir
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <kbd className="rounded-[6px] bg-(--nv-fill) px-1.5 font-sans">esc</kbd> Fechar
          </span>
        </div>
      </div>
    </div>
  );
}
