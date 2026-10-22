"use client";

import Link from "next/link";
import { Nav } from "./Chrome";
import ChromeWords from "./ChromeWords";
import SiteFooter from "./SiteFooter";
import { BookingForm, PlayButton, SongCard } from "./Overlay";
import { useContent, useT } from "@/i18n";

/** The start page without the 3D room: the same content as a plain, scrolling document. */
export default function StaticHome() {
  const t = useT();
  const { artist, songs } = useContent();
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-10 sm:pt-36 lg:px-16">
        {/* hero */}
        <header className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="m-0">
              <span className="sr-only">Andre Leherb</span>
              <img src="/img/logo-light.webp" alt="" className="w-[80vw] max-w-[560px]" />
            </h1>
            <div className="mt-6 text-xs font-bold uppercase tracking-[0.25em] opacity-60">{t.hero.tag}</div>
            <p className="display mt-2 text-3xl leading-tight sm:text-4xl">{artist.motto}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed opacity-85">{artist.intro}</p>
            <p className="mt-3 text-base">
              {t.hero.release} <strong>24/7</strong>
              {t.hero.produced}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <PlayButton song={songs[0]} big />
              <a href="#booking" className="btn-chrome">
                {t.hero.book}
              </a>
            </div>
          </div>
          <figure className="glass overflow-hidden !p-2">
            <img src="/img/andre-velvet-full.jpg" alt="Andre Leherb" className="aspect-[4/5] w-full rounded-[1.2rem] object-cover object-top" />
          </figure>
        </header>

        {/* music */}
        <section id="musik" className="mt-24 scroll-mt-28">
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">{t.musik.label}</div>
          <h2 className="display mt-2 text-5xl sm:text-7xl">{t.musik.title}</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SongCard song={songs[0]} align="left" />
            <SongCard song={songs[1]} align="left" />
          </div>
          <a href={artist.youtube} target="_blank" rel="noreferrer" className="btn-chrome mt-6 !py-2.5 !px-4 text-xs uppercase tracking-[0.15em]">
            {t.musik.subscribe}
          </a>
        </section>

        {/* about */}
        <section id="ueber" className="mt-24 scroll-mt-28">
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">{t.ueber.label}</div>
          <h2 className="display mt-2 max-w-4xl text-3xl leading-[1.02] sm:text-5xl">{artist.credo}</h2>
          <div className="display mt-6 text-2xl sm:text-4xl">
            <ChromeWords words={artist.words} />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <img src="/img/andre-stool.jpg" alt="Andre Leherb" className="w-full rounded-[1.4rem] object-cover shadow-xl" />
            <div className="glass space-y-4 p-6 text-base leading-relaxed sm:p-8">
              {artist.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <Link href="/ueber" className="btn-lilac !py-2.5 !px-5 text-sm">
                {t.ueber.more}
              </Link>
              <ol className="flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm" style={{ borderColor: "var(--glass-border)" }}>
                {artist.timeline.map((x) => (
                  <li key={x.year} className="flex items-baseline gap-2">
                    <span className="font-bold">{x.year}</span>
                    <span className="opacity-75">{x.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* booking */}
        <section id="booking" className="mt-24 scroll-mt-28">
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">{t.booking.label}</div>
          <h2 className="display mt-2 text-5xl sm:text-7xl">{t.booking.titleShort}</h2>
          <div className="glass mt-8 max-w-3xl p-6 sm:p-8">
            <p className="mb-5 text-base leading-relaxed opacity-85">{t.booking.intro}</p>
            <BookingForm />
          </div>
        </section>

        <SiteFooter className="mt-16" />
      </main>
    </>
  );
}
