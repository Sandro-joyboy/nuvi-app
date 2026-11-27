import Image from "next/image";
import Link from "next/link";

/** Secções do painel que ainda não existem: /painel/descobrir, /painel/campanhas, … */
export default function UnderConstruction({ section }: { section: string }) {
  return (
    <section
      aria-labelledby="em-construcao"
      className="lg-surface sq mx-auto flex min-h-[60vh] w-full max-w-[1360px] flex-1 flex-col items-center justify-center rounded-[28px] px-6 py-16 text-center"
    >
      <Image
        src="/icons/clock.svg"
        alt=""
        width={84}
        height={72}
        className="select-none"
        draggable={false}
      />
      <p className="mt-5 rounded-full bg-(--nv-accent-soft) px-3 py-1 text-[12px] font-semibold text-[#0076E8]">
        {section}
      </p>
      <h2
        id="em-construcao"
        className="mt-3 text-[22px] font-bold tracking-[-0.025em] text-(--nv-text)"
      >
        Em construção
      </h2>
      <p className="mt-1.5 max-w-[320px] text-[13.5px] leading-snug text-(--nv-text-3)">
        Estamos a preparar esta secção. Volta em breve.
      </p>
      <Link href="/painel" className="nuvi-btn-sm sq mt-6 !h-11 !px-6">
        Voltar ao Início
      </Link>
    </section>
  );
}
