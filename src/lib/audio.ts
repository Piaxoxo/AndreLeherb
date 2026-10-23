import { useStore } from "@/store";

/**
 * One shared <audio> element + Web Audio analyser. The scene reads
 * `useStore.getState().level` each frame; nothing re-renders for audio.
 */
class Player {
  el: HTMLAudioElement | null = null;
  ctx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  data: Uint8Array<ArrayBuffer> | null = null;
  raf = 0;
  current: string | null = null;
  smooth = 0;
  prev = 0;

  private ensure() {
    if (this.el) return;
    this.el = new Audio();
    this.el.crossOrigin = "anonymous";
    this.el.loop = true;
    this.el.preload = "auto";
    this.el.volume = 0.9;
  }

  private connect() {
    if (this.ctx || !this.el) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new Ctx();
    const src = this.ctx.createMediaElementSource(this.el);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.6;
    this.data = new Uint8Array(
      this.analyser.frequencyBinCount,
    ) as Uint8Array<ArrayBuffer>;
    src.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  async play(id: "247" | "walzer", url: string) {
    this.ensure();
    this.connect();
    const el = this.el!;
    if (this.current !== url) {
      el.src = url;
      this.current = url;
    }
    try {
      // start inside the user gesture (Safari): play first, resume the context alongside
      const started = el.play();
      void this.ctx?.resume();
      await started;
      useStore.getState().setPlaying(id);
      this.tick();
    } catch {
      useStore.getState().setPlaying(null);
    }
  }

  pause() {
    this.el?.pause();
    useStore.getState().setPlaying(null);
    cancelAnimationFrame(this.raf);
    useStore.getState().level.value = 0;
    useStore.getState().level.beat = 0;
  }

  toggle(id: "247" | "walzer", url: string) {
    if (useStore.getState().playing === id) this.pause();
    else this.play(id, url);
  }

  /** Short detune wobble used by the glitch. */
  wobble(ms = 900) {
    if (!this.el) return;
    const el = this.el;
    const start = performance.now();
    const step = () => {
      const t = (performance.now() - start) / ms;
      if (t >= 1 || el.paused) {
        el.playbackRate = 1;
        return;
      }
      el.playbackRate = 1 + Math.sin(t * 40) * 0.12 * (1 - t) - 0.2 * (1 - t);
      requestAnimationFrame(step);
    };
    step();
  }

  private tick = () => {
    if (!this.analyser || !this.data || this.el?.paused) return;
    this.analyser.getByteFrequencyData(this.data);
    // Bass-weighted average of the lower bins.
    let sum = 0;
    const n = 24;
    for (let i = 0; i < n; i++) sum += this.data[i];
    const raw = sum / (n * 255);
    this.smooth += (raw - this.smooth) * 0.25;
    const beat = Math.max(0, raw - this.prev) * 4;
    this.prev += (raw - this.prev) * 0.08;
    const lvl = useStore.getState().level;
    lvl.value = this.smooth;
    lvl.beat = Math.min(1, beat);
    this.raf = requestAnimationFrame(this.tick);
  };
}

export const player = new Player();
