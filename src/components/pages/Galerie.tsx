"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Nav, Tear } from "@/components/Chrome";
import { gallery, type Photo } from "@/gallery";
import { artist } from "@/content";

const Backdrop = dynamic(() => import("./Backdrop"), { ssr: false });

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">{children}</div>;
}

/** Full-screen viewer with keyboard, swipe and preloading of the neighbours. */
function Lightbox({ photos, index, onClose, onMove }: { photos: Photo[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const p = photos[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);

  useEffect(() => {
    for (const d of [1, -1]) {
      const n = photos[(index + d + photos.length) % photos.length];
      const img = new Image();
      img.src = n.src;
    }
  }, [index, photos]);

  const [touchX, setTouchX] = useState<number | null>(null);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={p.alt}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(8,5,14,0.92)] backdrop-blur-xl"
      onClick={onClose}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX == null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) onMove(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
    >
      <img
        key={p.src}
        src={p.src}
        alt={p.alt}
        className="max-h-[88vh] max-w-[94vw] rounded-2xl object-contain shadow-2xl"
        style={{ animation: "lb-in .35s cubic-bezier(.2,.8,.2,1)" }}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
        <span>{p.caption}</span>
        <span className="opacity-60">
          {index + 1} / {photos.length}
        </span>
      </div>
      <button
        aria-label="Vorheriges Foto"
        className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:flex"
        onClick={(e) => {
          e.stopPropagation();
          onMove(-1);
        }}
      >
        ←
      </button>
      <button
        aria-label="Nächstes Foto"
        className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:flex"
        onClick={(e) => {
          e.stopPropagation();
          onMove(1);
        }}
      >
        →
      </button>
      <button
        aria-label="Schließen"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur hover:bg-white/20"
        onClick={onClose}
      >
        ×
      </button>
      <style>{`@keyframes lb-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

export default function Galerie() {
  const [open, setOpen] = useState<number | null>(null);
  const [set, setSet] = useState<string>("alle");
  const sets = ["alle", ...Array.from(new Set(gallery.map((p) => p.set)))];
  const photos = set === "alle" ? gallery : gallery.filter((p) => p.set === set);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d: number) => setOpen((i) => (i == null ? null : (i + d + photos.length) % photos.length)), [photos.length]);

  return (
    <>
      <Backdrop />
      <Nav />
      <Tear />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24" style={{ background: "linear-gradient(var(--bg), transparent)" }} aria-hidden />
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-10 sm:pt-36 lg:px-16">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Label>Galerie</Label>
            <h1 className="display mt-3 text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Bilder.
              <br />
              Blicke.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed opacity-85 sm:text-lg">
              Andre Leherb vor der Kamera: das Shooting 2026 mit Catchlight by Martin Hauser und Momente aus den Jahren davor. Zum Vergrößern antippen.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sets.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSet(s);
                  setOpen(null);
                }}
                className={s === set ? "btn-lilac !py-2 !px-4 text-xs uppercase tracking-[0.15em]" : "btn-chrome !py-2 !px-4 text-xs uppercase tracking-[0.15em]"}
                aria-pressed={s === set}
              >
                {s}
              </button>
            ))}
          </div>
        </header>

        {/* Masonry via CSS columns: cheap, responsive, keeps the aspect ratios. */}
        <ul className="mt-12 columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4 [&>li]:mb-3 sm:[&>li]:mb-4">
          {photos.map((p, i) => (
            <li key={p.src} className="break-inside-avoid">
              <button
                onClick={() => setOpen(i)}
                className="group glass block w-full overflow-hidden !rounded-[1.4rem] !p-1.5 text-left transition-transform duration-500 hover:-translate-y-1"
                aria-label={`${p.alt} öffnen`}
              >
                <img
                  src={p.thumb}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  loading={i < 8 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full rounded-[1rem] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ aspectRatio: `${p.w} / ${p.h}` }}
                />
                <div className="flex items-center justify-between px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                  <span>{p.caption}</span>
                  <span>{p.set}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <footer className="mt-24 flex flex-col items-start justify-between gap-6 border-t pt-8 sm:flex-row sm:items-center" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <div className="display text-2xl">Pressefotos?</div>
            <p className="mt-1 text-sm opacity-70">Druckfähige Dateien auf Anfrage an {artist.booking.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/ueber" className="btn-chrome text-sm">
              Über André
            </Link>
            <Link href="/#booking" className="btn-lilac text-sm">
              Booking
            </Link>
          </div>
        </footer>
      </main>
      {open != null && photos[open] && <Lightbox photos={photos} index={open} onClose={close} onMove={move} />}
    </>
  );
}
