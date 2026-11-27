"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import PerformanceCard from "./PerformanceCard";
import WalletModal from "./WalletModal";
import { MobileTabBar, Sidebar, type NavKey } from "./Sidebar";
import { Avatar, Card, EmptyState, SectionHeader, ViewAllButton } from "./ui";
import CommandPalette, { type CommandId } from "./CommandPalette";
import NotificationsSheet, { type NotificationItem } from "./NotificationsSheet";
import AccountMenu from "./AccountMenu";
import ProfileModal from "./ProfileModal";
import { applyTheme, useProfile, useThemePref } from "./prefs";

// Novidades do produto (conteúdo local até existir API de notificações).
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "carteira-aoa",
    title: "Carteira em Kwanzas",
    body: "Carrega saldo por Multicaixa Express ou referência bancária e paga criadores em AOA.",
    tag: "Novidade · Carteira",
    read: false,
  },
  {
    id: "anuncios",
    title: "Anúncios chegaram à Nuvi",
    body: "Impulsiona os melhores vídeos dos criadores no Instagram, Facebook e TikTok.",
    tag: "Novidade · Anúncios",
    read: false,
  },
  {
    id: "boas-vindas",
    title: "Bem-vindo à Nuvi",
    body: "Cria a tua primeira campanha e começa a receber conteúdos de criadores.",
    tag: "Primeiros passos",
    read: false,
  },
];

const fmtKz = (n: number) => `${n.toLocaleString("pt-PT")} Kz`;

/* ---------- Botões de ícone do header ---------- */
function IconButton({
  label,
  children,
  onClick,
  active,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      aria-pressed={active}
      className={`lg-control relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full ${className} ${
        active ? "text-[#0076E8]" : "text-(--nv-text-2)"
      }`}
    >
      {children}
    </button>
  );
}

const ghostCta =
  "lg-control sq inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)";

export default function NuviDashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("inicio");
  const [balance, setBalance] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.read).length;
  const profile = useProfile();
  const themePref = useThemePref();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Estado de scroll: a tab bar mobile passa a liquid glass ao rolar.
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

  // ⌘K / Ctrl+K abre e fecha a pesquisa
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Tema "Sistema": acompanha a mudança de claro/escuro do sistema operativo
  useEffect(() => {
    applyTheme(themePref);
    if (themePref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [themePref]);

  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  const runCommand = (id: CommandId) => {
    if (id.startsWith("nav:")) return setActiveNav(id.slice(4) as NavKey);
    if (id === "create-campaign") return router.push("/onboarding");
    if (id === "new-message") return setActiveNav("mensagens");
    if (id === "add-funds") return setWalletOpen(true);
    if (id === "logout") return router.push("/");
  };

  return (
    <div className="nuvi-dash flex min-h-dvh w-full bg-(--nv-bg) lg:h-dvh lg:min-h-0 lg:overflow-hidden font-sans text-(--nv-text)">
      <Sidebar
        active={activeNav}
        onChange={setActiveNav}
        avatar={<Avatar profile={profile} size={40} />}
        accountOpen={accountOpen}
        onAccount={() => setAccountOpen((v) => !v)}
      />

      {/* Painel principal — cartão flutuante como no macOS */}
      <div className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2">
        <div className="sq relative flex min-h-dvh flex-1 flex-col overflow-clip bg-(--nv-panel) lg:min-h-0 lg:overflow-hidden lg:rounded-[32px] lg:shadow-[0_0_0_0.5px_rgba(15,23,42,0.08),0_10px_40px_-20px_rgba(15,23,42,0.18)]">
          {/* Luz ambiente para o vidro ter o que refratar */}
          <div
            aria-hidden
            style={{ opacity: "var(--nv-ambient)" }}
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_15%_0%,rgba(78,167,235,0.16),transparent_70%),radial-gradient(40%_50%_at_90%_10%,rgba(175,82,222,0.08),transparent_70%)]"
          />

          <div className="nuvi-scroll relative flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
            <div ref={topRef} aria-hidden className="h-px" />
            {/* Header */}
            <header className="relative z-30 -mt-px px-4 py-4 sm:px-6 lg:px-8">
              <div className="relative mx-auto flex max-w-[1360px] items-center gap-4">
                <h1 className="text-[28px] font-bold leading-none tracking-[-0.03em]">
                  Início
                </h1>

                {/* Pesquisa: abre a paleta de comandos */}
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  aria-haspopup="dialog"
                  aria-keyshortcuts="Meta+K Control+K"
                  className="lg-control sq ml-auto hidden h-10 w-full max-w-[380px] cursor-pointer items-center gap-2.5 rounded-full px-3.5 text-left md:flex lg:mx-auto"
                >
                  <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
                  <span className="flex-1 text-[14px] text-(--nv-text-3)">Pesquisar</span>
                  <kbd className="rounded-[7px] bg-(--nv-fill) px-1.5 py-0.5 font-sans text-[11px] font-medium text-(--nv-text-3)">
                    ⌘K
                  </kbd>
                </button>

                <div className="ml-auto flex items-center gap-2.5 md:ml-0">
                  <Link href="/onboarding" className="nuvi-create-btn">
                    Criar
                  </Link>
                  <IconButton
                    label="Pesquisar"
                    onClick={() => setPaletteOpen(true)}
                    className="md:hidden"
                  >
                    <HugeiconsIcon icon={Search01Icon} size={19} strokeWidth={1.8} />
                  </IconButton>
                  <IconButton
                    label={unread > 0 ? `Notificações, ${unread} por ler` : "Notificações"}
                    onClick={() => setNotifOpen(true)}
                  >
                    <HugeiconsIcon icon={Notification02Icon} size={19} strokeWidth={1.8} />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF3B30] px-1 text-[10.5px] font-semibold text-white tabular-nums ring-2 ring-(--nv-solid)">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </IconButton>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(true)}
                    aria-label="Editar perfil"
                    aria-haspopup="dialog"
                    title="Editar perfil"
                    className="shrink-0 cursor-pointer rounded-full shadow-[0_0_0_0.5px_var(--nv-line-strong),0_2px_6px_-2px_var(--nv-shadow)] transition-transform duration-300 active:scale-95"
                  >
                    <Avatar profile={profile} size={44} />
                  </button>
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
                          <SquircleTile size={48} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
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
                          <SquircleTile size={48} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
                            <HugeiconsIcon
                              icon={InboxCheckIcon}
                              size={22}
                              strokeWidth={1.8}
                              className="text-(--nv-text-2)"
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
                        <SquircleTile size={40} colors={["var(--nv-success-soft)", "var(--nv-success-soft)"]} glass={false}>
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
                        <SquircleTile size={40} colors={["var(--nv-tile)", "var(--nv-tile)"]} glass={false}>
                          <HugeiconsIcon
                            icon={Notification02Icon}
                            size={19}
                            strokeWidth={1.9}
                            className="text-(--nv-text-3)"
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

      <MobileTabBar active={activeNav} onChange={setActiveNav} scrolled={scrolled} />

      <CommandPalette open={paletteOpen} onClose={closePalette} onRun={runCommand} />
      <NotificationsSheet
        open={notifOpen}
        items={notifications}
        onClose={closeNotif}
        onMarkRead={(id) =>
          setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)))
        }
        onMarkAllRead={() => setNotifications((list) => list.map((n) => ({ ...n, read: true })))}
      />
      <AccountMenu
        open={accountOpen}
        onClose={closeAccount}
        avatar={<Avatar profile={profile} size={44} />}
        onEditProfile={() => {
          setAccountOpen(false);
          setProfileOpen(true);
        }}
      />
      <ProfileModal open={profileOpen} profile={profile} onClose={closeProfile} />

      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        onAddFunds={(amount) => setBalance((prev) => prev + amount)}
      />
    </div>
  );
}
