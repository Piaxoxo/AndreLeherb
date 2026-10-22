"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { player } from "@/lib/audio";
import { useContent, useT } from "@/i18n";

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
  const [open, setOpen] = useState(false);
  const t = useT();
  const link = "rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] opacity-70 hover:opacity-100";

  // close the phone menu on any navigation or hash jump
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("a")) close();
    });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = (
    <>
      {home ? (
        <a href="#" className={link}>
          {t.nav.home}
        </a>
      ) : (
        <Link href="/" className={link}>
          {t.nav.home}
        </Link>
      )}
      <Sec hash="musik" home={home} className={link}>
        {t.nav.musik}
      </Sec>
      <Link href="/galerie" className={link}>
        {t.nav.galerie}
      </Link>
      <Link href="/spiel" className={link}>
        {t.nav.spiel}
      </Link>
      <Link href="/ueber" className={link}>
        {t.nav.andre}
      </Link>
      <Sec hash="booking" home={home} className="btn-chrome whitespace-nowrap !py-2.5 !px-4 text-xs uppercase tracking-[0.15em]">
        {t.nav.book}
      </Sec>
    </>
  );

  return (
    <header className={`pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-10 lg:px-16 ${dark ? "text-white" : ""}`}>
      <Link href="/" className="pointer-events-auto block" aria-label="Andre Leherb, Start">
        <NavLogo dark={dark} />
      </Link>
      {/* desktop and tablet: everything in a row */}
      <nav className="pointer-events-auto hidden items-center gap-2 md:flex md:gap-3">{items}</nav>
      {/* phone: a burger that opens a full menu */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
        aria-label={open ? t.nav.close : t.nav.open}
        aria-expanded={open}
        style={{ background: "var(--glass-bg, rgba(255,255,255,.55))", boxShadow: "0 8px 24px -12px rgba(60,30,120,.35), inset 0 1px 0 rgba(255,255,255,.7)" }}
      >
        <span className="block h-[2px] w-5 rounded bg-current transition-transform" style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
        <span className="block h-[2px] w-5 rounded bg-current transition-opacity" style={{ opacity: open ? 0 : 1 }} />
        <span className="block h-[2px] w-5 rounded bg-current transition-transform" style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
      </button>
      {open && (
        <nav
          className="pointer-events-auto fixed inset-0 z-[-1] flex flex-col items-start justify-center gap-2 px-8 text-current md:hidden [&_a]:text-2xl [&_a]:tracking-[0.12em] [&_a]:normal-case"
          style={{ background: "var(--bg)", backdropFilter: "blur(20px)" }}
        >
          {items}
        </nav>
      )}
    </header>
  );
}

export function MiniPlayer() {
  const playing = useStore((s) => s.playing);
  const t = useT();
  const { songs } = useContent();
  if (!playing) return null;
  const song = songs.find((s) => s.id === playing)!;
  return (
    <div className="glass fixed bottom-4 left-4 z-40 flex items-center gap-3 !rounded-full py-2 pl-2 pr-4 sm:bottom-6 sm:left-6">
      <img src={song.cover} alt="" className="h-10 w-10 rounded-full object-cover" />
      <div className="leading-tight">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{t.player.playing}</div>
        <div className="text-sm font-bold">{song.title}</div>
      </div>
      <span aria-hidden className="ml-1 flex h-4 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="block w-[3px] rounded-sm" style={{ background: "var(--lilac-deep)", height: `${40 + ((i * 37) % 60)}%`, animation: `eq ${0.6 + i * 0.13}s ease-in-out infinite alternate` }} />
        ))}
      </span>
      <button onClick={() => player.pause()} className="ml-2 rounded-full px-2 text-sm font-bold opacity-70 hover:opacity-100" aria-label={t.player.pause}>
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
