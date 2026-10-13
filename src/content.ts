export const artist = {
  name: "Andre Leherb",
  claim: "Surrealismus in Musik.",
  intro:
    "Andre Leherb ist musikschaffender Sänger aus Wien. Der eher untypische Singer/Songwriter ist zudem Dichter, Denker und Philosoph. Er transformiert Surrealismus in Musik, indem er mit seinem Genre-Mix ein akustisches Gesamtbild (er)schafft.",
  bio: [
    "Mozart-Sängerknabe in den 70ern, musikalisch geschmiedet und inspiriert im Wien der 80er, bekannt und unterwegs mit Zeitgenossen wie Falco und Hansi Lang. Erste Erfahrungen in der Branche 1995 als Leadsänger und Frontman der Rockband DEZIRE.",
    "Seitdem schreibt und produziert er Songs in Englisch, Deutsch und in seinem ganz eigenen Wiener Dialekt. Rock, Pop, New Wave, Rap, Indie bis zum neuen Wiener Lied Pop. Mode-Ikone, Dandy, schillernde Figur seiner Heimatstadt. Der erklärte Exzentriker trägt das kreative Erbe seines Onkels, Surréaliste Maître Leherb, ins 21. Jahrhundert.",
    "Mehrere Jahre in den USA und Südamerika. Seit 1998 Solo. Donauinselfest, Studio mit CJ Bomb (Bingo Boys) und den Rounder Girls, ESC-Vorentscheid 2004. Heute, gereift und mit kritischem Blick, hat er in Gary Lux einen nahezu idealen musikalischen Partner gefunden.",
  ],
  timeline: [
    { year: "70er", label: "Mozart-Sängerknabe" },
    { year: "80er", label: "Wien, Falco, Hansi Lang" },
    { year: "1995", label: "Frontman DEZIRE" },
    { year: "1998", label: "Solo, USA, Südamerika" },
    { year: "2004", label: "ESC-Vorentscheid" },
    { year: "2026", label: "24/7 mit Gary Lux" },
  ],
  booking: {
    email: "office@bandita.agency",
    agency: "Bandita Agency",
  },
};

export type Song = {
  id: "247" | "walzer";
  title: string;
  release: string;
  cover: string;
  audio?: string;
  quote: string;
  description: string;
  credits: string;
  links: { label: string; href: string }[];
};

export const songs: Song[] = [
  {
    id: "247",
    title: "24/7",
    release: "15. Mai 2026",
    cover: "/img/cover-247.jpg",
    audio: "/audio/24-7.mp3",
    quote:
      "Der Zeitgeist ist geprägt von Oberflächlichkeit und Bindungsangst statt mutigem Bekenntnis zur persönlichen Beziehung.",
    description:
      "Die Metamorphose eines Nightlife-Aficionados zu einem Mann, der seine Liebe gefunden hat. Der Kampf mit der inneren Zerrissenheit, der einsame Nachtfalke und das Ankommen bei sich selbst.",
    credits: "Musik: Gary Lux · Text: Gary Lux, Nicole Hoffmann, Andre Leherb, Alex Vogel · New Art Music Records",
    links: [
      { label: "Spotify", href: "https://open.spotify.com/search/Andre%20Leherb%2024%2F7" },
      { label: "Apple Music", href: "https://music.apple.com/search?term=Andre%20Leherb" },
      { label: "YouTube", href: "https://www.youtube.com/results?search_query=Andre+Leherb+24%2F7" },
    ],
  },
  {
    id: "walzer",
    title: "Wir tanzen den Walzer",
    release: "12. Juni 2026",
    cover: "/img/cover-walzer.jpg",
    audio: "/audio/walzer.mp3",
    quote:
      "Der Walzer macht uns allen wieder Mut, weil er einfach heiß ist. Und das wird no' in 200 Jahr' so sein. So schaut's aus.",
    description:
      "Die Historie des Walzers als völkerverbindende Kraft aus Wien, und mit einem Augenzwinkern einiges über die Probleme unserer Zeit. Ein Aufruf, das Leben endlich selbst in die Hand zu nehmen.",
    credits: "Musik: Gary Lux · Text: Gary Lux, Nicole Hoffmann, Andre Leherb, Alex Vogel · New Art Music Records",
    links: [
      { label: "Spotify", href: "https://open.spotify.com/search/Andre%20Leherb%20Wir%20tanzen%20den%20Walzer" },
      { label: "Apple Music", href: "https://music.apple.com/search?term=Andre%20Leherb" },
      { label: "YouTube", href: "https://www.youtube.com/results?search_query=Andre+Leherb+Wir+tanzen+den+Walzer" },
    ],
  },
];

export const glitchNotes = [
  "Wir teilen uns eine Stimme. Noch.",
  "24/7 ist er.\nDie Nacht bin ich.",
];
