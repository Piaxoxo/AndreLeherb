"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store";

/** Tiny on-device diagnostics, only with ?debug in the address: what the scroller and touches do. */
export default function DebugHud() {
  const [on, setOn] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    if (!/[?&]debug/.test(window.location.search)) return;
    setOn(true);
    const log: string[] = [];
    let touches = 0;
    let moves = 0;
    let prevented = 0;
    let lastTarget = "";
    const tag = (el: Element | null) =>
      el
        ? el.tagName.toLowerCase() +
          (el.id ? "#" + el.id : "") +
          "." +
          [...el.classList].slice(0, 2).join(".")
        : "-";
    const onStart = (e: TouchEvent) => {
      touches++;
      const t = e.touches[0];
      lastTarget = tag(document.elementFromPoint(t.clientX, t.clientY));
    };
    const onMove = (e: TouchEvent) => {
      moves++;
      if (e.defaultPrevented) prevented++;
    };
    document.addEventListener("touchstart", onStart, {
      passive: true,
      capture: true,
    });
    document.addEventListener("touchmove", onMove, { passive: true });
    const onErr = (e: ErrorEvent) =>
      log.push("ERR " + String(e.message).slice(0, 80));
    window.addEventListener("error", onErr);
    const t = window.setInterval(() => {
      const s = useStore.getState();
      const el = document.querySelector<HTMLElement>("[data-scroll]");
      const html = el?.querySelector<HTMLElement>("div[style*='translate3d']");
      const canvas = document.querySelector("main canvas");
      setLines([
        `path ${location.pathname} ready ${s.ready} active ${s.homeActive} glitch ${s.glitch} takeover ${s.takeover} mobile ${s.mobile}`,
        `scroller ${el ? `${Math.round(el.scrollTop)}/${el.scrollHeight - el.clientHeight} h${el.clientHeight} ov:${getComputedStyle(el).overflowY} pe:${getComputedStyle(el).pointerEvents}` : "none"}`,
        `layer ${html?.style.transform ?? "-"}`,
        `body ov "${document.body.style.overflow}" html ov ${getComputedStyle(document.documentElement).overflow} canvas ${canvas ? canvas.clientWidth + "x" + canvas.clientHeight : "none"}`,
        `touches ${touches} moves ${moves} prevented ${prevented} target ${lastTarget}`,
        `vh ${window.innerHeight} vv ${Math.round(window.visualViewport?.height ?? 0)} ua ${navigator.userAgent.slice(-40)}`,
        ...log.slice(-3),
      ]);
    }, 400);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("touchstart", onStart, true);
      document.removeEventListener("touchmove", onMove);
      window.removeEventListener("error", onErr);
    };
  }, []);
  if (!on) return null;
  return (
    <pre
      className="pointer-events-none fixed left-2 top-16 z-[200] max-w-[95vw] whitespace-pre-wrap break-all rounded-lg p-2 text-[10px] leading-snug"
      style={{
        background: "rgba(0,0,0,.8)",
        color: "#9fff9f",
        fontFamily: "monospace",
      }}
    >
      {lines.join("\n")}
    </pre>
  );
}
