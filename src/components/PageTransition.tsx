"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MicSequence, { warmSequence } from "./MicSequence";

const MIN_MS = 900;

/**
 * Between pages: a black curtain with the mic coming apart. Internal link clicks
 * are intercepted, the curtain plays for at least MIN_MS and lifts once the new
 * route has rendered.
 */
export default function PageTransition() {
  const router = useRouter();
  const [on, setOn] = useState(false);
  const since = useRef(0);
  const pending = useRef<string | null>(null);

  // warm the frames once the first page is up
  useEffect(() => {
    const id = window.setTimeout(warmSequence, 2500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      const url = new URL(href, window.location.href);
      const samePage = url.pathname === window.location.pathname;
      if (samePage && url.hash) return; // in-page anchors scroll, no curtain
      if (samePage) return;
      e.preventDefault();
      pending.current = href;
      since.current = performance.now();
      setOn(true);
      const target = url.pathname;
      window.setTimeout(() => router.push(href), 350);
      // lift once the address has changed (or after 4 s, whatever happens), never before MIN_MS
      const t0 = performance.now();
      const tick = () => {
        const arrived = window.location.pathname === target;
        const elapsed = performance.now() - t0;
        if ((arrived && elapsed >= MIN_MS) || elapsed > 4000) {
          pending.current = null;
          setOn(false);
          return;
        }
        window.setTimeout(tick, 60);
      };
      window.setTimeout(tick, 60);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[95] bg-black transition-opacity duration-300"
      style={{ opacity: on ? 1 : 0, visibility: on ? "visible" : "hidden", transitionProperty: "opacity, visibility" }}
      aria-hidden
    >
      {on && <MicSequence className="h-full w-full" speed={60} />}
    </div>
  );
}
