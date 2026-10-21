"use client";

import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import GlbModel from "./GlbModel";
import { useStore } from "@/store";

export const MIC_URL = "/models/mic.glb";

/**
 * The melted lilac microphone (Tripo model). Sways a little, pulses with
 * the beat, and goes black-violet in the glitch.
 */
export default function Mic({ size = 3, ...props }: { size?: number } & React.ComponentProps<"group">) {
  const inner = useRef<THREE.Group>(null);
  const level = useStore((s) => s.level);
  const glitch = useStore((s) => s.glitch);

  useFrame((state) => {
    if (!inner.current) return;
    const t = state.clock.elapsedTime;
    inner.current.rotation.y = Math.sin(t * 0.35) * 0.25 + state.pointer.x * 0.2;
    inner.current.rotation.z = Math.sin(t * 0.5) * 0.02;
    inner.current.scale.setScalar(1 + level.beat * 0.03);
    inner.current.position.x = glitch ? (Math.random() - 0.5) * 0.04 : 0;
  });

  return (
    <group {...props}>
      <group ref={inner}>
        <Suspense fallback={null}>
          <GlbModel url={MIC_URL} size={size} anchor="bottom" envMapIntensity={1.4} />
        </Suspense>
      </group>
    </group>
  );
}
