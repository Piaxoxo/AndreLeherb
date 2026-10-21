import { create } from "zustand";
import { glitchNotes } from "./content";

type SongId = "247" | "walzer" | null;

type State = {
  ready: boolean;
  setReady: (v: boolean) => void;

  playing: SongId;
  setPlaying: (id: SongId) => void;

  /** Audio level 0..1, written by the analyser every frame, read by the scene. */
  level: { value: number; beat: number };

  glitch: boolean;
  glitchCount: number;
  note: string | null;
  /** `silent`: a split-second twitch that leaves no note behind (the page "flickering by itself"). */
  triggerGlitch: (ms?: number, silent?: boolean) => void;

  /** The evil twin has taken the site: the dark mode stays for the rest of the visit. */
  takeover: boolean;
  takeOver: () => void;
  release: () => void;
  /** Restores a takeover saved in this tab (call once on mount of every page). */
  restoreTakeover: () => void;

  reduced: boolean;
  mobile: boolean;
  setDevice: (d: { reduced: boolean; mobile: boolean }) => void;
};

const KEY = "leherb-takeover";

export const useStore = create<State>((set, get) => ({
  ready: false,
  setReady: (ready) => set({ ready }),

  playing: null,
  setPlaying: (playing) => set({ playing }),

  level: { value: 0, beat: 0 },

  glitch: false,
  glitchCount: 0,
  note: null,
  triggerGlitch: (ms = 2600, silent = false) => {
    if (get().glitch || get().takeover) return;
    const count = silent ? get().glitchCount : get().glitchCount + 1;
    set({ glitch: true, glitchCount: count });
    if (typeof document !== "undefined") document.documentElement.dataset.glitch = "on";
    window.setTimeout(() => {
      set({
        glitch: false,
        note: silent ? get().note : glitchNotes[Math.min(count - 1, glitchNotes.length - 1)],
      });
      if (typeof document !== "undefined") delete document.documentElement.dataset.glitch;
    }, ms);
  },

  takeover: false,
  takeOver: () => {
    set({ takeover: true, glitch: true, note: "Die Nacht bin ich." });
    document.documentElement.dataset.glitch = "on";
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  },
  release: () => {
    set({ takeover: false, glitch: false, note: null });
    delete document.documentElement.dataset.glitch;
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
  },
  restoreTakeover: () => {
    try {
      if (sessionStorage.getItem(KEY) === "1" && !get().takeover) {
        set({ takeover: true, glitch: true, note: "Die Nacht bin ich." });
        document.documentElement.dataset.glitch = "on";
      }
    } catch {}
  },

  reduced: false,
  mobile: false,
  setDevice: (d) => set(d),
}));
