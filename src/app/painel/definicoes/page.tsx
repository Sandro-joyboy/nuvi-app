import type { Metadata } from "next";
import SettingsView from "@/app/components/dashboard/SettingsView";

export const metadata: Metadata = { title: "Definições" };

export default function DefinicoesPage() {
  return <SettingsView />;
}
