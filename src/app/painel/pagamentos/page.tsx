import type { Metadata } from "next";
import PayoutsView from "@/app/components/dashboard/PayoutsView";

export const metadata: Metadata = { title: "Pagamentos" };

export default function PagamentosPage() {
  return <PayoutsView />;
}
