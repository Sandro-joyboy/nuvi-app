import type { Metadata } from "next";
import BrandSignup from "@/app/components/BrandSignup";

export const metadata: Metadata = {
  title: "Cadastro para Marcas",
};

export default function CadastroMarcaPage() {
  return <BrandSignup />;
}
