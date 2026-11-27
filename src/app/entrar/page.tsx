import type { Metadata } from "next";
import { LoginScreen } from "@/app/components/auth/AuthScreens";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  return <LoginScreen />;
}
