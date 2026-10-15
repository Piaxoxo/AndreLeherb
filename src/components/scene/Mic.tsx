"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import Blobs from "./Blobs";
import { Chrome, Lilac } from "./materials";
import { useStore } from "@/store";

/**
 * A classic 1950s "Elvis" microphone (Shure 55 silhouette): the bulbous
 * chrome head with vertical grille ribs, a chrome swivel yoke, a slim neck
 * and a heavy round base, with lilac lacquer poured over the top.
 */

// Head profile (radius, height), bottom to top. Rotated around Y by a lathe.
const PROFILE: [number, number][] = [
  [0.2, -0.62],
  [0.36, -0.5],
  [0.46, -0.32],
  [0.51, -0.1],
  [0.5, 0.12],
  [0.44, 0.32],
  [0.32, 0.48],
  [0.17, 0.58],
  [0.0, 0.62],
];

const RIBS = 16;

function useHeadGeometries() {
  return useMemo(() => {
    const pts = PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
    const shell = new THREE.LatheGeometry(pts, 64);
    const inner = new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p.x * 0.965, p.y)), 48);

    // Vertical chrome ribs following the profile, a little outside the shell.
    const ribs: THREE.TubeGeometry[] = [];
    for (let i = 0; i < RIBS; i++) {
      const a = (i / RIBS) * Math.PI * 2;
      const curve = new THREE.CatmullRomCurve3(
        PROFILE.slice(0, PROFILE.length - 1).map(([r, y]) => {
          const rr = r * 1.03 + 0.012;
          return new THREE.Vector3(Math.sin(a) * rr, y, Math.cos(a) * rr);
        }),
      );
      ribs.push(new THREE.TubeGeometry(curve, 40, 0.024, 10, false));
    }
    return { shell, inner, ribs };
  }, []);
}

export default function Mic(props: React.ComponentProps<"group">) {
  const head = useRef<THREE.Group>(null);
  const glitch = useStore((s) => s.glitch);
  const level = useStore((s) => s.level);
  const { inner, ribs } = useHeadGeometries();

  useFrame((state) => {
    if (!head.current) return;
    const t = state.clock.elapsedTime;
    head.current.rotation.z = Math.sin(t * 0.5) * 0.03;
    head.current.scale.setScalar(1 + level.beat * 0.035);
  });

  const dark = glitch ? "#07050b" : "#1b1823";

  return (
    <group {...props}>
      {/* Head, tilted back the way a stage mic faces the singer */}
      <group ref={head} position={[0, 1.05, 0.08]} rotation={[-0.42, 0, 0]}>
        <group scale={[1, 1, 0.82]}>
          {/* dark mesh behind the grille */}
          <mesh geometry={inner}>
            <meshStandardMaterial color={dark} metalness={0.35} roughness={0.75} />
          </mesh>
          {/* chrome ribs */}
          {ribs.map((g, i) => (
            <mesh key={i} geometry={g}>
              <Chrome dark={glitch} roughness={0.08} />
            </mesh>
          ))}
          {/* chrome bands: bottom collar, waist ring, top cap */}
          <mesh position={[0, -0.56, 0]}>
            <cylinderGeometry args={[0.3, 0.26, 0.14, 48]} />
            <Chrome dark={glitch} roughness={0.08} />
          </mesh>
          <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.525, 0.03, 12, 72]} />
            <Chrome dark={glitch} roughness={0.08} />
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <Chrome dark={glitch} roughness={0.08} />
          </mesh>
        </group>
        {/* Lilac lacquer poured over the head: a cap that drips down the ribs */}
        <Blobs
          position={[0, 0.3, 0]}
          scale={[1.0, 1.0, 0.85]}
          resolution={48}
          isolation={36}
          audio={0.5}
          wobble={0.02}
          dripSpeed={0.06}
          balls={[
            { x: 0, y: 0.34, z: 0, strength: 1.3, subtract: 8 },
            { x: -0.3, y: 0.22, z: 0.22, strength: 0.5, phase: 1 },
            { x: 0.32, y: 0.22, z: -0.18, strength: 0.5, phase: 2 },
            { x: 0.06, y: 0.2, z: 0.4, strength: 0.45, phase: 3 },
            { x: -0.16, y: 0.2, z: -0.4, strength: 0.45, phase: 3.5 },
            { x: -0.5, y: 0.08, z: 0.05, strength: 0.28, phase: 4, drip: true },
            { x: 0.5, y: 0.04, z: 0.2, strength: 0.26, phase: 5, drip: true },
            { x: 0.12, y: 0.04, z: -0.5, strength: 0.24, phase: 6, drip: true },
            { x: -0.1, y: 0.02, z: 0.52, strength: 0.22, phase: 7, drip: true },
          ]}
        >
          <Lilac glitch={glitch} color="#9b7cff" />
        </Blobs>
      </group>

      {/* Swivel yoke: two chrome lugs and a pivot pin under the head */}
      <mesh position={[0, 0.42, 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.78, 24]} />
        <Chrome dark={glitch} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.36, 0.3, 0.02]}>
          <boxGeometry args={[0.07, 0.34, 0.14]} />
          <Chrome dark={glitch} roughness={0.12} />
        </mesh>
      ))}
      <mesh position={[0, 0.18, 0.02]}>
        <cylinderGeometry args={[0.2, 0.16, 0.22, 32]} />
        <Chrome dark={glitch} />
      </mesh>
      {/* On/off switch */}
      <mesh position={[0, 0.3, 0.17]}>
        <boxGeometry args={[0.1, 0.16, 0.05]} />
        <meshStandardMaterial color="#c42a6b" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.065, 0.085, 1.3, 24]} />
        <Chrome dark={glitch} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 24]} />
        <Chrome dark={glitch} roughness={0.2} />
      </mesh>

      {/* Base: heavy chrome disc with a beveled rim */}
      <mesh position={[0, -1.24, 0]}>
        <cylinderGeometry args={[0.5, 0.64, 0.1, 64]} />
        <Chrome dark={glitch} roughness={0.12} />
      </mesh>
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.64, 0.66, 0.04, 64]} />
        <meshStandardMaterial color={dark} metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  );
}
