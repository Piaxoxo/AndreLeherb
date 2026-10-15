"use client";

import { RoundedBox, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Chrome, Glass, Lilac } from "./materials";
import Blobs from "./Blobs";
import { useStore } from "@/store";
import { player } from "@/lib/audio";

/** A floating chrome sphere, pure decoration. */
export function ChromeSphere({ r = 0.3, ...props }: { r?: number } & React.ComponentProps<"group">) {
  const glitch = useStore((s) => s.glitch);
  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.8}>
      <group {...props}>
        <mesh>
          <sphereGeometry args={[r, 48, 48]} />
          <Chrome dark={glitch} />
        </mesh>
      </group>
    </Float>
  );
}

/** A glass slab, used behind HTML content as a 3D echo of the panels. */
export function GlassSlab({
  w = 3,
  h = 2,
  ...props
}: { w?: number; h?: number } & React.ComponentProps<"group">) {
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
      <group {...props}>
        <RoundedBox args={[w, h, 0.12]} radius={0.18} smoothness={6}>
          <Glass />
        </RoundedBox>
      </group>
    </Float>
  );
}

/** A glass pebble (the blob-shaped glass drops on the reference board). */
export function GlassDrop({ r = 0.35, ...props }: { r?: number } & React.ComponentProps<"group">) {
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.6}>
      <group {...props}>
        <mesh scale={[1.3, 0.8, 1]}>
          <sphereGeometry args={[r, 40, 40]} />
          <Glass />
        </mesh>
      </group>
    </Float>
  );
}

/** The lilac waltz object: a soft blob that sways in 3/4 time. */
export function WalzerBlob({ active = false, onClick, ...props }: { active?: boolean; onClick?: () => void } & React.ComponentProps<"group">) {
  const grp = useRef<THREE.Group>(null);
  const glitch = useStore((s) => s.glitch);
  useFrame((state) => {
    if (!grp.current) return;
    const t = state.clock.elapsedTime;
    // 3/4 feel: one strong, two light.
    const bar = (t * (active ? 1.6 : 0.8)) % 3;
    const bounce = bar < 1 ? Math.sin(bar * Math.PI) * 0.18 : Math.sin(bar * Math.PI) * 0.06;
    grp.current.position.y = bounce;
    grp.current.rotation.z = Math.sin(t * 0.9) * 0.12;
  });
  return (
    <group {...props}>
      <group ref={grp} onClick={onClick}>
        <Blobs
          scale={[1.4, 1.2, 1.4]}
          resolution={40}
          audio={0.8}
          wobble={0.12}
          balls={[
            { x: 0, y: 0, z: 0, strength: 0.9, subtract: 10 },
            { x: 0.45, y: 0.25, z: 0.1, strength: 0.45, phase: 1 },
            { x: -0.4, y: -0.15, z: 0.3, strength: 0.4, phase: 2 },
            { x: 0.1, y: -0.4, z: -0.35, strength: 0.4, phase: 3 },
            { x: -0.25, y: 0.45, z: -0.2, strength: 0.35, phase: 4 },
          ]}
        >
          <Lilac glitch={glitch} />
        </Blobs>
      </group>
    </group>
  );
}

/**
 * The easter egg. A small chrome ball that looks like the other
 * decorations and does not announce itself. Click = the glitch.
 */
export function TriggerSphere(props: React.ComponentProps<"group">) {
  const trigger = useStore((s) => s.triggerGlitch);
  const glitch = useStore((s) => s.glitch);
  const [hover, setHover] = useState(false);
  const mesh = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.position.y = Math.sin(t * 1.3) * 0.05;
    // Every 20 s it twitches and flickers lilac for a third of a second: enough to catch the eye,
    // not enough to read as a button.
    const phase = t % 20;
    const twitching = phase > 19.4 && phase < 19.75;
    mesh.current.position.x = twitching ? (Math.random() - 0.5) * 0.08 : 0;
    if (mat.current && !glitch) {
      const flicker = twitching ? (Math.sin(t * 90) > 0 ? 1.6 : 0.2) : 0;
      mat.current.emissive.set("#9b5cff");
      mat.current.emissiveIntensity = flicker;
    }
  });

  return (
    <group {...props}>
      <mesh
        ref={mesh}
        onClick={(e) => {
          e.stopPropagation();
          trigger();
          player.wobble(900);
        }}
        onPointerOver={() => {
          setHover(true);
          gl.domElement.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          gl.domElement.style.cursor = "";
        }}
        scale={hover ? 1.08 : 1}
      >
        <sphereGeometry args={[0.22, 48, 48]} />
        <meshStandardMaterial
          ref={mat}
          color={glitch ? "#0a0010" : "#ffffff"}
          metalness={1}
          roughness={0.04}
          emissive={glitch ? "#9b5cff" : "#000"}
          emissiveIntensity={glitch ? 2 : 0}
        />
      </mesh>
    </group>
  );
}
