"use client";

import {
  Environment,
  Lightformer,
  useScroll,
  ContactShadows,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { lazy, Suspense, useRef } from "react";
import * as THREE from "three";
import Pigeon from "./Pigeon";
import Mic from "./Mic";
import DiscoBall from "./DiscoBall";
import Portrait from "./Portrait";
const Effects = lazy(() => import("./Effects"));
import { GlassBuffer } from "./materials";
import {
  ChromeSphere,
  GlassDrop,
  GlassSlab,
  TriggerSphere,
  WalzerBlob,
} from "./Props";
import { useStore } from "@/store";
import { player } from "@/lib/audio";
import { songs } from "@/content";

/** hero · 3 pages of mic scrub · musik · über · booking */
export const PAGES = 7;
/** Phones get one more page: the footer (socials, legal) gets its own screen there. */
export const pagesFor = (mobile: boolean) => (mobile ? PAGES + 1 : PAGES);
export const SCRUB_START = 1;
export const SCRUB_PAGES = 3;

/** Camera follows the scroll down the "room", with a little pointer parallax. */
function Rig() {
  const scroll = useScroll();
  const target = useRef(new THREE.Vector3());
  const glitch = useStore((s) => s.glitch);

  const mobile = useStore((s) => s.mobile);

  useFrame((state, dt) => {
    const { camera } = state;
    const vh = state.viewport.height;
    const y = -scroll.offset * (pagesFor(mobile) - 1) * vh;
    // Phones get the camera closer so the objects fill the narrow frame.
    target.current.set(
      state.pointer.x * 0.25,
      y + state.pointer.y * 0.15,
      mobile ? 7.2 : 9,
    );
    camera.position.lerp(target.current, 1 - Math.exp(-dt * 6));
    if (glitch) {
      camera.position.x += (Math.random() - 0.5) * 0.08;
      camera.position.y += (Math.random() - 0.5) * 0.05;
    }
    camera.lookAt(camera.position.x * 0.5, camera.position.y, 0);
  });
  return null;
}

/** Fades the HTML film behind the canvas out as the room scrolls past the hero. */
function FilmFade() {
  const scroll = useScroll();
  const mobile = useStore((s) => s.mobile);
  useFrame(() => {
    const page = scroll.offset * (pagesFor(mobile) - 1);
    const el = document.getElementById("hero-film");
    if (el) el.style.opacity = String(Math.max(0, 1 - page * 1.6));
    // the mic scrub: progress 0..1 across its pages, visible only while inside them
    const scrub = document.getElementById("mic-scrub");
    if (scrub) {
      const p = (page - SCRUB_START) / SCRUB_PAGES;
      scrub.dataset.p = String(Math.min(1, Math.max(0, p)));
      // fade in over the last third of the hero, fade out just before Musik arrives
      const vis = Math.min(
        1,
        Math.max(
          0,
          Math.min(
            (page - SCRUB_START + 0.35) / 0.35,
            (SCRUB_START + SCRUB_PAGES + 0.02 - page) / 0.3,
          ),
        ),
      );
      scrub.style.opacity = String(vis);
      scrub.style.visibility = vis > 0.01 ? "visible" : "hidden";
      const dark = vis > 0.5;
      if ((document.documentElement.dataset.scrub === "on") !== dark) {
        if (dark) document.documentElement.dataset.scrub = "on";
        else delete document.documentElement.dataset.scrub;
      }
    }
  });
  return null;
}

export function Studio({ transparent = false }: { transparent?: boolean }) {
  const glitch = useStore((s) => s.glitch);
  return (
    <>
      {!transparent && (
        <color attach="background" args={[glitch ? "#050308" : "#f6f4f9"]} />
      )}
      <fog attach="fog" args={[glitch ? "#050308" : "#f6f4f9", 14, 26]} />
      <ambientLight intensity={glitch ? 0.2 : 0.9} />
      <directionalLight
        position={[4, 6, 6]}
        intensity={glitch ? 0.4 : 1.4}
        color={glitch ? "#9b5cff" : "#ffffff"}
      />
      <directionalLight
        position={[-6, 2, -3]}
        intensity={0.5}
        color={glitch ? "#ff2bd6" : "#c4b1ff"}
      />
      {/* Synthetic studio: white softboxes with lilac accents, no network. */}
      <Environment resolution={256} frames={1}>
        <group>
          {/* A soft grey "room" so chrome never reflects pure black; a darker floor for grounding. */}
          <mesh scale={60}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
              color={glitch ? "#0b0614" : "#c6c4d2"}
              side={THREE.BackSide}
            />
          </mesh>
          <mesh position={[0, -30, 0]} rotation-x={-Math.PI / 2} scale={120}>
            <planeGeometry />
            <meshBasicMaterial color={glitch ? "#05030a" : "#8e8c9c"} />
          </mesh>
          <Lightformer
            intensity={glitch ? 0.6 : 3}
            form="rect"
            color={glitch ? "#3b1a6e" : "#ffffff"}
            position={[0, 6, 0]}
            rotation-x={Math.PI / 2}
            scale={[14, 14, 1]}
          />
          <Lightformer
            intensity={glitch ? 0.8 : 2}
            form="rect"
            color={glitch ? "#9b5cff" : "#efeaff"}
            position={[-8, 1, 2]}
            rotation-y={Math.PI / 2}
            scale={[9, 5, 1]}
          />
          <Lightformer
            intensity={glitch ? 0.8 : 2}
            form="rect"
            color={glitch ? "#ff2bd6" : "#ffffff"}
            position={[8, 1, 2]}
            rotation-y={-Math.PI / 2}
            scale={[9, 5, 1]}
          />
          <Lightformer
            intensity={glitch ? 1.5 : 1.4}
            form="ring"
            color={glitch ? "#c15cff" : "#c4b1ff"}
            position={[0, 2, -8]}
            scale={5}
          />
          <Lightformer
            intensity={glitch ? 0.4 : 1.2}
            form="rect"
            color={glitch ? "#2a0a50" : "#ffffff"}
            position={[0, 0, 9]}
            scale={[10, 6, 1]}
          />
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
  const glitch = useStore((s) => s.glitch);
  const playing = useStore((s) => s.playing);
  const s247 = songs[0];
  const walzer = songs[1];

  // Horizontal layout helper: fraction of the visible width.
  const X = (f: number) => (vw / 2) * f;
  // portrait tablets: desktop layout, but the wide objects need to slide toward the middle
  const portrait = !mobile && vw / vh < 0.95;

  return (
    <GlassBuffer>
      <Studio transparent />
      <Rig />

      {/* ---------- 0 · Intro ---------- */}
      <group position={[0, 0, 0]}>
        <FilmFade />
        {/* André stands in the room; the brush logo lives in the HTML layer behind him */}
        <Portrait
          src="/img/andre-hero.webp"
          glitchSrc="/img/glitch-point.jpg"
          height={mobile ? 2.9 : 4.4}
          position={[
            mobile ? X(0.3) : X(0.5),
            mobile ? -0.95 : -0.3,
            mobile ? -0.4 : -0.6,
          ]}
        />
        {/* The melted lilac mic stands on the floor between logo and André */}
        <Mic
          size={mobile ? 1.7 : 3.2}
          position={[
            mobile ? X(-0.12) : X(0.2),
            mobile ? -1.5 : -2.7,
            mobile ? 0.6 : 0.8,
          ]}
          rotation={[0, 0.25, 0]}
        />
        <ChromeSphere
          r={mobile ? 0.26 : 0.42}
          position={[X(-0.6), mobile ? 2.6 : 2.9, -3]}
        />
        <ChromeSphere
          r={mobile ? 0.12 : 0.16}
          position={[X(mobile ? 0.75 : 0.12), mobile ? 2.3 : 2.1, 0.3]}
        />
        <ChromeSphere
          r={mobile ? 0.16 : 0.22}
          position={[X(-0.62), mobile ? 0.2 : -1.6, 0.2]}
        />
        <GlassDrop
          r={mobile ? 0.28 : 0.42}
          position={[X(mobile ? 0.1 : -0.08), mobile ? -2.5 : -2.3, 1.0]}
        />
        <GlassDrop
          r={mobile ? 0.16 : 0.22}
          position={[X(-0.2), mobile ? 1.0 : 1.3, 1.5]}
        />
        {/* the easter egg: desktop bottom right, phone free in the room right of the logo */}
        <TriggerSphere
          position={[
            X(mobile ? 0.78 : 0.72),
            mobile ? 0.55 : -1.75,
            mobile ? 0.9 : 0.6,
          ]}
        />
      </group>

      {/* ---------- 1 · Musik ---------- */}
      <group position={[0, -vh * (SCRUB_START + SCRUB_PAGES), 0]}>
        <group
          position={[mobile ? X(0.3) : X(-0.62), mobile ? 0.9 : 0.9, 0]}
          scale={mobile ? 0.55 : 1}
        >
          <DiscoBall
            radius={0.95}
            active={playing === "247"}
            onClick={() => s247.audio && player.toggle("247", s247.audio)}
          />
        </group>
        <group
          position={[mobile ? X(-0.55) : X(0.02), mobile ? -0.2 : 1.5, 0.2]}
          scale={mobile ? 0.7 : 0.9}
        >
          <WalzerBlob
            active={playing === "walzer"}
            onClick={() =>
              walzer.audio && player.toggle("walzer", walzer.audio)
            }
          />
        </group>
        <ChromeSphere r={0.22} position={[X(0.1), 2.2, -1]} />
        <GlassDrop r={0.3} position={[X(-0.2), -2.3, 1]} />
      </group>

      {/* ---------- 2 · Über ---------- */}
      <group position={[0, -vh * (SCRUB_START + SCRUB_PAGES + 1), 0]}>
        {/* The portrait here is the particle field in the HTML layer. */}
        <GlassSlab
          w={3.2}
          h={1.6}
          position={[X(0.45), 1.6, -2]}
          rotation={[0, -0.3, 0.05]}
        />
        <ChromeSphere r={0.35} position={[X(0.85), -1.8, -1]} />
        <GlassDrop r={0.32} position={[X(-0.85), 1.9, 0.5]} />
        <ChromeSphere r={0.14} position={[X(0.05), -2.3, 1.2]} />
      </group>

      {/* ---------- 3 · Booking ---------- */}
      <group position={[0, -vh * (SCRUB_START + SCRUB_PAGES + 2), 0]}>
        <Portrait
          src="/img/andre-silver.webp"
          glitchSrc="/img/glitch-point.jpg"
          height={mobile ? 2.0 : 4.6}
          position={[mobile ? X(0.6) : X(0.55), mobile ? 1.5 : -0.2, -0.8]}
        />
        {/* the lilac pigeon, Andre's mascot; drag to turn her */}
        <Pigeon
          size={mobile ? 0.95 : portrait ? 2.2 : 2.8}
          position={[
            X(mobile ? -0.35 : portrait ? 0.05 : -0.5),
            mobile ? 1.72 : portrait ? 1.7 : 1.2,
            -1.2,
          ]}
        />
        <ChromeSphere r={0.5} position={[X(-0.8), -1.7, -1.5]} />
        <GlassDrop r={0.35} position={[X(0.1), 2.2, 0.5]} />
        <GlassDrop r={0.22} position={[X(-0.2), -2.2, 1.4]} />
      </group>

      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.3}
        scale={16}
        blur={2.6}
        far={4}
        color="#2a1a4a"
        frames={1}
      />
      {glitch && (
        <Suspense fallback={null}>
          <Effects />
        </Suspense>
      )}
    </GlassBuffer>
  );
}
