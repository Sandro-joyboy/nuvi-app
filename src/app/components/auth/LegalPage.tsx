import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon } from "@hugeicons/core-free-icons";
import { AuthShell, PageTitle, secondaryBtn } from "./ui";

/**
 * Página legal provisória. O texto jurídico real tem de ser escrito/revisto
 * por quem é responsável pelo produto — aqui só se evita um 404 enganador.
 */
export default function LegalPage({ title }: { title: string }) {
  return (
    <AuthShell back={{ href: "/" }} width="md">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-(--nv-accent-soft) text-[#4EA7EB]">
        <HugeiconsIcon icon={File01Icon} size={26} strokeWidth={1.8} />
      </span>
      <PageTitle
        eyebrow="Em preparação"
        title={title}
        subtitle="A versão completa deste documento está a ser preparada e será publicada antes do lançamento oficial da Nuvi."
      />
      <Link href="/" className={`${secondaryBtn} mt-8 sm:w-auto`}>
        Voltar ao início
      </Link>
    </AuthShell>
  );
}
