import type { Metadata } from "next";
import { SignupScreen } from "@/app/components/auth/AuthScreens";

export const metadata: Metadata = {
  title: "Criar conta de criador",
};

export default function CadastroCriadorPage() {
  return <SignupScreen role="criador" />;
}
