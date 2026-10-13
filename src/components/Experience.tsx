"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useStore } from "@/store";
import Loader from "./Loader";
import { MiniPlayer, Nav, Tear } from "./Chrome";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

export default function Experience() {
  const setDevice = useStore((s) => s.setDevice);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setDevice({
        reduced: mq.matches,
        mobile: window.innerWidth < 768 || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024),
      });
    update();
    // Small debug handle (used by the screenshot tests).
    (window as unknown as { __leherb: unknown }).__leherb = { glitch: (ms?: number) => useStore.getState().triggerGlitch(ms) };
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, [setDevice]);

  return (
    <main className="fixed inset-0">
      <Loader />
      <Nav />
      <Stage />
      <MiniPlayer />
      <Tear />
    </main>
  );
}
