"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/store";

/** Mirror chrome. Reads the environment map for its reflections. */
export function Chrome({ dark = false, roughness = 0.06 }: { dark?: boolean; roughness?: number }) {
  return (
    <meshStandardMaterial
      color={dark ? "#2a2a33" : "#ffffff"}
      metalness={1}
      roughness={roughness}
      envMapIntensity={dark ? 0.6 : 1.4}
    />
  );
}

/** Glossy lilac "lacquer" for the blobs and the walzer object. */
export function Lilac({ glitch = false, color = "#b39aff" }: { glitch?: boolean; color?: string }) {
  return (
    <meshPhysicalMaterial
      color={glitch ? "#5a0fd6" : color}
      roughness={glitch ? 0.35 : 0.14}
      metalness={glitch ? 0.4 : 0}
      clearcoat={1}
      clearcoatRoughness={0.08}
      sheen={1}
      sheenColor={glitch ? "#ff2bd6" : "#ffffff"}
      envMapIntensity={1.1}
      emissive={glitch ? "#3b00a8" : "#000000"}
      emissiveIntensity={glitch ? 0.6 : 0}
    />
  );
}

/** Frosted glass. Falls back to a cheap physical material on mobile. */
export function Glass({ tint = "#ffffff" }: { tint?: string }) {
  const mobile = useStore((s) => s.mobile);
  const glitch = useStore((s) => s.glitch);
  // The canvas is transparent (a film plays behind it), so the transmission pass
  // needs an explicit backdrop or the glass turns black.
  const backdrop = useMemo(() => new THREE.Color(glitch ? "#050308" : "#f6f4f9"), [glitch]);
  if (mobile) {
    return (
      <meshPhysicalMaterial
        color={glitch ? "#2a1050" : tint}
        transparent
        opacity={0.45}
        roughness={0.25}
        metalness={0}
        clearcoat={1}
        envMapIntensity={0.8}
      />
    );
  }
  return (
    <MeshTransmissionMaterial
      background={backdrop}
      color={glitch ? "#3a1370" : tint}
      transmission={1}
      thickness={0.6}
      roughness={0.32}
      ior={1.35}
      chromaticAberration={0.03}
      anisotropicBlur={0.4}
      distortion={0.2}
      distortionScale={0.4}
      temporalDistortion={0.1}
      samples={6}
      resolution={512}
      backside={false}
    />
  );
}
