import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { AuthShell, PageTitle, textLink } from "@/app/components/auth/ui";

const OPTIONS = [
  {
    href: "/cadastro/marca",
    icon: "/Glass-Search.svg",
    title: "Sou uma marca",
    body: "Lança campanhas de UGC, aprova vídeos e paga criadores num só lugar.",
  },
  {
    href: "/cadastro/criador",
    icon: "/Glass-Gallery.svg",
    title: "Sou criador",
    body: "Cria conteúdo para marcas de que gostas e recebe por visualização.",
  },
];

export default function Home() {
  return (
    <AuthShell
      width="md"
      aside={
        <span>
          Já tens conta?{" "}
          <Link href="/entrar" className={textLink}>
            Entrar
          </Link>
        </span>
      }
    >
      <PageTitle title="Como vais usar a Nuvi?" subtitle="Escolhe uma. Podes criar a outra conta depois." />

      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <li key={o.href}>
            <Link
              href={o.href}
              className="lg-surface sq group flex h-full flex-col rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99] motion-reduce:transform-none"
            >
              <Image src={o.icon} alt="" width={52} height={46} className="h-[46px] w-auto" />
              <span className="mt-6 flex items-center justify-between gap-2 text-[18px] font-bold tracking-[-0.02em]">
                {o.title}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  strokeWidth={2.2}
                  className="text-(--nv-text-3) transition-transform group-hover:translate-x-0.5 group-hover:text-(--nv-text)"
                />
              </span>
              <span className="mt-1.5 text-[14px] leading-relaxed text-(--nv-text-2)">{o.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </AuthShell>
  );
}
