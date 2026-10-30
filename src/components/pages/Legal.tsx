"use client";

import dynamic from "next/dynamic";
import { Nav, Tear } from "@/components/Chrome";
import SiteFooter from "@/components/SiteFooter";
import { useT } from "@/i18n";

const Backdrop = dynamic(() => import("./Backdrop"), { ssr: false });

/** A quiet text page over the 3D room: Impressum, Datenschutz. */
export default function Legal({ kind, children }: { kind: "imprint" | "privacy"; children: React.ReactNode }) {
  const t = useT();
  const label = t.legal.label;
  const title = kind === "imprint" ? t.legal.imprint : t.legal.privacy;
  return (
    <>
      <Backdrop />
      <Nav />
      <Tear />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24" style={{ background: "linear-gradient(var(--bg), transparent)" }} aria-hidden />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-10 sm:pt-36">
        <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">{label}</div>
        <h1 className="display mt-3 text-5xl sm:text-7xl">{title}</h1>
        {t.legal.enNote && <p className="mt-3 text-sm opacity-70">{t.legal.enNote}</p>}
        <div className="legal glass drip mt-10 p-6 text-[15px] leading-relaxed sm:p-9 sm:text-base">{children}</div>
        <SiteFooter className="mt-12" />
      </main>
    </>
  );
}
