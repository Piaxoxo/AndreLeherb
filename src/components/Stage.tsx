"use client";

import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll, Preload } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import Scene, { PAGES } from "./scene/Scene";
import Overlay from "./Overlay";
import { useStore } from "@/store";

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
      const el = document.querySelector<HTMLElement>("[data-scroll]");
      // drei: the scrollable distance maps 0..1 onto (pages-1) sections.
      if (el) el.scrollTo({ top: (map[hash] * (el.scrollHeight - el.clientHeight)) / (PAGES - 1), behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    // Arriving from another page with a hash (/#musik): jump once the scroller exists.
    const hash = window.location.hash;
    let poll: number | undefined;
    if (hash in map && map[hash] > 0) {
      // Keep nudging while the stage boots (it resets its scroller once ready), but
      // stop at the first real user scroll or after ten seconds.
      const until = Date.now() + 10000;
      const stop = () => window.clearInterval(poll);
      window.addEventListener("wheel", stop, { once: true, passive: true });
      window.addEventListener("touchstart", stop, { once: true, passive: true });
      window.addEventListener("keydown", stop, { once: true });
      poll = window.setInterval(() => {
        const el = document.querySelector<HTMLElement>("[data-scroll]");
        if (Date.now() > until) stop();
        if (!el) return;
        const top = (map[hash] * (el.scrollHeight - el.clientHeight)) / (PAGES - 1);
        if (Math.abs(el.scrollTop - top) > 2) el.scrollTo({ top, behavior: "instant" });
      }, 200);
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.clearInterval(poll);
    };
  }, []);
  return null;
}

function MarkScroller() {
  useEffect(() => {
    // drei's ScrollControls renders a fixed, scrollable div; tag it for the anchors.
    const find = () => {
      const el = [...document.querySelectorAll<HTMLElement>("main div")].find(
        (d) => getComputedStyle(d).overflowY === "auto" && d.scrollHeight > d.clientHeight
      );
      if (el) el.dataset.scroll = "1";
      return !!el;
    };
    if (!find()) {
      const t = window.setInterval(() => find() && window.clearInterval(t), 300);
      return () => window.clearInterval(t);
    }
  }, []);
  return null;
}

export default function Stage() {
  const mobile = useStore((s) => s.mobile);
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
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
