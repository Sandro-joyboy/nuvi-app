"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Building03Icon,
  Camera01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Copy01Icon,
  Delete02Icon,
  Globe02Icon,
  Mail01Icon,
  Notification02Icon,
  Shield01Icon,
  ShoppingBag01Icon,
  Tick02Icon,
  UserAdd01Icon,
  UserCheck01Icon,
  UserGroupIcon,
  Wallet02Icon,
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
import { Card } from "./ui";

type SectionId =
  | "perfil"
  | "notificacoes"
  | "empresa"
  | "lojas"
  | "verificacao"
  | "equipa"
  | "carteira";

const NAV_GROUPS: {
  group: string;
  items: { id: SectionId; label: string; icon: typeof UserCheck01Icon }[];
}[] = [
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
      { id: "lojas", label: "Lojas & E-com", icon: ShoppingBag01Icon },
      { id: "verificacao", label: "Verificação", icon: CheckmarkBadge01Icon },
      { id: "equipa", label: "Equipa", icon: UserGroupIcon },
    ],
  },
  {
    group: "Faturação",
    items: [{ id: "carteira", label: "Carteira & Plano", icon: Wallet02Icon }],
  },
];

const STAGES: { value: CompanyStage; label: string }[] = [
  { value: "", label: "Selecionar fase" },
  { value: "inicio", label: "A começar" },
  { value: "crescimento", label: "Em crescimento" },
  { value: "estabelecida", label: "Marca estabelecida" },
  { value: "agencia", label: "Agência" },
];

const NOTIFY_ITEMS: { key: keyof Omit<NotificationPrefs, "all">; title: string; body: string }[] = [
  { key: "messages", title: "Mensagens", body: "Quando um criador te envia uma mensagem." },
  { key: "applicants", title: "Candidaturas", body: "Quando um criador se candidata à tua campanha." },
  { key: "videoReview", title: "Vídeos para aprovar", body: "Aviso quando há uma nova entrega pronta para revisão." },
  { key: "payoutReceipts", title: "Recibos de pagamento", body: "Comprovativo sempre que um pagamento em Kwanzas é concluído." },
  { key: "pendingPayouts", title: "Pagamentos pendentes", body: "Lembrete diário quando existem valores por aprovar." },
  { key: "weeklySummary", title: "Resumo semanal", body: "Resumo das métricas e atividade da tua conta." },
];

const inputCls =
  "sq h-11 w-full rounded-[14px] border border-(--nv-line-strong) bg-(--nv-solid) px-3.5 text-[14.5px] text-(--nv-text) outline-none transition-shadow placeholder:text-(--nv-text-3) focus:border-[#4EA7EB] focus:shadow-[0_0_0_4px_rgba(78,167,235,0.14)]";

const MAX_IMG_BYTES = 2 * 1024 * 1024;
const fmtKz = (n: number) => `${n.toLocaleString("pt-PT")} Kz`;

export default function SettingsView() {
  const [section, setSection] = useState<SectionId>("perfil");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 2800);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5">
      {/* Navegação mobile (pílulas horizontais) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 lg:hidden" role="tablist" aria-label="Secções de definições">
        {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSection(item.id)}
              className={`sq inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]"
                  : "lg-control text-(--nv-text-2)"
              }`}
            >
              <HugeiconsIcon icon={item.icon} size={15} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Layout 2 colunas estilo Apple System Settings */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* Menu lateral em vidro */}
        <nav
          aria-label="Definições"
          className="lg-surface sq hidden flex-col gap-5 rounded-[26px] p-3.5 lg:sticky lg:top-4 lg:flex"
        >
          {NAV_GROUPS.map((g) => (
            <div key={g.group}>
              <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-(--nv-text-3) uppercase">
                {g.group}
              </p>
              <ul className="flex flex-col gap-0.5">
                {g.items.map((item) => {
                  const active = section === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-current={active ? "page" : undefined}
                        onClick={() => setSection(item.id)}
                        className={`sq flex w-full cursor-pointer items-center gap-2.5 rounded-[14px] px-3 py-2 text-left text-[13.5px] font-semibold transition-all ${
                          active
                            ? "bg-(--nv-accent-soft) text-[#0076E8] dark:text-[#60B5FF]"
                            : "text-(--nv-text-2) hover:bg-(--nv-fill) hover:text-(--nv-text)"
                        }`}
                      >
                        <HugeiconsIcon
                          icon={item.icon}
                          size={17}
                          strokeWidth={active ? 2.1 : 1.8}
                          className={active ? "text-[#4EA7EB]" : "text-(--nv-text-3)"}
                        />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Conteúdo da secção ativa */}
        <div className="min-w-0">
          {section === "perfil" && <ProfileSection onSaved={flash} />}
          {section === "notificacoes" && <NotificationsSection />}
          {section === "empresa" && <CompanySection onSaved={flash} />}
          {section === "lojas" && <StoresSection onSaved={flash} />}
          {section === "verificacao" && <VerificationSection onSaved={flash} />}
          {section === "equipa" && <TeamSection onSaved={flash} />}
          {section === "carteira" && <WalletPlanSection />}
        </div>
      </div>

      {/* Confirmação flutuante */}
      {toast && (
        <div
          role="status"
          className="nuvi-pop lg-surface sq fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-(--nv-text) shadow-[0_14px_34px_-12px_var(--nv-shadow)] lg:bottom-6"
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

  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState<string | null>(profile.photo);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [email, setEmail] = useState(settings.email);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Escolhe uma imagem PNG, JPG ou WebP.");
      return;
    }
    if (file.size > MAX_IMG_BYTES) {
      setPhotoError("Tamanho máximo: 2 MB.");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({ name: name.trim(), photo });
    updateSettings({ companyName: companyName.trim(), email: email.trim() });
    onSaved("Perfil guardado");
  };

  return (
    <form onSubmit={handleSave} className="nuvi-step flex flex-col gap-5">
      <Card>
        <SectionHeading
          title="Perfil"
          subtitle="O teu nome, foto e como os criadores te veem nas mensagens."
        />

        {/* Foto de perfil */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative h-16 w-16 shrink-0 cursor-pointer rounded-full"
            aria-label="Alterar foto de perfil"
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL local
              <img src={photo} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#5DB6F5] to-[#0076E8] text-[24px] font-bold text-white">
                {initialOf(name || companyName, "N")}
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
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="lg-control sq h-9 cursor-pointer rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
              >
                Mudar foto
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="cursor-pointer px-2 text-[12.5px] font-semibold text-[#FF3B30] hover:underline"
                >
                  Remover
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[12px] text-(--nv-text-3)">PNG ou JPG, máximo 2 MB.</p>
            {photoError && <p className="mt-1 text-[12px] font-medium text-[#FF3B30]">{photoError}</p>}
          </div>
        </div>

        {/* Campos */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="O teu nome" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Sandro Vieira"
              className={inputCls}
            />
          </FieldWrap>
          <FieldWrap label="Nome da empresa">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex.: Moco"
              className={inputCls}
            />
          </FieldWrap>
          <FieldWrap label="E-mail" className="sm:col-span-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@empresa.ao"
              className={inputCls}
            />
          </FieldWrap>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="nuvi-btn-sm sq !h-10 !px-6">
            Guardar alterações
          </button>
        </div>
      </Card>

      {/* Segurança */}
      <Card>
        <SectionHeading title="Segurança" subtitle="Acesso protegido por código de 6 dígitos no e-mail." />
        <div className="mt-5 divide-y divide-(--nv-line)">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div>
              <p className="text-[14px] font-semibold text-(--nv-text)">Início de sessão sem palavra-passe</p>
              <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">
                Enviamos um código único para o teu e-mail sempre que entras.
              </p>
            </div>
            <span className="sq inline-flex items-center gap-1.5 rounded-full bg-(--nv-success-soft) px-3 py-1 text-[12px] font-semibold text-[#188038] dark:text-[#34C759]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />
              Ativo
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <div>
              <p className="text-[14px] font-semibold text-(--nv-text)">Verificação adicional (2FA)</p>
              <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">
                Pedir confirmação extra ao aprovar pagamentos em Kwanzas.
              </p>
            </div>
            <AppleSwitch
              checked={settings.twoFactor}
              label="Ativar verificação adicional"
              onToggle={() => {
                updateSettings({ twoFactor: !settings.twoFactor });
                onSaved(!settings.twoFactor ? "Verificação adicional ativada" : "Verificação adicional desativada");
              }}
            />
          </div>
        </div>
      </Card>
    </form>
  );
}

/* ================================================================
   2. NOTIFICAÇÕES
   ================================================================ */
function NotificationsSection() {
  const settings = useWorkspaceSettings();
  const [scope, setScope] = useState<"empresa" | "conta">("empresa");
  const [channel, setChannel] = useState<NotifyChannel>("email");

  const current = settings.notifications[channel];

  const setPref = (patch: Partial<NotificationPrefs>) => {
    const nextChannel = { ...current, ...patch };
    saveSettings({
      ...settings,
      notifications: { ...settings.notifications, [channel]: nextChannel },
    });
  };

  const toggleAll = () => {
    const next = !current.all;
    setPref({
      all: next,
      messages: next,
      applicants: next,
      videoReview: next,
      payoutReceipts: next,
      pendingPayouts: next,
      weeklySummary: next,
    });
  };

  return (
    <Card className="nuvi-step">
      <SectionHeading title="Notificações" subtitle="Escolhe o que queres receber e por onde chega." />

      {/* Controlos segmentados Nuvi */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Âmbito" className="sq inline-flex rounded-full bg-(--nv-fill) p-[3px]">
          {(
            [
              ["empresa", "Empresa"],
              ["conta", "A minha conta"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={scope === id}
              onClick={() => setScope(id)}
              className={`h-8 cursor-pointer rounded-full px-3.5 text-[12.5px] font-semibold transition-all ${
                scope === id ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div role="tablist" aria-label="Canal" className="sq inline-flex rounded-full bg-(--nv-fill) p-[3px]">
          {(
            [
              ["email", "E-mail"],
              ["app", "Na app"],
              ["whatsapp", "WhatsApp / SMS"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={channel === id}
              onClick={() => setChannel(id)}
              className={`h-8 cursor-pointer rounded-full px-3.5 text-[12.5px] font-semibold transition-all ${
                channel === id ? "lg-control text-(--nv-text)" : "text-(--nv-text-3) hover:text-(--nv-text)"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Interruptor mestre */}
      <div className="sq mt-5 flex items-center justify-between gap-4 rounded-[18px] border border-(--nv-line) bg-(--nv-solid) px-4 py-3.5">
        <div>
          <p className="text-[14px] font-semibold text-(--nv-text)">
            Todos os avisos por {channel === "email" ? "e-mail" : channel === "app" ? "notificação" : "WhatsApp / SMS"}
          </p>
          <p className="text-[12px] text-(--nv-text-3)">Interruptor geral para as opções abaixo.</p>
        </div>
        <AppleSwitch checked={current.all} label="Ativar todos os avisos" onToggle={toggleAll} />
      </div>

      {/* Lista de notificações */}
      <div className="sq mt-3 divide-y divide-(--nv-line) rounded-[20px] border border-(--nv-line) bg-(--nv-solid) px-4">
        {NOTIFY_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-(--nv-text)">{item.title}</p>
              <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">{item.body}</p>
            </div>
            <AppleSwitch
              checked={current[item.key]}
              label={item.title}
              onToggle={() => {
                const nextVal = !current[item.key];
                setPref({ [item.key]: nextVal, all: nextVal ? current.all : false });
              }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ================================================================
   3. EMPRESA
   ================================================================ */
function CompanySection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const [form, setForm] = useState({
    companyName: settings.companyName,
    companyLogo: settings.companyLogo,
    companyStage: settings.companyStage,
    website: settings.website,
    phone: settings.phone,
    address: settings.address,
    instagram: settings.instagram,
    tiktok: settings.tiktok,
    linkedin: settings.linkedin,
    whatsapp: settings.whatsapp,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  const onLogo = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/") || file.size > MAX_IMG_BYTES) return;
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, companyLogo: typeof reader.result === "string" ? reader.result : null }));
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    onSaved("Dados da empresa guardados");
  };

  return (
    <form onSubmit={handleSave} className="nuvi-step flex flex-col gap-5">
      <Card>
        <SectionHeading title="Empresa" subtitle="Como a tua marca aparece para os criadores." />

        {/* Logótipo */}
        <div className="sq mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-(--nv-line) bg-(--nv-solid) p-4">
          <div className="flex items-center gap-3.5">
            {form.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL local
              <img src={form.companyLogo} alt="" className="h-12 w-12 rounded-[14px] object-cover" />
            ) : (
              <span className="sq flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#4EA7EB] to-[#0076E8] text-[18px] font-bold text-white">
                {initialOf(form.companyName, "N")}
              </span>
            )}
            <div>
              <p className="text-[14px] font-semibold text-(--nv-text)">Logótipo da marca</p>
              <p className="text-[12px] text-(--nv-text-3)">PNG, JPG ou SVG — até 2 MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="lg-control sq h-9 cursor-pointer rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
            >
              {form.companyLogo ? "Substituir" : "Carregar"}
            </button>
            {form.companyLogo && (
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, companyLogo: null }))}
                className="lg-control sq h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold text-[#FF3B30]"
              >
                Remover
              </button>
            )}
          </div>
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} />
        </div>

        {/* Detalhes da empresa */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Nome da empresa" required>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
              placeholder="Ex.: Moco"
              className={inputCls}
            />
          </FieldWrap>
          <FieldWrap label="Fase da empresa">
            <select
              value={form.companyStage}
              onChange={(e) => setForm((p) => ({ ...p, companyStage: e.target.value as CompanyStage }))}
              className={inputCls}
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FieldWrap>
          <FieldWrap label="Website">
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              placeholder="minhamarca.ao"
              className={inputCls}
            />
          </FieldWrap>
          <FieldWrap label="Telefone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+244 923 000 000"
              className={inputCls}
            />
          </FieldWrap>
          <FieldWrap label="Endereço" className="sm:col-span-2">
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              placeholder="Ex.: Talatona, Luanda"
              className={inputCls}
            />
          </FieldWrap>
        </div>

        {/* Redes sociais */}
        <div className="mt-7 border-t border-(--nv-line) pt-6">
          <h3 className="text-[15px] font-bold tracking-[-0.015em] text-(--nv-text)">Redes sociais</h3>
          <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">Onde os criadores encontram a tua marca.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldWrap label="Instagram">
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                placeholder="@minhamarca"
                className={inputCls}
              />
            </FieldWrap>
            <FieldWrap label="TikTok">
              <input
                type="text"
                value={form.tiktok}
                onChange={(e) => setForm((p) => ({ ...p, tiktok: e.target.value }))}
                placeholder="@minhamarca"
                className={inputCls}
              />
            </FieldWrap>
            <FieldWrap label="WhatsApp Business">
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="+244 923 000 000"
                className={inputCls}
              />
            </FieldWrap>
            <FieldWrap label="LinkedIn">
              <input
                type="text"
                value={form.linkedin}
                onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
                placeholder="company/minhamarca"
                className={inputCls}
              />
            </FieldWrap>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="nuvi-btn-sm sq !h-10 !px-6">
            Guardar alterações
          </button>
        </div>
      </Card>

      {/* Zona de perigo */}
      <Card className="!border !border-[#FF3B30]/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[14.5px] font-bold text-[#D70015] dark:text-[#FF6961]">Zona de perigo</p>
            <p className="mt-0.5 text-[12.5px] text-(--nv-text-3)">
              Remove permanentemente os dados locais deste espaço de trabalho.
            </p>
          </div>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="lg-control sq h-9 cursor-pointer rounded-full px-4 text-[13px] font-semibold text-(--nv-text)"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    window.localStorage.removeItem("nuvi-workspace-settings");
                  } catch {
                    /* ignora */
                  }
                  setConfirmDelete(false);
                  onSaved("Dados limpos");
                }}
                className="sq h-9 cursor-pointer rounded-full bg-[#FF3B30] px-4 text-[13px] font-semibold text-white"
              >
                Confirmar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="sq h-9 cursor-pointer rounded-full bg-[#FF3B30]/12 px-4 text-[13px] font-semibold text-[#D70015] transition-colors hover:bg-[#FF3B30]/20 dark:text-[#FF6961]"
            >
              Apagar espaço
            </button>
          )}
        </div>
      </Card>
    </form>
  );
}

/* ================================================================
   4. LOJAS & E-COM (Moco em Lojas apenas + Pixel Nuvi para Angola)
   ================================================================ */
function StoresSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const [mocoModal, setMocoModal] = useState(false);
  const [pixelModal, setPixelModal] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDomain, setStoreDomain] = useState("");
  const [pixelDomain, setPixelDomain] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addMocoStore = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = storeDomain.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (!domain) return;
    const name = storeName.trim() || domain.split(".")[0] || "Loja Moco";
    const next = [
      ...settings.mocoStores,
      { id: crypto.randomUUID(), name, domain, connectedAt: new Date().toISOString() },
    ];
    updateSettings({ mocoStores: next });
    setStoreName("");
    setStoreDomain("");
    setMocoModal(false);
    onSaved("Loja Moco ligada");
  };

  const removeMocoStore = (id: string) => {
    updateSettings({ mocoStores: settings.mocoStores.filter((s) => s.id !== id) });
    onSaved("Loja removida");
  };

  const addPixelSite = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = pixelDomain.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (!domain) return;
    const next = [
      ...settings.pixelSites,
      { id: crypto.randomUUID(), domain, connectedAt: new Date().toISOString() },
    ];
    updateSettings({ pixelSites: next });
    setPixelDomain("");
    setPixelModal(false);
    onSaved("Website adicionado");
  };

  const removePixelSite = (id: string) => {
    updateSettings({ pixelSites: settings.pixelSites.filter((s) => s.id !== id) });
    onSaved("Website removido");
  };

  const copySnippet = (id: string, domain: string) => {
    const snippet = `<script defer src="https://cdn.nuvi.ao/pixel.js" data-site="${domain}"></script>`;
    navigator.clipboard?.writeText(snippet).catch(() => {});
    setCopiedId(id);
    onSaved("Código do Pixel copiado");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="nuvi-step flex flex-col gap-5">
      {/* Lojas — apenas Moco */}
      <Card>
        <SectionHeading
          title="Lojas"
          subtitle="Liga a tua loja Moco gratuitamente. Sem planos pagos nem cartão internacional."
        />

        <div className="mt-5 flex flex-col gap-3">
          {/* Cartão Moco */}
          <div className="sq rounded-[22px] border border-(--nv-line) bg-(--nv-solid) p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3.5">
                {/* Ícone oficial Moco (montanha azul) */}
                <span className="sq flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-b from-[#2B7FFF] to-[#0055E6] shadow-[0_6px_16px_-6px_rgba(0,85,230,0.5)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 17.5L10.2 7.5L14.3 14L16.7 10.6L20.5 17.5H4Z" fill="#FFFFFF" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15.5px] font-bold text-(--nv-text)">Moco</h3>
                    <span className="sq rounded-full bg-(--nv-fill) px-2.5 py-0.5 text-[11px] font-semibold text-(--nv-text-3)">
                      {settings.mocoStores.length === 0
                        ? "Sem lojas"
                        : `${settings.mocoStores.length} ${settings.mocoStores.length === 1 ? "loja" : "lojas"}`}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-(--nv-text-3)">
                    Produtos, amostras para criadores e acompanhamento de vendas em Kwanzas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMocoModal(true)}
                className="nuvi-btn-sm sq !h-10 shrink-0 !px-5"
              >
                <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.4} />
                Ligar loja
              </button>
            </div>

            {settings.mocoStores.length > 0 && (
              <ul className="mt-4 divide-y divide-(--nv-line) border-t border-(--nv-line) pt-2">
                {settings.mocoStores.map((store) => (
                  <li key={store.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-(--nv-text)">{store.name}</p>
                      <p className="truncate text-[12px] text-(--nv-text-3)">{store.domain}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="sq inline-flex items-center gap-1 rounded-full bg-(--nv-success-soft) px-2.5 py-0.5 text-[11px] font-semibold text-[#188038] dark:text-[#34C759]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />
                        Ligada
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMocoStore(store.id)}
                        aria-label={`Remover ${store.name}`}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-[#FF3B30]"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pixel Nuvi — funciona com qualquer site em Angola */}
          <div className="sq rounded-[22px] border border-(--nv-line) bg-(--nv-solid) p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <SquircleTile size={48} colors={["var(--nv-accent-soft)", "var(--nv-accent-soft)"]} glass={false}>
                  <HugeiconsIcon icon={Globe02Icon} size={22} strokeWidth={1.9} className="text-[#4EA7EB]" />
                </SquircleTile>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15.5px] font-bold text-(--nv-text)">Nuvi Pixel</h3>
                    <span className="sq rounded-full bg-(--nv-fill) px-2.5 py-0.5 text-[11px] font-semibold text-(--nv-text-3)">
                      {settings.pixelSites.length === 0
                        ? "Sem websites"
                        : `${settings.pixelSites.length} ${settings.pixelSites.length === 1 ? "website" : "websites"}`}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-(--nv-text-3)">
                    Acompanhamento de visitas e vendas em qualquer website.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPixelModal(true)}
                className="lg-control sq inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-(--nv-text)"
              >
                <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.4} />
                Adicionar website
              </button>
            </div>

            {settings.pixelSites.length > 0 && (
              <ul className="mt-4 divide-y divide-(--nv-line) border-t border-(--nv-line) pt-2">
                {settings.pixelSites.map((site) => (
                  <li key={site.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                    <span className="truncate text-[13.5px] font-semibold text-(--nv-text)">{site.domain}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copySnippet(site.id, site.domain)}
                        className="lg-control sq inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold text-(--nv-text)"
                      >
                        <HugeiconsIcon icon={copiedId === site.id ? Tick02Icon : Copy01Icon} size={13} strokeWidth={2} />
                        {copiedId === site.id ? "Copiado" : "Copiar código"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePixelSite(site.id)}
                        aria-label={`Remover ${site.domain}`}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-[#FF3B30]"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      {/* Modal: Ligar loja Moco */}
      {mocoModal && (
        <SimpleModal title="Ligar loja Moco" subtitle="Liga a tua loja para acompanhar vendas e códigos de criadores." onClose={() => setMocoModal(false)}>
          <form onSubmit={addMocoStore} className="mt-5 flex flex-col gap-4">
            <FieldWrap label="Nome da loja">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ex.: Minha Loja"
                className={inputCls}
              />
            </FieldWrap>
            <FieldWrap label="Endereço da loja na Moco" required>
              <input
                type="text"
                required
                value={storeDomain}
                onChange={(e) => setStoreDomain(e.target.value)}
                placeholder="minhaloja.moco.ao"
                className={inputCls}
              />
            </FieldWrap>
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMocoModal(false)}
                className="lg-control sq h-10 cursor-pointer rounded-full px-5 text-[13.5px] font-semibold text-(--nv-text)"
              >
                Cancelar
              </button>
              <button type="submit" className="nuvi-btn-sm sq !h-10 !px-6">
                Ligar Moco
              </button>
            </div>
          </form>
        </SimpleModal>
      )}

      {/* Modal: Adicionar website Pixel */}
      {pixelModal && (
        <SimpleModal title="Adicionar website" subtitle="Gera o código Nuvi Pixel para medir visitas e conversões." onClose={() => setPixelModal(false)}>
          <form onSubmit={addPixelSite} className="mt-5 flex flex-col gap-4">
            <FieldWrap label="Domínio do website" required>
              <input
                type="text"
                required
                value={pixelDomain}
                onChange={(e) => setPixelDomain(e.target.value)}
                placeholder="minhamarca.ao"
                className={inputCls}
              />
            </FieldWrap>
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPixelModal(false)}
                className="lg-control sq h-10 cursor-pointer rounded-full px-5 text-[13.5px] font-semibold text-(--nv-text)"
              >
                Cancelar
              </button>
              <button type="submit" className="nuvi-btn-sm sq !h-10 !px-6">
                Adicionar
              </button>
            </div>
          </form>
        </SimpleModal>
      )}
    </div>
  );
}

/* ================================================================
   5. VERIFICAÇÃO (Angola — NIF opcional para selo verificado)
   ================================================================ */
function VerificationSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const [nif, setNif] = useState(settings.nif);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nif.trim()) return;
    updateSettings({ nif: nif.trim(), verificationSubmitted: true });
    onSaved("Pedido de verificação enviado");
  };

  return (
    <Card className="nuvi-step">
      <SectionHeading
        title="Verificação da marca"
        subtitle="Marcas verificadas recebem mais candidaturas e geram maior confiança junto dos criadores."
      />

      <div className="sq mt-5 flex items-start gap-3.5 rounded-[20px] border border-(--nv-line) bg-(--nv-solid) p-4">
        <SquircleTile
          size={44}
          colors={
            settings.verificationSubmitted
              ? ["var(--nv-success-soft)", "var(--nv-success-soft)"]
              : ["var(--nv-accent-soft)", "var(--nv-accent-soft)"]
          }
          glass={false}
        >
          <HugeiconsIcon
            icon={settings.verificationSubmitted ? CheckmarkBadge01Icon : Shield01Icon}
            size={21}
            strokeWidth={1.9}
            className={settings.verificationSubmitted ? "text-[#34C759]" : "text-[#4EA7EB]"}
          />
        </SquircleTile>
        <div>
          <p className="text-[14.5px] font-bold text-(--nv-text)">
            {settings.verificationSubmitted ? "Verificação em análise" : "Marca por verificar"}
          </p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-(--nv-text-3)">
            {settings.verificationSubmitted
              ? `Recebemos o NIF ${settings.nif}. Avisamos-te por e-mail assim que o selo ficar ativo.`
              : "Indica o NIF da tua empresa em Angola para receber o selo de marca verificada."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <FieldWrap label="NIF da empresa (Angola)" className="flex-1">
          <input
            type="text"
            value={nif}
            onChange={(e) => setNif(e.target.value)}
            placeholder="Ex.: 5417000000"
            className={inputCls}
          />
        </FieldWrap>
        <button type="submit" disabled={!nif.trim()} className="nuvi-btn-sm sq !h-11 shrink-0 !px-6">
          {settings.verificationSubmitted ? "Atualizar NIF" : "Pedir verificação"}
        </button>
      </form>
    </Card>
  );
}

/* ================================================================
   6. EQUIPA
   ================================================================ */
function TeamSection({ onSaved }: { onSaved: (msg: string) => void }) {
  const settings = useWorkspaceSettings();
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState<"admin" | "gestor">("gestor");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inviteEmail.trim().toLowerCase();
    if (!cleaned || !cleaned.includes("@")) return;
    if (settings.members.some((m) => m.email === cleaned)) return;
    updateSettings({
      members: [
        ...settings.members,
        { id: crypto.randomUUID(), email: cleaned, role, status: "convidado" },
      ],
    });
    setInviteEmail("");
    onSaved(`Convite preparado para ${cleaned}`);
  };

  const removeMember = (id: string) => {
    updateSettings({ members: settings.members.filter((m) => m.id !== id) });
    onSaved("Membro removido");
  };

  return (
    <Card className="nuvi-step">
      <SectionHeading
        title="Equipa"
        subtitle="Convida pessoas da tua empresa para aprovar vídeos e gerir campanhas."
      />

      <form onSubmit={handleInvite} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <label className="lg-control sq flex h-11 flex-1 items-center gap-2 rounded-full px-4">
          <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={2} className="shrink-0 text-(--nv-text-3)" />
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colega@empresa.ao"
            className="h-full w-full bg-transparent text-[14px] text-(--nv-text) outline-none placeholder:text-(--nv-text-3)"
          />
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "gestor")}
          aria-label="Função"
          className="sq h-11 cursor-pointer rounded-full border border-(--nv-line) bg-(--nv-solid) px-4 text-[13.5px] font-semibold text-(--nv-text) outline-none"
        >
          <option value="gestor">Gestor</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit" className="nuvi-btn-sm sq !h-11 shrink-0 !px-5">
          <HugeiconsIcon icon={UserAdd01Icon} size={16} strokeWidth={2.2} />
          Convidar
        </button>
      </form>

      {settings.members.length > 0 ? (
        <ul className="sq mt-5 divide-y divide-(--nv-line) rounded-[20px] border border-(--nv-line) bg-(--nv-solid) px-4">
          {settings.members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-(--nv-text)">{m.email}</p>
                <p className="text-[12px] text-(--nv-text-3)">
                  {m.role === "admin" ? "Administrador" : "Gestor"} · Convite pendente
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeMember(m.id)}
                aria-label={`Remover ${m.email}`}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-[#FF3B30]"
              >
                <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-[13px] text-(--nv-text-3)">
          Ainda és o único membro neste espaço de trabalho.
        </p>
      )}
    </Card>
  );
}

/* ================================================================
   7. CARTEIRA & PLANO (Kwanzas + Multicaixa Express / Referência)
   ================================================================ */
function WalletPlanSection() {
  const { balance, openWallet } = useDashboard();

  return (
    <div className="nuvi-step flex flex-col gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="sq inline-flex items-center rounded-full bg-(--nv-accent-soft) px-3 py-1 text-[11.5px] font-semibold text-[#0076E8] dark:text-[#60B5FF]">
              Plano atual · Gratuito
            </span>
            <h2 className="mt-3 text-[22px] font-bold tracking-[-0.025em] text-(--nv-text)">
              Sem mensalidade fixa
            </h2>
            <p className="mt-1 max-w-[440px] text-[13.5px] leading-relaxed text-(--nv-text-3)">
              Usa a Nuvi gratuitamente para lançar campanhas e encontrar criadores. Só pagas em Kwanzas pelos conteúdos que aprovares.
            </p>
          </div>
          <Link href="/painel/pagamentos" className="lg-control sq inline-flex h-10 items-center rounded-full px-4 text-[13px] font-semibold text-(--nv-text)">
            Ver pagamentos
          </Link>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-medium text-(--nv-text-3)">Saldo disponível em Kwanzas</p>
            <p className="font-title mt-1 text-[32px] leading-none font-bold tracking-[-0.035em] text-(--nv-text) tabular-nums">
              {fmtKz(balance)}
            </p>
            <p className="mt-2 text-[12.5px] text-(--nv-text-3)">
              Carregamento por <strong className="font-semibold text-(--nv-text-2)">Multicaixa Express</strong> ou{" "}
              <strong className="font-semibold text-(--nv-text-2)">Referência Bancária</strong>.
            </p>
          </div>
          <button type="button" onClick={openWallet} className="nuvi-btn-sm sq !h-11 !px-6">
            <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.4} />
            Carregar carteira
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ================================================================
   PEÇAS PARTILHADAS
   ================================================================ */
function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">{title}</h2>
      <p className="mt-1 text-[13.5px] text-(--nv-text-3)">{subtitle}</p>
    </div>
  );
}

function FieldWrap({
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
      <span className="mb-1.5 block text-[13px] font-semibold text-(--nv-text)">
        {label}
        {required && <span className="ml-0.5 text-[#FF3B30]">*</span>}
      </span>
      {children}
    </label>
  );
}

function AppleSwitch({ checked, label, onToggle }: { checked: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-10.5 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ${
        checked ? "bg-[#4EA7EB]" : "bg-(--nv-line-strong)"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.22)] transition-transform duration-200 ${
          checked ? "translate-x-4.5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SimpleModal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--nv-scrim) p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="nuvi-pop nuvi-modal-card sq !max-w-[440px] !items-stretch !rounded-[32px] !p-7 !text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[20px] font-bold tracking-[-0.022em] text-(--nv-text)">{title}</h3>
            <p className="mt-0.5 text-[13px] text-(--nv-text-3)">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--nv-text-3) hover:bg-(--nv-fill) hover:text-(--nv-text)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={17} strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
