"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  onAddFunds: (amount: number) => void;
}

const PRESETS = [25000, 50000, 100000, 250000];

type PaymentMethod = "mcx" | "referencia";

export default function WalletModal({
  open,
  onClose,
  onAddFunds,
}: WalletModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [method, setMethod] = useState<PaymentMethod>("mcx");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const formatKz = (val: number) =>
    `${val.toLocaleString("pt-PT")} Kz`;

  const handleConfirm = () => {
    onAddFunds(selectedAmount);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 850);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1628]/30 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="nuvi-modal-card sq !max-w-[440px] !items-stretch !rounded-[32px] !p-7 !text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="sq flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#EFF7FF] text-[#0082F6]">
              <HugeiconsIcon icon={Wallet02Icon} size={22} strokeWidth={1.8} />
            </span>
            <div>
              <h3
                id="wallet-modal-title"
                className="text-[20px] font-bold tracking-[-0.022em] text-[#0A0A0A]"
              >
                Carregar carteira
              </h3>
              <p className="text-[13px] text-[#71717A]">Saldo em Kwanzas</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#71717A] transition-colors hover:bg-[#F4F4F5] hover:text-[#0A0A0A]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Valor em Kwanzas */}
        <div className="mt-6">
          <p className="text-[12.5px] font-medium text-[#52525B]">
            Valor
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            {PRESETS.map((value) => {
              const active = selectedAmount === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedAmount(value)}
                  className={`sq cursor-pointer rounded-[18px] border px-4 py-3 text-left transition-all ${
                    active
                      ? "border-[#4EA7EB] bg-[#EFF7FF] text-[#006FD6]"
                      : "border-[#E4E4E7] bg-white text-[#0A0A0A] hover:border-[#4EA7EB]/50 hover:bg-[#F8FBFF]"
                  }`}
                >
                  <span className="font-title text-[15.5px] font-bold tabular-nums">
                    {formatKz(value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Método de pagamento local */}
        <div className="mt-5">
          <p className="text-[12.5px] font-medium text-[#52525B]">
            Pagamento
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethod("mcx")}
              className={`sq cursor-pointer rounded-[14px] border px-3 py-2.5 text-[13px] font-medium transition-all ${
                method === "mcx"
                  ? "border-[#4EA7EB] bg-[#EFF7FF] text-[#006FD6]"
                  : "border-[#E4E4E7] bg-white text-[#52525B] hover:border-[#D4D4D8]"
              }`}
            >
              Multicaixa Express
            </button>
            <button
              type="button"
              onClick={() => setMethod("referencia")}
              className={`sq cursor-pointer rounded-[14px] border px-3 py-2.5 text-[13px] font-medium transition-all ${
                method === "referencia"
                  ? "border-[#4EA7EB] bg-[#EFF7FF] text-[#006FD6]"
                  : "border-[#E4E4E7] bg-white text-[#52525B] hover:border-[#D4D4D8]"
              }`}
            >
              Referência Bancária
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 cursor-pointer rounded-full border border-[#E4E4E7] bg-white px-5 text-[14px] font-medium text-[#52525B] transition-colors hover:bg-[#F4F4F5]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitted}
            className="nuvi-btn-sm !h-11 !px-6"
          >
            {submitted ? (
              <>
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={17}
                  strokeWidth={2}
                />
                Saldo carregado
              </>
            ) : (
              `Carregar ${formatKz(selectedAmount)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
