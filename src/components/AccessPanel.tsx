"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useT } from "@/i18n";

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
      <div>
        <div className="text-sm font-bold">{label}</div>
        {hint && <div className="text-xs opacity-60">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function Switch({ on, onChange, labels }: { on: boolean; onChange: (v: boolean) => void; labels: [string, string] }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="relative h-8 w-14 shrink-0 rounded-full transition"
      style={{ background: on ? "var(--lilac-deep)" : "rgba(128,128,150,.35)" }}
    >
      <span className="sr-only">{on ? labels[0] : labels[1]}</span>
      <span className="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all" style={{ left: on ? 28 : 4 }} />
    </button>
  );
}

/**
 * The accessibility button (bottom right) and its panel: effects on/off, static
 * page, font size, high contrast and language. Preferences persist per browser.
 */
export default function AccessPanel() {
  const [open, setOpen] = useState(false);
  const a11y = useStore((s) => s.a11y);
  const setA11y = useStore((s) => s.setA11y);
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const initPrefs = useStore((s) => s.initPrefs);
  const t = useT();

  useEffect(() => {
    initPrefs();
  }, [initPrefs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sizes = [1, 1.125, 1.25];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.a11y.button}
        title={t.a11y.button}
        aria-expanded={open}
        className="glass fixed bottom-4 right-4 z-[80] flex h-12 w-12 items-center justify-center !rounded-full !p-0 shadow-lg transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
        style={{ pointerEvents: "auto" }}
      >
        {/* universal access icon */}
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <circle cx="12" cy="4.5" r="2" />
          <path d="M4 8.2c0-.6.5-1 1-.9 2.4.5 4.6.7 7 .7s4.6-.2 7-.7c.6-.1 1 .3 1 .9s-.4 1-.9 1.1c-1.7.3-3.3.5-4.9.6v3.2l2.3 6.6c.2.6-.1 1.2-.7 1.3-.5.1-1-.2-1.2-.7L12.3 15h-.6l-2.3 5.2c-.2.5-.7.8-1.2.7-.6-.1-.9-.7-.7-1.3l2.3-6.6V9.8c-1.6-.1-3.2-.3-4.9-.6C4.4 9.2 4 8.8 4 8.2z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[79]" onClick={() => setOpen(false)} aria-hidden style={{ pointerEvents: "auto" }} />
      )}
      {open && (
        <div
          role="dialog"
          aria-label={t.a11y.title}
          className="glass fixed bottom-20 right-4 z-[81] w-[min(92vw,22rem)] !rounded-[1.4rem] p-5 shadow-2xl sm:bottom-24 sm:right-6"
          style={{ pointerEvents: "auto", background: "var(--bg)" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="display text-xl">{t.a11y.title}</div>
            <button onClick={() => setOpen(false)} aria-label={t.a11y.close} className="h-9 w-9 rounded-full text-lg opacity-70 hover:opacity-100">
              ×
            </button>
          </div>

          <Row label={t.a11y.motion} hint={t.a11y.motionHint}>
            <Switch on={a11y.motion} onChange={(v) => setA11y({ motion: v })} labels={[t.a11y.on, t.a11y.off]} />
          </Row>
          <Row label={t.a11y.static} hint={t.a11y.staticHint}>
            <Switch on={a11y.static} onChange={(v) => setA11y({ static: v, ...(v ? { motion: false } : {}) })} labels={[t.a11y.on, t.a11y.off]} />
          </Row>
          <Row label={t.a11y.font}>
            <div className="flex gap-1" role="group" aria-label={t.a11y.font}>
              {sizes.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setA11y({ fontScale: s })}
                  aria-pressed={a11y.fontScale === s}
                  className="h-9 min-w-9 rounded-full px-2 font-bold transition"
                  style={{
                    fontSize: `${0.8 + i * 0.15}rem`,
                    background: a11y.fontScale === s ? "var(--lilac-deep)" : "rgba(128,128,150,.18)",
                    color: a11y.fontScale === s ? "#fff" : "inherit",
                  }}
                >
                  A
                </button>
              ))}
            </div>
          </Row>
          <Row label={t.a11y.contrast}>
            <Switch on={a11y.contrast} onChange={(v) => setA11y({ contrast: v })} labels={[t.a11y.on, t.a11y.off]} />
          </Row>
          <Row label={t.a11y.lang}>
            <div className="flex gap-1" role="group" aria-label={t.a11y.lang}>
              {(["de", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className="h-9 rounded-full px-3 text-xs font-bold uppercase tracking-[0.15em] transition"
                  style={{ background: lang === l ? "var(--lilac-deep)" : "rgba(128,128,150,.18)", color: lang === l ? "#fff" : "inherit" }}
                >
                  {l}
                </button>
              ))}
            </div>
          </Row>
          <div className="pt-3 text-right" style={{ borderTop: "1px solid var(--glass-border)" }}>
            <button
              onClick={() => setA11y({ motion: true, static: false, fontScale: 1, contrast: false })}
              className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
            >
              {t.a11y.reset}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
