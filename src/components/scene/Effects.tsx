"use client";

import { EffectComposer, Bloom, Glitch, Noise, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import * as THREE from "three";
import { useStore } from "@/store";

export default function Effects() {
  const glitch = useStore((s) => s.glitch);
  const mobile = useStore((s) => s.mobile);
  const reduced = useStore((s) => s.reduced);

  if (mobile || reduced) return null;

  // The canvas is transparent (the hero film sits behind it). Chromatic aberration and the
  // vignette also shift and darken the alpha channel, which paints rainbow fringes and dark
  // corners onto everything, so in the calm state only bloom and a little grain run.
  if (!glitch) {
    return (
      <EffectComposer multisampling={4}>
        <Bloom intensity={0.25} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.08} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={1.2} luminanceThreshold={0.3} luminanceSmoothing={0.2} mipmapBlur />
      <ChromaticAberration offset={new THREE.Vector2(0.004, 0.002)} radialModulation={false} modulationOffset={0} />
      <Glitch
        active
        mode={GlitchMode.CONSTANT_WILD}
        delay={new THREE.Vector2(0, 0.1)}
        duration={new THREE.Vector2(0.2, 0.5)}
        strength={new THREE.Vector2(0.4, 0.9)}
        ratio={0.6}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.6} />
      <Vignette eskil={false} offset={0.3} darkness={0.9} />
    </EffectComposer>
  );
}
