"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Notification02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import WalletModal from "./WalletModal";
import { MobileTabBar, NAV_ITEMS, navKeyFromPath, Sidebar } from "./Sidebar";
import { Avatar } from "./ui";
import CommandPalette, { type CommandId } from "./CommandPalette";
import NotificationsSheet, { type NotificationItem } from "./NotificationsSheet";
import AccountMenu from "./AccountMenu";
import ProfileModal from "./ProfileModal";
import NewMessageDialog from "./NewMessageDialog";
import { DashboardContext } from "./dashboard-context";
import { applyTheme, useProfile, useThemePref } from "./prefs";
import { markCampaignSeen, useCampaign } from "@/app/components/onboarding/campaign";
import WelcomeDialog from "@/app/components/celebration/WelcomeDialog";
import { dismissWelcome, useWelcome } from "@/app/components/celebration/welcome";

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

/** Moldura do painel: barra lateral, cabeçalho e modais partilhados por /painel/*. */
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = navKeyFromPath(pathname);
  const [balance, setBalance] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [openConvo, setOpenConvo] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.read).length;
  const profile = useProfile();
  const themePref = useThemePref();
  const router = useRouter();
  const campaign = useCampaign();
  const welcome = useWelcome();

  // Confirmação "campanha criada": aparece uma vez e some sozinha.
  useEffect(() => {
    if (!campaign?.justCreated || welcome) return;
    const t = setTimeout(markCampaignSeen, 6000);
    return () => clearTimeout(t);
  }, [campaign?.justCreated, welcome]);
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
  const closeCompose = useCallback(() => setComposeOpen(false), []);
  const isMessages = active === "mensagens";
  const title = active === "inicio" ? "Início" : NAV_ITEMS.find((i) => i.key === active)?.label ?? "Início";

  const ctx = useMemo(
    () => ({
      balance,
      openWallet: () => setWalletOpen(true),
      openCompose: () => setComposeOpen(true),
      openConvo,
      setOpenConvo,
    }),
    [balance, openConvo]
  );

  const runCommand = (id: CommandId) => {
    if (id.startsWith("nav:")) return router.push(`/painel/${id.slice(4)}`);
    if (id === "create-campaign") return router.push("/onboarding");
    if (id === "new-message") {
      router.push("/painel/mensagens");
      return setComposeOpen(true);
    }
    if (id === "add-funds") return setWalletOpen(true);
    if (id === "logout") return router.push("/entrar");
  };

  return (
    <DashboardContext.Provider value={ctx}>
    <div className="nuvi-dash flex min-h-dvh w-full bg-(--nv-bg) lg:h-dvh lg:min-h-0 lg:overflow-hidden font-sans text-(--nv-text)">
      <Sidebar
        active={active}
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
                  {title}
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
                  {/* Em Mensagens, no telemóvel, a ação principal é escrever: o "Criar" sai para caber o título */}
                  <span className={isMessages ? "hidden sm:contents" : "contents"}>
                    <Link href="/onboarding" className="nuvi-create-btn">
                      Criar
                    </Link>
                  </span>
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
            <main
              className={`flex w-full flex-1 flex-col px-4 pt-2 pb-28 sm:px-6 lg:px-8 ${
                isMessages ? "lg:min-h-0 lg:pb-8" : "lg:pb-10"
              }`}
            >
              {children}
            </main>
          </div>
        </div>
      </div>

      <MobileTabBar active={active} scrolled={scrolled} />

      {welcome?.role === "marca" && (
        <WelcomeDialog
          email={welcome.email}
          brandName={campaign?.brandName || undefined}
          campaignCreated={!!campaign?.justCreated}
          onClose={() => {
            dismissWelcome();
            markCampaignSeen();
          }}
        />
      )}

      {campaign?.justCreated && !welcome && (
        <div
          role="status"
          className="nuvi-pop lg-surface sq fixed top-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full py-2 pr-2 pl-3.5"
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} strokeWidth={2} className="text-[#34C759]" />
          <span className="text-[14px] font-semibold text-(--nv-text)">Campanha criada</span>
          <button
            type="button"
            onClick={markCampaignSeen}
            aria-label="Fechar"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2.2} />
          </button>
        </div>
      )}

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
      <NewMessageDialog
        open={composeOpen}
        onClose={closeCompose}
        onSent={(id) => {
          setComposeOpen(false);
          setOpenConvo(id);
          router.push("/painel/mensagens");
        }}
      />

      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        onAddFunds={(amount) => setBalance((prev) => prev + amount)}
      />
    </div>
    </DashboardContext.Provider>
  );
}
