"use client";

// Estado partilhado entre as páginas do painel (/painel/*). Vive no layout,
// por isso sobrevive à navegação entre secções.
import { createContext, useContext } from "react";

export interface DashboardContextValue {
  /** Saldo da carteira (local até existir API). */
  balance: number;
  openWallet: () => void;
  /** Abre o diálogo "Nova mensagem". */
  openCompose: () => void;
  /** Conversa aberta em /painel/mensagens. */
  openConvo: string | null;
  setOpenConvo: (id: string | null) => void;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard tem de ser usado dentro do DashboardShell");
  return ctx;
}
