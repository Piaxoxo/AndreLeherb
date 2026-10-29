"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Experience from "./Experience";
import { useStore } from "@/store";

/**
 * Keeps the 3D start page alive while other pages are open (desktop and tablet).
 * The room is built once; going back to Home is instant instead of a fresh WebGL setup.
 * Phones get a fresh start page every time instead: iOS does not reliably let a
 * hidden scroll container scroll again once it is shown, and memory is tight there.
 */
export default function HomeKeeper() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [seen, setSeen] = useState(home);
  // derived during render: once the start page was shown it stays mounted
  if (home && !seen) setSeen(true);
  const setHomeActive = useStore((s) => s.setHomeActive);
  const phone = useStore((s) => s.mobile);

  useEffect(() => {
    setHomeActive(home);
    if (home) window.dispatchEvent(new CustomEvent("leherb:home"));
  }, [home, setHomeActive]);

  if (!home && (!seen || phone)) return null;
  return (
    // visibility (not display:none): a hidden container keeps its layout and scroll position
    <div
      key={phone ? "phone" : "desk"}
      style={home ? undefined : { visibility: "hidden", pointerEvents: "none" }}
      aria-hidden={!home}
    >
      <Experience />
    </div>
  );
}
