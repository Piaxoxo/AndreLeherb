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
  triggerGlitch: (ms?: number) => void;

  reduced: boolean;
  mobile: boolean;
  setDevice: (d: { reduced: boolean; mobile: boolean }) => void;
};

export const useStore = create<State>((set, get) => ({
  ready: false,
  setReady: (ready) => set({ ready }),

  playing: null,
  setPlaying: (playing) => set({ playing }),

  level: { value: 0, beat: 0 },

  glitch: false,
  glitchCount: 0,
  note: null,
  triggerGlitch: (ms = 2600) => {
    if (get().glitch) return;
    const count = get().glitchCount + 1;
    set({ glitch: true, glitchCount: count });
    if (typeof document !== "undefined") document.documentElement.dataset.glitch = "on";
    window.setTimeout(() => {
      set({
        glitch: false,
        note: glitchNotes[Math.min(count - 1, glitchNotes.length - 1)],
      });
      if (typeof document !== "undefined") delete document.documentElement.dataset.glitch;
    }, ms);
  },

  reduced: false,
  mobile: false,
  setDevice: (d) => set(d),
}));
