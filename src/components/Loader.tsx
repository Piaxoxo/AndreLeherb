"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useStore } from "@/store";

export default function Loader() {
  const { progress, active } = useProgress();
  const ready = useStore((s) => s.ready);
  const setReady = useStore((s) => s.setReady);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Done once the loaders have been idle for a moment, and never later than 6 s.
    const t = window.setTimeout(() => setReady(true), active ? 6000 : 1000);
    return () => window.clearTimeout(t);
  }, [active, progress, setReady]);

  useEffect(() => {
    if (ready) {
      const t = window.setTimeout(() => setGone(true), 900);
      return () => window.clearTimeout(t);
    }
  }, [ready]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ background: "var(--bg)", opacity: ready ? 0 : 1, pointerEvents: ready ? "none" : "auto" }}
    >
      <div className="pyramid-loader" style={{ transform: "scale(0.8) rotateX(-20deg)" }}>
        <div className="wrapper">
          <span className="side side1" />
          <span className="side side2" />
          <span className="side side3" />
          <span className="side side4" />
          <span className="shadow" />
        </div>
      </div>
      <div className="display mt-2 text-sm tracking-[0.3em]" style={{ color: "var(--violet)" }}>
        ANDRE LEHERB
      </div>
      <div className="mt-3 h-[2px] w-40 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.round(progress)}%`, background: "var(--lilac-deep)", transition: "width .3s" }}
        />
      </div>
    </div>
  );
}
