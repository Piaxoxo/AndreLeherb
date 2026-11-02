"use client";

import { useEffect } from "react";
import { useStore } from "@/store";

/**
 * One source of truth for the dark state: the html attribute follows the store
 * (glitch or takeover). Nothing else can leave the page half-dark.
 */
export default function GlitchSync() {
  useEffect(() => {
    const apply = (on: boolean) => {
      if (on) document.documentElement.dataset.glitch = "on";
      else delete document.documentElement.dataset.glitch;
    };
    const applyLite = (on: boolean) => {
      if (on) document.documentElement.dataset.lite = "on";
      else delete document.documentElement.dataset.lite;
    };
    const s = useStore.getState();
    apply(s.glitch || s.takeover);
    applyLite(s.lite);
    return useStore.subscribe((st, prev) => {
      const on = st.glitch || st.takeover;
      if (on !== (prev.glitch || prev.takeover)) apply(on);
      if (st.lite !== prev.lite) applyLite(st.lite);
    });
  }, []);
  return null;
}
