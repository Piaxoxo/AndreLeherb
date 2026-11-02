import type { Metadata } from "next";
import Ueber from "@/components/pages/Ueber";

export const metadata: Metadata = {
  title: "Über Andre · Andre Leherb",
  description:
    "Biografie von Andre Leherb: Mozart-Sängerknabe, Frontman von DEZIRE, Solo seit 1998, 24/7 und Wir tanzen den Walzer mit Gary Lux. Und das Erbe seines Onkels Maître Leherb.",
};

export default function Page() {
  return <Ueber />;
}
