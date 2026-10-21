"use client";

import { useVideoTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/store";

const DEPTH = -4.5;

/** Radial fade from clear in the middle to the room colour at the edges, so the film sits in the room instead of on it. */
function useVignette(color: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(256, 256, 60, 256, 256, 300);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.38, "rgba(0,0,0,0)");
    grad.addColorStop(1, color);
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [color]);
}

function Film() {
  const glitch = useStore((s) => s.glitch);
  const { viewport, camera } = useThree();
  const tex = useVideoTexture("/video/ballroom.mp4", { muted: true, loop: true, start: true, playsInline: true, crossOrigin: "anonymous" });
  const vignette = useVignette(glitch ? "rgba(5,3,8,1)" : "rgba(246,244,249,1)");
  // size of the view at the film's depth, covered like CSS object-fit: cover
  const v = viewport.getCurrentViewport(camera, [0, 0, DEPTH]);
  const h = Math.max(v.height, (v.width * 9) / 16) * 1.08;
  const w = (h * 16) / 9;
  return (
    <group position={[0, 0.2, DEPTH]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        {/* a little see-through so the pale room keeps the film pastel and the logo readable */}
        <meshBasicMaterial map={tex} color={glitch ? "#4a2a66" : "#f1edf6"} transparent opacity={glitch ? 0.85 : 0.7} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]} scale={[Math.max(v.width, w) * 1.2, Math.max(v.height, h) * 1.2, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={vignette} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function HeroFilm() {
  return (
    <Suspense fallback={null}>
      <Film />
    </Suspense>
  );
}
