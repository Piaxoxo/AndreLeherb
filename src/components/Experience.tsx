"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useStore } from "@/store";
import Loader from "./Loader";
import MicScrub from "./MicScrub";
import StaticHome from "./StaticHome";
import { Nav, Tear } from "./Chrome";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

export default function Experience() {
  const setDevice = useStore((s) => s.setDevice);
  const restoreTakeover = useStore((s) => s.restoreTakeover);
  const isStatic = useStore((s) => s.a11y.static);
  const motion = useStore((s) => s.a11y.motion);
  const setReady = useStore((s) => s.setReady);
  const active = useStore((s) => s.homeActive);

  // Other page open: pause the film, it is not visible anyway.
  useEffect(() => {
    const v = document.querySelector<HTMLVideoElement>("#hero-film video");
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  // Every mount of the 3D start page gets the loader: the room takes a moment to build,
  // and a visible loader beats a frozen frame when coming back from another page.
  useEffect(() => {
    setReady(false);
  }, [setReady]);

  useEffect(() => {
    restoreTakeover();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setDevice({
        reduced: mq.matches,
        mobile: window.innerWidth < 768,
      });
    update();
    // Small debug handle (used by the screenshot tests).
    (window as unknown as { __leherb: unknown }).__leherb = {
      glitch: (ms?: number) => useStore.getState().triggerGlitch(ms),
      ready: () => useStore.getState().ready,
      active: () => useStore.getState().homeActive,
    };
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);
    // Very rarely (about 1 in 50 visits) the page twitches on its own for a split second.
    let twitch: number | undefined;
    if (Math.random() < 0.02 && !mq.matches && motion) {
      twitch = window.setTimeout(
        () => useStore.getState().triggerGlitch(140, true),
        9000 + Math.random() * 12000,
      );
    }
    return () => {
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
      window.clearTimeout(twitch);
    };
  }, [setDevice, restoreTakeover, motion]);

  if (isStatic) return <StaticHome />;

  return (
    <main className="fixed inset-0">
      <Loader />
      {/* the header film: a plain video element behind the transparent canvas, hardware decoded */}
      <div id="hero-film" className="hero-film" aria-hidden>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/header-poster.jpg"
        >
          <source src="/video/header.mp4" type="video/mp4" />
        </video>
      </div>
      <Nav />
      <Stage />
      <MicScrub />
      <Tear />
    </main>
  );
}
