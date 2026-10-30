"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store";

function Fill({ glitch }: { glitch: boolean }) {
  return <meshBasicMaterial color={glitch ? "#140722" : "#f3f1fa"} transparent opacity={glitch ? 0.9 : 0.55} />;
}
function Lines({ glitch }: { glitch: boolean }) {
  return <meshBasicMaterial color={glitch ? "#c15cff" : "#8f8fa3"} wireframe transparent opacity={0.9} />;
}

/**
 * Low-poly wireframe falcon, the drawn bird from the 24/7 cover
 * turned into an object. Tracks the pointer with its head.
 */
export default function Falcon(props: React.ComponentProps<"group">) {
  const head = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const wings = useRef<THREE.Group>(null);
  const glitch = useStore((s) => s.glitch);
  const level = useStore((s) => s.level);

  const geo = useMemo(() => {
    // Body: lathe of a teardrop profile.
    const pts: THREE.Vector2[] = [];
    const prof = [
      [0, -1.0],
      [0.12, -0.92],
      [0.22, -0.7],
      [0.3, -0.4],
      [0.33, -0.05],
      [0.3, 0.3],
      [0.22, 0.6],
      [0.1, 0.82],
      [0, 0.9],
    ];
    for (const [x, y] of prof) pts.push(new THREE.Vector2(x, y));
    const body = new THREE.LatheGeometry(pts, 10);

    // Wing: a fan of triangles, folded.
    const wing = (sign: number) => {
      const v: number[] = [];
      const tip = [
        [0, 0.2, 0],
        [0.35 * sign, 0.55, -0.1],
        [0.75 * sign, 0.5, -0.3],
        [1.1 * sign, 0.25, -0.5],
        [1.2 * sign, -0.15, -0.6],
        [0.9 * sign, -0.35, -0.45],
        [0.5 * sign, -0.4, -0.25],
        [0.15 * sign, -0.3, -0.05],
      ];
      for (let i = 1; i < tip.length - 1; i++) {
        v.push(...tip[0], ...tip[i], ...tip[i + 1]);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
      g.computeVertexNormals();
      return g;
    };

    const tail = new THREE.ConeGeometry(0.28, 0.7, 5, 1, true);
    const headG = new THREE.IcosahedronGeometry(0.26, 1);
    const beak = new THREE.ConeGeometry(0.09, 0.26, 4);
    return { body, wingL: wing(-1), wingR: wing(1), tail, head: headG, beak };
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (head.current) {
      const px = state.pointer.x * 0.7;
      const py = state.pointer.y * 0.4;
      head.current.rotation.y += (px - head.current.rotation.y) * (glitch ? 0.6 : 0.08);
      head.current.rotation.x += (-py - head.current.rotation.x) * (glitch ? 0.6 : 0.08);
    }
    if (wings.current) {
      const flap = Math.sin(t * 1.4) * 0.08 + level.beat * 0.35;
      wings.current.children[0].rotation.z = -flap;
      wings.current.children[1].rotation.z = flap;
    }
    if (root.current) {
      root.current.position.y = Math.sin(t * 0.9) * 0.06;
      root.current.rotation.z = Math.sin(t * 0.6) * 0.03;
      void dt;
    }
  });

  return (
    <group ref={root} {...props}>
      {/* body */}
      <mesh geometry={geo.body} rotation={[0.35, 0, 0]}>
        <Fill glitch={glitch} />
      </mesh>
      <mesh geometry={geo.body} rotation={[0.35, 0, 0]} scale={1.01}>
        <Lines glitch={glitch} />
      </mesh>
      {/* wings */}
      <group ref={wings} position={[0, 0.1, 0.05]}>
        <group>
          <mesh geometry={geo.wingL}>
            <Fill glitch={glitch} />
          </mesh>
          <mesh geometry={geo.wingL} scale={1.01}>
            <Lines glitch={glitch} />
          </mesh>
        </group>
        <group>
          <mesh geometry={geo.wingR}>
            <Fill glitch={glitch} />
          </mesh>
          <mesh geometry={geo.wingR} scale={1.01}>
            <Lines glitch={glitch} />
          </mesh>
        </group>
      </group>
      {/* tail */}
      <mesh geometry={geo.tail} position={[0, -1.05, -0.35]} rotation={[-2.4, 0, 0]}>
        <Lines glitch={glitch} />
      </mesh>
      {/* head */}
      <group ref={head} position={[0, 1.0, 0.1]}>
        <mesh geometry={geo.head}>
          <Fill glitch={glitch} />
        </mesh>
        <mesh geometry={geo.head} scale={1.02}>
          <Lines glitch={glitch} />
        </mesh>
        <mesh geometry={geo.beak} position={[0, -0.02, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={glitch ? "#ff2bd6" : "#d8d8e2"} metalness={1} roughness={0.2} />
        </mesh>
        {/* eyes */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.13, 0.06, 0.2]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial
              color={glitch ? "#9b5cff" : "#111"}
              emissive={glitch ? "#9b5cff" : "#000"}
              emissiveIntensity={glitch ? 3 : 0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
