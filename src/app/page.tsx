import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 font-sans"
      style={{ backgroundImage: "url('/bg-choice.svg')" }}
    >
      {/* Container Principal: 757 x 405 */}
      <div className="flex w-full max-w-[757px] min-h-[405px] flex-col justify-between rounded-[28px] bg-white px-[28px] py-[24px] text-[#111827] shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
        {/* Topo: Logo Cloud + Título + Subtítulo */}
        <div>
          <div className="mb-2 -ml-1">
            <Image
              src="/logo-icon-cloud.svg"
              alt="Nuvi Cloud"
              width={84}
              height={56}
              priority
            />
          </div>

          <h1 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-[#0A0A0A]">
            Crie sua conta
          </h1>
          <p className="mt-1 text-[13.5px] font-normal leading-snug tracking-[-0.01em] text-[#71717A]">
            Escolha como você vai usar a Nuvi. Você pode se cadastrar do outro lado depois.
          </p>
        </div>

        {/* Opções: Para marcas / Para criadores */}
        <div className="my-4 grid grid-cols-1 gap-[14px] sm:grid-cols-2">
          {/* Card: Para marcas */}
          <button
            type="button"
            className="group flex min-h-[168px] flex-col justify-between rounded-[18px] border border-[#EBEBEB] bg-[#F9F9F9] p-[20px] text-left transition-all duration-200 hover:border-[#4EA7EB]/60 hover:bg-[#F4F9FF] hover:shadow-sm cursor-pointer"
          >
            <div>
              <Image
                src="/Glass-Search.svg"
                alt="Para marcas"
                width={49}
                height={42}
              />
            </div>

            <div className="mt-3">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0A]">
                Para marcas
              </h2>
              <p className="mt-1 text-[13px] font-normal leading-[1.4] tracking-[-0.01em] text-[#71717A]">
                Marcas e agências com campanhas de UGC: lance, pague e acompanhe criadores em um só lugar.
              </p>
            </div>
          </button>

          {/* Card: Para criadores */}
          <button
            type="button"
            className="group flex min-h-[168px] flex-col justify-between rounded-[18px] border border-[#EBEBEB] bg-[#F9F9F9] p-[20px] text-left transition-all duration-200 hover:border-[#4EA7EB]/60 hover:bg-[#F4F9FF] hover:shadow-sm cursor-pointer"
          >
            <div>
              <Image
                src="/Glass-Gallery.svg"
                alt="Para criadores"
                width={48}
                height={46}
              />
            </div>

            <div className="mt-3">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0A0A0A]">
                Para criadores
              </h2>
              <p className="mt-1 text-[13px] font-normal leading-[1.4] tracking-[-0.01em] text-[#71717A]">
                Criadores que ganham para criar conteúdo: publique para marcas que você curte e receba por visualização.
              </p>
            </div>
          </button>
        </div>

        {/* Rodapé: Já tem uma conta? Entrar */}
        <div className="text-[13px] tracking-[-0.01em] text-[#71717A]">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#0A0A0A] underline underline-offset-2 transition-opacity hover:opacity-75"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
