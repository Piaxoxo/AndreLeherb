"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Blobs from "./Blobs";
import { Chrome } from "./materials";
import { useStore } from "@/store";

/** Mirror ball built from instanced tiles, melting chrome underneath. */
export default function DiscoBall({
  radius = 0.9,
  active = false,
  onClick,
  ...props
}: { radius?: number; active?: boolean; onClick?: () => void } & React.ComponentProps<"group">) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const grp = useRef<THREE.Group>(null);
  const glitch = useStore((s) => s.glitch);
  const mobile = useStore((s) => s.mobile);
  const level = useStore((s) => s.level);

  const count = mobile ? 500 : 1100;
  const tiles = useMemo(() => {
    // Fibonacci sphere, tiles oriented along the normal.
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 0, 1);
    const mats: THREE.Matrix4[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const n = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
      q.setFromUnitVectors(up, n);
      m.compose(n.clone().multiplyScalar(radius), q, new THREE.Vector3(1, 1, 1));
      mats.push(m.clone());
    }
    return mats;
  }, [count, radius]);

  useLayoutEffect(() => {
    if (!inst.current) return;
    tiles.forEach((m, i) => inst.current!.setMatrixAt(i, m));
    inst.current.instanceMatrix.needsUpdate = true;
  }, [tiles]);

  useFrame((state, dt) => {
    if (grp.current) {
      grp.current.rotation.y += dt * (active ? 0.5 : 0.12) * (1 + level.value);
      grp.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  const tile = radius * 0.11;

  return (
    <group {...props}>
      <group ref={grp} onClick={onClick}>
        <mesh>
          <sphereGeometry args={[radius * 0.97, 32, 32]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.5} />
        </mesh>
        <instancedMesh ref={inst} args={[undefined, undefined, tiles.length]} frustumCulled={false}>
          <boxGeometry args={[tile, tile, 0.02]} />
          <Chrome dark={glitch} roughness={0.04} />
        </instancedMesh>
      </group>
      {/* Chrome melt */}
      <Blobs
        position={[0, -radius * 0.55, 0]}
        scale={[radius * 1.5, radius * 1.4, radius * 1.5]}
        resolution={36}
        audio={0.9}
        wobble={0.04}
        dripSpeed={0.15}
        balls={[
          { x: 0, y: 0.3, z: 0, strength: 0.8, subtract: 10 },
          { x: -0.45, y: 0.15, z: 0.2, strength: 0.35, phase: 1, drip: true },
          { x: 0.4, y: 0.1, z: -0.25, strength: 0.3, phase: 2, drip: true },
          { x: 0.1, y: 0.2, z: 0.5, strength: 0.3, phase: 3, drip: true },
          { x: -0.2, y: 0.05, z: -0.5, strength: 0.28, phase: 4, drip: true },
        ]}
      >
        <Chrome dark={glitch} roughness={0.05} />
      </Blobs>
    </group>
  );
}
