# Andre Leherb — 3D Website

Interaktive 3D-Website für den Wiener Sänger Andre Leherb. Weiß, Silber, Lila: flüssiges Chrom,
lila Lack, Milchglas. Vier Abschnitte (Intro, Musik, Über, Booking), audio-reaktive Szene,
ein verstecktes Easter Egg.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind 4
- three.js + @react-three/fiber + drei + postprocessing
- zustand für den kleinen globalen State (Audio-Level, Glitch, Gerät)

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `src/content.ts` | Alle Texte, Songs, Links, Timeline, die Glitch-Sätze |
| `src/components/Experience.tsx` | Einstieg: Loader, Nav, Canvas, Mini-Player |
| `src/components/scene/Scene.tsx` | Die 3D-Welt, Layout der vier Abschnitte, Kamera-Rig, Studio-Licht |
| `src/components/scene/*` | Mikrofon, Discokugel, Falke, Blobs (Metaballs), Glas, Portraits, Effekte |
| `src/components/Overlay.tsx` | HTML-Ebene: Typo, Glas-Karten, Booking-Formular |
| `src/components/ParticleSwirl.tsx` | Particle Image Swirl (Andrés Foto als Partikelfeld), ohne Abhängigkeiten |
| `src/components/Loader.tsx` | Pyramiden-Loader (nach Uiverse.io, umgefärbt) |
| `src/lib/audio.ts` | Shared Player + Web-Audio-Analyser |

## Assets

- `public/img/` Fotos (catchlight by Martin Hauser), Cover, Logo. Freigestellte Hero-Bilder als WebP.
- `public/audio/walzer.mp3` ist drin. **`public/audio/24-7.mp3` fehlt noch**: Datei dort ablegen, der
  Play-Button für 24/7 erscheint dann automatisch.

## Easter Egg

Die kleine Chromkugel rechts unten im Intro. Klick: die Seite kippt für 2,6 s ins Dunkle, Fotos
wechseln zu den „dunklen Zwillingen", die Musik verzerrt sich. Danach bleibt ein Satz stehen
(`glitchNotes` in `src/content.ts`), beim zweiten Mal ein anderer. Nach Reload ist er weg.

## Mobile / Reduced Motion

Unter 768 px: kleinere Szene, keine Nachbearbeitung, günstigeres Glas, weniger Partikel.
`prefers-reduced-motion`: Effekte aus, Partikelfeld im ruhigen Modus.
