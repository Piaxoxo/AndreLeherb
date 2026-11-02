"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Falcon from "./Falcon";
import GlbModel from "./GlbModel";
import { useStore } from "@/store";

/** The lilac pigeon (Tripo GLB). Until the file is deployed the wireframe falcon stands in. */
export const PIGEON_URL = "/models/taube.glb";

function Model({ size }: { size: number }) {
  const glitch = useStore((s) => s.glitch);
  const level = useStore((s) => s.level);
  const { gl } = useThree();
  const root = useRef<THREE.Group>(null);
  const drag = useRef({ on: false, x: 0, y: 0, rx: 0, ry: 0 });

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const d = drag.current;
    // Glide: a slow bob, a banking roll and a gentle lean toward the pointer.
    root.current.position.y = Math.sin(t * 1.3) * 0.14 + level.beat * 0.05;
    const bank = Math.sin(t * 0.7) * 0.1;
    const lean = d.on ? 0 : state.pointer.x * 0.35;
    root.current.rotation.set(d.rx + Math.sin(t * 0.9) * 0.05, d.ry + lean + Math.sin(t * 0.5) * 0.15, bank);
    if (glitch) root.current.position.x = (Math.random() - 0.5) * 0.05;
    else root.current.position.x = 0;
  });

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current.on = true;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    gl.domElement.style.cursor = "grabbing";
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d.on) return;
    d.ry += (e.clientX - d.x) * 0.012;
    d.rx = THREE.MathUtils.clamp(d.rx + (e.clientY - d.y) * 0.008, -0.6, 0.6);
    d.x = e.clientX;
    d.y = e.clientY;
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    drag.current.on = false;
    gl.domElement.style.cursor = "grab";
  };

  return (
    <group
      ref={root}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerOver={() => (gl.domElement.style.cursor = "grab")}
      onPointerOut={() => (gl.domElement.style.cursor = "")}
    >
      <GlbModel url={PIGEON_URL} size={size} />
    </group>
  );
}

function useModelAvailable() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(PIGEON_URL, { method: "HEAD" })
      .then((r) => alive && setOk(r.ok))
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, []);
  return ok;
}

/**
 * The mascot. Drag to turn her, she glides and leans toward the pointer,
 * and in the glitch her plumage goes black-violet.
 */
export default function Pigeon({ size = 2.4, ...props }: { size?: number } & React.ComponentProps<"group">) {
  const available = useModelAvailable();
  const mobile = useStore((s) => s.mobile);
  if (available === false) {
    return (
      <group {...props}>
        <Falcon scale={mobile ? 0.5 : 0.7} rotation={[0, 0.5, 0]} />
      </group>
    );
  }
  if (!available) return null;
  return (
    <group {...props}>
      <Suspense fallback={null}>
        <Model size={size} />
      </Suspense>
    </group>
  );
}
