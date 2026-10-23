"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useT } from "@/i18n";

/** A whispered hint every so often: how to wake the twin. */
export default function GlitchHints() {
  const t = useT();
  const mobile = useStore((s) => s.mobile);
  const motion = useStore((s) => s.a11y.motion);
  const takeover = useStore((s) => s.takeover);
  const glitch = useStore((s) => s.glitch);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!motion || takeover) return;
    const list = mobile ? t.hints.phone : t.hints.list;
    let i = Math.floor(Math.random() * list.length);
    let hide: number | undefined;
    const show = () => {
      setHint(list[i % list.length]);
      i++;
      hide = window.setTimeout(() => setHint(null), 4600);
    };
    const first = window.setTimeout(show, 9000);
    const every = window.setInterval(show, 24000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
      window.clearTimeout(hide);
    };
  }, [motion, takeover, mobile, t]);

  if (!hint || glitch || takeover) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[4.6rem] z-[45] flex justify-center px-4 md:top-auto md:bottom-[5.6rem]"
      aria-hidden
    >
      <div className="hint text-[11px] sm:text-xs">
        <span className="opacity-50">{t.hints.label} · </span>
        {hint}
      </div>
    </div>
  );
}
