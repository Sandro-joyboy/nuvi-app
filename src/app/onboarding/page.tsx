import type { Metadata } from "next";
import CampaignOnboarding from "@/app/components/CampaignOnboarding";

export const metadata: Metadata = {
  title: "A tua primeira campanha",
};

export default function OnboardingPage() {
  return <CampaignOnboarding />;
}
