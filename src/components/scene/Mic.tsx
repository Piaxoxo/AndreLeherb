"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Blobs from "./Blobs";
import { Chrome, Lilac } from "./materials";
import { useStore } from "@/store";

/**
 * Stylised vintage chrome microphone with lilac lacquer dripping over
 * the head (the reference board's melting mic).
 */
export default function Mic(props: React.ComponentProps<"group">) {
  const head = useRef<THREE.Group>(null);
  const glitch = useStore((s) => s.glitch);
  const level = useStore((s) => s.level);

  useFrame((state) => {
    if (!head.current) return;
    const t = state.clock.elapsedTime;
    head.current.rotation.z = Math.sin(t * 0.5) * 0.04;
    const s = 1 + level.beat * 0.04;
    head.current.scale.setScalar(s);
  });

  return (
    <group {...props}>
      {/* Head */}
      <group ref={head} position={[0, 0.9, 0]}>
        <mesh scale={[0.72, 1, 0.62]}>
          <sphereGeometry args={[0.7, 48, 48]} />
          <Chrome dark={glitch} roughness={0.1} />
        </mesh>
        {/* Grill ribs */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = -0.42 + i * 0.17;
          const r = Math.sqrt(Math.max(0.01, 0.49 - y * y));
          return (
            <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.74, 0.64, 1]}>
              <torusGeometry args={[r, 0.014, 8, 64]} />
              <meshStandardMaterial color={glitch ? "#111" : "#1a1a1f"} metalness={0.8} roughness={0.4} />
            </mesh>
          );
        })}
        {/* Lilac drip over the head */}
        {/* Lacquer poured over the head: a cap that hugs the top, drips down the sides. */}
        <Blobs
          position={[0, 0.05, 0]}
          scale={[1.1, 1.2, 1.0]}
          resolution={48}
          isolation={34}
          audio={0.5}
          wobble={0.02}
          dripSpeed={0.07}
          balls={[
            { x: 0, y: 0.42, z: 0, strength: 1.4, subtract: 8 },
            { x: -0.32, y: 0.3, z: 0.28, strength: 0.55, phase: 1 },
            { x: 0.34, y: 0.3, z: -0.22, strength: 0.55, phase: 2 },
            { x: 0.08, y: 0.28, z: 0.46, strength: 0.5, phase: 3 },
            { x: -0.18, y: 0.28, z: -0.46, strength: 0.5, phase: 3.5 },
            { x: 0.38, y: 0.26, z: 0.3, strength: 0.42, phase: 1.5 },
            { x: -0.4, y: 0.26, z: -0.2, strength: 0.42, phase: 2.5 },
            { x: -0.5, y: 0.2, z: 0.05, strength: 0.3, phase: 4, drip: true },
            { x: 0.48, y: 0.15, z: 0.25, strength: 0.28, phase: 5, drip: true },
            { x: 0.1, y: 0.15, z: -0.5, strength: 0.26, phase: 6, drip: true },
            { x: -0.12, y: 0.12, z: 0.52, strength: 0.24, phase: 7, drip: true },
          ]}
        >
          <Lilac glitch={glitch} />
        </Blobs>
      </group>
      {/* Yoke + neck */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.5, 32]} />
        <Chrome dark={glitch} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.075, 0.09, 1.1, 24]} />
        <Chrome dark={glitch} />
      </mesh>
      {/* Switch block */}
      <mesh position={[0, -0.32, 0.12]}>
        <boxGeometry args={[0.26, 0.42, 0.16]} />
        <meshStandardMaterial color="#15151a" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 0.12, 48]} />
        <Chrome dark={glitch} roughness={0.15} />
      </mesh>
    </group>
  );
}
