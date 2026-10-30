import { player } from "./audio";

/** The 24/7 music video element (one on the page); the hero button and the card share it. */
let el: HTMLVideoElement | null = null;

export function registerVideo(v: HTMLVideoElement | null) {
  el = v;
}

/** Play the video with sound: pauses the soundtrack and the header film. Call inside a user gesture. */
export function playVideo() {
  if (!el) return false;
  player.pause(false);
  document.querySelector<HTMLVideoElement>("#hero-film video")?.pause();
  el.muted = false;
  el.volume = 1;
  const p = el.play();
  p?.catch(() => {});
  return true;
}

export function videoPlaying() {
  return !!el && !el.paused;
}
