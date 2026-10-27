"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Studio } from "@/components/scene/Scene";
import { ChromeSphere, GlassDrop } from "@/components/scene/Props";
import { GlassBuffer } from "@/components/scene/materials";
import { useStore } from "@/store";

/** The camera drifts with the document scroll so the room feels continuous while reading. */
function ScrollRig() {
  const target = useRef(new THREE.Vector3(0, 0, 9));
  useFrame((state, dt) => {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const p = window.scrollY / max;
    target.current.set(
      state.pointer.x * 0.2,
      -p * 6 + state.pointer.y * 0.1,
      9,
    );
    state.camera.position.lerp(target.current, 1 - Math.exp(-dt * 5));
    state.camera.lookAt(
      state.camera.position.x * 0.5,
      state.camera.position.y,
      0,
    );
  });
  return null;
}

function Room() {
  const { viewport } = useThree();
  const X = (f: number) => (viewport.width / 2) * f;
  return (
    <GlassBuffer>
      <Studio />
      <ScrollRig />
      <ChromeSphere r={0.5} position={[X(-0.8), 2.2, -2]} />
      <ChromeSphere r={0.2} position={[X(0.6), 2.6, -1]} />
      <GlassDrop r={0.4} position={[X(0.85), 0.4, -1]} />
      <ChromeSphere r={0.3} position={[X(-0.7), -2.4, -1.5]} />
      <GlassDrop r={0.3} position={[X(-0.2), -4.2, 0]} />
      <ChromeSphere r={0.42} position={[X(0.8), -5.4, -2]} />
      <GlassDrop r={0.36} position={[X(-0.85), -7.2, -1]} />
      <ChromeSphere r={0.24} position={[X(0.3), -8.6, 0.5]} />
    </GlassBuffer>
  );
}

/** A quiet version of the 3D room behind the text pages. */
export default function Backdrop() {
  const setDevice = useStore((s) => s.setDevice);
  const restoreTakeover = useStore((s) => s.restoreTakeover);
  const isStatic = useStore((s) => s.a11y.static);
  useEffect(() => {
    restoreTakeover();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setDevice({ reduced: mq.matches, mobile: window.innerWidth < 768 });
  }, [setDevice, restoreTakeover]);
  if (isStatic) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Room />
      </Canvas>
    </div>
  );
}
