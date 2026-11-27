import type { Metadata } from "next";
import MessagesView from "@/app/components/dashboard/MessagesView";

export const metadata: Metadata = {
  title: "Mensagens",
  description: "Conversa diretamente com os criadores das tuas campanhas.",
};

export default function MensagensPage() {
  return <MessagesView />;
}
