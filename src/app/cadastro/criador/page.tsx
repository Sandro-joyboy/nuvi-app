import type { Metadata } from "next";
import SignupCard from "@/app/components/SignupCard";

export const metadata: Metadata = {
  title: "Cadastro para Criadores",
};

export default function CadastroCriadorPage() {
  return <SignupCard role="criador" />;
}
