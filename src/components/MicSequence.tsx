"use client";

import { useEffect, useRef } from "react";

/** Every 4th frame of the exploded-mic film: 62 images, about 1.2 MB, shared by the loader and the page transition. */
const STEP = 4;
const TOTAL = 248;
export const SEQ = Array.from({ length: Math.ceil(TOTAL / STEP) }, (_, i) => `/scrub/f${String(i * STEP + 1).padStart(3, "0")}.webp`);

const cache: (HTMLImageElement | null)[] = Array(SEQ.length).fill(null);
let warmed = false;

/** Load the sequence into memory (idempotent). Called at idle after the first page is up. */
export function warmSequence() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  SEQ.forEach((src, i) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      cache[i] = img;
    };
    img.src = src;
  });
}

/**
 * Plays the mic exploding and reassembling (forward, then backward) on a canvas.
 * `speed` is frames per second; it loops until unmounted.
 */
export default function MicSequence({ className, speed = 36 }: { className?: string; speed?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    warmSequence();
    let raf = 0;
    let shown = -1;
    const start = performance.now();
    const n = SEQ.length;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const c = canvas.current;
      if (!c) return;
      // ping-pong through the frames
      const f = Math.floor(((performance.now() - start) / 1000) * speed) % (2 * n - 2);
      const i = f < n ? f : 2 * n - 2 - f;
      // nearest loaded frame
      let j = i;
      for (let d = 0; d < n && !cache[j]; d++) j = Math.min(n - 1, Math.max(0, i + (d % 2 ? d : -d)));
      const img = cache[j];
      if (!img || j === shown) return;
      shown = j;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.round(c.clientWidth * dpr);
      const H = Math.round(c.clientHeight * dpr);
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
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return <canvas ref={canvas} className={className} aria-hidden />;
}
