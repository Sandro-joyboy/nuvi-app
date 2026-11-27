"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  BubbleChatIcon,
  Delete02Icon,
  PencilEdit02Icon,
  Search01Icon,
  SentIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import { useDashboard } from "./dashboard-context";
import {
  deleteConversation,
  fmtClock,
  fmtDay,
  fmtListTime,
  isSameDay,
  markRead,
  sendMessage,
  useConversations,
  type Conversation,
} from "./messages";

/** Pesquisa sem acentos nem maiúsculas. */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Filter = "all" | "unread";

/* ---------- Avatar de criador: inicial sobre um gradiente estável ---------- */
const GRADIENTS: [string, string][] = [
  ["#5DB6F5", "#0076E8"],
  ["#B79CFB", "#7C3AED"],
  ["#FFC08A", "#F2701D"],
  ["#7BE0B4", "#10A36B"],
  ["#FBA5CF", "#DB2777"],
];

export function CreatorAvatar({ name, size = 44 }: { name: string; size?: number }) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [a, b] = GRADIENTS[h % GRADIENTS.length];
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)]"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        background: `linear-gradient(180deg, ${a}, ${b})`,
      }}
    >
      {(name.trim()[0] ?? "?").toUpperCase()}
    </span>
  );
}

/* ---------- Ícone de vidro (família dos do onboarding) ---------- */
function GlassIcon({ size = 80 }: { size?: number }) {
  return (
    <Image
      src="/icons/chat.svg"
      alt=""
      width={size}
      height={Math.round((size * 90) / 105)}
      className="select-none"
      draggable={false}
    />
  );
}

/** Página /painel/mensagens. */
export default function MessagesView() {
  const {
    openCompose: onCompose,
    openConvo: openId,
    setOpenConvo: onOpenIdChange,
  } = useDashboard();
  const conversations = useConversations();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const selected = conversations.find((c) => c.id === openId) ?? null;
  const unreadTotal = conversations.filter((c) => c.unread > 0).length;

  const shown = useMemo(() => {
    const q = norm(query.trim());
    return conversations.filter(
      (c) =>
        (filter === "all" || c.unread > 0) &&
        (!q ||
          norm(`${c.name} ${c.handle} ${c.messages.at(-1)?.body ?? ""}`).includes(q))
    );
  }, [conversations, query, filter]);

  useEffect(() => {
    if (selected?.unread) markRead(selected.id);
  }, [selected?.id, selected?.unread]);

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-1 gap-5 lg:min-h-0">
      {/* ---------------- Lista de conversas ---------------- */}
      <section
        aria-label="Conversas"
        className={`lg-surface sq min-h-[520px] w-full flex-col overflow-hidden rounded-[28px] lg:flex lg:min-h-0 lg:w-[360px] lg:shrink-0 ${
          selected ? "hidden" : "flex"
        }`}
      >
        <div className="flex items-center gap-2 p-3">
          <label className="lg-control sq flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-full px-3.5">
            <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
            <span className="sr-only">Pesquisar conversas</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar"
              type="search"
              className="w-full min-w-0 bg-transparent text-[14px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3) [&::-webkit-search-cancel-button]:hidden"
            />
          </label>
          <button
            type="button"
            onClick={onCompose}
            aria-label="Nova mensagem"
            title="Nova mensagem"
            className="nuvi-btn-sm sq !h-10 !w-10 shrink-0 !p-0"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Filtro */}
        <div
          role="radiogroup"
          aria-label="Filtrar conversas"
          className="mx-3 inline-flex w-fit rounded-full bg-(--nv-fill) p-[3px]"
        >
          {(
            [
              ["all", "Todas", conversations.length],
              ["unread", "Não lidas", unreadTotal],
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

        <div className="nuvi-scroll mt-3 min-h-0 flex-1 overflow-y-auto border-t border-(--nv-line) px-2 py-2">
          {conversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
              <SquircleTile size={48} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                <HugeiconsIcon icon={BubbleChatIcon} size={22} strokeWidth={1.8} className="text-[#4EA7EB]" />
              </SquircleTile>
              <p className="mt-3 text-[14px] font-semibold text-(--nv-text)">Sem conversas ainda</p>
              <p className="mt-1 max-w-[240px] text-[12.5px] leading-snug text-(--nv-text-3)">
                As conversas com criadores e campanhas aparecem aqui.
              </p>
              <button
                type="button"
                onClick={onCompose}
                className="lg-control sq mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
              >
                <HugeiconsIcon icon={PencilEdit02Icon} size={15} strokeWidth={2} />
                Nova mensagem
              </button>
            </div>
          ) : shown.length === 0 ? (
            <p className="px-4 py-12 text-center text-[13.5px] text-(--nv-text-3)">
              {query.trim() ? `Sem resultados para “${query.trim()}”` : "Tudo lido"}
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {shown.map((c) => (
                <li key={c.id}>
                  <ConversationRow
                    convo={c}
                    active={c.id === openId}
                    onOpen={() => onOpenIdChange(c.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------------- Conversa aberta ---------------- */}
      <section
        aria-label={selected ? `Conversa com ${selected.name}` : "Conversa"}
        className={`lg-surface sq relative h-[calc(100dvh-200px)] min-h-[420px] min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] lg:flex lg:h-auto lg:min-h-0 ${
          selected ? "flex" : "hidden"
        }`}
      >
        {selected ? (
          <Thread
            key={selected.id}
            convo={selected}
            onBack={() => onOpenIdChange(null)}
            onDelete={() => {
              deleteConversation(selected.id);
              onOpenIdChange(null);
            }}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <GlassIcon size={84} />
            <h2 className="mt-5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
              Nenhuma conversa aberta
            </h2>
            <p className="mt-1.5 max-w-[300px] text-[13.5px] leading-snug text-(--nv-text-3)">
              Escolhe um criador à esquerda ou começa uma nova mensagem.
            </p>
            <button type="button" onClick={onCompose} className="nuvi-btn-sm sq mt-5 !h-11 !px-6">
              <HugeiconsIcon icon={PencilEdit02Icon} size={17} strokeWidth={2} />
              Nova mensagem
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Linha da lista ---------- */
function ConversationRow({
  convo,
  active,
  onOpen,
}: {
  convo: Conversation;
  active: boolean;
  onOpen: () => void;
}) {
  const last = convo.messages.at(-1);
  const unread = convo.unread > 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={active ? "true" : undefined}
      className={`sq flex w-full cursor-pointer items-center gap-3 rounded-[20px] px-3 py-2.5 text-left transition-colors ${
        active ? "bg-(--nv-accent-soft)" : "hover:bg-(--nv-fill)"
      }`}
    >
      <CreatorAvatar name={convo.name} size={44} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="truncate text-[14px] font-semibold text-(--nv-text)">{convo.name}</span>
          {last && (
            <span
              className={`ml-auto shrink-0 text-[12px] tabular-nums ${
                unread ? "font-semibold text-[#0076E8]" : "text-(--nv-text-3)"
              }`}
            >
              {fmtListTime(last.at)}
            </span>
          )}
        </span>
        <span className="mt-0.5 flex items-center gap-2">
          <span
            className={`line-clamp-1 flex-1 text-[13px] ${
              unread ? "font-medium text-(--nv-text)" : "text-(--nv-text-3)"
            }`}
          >
            {last ? `${last.mine ? "Tu: " : ""}${last.body}` : convo.handle}
          </span>
          {unread && (
            <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#0076E8] px-1 text-[10.5px] font-semibold text-white tabular-nums">
              {convo.unread > 9 ? "9+" : convo.unread}
              <span className="sr-only"> por ler</span>
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

/* ---------- Conversa ---------- */
function Thread({
  convo,
  onBack,
  onDelete,
}: {
  convo: Conversation;
  onBack: () => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const count = convo.messages.length;

  // Desce até à última mensagem ao abrir e a cada mensagem nova.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

  // Caixa de texto cresce com o conteúdo (até ~6 linhas).
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [draft]);

  const send = () => {
    if (!draft.trim()) return;
    sendMessage(convo.id, draft);
    setDraft("");
    inputRef.current?.focus();
  };

  const lastMine = [...convo.messages].reverse().find((m) => m.mine)?.id;

  return (
    <>
      {/* Cabeçalho */}
      <header className="flex items-center gap-3 border-b border-(--nv-line) px-3 py-3 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar às conversas"
          className="lg-control flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text) lg:hidden"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2} />
        </button>
        <CreatorAvatar name={convo.name} size={40} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[15px] font-bold tracking-[-0.015em] text-(--nv-text)">
            {convo.name}
          </h2>
          <p className="truncate text-[12.5px] text-(--nv-text-3)">{convo.handle}</p>
        </div>
        {confirmDelete ? (
          <div className="nuvi-pop flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="lg-control sq h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold text-(--nv-text)"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="sq h-9 cursor-pointer rounded-full bg-[#FF3B30] px-3.5 text-[13px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-transform active:scale-95"
            >
              Apagar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Apagar conversa"
            title="Apagar conversa"
            className="lg-control flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text-2)"
          >
            <HugeiconsIcon icon={Delete02Icon} size={17} strokeWidth={1.8} />
          </button>
        )}
      </header>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={`Mensagens com ${convo.name}`}
        className="nuvi-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
      >
        <div className="mx-auto flex max-w-[760px] flex-col">
          <div className="mb-6 flex flex-col items-center text-center">
            <CreatorAvatar name={convo.name} size={64} />
            <p className="mt-3 text-[16px] font-bold tracking-[-0.02em] text-(--nv-text)">{convo.name}</p>
            <p className="text-[12.5px] text-(--nv-text-3)">{convo.handle} · Criador</p>
          </div>

          {convo.messages.map((m, i) => {
            const prev = convo.messages[i - 1];
            const next = convo.messages[i + 1];
            const newDay = !prev || !isSameDay(prev.at, m.at);
            const grouped = !!prev && !newDay && prev.mine === m.mine && m.at - prev.at < 5 * 60_000;
            const tail = !next || next.mine !== m.mine || !isSameDay(next.at, m.at) || next.at - m.at >= 5 * 60_000;
            return (
              <Fragment key={m.id}>
                {newDay && (
                  <p className="my-4 self-center rounded-full bg-(--nv-fill) px-3 py-1 text-[11.5px] font-semibold text-(--nv-text-3) first-letter:uppercase">
                    {fmtDay(m.at)}
                  </p>
                )}
                <div
                  className={`flex flex-col ${m.mine ? "items-end" : "items-start"} ${
                    grouped ? "mt-1" : "mt-3"
                  }`}
                >
                  <p
                    title={fmtClock(m.at)}
                    className={`sq max-w-[min(78%,520px)] rounded-[20px] px-3.5 py-2 text-[14.5px] leading-[1.4] break-words whitespace-pre-wrap ${
                      m.mine
                        ? `bg-gradient-to-b from-[#4EA7EB] to-[#0076E8] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_14px_-8px_rgba(0,118,232,0.55)] ${
                            tail ? "rounded-br-[6px]" : ""
                          }`
                        : `bg-(--nv-solid) text-(--nv-text) shadow-[0_0_0_0.5px_var(--nv-line),0_2px_6px_-3px_var(--nv-shadow)] ${
                            tail ? "rounded-bl-[6px]" : ""
                          }`
                    }`}
                  >
                    {m.body}
                  </p>
                  {tail && (
                    <span className="mt-1 flex items-center gap-1 px-1 text-[11px] text-(--nv-text-3) tabular-nums">
                      {fmtClock(m.at)}
                      {m.id === lastMine && (
                        <>
                          <span aria-hidden>·</span>
                          <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2.4} className="text-[#4EA7EB]" />
                          Enviada
                        </>
                      )}
                    </span>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Escrever */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="border-t border-(--nv-line) p-3 sm:px-5"
      >
        <div className="mx-auto flex max-w-[760px] items-end gap-2">
          <label className="lg-control sq flex min-h-11 flex-1 items-center rounded-[22px] px-4 py-2.5">
            <span className="sr-only">Mensagem para {convo.name}</span>
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={`Mensagem para ${convo.name}`}
              className="nuvi-scroll block max-h-[140px] w-full resize-none bg-transparent text-[14.5px] leading-[1.4] text-(--nv-text) outline-none placeholder:text-(--nv-text-3)"
            />
          </label>
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Enviar"
            className="nuvi-btn-sm sq !h-11 !w-11 shrink-0 !p-0"
          >
            <HugeiconsIcon icon={SentIcon} size={18} strokeWidth={2} />
          </button>
        </div>
      </form>
    </>
  );
}
