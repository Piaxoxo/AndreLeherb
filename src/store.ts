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

  /** language of the interface and content */
  lang: "de" | "en";
  setLang: (l: "de" | "en") => void;

  /** accessibility preferences (persisted) */
  a11y: A11y;
  setA11y: (patch: Partial<A11y>) => void;
  /** reads saved preferences and the system settings; call once on mount */
  initPrefs: () => void;
};

export type A11y = {
  /** effects and motion on (3D post, video, animation, glitch) */
  motion: boolean;
  /** plain page instead of the 3D room */
  static: boolean;
  /** 1, 1.125 or 1.25 */
  fontScale: number;
  contrast: boolean;
};

const KEY = "leherb-takeover";
const PREFS = "leherb-prefs";

function applyPrefs(a: A11y, lang: "de" | "en") {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  r.lang = lang;
  r.style.fontSize = a.fontScale === 1 ? "" : `${a.fontScale * 100}%`;
  if (a.motion) delete r.dataset.reduced;
  else r.dataset.reduced = "on";
  if (a.static) r.dataset.static = "on";
  else delete r.dataset.static;
  if (a.contrast) r.dataset.contrast = "on";
  else delete r.dataset.contrast;
}

function savePrefs(a: A11y, lang: "de" | "en") {
  try {
    localStorage.setItem(PREFS, JSON.stringify({ ...a, lang }));
  } catch {}
}

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
    if (get().glitch || get().takeover || !get().a11y.motion) return;
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
  setDevice: (d) => set({ ...d, reduced: d.reduced || !get().a11y.motion }),

  lang: "de",
  setLang: (lang) => {
    set({ lang });
    applyPrefs(get().a11y, lang);
    savePrefs(get().a11y, lang);
  },

  a11y: { motion: true, static: false, fontScale: 1, contrast: false },
  setA11y: (patch) => {
    const a11y = { ...get().a11y, ...patch };
    set({ a11y, reduced: !a11y.motion });
    applyPrefs(a11y, get().lang);
    savePrefs(a11y, get().lang);
  },
  initPrefs: () => {
    let a11y = get().a11y;
    let lang = get().lang;
    try {
      const raw = localStorage.getItem(PREFS);
      if (raw) {
        const p = JSON.parse(raw);
        a11y = { ...a11y, ...p };
        if (p.lang === "en" || p.lang === "de") lang = p.lang;
      } else {
        // first visit: follow the system
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) a11y = { ...a11y, motion: false };
        if (navigator.language && !navigator.language.toLowerCase().startsWith("de")) lang = "en";
      }
    } catch {}
    set({ a11y, lang, reduced: !a11y.motion });
    applyPrefs(a11y, lang);
  },
}));
