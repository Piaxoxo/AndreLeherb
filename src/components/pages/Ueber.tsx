"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Nav, Tear } from "@/components/Chrome";
import { artist, maitre } from "@/content";

const Backdrop = dynamic(() => import("./Backdrop"), { ssr: false });

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">{children}</div>;
}

function Quote({ text, by }: { text: string; by: string }) {
  return (
    <blockquote className="glass drip relative p-6 sm:p-8">
      <span aria-hidden className="display absolute -top-5 left-5 text-6xl leading-none" style={{ color: "var(--lilac-deep)" }}>
        „
      </span>
      <p className="text-lg font-medium italic leading-snug sm:text-xl">{text}</p>
      <footer className="mt-4 text-xs font-bold uppercase tracking-[0.2em] opacity-60">{by}</footer>
    </blockquote>
  );
}

export default function Ueber() {
  return (
    <>
      <Backdrop />
      <Nav />
      <Tear />
      {/* fade under the fixed nav so scrolling text never collides with it */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24" style={{ background: "linear-gradient(var(--bg), transparent)" }} aria-hidden />
      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-10 sm:pt-36 lg:px-16">
        {/* ---------- Header ---------- */}
        <header className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Label>Über André</Label>
            <h1 className="display mt-3 text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Dandy.
              <br />
              Dichter.
              <br />
              Wiener.
            </h1>
            <p className="display mt-6 max-w-xl text-2xl leading-tight sm:text-3xl" style={{ color: "var(--lilac-deep)" }}>
              {artist.motto}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed opacity-85 sm:text-lg">{artist.intro}</p>
          </div>
          <figure className="glass drip overflow-hidden !p-2">
            <img src="/img/andre-velvet-full.jpg" alt="Andre Leherb" className="aspect-[4/5] w-full rounded-[1.2rem] object-cover object-top" />
          </figure>
        </header>

        {/* ---------- Biografie ---------- */}
        <section className="mt-24 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]" id="biografie">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Label>Biografie</Label>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Vom Sängerknaben zum Dandy.</h2>
            <ol className="mt-8 space-y-3">
              {artist.timeline.map((t) => (
                <li key={t.year} className="flex items-baseline gap-3 text-sm">
                  <span className="inline-block h-3 w-3 translate-y-[1px] rounded-full bg-gradient-to-br from-white to-[#b8b8c6] shadow" />
                  <span className="w-12 shrink-0 font-bold">{t.year}</span>
                  <span className="opacity-75">{t.label}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-5">
            <div className="glass drip space-y-4 p-6 text-[15px] leading-relaxed sm:p-8 sm:text-base">
              {artist.bio.slice(0, 2).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <figure className="grid grid-cols-2 gap-4">
              <img src="/img/andre-stool.jpg" alt="" className="aspect-[4/5] w-full rounded-[1.4rem] object-cover shadow-xl" />
              <img src="/img/andre-leather.jpg" alt="" className="aspect-[4/5] w-full translate-y-8 rounded-[1.4rem] object-cover shadow-xl" />
            </figure>
            <div className="glass drip space-y-4 p-6 text-[15px] leading-relaxed sm:p-8 sm:text-base">
              {artist.bioLong.slice(0, 2).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="glass drip space-y-4 p-6 text-[15px] leading-relaxed sm:p-8 sm:text-base">
              <Label>24/7</Label>
              {artist.bioLong.slice(2, 4).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <Quote text={artist.quotes.s247} by="Andre Leherb zu „24/7“" />
            <div className="glass drip space-y-4 p-6 text-[15px] leading-relaxed sm:p-8 sm:text-base">
              <Label>Wir tanzen den Walzer</Label>
              <p>{artist.bioLong[4]}</p>
            </div>
            <Quote text={artist.quotes.walzer} by="Andre Leherb" />
          </div>
        </section>

        {/* ---------- Maître Leherb ---------- */}
        <section className="mt-28" id="leherb">
          <div className="max-w-3xl">
            <Label>Das Erbe · Über Leherb</Label>
            <h2 className="display mt-3 text-4xl sm:text-6xl">{maitre.name}</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] opacity-60">{maitre.role}</p>
            <p className="mt-6 text-base leading-relaxed opacity-85 sm:text-lg">
              Andres Onkel {maitre.fullName}. {maitre.intro}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Quote text={maitre.aragon.text} by={maitre.aragon.source} />
            <div className="glass drip p-6 sm:p-8">
              <Label>Leben</Label>
              <p className="mt-3 text-[15px] leading-relaxed sm:text-base">{maitre.life}</p>
              <Label>
                <span className="mt-6 block">Werk</span>
              </Label>
              <p className="mt-3 text-[15px] leading-relaxed sm:text-base">{maitre.werk}</p>
              <a href={maitre.links.werke} target="_blank" rel="noreferrer" className="btn-chrome mt-5 text-sm">
                Werke ansehen
              </a>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glass drip p-6 sm:p-8">
              <Label>Die Kontinente · Faenza, 1982</Label>
              <p className="mt-3 text-[15px] leading-relaxed sm:text-base">
                In{" "}
                <a href={maitre.links.faenza} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                  Faenza
                </a>
                , Italien, schuf er Anfang der 1980er Jahre die „größte jemals hergestellte Fayence“, ein 380 Quadratmeter großes Mosaik für
                den Neubau der{" "}
                <a href={maitre.links.wu} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                  Wiener Wirtschaftsuniversität
                </a>
                , die 1982 eröffnet wurde: „Die Kontinente“. Dabei zog er sich durch den keramischen Staub schwere gesundheitliche Schäden
                zu. Ein imaginäres Porträt der Erdteile Asien, Europa, Amerika, Afrika, Antarktis und Australien wurde hier in zwölfjähriger
                Arbeit und mit mehr als 3500 kleinen Keramikplatten geschaffen.
              </p>
              <blockquote className="mt-5 border-l-2 pl-4 text-sm italic leading-relaxed opacity-85" style={{ borderColor: "var(--lilac-deep)" }}>
                „{maitre.faenzaQuote}“
                <footer className="mt-2 not-italic text-xs font-bold uppercase tracking-[0.2em] opacity-60">Maître Leherb</footer>
              </blockquote>
            </div>
            <div className="glass drip p-6 sm:p-8">
              <Label>Auszeichnungen</Label>
              <ul className="mt-4 space-y-2 text-sm leading-snug">
                {maitre.awards.map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--lilac-deep)" }} />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <a href={maitre.links.site} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm underline underline-offset-4 opacity-80">
                leherb.org
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="mt-24 flex flex-col items-start justify-between gap-6 border-t pt-8 sm:flex-row sm:items-center" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <div className="display text-2xl">Buch mich.</div>
            <p className="mt-1 text-sm opacity-70">Konzerte, Events, Features. Anfragen an {artist.booking.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/#musik" className="btn-chrome text-sm">
              Musik
            </Link>
            <Link href="/#booking" className="btn-lilac text-sm">
              Booking
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
