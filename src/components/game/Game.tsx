"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Nav, Tear } from "@/components/Chrome";
import GlbModel from "@/components/scene/GlbModel";
import { Studio } from "@/components/scene/Scene";
import { Chrome, Lilac } from "@/components/scene/materials";
import { useStore } from "@/store";

const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

export const ANDRE_URL = "/models/andre.glb";

/** 24 seconds, 7 lives: 24/7. */
const DURATION = 24;
const LIVES = 7;
const LANE = 3.6;
const TOP = 6.5;
const FLOOR = -2.2;

type Phase = "intro" | "play" | "won" | "lost";

type Drop = {
  id: number;
  x: number;
  y: number;
  z: number;
  bad: boolean;
  speed: number;
  spin: number;
  dead: boolean;
};

/** Everything that changes every frame lives here, outside React state. */
type World = {
  /** game clock in seconds, wall time so slow devices still get a 24-second round */
  t: number;
  startedAt: number;
  spawnAt: number;
  nextId: number;
  drops: Drop[];
  andreX: number;
  targetX: number;
  lean: number;
  hitFlash: number;
  caughtFlash: number;
};

function makeWorld(): World {
  return { t: 0, startedAt: 0, spawnAt: 0.6, nextId: 1, drops: [], andreX: 0, targetX: 0, lean: 0, hitFlash: 0, caughtFlash: 0 };
}

function Andre({ world }: { world: React.MutableRefObject<World> }) {
  const root = useRef<THREE.Group>(null);
  const mobile = useStore((s) => s.mobile);
  useFrame((_, dt) => {
    const w = world.current;
    if (!root.current) return;
    // ease toward the pointer, lean into the move
    const dx = w.targetX - w.andreX;
    w.andreX += dx * Math.min(1, dt * 9);
    w.lean += (THREE.MathUtils.clamp(-dx * 0.35, -0.35, 0.35) - w.lean) * Math.min(1, dt * 8);
    root.current.position.x = w.andreX;
    root.current.rotation.z = w.lean;
    root.current.rotation.y = -w.lean * 1.2;
    // small hop when hit, bounce when a note lands
    const bob = w.caughtFlash > 0 ? Math.sin(w.caughtFlash * 20) * 0.08 : 0;
    root.current.position.y = FLOOR + bob + (w.hitFlash > 0 ? Math.random() * 0.06 : 0);
  });
  return (
    <group ref={root} position={[0, FLOOR, 0]}>
      <Suspense fallback={null}>
        <GlbModel url={ANDRE_URL} size={mobile ? 2.4 : 2.9} anchor="bottom" envMapIntensity={1.3} />
      </Suspense>
      {/* soft shadow that travels with him */}
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.75, 32]} />
        <meshBasicMaterial color="#2a1a4a" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Falling notes and drops as two instanced pools. */
function Rain({ world }: { world: React.MutableRefObject<World> }) {
  const good = useRef<THREE.InstancedMesh>(null);
  const bad = useRef<THREE.InstancedMesh>(null);
  const glitch = useStore((s) => s.glitch);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const s = useMemo(() => new THREE.Vector3(), []);
  const POOL = 48;

  useFrame(() => {
    const w = world.current;
    let gi = 0;
    let bi = 0;
    for (const d of w.drops) {
      if (d.dead) continue;
      const mesh = d.bad ? bad.current : good.current;
      const i = d.bad ? bi++ : gi++;
      if (!mesh || i >= POOL) continue;
      e.set(w.t * d.spin, w.t * d.spin * 0.7, 0);
      q.setFromEuler(e);
      v.set(d.x, d.y, d.z);
      s.setScalar(d.bad ? 0.3 : 0.26);
      m.compose(v, q, s);
      mesh.setMatrixAt(i, m);
    }
    // park the unused instances far away
    v.set(0, -100, 0);
    s.setScalar(0.001);
    q.identity();
    m.compose(v, q, s);
    if (good.current) {
      for (let i = gi; i < POOL; i++) good.current.setMatrixAt(i, m);
      good.current.instanceMatrix.needsUpdate = true;
    }
    if (bad.current) {
      for (let i = bi; i < POOL; i++) bad.current.setMatrixAt(i, m);
      bad.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={good} args={[undefined, undefined, POOL]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 2]} />
        <Lilac glitch={glitch} />
      </instancedMesh>
      <instancedMesh ref={bad} args={[undefined, undefined, POOL]} frustumCulled={false}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshPhysicalMaterial color="#06030a" roughness={0.15} metalness={0.4} clearcoat={1} emissive="#3b0066" emissiveIntensity={0.6} />
      </instancedMesh>
    </>
  );
}

/** Spawning, falling, collisions and the clock. Reports to React only on discrete events. */
function Logic({
  world,
  phase,
  onCatch,
  onHit,
  onTime,
}: {
  world: React.MutableRefObject<World>;
  phase: Phase;
  onCatch: () => void;
  onHit: () => void;
  onTime: (left: number) => void;
}) {
  const { viewport, pointer } = useThree();
  const lastSecond = useRef(DURATION);

  useFrame((_, dt) => {
    const w = world.current;
    if (phase !== "play") return;
    dt = Math.min(dt, 0.1);
    if (!w.startedAt) w.startedAt = performance.now();
    w.t = (performance.now() - w.startedAt) / 1000;
    w.hitFlash = Math.max(0, w.hitFlash - dt);
    w.caughtFlash = Math.max(0, w.caughtFlash - dt);

    // pointer steers; the lane is a little narrower on phones
    const lane = Math.min(LANE, viewport.width * 0.42);
    w.targetX = THREE.MathUtils.clamp(pointer.x * lane * 1.15, -lane, lane);

    // spawn, faster as time goes on
    const progress = w.t / DURATION;
    if (w.t >= w.spawnAt) {
      const bad = Math.random() < 0.38 + progress * 0.2;
      w.drops.push({
        id: w.nextId++,
        x: (Math.random() * 2 - 1) * lane,
        y: TOP,
        z: (Math.random() - 0.5) * 0.6,
        bad,
        speed: 2.6 + progress * 2.6 + Math.random() * 0.8,
        spin: 0.6 + Math.random() * 1.6,
        dead: false,
      });
      w.spawnAt = w.t + Math.max(0.22, 0.6 - progress * 0.35);
    }

    // fall and collide with André (a box around his body)
    for (const d of w.drops) {
      if (d.dead) continue;
      d.y -= d.speed * dt;
      const hitX = Math.abs(d.x - w.andreX) < 0.55;
      const hitY = d.y < FLOOR + 2.6 && d.y > FLOOR + 0.2;
      if (hitX && hitY) {
        d.dead = true;
        if (d.bad) {
          w.hitFlash = 0.35;
          onHit();
        } else {
          w.caughtFlash = 0.5;
          onCatch();
        }
      } else if (d.y < FLOOR - 0.8) {
        d.dead = true;
      }
    }
    if (w.drops.length > 120) w.drops = w.drops.filter((d) => !d.dead);

    const left = Math.max(0, Math.ceil(DURATION - w.t));
    if (left !== lastSecond.current) {
      lastSecond.current = left;
      onTime(left);
    }
  });
  return null;
}

/** Camera: front, slightly above, with a faint sway and a shake when hit. */
function Rig({ world }: { world: React.MutableRefObject<World> }) {
  useFrame((state) => {
    const w = world.current;
    const t = state.clock.elapsedTime;
    state.camera.position.set(Math.sin(t * 0.3) * 0.3 + (w.hitFlash > 0 ? (Math.random() - 0.5) * 0.15 : 0), 0.4, 8.6);
    state.camera.lookAt(0, 0.1, 0);
  });
  return null;
}

function Stage() {
  const glitch = useStore((s) => s.glitch);
  return (
    <>
      {/* the stage disc André stands on */}
      <mesh position={[0, FLOOR - 0.06, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[4.2, 64]} />
        <Chrome dark={glitch} roughness={0.25} />
      </mesh>
      <mesh position={[0, FLOOR - 0.05, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[4.2, 4.33, 64]} />
        <Lilac glitch={glitch} />
      </mesh>
    </>
  );
}

function Hearts({ lives }: { lives: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`${lives} von ${LIVES} Leben`}>
      {Array.from({ length: LIVES }).map((_, i) => (
        <span
          key={i}
          className="inline-block h-3.5 w-3.5 rounded-full transition-all duration-300"
          style={{
            background: i < lives ? "radial-gradient(circle at 35% 30%, #fff, #cfcfdc 45%, #8e8c9c 75%, #fff)" : "transparent",
            boxShadow: i < lives ? "0 2px 6px rgba(60,40,100,.3)" : "inset 0 0 0 1.5px rgba(128,128,150,.5)",
            transform: i < lives ? "scale(1)" : "scale(.7)",
          }}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const world = useRef<World>(makeWorld());
  const [phase, setPhase] = useState<Phase>("intro");
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const takeover = useStore((s) => s.takeover);
  const takeOver = useStore((s) => s.takeOver);
  const release = useStore((s) => s.release);
  const triggerGlitch = useStore((s) => s.triggerGlitch);
  const restoreTakeover = useStore((s) => s.restoreTakeover);
  const setDevice = useStore((s) => s.setDevice);
  const phaseRef = useRef<Phase>("intro");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    restoreTakeover();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setDevice({ reduced: mq.matches, mobile: window.innerWidth < 768 || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024) });
  }, [restoreTakeover, setDevice]);

  const start = useCallback(() => {
    world.current = makeWorld();
    setLives(LIVES);
    setScore(0);
    setLeft(DURATION);
    setPhase("play");
  }, []);

  const onCatch = useCallback(() => setScore((s) => s + 1), []);
  const onHit = useCallback(() => {
    if (phaseRef.current !== "play") return;
    triggerGlitch(260, true);
    setLives((l) => {
      const n = l - 1;
      if (n <= 0) {
        setPhase("lost");
        // the twin takes the whole site, for the rest of the visit
        window.setTimeout(() => takeOver(), 350);
      }
      return n;
    });
  }, [takeOver, triggerGlitch]);
  const onTime = useCallback((n: number) => {
    setLeft(n);
    if (n <= 0 && phaseRef.current === "play") setPhase("won");
  }, []);

  // debug handle (used by the screenshot tests): force outcomes, drop a row of notes
  useEffect(() => {
    const g = {
      win: () => setPhase("won"),
      lose: () => {
        setPhase("lost");
        takeOver();
      },
      row: () => {
        const w = world.current;
        for (let i = 0; i < 10; i++)
          w.drops.push({ id: w.nextId++, x: -3.2 + i * 0.7, y: 0.5 + (i % 3), z: 0, bad: i % 3 === 0, speed: 0, spin: 1, dead: false });
      },
    };
    (window as unknown as { __leherbGame: unknown }).__leherbGame = g;
  }, [takeOver]);

  // keyboard steering mirrors the pointer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const w = world.current;
      if (e.key === "ArrowLeft" || e.key === "a") w.targetX = Math.max(-LANE, w.targetX - 0.9);
      if (e.key === "ArrowRight" || e.key === "d") w.targetX = Math.min(LANE, w.targetX + 0.9);
      if (e.key === " " && phaseRef.current !== "play") start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  return (
    <main className="fixed inset-0">
      <Loader />
      <Nav />
      <Tear />
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 8.6], fov: 42 }} gl={{ antialias: true }} style={{ touchAction: "none" }}>
        <Studio />
        <Rig world={world} />
        <Stage />
        <Andre world={world} />
        <Rain world={world} />
        <Logic world={world} phase={phase} onCatch={onCatch} onHit={onHit} onTime={onTime} />
      </Canvas>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-5 top-[max(5.5rem,10vh)] flex items-start justify-between sm:inset-x-10 lg:inset-x-16">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">Das Spiel</div>
          <div className="display mt-1 text-5xl tabular-nums sm:text-7xl">{phase === "play" ? left : DURATION}</div>
          <div className="mt-2">
            <Hearts lives={lives} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">Noten</div>
          <div className="display mt-1 text-5xl tabular-nums sm:text-7xl" style={{ color: "var(--lilac-deep)" }}>
            {score}
          </div>
        </div>
      </div>

      {/* overlays */}
      {phase !== "play" && (
        <div className="absolute inset-x-5 bottom-[max(2rem,env(safe-area-inset-bottom))] sm:inset-x-10 lg:inset-x-16">
          <div className="glass drip mx-auto max-w-xl p-5 text-center sm:p-7">
            {phase === "intro" && (
              <>
                <h1 className="display text-3xl sm:text-5xl">{takeover ? "Hol ihn zurück." : "24 Sekunden. 7 Leben."}</h1>
                <p className="mt-3 text-sm leading-relaxed opacity-85 sm:text-base">
                  {takeover
                    ? "Die Nacht hat die Seite. Fang die lila Noten, weich den schwarzen Tropfen aus. Überstehst du 24 Sekunden, gehört die Bühne wieder André."
                    : "Bewege André mit Maus oder Finger. Fang die lila Noten, weich den schwarzen Tropfen aus. Wer alle sieben Leben verliert, überlässt die Seite dem anderen."}
                </p>
                <button onClick={start} className="btn-lilac mt-5 text-base">
                  Spielen
                </button>
              </>
            )}
            {phase === "won" && (
              <>
                <h2 className="display text-3xl sm:text-5xl">Du hast ihn gehalten.</h2>
                <p className="mt-3 text-sm leading-relaxed opacity-85 sm:text-base">
                  {score} Noten gefangen. Noch gehört die Bühne André.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {takeover ? (
                    <button
                      onClick={() => {
                        release();
                        setPhase("intro");
                      }}
                      className="btn-lilac text-base"
                    >
                      Zurück ins Licht
                    </button>
                  ) : (
                    <button onClick={start} className="btn-lilac text-base">
                      Noch einmal
                    </button>
                  )}
                  <Link href="/" className="btn-chrome text-base">
                    Zur Startseite
                  </Link>
                </div>
              </>
            )}
            {phase === "lost" && (
              <>
                <h2 className="display text-3xl sm:text-5xl">Die Nacht bin ich.</h2>
                <p className="mt-3 text-sm leading-relaxed opacity-85 sm:text-base">Die Seite gehört jetzt dem anderen. Du kannst sie zurückholen. Wenn du es schaffst.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button onClick={start} className="btn-lilac text-base">
                    Noch einmal
                  </button>
                  <Link href="/" className="btn-chrome text-base">
                    Zur Startseite
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
