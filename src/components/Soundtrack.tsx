"use client";

import { useStore } from "@/store";
import { useContent, useT } from "@/i18n";
import { player } from "@/lib/audio";

/**
 * 24/7 as the soundtrack of the site: a manual player that keeps playing
 * across pages. It never starts by itself; the music video is the one thing
 * that plays automatically.
 */
export default function Soundtrack() {
  const playing = useStore((s) => s.playing);
  const t = useT();
  const { songs } = useContent();
  const s247 = songs[0];

  // No automatic start: the music video is the one thing that plays by itself.

  const pause = () => player.pause();
  const play = () => player.play("247", s247.audio!);

  const song = playing ? songs.find((s) => s.id === playing)! : s247;

  const mobile = useStore((s) => s.mobile);

  const button = (
    <button
      onClick={playing ? pause : play}
      aria-label={playing ? t.player.pause : t.player.start}
      title={playing ? t.player.pause : t.player.start}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
    >
      <img
        src={song.cover}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-[10px] text-black shadow">
        {playing ? "❚❚" : "▶"}
      </span>
    </button>
  );

  // phone: a round button beside the logo; desktop: a pill at the bottom centre
  if (mobile) {
    return (
      <div
        data-soundtrack
        className="glass fixed left-[5.9rem] top-[13px] z-40 !rounded-full !p-[3px]"
        style={{ pointerEvents: "auto" }}
      >
        {button}
      </div>
    );
  }
  return (
    <div
      data-soundtrack
      className="glass fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 !rounded-full py-2 pl-2 pr-4"
      style={{ pointerEvents: "auto" }}
    >
      {button}
      <div className="leading-tight">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
          {playing ? t.player.playing : t.player.soundtrack}
        </div>
        <div className="text-sm font-bold">{song.title}</div>
      </div>
      {playing && (
        <span aria-hidden className="ml-1 flex h-4 items-end gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <i
              key={i}
              className="block w-[3px] rounded-sm"
              style={{
                background: "var(--lilac-deep)",
                height: `${40 + ((i * 37) % 60)}%`,
                animation: `eq ${0.6 + i * 0.13}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
