import type { Metadata } from "next";
import AnalyticsView from "@/app/components/dashboard/AnalyticsView";

export const metadata: Metadata = { title: "Análises" };

export default function AnalisesPage() {
  return <AnalyticsView />;
}
