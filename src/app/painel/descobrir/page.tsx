import type { Metadata } from "next";
import DiscoverView from "@/app/components/dashboard/DiscoverView";

export const metadata: Metadata = { title: "Descobrir" };

export default function DescobrirPage() {
  return <DiscoverView />;
}
