import type { Metadata, Viewport } from "next";
import { Inter_Tight, Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import AccessPanel from "@/components/AccessPanel";
import HomeKeeper from "@/components/HomeKeeper";
import { Analytics } from "@vercel/analytics/next";

const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Andre Leherb",
  description:
    "Andre Leherb, Sänger und Songwriter aus Wien. Neue Singles 24/7 und Wir tanzen den Walzer. Booking für Konzerte und Events.",
  openGraph: {
    title: "Andre Leherb",
    description: "Surrealismus in Musik. Wien, 24/7.",
    images: ["/img/cover-247.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f4f9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${display.variable} ${body.variable} ${serif.variable} h-full`}
    >
      <body className="min-h-full">
        <HomeKeeper />
        {children}
        <PageTransition />
        <AccessPanel />
        <Analytics />
      </body>
    </html>
  );
}
