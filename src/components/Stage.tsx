"use client";

import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll, Preload } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import Scene, { PAGES } from "./scene/Scene";
import Overlay from "./Overlay";
import { useStore } from "@/store";

/** drei's ScrollControls renders a fixed, scrollable div; find it live (it can be re-created while the room loads). */
function getScroller(): HTMLElement | null {
  const tagged = document.querySelector<HTMLElement>("[data-scroll]");
  if (tagged && tagged.isConnected && tagged.scrollHeight > tagged.clientHeight) return tagged;
  const el = [...document.querySelectorAll<HTMLElement>("main div")].find(
    (d) => getComputedStyle(d).overflowY === "auto" && d.scrollHeight > d.clientHeight
  );
  if (el) el.dataset.scroll = "1";
  return el ?? null;
}

/** Anchor links (#musik, #booking) scroll the drei scroll container. */
function Anchors() {
  useEffect(() => {
    const map: Record<string, number> = { "#": 0, "#mikro": 1, "#musik": 4, "#ueber": 5, "#booking": 6 };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href") || "#";
      if (!(hash in map)) return;
      e.preventDefault();
      const el = getScroller();
      // drei: the scrollable distance maps 0..1 onto (pages-1) sections.
      if (el) el.scrollTo({ top: (map[hash] * (el.scrollHeight - el.clientHeight)) / (PAGES - 1), behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    // Arriving from another page with a hash (/#booking): once the room is ready, jump there.
    // A few nudges cover drei resetting its scroller while it settles; any user input ends it.
    const hash = window.location.hash;
    let poll: number | undefined;
    let unsub: (() => void) | undefined;
    if (hash in map && map[hash] > 0) {
      const stop = () => {
        window.clearInterval(poll);
        unsub?.();
      };
      window.addEventListener("wheel", stop, { once: true, passive: true });
      window.addEventListener("touchstart", stop, { once: true, passive: true });
      window.addEventListener("keydown", stop, { once: true });
      const begin = () => {
        let hits = 0;
        const until = Date.now() + 8000;
        poll = window.setInterval(() => {
          const el = getScroller();
          if (Date.now() > until) return stop();
          if (!el) return;
          const top = (map[hash] * (el.scrollHeight - el.clientHeight)) / (PAGES - 1);
          if (Math.abs(el.scrollTop - top) > 2) {
            el.scrollTo({ top, behavior: "instant" });
            hits = 0;
          } else if (++hits >= 4) stop();
        }, 150);
      };
      if (useStore.getState().ready) begin();
      else
        unsub = useStore.subscribe((st, prev) => {
          if (st.ready && !prev.ready) {
            unsub?.();
            begin();
          }
        });
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.clearInterval(poll);
      unsub?.();
    };
  }, []);
  return null;
}

function MarkScroller() {
  useEffect(() => {
    // Tag the scroller for CSS hooks; keep re-checking for a while in case it gets re-created.
    const until = Date.now() + 15000;
    const t = window.setInterval(() => {
      getScroller();
      if (Date.now() > until) window.clearInterval(t);
    }, 400);
    getScroller();
    return () => window.clearInterval(t);
  }, []);
  return null;
}

export default function Stage() {
  const mobile = useStore((s) => s.mobile);
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <ScrollControls pages={PAGES} damping={0.22} distance={1}>
          <Scene />
          <Scroll html style={{ width: "100%" }}>
            <Overlay />
          </Scroll>
        </ScrollControls>
        <Preload all />
      </Suspense>
      <Anchors />
      <MarkScroller />
    </Canvas>
  );
}
