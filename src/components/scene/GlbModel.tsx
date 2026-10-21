"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/store";

const DRACO = "/draco/";

type Mat = THREE.MeshStandardMaterial;

/**
 * A GLB fitted to a given height, centred on its bounding box, with a
 * black-violet twin of every material for the glitch. Plays the first
 * animation clip if the file carries one.
 */
export default function GlbModel({
  url,
  size = 1,
  envMapIntensity = 1.2,
  anchor = "center",
}: {
  url: string;
  size?: number;
  envMapIntensity?: number;
  /** "center" puts the bbox centre at the origin, "bottom" puts the model's feet there. */
  anchor?: "center" | "bottom";
}) {
  const { scene, animations } = useGLTF(url, DRACO);
  const { actions } = useAnimations(animations, scene);
  const glitch = useStore((s) => s.glitch);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const c = box.getCenter(new THREE.Vector3());
    const h = box.getSize(new THREE.Vector3()).y || 1;
    const scale = size / h;
    const offset = c.multiplyScalar(-scale);
    if (anchor === "bottom") offset.y = -box.min.y * scale;
    return { offset, scale };
  }, [scene, size, anchor]);

  const mats = useMemo(() => {
    const list: { mesh: THREE.Mesh; day: THREE.Material; night: THREE.Material }[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const day = m.material as Mat;
      day.envMapIntensity = envMapIntensity;
      const night = day.clone() as Mat;
      if (night.color) night.color.multiplyScalar(0.2);
      night.emissive = new THREE.Color("#3b0066");
      night.emissiveIntensity = 0.5;
      night.roughness = Math.min(1, night.roughness + 0.2);
      night.envMapIntensity = 0.5;
      list.push({ mesh: m, day, night });
    });
    return list;
  }, [scene, envMapIntensity]);

  useEffect(() => {
    for (const { mesh, day, night } of mats) mesh.material = glitch ? night : day;
  }, [glitch, mats]);

  useEffect(() => {
    const first = Object.values(actions)[0];
    first?.reset().fadeIn(0.3).play();
    return () => {
      first?.fadeOut(0.2);
    };
  }, [actions]);

  return <primitive object={scene} scale={fit.scale} position={fit.offset} />;
}
