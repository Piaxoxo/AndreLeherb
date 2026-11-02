"use client";

import { useFrame } from "@react-three/fiber";

/**
 * Scroll state of the start page, driven by the normal document scroll.
 * `offset` eases toward the real position so the room glides; the HTML
 * itself scrolls natively, so the page always scrolls even if WebGL stalls.
 */
export const scrollState = { offset: 0, target: 0 };

export function useScroll() {
  return scrollState;
}

/** Progress 0..1 of the document scroll. */
export function scrollProgress() {
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(1, Math.max(0, window.scrollY / max));
}

/** Inside the Canvas: eases the offset toward the document scroll every frame. */
export function ScrollDriver() {
  useFrame((_, dt) => {
    scrollState.target = scrollProgress();
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 9);
    scrollState.offset += (scrollState.target - scrollState.offset) * k;
    if (Math.abs(scrollState.target - scrollState.offset) < 0.00005)
      scrollState.offset = scrollState.target;
  });
  return null;
}
