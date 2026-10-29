"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Experience from "./Experience";
import { useStore } from "@/store";

/**
 * Keeps the 3D start page alive while other pages are open. The room is built once;
 * going back to Home is instant instead of a fresh WebGL setup every time.
 * It is only mounted once the visitor has actually been on the start page.
 */
export default function HomeKeeper() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [seen, setSeen] = useState(home);
  // derived during render: once the start page was shown it stays mounted
  if (home && !seen) setSeen(true);
  const setHomeActive = useStore((s) => s.setHomeActive);

  useEffect(() => {
    setHomeActive(home);
    if (home) window.dispatchEvent(new CustomEvent("leherb:home"));
  }, [home, setHomeActive]);

  if (!seen && !home) return null;
  return (
    // visibility (not display:none): iOS silently resets a hidden container's scroll
    // position, which left the room and its scroller out of sync when coming back
    <div
      style={home ? undefined : { visibility: "hidden", pointerEvents: "none" }}
      aria-hidden={!home}
    >
      <Experience />
    </div>
  );
}
