import type { Metadata } from "next";
import CampaignsView from "@/app/components/dashboard/CampaignsView";

export const metadata: Metadata = { title: "Campanhas" };

export default function CampanhasPage() {
  return <CampaignsView />;
}
