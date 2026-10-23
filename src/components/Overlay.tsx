"use client";

import { type Song } from "@/content";
import { useContent, useT } from "@/i18n";
import ChromeWords from "./ChromeWords";
import { EssayTeaser } from "./Essays";
import SiteFooter from "./SiteFooter";
import { player } from "@/lib/audio";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import ParticleSwirl from "./ParticleSwirl";

/** Brush logo that tilts with the pointer; swaps to the original (white) version in the glitch. */
function LogoTilt({ className }: { className?: string }) {
  const glitch = useStore((s) => s.glitch);
  const motion = useStore((s) => s.a11y.motion);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !motion) return;
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `perspective(1200px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [motion]);
  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform .25s ease-out", willChange: "transform" }}
    >
      <img
        src={glitch ? "/img/logo-dark.webp" : "/img/logo-light.webp"}
        alt=""
        className="block h-auto w-full select-none"
        draggable={false}
        style={{
          filter: glitch
            ? "drop-shadow(0 0 30px rgba(155,92,255,.6))"
            : "drop-shadow(0 30px 40px rgba(60,30,120,.18))",
        }}
      />
    </div>
  );
}

/** The short vertical clip in a glass phone; muted loop, tap for sound. */
function Clip({
  className,
  src,
  poster,
  aspect = "9/16",
  radius = 22,
  label,
}: {
  className?: string;
  src: string;
  poster: string;
  aspect?: string;
  radius?: number;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const t = useT();
  const motion = useStore((s) => s.a11y.motion);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = sound;
    if (!sound) v.currentTime = 0;
    v.play().catch(() => {});
    setSound(!sound);
  };
  return (
    <button
      onClick={toggle}
      className={`${className ?? ""} pointer-events-auto group block`}
      aria-label={sound ? t.hero.soundOff : t.hero.soundOn}
    >
      <div
        className="glass relative w-full overflow-hidden p-[6px] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-1.5deg]"
        style={{
          aspectRatio: aspect,
          borderRadius: radius,
          boxShadow:
            "0 30px 60px -20px rgba(60,30,120,.45), inset 0 1px 0 rgba(255,255,255,.7)",
        }}
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          className="h-full w-full object-cover"
          style={{ borderRadius: radius - 6 }}
          autoPlay={motion}
          muted
          loop
          playsInline
          preload="metadata"
        />
        {label && (
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
            {label}
          </span>
        )}
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
          {sound ? t.hero.soundOff : t.hero.soundOn}
        </span>
      </div>
    </button>
  );
}

function PhoneClip({ className }: { className?: string }) {
  return (
    <Clip
      className={className}
      src="/video/walzertruck.mp4"
      poster="/video/walzertruck-poster.jpg"
    />
  );
}

/** André as a living particle field; bursts and darkens during the glitch. */
function ParticleAndre({ className }: { className?: string }) {
  const glitch = useStore((s) => s.glitch);
  const count = useStore((s) => s.glitchCount);
  const mobile = useStore((s) => s.mobile);
  const motion = useStore((s) => s.a11y.motion);
  return (
    <ParticleSwirl
      calm={!motion}
      className={className}
      image="/img/andre-velvet.webp"
      fit="contain"
      particleCount={mobile ? 5000 : 11000}
      particleSize={mobile ? 1.8 : 1.7}
      particleOpacity={0.95}
      speed={glitch ? 2.2 : 1}
      cycleDuration={11}
      disperse={0.8}
      swirl={glitch ? 3 : 1.1}
      flowForce={glitch ? 1.2 : 0.3}
      damping={0.9}
      cursorForce={2.6}
      cursorRadius={120}
      tint={glitch ? "#8a2bff" : undefined}
      burst={count}
      maxDpr={1.5}
      alt="Andre Leherb im lila Samtjackett"
    />
  );
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative h-dvh w-screen overflow-hidden px-5 sm:px-10 lg:px-16 ${className}`}
    >
      {children}
    </section>
  );
}

/** Only offer play when the audio file is actually deployed (24/7 is still to come). */
function useAudioAvailable(url?: string) {
  const [ok, setOk] = useState<boolean | null>(url ? null : false);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    fetch(url, { method: "HEAD" })
      .then((r) => alive && setOk(r.ok))
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, [url]);
  return ok;
}

export function PlayButton({
  song,
  big = false,
}: {
  song: Song;
  big?: boolean;
}) {
  const t = useT();
  const playing = useStore((s) => s.playing);
  const on = playing === song.id;
  const available = useAudioAvailable(song.audio);
  if (!song.audio || available === false) {
    return big ? (
      <a
        href={song.links[0].href}
        target="_blank"
        rel="noreferrer"
        className="btn-lilac text-base"
      >
        <span aria-hidden className="inline-block w-3 text-center">
          ▶
        </span>
        {t.hero.listen(song.title)}
      </a>
    ) : (
      <span
        className="rounded-full border px-3 py-1.5 text-xs font-bold opacity-60"
        style={{ borderColor: "var(--glass-border)" }}
      >
        {t.hero.platforms}
      </span>
    );
  }
  return (
    <button
      onClick={() => player.toggle(song.id, song.audio!)}
      className={big ? "btn-lilac text-base" : "btn-chrome text-sm"}
      aria-pressed={on}
    >
      <span aria-hidden className="inline-block w-3 text-center">
        {on ? "❚❚" : "▶"}
      </span>
      {on ? t.hero.pause : big ? t.hero.play(song.title) : t.hero.short}
    </button>
  );
}

export function SongCard({
  song,
  align,
}: {
  song: Song;
  align: "left" | "right";
}) {
  const t = useT();
  return (
    <div
      className={`glass drip w-full max-w-md p-4 sm:p-7 ${align === "right" ? "lg:ml-auto" : ""}`}
    >
      <div className="flex gap-4 sm:gap-5">
        <img
          src={song.cover}
          alt={`${song.title} Cover`}
          className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-lg sm:h-28 sm:w-28"
        />
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60 sm:text-xs">
            {song.tag && (
              <span style={{ color: "var(--lilac-deep)" }}>{song.tag} · </span>
            )}
            {t.musik.single} · {song.release}
          </div>
          <h3 className="display mt-1 text-2xl sm:text-4xl">{song.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2 sm:mt-3">
            <PlayButton song={song} />
          </div>
        </div>
      </div>
      {/* Long copy only from tablet up; phones get title, play and links. */}
      <p className="mt-5 hidden text-sm leading-relaxed opacity-85 sm:block">
        {song.description}
      </p>
      <blockquote
        className="mt-4 hidden border-l-2 pl-3 text-sm italic opacity-80 sm:block"
        style={{ borderColor: "var(--lilac-deep)" }}
      >
        „{song.quote}“
      </blockquote>
      <div className="mt-3 flex flex-wrap gap-2 sm:mt-5">
        {song.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border px-3 py-1.5 text-xs font-bold transition hover:bg-white/60"
            style={{ borderColor: "var(--glass-border)" }}
          >
            {l.label} ↗
          </a>
        ))}
      </div>
      <div className="mt-4 hidden text-[11px] leading-snug opacity-50 sm:block">
        {song.credits}
      </div>
    </div>
  );
}

export function BookingForm() {
  const [sent, setSent] = useState(false);
  const t = useT();
  const { artist } = useContent();
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const subject = encodeURIComponent(
          `${t.booking.subject}: ${f.get("event") || ""}`,
        );
        const body = encodeURIComponent(
          `${t.booking.name}: ${f.get("name")}\n${t.booking.email}: ${f.get("email")}\n${t.booking.kind}: ${f.get("event")}\n${t.booking.dateLabel}: ${f.get("date")}\n\n${f.get("msg")}`,
        );
        window.location.href = `mailto:${artist.booking.email}?subject=${subject}&body=${body}`;
        setSent(true);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder={t.booking.name}
          aria-label={t.booking.name}
          className="field"
          autoComplete="name"
        />
        <input
          name="email"
          type="email"
          required
          placeholder={t.booking.email}
          aria-label={t.booking.email}
          className="field"
          autoComplete="email"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="event"
          className="field"
          defaultValue={t.booking.events[0]}
          aria-label={t.booking.kind}
        >
          {t.booking.events.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <input
          name="date"
          placeholder={t.booking.date}
          aria-label={t.booking.date}
          className="field"
        />
      </div>
      <textarea
        name="msg"
        rows={2}
        placeholder={t.booking.msg}
        aria-label={t.booking.msg}
        className="field resize-none"
      />
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-lilac">
          {t.booking.send}
        </button>
        <a
          href={`mailto:${artist.booking.email}`}
          className="text-sm underline-offset-4 hover:underline opacity-80"
        >
          {t.booking.direct} {artist.booking.email}
        </a>
      </div>
      {sent && <p className="text-sm opacity-70">{t.booking.sent}</p>}
    </form>
  );
}

export default function Overlay() {
  const note = useStore((s) => s.note);
  const mobile = useStore((s) => s.mobile);
  const t = useT();
  const { artist, songs } = useContent();
  const s247 = songs[0];
  const walzer = songs[1];

  return (
    <div className="pointer-events-none select-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_form]:pointer-events-auto [&_form]:select-auto">
      {/* ---------- 0 · Intro ---------- */}
      <Section>
        {/* the brush logo, big, behind André; it tilts a little with the pointer */}
        <div className="absolute inset-0 flex items-start justify-center pt-[12vh] sm:items-center sm:justify-start sm:pt-0 sm:pl-[6vw] lg:pl-[8vw]">
          <h1 className="m-0 sm:-translate-y-[13vh]">
            <span className="sr-only">Andre Leherb</span>
            <LogoTilt className="w-[80vw] max-w-[1000px] sm:w-[50vw]" />
          </h1>
        </div>
        {/* the 12-second truck clip as a floating glass phone */}
        <PhoneClip className="absolute left-4 top-[40vh] w-[27vw] max-w-[120px] sm:left-auto sm:right-10 sm:top-auto sm:bottom-10 sm:w-[15vw] sm:max-w-[200px] lg:right-16" />
        <div className="absolute inset-x-5 bottom-[max(2rem,env(safe-area-inset-bottom))] sm:inset-x-10 lg:inset-x-16">
          <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
            <div className="glass drip max-w-[calc(100vw-2.5rem)] p-4 sm:max-w-md sm:p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60 sm:text-xs">
                {t.hero.tag}
              </div>
              <p className="display mt-1.5 text-xl leading-tight sm:mt-2 sm:text-3xl">
                {artist.motto}
              </p>
              <p className="mt-2 hidden text-sm leading-relaxed opacity-85 sm:block">
                {artist.intro}
              </p>
              <p className="mt-1.5 text-[14px] leading-snug sm:mt-3 sm:text-[15px]">
                {t.hero.release} <strong>24/7</strong>
                <span className="hidden sm:inline">{t.hero.produced}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
                <PlayButton song={s247} big />
                <a href="#booking" className="btn-chrome">
                  {t.hero.book}
                </a>
                <a
                  href="#mikro"
                  className="hidden rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] opacity-70 hover:opacity-100 sm:inline-block"
                >
                  {t.hero.mic}
                </a>
              </div>
            </div>
            <div className="hidden pr-[17vw] text-right text-xs font-bold uppercase tracking-[0.3em] opacity-50 lg:block">
              {t.hero.scroll}
              <div className="mx-auto mt-2 h-10 w-px bg-current opacity-60" />
            </div>
          </div>
        </div>
        {note && (
          <div
            className="ghost-note pointer-events-none absolute left-5 top-[16%] max-w-[80vw] whitespace-pre-line text-xl sm:left-10 sm:top-[18%] sm:text-3xl lg:left-16"
            aria-live="polite"
          >
            {note}
          </div>
        )}
      </Section>

      {/* ---------- the mic scrub lives in a fixed layer (Experience); these pages give it scroll room ---------- */}
      <div aria-hidden style={{ height: "300dvh" }} />

      {/* ---------- 1 · Musik ---------- */}
      <Section>
        <div className="absolute left-5 top-[max(5.5rem,10vh)] sm:left-10 lg:left-16">
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
            {t.musik.label}
          </div>
          <h2 className="display mt-2 text-5xl sm:text-7xl">{t.musik.title}</h2>
          <a
            href={artist.youtube}
            target="_blank"
            rel="noreferrer"
            className="btn-chrome mt-4 !py-2.5 !px-4 text-xs uppercase tracking-[0.15em] max-sm:!hidden"
          >
            {t.musik.subscribe}
          </a>
        </div>
        <div className="absolute inset-x-5 bottom-6 grid gap-3 sm:inset-x-10 sm:gap-5 lg:inset-x-16 lg:bottom-10 lg:grid-cols-2 lg:gap-10">
          <div className="lg:mt-10">
            <SongCard song={s247} align="left" />
          </div>
          <div>
            <SongCard song={walzer} align="right" />
          </div>
        </div>
      </Section>

      {/* ---------- 2 · Über ---------- */}
      <Section>
        <ParticleAndre className="pointer-events-auto absolute left-[10%] top-[5%] h-[30%] w-[80%] sm:left-[55%] sm:top-[8%] sm:h-[40%] sm:w-[42%] lg:left-[24%] lg:top-[60%] lg:h-[40%] lg:w-[32%]" />
        <div className="absolute left-5 right-5 top-[max(5.5rem,10vh)] hidden sm:left-10 sm:right-[46%] sm:block lg:left-16 lg:right-auto lg:w-[46%]">
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
            {t.ueber.label}
          </div>
          <h2 className="display mt-2 text-3xl leading-[1.02] sm:text-4xl lg:text-5xl xl:text-6xl">
            {artist.credo}
          </h2>
          <div className="display mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
            <ChromeWords words={artist.words} />
          </div>
          <EssayTeaser className="mt-6 hidden lg:block" />
        </div>
        <div className="absolute inset-x-5 bottom-6 sm:inset-x-10 lg:inset-x-16 lg:bottom-10 lg:left-auto lg:w-[46%]">
          <div className="glass drip p-5 sm:p-7">
            <h2 className="display mb-2 text-[22px] leading-tight sm:hidden">
              {artist.credo}
            </h2>
            <div className="display mb-3 text-xl sm:hidden">
              <ChromeWords words={artist.words} />
            </div>
            <p className="text-sm leading-relaxed sm:text-[15px]">
              {artist.bio[0]}
            </p>
            <p className="mt-3 hidden text-sm leading-relaxed sm:block sm:text-[15px]">
              {artist.bio[1]}
            </p>
            {!mobile && (
              <p className="mt-3 text-sm leading-relaxed sm:text-[15px]">
                {artist.bio[2]}
              </p>
            )}
            <a href="/ueber" className="btn-lilac mt-4 !py-2.5 !px-5 text-sm">
              {t.ueber.more}
            </a>
            <div
              className="mt-4 hidden border-t pt-3 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 sm:mt-5 sm:block sm:pt-4"
              style={{ borderColor: "var(--glass-border)" }}
            >
              {t.ueberPage.pointBio}
            </div>
            <ol className="mt-2 hidden flex-wrap gap-x-4 gap-y-1.5 sm:flex sm:gap-x-5 sm:gap-y-2">
              {artist.timeline.map((t) => (
                <li
                  key={t.year}
                  className="flex items-baseline gap-2 text-[11px] sm:text-xs"
                >
                  <span className="inline-block h-2.5 w-2.5 translate-y-[1px] rounded-full bg-gradient-to-br from-white to-[#b8b8c6] shadow" />
                  <span className="font-bold">{t.year}</span>
                  <span className="opacity-70">{t.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ---------- 3 · Booking ---------- */}
      <Section>
        <div id="booking" className="absolute -top-20" />
        <div className="absolute left-5 top-[max(5.5rem,10vh)] hidden sm:left-10 sm:block lg:left-16">
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
            {t.booking.label}
          </div>
          <h2 className="display mt-2 text-5xl sm:text-7xl">
            {t.booking.title[0]}
            <br />
            {t.booking.title[1]}
          </h2>
        </div>
        <div className="absolute inset-x-5 bottom-6 sm:inset-x-10 lg:inset-x-16 lg:bottom-10 lg:right-auto lg:w-[52%]">
          <div className="glass drip p-5 sm:p-7">
            <h2 className="display mb-2 text-3xl sm:hidden">
              {t.booking.titleShort}
            </h2>
            <p className="mb-4 text-sm leading-relaxed opacity-85 sm:mb-5">
              {t.booking.intro}
            </p>
            <BookingForm />
          </div>
          <SiteFooter className="mt-3 hidden px-1 sm:block" compact />
        </div>
      </Section>

      {/* ---------- 4 · phone only: socials and legal on their own screen ---------- */}
      {mobile && (
        <Section>
          <div className="absolute inset-x-5 bottom-6">
            <SiteFooter className="px-1" />
          </div>
        </Section>
      )}
    </div>
  );
}
