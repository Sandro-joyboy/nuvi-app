import type { Metadata } from "next";
import LegalPage from "@/app/components/auth/LegalPage";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return <LegalPage title="Termos de Uso" />;
}
