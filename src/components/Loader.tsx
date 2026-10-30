"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import Pyramid from "./Pyramid";

export default function Loader() {
  const { progress, active } = useProgress();
  const ready = useStore((s) => s.ready);
  const setReady = useStore((s) => s.setReady);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Done once the loaders have been idle for a moment, and never later than 5 s after mount
    // (a streaming video texture can keep the loader "active" for a long time).
    const t = window.setTimeout(() => setReady(true), active ? 6000 : 1000);
    return () => window.clearTimeout(t);
  }, [active, progress, setReady]);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 5000);
    return () => window.clearTimeout(t);
  }, [setReady]);

  useEffect(() => {
    // fade out 900 ms after ready; a later ready=false (page re-mounted) brings it back
    const t = window.setTimeout(() => setGone(ready), ready ? 900 : 0);
    return () => window.clearTimeout(t);
  }, [ready]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ background: "var(--bg)", opacity: ready ? 0 : 1, pointerEvents: ready ? "none" : "auto" }}
    >
      <Pyramid />
      <img src="/img/logo-light.webp" alt="Andre Leherb" className="mt-2 h-12 w-auto sm:h-14" draggable={false} />
      <div className="mt-3 h-[2px] w-40 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.round(progress)}%`, background: "var(--lilac-deep)", transition: "width .3s" }}
        />
      </div>
    </div>
  );
}
