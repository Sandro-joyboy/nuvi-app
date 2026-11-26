"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowUpRight01Icon,
  InboxCheckIcon,
  Notification02Icon,
  Search01Icon,
  Tick02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import AiOrb from "./AiOrb";
import PerformanceCard from "./PerformanceCard";
import WalletModal from "./WalletModal";
import { MobileTabBar, Sidebar, type NavKey } from "./Sidebar";
import { Card, EmptyState, SectionHeader, ViewAllButton } from "./ui";

const QUICK_ACTIONS = [
  { label: "Criar campanha", hint: "Campanhas", href: "/onboarding" },
  { label: "Descobrir criadores", hint: "Descobrir", href: "#descobrir" },
  { label: "Carregar carteira", hint: "Carteira", href: "#carteira" },
];

const fmtKz = (n: number) => `${n.toLocaleString("pt-PT")} Kz`;

/* ---------- Botões de ícone do header ---------- */
function IconButton({
  label,
  children,
  onClick,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      aria-pressed={active}
      className={`lg-control relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full ${
        active ? "text-[#0076E8]" : "text-[#4B5563]"
      }`}
    >
      {children}
    </button>
  );
}

const ghostCta =
  "lg-control sq inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-[#0A0A0A]";

export default function NuviDashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("inicio");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  // TODO: ligar à API de notificações (valor provisório para o visual).
  const [notifications, setNotifications] = useState(6);
  const searchRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Header sem divisão: só ganha vidro quando o conteúdo passa por baixo.
  useEffect(() => {
    const scroller = topRef.current?.parentElement;
    if (!scroller) return;
    const onScroll = () => setScrolled(scroller.scrollTop > 4 || window.scrollY > 4);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = QUICK_ACTIONS.filter((a) =>
    a.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="nuvi-dash flex min-h-dvh w-full bg-[#EEF1F5] lg:h-dvh lg:min-h-0 lg:overflow-hidden font-sans text-[#0A0A0A]">
      <Sidebar active={activeNav} onChange={setActiveNav} />

      {/* Painel principal — cartão flutuante como no macOS */}
      <div className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2">
        <div className="sq relative flex min-h-dvh flex-1 flex-col overflow-clip bg-[#F7F8FA] lg:min-h-0 lg:overflow-hidden lg:rounded-[32px] lg:shadow-[0_0_0_0.5px_rgba(15,23,42,0.08),0_10px_40px_-20px_rgba(15,23,42,0.18)]">
          {/* Luz ambiente para o vidro ter o que refratar */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_15%_0%,rgba(78,167,235,0.16),transparent_70%),radial-gradient(40%_50%_at_90%_10%,rgba(175,82,222,0.08),transparent_70%)]"
          />

          <div className="relative flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
            <div ref={topRef} aria-hidden className="h-px" />
            {/* Header */}
            <header className="sticky top-0 z-30 -mt-px px-4 py-4 sm:px-6 lg:px-8">
              {/* Liquid glass do header: só com conteúdo por baixo */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                  scrolled ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-[#F7F8FA]/65 [-webkit-backdrop-filter:blur(24px)_saturate(180%)] [backdrop-filter:blur(24px)_saturate(180%)]" />
                {/* Transição suave para o conteúdo (sem linha dura) */}
                <div className="absolute inset-x-0 top-full h-5 bg-gradient-to-b from-[#F7F8FA]/65 to-transparent" />
              </div>
              <div className="relative mx-auto flex max-w-[1360px] items-center gap-4">
                <h1 className="text-[28px] font-bold leading-none tracking-[-0.03em]">
                  Início
                </h1>

                {/* Pesquisa */}
                <div className="relative ml-auto hidden w-full max-w-[380px] md:block lg:mx-auto">
                  <label className="lg-control sq flex h-10 items-center gap-2.5 rounded-full px-3.5 focus-within:shadow-[inset_0_1px_0_#fff,0_0_0_1px_#0082F6,0_0_0_4px_rgba(0,130,246,0.14)]">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#8A919E]"
                    />
                    <span className="sr-only">Pesquisar</span>
                    <input
                      ref={searchRef}
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                      onBlur={() => setSearchOpen(false)}
                      placeholder="Pesquisar"
                      className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#8A919E] [&::-webkit-search-cancel-button]:hidden"
                    />
                    <kbd className="rounded-[7px] bg-[#0F172A]/[0.05] px-1.5 py-0.5 font-sans text-[11px] font-medium text-[#6B7280]">
                      ⌘K
                    </kbd>
                  </label>

                  {searchOpen && (
                    <div className="lg-surface sq absolute top-12 right-0 left-0 z-40 rounded-[20px] p-1.5">
                      {results.length > 0 ? (
                        results.map((a) => (
                          <Link
                            key={a.label}
                            href={a.href}
                            onMouseDown={(e) => e.preventDefault()}
                            className="flex items-center justify-between rounded-[14px] px-3 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-[#0082F6]/[0.07] hover:text-[#0076E8]"
                          >
                            {a.label}
                            <span className="text-[12px] text-[#8A919E]">{a.hint}</span>
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-2.5 text-[13px] text-[#6B7280]">Sem resultados</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="ml-auto flex items-center gap-2.5 md:ml-0">
                  <button
                    type="button"
                    onClick={() => setActiveNav("ia")}
                    aria-label="Nuvi IA"
                    title="Nuvi IA"
                    aria-pressed={activeNav === "ia"}
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 hover:scale-[1.06] active:scale-95"
                  >
                    <AiOrb size={40} />
                  </button>
                  <IconButton
                    label={
                      notifications > 0 ? `Notificações, ${notifications} por ler` : "Notificações"
                    }
                    onClick={() => setNotifications(0)}
                  >
                    <HugeiconsIcon icon={Notification02Icon} size={19} strokeWidth={1.8} />
                    {notifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF3B30] px-1 text-[10.5px] font-semibold text-white tabular-nums ring-2 ring-white">
                        {notifications > 9 ? "9+" : notifications}
                      </span>
                    )}
                  </IconButton>
                  <IconButton label="Conta Moco">
                    <span className="text-[14px] font-medium text-[#6B7280]">M</span>
                  </IconButton>
                </div>
              </div>
            </header>

            {/* Conteúdo */}
            <main className="w-full flex-1 px-4 pt-2 pb-28 sm:px-6 lg:px-8 lg:pb-10">
              <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="flex min-w-0 flex-col gap-5">
                  <PerformanceCard />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Card aria-labelledby="top-title" className="flex min-h-[260px] flex-col">
                      <SectionHeader
                        id="top-title"
                        title="Top conteúdos"
                        subtitle="Últimos 30 dias"
                        actions={<ViewAllButton label="Ver todos os conteúdos" />}
                      />
                      <EmptyState
                        icon={
                          <SquircleTile size={48} colors={["#E8F3FF", "#E8F3FF"]} glass={false}>
                            <HugeiconsIcon
                              icon={Video01Icon}
                              size={22}
                              strokeWidth={1.8}
                              className="text-[#0082F6]"
                            />
                          </SquircleTile>
                        }
                        title="Sem vídeos ainda"
                        action={
                          <button
                            type="button"
                            onClick={() => setActiveNav("descobrir")}
                            className={ghostCta}
                          >
                            Descobrir criadores
                          </button>
                        }
                      />
                    </Card>

                    <Card aria-labelledby="sub-title" className="flex min-h-[260px] flex-col">
                      <SectionHeader
                        id="sub-title"
                        title="Novas entregas"
                        subtitle="Por rever"
                        actions={<ViewAllButton label="Ver todas as entregas" />}
                      />
                      <EmptyState
                        icon={
                          <SquircleTile size={48} colors={["#F1F3F6", "#F1F3F6"]} glass={false}>
                            <HugeiconsIcon
                              icon={InboxCheckIcon}
                              size={22}
                              strokeWidth={1.8}
                              className="text-[#5B6474]"
                            />
                          </SquircleTile>
                        }
                        title="Nada por rever"
                        action={
                          <Link href="/onboarding" className={ghostCta}>
                            <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.2} />
                            Criar campanha
                          </Link>
                        }
                      />
                    </Card>
                  </div>
                </div>

                {/* Coluna direita */}
                <div className="flex flex-col gap-5 md:grid md:grid-cols-2 xl:flex">
                  {/* Carteira — vidro azul */}
                  <section
                    id="carteira"
                    aria-labelledby="wallet-title"
                    className="sq relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#4EA7EB] to-[#0076E8] p-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_0_0_0.5px_rgba(255,255,255,0.3),0_18px_40px_-18px_rgba(0,118,232,0.6)] sm:p-6 md:col-span-2 xl:col-span-1"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-white/20 blur-3xl"
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <h2 id="wallet-title" className="text-[17px] font-bold tracking-[-0.022em]">
                          Carteira
                        </h2>
                        <p className="text-[12.5px] font-medium text-white/70">Moco · AOA</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveNav("pagamentos")}
                        aria-label="Abrir pagamentos"
                        className="lg-tint flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
                      >
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2.2} />
                      </button>
                    </div>

                    <p className="font-title relative mt-6 text-[40px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                      {fmtKz(balance)}
                    </p>
                    <p className="relative mt-1.5 text-[12.5px] font-medium text-white/70">
                      Disponível
                    </p>

                    <dl className="relative mt-5 divide-y divide-white/15 border-t border-white/15 text-[13px]">
                      <div className="flex justify-between py-2.5">
                        <dt className="text-white/75">A pagar</dt>
                        <dd className="font-semibold tabular-nums">{fmtKz(0)}</dd>
                      </div>
                      <div className="flex justify-between py-2.5">
                        <dt className="text-white/75">Pendente</dt>
                        <dd className="font-semibold tabular-nums">{fmtKz(0)}</dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      onClick={() => setWalletOpen(true)}
                      className="sq relative mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white text-[14px] font-semibold text-[#0A0A0A] shadow-[inset_0_-1px_0_rgba(15,23,42,0.06),0_6px_16px_-6px_rgba(0,40,100,0.4)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <HugeiconsIcon
                        icon={Add01Icon}
                        size={16}
                        strokeWidth={2.4}
                        className="text-[#0076E8]"
                      />
                      Carregar
                    </button>
                  </section>

                  <Card aria-labelledby="att-title">
                    <SectionHeader id="att-title" title="Atenção" />
                    <EmptyState
                      compact
                      icon={
                        <SquircleTile size={40} colors={["#EAF9EE", "#EAF9EE"]} glass={false}>
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={20}
                            strokeWidth={2.4}
                            className="text-[#34C759]"
                          />
                        </SquircleTile>
                      }
                      title="Tudo em dia"
                    />
                  </Card>

                  <Card aria-labelledby="act-title">
                    <SectionHeader id="act-title" title="Atividade" />
                    <EmptyState
                      compact
                      icon={
                        <SquircleTile size={40} colors={["#F1F3F6", "#F1F3F6"]} glass={false}>
                          <HugeiconsIcon
                            icon={Notification02Icon}
                            size={19}
                            strokeWidth={1.9}
                            className="text-[#8A919E]"
                          />
                        </SquircleTile>
                      }
                      title="Sem atividade"
                    />
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <MobileTabBar active={activeNav} onChange={setActiveNav} />

      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        onAddFunds={(amount) => setBalance((prev) => prev + amount)}
      />
    </div>
  );
}
