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

  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={glitch ? 1.2 : 0.25} luminanceThreshold={glitch ? 0.3 : 0.9} luminanceSmoothing={0.2} mipmapBlur />
      <ChromaticAberration
        offset={new THREE.Vector2(glitch ? 0.004 : 0.0006, glitch ? 0.002 : 0.0003)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Glitch
        active={glitch}
        mode={GlitchMode.CONSTANT_WILD}
        delay={new THREE.Vector2(0, 0.1)}
        duration={new THREE.Vector2(0.2, 0.5)}
        strength={new THREE.Vector2(0.4, 0.9)}
        ratio={0.6}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={glitch ? 0.6 : 0.08} />
      <Vignette eskil={false} offset={0.3} darkness={glitch ? 0.9 : 0.25} />
    </EffectComposer>
  );
}
