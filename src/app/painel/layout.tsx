import DashboardShell from "@/app/components/dashboard/DashboardShell";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
