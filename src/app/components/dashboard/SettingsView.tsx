"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowUpRight01Icon,
  BankIcon,
  BubbleChatIcon,
  Building03Icon,
  Calendar03Icon,
  Camera01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  Copy01Icon,
  CreditCardIcon,
  Delete02Icon,
  Download01Icon,
  Globe02Icon,
  GoogleDriveIcon,
  InstagramIcon,
  Invoice01Icon,
  Mail01Icon,
  MoneyReceive01Icon,
  Notification02Icon,
  PlugSocketIcon,
  Search01Icon,
  Shield01Icon,
  ShoppingBag01Icon,
  SlackIcon,
  SmartPhone01Icon,
  Tick02Icon,
  TiktokIcon,
  UserAdd01Icon,
  UserCheck01Icon,
  UserGroupIcon,
  Video01Icon,
  Wallet02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import SquircleTile from "@/app/components/squircle/SquircleTile";
import { useDashboard } from "./dashboard-context";
import { initialOf, saveProfile, useProfile } from "./prefs";
import {
  saveSettings,
  updateSettings,
  useWorkspaceSettings,
  type CompanyStage,
  type NotificationPrefs,
  type NotifyChannel,
} from "./settings";
import { useDialog } from "./useDialog";

type Icon = typeof UserCheck01Icon;

/* ================================================================
   Navegação: cada secção tem o seu #hash (link partilhável, "Voltar" funciona)
   ================================================================ */
const SECTIONS = [
  "perfil",
  "notificacoes",
  "empresa",
  "lojas",
  "verificacao",
  "equipa",
  "plano",
  "historico",
  "conectores",
] as const;
type SectionId = (typeof SECTIONS)[number];

const NAV_GROUPS: { group: string; items: { id: SectionId; label: string; icon: Icon }[] }[] = [
  {
    group: "Conta",
    items: [
      { id: "perfil", label: "Perfil", icon: UserCheck01Icon },
      { id: "notificacoes", label: "Notificações", icon: Notification02Icon },
    ],
  },
  {
    group: "Espaço de trabalho",
    items: [
      { id: "empresa", label: "Empresa", icon: Building03Icon },
      { id: "lojas", label: "Lojas", icon: ShoppingBag01Icon },
      { id: "verificacao", label: "Verificação", icon: CheckmarkBadge01Icon },
      { id: "equipa", label: "Equipa", icon: UserGroupIcon },
    ],
  },
  {
    group: "Faturação",
    items: [
      { id: "plano", label: "Plano & Pagamento", icon: Wallet02Icon },
      { id: "historico", label: "Histórico", icon: Invoice01Icon },
    ],
  },
  {
    group: "Integrações",
    items: [{ id: "conectores", label: "Conectores", icon: PlugSocketIcon }],
  },
];

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

function useSection(): SectionId {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => ""
  );
  return ((SECTIONS as readonly string[]).includes(hash) ? hash : "perfil") as SectionId;
}

const STAGES: { value: CompanyStage; label: string }[] = [
  { value: "", label: "Selecionar fase" },
  { value: "inicio", label: "A começar" },
  { value: "crescimento", label: "Em crescimento" },
  { value: "estabelecida", label: "Marca estabelecida" },
  { value: "agencia", label: "Agência" },
];

type NotifyKey = keyof Omit<NotificationPrefs, "all">;
const NOTIFY_GROUPS: { title: string; items: { key: NotifyKey; title: string; body: string; icon: Icon }[] }[] = [
  {
    title: "Criadores",
    items: [
      { key: "messages", title: "Mensagens", body: "Um criador envia-te uma mensagem.", icon: BubbleChatIcon },
      { key: "applicants", title: "Candidaturas", body: "Um criador candidata-se a uma campanha.", icon: UserGroupIcon },
      { key: "videoReview", title: "Vídeos para aprovar", body: "Uma entrega nova fica pronta para rever.", icon: Video01Icon },
    ],
  },
  {
    title: "Pagamentos",
    items: [
      { key: "payoutReceipts", title: "Recibos de pagamento", body: "Comprovativo sempre que um pagamento em Kwanzas é concluído.", icon: MoneyReceive01Icon },
      { key: "pendingPayouts", title: "Pagamentos pendentes", body: "Lembrete diário enquanto houver valores por aprovar.", icon: Clock01Icon },
    ],
  },
  {
    title: "Resumos",
    items: [
      { key: "weeklySummary", title: "Resumo semanal", body: "Métricas e atividade da conta, todas as segundas.", icon: Calendar03Icon },
    ],
  },
];

const CHANNELS: { id: NotifyChannel; label: string; icon: Icon; noun: string }[] = [
  { id: "email", label: "E-mail", icon: Mail01Icon, noun: "e-mail" },
  { id: "app", label: "Na app", icon: Notification02Icon, noun: "notificação na app" },
  { id: "whatsapp", label: "WhatsApp", icon: WhatsappIcon, noun: "WhatsApp" },
];

const MOCO_URL = "https://moco-lp.vercel.app/";

const inputCls =
  "sq h-11 w-full rounded-[14px] border border-(--nv-line-strong) bg-(--nv-solid) px-3.5 text-[14.5px] text-(--nv-text) outline-none transition-shadow placeholder:text-(--nv-text-3) focus:border-[#4EA7EB] focus:shadow-[0_0_0_4px_rgba(78,167,235,0.14)]";
const ghostBtn =
  "lg-control sq inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-(--nv-text)";

const MAX_IMG_BYTES = 2 * 1024 * 1024;
const fmtKz = (n: number) => `${n.toLocaleString("pt-PT")} Kz`;
const cleanDomain = (v: string) => v.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");

/* ================================================================
   Página
   ================================================================ */
export default function SettingsView() {
  const section = useSection();
  const [toast, setToast] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLElement>(null);

  // Mobile: a pílula da secção ativa fica sempre à vista.
  useEffect(() => {
    pillsRef.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [section]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 2600);
  };

  // O link muda o #hash sozinho; aqui só voltamos ao topo do conteúdo
  // quando se muda de secção a meio da página.
  const scrollTop = () => {
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ block: "start" });
  };

  return (
    <div ref={topRef} className="mx-auto w-full max-w-[1120px] scroll-mt-4">
      {/* Mobile: secções em pílulas horizontais */}
      <nav ref={pillsRef} aria-label="Secções das definições" className="-mx-4 mb-4 overflow-x-auto px-4 pb-1 lg:hidden">
        <ul className="flex w-max gap-1.5">
          {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
            const active = section === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "page" : undefined}
                  className={`sq inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap transition-all ${
                    active ? "bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]" : "lg-control text-(--nv-text-2)"
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={15} strokeWidth={2} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
        {/* Desktop: menu lateral fixo */}
        <nav aria-label="Secções das definições" className="hidden lg:sticky lg:top-2 lg:block">
          {NAV_GROUPS.map((g) => (
            <div key={g.group} className="mb-5 last:mb-0">
              <p className="px-3 pb-1.5 text-[11.5px] font-semibold text-(--nv-text-3)">{g.group}</p>
              <ul className="flex flex-col gap-0.5">
                {g.items.map((item) => {
                  const active = section === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={scrollTop}
                        aria-current={active ? "page" : undefined}
                        className={`sq flex items-center gap-2.5 rounded-[14px] px-3 py-2 text-[13.5px] font-semibold transition-all ${
                          active
                            ? "lg-control text-(--nv-text)"
                            : "text-(--nv-text-2) hover:bg-(--nv-fill) hover:text-(--nv-text)"
                        }`}
                      >
                        <HugeiconsIcon
                          icon={item.icon}
                          size={17}
                          strokeWidth={active ? 2.1 : 1.8}
                          className={active ? "text-[#0076E8] dark:text-[#60B5FF]" : "text-(--nv-text-3)"}
                        />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Conteúdo */}
        <div key={section} className="nuvi-step min-w-0 max-w-[720px] pb-6">
          {section === "perfil" && <ProfileSection onSaved={flash} />}
          {section === "notificacoes" && <NotificationsSection />}
          {section === "empresa" && <CompanySection onSaved={flash} />}
          {section === "lojas" && <StoresSection onSaved={flash} />}
          {section === "verificacao" && <VerificationSection onSaved={flash} />}
          {section === "equipa" && <TeamSection onSaved={flash} />}
          {section === "plano" && <PlanSection />}
          {section === "historico" && <HistorySection />}
          {section === "conectores" && <ConnectorsSection onSaved={flash} />}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="nuvi-pop sq fixed top-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-(--nv-glass-strong) px-4 py-2.5 text-[13.5px] font-semibold text-(--nv-text) shadow-[inset_0_1px_0_var(--nv-glass-edge),0_0_0_0.5px_var(--nv-line),0_14px_34px_-12px_var(--nv-shadow)] backdrop-blur-2xl"
        >
          <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.6} className="text-[#34C759]" />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   1. PERFIL
   ================================================================ */
function ProfileSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const profile = useProfile();
  const settings = useWorkspaceSettings();
  // A chave remonta o formulário quando os dados guardados mudam
  // (ex.: chegam do localStorage depois da hidratação).
  const key = `${profile.name}|${profile.photo?.length ?? 0}|${settings.email}`;
  return (
    <>
      <ProfileForm key={key} onSaved={onSaved} />
      <SecurityGroup onSaved={onSaved} />
    </>
  );
}

function ProfileForm({ onSaved }: { onSaved: (msg: string) => void }) {
  const profile = useProfile();
  const settings = useWorkspaceSettings();
  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState<string | null>(profile.photo);
  const [email, setEmail] = useState(settings.email);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = name !== profile.name || photo !== profile.photo || email !== settings.email;
  const reset = () => {
    setName(profile.name);
    setPhoto(profile.photo);
    setEmail(settings.email);
    setPhotoError(null);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setPhotoError("Escolhe uma imagem PNG, JPG ou WebP.");
    if (file.size > MAX_IMG_BYTES) return setPhotoError("A imagem tem mais de 2 MB.");
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!dirty || !name.trim()) return;
        saveProfile({ name: name.trim(), photo });
        updateSettings({ email: email.trim() });
        onSaved("Perfil guardado");
      }}
    >
      <SectionHeader title="Perfil" subtitle="O teu nome, foto e como os criadores te veem nas mensagens." />

      <Group>
        <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative h-16 w-16 shrink-0 cursor-pointer rounded-full"
            aria-label="Mudar foto de perfil"
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL local
              <img src={photo} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#5DB6F5] to-[#0076E8] text-[24px] font-bold text-white">
                {initialOf(name || settings.companyName, "N")}
              </span>
            )}
            <span className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-(--nv-text) text-(--nv-solid) ring-2 ring-(--nv-solid) transition-transform group-hover:scale-105">
              <HugeiconsIcon icon={Camera01Icon} size={12} strokeWidth={2.2} />
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className={ghostBtn}>
                Mudar foto
              </button>
              {photo && (
                <button type="button" onClick={() => setPhoto(null)} className={`${ghostBtn} !text-[#FF3B30]`}>
                  Remover
                </button>
              )}
            </div>
            <p className={`mt-1.5 text-[12px] ${photoError ? "font-medium text-[#FF3B30]" : "text-(--nv-text-3)"}`}>
              {photoError ?? "PNG, JPG ou WebP, até 2 MB."}
            </p>
          </div>
        </div>
      </Group>

      <Group title="Dados pessoais">
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <Field label="O teu nome" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Sandro Vieira"
              autoComplete="name"
              className={inputCls}
            />
          </Field>
          <Field label="E-mail">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.ao"
              autoComplete="email"
              className={inputCls}
            />
          </Field>
        </div>
      </Group>

      <SaveBar dirty={dirty} disabled={!name.trim()} onDiscard={reset} />
    </form>
  );
}

function SecurityGroup({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  return (
    <Group title="Segurança" subtitle="Como proteges o acesso à tua conta.">
      <Row
        icon={Mail01Icon}
        title="Entrar com código por e-mail"
        body="Enviamos um código de 6 dígitos sempre que entras. Sem palavra-passe."
        control={<StatusPill tone="success">Ativo</StatusPill>}
      />
      <Row
        icon={Shield01Icon}
        title="Verificação em dois passos"
        body="Pede uma confirmação extra antes de aprovar pagamentos em Kwanzas."
        muted={!settings.twoFactor}
        control={
          <Switch
            checked={settings.twoFactor}
            label="Verificação em dois passos"
            onToggle={() => {
              updateSettings({ twoFactor: !settings.twoFactor });
              onSaved(settings.twoFactor ? "Verificação em dois passos desligada" : "Verificação em dois passos ligada");
            }}
          />
        }
      />
    </Group>
  );
}

/* ================================================================
   2. NOTIFICAÇÕES (guardam-se ao mudar)
   ================================================================ */
function NotificationsSection() {
  const settings = useWorkspaceSettings();
  const [channel, setChannel] = useState<NotifyChannel>("email");
  const current = settings.notifications[channel];
  const meta = CHANNELS.find((c) => c.id === channel)!;

  const setPrefs = (next: NotificationPrefs) =>
    saveSettings({ ...settings, notifications: { ...settings.notifications, [channel]: next } });

  const toggleAll = () => {
    const v = !current.all;
    setPrefs({ all: v, messages: v, applicants: v, videoReview: v, payoutReceipts: v, pendingPayouts: v, weeklySummary: v });
  };

  const toggle = (key: NotifyKey) => {
    const next = { ...current, [key]: !current[key] };
    const allOn = NOTIFY_GROUPS.every((g) => g.items.every((i) => next[i.key]));
    setPrefs({ ...next, all: allOn });
  };

  return (
    <>
      <SectionHeader
        title="Notificações"
        subtitle="Escolhe o que te chega e por onde. Guardamos cada mudança na hora."
      />

      {/* Canal: separadores com sublinhado */}
      <div role="tablist" aria-label="Canal" className="mb-5 flex gap-1 border-b border-(--nv-line)">
        {CHANNELS.map((c) => {
          const sel = channel === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={sel}
              onClick={() => setChannel(c.id)}
              className={`-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-3 pt-1 pb-2.5 text-[14px] font-semibold transition-colors ${
                sel
                  ? "border-[#0076E8] text-(--nv-text) dark:border-[#60B5FF]"
                  : "border-transparent text-(--nv-text-3) hover:text-(--nv-text)"
              }`}
            >
              <HugeiconsIcon icon={c.icon} size={16} strokeWidth={1.9} />
              {c.label}
            </button>
          );
        })}
      </div>

      <Group>
        <Row
          icon={meta.icon}
          title={`Tudo por ${meta.noun}`}
          body="Interruptor geral para todos os avisos abaixo."
          muted={!current.all}
          control={<Switch checked={current.all} label={`Tudo por ${meta.noun}`} onToggle={toggleAll} />}
        />
      </Group>

      {NOTIFY_GROUPS.map((g) => (
        <Group key={g.title} title={g.title}>
          {g.items.map((item) => (
            <Row
              key={item.key}
              icon={item.icon}
              title={item.title}
              body={item.body}
              muted={!current[item.key]}
              control={<Switch checked={current[item.key]} label={item.title} onToggle={() => toggle(item.key)} />}
            />
          ))}
        </Group>
      ))}
    </>
  );
}

/* ================================================================
   3. EMPRESA
   ================================================================ */
type CompanyForm = Pick<
  ReturnType<typeof useWorkspaceSettings>,
  "companyName" | "companyLogo" | "companyStage" | "website" | "phone" | "address" | "instagram" | "tiktok" | "linkedin" | "whatsapp"
>;

const pickCompany = (s: CompanyForm): CompanyForm => ({
  companyName: s.companyName,
  companyLogo: s.companyLogo,
  companyStage: s.companyStage,
  website: s.website,
  phone: s.phone,
  address: s.address,
  instagram: s.instagram,
  tiktok: s.tiktok,
  linkedin: s.linkedin,
  whatsapp: s.whatsapp,
});

function CompanySection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const saved = pickCompany(settings);
  const key = Object.values(saved)
    .map((v) => (typeof v === "string" && v.length > 200 ? v.length : v))
    .join("|");
  return (
    <>
      <CompanyFormView key={key} saved={saved} onSaved={onSaved} />
      <DangerZone onSaved={onSaved} />
    </>
  );
}

function CompanyFormView({ saved, onSaved }: { saved: CompanyForm; onSaved: (msg: string) => void }) {
  const [form, setForm] = useState<CompanyForm>(saved);
  const logoRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof CompanyForm>(k: K, v: CompanyForm[K]) => setForm((p) => ({ ...p, [k]: v }));
  const dirty = (Object.keys(saved) as (keyof CompanyForm)[]).some((k) => saved[k] !== form[k]);

  const onLogo = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/") || file.size > MAX_IMG_BYTES) return;
    const reader = new FileReader();
    reader.onload = () => set("companyLogo", typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const text = (k: keyof CompanyForm, label: string, placeholder: string, opts: { type?: string; className?: string; required?: boolean } = {}) => (
    <Field label={label} required={opts.required} className={opts.className}>
      <input
        type={opts.type ?? "text"}
        value={(form[k] as string) ?? ""}
        onChange={(e) => set(k, e.target.value as never)}
        placeholder={placeholder}
        className={inputCls}
      />
    </Field>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!dirty || !form.companyName.trim()) return;
        updateSettings({ ...form, companyName: form.companyName.trim(), website: cleanDomain(form.website) });
        onSaved("Dados da empresa guardados");
      }}
    >
      <SectionHeader title="Empresa" subtitle="Como a tua marca aparece para os criadores." />

      <Group title="Logótipo">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
          <div className="flex items-center gap-3.5">
            {form.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL local
              <img src={form.companyLogo} alt="" className="sq h-14 w-14 rounded-[16px] object-cover" />
            ) : (
              <span className="sq flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-b from-[#4EA7EB] to-[#0076E8] text-[20px] font-bold text-white">
                {initialOf(form.companyName, "N")}
              </span>
            )}
            <div>
              <p className="text-[14px] font-semibold text-(--nv-text)">Logótipo da marca</p>
              <p className="text-[12px] text-(--nv-text-3)">PNG, JPG ou SVG, até 2 MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => logoRef.current?.click()} className={ghostBtn}>
              {form.companyLogo ? "Substituir" : "Carregar"}
            </button>
            {form.companyLogo && (
              <button type="button" onClick={() => set("companyLogo", null)} className={`${ghostBtn} !text-[#FF3B30]`}>
                Remover
              </button>
            )}
          </div>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onLogo(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </Group>

      <Group title="Detalhes" subtitle="Nome, contacto e onde estão.">
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
          {text("companyName", "Nome da empresa", "Ex.: Moco", { required: true })}
          <Field label="Fase da empresa">
            <select
              value={form.companyStage}
              onChange={(e) => set("companyStage", e.target.value as CompanyStage)}
              className={`${inputCls} cursor-pointer`}
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          {text("website", "Website", "minhamarca.ao")}
          {text("phone", "Telefone", "+244 923 000 000", { type: "tel" })}
          {text("address", "Endereço", "Ex.: Talatona, Luanda", { className: "sm:col-span-2" })}
        </div>
      </Group>

      <Group title="Redes sociais" subtitle="Onde os criadores encontram a tua marca.">
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
          {text("instagram", "Instagram", "@minhamarca")}
          {text("tiktok", "TikTok", "@minhamarca")}
          {text("whatsapp", "WhatsApp Business", "+244 923 000 000", { type: "tel" })}
          {text("linkedin", "LinkedIn", "company/minhamarca")}
        </div>
      </Group>

      <SaveBar dirty={dirty} disabled={!form.companyName.trim()} onDiscard={() => setForm(saved)} />
    </form>
  );
}

function DangerZone({ onSaved }: { onSaved: (msg: string) => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="mt-10 border-t border-(--nv-line) pt-6">
      <h3 className="text-[15px] font-bold text-[#D70015] dark:text-[#FF6961]">Zona de perigo</h3>
      <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">Não dá para desfazer.</p>
      <div className="sq mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[#FF3B30]/20 bg-[#FF3B30]/[0.06] p-4">
        <div>
          <p className="text-[14px] font-semibold text-(--nv-text)">Apagar dados do espaço de trabalho</p>
          <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">Remove empresa, lojas, equipa e preferências guardadas neste dispositivo.</p>
        </div>
        {confirm ? (
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setConfirm(false)} className={ghostBtn}>
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  window.localStorage.removeItem("nuvi-workspace-settings");
                } catch {
                  /* armazenamento indisponível */
                }
                window.dispatchEvent(new Event("nuvi-settings-change"));
                setConfirm(false);
                onSaved("Dados apagados");
              }}
              className="sq h-9 cursor-pointer rounded-full bg-[#FF3B30] px-4 text-[13px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition-transform active:scale-95"
            >
              Apagar de vez
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="sq h-9 cursor-pointer rounded-full bg-[#FF3B30] px-4 text-[13px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition-transform active:scale-95"
          >
            Apagar dados
          </button>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   4. LOJAS (Moco + Nuvi Pixel)
   ================================================================ */
function StoresSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const [mocoOpen, setMocoOpen] = useState(false);
  const [pixelOpen, setPixelOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const stores = settings.mocoStores;

  const copySnippet = (id: string, domain: string) => {
    const snippet = `<script defer src="https://cdn.nuvi.ao/pixel.js" data-site="${domain}"></script>`;
    navigator.clipboard?.writeText(snippet).catch(() => {});
    setCopiedId(id);
    onSaved("Código copiado");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <SectionHeader title="Lojas" subtitle="Liga a tua loja para enviar amostras a criadores e ver as vendas que eles geram." />

      {/* Moco */}
      <div className="lg-surface sq relative mb-6 overflow-hidden rounded-[24px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-[#0A5CFF]/15 blur-3xl"
        />
        <div className="relative flex flex-wrap items-start gap-4 p-5 sm:p-6">
          <Image
            src="/brands/moco.png"
            alt="Moco"
            width={56}
            height={56}
            className="sq h-14 w-14 shrink-0 rounded-[16px] shadow-[0_8px_20px_-8px_rgba(10,92,255,0.6)]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[17px] font-bold tracking-[-0.02em] text-(--nv-text)">Moco</h3>
              <StatusPill tone={stores.length ? "success" : "neutral"}>
                {stores.length === 0 ? "Por ligar" : `${stores.length} ${stores.length === 1 ? "loja ligada" : "lojas ligadas"}`}
              </StatusPill>
            </div>
            <p className="mt-1 text-[13.5px] leading-snug text-(--nv-text-2)">
              Loja online, pagamentos, faturação AGT e stock num só lugar. Liga-a à Nuvi para acompanhar as vendas de cada criador.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setMocoOpen(true)} className="nuvi-btn-sm sq !h-10 !gap-1.5 !px-5 !text-[13.5px]">
                <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.4} />
                Ligar loja Moco
              </button>
              <a href={MOCO_URL} target="_blank" rel="noopener noreferrer" className={`${ghostBtn} !h-10`}>
                Conhecer a Moco
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={2.1} />
              </a>
            </div>
          </div>
        </div>

        {stores.length > 0 ? (
          <ul className="relative divide-y divide-(--nv-line) border-t border-(--nv-line)">
            {stores.map((store) => (
              <li key={store.id} className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-(--nv-text)">{store.name}</p>
                  <a
                    href={`https://${store.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-[12.5px] text-(--nv-text-3) hover:text-[#0076E8] hover:underline"
                  >
                    {store.domain}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusPill tone="success">Ligada</StatusPill>
                  <IconAction
                    label={`Desligar ${store.name}`}
                    icon={Delete02Icon}
                    onClick={() => {
                      updateSettings({ mocoStores: stores.filter((s) => s.id !== store.id) });
                      onSaved("Loja desligada");
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="relative border-t border-(--nv-line) px-5 py-3.5 text-[12.5px] text-(--nv-text-3) sm:px-6">
            Ainda não tens loja?{" "}
            <a href={MOCO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0076E8] hover:underline dark:text-[#60B5FF]">
              Cria a tua grátis na Moco
            </a>{" "}
            e volta aqui para a ligar.
          </p>
        )}
      </div>

      {/* Nuvi Pixel */}
      <Group
        title="Outros websites"
        subtitle="Usa o Nuvi Pixel para medir visitas e vendas em qualquer site."
        action={
          <button type="button" onClick={() => setPixelOpen(true)} className={ghostBtn}>
            <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2.4} />
            Adicionar
          </button>
        }
      >
        {settings.pixelSites.length === 0 ? (
          <Empty icon={Globe02Icon} title="Sem websites" body="Adiciona um domínio para gerar o código do Pixel." />
        ) : (
          settings.pixelSites.map((site) => (
            <div key={site.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <IconTile icon={Globe02Icon} />
                <span className="truncate text-[14px] font-semibold text-(--nv-text)">{site.domain}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => copySnippet(site.id, site.domain)} className={`${ghostBtn} !h-8 !px-3 !text-[12px]`}>
                  <HugeiconsIcon icon={copiedId === site.id ? Tick02Icon : Copy01Icon} size={13} strokeWidth={2} />
                  {copiedId === site.id ? "Copiado" : "Copiar código"}
                </button>
                <IconAction
                  label={`Remover ${site.domain}`}
                  icon={Delete02Icon}
                  onClick={() => {
                    updateSettings({ pixelSites: settings.pixelSites.filter((s) => s.id !== site.id) });
                    onSaved("Website removido");
                  }}
                />
              </div>
            </div>
          ))
        )}
      </Group>

      <FormModal
        open={mocoOpen}
        title="Ligar loja Moco"
        subtitle="Indica o endereço da tua loja na Moco."
        submitLabel="Ligar loja"
        onClose={() => setMocoOpen(false)}
        fields={[
          { name: "domain", label: "Endereço da loja", placeholder: "minhaloja.moco.ao", required: true },
          { name: "name", label: "Nome da loja", placeholder: "Ex.: Minha Loja" },
        ]}
        footnote={
          <>
            Ainda não tens loja?{" "}
            <a href={MOCO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0076E8] hover:underline dark:text-[#60B5FF]">
              Cria grátis na Moco
            </a>
          </>
        }
        onSubmit={(v) => {
          const domain = cleanDomain(v.domain);
          if (!domain) return false;
          const name = v.name.trim() || domain.split(".")[0] || "Loja Moco";
          updateSettings({ mocoStores: [...stores, { id: crypto.randomUUID(), name, domain, connectedAt: new Date().toISOString() }] });
          onSaved("Loja Moco ligada");
          return true;
        }}
      />
      <FormModal
        open={pixelOpen}
        title="Adicionar website"
        subtitle="Geramos o código do Nuvi Pixel para este domínio."
        submitLabel="Adicionar"
        onClose={() => setPixelOpen(false)}
        fields={[{ name: "domain", label: "Domínio", placeholder: "minhamarca.ao", required: true }]}
        onSubmit={(v) => {
          const domain = cleanDomain(v.domain);
          if (!domain) return false;
          updateSettings({ pixelSites: [...settings.pixelSites, { id: crypto.randomUUID(), domain, connectedAt: new Date().toISOString() }] });
          onSaved("Website adicionado");
          return true;
        }}
      />
    </>
  );
}

/* ================================================================
   5. VERIFICAÇÃO (NIF em Angola)
   ================================================================ */
function VerificationSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const [nif, setNif] = useState(settings.nif);
  const done = settings.verificationSubmitted;

  return (
    <>
      <SectionHeader
        title="Verificação"
        subtitle="Marcas verificadas recebem mais candidaturas e transmitem confiança aos criadores."
      />
      <Group>
        <div className="flex items-start gap-3.5 p-4 sm:p-5">
          <SquircleTile
            size={44}
            colors={done ? ["var(--nv-success-soft)", "var(--nv-success-soft)"] : ["var(--nv-accent-soft)", "var(--nv-accent-soft)"]}
            glass={false}
          >
            <HugeiconsIcon
              icon={done ? CheckmarkBadge01Icon : Shield01Icon}
              size={21}
              strokeWidth={1.9}
              className={done ? "text-[#34C759]" : "text-[#4EA7EB]"}
            />
          </SquircleTile>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[14.5px] font-bold text-(--nv-text)">{done ? "Em análise" : "Marca por verificar"}</p>
              <StatusPill tone={done ? "warning" : "neutral"}>{done ? "Pendente" : "Não verificada"}</StatusPill>
            </div>
            <p className="mt-0.5 text-[13px] leading-relaxed text-(--nv-text-3)">
              {done
                ? `Recebemos o NIF ${settings.nif}. Avisamos-te por e-mail quando o selo ficar ativo.`
                : "Indica o NIF da empresa em Angola para receber o selo de marca verificada."}
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!nif.trim()) return;
            updateSettings({ nif: nif.trim(), verificationSubmitted: true });
            onSaved("Pedido de verificação enviado");
          }}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:p-5"
        >
          <Field label="NIF da empresa" className="flex-1">
            <input
              value={nif}
              onChange={(e) => setNif(e.target.value)}
              placeholder="Ex.: 5417000000"
              inputMode="numeric"
              className={inputCls}
            />
          </Field>
          <button type="submit" disabled={!nif.trim() || nif.trim() === settings.nif} className="nuvi-btn-sm sq !h-11 shrink-0 !px-6">
            {done ? "Atualizar NIF" : "Pedir verificação"}
          </button>
        </form>
      </Group>
    </>
  );
}

/* ================================================================
   6. EQUIPA
   ================================================================ */
function TeamSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const profile = useProfile();
  const [inviteOpen, setInviteOpen] = useState(false);
  const ownerName = profile.name || settings.companyName;

  return (
    <>
      <SectionHeader
        title="Equipa"
        subtitle="Convida colegas e decide o que cada pessoa pode ver e fazer."
        action={
          <button type="button" onClick={() => setInviteOpen(true)} className="nuvi-btn-sm sq !h-10 !gap-1.5 !px-5 !text-[13.5px]">
            <HugeiconsIcon icon={UserAdd01Icon} size={16} strokeWidth={2.2} />
            Convidar
          </button>
        }
      />

      <div className="lg-surface sq overflow-hidden rounded-[22px]">
        <div className="hidden grid-cols-[minmax(0,1fr)_130px_120px_40px] gap-3 border-b border-(--nv-line) px-5 py-2.5 text-[12px] font-semibold text-(--nv-text-3) sm:grid">
          <span>Membro</span>
          <span>Função</span>
          <span>Estado</span>
          <span />
        </div>
        <ul className="divide-y divide-(--nv-line)">
          <MemberRow
            avatar={
              profile.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL local
                <img src={profile.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <InitialAvatar text={ownerName || "N"} />
              )
            }
            name={ownerName ? `${ownerName} (tu)` : "Tu"}
            email={settings.email || "Sem e-mail definido"}
            role={<StatusPill tone="accent">Proprietário</StatusPill>}
            status="Acesso total"
          />
          {settings.members.map((m) => (
            <MemberRow
              key={m.id}
              avatar={<InitialAvatar text={m.email} muted />}
              name={m.email.split("@")[0]}
              email={m.email}
              role={<StatusPill tone="neutral">{m.role === "admin" ? "Administrador" : "Gestor"}</StatusPill>}
              status="Convite pendente"
              action={
                <IconAction
                  label={`Remover ${m.email}`}
                  icon={Delete02Icon}
                  onClick={() => {
                    updateSettings({ members: settings.members.filter((x) => x.id !== m.id) });
                    onSaved("Convite cancelado");
                  }}
                />
              }
            />
          ))}
        </ul>
      </div>
      {settings.members.length === 0 && (
        <p className="mt-3 px-1 text-[12.5px] text-(--nv-text-3)">
          Ainda és o único membro. Convida quem aprova vídeos ou gere campanhas contigo.
        </p>
      )}

      <FormModal
        open={inviteOpen}
        title="Convidar para a equipa"
        subtitle="A pessoa recebe um convite por e-mail."
        submitLabel="Enviar convite"
        onClose={() => setInviteOpen(false)}
        fields={[
          { name: "email", label: "E-mail", placeholder: "colega@empresa.ao", type: "email", required: true },
          {
            name: "role",
            label: "Função",
            options: [
              { value: "gestor", label: "Gestor · campanhas e vídeos" },
              { value: "admin", label: "Administrador · tudo, incluindo pagamentos" },
            ],
          },
        ]}
        onSubmit={(v) => {
          const email = v.email.trim().toLowerCase();
          if (!/^\S+@\S+\.\S+$/.test(email)) return "Indica um e-mail válido.";
          if (settings.members.some((m) => m.email === email)) return "Essa pessoa já foi convidada.";
          updateSettings({
            members: [...settings.members, { id: crypto.randomUUID(), email, role: v.role === "admin" ? "admin" : "gestor", status: "convidado" }],
          });
          onSaved(`Convite preparado para ${email}`);
          return true;
        }}
      />
    </>
  );
}

function MemberRow({
  avatar,
  name,
  email,
  role,
  status,
  action,
}: {
  avatar: React.ReactNode;
  name: string;
  email: string;
  role: React.ReactNode;
  status: string;
  action?: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_130px_120px_40px] sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {avatar}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-(--nv-text)">{name}</p>
          <p className="truncate text-[12.5px] text-(--nv-text-3)">{email}</p>
          <p className="mt-1 flex items-center gap-2 text-[12px] text-(--nv-text-3) sm:hidden">
            {role}
            {status}
          </p>
        </div>
      </div>
      <div className="hidden sm:block">{role}</div>
      <p className="hidden text-[12.5px] text-(--nv-text-2) sm:block">{status}</p>
      <div className="flex justify-end">{action}</div>
    </li>
  );
}

function InitialAvatar({ text, muted }: { text: string; muted?: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold ${
        muted ? "bg-(--nv-fill) text-(--nv-text-2)" : "bg-gradient-to-b from-[#5DB6F5] to-[#0076E8] text-white"
      }`}
    >
      {initialOf(text, "N")}
    </span>
  );
}

/* ================================================================
   7. PLANO & PAGAMENTO
   ================================================================ */
function PlanSection() {
  const { balance, openWallet } = useDashboard();
  const settings = useWorkspaceSettings();
  const [plansOpen, setPlansOpen] = useState(false);

  return (
    <>
      <SectionHeader title="Plano & Pagamento" subtitle="A tua subscrição, a carteira e como pagas." />

      {/* Subscrição da plataforma */}
      <section aria-labelledby="sub-title" className="lg-surface sq mb-6 overflow-hidden rounded-[24px]">
        <div className="flex items-center gap-3.5 p-4 sm:p-5">
          <Image
            src="/nuvi-cloud.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full shadow-[0_4px_12px_-4px_rgba(0,90,180,0.35)]"
          />
          <div className="min-w-0 flex-1">
            <p id="sub-title" className="truncate text-[15.5px] font-bold tracking-[-0.015em] text-(--nv-text)">
              Sem plano ativo
            </p>
            <p className="truncate text-[12.5px] text-(--nv-text-3)">Subscrição da plataforma Nuvi</p>
          </div>
          <p className="shrink-0 text-right">
            <span className="font-title text-[24px] leading-none font-bold tracking-[-0.03em] text-(--nv-text) tabular-nums">
              {fmtKz(0)}
            </span>
            <span className="block text-[11.5px] text-(--nv-text-3)">por mês</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--nv-line) bg-(--nv-fill-2) px-4 py-3 sm:px-5">
          <p className="text-[12.5px] text-(--nv-text-3)">Sem mensalidade. Pagas só os conteúdos que aprovas.</p>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => document.getElementById("dados-fiscais")?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className={`${ghostBtn} !h-10`}
            >
              Detalhes de faturação
            </button>
            <button type="button" onClick={() => setPlansOpen(true)} className="nuvi-btn-sm sq !h-10 !px-5 !text-[13.5px]">
              Mudar plano
            </button>
          </div>
        </div>
      </section>

      <Group title="Carteira" subtitle="Saldo em Kwanzas para pagar criadores.">
        <Row
          icon={Wallet02Icon}
          title={fmtKz(balance)}
          body="Disponível para pagamentos."
          control={
            <div className="flex gap-2">
              <Link href="/painel/pagamentos" className={`${ghostBtn} hidden sm:inline-flex`}>
                Ver pagamentos
              </Link>
              <button type="button" onClick={openWallet} className={ghostBtn}>
                <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2.4} className="text-[#0076E8]" />
                Carregar
              </button>
            </div>
          }
        />
      </Group>

      <Group title="Métodos de carregamento" subtitle="Disponíveis para todas as contas em Angola.">
        <Row
          icon={SmartPhone01Icon}
          title="Multicaixa Express"
          body="Pagas no telemóvel e o saldo entra na hora."
          control={<StatusPill tone="success">Disponível</StatusPill>}
        />
        <Row
          icon={BankIcon}
          title="Referência bancária"
          body="Geramos uma referência para pagares no multibanco ou no banco."
          control={<StatusPill tone="success">Disponível</StatusPill>}
        />
        <Row
          icon={CreditCardIcon}
          title="Cartão internacional"
          body="Visa e Mastercard."
          muted
          control={<StatusPill tone="neutral">Em breve</StatusPill>}
        />
      </Group>

      <div id="dados-fiscais" className="scroll-mt-6" />
      <Group title="Dados fiscais" subtitle="Aparecem em todas as faturas.">
        <Row
          icon={Invoice01Icon}
          title={settings.nif ? `NIF ${settings.nif}` : "Sem NIF"}
          body={settings.nif ? "Usado nas faturas e na verificação da marca." : "Adiciona o NIF da empresa para faturas com os teus dados."}
          muted={!settings.nif}
          control={
            <a href="#verificacao" className={ghostBtn}>
              {settings.nif ? "Alterar" : "Adicionar"}
            </a>
          }
        />
      </Group>
      <PlansModal open={plansOpen} onClose={() => setPlansOpen(false)} />
    </>
  );
}


const PLANS: { name: string; body: string; features: string[] }[] = [
  { name: "Essencial", body: "Para marcas a começar com criadores.", features: ["Até 3 campanhas ativas", "Mensagens com criadores", "Pagamentos em Kwanzas"] },
  { name: "Pro", body: "Para marcas que lançam todos os meses.", features: ["Campanhas ilimitadas", "Equipa com várias pessoas", "Relatórios de desempenho"] },
  { name: "Agência", body: "Para gerir várias marcas num só sítio.", features: ["Vários espaços de trabalho", "Aprovações por cliente", "Apoio dedicado"] },
];

function PlansModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <PlansModalBody onClose={onClose} />;
}

function PlansModalBody({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, panelRef);
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-(--nv-scrim) backdrop-blur-[3px] sm:items-center sm:p-4"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plans-title"
        className="nuvi-step sq nuvi-scroll max-h-[90dvh] w-full max-w-[640px] overflow-y-auto rounded-t-[28px] bg-(--nv-glass-strong) p-6 shadow-[inset_0_1px_0_var(--nv-glass-edge),0_0_0_0.5px_var(--nv-line),0_30px_80px_-20px_var(--nv-shadow)] backdrop-blur-2xl sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="plans-title" className="text-[20px] font-bold tracking-[-0.022em] text-(--nv-text)">
              Planos da Nuvi
            </h3>
            <p className="mt-0.5 text-[13px] text-(--nv-text-3)">
              Os planos pagos estão a chegar. Até lá, usas a Nuvi sem mensalidade.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="lg-control flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="sq mt-5 flex items-center justify-between gap-3 rounded-[18px] border border-[#4EA7EB]/40 bg-(--nv-accent-soft) px-4 py-3">
          <div>
            <p className="text-[14px] font-semibold text-(--nv-text)">Sem plano · {fmtKz(0)} por mês</p>
            <p className="text-[12.5px] text-(--nv-text-2)">Lança campanhas e paga só os conteúdos que aprovas.</p>
          </div>
          <StatusPill tone="accent">Atual</StatusPill>
        </div>

        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PLANS.map((p) => (
            <li key={p.name} className="sq flex flex-col rounded-[20px] border border-(--nv-line) bg-(--nv-solid) p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[15px] font-bold text-(--nv-text)">{p.name}</p>
                <StatusPill tone="neutral">Em breve</StatusPill>
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-(--nv-text-3)">{p.body}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-[12.5px] text-(--nv-text-2)">
                    <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2.4} className="mt-px shrink-0 text-[#4EA7EB]" />
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} className="nuvi-btn-sm sq !h-10 !px-6 !text-[13.5px]">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   8. HISTÓRICO
   ================================================================ */
function HistorySection() {
  return (
    <>
      <SectionHeader
        title="Histórico"
        subtitle="Faturas e recibos dos carregamentos, prontos a transferir."
        action={
          <button type="button" disabled className={ghostBtn} title="Ainda não há faturas">
            <HugeiconsIcon icon={Download01Icon} size={15} strokeWidth={2} />
            Transferir tudo
          </button>
        }
      />
      <div className="lg-surface sq flex flex-col items-center rounded-[24px] px-6 py-14 text-center">
        <Image src="/icons/wallet.svg" alt="" width={84} height={72} className="select-none" draggable={false} />
        <p className="mt-4 text-[17px] font-bold tracking-[-0.02em] text-(--nv-text)">Sem faturas ainda</p>
        <p className="mt-1 max-w-[300px] text-[13px] leading-snug text-(--nv-text-3)">
          Os recibos aparecem aqui depois do primeiro carregamento da carteira.
        </p>
      </div>
    </>
  );
}

/* ================================================================
   9. CONECTORES
   ================================================================ */
const COMING_SOON: { name: string; body: string; icon: Icon; color: string }[] = [
  { name: "WhatsApp Business", body: "Responde a criadores e recebe avisos no WhatsApp.", icon: WhatsappIcon, color: "#25D366" },
  { name: "Instagram", body: "Vê o desempenho das publicações dos criadores.", icon: InstagramIcon, color: "#E1306C" },
  { name: "TikTok", body: "Métricas dos vídeos e Spark Ads.", icon: TiktokIcon, color: "#111111" },
  { name: "Google Drive", body: "Briefings e contratos sempre à mão.", icon: GoogleDriveIcon, color: "#1FA463" },
  { name: "Google Calendar", body: "Marca reuniões com criadores sem sair da Nuvi.", icon: Calendar03Icon, color: "#4285F4" },
  { name: "Slack", body: "Avisos da equipa num canal à tua escolha.", icon: SlackIcon, color: "#611F69" },
];

function ConnectorsSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const [query, setQuery] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const email = settings.emailConnector;

  const q = query.trim().toLowerCase();
  const match = (s: string) => !q || s.toLowerCase().includes(q);
  const showEmail = match("e-mail email correio");
  const soon = COMING_SOON.filter((c) => match(`${c.name} ${c.body}`));

  return (
    <>
      <SectionHeader title="Conectores" subtitle="Liga as ferramentas que já usas à Nuvi." />

      <label className="lg-control sq mb-6 flex h-11 items-center gap-2.5 rounded-full px-4">
        <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
        <span className="sr-only">Pesquisar conectores</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar conectores"
          className="w-full bg-transparent text-[14px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3) [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      {showEmail && (
        <>
          <GroupLabel>Disponível</GroupLabel>
          <div className="lg-surface sq mb-7 rounded-[22px] p-5">
            <div className="flex flex-wrap items-start gap-4">
              <SquircleTile size={48} colors={["#6BB8F2", "#0076E8"]}>
                <HugeiconsIcon icon={Mail01Icon} size={22} strokeWidth={1.9} className="text-white" />
              </SquircleTile>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[15.5px] font-bold text-(--nv-text)">E-mail</h3>
                  <StatusPill tone={email ? "success" : "neutral"}>{email ? "Ligado" : "Por ligar"}</StatusPill>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-(--nv-text-2)">
                  Recebe no teu e-mail as mensagens de criadores, entregas por rever e o resumo semanal.
                </p>
                {email && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-(--nv-fill) px-3 py-1 text-[12.5px] font-medium text-(--nv-text)">
                    <HugeiconsIcon icon={Mail01Icon} size={13} strokeWidth={2} className="text-(--nv-text-3)" />
                    {email.address}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {email ? (
                  <>
                    <button type="button" onClick={() => setEmailOpen(true)} className={ghostBtn}>
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({ emailConnector: null });
                        onSaved("E-mail desligado");
                      }}
                      className={`${ghostBtn} !text-[#FF3B30]`}
                    >
                      Desligar
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setEmailOpen(true)} className="nuvi-btn-sm sq !h-10 !px-5 !text-[13.5px]">
                    Ligar
                  </button>
                )}
              </div>
            </div>
            {email && (
              <a href="#notificacoes" className="mt-4 flex items-center gap-1 border-t border-(--nv-line) pt-3.5 text-[12.5px] font-semibold text-[#0076E8] hover:underline dark:text-[#60B5FF]">
                Escolher que avisos chegam por e-mail
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={13} strokeWidth={2.1} />
              </a>
            )}
          </div>
        </>
      )}

      {soon.length > 0 && (
        <>
          <GroupLabel>Em breve</GroupLabel>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {soon.map((c) => (
              <li key={c.name} className="sq flex items-start gap-3.5 rounded-[20px] border border-(--nv-line) bg-(--nv-fill-2) p-4">
                <span
                  className="sq flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-(--nv-solid) shadow-[0_0_0_0.5px_var(--nv-line)]"
                  style={{ color: c.color }}
                >
                  <HugeiconsIcon icon={c.icon} size={21} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold text-(--nv-text)">{c.name}</p>
                    <StatusPill tone="neutral">Em breve</StatusPill>
                  </div>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-(--nv-text-3)">{c.body}</p>
                </div>
              </li>
            ))}
            {!q && (
              <li className="sq flex items-center gap-3.5 rounded-[20px] border border-dashed border-(--nv-line-strong) p-4 sm:col-span-2">
                <span className="sq flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]">
                  <HugeiconsIcon icon={PlugSocketIcon} size={21} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-(--nv-text)">Mais conectores a caminho</p>
                  <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">
                    Estamos a juntar novas integrações. Aparecem aqui assim que ficarem prontas.
                  </p>
                </div>
              </li>
            )}
          </ul>
        </>
      )}

      {!showEmail && soon.length === 0 && (
        <p className="py-10 text-center text-[13.5px] text-(--nv-text-3)">Sem conectores para “{query.trim()}”.</p>
      )}

      <FormModal
        open={emailOpen}
        title={email ? "Alterar e-mail" : "Ligar e-mail"}
        subtitle="Para onde enviamos os avisos e resumos da Nuvi."
        submitLabel={email ? "Guardar" : "Ligar e-mail"}
        onClose={() => setEmailOpen(false)}
        fields={[
          {
            name: "address",
            label: "Endereço de e-mail",
            placeholder: "equipa@empresa.ao",
            type: "email",
            required: true,
            defaultValue: email?.address ?? settings.email,
          },
        ]}
        onSubmit={(v) => {
          const address = v.address.trim().toLowerCase();
          if (!/^\S+@\S+\.\S+$/.test(address)) return "Indica um e-mail válido.";
          updateSettings({ emailConnector: { address, connectedAt: new Date().toISOString() } });
          onSaved(email ? "E-mail atualizado" : "E-mail ligado");
          return true;
        }}
      />
    </>
  );
}

/* ================================================================
   PEÇAS PARTILHADAS
   ================================================================ */
function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[24px] leading-tight font-bold tracking-[-0.03em] text-(--nv-text)">{title}</h2>
        <p className="mt-1 text-[13.5px] text-(--nv-text-3)">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 px-1 text-[12.5px] font-semibold text-(--nv-text-3)">{children}</p>;
}

/** Bloco agrupado (estilo lista do iOS): título fora, linhas dentro de um cartão de vidro. */
function Group({
  title,
  subtitle,
  action,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      {(title || action) && (
        <div className="mb-2.5 flex items-end justify-between gap-3 px-1">
          <div>
            {title && <h3 className="text-[15px] font-bold tracking-[-0.015em] text-(--nv-text)">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="lg-surface sq divide-y divide-(--nv-line) overflow-hidden rounded-[22px]">{children}</div>
    </section>
  );
}

function Row({
  icon,
  title,
  body,
  control,
  muted,
}: {
  icon: Icon;
  title: string;
  body: string;
  control: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 sm:px-5">
      <IconTile icon={icon} muted={muted} />
      <div className="min-w-0 flex-1">
        <p className={`text-[14px] font-semibold transition-colors ${muted ? "text-(--nv-text-2)" : "text-(--nv-text)"}`}>{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-(--nv-text-3)">{body}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function IconTile({ icon, muted }: { icon: Icon; muted?: boolean }) {
  return (
    <span
      className={`sq flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] transition-colors ${
        muted ? "bg-(--nv-fill) text-(--nv-text-3)" : "bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]"
      }`}
    >
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.9} />
    </span>
  );
}

function IconAction({ label, icon, onClick }: { label: string; icon: Icon; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) transition-colors hover:bg-(--nv-fill) hover:text-[#FF3B30]"
    >
      <HugeiconsIcon icon={icon} size={15} strokeWidth={2} />
    </button>
  );
}

function Empty({ icon, title, body }: { icon: Icon; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-8 text-center">
      <IconTile icon={icon} muted />
      <p className="mt-2.5 text-[13.5px] font-semibold text-(--nv-text)">{title}</p>
      <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">{body}</p>
    </div>
  );
}

const PILL_TONES = {
  success: "bg-(--nv-success-soft) text-[#188038] dark:text-[#34C759]",
  accent: "bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]",
  warning: "bg-[#FF9F0A]/14 text-[#B25E00] dark:text-[#FFB340]",
  neutral: "bg-(--nv-fill) text-(--nv-text-3)",
} as const;

function StatusPill({ tone, children }: { tone: keyof typeof PILL_TONES; children: React.ReactNode }) {
  return (
    <span className={`sq inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap ${PILL_TONES[tone]}`}>
      {tone === "success" && <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />}
      {children}
    </span>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12.5px] font-semibold text-(--nv-text-2)">
        {label}
        {required && <span className="ml-0.5 text-[#FF3B30]">*</span>}
      </span>
      {children}
    </label>
  );
}

function Switch({ checked, label, onToggle }: { checked: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-[30px] w-[50px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-200 ${
        checked
          ? "bg-gradient-to-b from-[#4EA7EB] to-[#0076E8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"
          : "bg-(--nv-line-strong)"
      }`}
    >
      <span
        className={`h-6 w-6 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/** Barra flutuante que aparece quando há alterações por guardar. */
function SaveBar({ dirty, disabled, onDiscard }: { dirty: boolean; disabled?: boolean; onDiscard: () => void }) {
  if (!dirty) return null;
  return (
    <div
      role="region"
      aria-label="Alterações por guardar"
      className="nuvi-pop sq fixed bottom-24 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-[520px] -translate-x-1/2 items-center justify-between gap-3 rounded-full bg-(--nv-glass-strong) py-2 pr-2 pl-5 shadow-[inset_0_1px_0_var(--nv-glass-edge),0_0_0_0.5px_var(--nv-line),0_18px_40px_-14px_var(--nv-shadow)] backdrop-blur-2xl lg:bottom-6"
    >
      <p className="truncate text-[13.5px] font-semibold text-(--nv-text)">Alterações por guardar</p>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={onDiscard} className={`${ghostBtn} !h-10`}>
          Descartar
        </button>
        <button type="submit" disabled={disabled} className="nuvi-btn-sm sq !h-10 !px-5 !text-[13.5px]">
          Guardar
        </button>
      </div>
    </div>
  );
}

interface ModalField {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  options?: { value: string; label: string }[];
}

/**
 * Diálogo com formulário simples. `onSubmit` devolve true (fecha),
 * false (fica aberto) ou uma mensagem de erro.
 */
function FormModal(props: {
  open: boolean;
  title: string;
  subtitle: string;
  submitLabel: string;
  fields: ModalField[];
  footnote?: React.ReactNode;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => boolean | string;
}) {
  if (!props.open) return null;
  return <FormModalBody {...props} />;
}

function FormModalBody({
  title,
  subtitle,
  submitLabel,
  fields,
  footnote,
  onClose,
  onSubmit,
}: Parameters<typeof FormModal>[0]) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? f.options?.[0]?.value ?? ""]))
  );
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, panelRef);
  const canSubmit = fields.every((f) => !f.required || values[f.name]?.trim());

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-(--nv-scrim) backdrop-blur-[3px] sm:items-center sm:p-4"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="nuvi-step sq w-full max-w-[460px] rounded-t-[28px] bg-(--nv-glass-strong) p-6 shadow-[inset_0_1px_0_var(--nv-glass-edge),0_0_0_0.5px_var(--nv-line),0_30px_80px_-20px_var(--nv-shadow)] backdrop-blur-2xl sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="settings-modal-title" className="text-[20px] font-bold tracking-[-0.022em] text-(--nv-text)">
              {title}
            </h3>
            <p className="mt-0.5 text-[13px] text-(--nv-text-3)">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="lg-control flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--nv-text)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const r = onSubmit(values);
            if (r === true) onClose();
            else if (typeof r === "string") setError(r);
          }}
          className="mt-5 flex flex-col gap-4"
        >
          {fields.map((f) => (
            <Field key={f.name} label={f.label} required={f.required}>
              {f.options ? (
                <select
                  value={values[f.name]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className={`${inputCls} cursor-pointer`}
                >
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={values[f.name]}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.name]: e.target.value }));
                    setError(null);
                  }}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
            </Field>
          ))}
          {error && <p className="-mt-1 text-[12.5px] font-medium text-[#FF3B30]">{error}</p>}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12.5px] text-(--nv-text-3)">{footnote}</p>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={onClose} className={`${ghostBtn} !h-10 !px-5`}>
                Cancelar
              </button>
              <button type="submit" disabled={!canSubmit} className="nuvi-btn-sm sq !h-10 !px-5 !text-[13.5px]">
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
