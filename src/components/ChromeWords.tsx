/** A chrome triangle, used before and after each word. */
export function Tri({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 18" className={`inline-block h-[0.5em] w-[0.55em] ${className}`} aria-hidden>
      <defs>
        <linearGradient id="tri-chrome" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9c7d6" />
          <stop offset="0.6" stopColor="#7f7d92" />
          <stop offset="0.8" stopColor="#e6e4ef" />
          <stop offset="1" stopColor="#9b98ad" />
        </linearGradient>
      </defs>
      <path d="M10 1 L19 17 L1 17 Z" fill="url(#tri-chrome)" stroke="rgba(255,255,255,.8)" strokeWidth="0.6" />
    </svg>
  );
}

/** "▲ Wiener ▲  ▲ Sänger ▲ …" with chrome triangles around every word. */
export default function ChromeWords({ words, className = "", stacked = true }: { words: string[]; className?: string; stacked?: boolean }) {
  return (
    <span className={`${stacked ? "inline-flex flex-col items-start gap-y-[0.15em]" : "inline-flex flex-wrap items-center gap-x-[0.9em] gap-y-[0.35em]"} ${className}`}>
      {words.map((w) => (
        <span key={w} className="inline-flex items-center gap-[0.3em] whitespace-nowrap leading-none">
          <Tri />
          <span className="liquid-word">{w}</span>
          <Tri />
        </span>
      ))}
    </span>
  );
}
