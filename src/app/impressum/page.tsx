import type { Metadata } from "next";
import Legal from "@/components/pages/Legal";

export const metadata: Metadata = { title: "Impressum · Andre Leherb" };

export default function Page() {
  return (
    <Legal label="Rechtliches" title="Impressum.">
      <p>
        <strong>NEW ART MUSIC PRODUCTIONS GmbH</strong>
        <br />
        Schönbrunner Allee 49A/4/12
        <br />
        1120 Wien
        <br />
        <a href="mailto:office@leherb.music">office@leherb.music</a>
      </p>
      <p>
        Unternehmensgegenstand: Werbeagentur und Musikproduktion
        <br />
        Mitglied der WKO, Wirtschaftskammer Wien, Fachgruppe Werbung und Marktkommunikation
        <br />
        Behörde: Magistratisches Bezirksamt 12. Bezirk, Schönbrunner Straße 259, 1120 Wien
        <br />
        Anwendbare Rechtsvorschriften:{" "}
        <a href="https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10007517" target="_blank" rel="noreferrer">
          Gewerbeordnung
        </a>
        <br />
        Gründung: Mai 2026
        <br />
        UID: ATU83176509
        <br />
        Firmenbuch Nr.: 669614 b
      </p>
      <h2>Management | Booking | Presse | Sponsoring</h2>
      <p>
        Mag. Alexander Vogel
        <br />
        <a href="mailto:alex@newartmusicproduction.com">alex@newartmusicproduction.com</a>
      </p>
      <p>
        Bilder: Martin Hauser
        <br />
        Webdesign: Ingrid Sojak | Capricorn Marketing
      </p>
    </Legal>
  );
}
