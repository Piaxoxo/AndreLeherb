"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Nav, Tear } from "@/components/Chrome";
import { artist } from "@/content";

const Backdrop = dynamic(() => import("./Backdrop"), { ssr: false });

/** A quiet text page over the 3D room: Impressum, Datenschutz. */
export default function Legal({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <Backdrop />
      <Nav />
      <Tear />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24" style={{ background: "linear-gradient(var(--bg), transparent)" }} aria-hidden />
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-10 sm:pt-36">
        <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">{label}</div>
        <h1 className="display mt-3 text-5xl sm:text-7xl">{title}</h1>
        <div className="legal glass drip mt-10 p-6 text-[15px] leading-relaxed sm:p-9 sm:text-base">{children}</div>
        <footer className="mt-12 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          <Link href="/" className="hover:opacity-100">
            Startseite
          </Link>
          <Link href="/impressum" className="hover:opacity-100">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:opacity-100">
            Datenschutz
          </Link>
          <a href={artist.booking.agencyUrl} target="_blank" rel="noreferrer" className="hover:opacity-100">
            {artist.booking.agency}
          </a>
        </footer>
      </main>
    </>
  );
}
