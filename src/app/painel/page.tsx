import type { Metadata } from "next";
import HomeView from "@/app/components/dashboard/HomeView";

export const metadata: Metadata = {
  title: "Painel",
  description: "Acompanhe suas campanhas, entregas e desempenho na Nuvi.",
};

export default function PainelPage() {
  return <HomeView />;
}
