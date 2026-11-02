"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { essays, readMinutes, type Essay } from "@/essays";
import { useT } from "@/i18n";
import { Tri } from "./ChromeWords";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
      {children}
    </div>
  );
}

/** Full-screen reading mode: one essay, serif type, a narrow column, a progress line. */
function Reader({
  essay,
  onClose,
  onNext,
}: {
  essay: Essay;
  onClose: () => void;
  onNext?: () => void;
}) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    box.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const onScroll = () => {
    const el = box.current;
    if (!el) return;
    setP(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight));
  };

  return (
    <div
      ref={box}
      onScroll={onScroll}
      tabIndex={-1}
      role="dialog"
      aria-modal
      aria-label={essay.title}
      className="reader-bg fixed inset-0 z-[90] overflow-y-auto outline-none"
      style={{ pointerEvents: "auto" }}
    >
      {/* progress */}
      <div className="fixed inset-x-0 top-0 z-10 h-[3px] bg-black/5">
        <div
          className="h-full"
          style={{
            width: `${p * 100}%`,
            background: "linear-gradient(90deg, var(--lilac-deep), #c9c7d6)",
          }}
        />
      </div>
      <button
        onClick={onClose}
        aria-label={t.poet.close}
        className="glass fixed right-4 top-4 z-10 flex h-11 w-11 items-center justify-center !rounded-full !p-0 text-xl shadow-lg sm:right-8 sm:top-6"
      >
        ×
      </button>

      <article className="mx-auto max-w-[44rem] px-6 pb-28 pt-24 sm:px-10 sm:pt-32">
        <header>
          <Label>
            <span className="inline-flex items-center gap-2">
              <Tri /> {essay.kicker}
            </span>
          </Label>
          <h1 className="display mt-4 text-3xl leading-[1.05] sm:text-5xl">
            {essay.title}
          </h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] opacity-60">
            {t.poet.by} · {t.poet.minutes(readMinutes(essay))}
            {t.poet.original && (
              <span className="ml-2 normal-case tracking-normal opacity-80">
                · {t.poet.original}
              </span>
            )}
          </p>
          {essay.image && (
            <figure className="glass drip mt-8 overflow-hidden !p-2">
              <img
                src={essay.image}
                alt=""
                className="aspect-[3/2] w-full rounded-[1.1rem] object-cover"
              />
            </figure>
          )}
          <p
            className="essay-quote mt-10 border-l-2 pl-5"
            style={{ borderColor: "var(--lilac-deep)" }}
          >
            „{essay.quote}“
          </p>
        </header>

        <div className="essay mt-12">
          {essay.chapters.map((c, i) => (
            <section key={c.heading ?? i}>
              {c.heading && (
                <h3>
                  <span className="mr-2 inline-flex" aria-hidden>
                    <Tri />
                  </span>
                  {c.heading}
                </h3>
              )}
              {c.paragraphs.map((para, j) => (
                <p
                  key={para.slice(0, 40)}
                  className={i === 0 && j === 0 ? "initial" : undefined}
                >
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        <footer
          className="mt-16 flex flex-wrap items-center gap-3 border-t pt-8"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <span className="display text-xl">Andre Leherb</span>
          <span className="ml-auto flex gap-2">
            {onNext && (
              <button
                onClick={onNext}
                className="btn-lilac !py-2.5 !px-5 text-sm"
              >
                {t.poet.next} →
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-chrome !py-2.5 !px-5 text-sm"
            >
              {t.poet.close}
            </button>
          </span>
        </footer>
      </article>
    </div>
  );
}

/** The "Der Poet" section: one card per essay, each opens the reader. */
export default function EssayCards() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="mt-28 scroll-mt-28" id="poet">
      <div className="max-w-3xl">
        <Label>{t.poet.label}</Label>
        <h2 className="display mt-3 text-4xl sm:text-6xl">{t.poet.title}</h2>
        <p className="mt-4 text-base leading-relaxed opacity-85 sm:text-lg">
          {t.poet.text}
        </p>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {essays.map((e, i) => (
          <article
            key={e.id}
            className="glass drip flex flex-col overflow-hidden"
          >
            {e.image && (
              <img
                src={e.image}
                alt=""
                className="aspect-[16/7] w-full rounded-[1.1rem] object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <Label>
                <span className="inline-flex items-center gap-2">
                  <Tri /> {e.kicker}
                </span>
              </Label>
              <h3 className="display mt-3 text-2xl leading-tight sm:text-3xl">
                {e.title}
              </h3>
              <p
                className="essay-quote mt-5 !text-lg sm:!text-xl"
                style={{ color: "var(--lilac-deep)" }}
              >
                „{e.quote}“
              </p>
              <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed opacity-80">
                {e.chapters[0].paragraphs[0]}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => setOpen(i)}
                  className="btn-lilac !py-2.5 !px-6 text-sm"
                >
                  {t.poet.read} →
                </button>
                <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
                  {t.poet.minutes(readMinutes(e))}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {open !== null &&
        createPortal(
          <Reader
            essay={essays[open]}
            onClose={() => setOpen(null)}
            onNext={
              open + 1 < essays.length ? () => setOpen(open + 1) : undefined
            }
          />,
          document.body,
        )}
    </section>
  );
}

/** A line from an essay as a teaser (start page), linking to the poet section. */
export function EssayTeaser({ className = "" }: { className?: string }) {
  const t = useT();
  const e = essays[1];
  return (
    <div className={className}>
      <Label>{t.poet.label}</Label>
      <p
        className="essay-quote mt-2 max-w-xs !text-lg xl:!text-xl"
        style={{ color: "var(--lilac-deep)" }}
      >
        „{e.quote}“
      </p>
      <Link
        href="/ueber#poet"
        className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.25em] underline underline-offset-4 opacity-80 hover:opacity-100"
      >
        {t.poet.more} →
      </Link>
    </div>
  );
}
