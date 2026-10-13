"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store";

type Props = {
  src: string;
  /** Image shown for the duration of the glitch. */
  glitchSrc?: string;
  height?: number;
  float?: number;
  /** Rounded corner radius in world units (0 = cut-out, no frame). */
  radius?: number;
} & React.ComponentProps<"group">;

/**
 * A photo on a plane. Cut-outs (webp with alpha) float freely in the room,
 * jpgs get a rounded "glass card" mask. During the glitch the texture
 * flips to the dark twin and the plane jitters.
 */
export default function Portrait({ src, glitchSrc, height = 3, float = 0.08, radius = 0, ...props }: Props) {
  const tex = useTexture(src);
  const gtex = useTexture(glitchSrc ?? src);
  const glitch = useStore((s) => s.glitch);
  const mesh = useRef<THREE.Mesh>(null);
  const grp = useRef<THREE.Group>(null);

  tex.colorSpace = THREE.SRGBColorSpace;
  gtex.colorSpace = THREE.SRGBColorSpace;
  const img = tex.image as { width: number; height: number } | undefined;
  const aspect = img ? img.width / img.height : 0.7;
  const w = height * aspect;

  const geo = useMemo(() => {
    if (!radius) return new THREE.PlaneGeometry(w, height);
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -height / 2;
    const r = radius;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + height - r);
    s.quadraticCurveTo(x + w, y + height, x + w - r, y + height);
    s.lineTo(x + r, y + height);
    s.quadraticCurveTo(x, y + height, x, y + height - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ShapeGeometry(s, 8);
    // Map UVs to 0..1 across the shape.
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (uv.getX(i) - x) / w, (uv.getY(i) - y) / height);
    }
    uv.needsUpdate = true;
    return g;
  }, [w, height, radius]);

  useFrame((state) => {
    if (!grp.current) return;
    const t = state.clock.elapsedTime;
    grp.current.position.y = Math.sin(t * 0.7) * float;
    grp.current.rotation.y = Math.sin(t * 0.4) * 0.05 + state.pointer.x * 0.08;
    if (glitch && mesh.current) {
      mesh.current.position.x = (Math.random() - 0.5) * 0.08;
      mesh.current.position.y = (Math.random() - 0.5) * 0.05;
    } else if (mesh.current) {
      mesh.current.position.set(0, 0, 0);
    }
  });

  return (
    <group {...props}>
      <group ref={grp}>
        <mesh ref={mesh} geometry={geo}>
          <meshBasicMaterial map={glitch && glitchSrc ? gtex : tex} transparent toneMapped={false} />
        </mesh>
        {/* soft contact shadow */}
        <mesh position={[0, -height / 2 - 0.05, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[w * 0.45, 32]} />
          <meshBasicMaterial color="#000" transparent opacity={glitch ? 0.5 : 0.12} />
        </mesh>
      </group>
    </group>
  );
}
