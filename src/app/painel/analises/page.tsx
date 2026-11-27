import type { Metadata } from "next";
import UnderConstruction from "@/app/components/dashboard/UnderConstruction";

export const metadata: Metadata = { title: "Análises" };

export default function AnalisesPage() {
  return <UnderConstruction section="Análises" />;
}
