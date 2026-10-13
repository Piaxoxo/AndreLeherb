"use client";

import { Environment, Lightformer, useScroll, ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Mic from "./Mic";
import Falcon from "./Falcon";
import DiscoBall from "./DiscoBall";
import Portrait from "./Portrait";
import Effects from "./Effects";
import { ChromeSphere, GlassDrop, GlassSlab, TriggerSphere, WalzerBlob } from "./Props";
import { useStore } from "@/store";
import { player } from "@/lib/audio";
import { songs } from "@/content";

export const PAGES = 4;

/** Camera follows the scroll down the "room", with a little pointer parallax. */
function Rig() {
  const scroll = useScroll();
  const target = useRef(new THREE.Vector3());
  const glitch = useStore((s) => s.glitch);

  useFrame((state, dt) => {
    const { camera } = state;
    const vh = state.viewport.height;
    const y = -scroll.offset * (PAGES - 1) * vh;
    target.current.set(state.pointer.x * 0.25, y + state.pointer.y * 0.15, 9);
    camera.position.lerp(target.current, 1 - Math.exp(-dt * 6));
    if (glitch) {
      camera.position.x += (Math.random() - 0.5) * 0.08;
      camera.position.y += (Math.random() - 0.5) * 0.05;
    }
    camera.lookAt(camera.position.x * 0.5, camera.position.y, 0);
  });
  return null;
}

function Studio() {
  const glitch = useStore((s) => s.glitch);
  return (
    <>
      <color attach="background" args={[glitch ? "#050308" : "#f6f4f9"]} />
      <fog attach="fog" args={[glitch ? "#050308" : "#f6f4f9", 14, 26]} />
      <ambientLight intensity={glitch ? 0.2 : 0.9} />
      <directionalLight position={[4, 6, 6]} intensity={glitch ? 0.4 : 1.4} color={glitch ? "#9b5cff" : "#ffffff"} />
      <directionalLight position={[-6, 2, -3]} intensity={0.5} color={glitch ? "#ff2bd6" : "#c4b1ff"} />
      {/* Synthetic studio: white softboxes with lilac accents, no network. */}
      <Environment resolution={256} frames={1}>
        <group>
          {/* A soft grey "room" so chrome never reflects pure black; a darker floor for grounding. */}
          <mesh scale={60}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color={glitch ? "#0b0614" : "#c6c4d2"} side={THREE.BackSide} />
          </mesh>
          <mesh position={[0, -30, 0]} rotation-x={-Math.PI / 2} scale={120}>
            <planeGeometry />
            <meshBasicMaterial color={glitch ? "#05030a" : "#8e8c9c"} />
          </mesh>
          <Lightformer intensity={glitch ? 0.6 : 3} form="rect" color={glitch ? "#3b1a6e" : "#ffffff"} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
          <Lightformer intensity={glitch ? 0.8 : 2} form="rect" color={glitch ? "#9b5cff" : "#efeaff"} position={[-8, 1, 2]} rotation-y={Math.PI / 2} scale={[9, 5, 1]} />
          <Lightformer intensity={glitch ? 0.8 : 2} form="rect" color={glitch ? "#ff2bd6" : "#ffffff"} position={[8, 1, 2]} rotation-y={-Math.PI / 2} scale={[9, 5, 1]} />
          <Lightformer intensity={glitch ? 1.5 : 1.4} form="ring" color={glitch ? "#c15cff" : "#c4b1ff"} position={[0, 2, -8]} scale={5} />
          <Lightformer intensity={glitch ? 0.4 : 1.2} form="rect" color={glitch ? "#2a0a50" : "#ffffff"} position={[0, 0, 9]} scale={[10, 6, 1]} />
        </group>
      </Environment>
    </>
  );
}

export default function Scene() {
  const { viewport } = useThree();
  const vh = viewport.height;
  const vw = viewport.width;
  const mobile = useStore((s) => s.mobile);
  const playing = useStore((s) => s.playing);
  const s247 = songs[0];
  const walzer = songs[1];

  // Horizontal layout helper: fraction of the visible width.
  const X = (f: number) => (vw / 2) * f;
  const scale = mobile ? 0.62 : 1;

  return (
    <>
      <Studio />
      <Rig />

      {/* ---------- 0 · Intro ---------- */}
      <group position={[0, 0, 0]}>
        {/* phones: mic small in the upper third, name below it; desktop: mic left column */}
        <group scale={mobile ? 0.5 : 1} position={[mobile ? X(0.05) : X(-0.52), mobile ? 1.55 : -0.1, mobile ? 0 : 0.4]}>
          <Mic />
          <Falcon position={[0.9, 1.6, -0.3]} scale={0.42} rotation={[0, -0.7, 0]} />
        </group>
        {!mobile && (
          <Portrait src="/img/andre-hero.webp" glitchSrc="/img/glitch-point.jpg" height={4.2} position={[X(0.52), -0.2, -0.6]} />
        )}
        <ChromeSphere r={mobile ? 0.22 : 0.4} position={[X(-0.82), mobile ? 2.3 : 1.9, -1.5]} />
        <ChromeSphere r={mobile ? 0.1 : 0.16} position={[X(mobile ? 0.7 : 0.12), 2.1, 0.3]} />
        <GlassDrop r={mobile ? 0.25 : 0.4} position={[X(0.22), -2.0, 1.0]} />
        <GlassDrop r={mobile ? 0.14 : 0.22} position={[X(-0.1), 1.2, 1.5]} />
        {/* the easter egg sits where you'd overlook it */}
        <TriggerSphere position={[X(mobile ? 0.6 : 0.72), mobile ? -0.9 : -1.75, 0.6]} />
      </group>

      {/* ---------- 1 · Musik ---------- */}
      <group position={[0, -vh, 0]}>
        <group position={[mobile ? X(-0.45) : X(-0.62), mobile ? 1.5 : 0.9, 0]} scale={scale}>
          <DiscoBall radius={0.95} active={playing === "247"} onClick={() => s247.audio && player.toggle("247", s247.audio)} />
        </group>
        <group position={[mobile ? X(0.55) : X(0.45), mobile ? 1.1 : 1.3, 0.2]} scale={scale}>
          <WalzerBlob active={playing === "walzer"} onClick={() => walzer.audio && player.toggle("walzer", walzer.audio)} />
        </group>
        <ChromeSphere r={0.22} position={[X(0.1), 2.2, -1]} />
        <GlassDrop r={0.3} position={[X(-0.2), -2.3, 1]} />
      </group>

      {/* ---------- 2 · Über ---------- */}
      <group position={[0, -vh * 2, 0]}>
        {/* The portrait here is the particle field in the HTML layer. */}
        <GlassSlab w={3.2} h={1.6} position={[X(0.45), 1.6, -2]} rotation={[0, -0.3, 0.05]} />
        <ChromeSphere r={0.35} position={[X(0.85), -1.8, -1]} />
        <GlassDrop r={0.32} position={[X(-0.85), 1.9, 0.5]} />
        <ChromeSphere r={0.14} position={[X(0.05), -2.3, 1.2]} />
      </group>

      {/* ---------- 3 · Booking ---------- */}
      <group position={[0, -vh * 3, 0]}>
        {!mobile && (
          <Portrait src="/img/andre-silver.webp" glitchSrc="/img/glitch-point.jpg" height={4.6} position={[X(0.55), -0.2, -0.8]} />
        )}
        <group scale={scale} position={[X(mobile ? 0.3 : -0.55), mobile ? 2.2 : 1.4, -1.5]}>
          <Falcon scale={0.7} rotation={[0, 0.5, 0]} />
        </group>
        <ChromeSphere r={0.5} position={[X(-0.8), -1.7, -1.5]} />
        <GlassDrop r={0.35} position={[X(0.1), 2.2, 0.5]} />
        <GlassDrop r={0.22} position={[X(-0.2), -2.2, 1.4]} />
      </group>

      <ContactShadows position={[0, -2.6, 0]} opacity={0.3} scale={16} blur={2.6} far={4} color="#2a1a4a" frames={1} />
      <Effects />
    </>
  );
}
