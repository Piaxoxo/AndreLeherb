"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Nav, Tear } from "@/components/Chrome";
import { useStore } from "@/store";

const FRAMES = 124;
const src = (i: number) => `/scrub/f${String(i + 1).padStart(3, "0")}.webp`;

export default function Mikro() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>(Array(FRAMES).fill(null));
  const [loaded, setLoaded] = useState(0);
  const [progress, setProgress] = useState(0);
  const restoreTakeover = useStore((s) => s.restoreTakeover);

  useEffect(() => {
    restoreTakeover();
  }, [restoreTakeover]);

  // Load the first frame first, then the rest in a sparse-to-dense order so scrubbing works early.
  useEffect(() => {
    let alive = true;
    const order: number[] = [0];
    for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < FRAMES; i += step) if (!order.includes(i)) order.push(i);
    let n = 0;
    const next = () => {
      if (!alive || n >= order.length) return;
      const i = order[n++];
      const img = new Image();
      img.onload = img.onerror = () => {
        if (!alive) return;
        frames.current[i] = img;
        setLoaded((c) => c + 1);
        next();
      };
      img.src = src(i);
    };
    // four parallel lanes
    next();
    next();
    next();
    next();
    return () => {
      alive = false;
    };
  }, []);

  // Scroll → progress
  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, -r.top / Math.max(1, total))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Draw the nearest loaded frame, object-fit: contain, with device pixel ratio.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const want = Math.round(progress * (FRAMES - 1));
    let i = want;
    // fall back to the nearest frame that has arrived
    for (let d = 0; d < FRAMES && !frames.current[i]; d++) i = want + (d % 2 ? d : -d);
    const img = frames.current[i];
    if (!img) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = c.clientWidth * dpr;
    const H = c.clientHeight * dpr;
    if (c.width !== W || c.height !== H) {
      c.width = W;
      c.height = H;
    }
    const g = c.getContext("2d")!;
    g.fillStyle = "#000";
    g.fillRect(0, 0, W, H);
    const s = Math.min(W / img.width, H / img.height);
    const w = img.width * s;
    const h = img.height * s;
    g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }, [progress, loaded]);

  return (
    <>
      <Nav dark />
      <Tear />
      <main className="bg-black text-white">
        <div ref={wrap} className="relative" style={{ height: "520vh" }}>
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <canvas ref={canvas} className="h-full w-full" aria-label="Das Mikrofon zerlegt sich beim Scrollen" />
            {/* film-like vignette and a soft lilac glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.6) 100%)" }}
            />
            {/* progress hairline */}
            <div aria-hidden className="pointer-events-none absolute right-5 top-[20vh] h-[60vh] w-px bg-white/15 sm:right-10 lg:right-16">
              <div className="w-px" style={{ height: `${progress * 100}%`, background: "var(--lilac)", boxShadow: "0 0 12px var(--lilac)" }} />
            </div>
            {/* scroll hint at the start */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 transition-opacity duration-500"
              style={{ opacity: progress < 0.02 ? 1 : 0 }}
            >
              Scroll
            </div>
            {loaded < 8 && (
              <div className="absolute inset-x-0 top-1/2 text-center text-xs font-bold uppercase tracking-[0.3em] opacity-60">Lädt …</div>
            )}
          </div>
        </div>
        <footer className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center sm:px-10 lg:px-16">
          <div>
            <div className="display text-2xl">Wieder ganz.</div>
            <p className="mt-1 text-sm opacity-70">Zurück in den Raum, oder gleich zum Booking.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="btn-chrome text-sm">
              Startseite
            </Link>
            <Link href="/#booking" className="btn-lilac text-sm">
              Buch mich
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
