import type { Metadata } from "next";
import Mikro from "@/components/pages/Mikro";

export const metadata: Metadata = {
  title: "Das Mikro · Andre Leherb",
  description: "Das Mikrofon zerlegt sich beim Scrollen. Chrom, lila Lack, ein Herz aus Draht.",
};

export default function Page() {
  return <Mikro />;
}
