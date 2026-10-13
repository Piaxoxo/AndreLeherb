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
    const map: Record<string, number> = { "#": 0, "#musik": 1, "#ueber": 2, "#booking": 3 };
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
    return () => document.removeEventListener("click", onClick);
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
        alpha: false,
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
