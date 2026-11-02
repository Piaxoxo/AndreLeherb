"use client";

import { Canvas } from "@react-three/fiber";
import { Preload, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import Scene, { pagesFor } from "./scene/Scene";
import Overlay from "./Overlay";
import { ScrollDriver } from "@/lib/scroll";
import { useStore } from "@/store";

/** Where a section starts, in document scroll pixels: pages map evenly onto the scroll range. */
function sectionTop(index: number) {
  const pages = pagesFor(useStore.getState().mobile);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return (index * max) / (pages - 1);
}

/** Anchor links (#musik, #booking) scroll the document; arriving with a hash jumps once the room is ready. */
function Anchors() {
  useEffect(() => {
    const map: Record<string, number> = {
      "#": 0,
      "#mikro": 1,
      "#musik": 4,
      "#ueber": 5,
      "#booking": 6,
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href") || "#";
      if (!(hash in map)) return;
      e.preventDefault();
      window.scrollTo({ top: sectionTop(map[hash]), behavior: "smooth" });
    };
    document.addEventListener("click", onClick);

    let poll: number | undefined;
    let unsub: (() => void) | undefined;
    const hash = window.location.hash;
    if (hash in map && map[hash] > 0) {
      const stop = () => {
        window.clearInterval(poll);
        unsub?.();
      };
      window.addEventListener("wheel", stop, { once: true, passive: true });
      window.addEventListener("touchstart", stop, {
        once: true,
        passive: true,
      });
      window.addEventListener("keydown", stop, { once: true });
      const begin = () => {
        let hits = 0;
        const until = Date.now() + 6000;
        poll = window.setInterval(() => {
          if (Date.now() > until) return stop();
          const top = sectionTop(map[hash]);
          if (Math.abs(window.scrollY - top) > 2) {
            window.scrollTo({ top, behavior: "instant" });
            hits = 0;
          } else if (++hits >= 3) stop();
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
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    return () => {
      document.removeEventListener("click", onClick);
      window.clearInterval(poll);
      unsub?.();
    };
  }, []);
  return null;
}

export default function Stage() {
  const lite = useStore((s) => s.lite);
  const setLite = useStore((s) => s.setLite);
  // Safety net: if the browser throws the WebGL context away, the room is rebuilt instead of staying blank.
  const [gen, setGen] = useState(0);
  return (
    <>
      <Canvas
        key={gen}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = "pan-y";
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            useStore.getState().setReady(false);
            window.setTimeout(() => setGen((g) => g + 1), 300);
          });
        }}
        dpr={lite ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{ position: "fixed", inset: 0, zIndex: 1 }}
      >
        {/* weak GPU (older MacBooks, integrated graphics): drop to the light setup for good */}
        <PerformanceMonitor
          onDecline={() => setLite(true)}
          bounds={() => [28, 60]}
          flipflops={2}
        />
        <ScrollDriver />
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>
      {/* the HTML scrolls with the document; the canvas sits fixed behind it */}
      <div className="relative z-[2]">
        <Overlay />
      </div>
      <Anchors />
    </>
  );
}
