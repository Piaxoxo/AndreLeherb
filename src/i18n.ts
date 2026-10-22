"use client";

import { useStore } from "./store";
import { artist, maitre, songs, type Song } from "./content";

export type Lang = "de" | "en";

/** UI strings. German is the source; English mirrors every key. */
const ui = {
  de: {
    nav: { home: "Home", musik: "Musik", galerie: "Galerie", spiel: "Spiel", andre: "Andre", book: "Buch mich", open: "Menü öffnen", close: "Menü schließen" },
    hero: { tag: "Wien · Singer / Songwriter", release: "Neue Single und Video:", produced: ". Produziert mit Gary Lux.", book: "Buch mich", mic: "Das Mikro ↓", scroll: "Scroll", listen: (t: string) => `${t} anhören`, play: (t: string) => `${t} abspielen`, pause: "Pause", short: "Anhören", platforms: "Auf allen Plattformen", soundOn: "Ton an", soundOff: "Ton aus" },
    musik: { label: "01 · Musik", title: "Neu.", subscribe: "Andre auf YouTube abonnieren", single: "Single" },
    ueber: { label: "02 · Über", more: "Mehr über Andre" },
    booking: {
      label: "03 · Booking",
      title: ["Buch", "mich."],
      titleShort: "Buch mich.",
      intro: "Konzert, Club, Firmenevent oder Fernsehen. Solo oder mit Band, Deutsch, Englisch und Wienerisch. Schreib uns, wir melden uns innerhalb von 48 Stunden.",
      name: "Name", email: "E-Mail", date: "Datum und Ort", msg: "Erzähl uns kurz, was geplant ist.", send: "Anfrage senden →", direct: "oder direkt:", sent: "Dein E-Mail-Programm sollte sich jetzt öffnen. Danke!",
      subject: "Booking-Anfrage", kind: "Art", dateLabel: "Datum / Ort",
      events: ["Konzert", "Club / Bar", "Firmenevent", "Privatfeier / Hochzeit", "Festival", "Medien / Interview"],
    },
    footer: { imprint: "Impressum", privacy: "Datenschutz", photos: "Fotos: Catchlight by Martin Hauser", madeBy: "Made by", credit: "Webdesign, 3D & Creative Direction", press: "Pressefotos?", pressText: "Druckfähige Dateien auf Anfrage an", bookTitle: "Buch mich.", bookText: "Konzerte, Events, Features. Anfragen an", overAndre: "Über Andre", booking: "Booking", start: "Startseite" },
    galerie: { label: "Galerie", title: ["Von heute", "zurück."], text: "Andre Leherb vor der Kamera, als Zeitreise: vom Shooting 2026 zurück bis zu DEZIRE. Zum Vergrößern antippen.", years: "Jahre", open: "öffnen", prev: "Vorheriges Foto", next: "Nächstes Foto", close: "Schließen" },
    ueberPage: { label: "Über Andre", bio: "Biografie", pointBio: "Punktuelle Bio", bioTitle: "Vom Sängerknaben zum Dandy.", on247: "Andre Leherb zu „24/7“", heritage: "Das Erbe · Über Leherb", uncle: "Andres Onkel", life: "Leben", work: "Werk", works: "Werke ansehen", continents: "Die Kontinente · Faenza, 1982", awards: "Auszeichnungen" },
    game: { label: "Das Spiel", notes: "Noten", lives: (n: number, m: number) => `${n} von ${m} Leben`, introTitle: "24 Sekunden. 7 Leben.", introTitleTaken: "Hol ihn zurück.", intro: "Bewege Andre mit Maus oder Finger. Fang die lila Noten, weich den schwarzen Tropfen aus. Wer alle sieben Leben verliert, überlässt die Seite dem anderen.", introTaken: "Die Nacht hat die Seite. Fang die lila Noten, weich den schwarzen Tropfen aus. Überstehst du 24 Sekunden, gehört die Bühne wieder Andre.", play: "Spielen", wonTitle: "Du hast ihn gehalten.", won: (n: number) => `${n} Noten gefangen. Noch gehört die Bühne Andre.`, back: "Zurück ins Licht", again: "Noch einmal", home: "Zur Startseite", lostTitle: "Die Nacht bin ich.", lost: "Die Seite gehört jetzt dem anderen. Du kannst sie zurückholen. Wenn du es schaffst." },
    player: { playing: "Läuft", pause: "Pause" },
    a11y: { button: "Barrierefreiheit", title: "Barrierefreiheit", motion: "Effekte & Bewegung", motionHint: "3D-Effekte, Video und Animationen", static: "Statische Seite", staticHint: "Ohne 3D, als einfache Seite", font: "Schriftgröße", contrast: "Hoher Kontrast", lang: "Sprache", on: "An", off: "Aus", close: "Schließen", reset: "Zurücksetzen" },
    legal: { imprint: "Impressum.", privacy: "Datenschutz.", label: "Rechtliches", enNote: "" },
    a11yStatic: { hero: "Sänger und Songwriter aus Wien.", sections: { musik: "Musik", ueber: "Über Andre", booking: "Booking" } },
  },
  en: {
    nav: { home: "Home", musik: "Music", galerie: "Gallery", spiel: "Game", andre: "Andre", book: "Book me", open: "Open menu", close: "Close menu" },
    hero: { tag: "Vienna · Singer / Songwriter", release: "New single and video:", produced: ". Produced with Gary Lux.", book: "Book me", mic: "The mic ↓", scroll: "Scroll", listen: (t: string) => `Listen to ${t}`, play: (t: string) => `Play ${t}`, pause: "Pause", short: "Listen", platforms: "On all platforms", soundOn: "Sound on", soundOff: "Sound off" },
    musik: { label: "01 · Music", title: "New.", subscribe: "Subscribe to Andre on YouTube", single: "Single" },
    ueber: { label: "02 · About", more: "More about Andre" },
    booking: {
      label: "03 · Booking",
      title: ["Book", "me."],
      titleShort: "Book me.",
      intro: "Concert, club, corporate event or TV. Solo or with band, in German, English and Viennese. Write to us, we reply within 48 hours.",
      name: "Name", email: "Email", date: "Date and place", msg: "Tell us briefly what you are planning.", send: "Send request →", direct: "or directly:", sent: "Your email app should open now. Thank you!",
      subject: "Booking request", kind: "Type", dateLabel: "Date / place",
      events: ["Concert", "Club / bar", "Corporate event", "Private party / wedding", "Festival", "Media / interview"],
    },
    footer: { imprint: "Imprint", privacy: "Privacy", photos: "Photos: Catchlight by Martin Hauser", madeBy: "Made by", credit: "Web design, 3D & creative direction", press: "Press photos?", pressText: "Print-ready files on request at", bookTitle: "Book me.", bookText: "Concerts, events, features. Requests to", overAndre: "About Andre", booking: "Booking", start: "Home" },
    galerie: { label: "Gallery", title: ["From today", "backwards."], text: "Andre Leherb in front of the camera, as a journey in time: from the 2026 shoot back to DEZIRE. Tap to enlarge.", years: "Years", open: "open", prev: "Previous photo", next: "Next photo", close: "Close" },
    ueberPage: { label: "About Andre", bio: "Biography", pointBio: "Bio at a glance", bioTitle: "From choirboy to dandy.", on247: "Andre Leherb on “24/7”", heritage: "The legacy · About Leherb", uncle: "Andre's uncle", life: "Life", work: "Work", works: "See the works", continents: "The Continents · Faenza, 1982", awards: "Awards" },
    game: { label: "The game", notes: "Notes", lives: (n: number, m: number) => `${n} of ${m} lives`, introTitle: "24 seconds. 7 lives.", introTitleTaken: "Bring him back.", intro: "Move Andre with mouse or finger. Catch the lilac notes, dodge the black drops. Lose all seven lives and the site belongs to the other one.", introTaken: "The night owns the site. Catch the lilac notes, dodge the black drops. Survive 24 seconds and the stage is Andre's again.", play: "Play", wonTitle: "You held him.", won: (n: number) => `${n} notes caught. The stage is still Andre's.`, back: "Back into the light", again: "Once more", home: "Home", lostTitle: "I am the night.", lost: "The site belongs to the other one now. You can bring it back. If you can." },
    player: { playing: "Playing", pause: "Pause" },
    a11y: { button: "Accessibility", title: "Accessibility", motion: "Effects & motion", motionHint: "3D effects, video and animation", static: "Static page", staticHint: "No 3D, a simple page", font: "Font size", contrast: "High contrast", lang: "Language", on: "On", off: "Off", close: "Close", reset: "Reset" },
    legal: { imprint: "Imprint.", privacy: "Privacy.", label: "Legal", enNote: "This page is provided in German, the legally binding version." },
    a11yStatic: { hero: "Singer and songwriter from Vienna.", sections: { musik: "Music", ueber: "About Andre", booking: "Booking" } },
  },
};

export type UI = typeof ui.de;

/** English content: overrides merged onto the German source. */
const artistEn = {
  claim: "Surrealism in music.",
  motto: "Nothing has to be the way it is",
  credo: "For me there is no black or white. With me everything is silver-grey.",
  words: ["Viennese", "Singer", "Dandy", "Poet"],
  intro:
    "Andre Leherb is a singer and music maker from Vienna. The rather untypical singer/songwriter is also a poet, thinker and philosopher. He turns surrealism into music, creating a complete acoustic picture with his mix of genres.",
  bio: [
    "Andre Leherb, a Mozart choirboy in the 70s, musically forged and inspired in the Vienna of the 80s, known and on the road with contemporaries such as Falco and Hansi Lang, made his first experiences in the business in 1995 as lead singer and frontman of the rock band DEZIRE. Since then he has written and produced songs in English, German and his very own Viennese dialect.",
    "His music ranges from rock and pop via new wave, rap and indie to the new Viennese song pop. Andre Leherb has seen a lot, lived it to the full and created his very own style and mix from it. He is a fashion icon, a dandy and above all a dazzling figure of his home town Vienna. The declared eccentric carries the creative legacy of his uncle, the surrealist Maître Leherb, into the 21st century.",
    "Several years in the USA and South America. Solo since 1998. Donauinselfest, studio with CJ Bomb (Bingo Boys) and the Rounder Girls, Eurovision pre-selection 2004. Today, matured and with a critical eye, he has found an almost ideal musical partner in Gary Lux.",
  ],
  bioLong: [
    "Andre Leherb spent several years in the USA and South America. Since 1998 he has been working on his solo career: from the Donauinselfest appearance to the collaboration with CJ Bomb of the Bingo Boys and the Rounder Girls Tini Kainrath and Lynn Kieran in his own recording studio, experience in the model business with three different agencies, taking part in the Austrian pre-selection for the Eurovision Song Contest 2004 in Istanbul, and studio recordings of numerous songs over the last 20 years.",
    "Now matured and with a critical view of the world, he has found an almost ideal musical partner in Gary Lux. By producing German-language rock and pop songs with him, he can reinvent himself once more within his solo career.",
    "The first new song “24/7” from this collaboration with the well-known Austro-Canadian producer and Austria's record Eurovision participant has been available on all relevant platforms since 15 May 2026. The song is about the metamorphosis of a nightlife aficionado into a man who has found his love and learned to treasure it. It describes the struggle with himself and his inner conflict, but also the gap between an exhausting, energy-draining life as a lonely night hawk in search of love and a real, lasting relationship. In the end he arrives at himself, in a new life.",
    "The lyrics are unmistakably autobiographical. Musically the song sits in German-language pop rock.",
    "The second song from the collaboration with Gary Lux is called “Wir tanzen den Walzer” (We dance the waltz) and has been on air on all relevant platforms since 12 June 2026. It tells the history of the waltz as a force from Vienna that unites peoples, and, with a wink, a few things about the problems of our time. The daily manipulation in word, writing and image triggers existential fears in many people and often leads to paralysis.",
  ],
  quotes: {
    s247: "The spirit of the age is marked by superficiality and fear of commitment instead of a brave stand for the personal relationship. 24/7 also stands for the permanent availability that is expected today, through which so much can be lost.",
    walzer: "The waltz is a call to all of us to finally take our lives into our own hands. It is no coincidence that the Blue Danube on New Year's Eve stirs new hope in people again and again. The waltz gives us all courage, because it is simply hot. And it'll still be that way in 200 years. That's how it is.",
  },
  timeline: [
    { year: "70s", label: "Mozart choirboy" },
    { year: "80s", label: "Vienna, Falco" },
    { year: "90s", label: "Germany, America" },
    { year: "1995", label: "Rock band DEZIRE" },
    { year: "1998", label: "Solo career" },
    { year: "2000", label: "Model agency" },
    { year: "2004", label: "Eurovision pre-selection" },
    { year: "2017", label: "Andre Leherb SURREAL" },
    { year: "2022", label: "Wiener Mischung Surreal" },
    { year: "2026", label: "“24/7” and “Wir tanzen den Walzer” with Gary Lux" },
  ],
};

const maitreEn = {
  fullName: "Helmut Leherbauer (1933–1997)",
  role: "Surrealist, co-founder of the Vienna School of Fantastic Realism",
  intro:
    "His own person was often at the centre of his surreal inventions. Although Leherb was one of the first representatives of the Vienna School of Fantastic Realism, he later turned away from the style of the others such as Arik Brauer and Ernst Fuchs and ever more toward surrealism.",
  aragon: {
    text: "A new vice has just been born, one more frenzy has been given to man: surrealism, son of madness and darkness.",
    source: "Louis Aragon in Le paysan de Paris on Maître Leherb",
  },
  life: "Helmut Leherbauer, Viennese artist of Fantastic Realism, and his wife Lotte Profohs became international superstars of their time, with streets in Vienna named after them posthumously.",
  werk: "Leherbauer's artistic legacy comprises impressive works, from monumental faience mosaics to oversized artworks.",
  faenzaText:
    "In Faenza, Italy, in the early 1980s he created the “largest faience ever made”, a 380-square-metre mosaic for the new building of the Vienna University of Economics, opened in 1982: “The Continents”. The ceramic dust left him with serious damage to his health. An imaginary portrait of the continents Asia, Europe, America, Africa, Antarctica and Australia was created here in twelve years of work with more than 3,500 small ceramic tiles.",
  faenzaQuote:
    "No workshop, no expert, no ceramicist in the European ceramics centres considered the realisation of eight-by-eight-metre majolica paintings technically feasible in 1980: it has never existed, it will never exist, and not even a Leherb will succeed at such a thing.",
};

const songsEn: Partial<Record<Song["id"], Partial<Song>>> = {
  "247": {
    tag: "New video",
    release: "15 May 2026",
    quote: "The spirit of the age is marked by superficiality and fear of commitment instead of a brave stand for the personal relationship.",
    description: "The metamorphosis of a nightlife aficionado into a man who has found his love. The struggle with his inner conflict, the lonely night hawk, and arriving at himself.",
    credits: "Music: Gary Lux · Lyrics: Gary Lux, Nicole Hoffmann, Andre Leherb, Alex Vogel · New Art Music Records",
  },
  walzer: {
    release: "12 June 2026",
    quote: "The waltz gives us all courage, because it is simply hot. And it'll still be that way in 200 years. That's how it is.",
    description: "“Wir tanzen den Walzer” tells the history of the waltz as a force from Vienna that unites peoples, and, with a wink, a few things about the problems of our time. The daily manipulation in word, writing and image triggers existential fears in many people and often leads to paralysis.",
    credits: "Music: Gary Lux · Lyrics: Gary Lux, Nicole Hoffmann, Andre Leherb, Alex Vogel · New Art Music Records",
  },
};

export function getContent(lang: Lang) {
  if (lang === "de") return { artist, maitre, songs, faenzaText: maitre.faenza[0] };
  return {
    artist: { ...artist, ...artistEn },
    maitre: { ...maitre, ...maitreEn },
    songs: songs.map((s) => ({ ...s, ...(songsEn[s.id] ?? {}) })),
    faenzaText: maitreEn.faenzaText,
  };
}

export function useLang(): Lang {
  return useStore((s) => s.lang);
}

export function useT(): UI {
  const lang = useStore((s) => s.lang);
  return ui[lang];
}

export function useContent() {
  const lang = useStore((s) => s.lang);
  return getContent(lang);
}
