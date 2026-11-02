"use client";

import Link from "next/link";
import { useContent, useT } from "@/i18n";

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.5-1.5h1.4V5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.2v3h2.5v7h2.8z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v3c-1.5 0-2.8-.4-3.9-1.2v6.1c0 3.3-2.4 5.5-5.4 5.5S5.8 18 5.8 14.9c0-3.2 2.7-5.7 6-5.3v3.1c-1.6-.4-3 .7-3 2.2 0 1.3 1 2.4 2.4 2.4s2.4-1 2.4-2.6V3h3z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  ),
};

/** A chrome pill per network: icon, name, "Folgen". */
function Social({ href, name, icon, follow }: { href: string; name: string; icon: React.ReactNode; follow: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="btn-chrome group !gap-2.5 !py-2.5 !pl-3 !pr-4 text-sm"
      aria-label={`${name}: ${follow}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(135deg,#b9a3ff,#6d4bd6)" }}>
        {icon}
      </span>
      <span className="font-bold">{name}</span>
      <span className="text-xs uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100">{follow}</span>
    </a>
  );
}

/** The social invitation: a sentence and the four networks. */
export function SocialBlock({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const t = useT();
  const { artist } = useContent();
  const l = artist.links;
  return (
    <div className={`glass drip ${compact ? "p-3 sm:p-4" : "p-5 sm:p-7"} ${className}`}>
      <div className={`flex flex-col gap-4 ${compact ? "xl:flex-row xl:items-center xl:justify-between" : "lg:flex-row lg:items-center lg:justify-between"}`}>
        <div>
          <div className={`display ${compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"}`}>{t.social.title}</div>
          <p className={`mt-1 opacity-75 ${compact ? "hidden text-xs sm:block" : "text-sm sm:text-[15px]"}`}>{t.social.text}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Social href={l.instagram} name="Instagram" icon={ICONS.instagram} follow={t.social.follow} />
          <Social href={l.tiktok} name="TikTok" icon={ICONS.tiktok} follow={t.social.follow} />
          <Social href={l.facebook} name="Facebook" icon={ICONS.facebook} follow={t.social.follow} />
          <Social href={l.youtube} name="YouTube" icon={ICONS.youtube} follow={t.social.follow} />
        </div>
      </div>
    </div>
  );
}

/** Socials, legal links and the Bandita credit. Shared by every page. */
export default function SiteFooter({ className = "", social = true, compact = false }: { className?: string; social?: boolean; compact?: boolean }) {
  const t = useT();
  const { artist } = useContent();
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {social && <SocialBlock compact={compact} />}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">
          <Link href="/impressum" className="hover:opacity-100">
            {t.footer.imprint}
          </Link>
          <Link href="/datenschutz" className="hover:opacity-100">
            {t.footer.privacy}
          </Link>
          <span className="hidden sm:inline">{t.footer.photos}</span>
        </div>
      </div>
      <a
        href={artist.booking.agencyUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 self-start rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] opacity-75 transition hover:opacity-100"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: "linear-gradient(135deg,#fff,#b9a3ff 60%,#6d4bd6)" }} />
        <span>
          {t.footer.madeBy} <span style={{ color: "var(--lilac-deep)" }}>Bandita</span>
        </span>
        <span className="opacity-60 group-hover:opacity-90">· {t.footer.credit}</span>
      </a>
    </div>
  );
}
