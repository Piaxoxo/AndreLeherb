import type { Metadata } from "next";
import Galerie from "@/components/pages/Galerie";

export const metadata: Metadata = {
  title: "Galerie · Andre Leherb",
  description: "Fotos von Andre Leherb: das Shooting 2026 und Bilder aus den Jahren davor.",
};

export default function Page() {
  return <Galerie />;
}
