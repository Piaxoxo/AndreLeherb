import type { Metadata } from "next";
import GameClient from "@/components/game/GameClient";

export const metadata: Metadata = {
  title: "Das Spiel · Andre Leherb",
  description: "24 Sekunden, 7 Leben. Fang die Noten, weich den Tropfen aus. Wer verliert, überlässt die Seite dem anderen.",
};

export default function Page() {
  return <GameClient />;
}
