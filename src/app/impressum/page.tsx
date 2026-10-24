import type { Metadata } from "next";
import Legal from "@/components/pages/Legal";

export const metadata: Metadata = { title: "Impressum · Andre Leherb" };

export default function Page() {
  return (
    <Legal kind="imprint">
      <p>
        <strong>NEW ART MUSIC PRODUCTIONS GmbH</strong>
        <br />
        Schönbrunner Allee 49A/4/12
        <br />
        1120 Wien
        <br />
        Tel.: <a href="tel:+4366910251024">0669 10251024</a>
        <br />
        E-Mail: <a href="mailto:office@andreleherb.music">office@andreleherb.music</a>
      </p>
      <p>
        Unternehmensgegenstand: Ton- und Musikproduktion, Werbeagentur
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
        <br />
        GLN: 911039082609
      </p>
      <h2>Management | Booking | Presse | Sponsoring</h2>
      <p>
        Mag. Alexander Vogel
        <br />
        <a href="mailto:office@andreleherb.music">office@andreleherb.music</a>
      </p>
      <p>
        Bilder: Martin Hauser, Catchlight
        <br />
        Webdesign und 3D Art: made by{" "}
        <a href="https://bandita.agency" target="_blank" rel="noreferrer">
          Bandita Creative Agency
        </a>
        , Wien
        <br />
        Label: New Art Music Productions
      </p>
    </Legal>
  );
}
