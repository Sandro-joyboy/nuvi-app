import type { Metadata } from "next";
import LegalPage from "@/app/components/auth/LegalPage";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return <LegalPage title="Política de Privacidade" />;
}
