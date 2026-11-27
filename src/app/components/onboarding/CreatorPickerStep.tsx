"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiCameraIcon,
  ArrowRight01Icon,
  Bookmark01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  CrownIcon,
  Dollar01Icon,
  Film01Icon,
  HeartAddIcon,
  InstagramIcon,
  Music01Icon,
  ShoppingBag01Icon,
  SmartPhone01Icon,
  SparklesIcon,
  Tick02Icon,
  TiktokIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { PrimaryButton } from "@/app/components/auth/ui";
import { TOP_CREATORS, type CreatorProfile, type NicheIconKey } from "./creators";

const NICHE_ICONS: Record<NicheIconKey, typeof Film01Icon> = {
  film: Film01Icon,
  money: Dollar01Icon,
  bag: ShoppingBag01Icon,
  phone: SmartPhone01Icon,
  heart: HeartAddIcon,
  camera: AiCameraIcon,
  music: Music01Icon,
  sparkles: SparklesIcon,
};

interface CreatorPickerStepProps {
  brandName: string;
  initialInvitedIds?: string[];
  onContinue: (invitedIds: string[]) => void;
}

export default function CreatorPickerStep({
  brandName,
  initialInvitedIds = [],
  onContinue,
}: CreatorPickerStepProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [invitedIds, setInvitedIds] = useState<string[]>(initialInvitedIds);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [completedDeck, setCompletedDeck] = useState(false);

  const creator = TOP_CREATORS[activeIndex];
  const isInvited = invitedIds.includes(creator.id);
  const isSaved = savedIds.includes(creator.id);

  const advance = (nextInvited: string[], nextSkipped: string[]) => {
    const handled = new Set([...nextInvited, ...nextSkipped]);
    const nextUnseen = TOP_CREATORS.findIndex((c, idx) => idx > activeIndex && !handled.has(c.id));
    if (nextUnseen !== -1) {
      setActiveIndex(nextUnseen);
      return;
    }
    const firstUnseen = TOP_CREATORS.findIndex((c) => !handled.has(c.id));
    if (firstUnseen !== -1) {
      setActiveIndex(firstUnseen);
      return;
    }
    setCompletedDeck(true);
  };

  const handleInvite = () => {
    const nextInvited = isInvited ? invitedIds : [...invitedIds, creator.id];
    const nextSkipped = skippedIds.filter((id) => id !== creator.id);
    setInvitedIds(nextInvited);
    setSkippedIds(nextSkipped);
    advance(nextInvited, nextSkipped);
  };

  const handleSkip = () => {
    const nextSkipped = skippedIds.includes(creator.id) ? skippedIds : [...skippedIds, creator.id];
    const nextInvited = invitedIds.filter((id) => id !== creator.id);
    setInvitedIds(nextInvited);
    setSkippedIds(nextSkipped);
    advance(nextInvited, nextSkipped);
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectCreator = (index: number) => {
    setCompletedDeck(false);
    setActiveIndex(index);
  };

  const remaining = TOP_CREATORS.length - new Set([...invitedIds, ...skippedIds]).size;

  return (
    <div className="nuvi-ui relative flex min-h-dvh flex-col bg-(--nv-panel) font-sans text-(--nv-text)">
      {/* Luz ambiente do design system */}
      <div
        aria-hidden
        style={{ opacity: "var(--nv-ambient)" }}
        className="pointer-events-none fixed inset-x-0 top-0 h-[560px] bg-[radial-gradient(55%_60%_at_20%_0%,rgba(78,167,235,0.2),transparent_70%),radial-gradient(40%_50%_at_85%_5%,rgba(175,82,222,0.1),transparent_70%)]"
      />

      {/* Topo discreto */}
      <header className="relative z-10 mx-auto flex w-full max-w-[960px] items-center justify-end px-4 pt-5 sm:px-6 sm:pt-6">
        <button
          type="button"
          onClick={() => onContinue(invitedIds)}
          className="lg-control inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold text-(--nv-text)"
        >
          {invitedIds.length > 0 ? "Continuar para lançar" : "Saltar por agora"}
        </button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[960px] flex-1 flex-col items-center px-4 pt-4 pb-16 sm:px-6 sm:pt-6">
        {/* Cabeçalho centralizado */}
        <div className="nuvi-step max-w-[600px] text-center">
          <h1 className="text-[26px] leading-[1.15] font-bold tracking-[-0.03em] text-balance sm:text-[34px]">
            Estás quase lá. Escolhemos os 8 melhores criadores para bater a tua meta.
          </h1>
          <p className="mt-2.5 text-[14.5px] text-(--nv-text-2) sm:text-[15px]">
            Marca os que gostares e envia mensagem a todos num toque.
          </p>
        </div>

        {/* Fila dos 8 avatares (bench) */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" role="tablist" aria-label="8 criadores sugeridos">
            {TOP_CREATORS.map((c, idx) => {
              const active = !completedDeck && idx === activeIndex;
              const picked = invitedIds.includes(c.id);
              const skipped = skippedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${c.name}${picked ? " (convidado)" : skipped ? " (ignorado)" : ""}`}
                  onClick={() => selectCreator(idx)}
                  className={`relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[13px] font-bold text-white transition-all duration-200 sm:h-12 sm:w-12 ${
                    active
                      ? "scale-110 ring-2 ring-[#4EA7EB] ring-offset-2 ring-offset-(--nv-panel) shadow-[0_8px_20px_-6px_rgba(78,167,235,0.6)]"
                      : picked
                        ? "ring-2 ring-[#34C759]/80 ring-offset-2 ring-offset-(--nv-panel)"
                        : skipped
                          ? "opacity-40 grayscale hover:opacity-75"
                          : "opacity-75 hover:scale-105 hover:opacity-100"
                  }`}
                  style={{ background: c.avatarBg }}
                >
                  {c.initials}
                  {picked && (
                    <span className="absolute -right-0.5 -bottom-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-(--nv-panel) bg-[#34C759] text-white">
                      <HugeiconsIcon icon={Tick02Icon} size={10} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-[12.5px] font-medium text-(--nv-text-3)">
            {invitedIds.length === 0
              ? "A tua seleção preenche-se à medida que escolhes."
              : `${invitedIds.length} ${invitedIds.length === 1 ? "criador selecionado" : "criadores selecionados"} para ${brandName || "a tua marca"}`}
          </p>
        </div>

        {/* Baralho empilhado ou resumo final */}
        {completedDeck ? (
          <CompletedBench
            invitedIds={invitedIds}
            brandName={brandName}
            onSelectCreator={selectCreator}
            onContinue={() => onContinue(invitedIds)}
          />
        ) : (
          <div className="relative mt-8 w-full max-w-[920px] pt-4">
            {/* Cartões empilhados atrás (profundidade visual) */}
            {remaining > 2 && (
              <div
                aria-hidden
                className="lg-surface sq pointer-events-none absolute inset-x-6 top-0 h-20 origin-bottom-left -rotate-[1.8deg] rounded-[26px] opacity-60"
              />
            )}
            {remaining > 1 && (
              <div
                aria-hidden
                className="lg-surface sq pointer-events-none absolute inset-x-3 top-2 h-20 origin-bottom-left -rotate-[0.9deg] rounded-[26px] opacity-80"
              />
            )}

            {/* Cartão principal do criador */}
            <CreatorCard
              key={creator.id}
              creator={creator}
              isInvited={isInvited}
              isSaved={isSaved}
              onToggleSave={() => toggleSave(creator.id)}
              onInvite={handleInvite}
              onSkip={handleSkip}
            />
          </div>
        )}

        {/* Barra de ação rápida quando já há criadores convidados */}
        {!completedDeck && invitedIds.length > 0 && (
          <div className="nuvi-step mt-6 flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton type="button" onClick={() => onContinue(invitedIds)} className="!w-auto !px-7">
              Continuar com {invitedIds.length} {invitedIds.length === 1 ? "criador" : "criadores"}
              <HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={2.2} />
            </PrimaryButton>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------- Cartão principal do criador ---------------- */

function CreatorCard({
  creator,
  isInvited,
  isSaved,
  onToggleSave,
  onInvite,
  onSkip,
}: {
  creator: CreatorProfile;
  isInvited: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
  onInvite: () => void;
  onSkip: () => void;
}) {
  const maxAge = Math.max(...creator.ages.map((a) => a.pct), 1);

  return (
    <article className="nuvi-step lg-surface sq relative z-10 grid grid-cols-1 gap-6 rounded-[26px] p-4 sm:p-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]">
      {/* Coluna esquerda: Reels + estatísticas + perfil + convidar */}
      <div className="flex flex-col">
        {/* Tira de 3 vídeos/reels */}
        <div className="relative">
          <div className="sq grid h-[238px] grid-cols-3 gap-1.5 overflow-hidden rounded-[20px] sm:h-[268px]">
            {creator.reels.map((reel, i) => (
              <div
                key={reel.caption}
                className="relative flex flex-col justify-between overflow-hidden p-2.5 text-white"
                style={{ background: reel.gradient }}
              >
                {/* Brilho editorial subtil */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-35 blur-2xl"
                  style={{ background: reel.accent }}
                />

                <div className="relative z-10 flex items-center justify-between gap-1">
                  {i === 1 ? (
                    <button
                      type="button"
                      onClick={onToggleSave}
                      aria-pressed={isSaved}
                      className={`inline-flex cursor-pointer items-center gap-1 rounded-[9px] px-2 py-1 text-[11px] font-semibold backdrop-blur-md transition-colors ${
                        isSaved ? "bg-[#4EA7EB] text-white" : "bg-black/45 text-white/95 hover:bg-black/65"
                      }`}
                    >
                      <HugeiconsIcon icon={Bookmark01Icon} size={12} strokeWidth={2.2} />
                      {isSaved ? "Guardado" : "Guardar"}
                    </button>
                  ) : (
                    <span className="rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm">
                      {reel.tag}
                    </span>
                  )}
                </div>

                {/* Centro editorial */}
                <div className="relative z-10 my-auto text-center">
                  <p className="text-[12px] leading-snug font-bold tracking-[-0.01em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] sm:text-[13px]">
                    {reel.caption}
                  </p>
                </div>

                {/* Rodapé com visualizações */}
                <div className="relative z-10 pb-5 text-[10.5px] font-semibold text-white/85 tabular-nums">
                  ▶ {reel.views}
                </div>
              </div>
            ))}
          </div>

          {/* Barra flutuante: Avatar + redes + Views / Eng. / CPM */}
          <div className="relative z-20 -mt-9 flex items-end gap-2.5 px-2.5 sm:px-3">
            {/* Avatar com mini ícones de redes */}
            <div className="relative shrink-0">
              <div
                className="flex h-13 w-13 items-center justify-center rounded-full border-[3px] border-(--nv-solid) text-[16px] font-bold text-white shadow-[0_6px_16px_-4px_var(--nv-shadow)] sm:h-14 sm:w-14"
                style={{ background: creator.avatarBg }}
              >
                {creator.initials}
              </div>
              <div className="absolute -right-1 -bottom-1 flex -space-x-1">
                {creator.platforms.includes("instagram") && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-(--nv-solid) bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                    <HugeiconsIcon icon={InstagramIcon} size={10} strokeWidth={2.2} />
                  </span>
                )}
                {creator.platforms.includes("tiktok") && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-(--nv-solid) bg-[#111827] text-white">
                    <HugeiconsIcon icon={TiktokIcon} size={10} strokeWidth={2.2} />
                  </span>
                )}
                {creator.platforms.includes("youtube") && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-(--nv-solid) bg-[#FF0000] text-white">
                    <HugeiconsIcon icon={YoutubeIcon} size={10} strokeWidth={2.2} />
                  </span>
                )}
              </div>
            </div>

            {/* Cartão branco/sólido de KPIs */}
            <div className="sq grid flex-1 grid-cols-3 divide-x divide-(--nv-line) rounded-[16px] border border-(--nv-line) bg-(--nv-solid) px-2 py-2.5 text-center shadow-[0_10px_28px_-12px_var(--nv-shadow)]">
              <div className="px-1">
                <p className="text-[10.5px] font-medium text-(--nv-text-3)">Views</p>
                <p className="font-title mt-0.5 text-[14px] font-bold text-(--nv-text) tabular-nums sm:text-[15px]">
                  {creator.views}
                </p>
              </div>
              <div className="px-1">
                <p className="text-[10.5px] font-medium text-(--nv-text-3)">Eng.</p>
                <p className="font-title mt-0.5 text-[14px] font-bold text-(--nv-text) tabular-nums sm:text-[15px]">
                  {creator.engagement}
                </p>
              </div>
              <div className="px-1">
                <p className="text-[10.5px] font-medium text-(--nv-text-3)">CPM</p>
                <p className="font-title mt-0.5 truncate text-[13px] font-bold text-(--nv-text) tabular-nums sm:text-[14px]">
                  {creator.cpm}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nome, selos, localização e nichos */}
        <div className="mt-4 px-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[17px] font-bold tracking-[-0.02em] text-(--nv-text)">{creator.name}</h2>
            {creator.topCreator && (
              <span title="Top criador Nuvi" className="text-[#4EA7EB]">
                <HugeiconsIcon icon={CrownIcon} size={16} strokeWidth={2.2} />
              </span>
            )}
            {creator.verified && (
              <span title="Perfil verificado" className="text-[#34C759]">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} strokeWidth={2.2} />
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[13px] text-(--nv-text-3)">
            <span className="mr-1.5">{creator.flag}</span>
            {creator.location}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {creator.niches.map((niche) => (
              <span
                key={niche.label}
                className="sq inline-flex items-center gap-1.5 rounded-full border border-(--nv-line) bg-(--nv-fill-2) px-3 py-1 text-[12px] font-medium text-(--nv-text-2)"
              >
                <HugeiconsIcon icon={NICHE_ICONS[niche.icon]} size={13} strokeWidth={2} className="text-(--nv-text-3)" />
                {niche.label}
              </span>
            ))}
          </div>
        </div>

        {/* Ações: Convidar + Passar */}
        <div className="mt-auto flex items-center gap-2.5 pt-5">
          <button
            type="button"
            onClick={onInvite}
            className={`sq flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[16px] text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.98] ${
              isInvited
                ? "bg-[#34C759] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_24px_-10px_rgba(52,199,89,0.55)]"
                : "border border-white/30 bg-gradient-to-b from-[#55B0F4] to-[#2684E6] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_10px_24px_-10px_rgba(0,118,232,0.55)] hover:brightness-105"
            }`}
          >
            {isInvited ? (
              <>
                <HugeiconsIcon icon={Tick02Icon} size={17} strokeWidth={2.8} />
                Convidado
              </>
            ) : (
              "Convidar"
            )}
          </button>

          <button
            type="button"
            onClick={onSkip}
            aria-label={`Passar ${creator.name}`}
            className="lg-control sq flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-[16px] text-(--nv-text-2) hover:text-(--nv-text)"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Coluna direita: Experiências + Público */}
      <div className="flex flex-col gap-5">
        {/* Experiências */}
        <section>
          <div className="mb-2.5 flex items-baseline gap-2">
            <h3 className="text-[13.5px] font-semibold text-(--nv-text)">Experiências</h3>
            {creator.moreExperiences > 0 && (
              <span className="text-[12px] font-medium text-(--nv-text-3)">+{creator.moreExperiences} mais</span>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {creator.experiences.map((exp) => (
              <div
                key={exp.brand}
                className="sq flex items-center gap-3.5 rounded-[18px] border border-(--nv-line) bg-(--nv-solid) px-4 py-3 shadow-[0_2px_10px_-6px_var(--nv-shadow)]"
              >
                <span
                  className="sq flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-[13px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                  style={{ background: exp.bg }}
                >
                  {exp.monogram}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-semibold text-(--nv-text)">{exp.brand}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[12.5px] font-semibold text-(--nv-text-2) tabular-nums">
                    {exp.instagram && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-[6px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                          <HugeiconsIcon icon={InstagramIcon} size={11} strokeWidth={2.2} />
                        </span>
                        {exp.instagram}
                      </span>
                    )}
                    {exp.tiktok && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-[6px] bg-[#111827] text-white dark:bg-white/15">
                          <HugeiconsIcon icon={TiktokIcon} size={11} strokeWidth={2.2} />
                        </span>
                        {exp.tiktok}
                      </span>
                    )}
                    {exp.platformOnly && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-(--nv-text-3)">
                        <span
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded-[6px] text-white ${
                            exp.platformOnly === "Instagram"
                              ? "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
                              : "bg-[#111827] dark:bg-white/15"
                          }`}
                        >
                          <HugeiconsIcon
                            icon={exp.platformOnly === "Instagram" ? InstagramIcon : TiktokIcon}
                            size={11}
                            strokeWidth={2.2}
                          />
                        </span>
                        {exp.platformOnly}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Público */}
        <section className="flex flex-1 flex-col">
          <div className="mb-2.5 flex items-baseline gap-2">
            <h3 className="text-[13.5px] font-semibold text-(--nv-text)">Público</h3>
            <span className="text-[12px] font-medium text-(--nv-text-3)">{creator.audienceSource}</span>
          </div>

          <div className="sq grid flex-1 grid-cols-1 gap-5 rounded-[18px] border border-(--nv-line) bg-(--nv-solid) p-4 shadow-[0_2px_10px_-6px_var(--nv-shadow)] sm:grid-cols-[1.18fr_1fr]">
            {/* Idade — gráfico de barras */}
            <div className="flex flex-col">
              <p className="text-[12px] font-medium text-(--nv-text-3)">Idade</p>
              <div className="mt-3 flex flex-1 items-end gap-1.5 pt-4">
                {creator.ages.map((a) => {
                  const barHeight = Math.max(4, Math.round((a.pct / maxAge) * 108));
                  return (
                    <div key={a.label} className="flex min-w-0 flex-1 flex-col items-center">
                      <span className="mb-1 text-[10px] font-semibold text-(--nv-text-2) tabular-nums">
                        {a.pct}%
                      </span>
                      <div
                        className="w-full rounded-t-[6px] bg-gradient-to-b from-[#55B0F4] to-[#2684E6] transition-[height] duration-300"
                        style={{ height: `${barHeight}px` }}
                      />
                      <span className="mt-1.5 text-[9.5px] font-medium text-(--nv-text-3) tabular-nums">
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Género + País */}
            <div className="flex flex-col justify-between gap-4 border-t border-(--nv-line) pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
              {/* Género */}
              <div>
                <p className="text-[12px] font-medium text-(--nv-text-3)">Género</p>
                <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-(--nv-fill)">
                  <span style={{ width: `${creator.gender.female}%` }} className="bg-[#4EA7EB]" />
                  <span style={{ width: `${creator.gender.male}%` }} className="bg-[#34C759]" />
                  <span style={{ width: `${creator.gender.unknown}%` }} className="bg-[#FF5A5F]" />
                </div>
                <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-(--nv-text-3) tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4EA7EB]" />
                    Mulheres <strong className="font-semibold text-(--nv-text)">{creator.gender.female}%</strong>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />
                    Homens <strong className="font-semibold text-(--nv-text)">{creator.gender.male}%</strong>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A5F]" />
                    Outro <strong className="font-semibold text-(--nv-text)">{creator.gender.unknown}%</strong>
                  </span>
                </div>
              </div>

              {/* País */}
              <div>
                <p className="text-[12px] font-medium text-(--nv-text-3)">País</p>
                <div className="mt-2 flex flex-col gap-2">
                  {creator.countries.map((country) => (
                    <div key={country.code} className="flex items-center gap-2 text-[11.5px]">
                      <span className="w-11 shrink-0 font-semibold text-(--nv-text-2)">
                        {country.flag} {country.code}
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--nv-fill)">
                        <span
                          className="block h-full rounded-full bg-[#4EA7EB] transition-[width] duration-300"
                          style={{ width: `${country.pct}%` }}
                        />
                      </span>
                      <span className="w-8 shrink-0 text-right font-semibold text-(--nv-text) tabular-nums">
                        {country.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

/* ---------------- Estado final após rever os 8 criadores ---------------- */

function CompletedBench({
  invitedIds,
  brandName,
  onSelectCreator,
  onContinue,
}: {
  invitedIds: string[];
  brandName: string;
  onSelectCreator: (index: number) => void;
  onContinue: () => void;
}) {
  const picked = TOP_CREATORS.filter((c) => invitedIds.includes(c.id));

  return (
    <section className="nuvi-step lg-surface sq mt-8 flex w-full max-w-[600px] flex-col items-center rounded-[26px] p-7 text-center sm:p-9">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--nv-accent-soft) text-[#4EA7EB]">
        <HugeiconsIcon icon={Tick02Icon} size={24} strokeWidth={2.4} />
      </div>
      <h2 className="mt-4 text-[22px] font-bold tracking-[-0.025em] text-(--nv-text)">
        {picked.length > 0
          ? `${picked.length} ${picked.length === 1 ? "criador pronto" : "criadores prontos"} para ${brandName || "a tua campanha"}`
          : "Reviste os 8 criadores sugeridos"}
      </h2>
      <p className="mt-1.5 text-[14.5px] text-(--nv-text-2)">
        {picked.length > 0
          ? "Tudo pronto para rever e lançar a tua campanha. Toca em qualquer avatar acima se quiseres ajustar."
          : "Podes tocar em qualquer avatar acima para convidar, ou avançar já para lançar a campanha."}
      </p>

      {picked.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {picked.map((c) => {
            const idx = TOP_CREATORS.findIndex((x) => x.id === c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCreator(idx)}
                className="sq inline-flex cursor-pointer items-center gap-2 rounded-full border border-(--nv-line) bg-(--nv-solid) py-1 pr-3 pl-1.5 text-[13px] font-semibold text-(--nv-text) transition-colors hover:border-[#4EA7EB]"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: c.avatarBg }}
                >
                  {c.initials}
                </span>
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-7 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
        <PrimaryButton type="button" onClick={onContinue} className="sm:!w-auto sm:!px-8">
          {picked.length > 0
            ? `Rever e lançar campanha (${picked.length})`
            : "Avançar para lançar"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={2.2} />
        </PrimaryButton>
      </div>
    </section>
  );
}
