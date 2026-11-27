import type { Metadata } from "next";
import UnderConstruction from "@/app/components/dashboard/UnderConstruction";

export const metadata: Metadata = { title: "Descobrir" };

export default function DescobrirPage() {
  return <UnderConstruction section="Descobrir" />;
}
