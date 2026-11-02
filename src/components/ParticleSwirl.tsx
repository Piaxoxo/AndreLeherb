"use client";

import { useEffect, useRef } from "react";

/**
 * Particle Image Swirl — turns an image into a living particle field.
 * Thousands of image-sampled particles drift on a flow field, swirl apart
 * on an automatic cycle, then snap back to reform the picture. Cursor /
 * touch drag pushes particles throughout. Zero dependencies, canvas 2D.
 *
 * Production notes: DPR capped, pauses when offscreen, alpha-aware
 * sampling (cut-outs and logos work), procedural fallback if the image
 * cannot be read (CORS), still frame for reduced-motion users, and a
 * static <img> fallback underneath for thumbnails / SEO.
 */
export type ParticleSwirlProps = {
  /** Image source (same-origin or CORS-enabled). */
  image: string;
  /** Optional override, e.g. from a CMS. Wins over `image` when set. */
  imageUrl?: string;
  fit?: "contain" | "cover";
  particleCount?: number;
  particleSize?: number;
  particleShape?: "circle" | "square" | "line";
  particleOpacity?: number;
  blendMode?: GlobalCompositeOperation;
  /** Global time multiplier. */
  speed?: number;
  /** Automatically swirl apart and reassemble. */
  autoCycle?: boolean;
  /** Seconds for one full cycle (held + dispersed). */
  cycleDuration?: number;
  /** 0..1 how far particles disperse. */
  disperse?: number;
  /** Swirl (rotational) force while dispersed. */
  swirl?: number;
  /** Spring strength pulling particles home. */
  reassembleSpring?: number;
  /** Flow-field noise scale (bigger = broader curls). */
  flowScale?: number;
  /** Flow-field force. */
  flowForce?: number;
  /** Velocity damping 0..1. */
  damping?: number;
  /** Seconds a particle lives before respawning at home (0 = immortal). */
  lifespan?: number;
  /** Cursor push force. */
  cursorForce?: number;
  /** Cursor radius in px. */
  cursorRadius?: number;
  background?: string;
  /** Corner radius of the frame in px. */
  radius?: number;
  maxDpr?: number;
  paused?: boolean;
  /** Calm mode: no cycle, gentle drift. Auto-enabled by prefers-reduced-motion. */
  calm?: boolean;
  /** Tints particles (multiplied with sampled colour), e.g. for a dark mode. */
  tint?: string;
  /** External "burst" trigger: increment to disperse immediately. */
  burst?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
};

type P = {
  hx: number;
  hy: number; // home
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  a: number;
  life: number;
  seed: number;
};

// Cheap 2D value-noise for the flow field.
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function parseTint(t?: string): [number, number, number] | null {
  if (!t) return null;
  const m = t.replace("#", "");
  if (m.length !== 6) return null;
  return [parseInt(m.slice(0, 2), 16) / 255, parseInt(m.slice(2, 4), 16) / 255, parseInt(m.slice(4, 6), 16) / 255];
}

export default function ParticleSwirl({
  image,
  imageUrl,
  fit = "contain",
  particleCount = 9000,
  particleSize = 1.6,
  particleShape = "circle",
  particleOpacity = 0.95,
  blendMode = "source-over",
  speed = 1,
  autoCycle = true,
  cycleDuration = 9,
  disperse = 0.7,
  swirl = 1.2,
  reassembleSpring = 0.06,
  flowScale = 220,
  flowForce = 0.35,
  damping = 0.9,
  lifespan = 0,
  cursorForce = 2.4,
  cursorRadius = 110,
  background = "transparent",
  radius = 0,
  maxDpr = 1.5,
  paused = false,
  calm,
  tint,
  burst = 0,
  className,
  style,
  alt = "",
}: ParticleSwirlProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const live = {
    speed, autoCycle, cycleDuration, disperse, swirl, reassembleSpring, flowScale, flowForce, damping, lifespan,
    cursorForce, cursorRadius, particleSize, particleShape, particleOpacity, blendMode, background, calm, tint, paused, burst,
  };
  const propsRef = useRef(live);
  // Keep the animation loop reading the latest props without restarting it.
  useEffect(() => {
    propsRef.current = live;
  });
  const burstRef = useRef(burst);

  const src = imageUrl || image;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: P[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    let last = t0;
    let phase = 0; // 0 = assembled, 1 = dispersed
    let burstUntil = 0;
    const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, down: false, active: false };
    let sampled: { data: Uint8ClampedArray; iw: number; ih: number } | null = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      if (sampled) build();
    };

    // Sample the image into particles.
    const build = () => {
      if (!sampled) return;
      const { data, iw, ih } = sampled;
      const scale = fit === "cover" ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const ox = (w - dw) / 2;
      const oy = (h - dh) / 2;
      // Collect opaque pixel candidates on a coarse grid, then sample N.
      const cand: number[] = [];
      const step = Math.max(1, Math.floor(Math.sqrt((iw * ih) / (particleCount * 3))));
      for (let y = 0; y < ih; y += step) {
        for (let x = 0; x < iw; x += step) {
          const i = (y * iw + x) * 4;
          if (data[i + 3] > 40) cand.push(i);
        }
      }
      const next: P[] = [];
      const n = Math.min(particleCount, cand.length);
      for (let k = 0; k < n; k++) {
        const i = cand[Math.floor(Math.random() * cand.length)];
        const px = (i / 4) % iw;
        const py = Math.floor(i / 4 / iw);
        const hx = ox + (px + Math.random()) * scale;
        const hy = oy + (py + Math.random()) * scale;
        const old = particles[k];
        next.push({
          hx, hy,
          x: old ? old.x : hx + (Math.random() - 0.5) * w,
          y: old ? old.y : hy + (Math.random() - 0.5) * h,
          vx: 0, vy: 0,
          r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] / 255,
          life: Math.random(),
          seed: Math.random() * 1000,
        });
      }
      particles = next;
    };

    const procedural = () => {
      // CORS-safe fallback: a lilac/silver gradient disc so it never renders empty.
      const iw = 256, ih = 256;
      const off = document.createElement("canvas");
      off.width = iw; off.height = ih;
      const c = off.getContext("2d")!;
      const g = c.createRadialGradient(iw / 2, ih / 2, 10, iw / 2, ih / 2, iw / 2);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.6, "#c4b1ff");
      g.addColorStop(1, "#4b2c9a");
      c.fillStyle = g;
      c.beginPath();
      c.arc(iw / 2, ih / 2, iw / 2 - 2, 0, Math.PI * 2);
      c.fill();
      sampled = { data: c.getImageData(0, 0, iw, ih).data, iw, ih };
      build();
    };

    const load = () => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => {
        try {
          const maxSide = 420;
          const s = Math.min(1, maxSide / Math.max(im.naturalWidth, im.naturalHeight));
          const iw = Math.max(1, Math.floor(im.naturalWidth * s));
          const ih = Math.max(1, Math.floor(im.naturalHeight * s));
          const off = document.createElement("canvas");
          off.width = iw; off.height = ih;
          const c = off.getContext("2d", { willReadFrequently: true })!;
          c.drawImage(im, 0, 0, iw, ih);
          sampled = { data: c.getImageData(0, 0, iw, ih).data, iw, ih };
          build();
        } catch {
          procedural();
        }
      };
      im.onerror = procedural;
      im.src = src;
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const p = propsRef.current;
      if (!visible || p.paused) return;
      const dt = Math.min(0.05, (now - last) / 1000) * p.speed;
      last = now;
      const time = (now - t0) / 1000 * p.speed;
      const isCalm = p.calm ?? reduced;

      if (p.burst !== burstRef.current) {
        burstRef.current = p.burst;
        burstUntil = now + 1800;
      }

      // Cycle: hold assembled for 60% of the cycle, dispersed for 40%.
      let target = 0;
      if (now < burstUntil) target = 1;
      else if (p.autoCycle && !isCalm) {
        const u = (time % p.cycleDuration) / p.cycleDuration;
        target = u > 0.6 ? 1 : 0;
      }
      phase += (target - phase) * (target > phase ? 0.08 : 0.03);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      if (p.background !== "transparent") {
        ctx.fillStyle = p.background;
        ctx.fillRect(0, 0, w, h);
      }
      if (radius > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, radius);
        ctx.clip();
      }
      ctx.globalCompositeOperation = p.blendMode;

      const tintRGB = parseTint(p.tint);
      const cx = w / 2;
      const cy = h / 2;
      const fs = p.flowScale;
      const size = p.particleSize;
      const half = size / 2;
      const spring = p.reassembleSpring * (1 - phase * 0.95);
      const drift = isCalm ? 0.25 : 1;
      const dampK = Math.pow(p.damping, dt * 60);

      for (let i = 0; i < particles.length; i++) {
        const q = particles[i];
        // Flow field.
        const nx = q.x / fs;
        const ny = q.y / fs;
        const ang = noise(nx + time * 0.08, ny - time * 0.05) * Math.PI * 4;
        const f = p.flowForce * (0.25 + phase) * drift;
        q.vx += Math.cos(ang) * f * dt * 60;
        q.vy += Math.sin(ang) * f * dt * 60;
        // Swirl around the centre while dispersed.
        if (phase > 0.01) {
          const dx = q.x - cx;
          const dy = q.y - cy;
          const d = Math.hypot(dx, dy) + 1;
          const sw = p.swirl * phase * p.disperse;
          q.vx += (-dy / d) * sw * dt * 60 + (dx / d) * sw * 0.35 * dt * 60;
          q.vy += (dx / d) * sw * dt * 60 + (dy / d) * sw * 0.35 * dt * 60;
        }
        // Spring home.
        q.vx += (q.hx - q.x) * spring * dt * 60;
        q.vy += (q.hy - q.y) * spring * dt * 60;
        // Cursor.
        if (pointer.active) {
          const dx = q.x - pointer.x;
          const dy = q.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const r = p.cursorRadius;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) + 0.01;
            const k = (1 - d / r) * p.cursorForce * (pointer.down ? 2 : 1);
            q.vx += (dx / d) * k * dt * 60 + (pointer.x - pointer.px) * 0.15 * k;
            q.vy += (dy / d) * k * dt * 60 + (pointer.y - pointer.py) * 0.15 * k;
          }
        }
        q.vx *= dampK;
        q.vy *= dampK;
        q.x += q.vx * dt * 60;
        q.y += q.vy * dt * 60;
        // Lifespan.
        if (p.lifespan > 0) {
          q.life += dt / p.lifespan;
          if (q.life > 1) {
            q.life = 0;
            q.x = q.hx;
            q.y = q.hy;
            q.vx = q.vy = 0;
          }
        }
        // Draw.
        let r = q.r, g = q.g, b = q.b;
        if (tintRGB) {
          r = Math.round(r * tintRGB[0]);
          g = Math.round(g * tintRGB[1]);
          b = Math.round(b * tintRGB[2]);
        }
        const alpha = q.a * p.particleOpacity * (p.lifespan > 0 ? Math.sin(q.life * Math.PI) : 1);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        if (p.particleShape === "circle") {
          ctx.beginPath();
          ctx.arc(q.x, q.y, half, 0, 6.2832);
          ctx.fill();
        } else if (p.particleShape === "square") {
          ctx.fillRect(q.x - half, q.y - half, size, size);
        } else {
          ctx.fillRect(q.x - half, q.y - half * 0.4, size + Math.abs(q.vx) * 2, size * 0.4);
        }
      }
      if (radius > 0) ctx.restore();
      pointer.px = pointer.x;
      pointer.py = pointer.y;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.down = false;
    };
    const onDown = (e: PointerEvent) => {
      pointer.down = true;
      onMove(e);
    };
    const onUp = () => (pointer.down = false);

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) last = performance.now();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    resize();
    load();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
    };
    // Rebuild only when the image / sampling inputs change; everything else is live via propsRef.
  }, [src, fit, particleCount, maxDpr, radius]);

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      {/* Static fallback for SEO / thumbnails / no-JS. */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        aria-hidden={alt === ""}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit, opacity: 0, pointerEvents: "none" }}
      />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "pan-y" }} />
    </div>
  );
}
