"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Building03Icon,
  CameraVideoIcon,
  Cancel01Icon,
  Edit02Icon,
  EyeIcon,
  InstagramIcon,
  Link01Icon,
  Location01Icon,
  Search01Icon,
  Tick02Icon,
  TiktokIcon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Field, PrimaryButton, secondaryBtn } from "@/app/components/auth/ui";
import {
  BUDGET_META,
  computePlanProjection,
  createCampaign,
  formatCompactNumber,
  formatKwanzas,
  getPresetPostsForBudget,
  getSliderBounds,
  loadDraft,
  saveDraft,
  saveInvitedCreators,
  useHydrated,
  type Budget,
  type CampaignDraft,
  type Experience,
  type Goal,
} from "./campaign";
import CreatorPickerStep from "./CreatorPickerStep";

type Icon = typeof InstagramIcon;

const STEPS = [
  "Objetivo",
  "Experiência",
  "Público",
  "Marca",
  "Origem",
  "Orçamento",
  "Plano",
  "Rever",
] as const;

const GOALS: { id: Goal; title: string; body: string; image: string }[] = [
  { id: "anuncios", title: "Criativos para anúncios", body: "Vídeos feitos para correr como anúncios pagos.", image: "/icons/video.svg" },
  { id: "organico", title: "Conteúdo orgânico", body: "Publicações que geram alcance no TikTok e no Instagram.", image: "/icons/graph.svg" },
  { id: "influenciadores", title: "Publicações de influenciadores", body: "Criadores publicam nas próprias contas.", image: "/icons/profile.svg" },
];

const EXPERIENCE: { id: Experience; title: string; body: string; image: string }[] = [
  { id: "primeira", title: "É a primeira vez", body: "Guiamos-te em cada passo.", image: "/icons/discovery.svg" },
  { id: "algumas", title: "Já fiz algumas campanhas", body: "Conheço o básico.", image: "/icons/tick.svg" },
  { id: "regular", title: "Trabalho com criadores regularmente", body: "Quero escalar e poupar tempo.", image: "/icons/clock.svg" },
];

const AGES = ["18–24", "25–34", "35–44", "45+"];
const GENDERS = [
  { id: "todos", label: "Todos" },
  { id: "mulheres", label: "Mulheres" },
  { id: "homens", label: "Homens" },
] as const;
const REGIONS = ["Todo o país", "Luanda", "Benguela", "Huíla", "Huambo", "Cabinda"];

const SOURCES: { id: string; label: string; icon: Icon }[] = [
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "tiktok", label: "TikTok", icon: TiktokIcon },
  { id: "recomendacao", label: "Recomendação", icon: UserGroupIcon },
  { id: "google", label: "Pesquisa no Google", icon: Search01Icon },
  { id: "evento", label: "Evento", icon: Location01Icon },
  { id: "outro", label: "Outro", icon: Edit02Icon },
];

const BUDGETS: { id: Budget; title: string; body: string; image: string }[] = [
  { id: "ate-100", title: "Até 100 000 Kz", body: "Ideal para testar com poucos criadores.", image: "/icons/wallet.svg" },
  { id: "100-500", title: "100 000 – 500 000 Kz", body: "Várias peças e criadores por mês.", image: "/icons/buy.svg" },
  { id: "500-mais", title: "Mais de 500 000 Kz", body: "Campanhas contínuas e em escala.", image: "/icons/bag.svg" },
  { id: "nao-sei", title: "Ainda não sei", body: "Ajudamos-te a definir.", image: "/icons/info.svg" },
];

const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

/* ---------------- Ecrã ---------------- */

export default function CampaignOnboarding() {
  const hydrated = useHydrated();
  // Só monta no browser: o rascunho vem do localStorage.
  return hydrated ? <Wizard /> : <div className="nuvi-ui min-h-dvh bg-(--nv-panel)" />;
}

function Wizard() {
  const router = useRouter();
  const [d, setD] = useState<CampaignDraft>(() => loadDraft());
  const [touched, setTouched] = useState(false);
  const [showCreators, setShowCreators] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const step = Math.min(Math.max(0, d.step), STEPS.length - 1);

  useEffect(() => {
    if (!showCreators) saveDraft(d);
  }, [d, showCreators]);

  // Foco no título ao mudar de passo (leitores de ecrã anunciam a mudança).
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const set = <K extends keyof CampaignDraft>(k: K, v: CampaignDraft[K]) => setD((p) => ({ ...p, [k]: v }));
  const toggle = (k: "ages" | "regions", v: string) =>
    setD((p) => {
      let list = p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v];
      // "Todo o país" é exclusivo das regiões específicas
      if (k === "regions") list = v === "Todo o país" ? (list.includes(v) ? [v] : []) : list.filter((x) => x !== "Todo o país");
      return { ...p, [k]: list };
    });

  // Projeção do plano baseada no orçamento escolhido
  const budgetKey: Budget = d.budget ?? "nao-sei";
  const budgetMeta = BUDGET_META[budgetKey];
  const presetPosts = getPresetPostsForBudget(budgetKey);
  const sliderBounds = getSliderBounds(presetPosts);
  const activePosts = d.plannedPosts ?? presetPosts;
  const plan = computePlanProjection(activePosts);
  const withinBudget = budgetMeta.maxKz === null || plan.spendKz <= budgetMeta.maxKz;
  const isPreset = activePosts === presetPosts;

  const selectBudget = (b: Budget) => {
    setD((p) => ({ ...p, budget: b, plannedPosts: null }));
  };

  const websiteError = d.website.trim() && !URL_RE.test(d.website.trim()) ? "Escreve um endereço válido, ex.: minhamarca.ao" : null;
  const valid = [
    !!d.goal,
    !!d.experience,
    d.ages.length > 0 && d.regions.length > 0,
    d.brandName.trim().length > 1 && !websiteError,
    !!d.source,
    !!d.budget,
    true,
    true,
  ][step];

  const goStep = (n: number) => {
    setTouched(false);
    setD((p) => ({ ...p, step: n }));
  };

  const next = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!valid) {
      setTouched(true);
      return;
    }
    if (step === STEPS.length - 1) {
      createCampaign({ ...d, plannedPosts: activePosts });
      setShowCreators(true);
      return;
    }
    goStep(step + 1);
  };

  if (showCreators) {
    return (
      <CreatorPickerStep
        brandName={d.brandName.trim()}
        onFinish={(invitedIds) => {
          if (invitedIds.length > 0) saveInvitedCreators(invitedIds);
          router.push("/painel");
        }}
      />
    );
  }

  const wideStep = step === 6;
  const containerWidth = wideStep ? "max-w-[720px]" : "max-w-[560px]";

  return (
    <div className="nuvi-ui relative flex min-h-dvh flex-col bg-(--nv-panel) font-sans text-(--nv-text)">
      <div
        aria-hidden
        style={{ opacity: "var(--nv-ambient)" }}
        className="pointer-events-none fixed inset-x-0 top-0 h-[520px] bg-[radial-gradient(55%_60%_at_20%_0%,rgba(78,167,235,0.2),transparent_70%),radial-gradient(40%_50%_at_85%_5%,rgba(175,82,222,0.1),transparent_70%)]"
      />

      {/* Topo: progresso · guardar e sair */}
      <header className={`relative z-10 mx-auto flex w-full ${containerWidth} items-center gap-4 px-4 py-4 transition-[max-width] duration-300 sm:gap-6 sm:py-6`}>
        {/* Progresso: passo e contador por cima da barra, que ocupa toda a largura até ao botão */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2 text-[12.5px]">
            <span key={step} className="nuvi-step truncate font-semibold text-(--nv-text)">
              {STEPS[step]}
            </span>
            <span aria-hidden className="shrink-0 font-medium text-(--nv-text-3) tabular-nums">
              {step + 1}/{STEPS.length}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progresso da campanha"
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-valuenow={step + 1}
            aria-valuetext={`Passo ${step + 1} de ${STEPS.length}: ${STEPS[step]}`}
            className="mt-2 flex gap-1.5"
          >
            {STEPS.map((s, i) => (
              <span key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-(--nv-fill)">
                <span
                  className="block h-full rounded-full bg-[#4EA7EB] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: i <= step ? "100%" : "0%" }}
                />
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/painel"
          aria-label="Guardar e sair"
          className="lg-control flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-full text-[13.5px] font-semibold text-(--nv-text) sm:w-auto sm:px-4"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} className="sm:hidden" />
          <span className="hidden sm:inline">Guardar e sair</span>
        </Link>
      </header>

      <form
        onSubmit={next}
        noValidate
        className={`relative z-10 mx-auto flex w-full ${containerWidth} flex-1 flex-col px-4 pt-10 pb-16 transition-[max-width] duration-300 sm:pt-14`}
      >
        <p className="mb-2 text-[12.5px] font-semibold text-[#4EA7EB]">A tua primeira campanha</p>

        {step === 0 && (
          <Step headingRef={headingRef} title="O que queres que os criadores façam?" subtitle="Escolhe uma. Podes juntar as outras depois.">
            <OptionList label="Objetivo" items={GOALS} value={d.goal} onChange={(v) => set("goal", v)} />
          </Step>
        )}

        {step === 1 && (
          <Step headingRef={headingRef} title="Já trabalhaste com criadores?" subtitle="Ajustamos as recomendações à tua experiência.">
            <OptionList label="Experiência" items={EXPERIENCE} value={d.experience} onChange={(v) => set("experience", v)} />
          </Step>
        )}

        {step === 2 && (
          <Step headingRef={headingRef} title="Quem queres alcançar?" subtitle="Ajuda-nos a sugerir criadores com o público certo.">
            <ChipGroup label="Idades" multi options={AGES} selected={d.ages} onToggle={(v) => toggle("ages", v)} error={touched && d.ages.length === 0 ? "Escolhe pelo menos uma idade." : null} />
            <ChipGroup
              label="Género"
              options={GENDERS.map((g) => g.label)}
              selected={[GENDERS.find((g) => g.id === d.gender)!.label]}
              onToggle={(v) => set("gender", GENDERS.find((g) => g.label === v)!.id)}
            />
            <ChipGroup label="Onde" multi options={REGIONS} selected={d.regions} onToggle={(v) => toggle("regions", v)} error={touched && d.regions.length === 0 ? "Escolhe pelo menos uma região." : null} />
          </Step>
        )}

        {step === 3 && (
          <Step headingRef={headingRef} title="Fala-nos da tua marca" subtitle="Os criadores veem isto quando recebem o convite.">
            <div className="flex flex-col gap-4">
              <Field
                label="Nome da marca"
                icon={Building03Icon}
                autoComplete="organization"
                value={d.brandName}
                onChange={(e) => set("brandName", e.target.value)}
                placeholder="Ex.: Moco"
                error={touched && d.brandName.trim().length < 2 ? "Escreve o nome da marca." : null}
              />
              <Field
                label="Website (opcional)"
                icon={Link01Icon}
                type="url"
                inputMode="url"
                autoComplete="url"
                value={d.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="minhamarca.ao"
                error={websiteError}
              />
              <Field
                label="Instagram (opcional)"
                icon={InstagramIcon}
                value={d.instagram}
                onChange={(e) => set("instagram", e.target.value.replace(/\s/g, ""))}
                placeholder="@minhamarca"
              />
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step headingRef={headingRef} title="Como conheceste a Nuvi?" subtitle="Só para sabermos onde estar.">
            <div role="radiogroup" aria-label="Origem" className="grid grid-cols-2 gap-2.5">
              {SOURCES.map((s) => {
                const sel = d.source === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => set("source", s.id)}
                    className={`sq flex cursor-pointer items-center gap-2.5 rounded-[18px] px-4 py-3.5 text-left text-[14px] font-semibold transition-all ${selCls(sel)}`}
                  >
                    <HugeiconsIcon icon={s.icon} size={18} strokeWidth={1.8} className={sel ? "text-[#4EA7EB]" : "text-(--nv-text-3)"} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 5 && (
          <Step headingRef={headingRef} title="Quanto queres investir por mês?" subtitle="Uma estimativa. Podes mudar quando quiseres.">
            <OptionList label="Orçamento" items={BUDGETS} value={d.budget} onChange={selectBudget} />
          </Step>
        )}

        {step === 6 && (
          <Step
            headingRef={headingRef}
            title={withinBudget ? "O teu plano está pronto. Cabe no teu orçamento." : "Ajusta o plano ao teu ritmo."}
            subtitle="Criado a partir das tuas respostas. Mantém assim ou desliza o que mais importa."
          >
            <PlanCard
              budgetLabel={budgetMeta.shortLabel}
              budgetUnit={budgetMeta.unitLabel}
              projectedViewsLabel={formatCompactNumber(plan.views)}
              withinBudget={withinBudget}
              creators={plan.creators}
              posts={plan.posts}
              viewsLabel={formatCompactNumber(plan.views)}
              spendLabel={formatKwanzas(plan.spendKz)}
              bounds={sliderBounds}
              isPreset={isPreset}
              onChangePosts={(v) => set("plannedPosts", v)}
              onResetPreset={() => set("plannedPosts", null)}
            />
          </Step>
        )}

        {step === 7 && (
          <Step headingRef={headingRef} title="Tudo pronto. Confirma a tua campanha" subtitle="Podes editar qualquer parte antes de escolher os criadores.">
            <dl className="lg-surface sq divide-y divide-(--nv-line) rounded-[24px] px-5">
              <Review label="Objetivo" value={GOALS.find((g) => g.id === d.goal)?.title} onEdit={() => goStep(0)} />
              <Review label="Experiência" value={EXPERIENCE.find((x) => x.id === d.experience)?.title} onEdit={() => goStep(1)} />
              <Review
                label="Público"
                value={`${d.ages.join(", ")} · ${GENDERS.find((g) => g.id === d.gender)?.label} · ${d.regions.join(", ")}`}
                onEdit={() => goStep(2)}
              />
              <Review label="Marca" value={[d.brandName, d.website, d.instagram].filter(Boolean).join(" · ")} onEdit={() => goStep(3)} />
              <Review label="Orçamento" value={BUDGETS.find((b) => b.id === d.budget)?.title} onEdit={() => goStep(5)} />
              <Review
                label="Plano projetado"
                value={`${plan.creators} ${plan.creators === 1 ? "criador" : "criadores"} · ${plan.posts} posts/mês · ${formatKwanzas(plan.spendKz)}/mês`}
                onEdit={() => goStep(6)}
              />
            </dl>
          </Step>
        )}

        {touched && !valid && step !== 2 && step !== 3 && (
          <p role="alert" className="mt-4 text-[13px] font-medium text-[#FF3B30]">
            Escolhe uma opção para continuar.
          </p>
        )}

        {/* Ações logo a seguir ao conteúdo */}
        <div className="mt-8 flex items-center gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => goStep(step - 1)} className={`${secondaryBtn} !w-auto px-4`} aria-label="Passo anterior">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2} />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          ) : null}
          <PrimaryButton type="submit" aria-disabled={!valid} className={`ml-auto sm:!w-auto sm:!px-8 ${valid ? "" : "!opacity-60"}`}>
            {step === 6 ? (
              <>
                Criar e rever campanha
                <HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={2.2} />
              </>
            ) : step === STEPS.length - 1 ? (
              <>
                Ver criadores sugeridos
                <HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={2.2} />
              </>
            ) : (
              "Continuar"
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Peças ---------------- */

const selCls = (sel: boolean) =>
  sel
    ? "bg-(--nv-solid) shadow-[0_0_0_2px_#4EA7EB,0_8px_24px_-12px_rgba(78,167,235,0.45)]"
    : "lg-surface hover:shadow-[0_0_0_1px_var(--nv-line-strong)]";

function Step({
  title,
  subtitle,
  children,
  headingRef,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section className="nuvi-step">
      <h1 ref={headingRef} tabIndex={-1} className="text-[28px] leading-[1.15] font-bold tracking-[-0.03em] text-balance outline-none sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-2 text-[15px] text-(--nv-text-2)">{subtitle}</p>
      <div className="mt-8 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function PlanCard({
  budgetLabel,
  budgetUnit,
  projectedViewsLabel,
  withinBudget,
  creators,
  posts,
  viewsLabel,
  spendLabel,
  bounds,
  isPreset,
  onChangePosts,
  onResetPreset,
}: {
  budgetLabel: string;
  budgetUnit: string;
  projectedViewsLabel: string;
  withinBudget: boolean;
  creators: number;
  posts: number;
  viewsLabel: string;
  spendLabel: string;
  bounds: { min: number; max: number; step: number };
  isPreset: boolean;
  onChangePosts: (v: number) => void;
  onResetPreset: () => void;
}) {
  const pct = Math.min(100, Math.max(0, ((posts - bounds.min) / Math.max(1, bounds.max - bounds.min)) * 100));

  return (
    <div className="lg-surface sq overflow-hidden rounded-[24px]">
      {/* Topo: Orçamento vs Projeção */}
      <div className="grid grid-cols-1 gap-5 border-b border-(--nv-line) p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.06em] text-(--nv-text-3) uppercase">O teu orçamento</p>
          <p className="mt-1.5 flex flex-wrap items-baseline gap-2">
            <span className="font-title text-[26px] leading-none font-bold tracking-[-0.03em] text-(--nv-text) tabular-nums sm:text-[30px]">
              {budgetLabel}
            </span>
            <span className="text-[14px] font-medium text-(--nv-text-3)">{budgetUnit}</span>
          </p>
          <p className="mt-2.5 text-[12px] text-(--nv-text-3)">Projeção, não é garantia.</p>
        </div>

        <div className="sm:border-l sm:border-(--nv-line) sm:pl-6">
          <p className="text-[11px] font-semibold tracking-[0.06em] text-(--nv-text-3) uppercase">Este plano projeta</p>
          <p className="mt-1.5 flex flex-wrap items-baseline gap-2">
            <span
              className={`font-title text-[26px] leading-none font-bold tracking-[-0.03em] tabular-nums transition-colors sm:text-[30px] ${
                withinBudget ? "text-[#4EA7EB]" : "text-[#FF9500]"
              }`}
            >
              {projectedViewsLabel}
            </span>
            <span className="text-[14px] font-medium text-(--nv-text-3)">visualizações / mês</span>
          </p>
          {!withinBudget && (
            <p className="mt-2.5 text-[12px] font-medium text-[#FF9500]">Acima da faixa de orçamento escolhida.</p>
          )}
        </div>
      </div>

      {/* Meio: 4 indicadores */}
      <div className="grid grid-cols-2 border-b border-(--nv-line) sm:grid-cols-4">
        <PlanMetric
          icon={UserGroupIcon}
          value={String(creators)}
          label={creators === 1 ? "Criador" : "Criadores"}
          className="border-r border-b border-(--nv-line) sm:border-b-0"
        />
        <PlanMetric
          icon={CameraVideoIcon}
          value={String(posts)}
          label="Posts / mês"
          className="border-b border-(--nv-line) sm:border-r sm:border-b-0"
        />
        <PlanMetric
          icon={EyeIcon}
          value={viewsLabel}
          label="Views / mês"
          className="border-r border-(--nv-line)"
        />
        <PlanMetric
          icon={Wallet01Icon}
          value={spendLabel}
          sub="+ bónus por views"
          label="Investimento / mês"
        />
      </div>

      {/* Base: Slider interativo */}
      <div className="bg-(--nv-fill-2) p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="plan-posts-slider" className="text-[14px] font-semibold text-(--nv-text)">
            Publicações este mês · <span className="tabular-nums">{posts}</span>
          </label>
          {isPreset ? (
            <span className="text-[12.5px] font-medium text-(--nv-text-3)">Ajustado ao teu orçamento</span>
          ) : (
            <button
              type="button"
              onClick={onResetPreset}
              className="cursor-pointer text-[12.5px] font-semibold text-[#4EA7EB] hover:underline"
            >
              Repor plano sugerido
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center">
          <input
            id="plan-posts-slider"
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={bounds.step}
            value={posts}
            onChange={(e) => onChangePosts(Number(e.target.value))}
            aria-label="Publicações este mês"
            className="nuvi-range"
            style={{
              background: `linear-gradient(to right, #4EA7EB 0%, #4EA7EB ${pct}%, var(--nv-line-strong) ${pct}%, var(--nv-line-strong) 100%)`,
            }}
          />
        </div>

        <p className="mt-3.5 text-[12.5px] text-(--nv-text-3)">
          Aprovas cada publicação <strong className="font-semibold text-(--nv-text-2)">antes</strong> de qualquer pagamento.
        </p>
      </div>
    </div>
  );
}

function PlanMetric({
  icon,
  value,
  sub,
  label,
  className = "",
}: {
  icon: Icon;
  value: string;
  sub?: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-2.5 p-4 sm:px-4 sm:py-5 ${className}`}>
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-(--nv-accent-soft) text-[#4EA7EB]">
        <HugeiconsIcon icon={icon} size={15} strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <p className="font-title truncate text-[18px] leading-tight font-bold tracking-[-0.025em] text-(--nv-text) tabular-nums sm:text-[19px]">
          {value}
        </p>
        {sub && <p className="mt-0.5 truncate text-[11px] text-(--nv-text-3)">{sub}</p>}
        <p className="mt-1 truncate text-[10.5px] font-semibold tracking-[0.05em] text-(--nv-text-3) uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}

function OptionList<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  /** Ícone de vidro opcional (mesma família dos da escolha marca/criador). */
  items: { id: T; title: string; body: string; image?: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-2.5">
      {items.map((it) => {
        const sel = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(it.id)}
            className={`sq flex w-full cursor-pointer items-center gap-4 rounded-[22px] px-5 py-4 text-left transition-all duration-200 ${selCls(sel)}`}
          >
            {it.image && (
              <Image src={it.image} alt="" width={44} height={40} className="h-10 w-11 shrink-0 object-contain" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-semibold tracking-[-0.01em]">{it.title}</span>
              <span className="mt-0.5 block text-[13.5px] leading-snug text-(--nv-text-3)">{it.body}</span>
            </span>
            <span
              aria-hidden
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${sel ? "bg-[#4EA7EB] text-white" : "border-[1.5px] border-(--nv-line-strong)"}`}
            >
              {sel && <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
  multi,
  error,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
  multi?: boolean;
  error?: string | null;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[13.5px] font-semibold">
        {label}
        {multi && <span className="ml-1.5 font-normal text-(--nv-text-3)">· várias</span>}
      </legend>
      <div className="flex flex-wrap gap-2" role={multi ? "group" : "radiogroup"} aria-label={label}>
        {options.map((o) => {
          const sel = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              role={multi ? undefined : "radio"}
              aria-pressed={multi ? sel : undefined}
              aria-checked={multi ? undefined : sel}
              onClick={() => onToggle(o)}
              className={`sq inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-all ${
                sel ? "bg-[#4EA7EB] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" : "lg-control text-(--nv-text)"
              }`}
            >
              {sel && multi && <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={3} />}
              {o}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] font-medium text-[#FF3B30]">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Review({ label, value, onEdit }: { label: string; value?: string; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <dt className="text-[12.5px] font-medium text-(--nv-text-3)">{label}</dt>
        <dd className="mt-0.5 text-[14.5px] font-semibold break-words">{value || "—"}</dd>
      </div>
      <button type="button" onClick={onEdit} className="shrink-0 cursor-pointer text-[13.5px] font-semibold text-[#4EA7EB] hover:underline" aria-label={`Editar ${label.toLowerCase()}`}>
        Editar
      </button>
    </div>
  );
}
