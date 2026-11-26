import type { Metadata } from "next";
import NuviDashboard from "@/app/components/dashboard/NuviDashboard";

export const metadata: Metadata = {
  title: "Painel",
  description: "Acompanhe suas campanhas, entregas e desempenho na Nuvi.",
};

export default function PainelPage() {
  return <NuviDashboard />;
}
