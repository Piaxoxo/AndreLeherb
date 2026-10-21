"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Falcon from "./Falcon";
import { useStore } from "@/store";

/** The lilac pigeon (Tripo GLB). Until the file is deployed the wireframe falcon stands in. */
export const PIGEON_URL = "/models/taube.glb";

type Mat = THREE.MeshStandardMaterial;

function Model({ size }: { size: number }) {
  const { scene, animations } = useGLTF(PIGEON_URL);
  const { actions } = useAnimations(animations, scene);
  const glitch = useStore((s) => s.glitch);
  const level = useStore((s) => s.level);
  const { gl } = useThree();
  const root = useRef<THREE.Group>(null);
  const drag = useRef({ on: false, x: 0, y: 0, rx: 0, ry: 0 });

  // Normalise: centre the model and scale it to `size` in height.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const c = box.getCenter(new THREE.Vector3());
    const h = box.getSize(new THREE.Vector3()).y || 1;
    return { offset: c.multiplyScalar(-1), scale: size / h };
  }, [scene, size]);

  // Day and night materials for every mesh in the model.
  const mats = useMemo(() => {
    const list: { mesh: THREE.Mesh; day: THREE.Material; night: THREE.Material }[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const day = m.material as Mat;
      const night = (day as Mat).clone() as Mat;
      if (night.color) night.color.multiplyScalar(0.22);
      if ("emissive" in night) {
        night.emissive = new THREE.Color("#3b0066");
        night.emissiveIntensity = 0.5;
      }
      if ("roughness" in night) night.roughness = Math.min(1, (night.roughness ?? 0.5) + 0.2);
      m.castShadow = false;
      list.push({ mesh: m, day, night });
    });
    return list;
  }, [scene]);

  useEffect(() => {
    for (const { mesh, day, night } of mats) mesh.material = glitch ? night : day;
  }, [glitch, mats]);

  // Play the first clip if the model carries one (wing beat).
  useEffect(() => {
    const first = Object.values(actions)[0];
    first?.reset().fadeIn(0.3).play();
    return () => {
      first?.fadeOut(0.2);
    };
  }, [actions]);

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
      <primitive object={scene} scale={fit.scale} position={fit.offset.clone().multiplyScalar(fit.scale)} />
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
