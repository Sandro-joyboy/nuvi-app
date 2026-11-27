/** Só caminhos internos depois do login (nunca outro site). */
export function safeNextClient(next: string | null, fallback = "/painel"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
