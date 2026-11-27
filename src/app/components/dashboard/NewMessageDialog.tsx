"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { useDialog } from "./useDialog";
import { parseRecipient, startConversation } from "./messages";
import { CreatorAvatar } from "./MessagesView";

interface NewMessageDialogProps {
  open: boolean;
  onClose: () => void;
  /** Recebe o id da conversa criada (ou reutilizada). */
  onSent: (id: string) => void;
}

export default function NewMessageDialog(props: NewMessageDialogProps) {
  if (!props.open) return null;
  // Montado só quando aberto: os campos começam sempre limpos.
  return <DialogBody {...props} />;
}

function DialogBody({ onClose, onSent }: Omit<NewMessageDialogProps, "open">) {
  const [to, setTo] = useState("");
  const [body, setBody] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  useDialog(true, onClose, panelRef, toRef);

  const recipient = to.trim().replace(/^@+/, "") ? parseRecipient(to) : null;
  const canSend = !!recipient && recipient.handle.length > 1 && body.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    const id = startConversation(to, body);
    onSent(id);
  };

  const field =
    "lg-control sq flex w-full rounded-[16px] px-3.5 text-[14.5px] text-(--nv-text)";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-(--nv-scrim) backdrop-blur-[3px] sm:items-start sm:px-4 sm:pt-[12vh]"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-msg-title"
        className="nuvi-step sq flex w-full max-w-[520px] flex-col rounded-t-[28px] bg-(--nv-glass-strong) p-5 shadow-[inset_0_1px_0_var(--nv-glass-edge),0_0_0_0.5px_var(--nv-line),0_30px_80px_-20px_var(--nv-shadow)] backdrop-blur-2xl sm:rounded-[28px] sm:p-6"
      >
        <header className="flex items-center justify-between gap-3">
          <h2 id="new-msg-title" className="text-[22px] font-bold tracking-[-0.025em] text-(--nv-text)">
            Nova mensagem
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="lg-control flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--nv-text)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-5 flex flex-col gap-4"
        >
          <div>
            <label htmlFor="new-msg-to" className="mb-1.5 block text-[12.5px] font-semibold text-(--nv-text-2)">
              Para
            </label>
            <div className={`${field} h-11 items-center gap-2.5`}>
              {recipient ? (
                <CreatorAvatar name={recipient.name} size={24} />
              ) : (
                <span className="text-[15px] font-semibold text-(--nv-text-3)">@</span>
              )}
              <input
                id="new-msg-to"
                ref={toRef}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Nome ou @ do criador"
                autoComplete="off"
                className="w-full min-w-0 bg-transparent outline-none placeholder:text-(--nv-text-3)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="new-msg-body" className="mb-1.5 block text-[12.5px] font-semibold text-(--nv-text-2)">
              Mensagem
            </label>
            <textarea
              id="new-msg-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={4}
              placeholder="Olá! Gostávamos de trabalhar contigo numa campanha…"
              className={`${field} nuvi-scroll resize-none py-3 leading-[1.45] outline-none placeholder:text-(--nv-text-3)`}
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="hidden text-[12px] text-(--nv-text-3) sm:block">
              <kbd className="rounded-[6px] bg-(--nv-fill) px-1.5 font-sans">⌘↵</kbd> para enviar
            </p>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="lg-control sq h-11 cursor-pointer rounded-full px-4 text-[14px] font-semibold text-(--nv-text)"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!canSend}
                className="nuvi-create-btn gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HugeiconsIcon icon={SentIcon} size={16} strokeWidth={2.1} />
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
