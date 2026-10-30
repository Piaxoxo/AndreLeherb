"use client";

import { useEffect, useRef, useState } from "react";
import type { Song } from "@/content";
import { useT } from "@/i18n";
import { useStore } from "@/store";
import { player } from "@/lib/audio";
import { playVideo, registerVideo } from "@/lib/video";

/** The 24/7 music video: the promoted piece of the page, with sound on tap. */
export default function VideoCard({
  song,
  className = "",
}: {
  song: Song;
  className?: string;
}) {
  const t = useT();
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  const playing = useStore((s) => s.playing);

  useEffect(() => {
    registerVideo(ref.current);
    return () => registerVideo(null);
  }, []);

  // the soundtrack started: the video goes quiet
  useEffect(() => {
    if (playing && ref.current && !ref.current.paused) ref.current.pause();
  }, [playing]);

  return (
    <div className={`glass drip w-full max-w-xl p-2 sm:p-3 ${className}`}>
      <div
        className="relative overflow-hidden rounded-[1.1rem] bg-black"
        style={{ aspectRatio: "888 / 500" }}
      >
        <video
          ref={ref}
          src="/video/247.mp4"
          poster="/video/247-poster.jpg"
          playsInline
          preload="metadata"
          controls={on}
          className="h-full w-full object-cover"
          onPlay={() => {
            setOn(true);
            player.pause(false);
            document
              .querySelector<HTMLVideoElement>("#hero-film video")
              ?.pause();
          }}
          onEnded={() => {
            document
              .querySelector<HTMLVideoElement>("#hero-film video")
              ?.play()
              .catch(() => {});
          }}
        />
        {!on && (
          <button
            onClick={() => playVideo()}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={t.hero.watch(song.title)}
          >
            <span className="btn-lilac !px-7 !py-4 text-base shadow-2xl">
              <span aria-hidden className="inline-block w-3 text-center">
                ▶
              </span>
              {t.hero.watch(song.title)}
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-2 pb-2 pt-3 sm:px-3 sm:pb-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60 sm:text-xs">
            <span style={{ color: "var(--lilac-deep)" }}>
              {t.musik.video} ·{" "}
            </span>
            {t.musik.single} · {song.release}
          </div>
          <h3 className="display mt-1 text-2xl sm:text-3xl">{song.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {song.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border px-3 py-1.5 text-xs font-bold transition hover:bg-white/60"
              style={{ borderColor: "var(--glass-border)" }}
            >
              {l.label} ↗
            </a>
          ))}
        </div>
        <div className="hidden w-full text-[11px] leading-snug opacity-50 sm:block">
          {song.credits}
        </div>
      </div>
    </div>
  );
}

/** Hero button: jumps to the video and starts it with sound. */
export function WatchButton({ song }: { song: Song }) {
  const t = useT();
  return (
    <button
      onClick={() => {
        // play first (inside the gesture), then bring the card into view
        playVideo();
        document.querySelector<HTMLAnchorElement>("a[href='#musik']")?.click();
      }}
      className="btn-lilac text-base"
    >
      <span aria-hidden className="inline-block w-3 text-center">
        ▶
      </span>
      {t.hero.watch(song.title)}
    </button>
  );
}
