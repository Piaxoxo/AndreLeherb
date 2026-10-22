"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store";

const FRAMES = 248;
const src = (i: number) => `/scrub/f${String(i + 1).padStart(3, "0")}.webp`;

/**
 * The mic film as a scroll scrub, in a fixed layer over the 3D room. The scene
 * writes the scroll progress into data-p; this component eases toward it every
 * frame and draws the nearest loaded image, so scrubbing stays fluid even while
 * frames are still arriving.
 */
export default function MicScrub() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  // frames load only once the room is up, so they never compete with the 3D build
  const ready = useStore((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const frames: (HTMLImageElement | null)[] = Array(FRAMES).fill(null);
    let alive = true;

    // sparse-to-dense loading so the scrub works after a handful of images
    const order: number[] = [];
    for (const step of [32, 16, 8, 4, 2, 1]) for (let i = 0; i < FRAMES; i += step) if (!order.includes(i)) order.push(i);
    let n = 0;
    const next = () => {
      if (!alive || n >= order.length) return;
      const i = order[n++];
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        if (!alive) return;
        frames[i] = img;
        next();
      };
      img.src = src(i);
    };
    for (let k = 0; k < 6; k++) next();

    let shown = -1;
    let p = 0;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const el = root.current;
      const c = canvas.current;
      if (!el || !c || el.style.visibility === "hidden") return;
      const target = Number(el.dataset.p || 0);
      // ease toward the scroll position; snap when close so the last frame lands exactly
      p += (target - p) * 0.22;
      if (Math.abs(target - p) < 0.0005) p = target;
      const want = Math.round(p * (FRAMES - 1));
      let i = want;
      for (let d = 0; d < FRAMES && !frames[i]; d++) i = Math.min(FRAMES - 1, Math.max(0, want + (d % 2 ? d : -d)));
      const img = frames[i];
      if (!img) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.round(c.clientWidth * dpr);
      const H = Math.round(c.clientHeight * dpr);
      const resized = c.width !== W || c.height !== H;
      if (resized) {
        c.width = W;
        c.height = H;
      }
      if (i === shown && !resized) return;
      shown = i;
      const g = c.getContext("2d")!;
      g.fillStyle = "#000";
      g.fillRect(0, 0, W, H);
      const s = Math.min(W / img.width, H / img.height);
      const w = img.width * s;
      const h = img.height * s;
      g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [ready]);

  return (
    <div
      id="mic-scrub"
      ref={root}
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{ opacity: 0, visibility: "hidden", background: "#000", transition: "opacity .15s linear" }}
      aria-hidden
    >
      <canvas ref={canvas} className="h-full w-full" />
    </div>
  );
}
