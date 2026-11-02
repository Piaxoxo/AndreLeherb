"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { useStore } from "@/store";

export type Ball = {
  /** Local position in -1..1 field space. */
  x: number;
  y: number;
  z: number;
  strength?: number;
  subtract?: number;
  /** Phase offset for the idle wobble. */
  phase?: number;
  /** Drip: ball slowly falls and respawns at the top. */
  drip?: boolean;
};

type Props = {
  balls: Ball[];
  resolution?: number;
  maxPoly?: number;
  /** How much the audio level inflates the balls. */
  audio?: number;
  wobble?: number;
  dripSpeed?: number;
  /** Marching-cubes isolation level; lower = fatter, more merged blobs. */
  isolation?: number;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<"group">, "children">;

/**
 * Metaballs (marching cubes) with local-space ball coordinates, so the
 * mesh can be placed anywhere in the scene. Used for the lilac "liquid"
 * and the chrome drips.
 */
export default function Blobs({
  balls,
  resolution = 40,
  maxPoly = 30000,
  audio = 0.6,
  wobble = 0.08,
  dripSpeed = 0.12,
  isolation = 80,
  children,
  ...group
}: Props) {
  const mc = useMemo(() => {
    const m = new MarchingCubes(resolution, new THREE.MeshBasicMaterial(), false, false, maxPoly);
    m.isolation = isolation;
    return m;
  }, [resolution, maxPoly, isolation]);

  // Stagger the drips deterministically so each falls at its own time.
  const state = useRef(balls.map((b, i) => ({ ...b, t: (i * 0.37) % 1 })));
  const level = useStore((s) => s.level);

  useFrame((_, dt) => {
    const time = performance.now() / 1000;
    mc.reset();
    const amp = 1 + level.value * audio + level.beat * audio * 0.6;
    for (const b of state.current) {
      const ph = b.phase ?? 0;
      let y = b.y;
      if (b.drip) {
        b.t += dt * dripSpeed;
        if (b.t > 1) b.t = 0;
        // Ease out: starts slow at the top, accelerates down, respawns.
        y = b.y - b.t * b.t * 1.6;
      }
      const wx = Math.sin(time * 0.9 + ph) * wobble;
      const wy = Math.cos(time * 0.7 + ph * 1.3) * wobble;
      const wz = Math.sin(time * 1.1 + ph * 0.7) * wobble;
      const s = (b.strength ?? 0.5) * amp;
      mc.addBall(0.5 + (b.x + wx) * 0.5, 0.5 + (y + wy) * 0.5, 0.5 + (b.z + wz) * 0.5, s, b.subtract ?? 12);
    }
    mc.update();
  });

  return (
    <group {...group}>
      <primitive object={mc}>{children}</primitive>
    </group>
  );
}
