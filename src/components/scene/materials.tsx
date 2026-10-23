"use client";

import { MeshTransmissionMaterial, useFBO } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/store";

const GlassCtx = createContext<THREE.Texture | null>(null);

/**
 * One shared refraction buffer for every piece of glass. Without it each
 * transmission material renders the whole room again, every frame: with nine
 * glass objects that was ten scene renders per frame.
 */
export function GlassBuffer({ children }: { children: React.ReactNode }) {
  const fbo = useFBO(512, 512);
  const glitch = useStore((s) => s.glitch);
  const mobile = useStore((s) => s.mobile);
  const bg = useMemo(
    () => new THREE.Color(glitch ? "#050308" : "#f6f4f9"),
    [glitch],
  );
  const hidden = useMemo<THREE.Object3D[]>(() => [], []);
  useFrame((state) => {
    if (mobile) return;
    hidden.length = 0;
    state.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (o.visible && m && !Array.isArray(m) && m.userData.glass) {
        o.visible = false;
        hidden.push(o);
      }
    });
    const oldBg = state.scene.background;
    const oldTone = state.gl.toneMapping;
    state.gl.toneMapping = THREE.NoToneMapping;
    state.scene.background = bg;
    state.gl.setRenderTarget(fbo);
    state.gl.render(state.scene, state.camera);
    state.gl.setRenderTarget(null);
    state.scene.background = oldBg;
    state.gl.toneMapping = oldTone;
    for (const o of hidden) o.visible = true;
  }, -1);
  return <GlassCtx.Provider value={fbo.texture}>{children}</GlassCtx.Provider>;
}

/** Mirror chrome. Reads the environment map for its reflections. */
export function Chrome({
  dark = false,
  roughness = 0.06,
}: {
  dark?: boolean;
  roughness?: number;
}) {
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
export function Lilac({
  glitch = false,
  color = "#b39aff",
}: {
  glitch?: boolean;
  color?: string;
}) {
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
  const buffer = useContext(GlassCtx);
  // The canvas is transparent (a film plays behind it), so the transmission pass
  // needs an explicit backdrop or the glass turns black.
  const backdrop = useMemo(
    () => new THREE.Color(glitch ? "#050308" : "#f6f4f9"),
    [glitch],
  );
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
      ref={(m) => {
        if (m) (m as unknown as THREE.Material).userData.glass = true;
      }}
      buffer={buffer ?? undefined}
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
      samples={4}
      resolution={384}
      backside={false}
    />
  );
}
