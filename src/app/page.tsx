import { artist } from "@/content";

/**
 * The start page itself is rendered by HomeKeeper in the layout (it stays mounted
 * across pages). This leaves a plain text version for crawlers and screen readers.
 */
export default function Home() {
  return (
    <div className="sr-only">
      <h1>Andre Leherb</h1>
      <p>{artist.claim}</p>
      <p>{artist.intro}</p>
      <p>{artist.credo}</p>
    </div>
  );
}
