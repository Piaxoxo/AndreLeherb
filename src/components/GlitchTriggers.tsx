"use client";

import { useEffect } from "react";
import { useStore } from "@/store";

/**
 * The hidden ways to wake the twin, on every page:
 * - type "247" (24/7) anywhere
 * - click the logo three times quickly
 * - shake the phone
 * - scroll wildly: a short twitch
 * - sit still for 45 s: the page flickers by itself
 * - minute :47 of any hour (2:47, 24/7): the twin shows up unasked
 * Every glitch counts; at the sixth the twin takes the site.
 */
export default function GlitchTriggers() {
  useEffect(() => {
    const fire = (ms?: number, silent?: boolean) => {
      const s = useStore.getState();
      if (!s.a11y.motion || s.takeover) return;
      if (!silent && s.glitchCount >= 5 && !s.glitch) {
        s.takeOver();
        return;
      }
      s.triggerGlitch(ms, silent);
    };

    // 1 · typed "247"
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      typed = (typed + e.key).slice(-3);
      if (typed === "247") {
        typed = "";
        fire();
      }
    };

    // 2 · triple click on the logo
    let clicks = 0;
    let clickT = 0;
    const onClick = (e: MouseEvent) => {
      const logo = (e.target as HTMLElement).closest(
        "a[aria-label='Andre Leherb, Start']",
      );
      if (!logo) return;
      const now = performance.now();
      clicks = now - clickT < 600 ? clicks + 1 : 1;
      clickT = now;
      if (clicks >= 3) {
        e.preventDefault();
        e.stopPropagation();
        clicks = 0;
        fire();
      } else if (clicks === 2) {
        // give the third click a chance: hold the navigation for a moment
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3 · shake
    let lastShake = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const g = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0);
      if (g > 28 && performance.now() - lastShake > 4000) {
        lastShake = performance.now();
        fire();
      }
    };

    // 4 · wild scrolling → short silent twitch
    let wheelSum = 0;
    let wheelT = 0;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      wheelSum =
        now - wheelT < 120 ? wheelSum + Math.abs(e.deltaY) : Math.abs(e.deltaY);
      wheelT = now;
      if (wheelSum > 3200) {
        wheelSum = 0;
        fire(180, true);
      }
    };

    // 5 · idle: after 45 s without input the page flickers by itself
    let idle: number | undefined;
    const armIdle = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(
        () => {
          fire(160, true);
          armIdle();
        },
        45000 + Math.random() * 30000,
      );
    };
    const onAny = () => armIdle();

    // 6 · minute :47
    let lastMinute = -1;
    const clock = window.setInterval(() => {
      const m = new Date().getMinutes();
      if (m === 47 && lastMinute !== 47) fire(3200);
      lastMinute = m;
    }, 15000);

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    window.addEventListener("devicemotion", onMotion);
    window.addEventListener("wheel", onWheel, { passive: true });
    for (const ev of ["pointerdown", "keydown", "wheel", "touchstart"] as const)
      window.addEventListener(ev, onAny, { passive: true });
    armIdle();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("devicemotion", onMotion);
      window.removeEventListener("wheel", onWheel);
      for (const ev of [
        "pointerdown",
        "keydown",
        "wheel",
        "touchstart",
      ] as const)
        window.removeEventListener(ev, onAny);
      window.clearTimeout(idle);
      window.clearInterval(clock);
    };
  }, []);
  return null;
}

/** The credo with "silbergrau" as a secret trigger: click the word and the twin answers. */
export function Credo({ text }: { text: string }) {
  const trigger = useStore((s) => s.triggerGlitch);
  const m = /silbergrau|silver-grey/i.exec(text);
  if (!m) return <>{text}</>;
  const i = m.index;
  return (
    <>
      {text.slice(0, i)}
      <span
        role="presentation"
        className="glitch-word"
        title="psst"
        onClick={() => trigger()}
      >
        {text.slice(i, i + m[0].length)}
      </span>
      {text.slice(i + m[0].length)}
    </>
  );
}
