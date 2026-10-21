"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store";
import { player } from "@/lib/audio";
import { songs } from "@/content";

function NavLogo({ dark = false }: { dark?: boolean }) {
  const glitch = useStore((s) => s.glitch);
  return <img src={glitch || dark ? "/img/logo-dark.webp" : "/img/logo-light.webp"} alt="" className="h-9 w-auto sm:h-11" draggable={false} />;
}

/** Fixed UI around the canvas: nav, mini player, glitch tear. */
/**
 * On the start page the sections are scroll targets inside the 3D stage;
 * from other pages they are real navigations back to "/".
 */
function Sec({ hash, home, className, children }: { hash: string; home: boolean; className: string; children: React.ReactNode }) {
  return home ? (
    <a href={`#${hash}`} className={className}>
      {children}
    </a>
  ) : (
    <Link href={`/#${hash}`} className={className}>
      {children}
    </Link>
  );
}

export function Nav({ dark = false }: { dark?: boolean }) {
  const home = usePathname() === "/";
  const link = "rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] opacity-70 hover:opacity-100";
  return (
    <header className={`pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-10 lg:px-16 ${dark ? "text-white" : ""}`}>
      <Link href="/" className="pointer-events-auto block" aria-label="Andre Leherb, Start">
        <NavLogo dark={dark} />
      </Link>
      <nav className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <Sec hash="musik" home={home} className={`hidden sm:block ${link}`}>
          Musik
        </Sec>
        <Link href="/galerie" className={link}>
          Galerie
        </Link>
        <Link href="/spiel" className={`hidden sm:block ${link}`}>
          Spiel
        </Link>
        <Link href="/ueber" className={link}>
          André
        </Link>
        <Sec hash="booking" home={home} className="btn-chrome whitespace-nowrap !py-2.5 !px-4 text-xs uppercase tracking-[0.15em]">
          Buch mich
        </Sec>
      </nav>
    </header>
  );
}

export function MiniPlayer() {
  const playing = useStore((s) => s.playing);
  if (!playing) return null;
  const song = songs.find((s) => s.id === playing)!;
  return (
    <div className="glass fixed bottom-4 left-4 z-40 flex items-center gap-3 !rounded-full py-2 pl-2 pr-4 sm:bottom-6 sm:left-6">
      <img src={song.cover} alt="" className="h-10 w-10 rounded-full object-cover" />
      <div className="leading-tight">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Läuft</div>
        <div className="text-sm font-bold">{song.title}</div>
      </div>
      <span aria-hidden className="ml-1 flex h-4 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="block w-[3px] rounded-sm" style={{ background: "var(--lilac-deep)", height: `${40 + ((i * 37) % 60)}%`, animation: `eq ${0.6 + i * 0.13}s ease-in-out infinite alternate` }} />
        ))}
      </span>
      <button onClick={() => player.pause()} className="ml-2 rounded-full px-2 text-sm font-bold opacity-70 hover:opacity-100" aria-label="Pause">
        ❚❚
      </button>
      <style>{`@keyframes eq{from{transform:scaleY(.3)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}

export function Tear() {
  const glitch = useStore((s) => s.glitch);
  const takeover = useStore((s) => s.takeover);
  // the tear is a flash effect; once the twin owns the page it stays calm
  if (!glitch || takeover) return null;
  return <div className="tear" aria-hidden />;
}
