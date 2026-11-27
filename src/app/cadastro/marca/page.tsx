import type { Metadata } from "next";
import { SignupScreen } from "@/app/components/auth/AuthScreens";

export const metadata: Metadata = {
  title: "Criar conta de marca",
};

export default function CadastroMarcaPage() {
  return <SignupScreen role="marca" />;
}
