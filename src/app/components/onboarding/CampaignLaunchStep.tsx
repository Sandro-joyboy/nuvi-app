"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  InstagramIcon,
  PencilEdit02Icon,
  Rocket01Icon,
  Tick02Icon,
  TiktokIcon,
} from "@hugeicons/core-free-icons";
import { PrimaryButton } from "@/app/components/auth/ui";
import {
  formatKwanzas,
  type CampaignDraft,
  type CampaignPlatform,
  type Goal,
} from "./campaign";
import { TOP_CREATORS } from "./creators";

const CREATOR_TYPE_LABEL: Record<Goal, string> = {
  anuncios: "UGC para Anúncios",
  organico: "Conteúdo Orgânico",
  influenciadores: "Influenciadores",
};

function buildDefaultBrief(draft: CampaignDraft, posts: number): string {
  const brand = draft.brandName.trim() || "A nossa marca";
  const regionText =
    draft.regions.length === 0 || draft.regions.includes("Todo o país")
      ? "em Angola"
      : `em ${draft.regions.join(", ")}`;
  const goalDesc =
    draft.goal === "anuncios"
      ? "vídeos autênticos pensados para anúncios pagos com foco em conversão"
      : draft.goal === "influenciadores"
        ? "publicações autênticas nas tuas redes para apresentar a marca ao teu público"
        : "vídeos orgânicos criativos para gerar alcance e descoberta no TikTok e no Instagram";
  return `${brand} procura criadores ${regionText} para produzir ${goalDesc}. O plano prevê ${posts} publicações por mês, com aprovação prévia de cada conteúdo antes do pagamento em Kwanzas.`;
}

function formatInvitedNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return `${names[0]} recebe o convite no instante em que lançares.`;
  if (names.length === 2) return `${names[0]} e ${names[1]} recebem o convite no instante em que lançares.`;
  if (names.length === 3) return `${names[0]}, ${names[1]} e ${names[2]} recebem o convite no instante em que lançares.`;
  const extra = names.length - 3;
  return `${names[0]}, ${names[1]}, ${names[2]} e mais ${extra} recebem o convite no instante em que lançares.`;
}

interface CampaignLaunchStepProps {
  draft: CampaignDraft;
  posts: number;
  spendKz: number;
  invitedIds: string[];
  onBack: () => void;
  onLaunch: (payload: {
    campaignTitle: string;
    campaignBrief: string;
    platforms: CampaignPlatform[];
  }) => void;
}

export default function CampaignLaunchStep({
  draft,
  posts,
  spendKz,
  invitedIds,
  onBack,
  onLaunch,
}: CampaignLaunchStepProps) {
  const brandName = draft.brandName.trim() || "Nuvi";
  const brandInitial = brandName.charAt(0).toUpperCase();
  const creatorType = CREATOR_TYPE_LABEL[draft.goal ?? "organico"];

  const [editing, setEditing] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [title, setTitle] = useState("Campanha de Criadores");
  const [brief, setBrief] = useState(() => buildDefaultBrief(draft, posts));
  const [platforms, setPlatforms] = useState<CampaignPlatform[]>(["tiktok", "instagram"]);

  const pickedCreators = TOP_CREATORS.filter((c) => invitedIds.includes(c.id));
  const visibleAvatars = pickedCreators.slice(0, 4);
  const extraCount = Math.max(0, pickedCreators.length - visibleAvatars.length);
  const firstNames = pickedCreators.map((c) => c.name.split(" ")[0]);

  const togglePlatform = (p: CampaignPlatform) => {
    setPlatforms((prev) => {
      if (prev.includes(p)) {
        return prev.length > 1 ? prev.filter((x) => x !== p) : prev;
      }
      return [...prev, p];
    });
  };

  const handleLaunch = () => {
    setLaunching(true);
    onLaunch({
      campaignTitle: title.trim() || "Campanha de Criadores",
      campaignBrief: brief.trim() || buildDefaultBrief(draft, posts),
      platforms,
    });
  };

  return (
    <div className="nuvi-ui relative flex min-h-dvh flex-col overflow-hidden bg-(--nv-panel) font-sans text-(--nv-text)">
      {/* Luz ambiente azul suave no centro e topo */}
      <div
        aria-hidden
        style={{ opacity: "var(--nv-ambient)" }}
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_50%_18%,rgba(78,167,235,0.22),transparent_68%),radial-gradient(45%_45%_at_82%_80%,rgba(78,167,235,0.16),transparent_70%),radial-gradient(35%_40%_at_18%_72%,rgba(175,82,222,0.08),transparent_70%)]"
      />

      {/* Barra superior discreta */}
      <header className="relative z-10 mx-auto flex w-full max-w-[960px] items-center justify-between px-4 pt-5 sm:px-6 sm:pt-6">
        <button
          type="button"
          onClick={onBack}
          className="lg-control inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-(--nv-text)"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2.2} />
          Criadores
        </button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center px-4 pt-4 pb-14 sm:pt-6">
        {/* Hero */}
        <div className="nuvi-step text-center">
          <h1 className="text-[30px] leading-[1.08] font-bold tracking-[-0.035em] text-balance sm:text-[38px]">
            <span className="block text-(--nv-text)">A tua próxima campanha</span>
            <span className="block bg-gradient-to-r from-[#4EA7EB] to-[#0076E8] bg-clip-text text-transparent">
              começa aqui.
            </span>
          </h1>
          <p className="mt-3 text-[14.5px] text-(--nv-text-2) sm:text-[15px]">
            {pickedCreators.length > 0
              ? `Lança a tua campanha e convida ${
                  pickedCreators.length === 1
                    ? "o criador que escolheste."
                    : `os ${pickedCreators.length} criadores que escolheste.`
                }`
              : "Revê o cartão da tua campanha e lança em segundos."}
          </p>
        </div>

        {/* Cartão prévia da campanha */}
        <section
          aria-label="Pré-visualização da campanha"
          className="nuvi-step sq relative mt-7 w-full max-w-[448px] overflow-hidden rounded-[28px] border border-(--nv-line) bg-(--nv-solid) shadow-[0_24px_60px_-24px_rgba(0,118,232,0.28),0_4px_16px_-6px_var(--nv-shadow)]"
        >
          {/* Banner azul celeste com curva suave na base */}
          <div className="relative h-[88px] overflow-hidden bg-gradient-to-b from-[#3393EE] via-[#4EA7EB] to-[#63B7F6]">
            {/* Nuvens / brilhos subtis */}
            <div aria-hidden className="pointer-events-none absolute -top-8 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full bg-white/20 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-[#0062CC]/25 blur-xl" />
            <div aria-hidden className="pointer-events-none absolute -top-6 right-8 h-24 w-24 rounded-full bg-white/25 blur-xl" />

            {/* Botão editar no canto superior direito */}
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-label={editing ? "Concluir edição" : "Editar detalhes da campanha"}
              aria-pressed={editing}
              className={`absolute top-3.5 right-3.5 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.14)] transition-transform duration-200 hover:scale-105 active:scale-95 ${
                editing ? "bg-[#34C759] text-white" : "bg-white/95 text-[#0A0A0A]"
              }`}
            >
              <HugeiconsIcon icon={editing ? Tick02Icon : PencilEdit02Icon} size={15} strokeWidth={2.2} />
            </button>

            {/* Arco convexo na transição para o corpo do cartão */}
            <svg
              aria-hidden
              viewBox="0 0 448 28"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 -bottom-px h-6 w-full"
            >
              <path d="M0 28 C120 2, 328 2, 448 28 L448 28 L0 28 Z" fill="var(--nv-solid)" />
            </svg>
          </div>

          {/* Conteúdo do cartão */}
          <div className="relative px-5 pb-6 sm:px-6">
            {/* Emblema circular da marca sobreposto ao arco */}
            <div className="-mt-11 flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3.5px] border-(--nv-solid) bg-gradient-to-b from-[#4EA7EB] to-[#0070E0] shadow-[0_10px_24px_-8px_rgba(0,118,232,0.58)]">
                <span className="font-title text-[26px] leading-none font-bold tracking-[-0.03em] text-white">
                  {brandInitial}
                </span>
              </div>
            </div>

            {/* Marca + Título */}
            <div className="mt-2.5 text-center">
              <p className="text-[13px] font-medium text-(--nv-text-3)">{brandName}</p>
              {editing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-label="Título da campanha"
                  className="sq mt-1.5 w-full rounded-[12px] border border-[#4EA7EB] bg-(--nv-panel) px-3 py-1.5 text-center text-[18px] font-bold tracking-[-0.02em] text-(--nv-text) outline-none"
                />
              ) : (
                <h2 className="mt-0.5 text-[20px] font-bold tracking-[-0.025em] text-(--nv-text)">
                  {title}
                </h2>
              )}
            </div>

            {/* Avatares dos criadores convidados */}
            {pickedCreators.length > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2.5">
                <div className="flex -space-x-2">
                  {visibleAvatars.map((c) => (
                    <span
                      key={c.id}
                      title={c.name}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--nv-solid) text-[10px] font-bold text-white shadow-xs"
                      style={{ background: c.avatarBg }}
                    >
                      {c.initials}
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--nv-solid) bg-(--nv-fill) text-[10px] font-bold text-(--nv-text-2)">
                      +{extraCount}
                    </span>
                  )}
                </div>
                <span className="text-[12.5px] font-semibold text-[#4EA7EB]">
                  {pickedCreators.length}{" "}
                  {pickedCreators.length === 1 ? "convidado ao lançar" : "convidados ao lançar"}
                </span>
              </div>
            )}

            {/* 2 cartões de resumo: Retainer / mês + Tipo de criador */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="sq rounded-[16px] border border-(--nv-line) bg-(--nv-panel)/60 px-3 py-3.5 text-center">
                <p className="font-title text-[17px] leading-tight font-bold tracking-[-0.025em] text-(--nv-text) tabular-nums sm:text-[19px]">
                  {formatKwanzas(spendKz)}
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.06em] text-(--nv-text-3) uppercase">
                  Valor / mês
                </p>
              </div>
              <div className="sq rounded-[16px] border border-(--nv-line) bg-(--nv-panel)/60 px-3 py-3.5 text-center">
                <p className="font-title truncate text-[15px] leading-tight font-bold tracking-[-0.02em] text-(--nv-text) sm:text-[17px]">
                  {creatorType}
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.06em] text-(--nv-text-3) uppercase">
                  Tipo de criador
                </p>
              </div>
            </div>

            {/* Pílulas de plataformas */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {(["tiktok", "instagram"] as const).map((plat) => {
                const active = platforms.includes(plat);
                if (!editing && !active) return null;
                const isIg = plat === "instagram";
                return (
                  <button
                    key={plat}
                    type="button"
                    disabled={!editing}
                    onClick={() => togglePlatform(plat)}
                    aria-pressed={active}
                    className={`sq inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                      active
                        ? "border-(--nv-line) bg-(--nv-solid) text-(--nv-text) shadow-[0_1px_4px_rgba(15,23,42,0.06)]"
                        : "border-dashed border-(--nv-line-strong) bg-transparent text-(--nv-text-3) opacity-60"
                    } ${editing ? "cursor-pointer hover:border-[#4EA7EB]" : "cursor-default"}`}
                  >
                    <span
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-[5px] text-white ${
                        isIg
                          ? "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
                          : "bg-[#111827] dark:bg-white/15"
                      }`}
                    >
                      <HugeiconsIcon icon={isIg ? InstagramIcon : TiktokIcon} size={11} strokeWidth={2.2} />
                    </span>
                    {isIg ? "Instagram" : "TikTok"}
                  </button>
                );
              })}
            </div>

            {/* Brief: "O que vais fazer:" */}
            <div className="mt-5 border-t border-(--nv-line) pt-4 text-left">
              <p className="text-[13px] font-bold text-(--nv-text)">O que vais fazer:</p>
              {editing ? (
                <textarea
                  rows={4}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  aria-label="Descrição da campanha"
                  className="sq mt-2 w-full resize-none rounded-[12px] border border-[#4EA7EB] bg-(--nv-panel) p-2.5 text-[13px] leading-relaxed text-(--nv-text) outline-none"
                />
              ) : (
                <p className="mt-1.5 text-[13px] leading-relaxed text-(--nv-text-2)">
                  {brief}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Botão principal: Lançar campanha */}
        <div className="nuvi-step mt-6 w-full max-w-[448px]">
          <PrimaryButton
            type="button"
            loading={launching}
            loadingText="A lançar campanha…"
            onClick={handleLaunch}
            className="!h-[52px] !text-[15.5px] !font-semibold"
          >
            <HugeiconsIcon icon={Rocket01Icon} size={18} strokeWidth={2.1} />
            Lançar campanha
          </PrimaryButton>

          <p className="mt-3 text-center text-[12.5px] text-(--nv-text-3)">
            {pickedCreators.length > 0
              ? formatInvitedNames(firstNames)
              : "Podes convidar criadores a qualquer momento a partir do painel."}
          </p>
        </div>
      </main>
    </div>
  );
}
