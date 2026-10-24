import type { Metadata } from "next";
import Legal from "@/components/pages/Legal";

export const metadata: Metadata = { title: "Datenschutz · Andre Leherb" };

export default function Page() {
  return (
    <Legal kind="privacy">
      <p>
        Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der
        geltenden gesetzlichen Bestimmungen (EU-Datenschutz-Grundverordnung DSGVO, TKG 2003). In diesen Datenschutzinformationen informieren wir
        Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Tätigkeiten.
      </p>
      <p>
        Die Nutzung dieser Webseite ist in der Regel ohne die Angabe personenbezogener Daten möglich. Sollten Sie, z.B. zum Zwecke der
        Kontaktaufnahme oder zum Abonnement eines Newsletters persönliche Daten eingeben, geben wir die notwendigen Informationen an Firmen
        weiter, die in unserem Auftrag Daten verarbeiten (z.B. den Newsletter versenden). Wir beauftragen ausschließlich Firmen, die sich der
        Datenschutz-Grundverordnung unterwerfen.
      </p>
      <h2>Verschlüsselte Übertragung</h2>
      <p>
        Diese Webseite nutzt aus Gründen der Sicherheit und des Datenschutzes eine SSL Verschlüsselung, die verhindert, dass Dritte die von Ihnen
        eingegebenen Daten auf dem Übertragungsweg abfangen und lesen können. Sie erkennen die aktive Verschlüsselung an dem Vorhängeschloss oder
        ähnlichen Symbolen in der Adresszeile Ihres Browsers.
      </p>
      <h2>Kontakt</h2>
      <p>
        Wenn Sie per E-Mail oder auf anderem Wege Kontakt mit uns aufnehmen, werden die von Ihnen bekannt gegebenen Daten (Name, E-Mail-Adresse und
        optional die Telefonnummer) zwecks Bearbeitung der Anfrage und für den Fall von Anschluss-Fragen für ein Jahr bei uns gespeichert. Sollte
        sich aus der Anfrage ein Auftrag / Vertrag ergeben, gelten die gesetzlichen Aufbewahrungsfristen. Diese Daten geben wir nicht ohne Ihre
        Einwilligung weiter. Die Datenverarbeitung erfolgt auf Basis des Art 6 Abs 1 lit b (Vertragserfüllung) und Art 6 Abs 1 lit a (Einwilligung)
        der DSGVO.
      </p>
      <h2>Server Protokolle</h2>
      <p>
        Der Server, von dem diese Webseite bereitgestellt wird, speichert Informationen, die von Ihrem Browser automatisch an uns übermittelt
        werden, in sogenannten Log-Files. Dies sind:
      </p>
      <ul>
        <li>Browsertyp und Browserversion</li>
        <li>Verwendetes Betriebssystem</li>
        <li>Die Seite (URL), von der Sie zu uns gekommen sind</li>
        <li>Die IP-Adresse des zugreifenden Computers</li>
        <li>Uhrzeit der Anfrage</li>
      </ul>
      <p>
        Diese Daten dienen ausschließlich der technischen Überwachung des Webservers (Auslastung, Optimierung, Fehlererkennung, Sicherheit) und
        sind dazu unbedingt notwendig. Sie werden nicht mit anderen Datenquellen verbunden, so dass sie sich nicht einzelnen Personen zuordnen
        lassen. Sie werden nach drei Monaten gelöscht. Die Datenverarbeitung erfolgt auf Basis des Art 6 Abs 1 lit f (berechtigte Interessen) der
        DSGVO. Das berechtigte Interesse im Sinne der DSGVO ist hierbei die ordnungsgemäße, sichere Funktion der Webseite.
      </p>
      <h2>Reichweitenmessung (Vercel Web Analytics)</h2>
      <p>
        Diese Webseite wird von Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet. Zur Messung der Besucherzahlen nutzen wir
        Vercel Web Analytics. Dabei werden keine Cookies gesetzt und keine personenbezogenen Daten gespeichert: Aus IP-Adresse und Browserkennung
        wird ein kurzlebiger, nicht rückführbarer Hash gebildet, der nach 24 Stunden verfällt. Erfasst werden besuchte Seiten, Herkunft (Referrer),
        Gerätetyp, Browser und ungefähre Region. Rechtsgrundlage ist Art 6 Abs 1 lit f DSGVO (berechtigtes Interesse an der Auswertung der
        Reichweite). Die Erhebung erfolgt ohne Einwilligungspflicht, da keine Daten auf Ihrem Endgerät gespeichert oder ausgelesen werden.
      </p>
      <h2>Barrierefreiheits-Einstellungen</h2>
      <p>
        Ihre Auswahl im Menü Barrierefreiheit (Effekte, statische Seite, Schriftgröße, Kontrast, Sprache) wird ausschließlich lokal in Ihrem
        Browser gespeichert (localStorage) und nicht an uns übertragen. Das Spiel merkt sich seinen Zustand für die Dauer des Besuchs im
        sessionStorage Ihres Browsers.
      </p>
      <h2>Cookies</h2>
      <p>
        Diese Website verwendet so genannte Cookies. Dabei handelt es sich um kleine Textdateien, die mit Hilfe des Browsers auf Ihrem Endgerät
        abgelegt werden. Sie richten keinen Schaden an. Wir nutzen Cookies dazu, unser Angebot nutzerfreundlich zu gestalten. Einige Cookies
        bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. Sie ermöglichen es, Ihren Browser beim nächsten Besuch wiederzuerkennen.
      </p>
      <p>
        Einiger dieser Cookies sind für den Betrieb der Webseite erforderlich und dienen der Anmeldung und speichern Ihre Einwilligung in nicht
        erforderliche Cookies. Wenn Sie nicht wünschen, dass die notwendigen Cookies gespeichert werden, können Sie Ihren Browser so einrichten,
        dass er Sie über das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben.
      </p>
      <p>
        Rechtsgrundlage für die Nutzung erforderlicher Cookies ist Art 6 Abs 1 lit f (berechtigte Interessen) der DSGVO. Berechtigte Interessen im
        Sinne der DSGVO sind hierbei die ordnungsgemäße und sichere Funktion der Webseite sowie die Optimierung unseres Angebotes.
      </p>
      <p>
        Darüber hinaus werden eventuell und nur mit Ihrer Einwilligung weitere, für den Betrieb der Webseite nicht unbedingt erforderliche Cookies
        gespeichert. Details dazu in den folgenden Abschnitten.
      </p>
      <h2>Newsletter</h2>
      <p>
        Sie können auf dieser Website meinen Newsletter abonnieren. Hierfür brauche ich Ihren Vornamen (optional auch Nachnamen), Ihre
        E-Mail-Adresse und Ihre Erklärung, dass Sie mit dem Bezug des Newsletters einverstanden sind. Sobald Sie sich für den Newsletter angemeldet
        haben, erhalten Sie ein E-Mail mit einem Link zur Bestätigung der Anmeldung.
      </p>
      <p>Die Datenverarbeitung erfolgt demnach auf Basis der gesetzlichen Bestimmungen des § 96 Abs 3 TKG sowie des Art 6 Abs 1 lit a (Einwilligung) der DSGVO.</p>
      <p>
        Sie können sich jederzeit mit dem Link am Ende des Newsletters abmelden. Ich lösche anschließend umgehend Ihre Daten im Zusammenhang mit
        dem Newsletter-Versand. Der Versand der Newsletter sowie die Erhebung der Daten betreffend deiner Nutzung dieser Newsletter erfolgt durch
        Brevo (Sendinblue GmbH), Köpenicker Straße 126, 10179 Berlin. Ich habe mit Brevo einen Auftragsverarbeiter-Vertrag abgeschlossen, in dem
        sich Brevo zur Einhaltung der von der EU-Kommission definierten Standard-Vertragsklauseln verpflichtet. Die versendeten Newsletter enthalten
        zum Zwecke der statistischen Auswertung kleine Bilder (Zählpixel) oder umgeleitete Links, mit deren Hilfe ich ermitteln kann, ob Sie den
        Newsletter gelesen haben und welchen Gerätetyp Sie dabei verwendet haben.
      </p>
      <h2>YouTube</h2>
      <p>
        Wir verwenden auf unserer Webseite Plugins (Videos) des Anbieters YouTube. YouTube wird betrieben von YouTube LLC mit Hauptgeschäftssitz in
        901 Cherry Avenue, San Bruno, CA 94066, USA, vertreten durch Google Inc. mit Sitz in 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
      </p>
      <p>
        Wenn Sie hier eine Seite aufrufen, auf der ein YouTube-Video eingebettet ist, verbindet sich Ihr Browser mit den Servern von YouTube und es
        werden verschiedene Daten (IP Adresse, Spracheinstellung etc.) übertragen. Die Speicherung dieser Daten erfolgt auf Servern, die sich
        großteils in den USA befinden.
      </p>
      <p>
        Sind Sie bei YouTube eingeloggt, ordnet YouTube diese Information Ihrem persönlichen Benutzerkonto zu. Sie können das verhindern, indem Sie
        sich vor der Nutzung unserer Website aus Ihrem YouTube-Benutzerkonto sowie anderen Benutzerkonten der Firmen YouTube LLC und Google Inc.
        abmelden und die entsprechenden Cookies der Firmen löschen. Weitere Informationen über die Verarbeitung und Nutzung Ihrer Daten durch
        YouTube entnehmen Sie bitte den Datenschutzrichtlinien des Serviceanbieters.
      </p>
      <h2>Hinweise zu unserer Instagram Seite</h2>
      <p>
        Wir betreiben eine Instagram Seite, welche unter{" "}
        <a href="https://www.instagram.com/andreleherb/" target="_blank" rel="noreferrer">
          https://www.instagram.com/andreleherb/
        </a>{" "}
        aufgerufen werden kann. Dabei handelt es sich um einen Dienst des Unternehmens Meta Platforms Ireland Limited, 4 Grand Canal Square, Grand
        Canal Harbour, Dublin 2, Irland.
      </p>
      <p>
        Wir weisen darauf hin, dass mithilfe der Funktion Insights, die uns Meta als nicht abdingbaren Teil des Benutzungsverhältnisses kostenfrei
        zur Verfügung stellt, anonymisierte statistische Daten betreffend die Nutzer:innen dieser Seiten an mich übermittelt werden. Diese Daten
        werden mithilfe von Cookies gesammelt, die jeweils einen eindeutigen Benutzercode enthalten, der für zwei Jahre aktiv ist und den Meta auf
        der Festplatte Ihres Computers oder einem anderen Datenträger der Besucher der Fanpage speichert. Der Benutzercode, der mit Ihren
        Meta-Anmeldungsdaten verknüpft werden kann, wird beim Aufrufen der Fanpages erhoben und verarbeitet. Für den Betreiber einer
        Instagram-Fanpage besteht keine Möglichkeit, diese Funktion zu deaktivieren bzw. die genannte Verarbeitung der Daten zu unterbinden. Nähere
        Informationen zu Meta Insight werden{" "}
        <a href="https://www.facebook.com/legal/terms/page_controller_addendum" target="_blank" rel="noreferrer">
          hier
        </a>{" "}
        zur Verfügung gestellt.
      </p>
      <p>
        Meta stimmt zu, in diesem Zusammenhang die primäre Verantwortung gemäß DSGVO für die Verarbeitung der Insights-Daten zu übernehmen und
        sämtliche Pflichten aus der DSGVO in Hinsicht auf diese Daten zu erfüllen. Meta sichert insbesondere zu, alleinige Verantwortung für in
        diesem Rahmen verarbeiteten personenbezogenen Daten zu übernehmen und alle diesbezüglichen Auskunftspflichten zu erfüllen.
      </p>
      <p>
        Die von Meta an uns im Zusammenhang mit der Nutzung der Fanpage übermittelten Daten sind anonymisiert, sodass für uns keine Rückschlüsse
        über die Identität der einzelnen Nutzer möglich ist. Es ist jedoch möglich, in einer statistischen Auswertung demografische Daten über die
        Nutzer (u.a. Tendenzen in den Bereichen Alter, Geschlecht, Beziehungsstatus und berufliche Situation), Informationen über den Lebensstil
        und die Interessen der Nutzer und geografische Daten auszuwerten. Diese Daten werden von uns lediglich zur eigenen Auswertung der Reichweite
        der Instagram-Seite verarbeitet und nicht an Dritte weitergegeben.
      </p>
      <p>
        Rechtsgrundlage dieser Verarbeitung ist Art 6 Abs 1 lit f (berechtigte Interessen) der DSGVO. Das berechtigte Interesse im Sinne der DSGVO
        ist hierbei die Identifikation von Zielgruppen, die sich für die auf unserer Seite enthaltenen Inhalte interessieren.
      </p>
      <h2>Ihre Rechte</h2>
      <p>
        Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch
        zu. Entsprechende Anfragen können an die E-Mail-Adresse <a href="mailto:office@andreleherb.music">office@andreleherb.music</a> adressiert werden.
      </p>
      <p>
        Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in
        einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die{" "}
        <a href="https://www.dsb.gv.at" target="_blank" rel="noreferrer">
          Datenschutzbehörde
        </a>
        .
      </p>
      <h2>Kontakt</h2>
      <p>
        Sie erreichen uns unter folgenden Kontaktdaten:
        <br />
        <a href="mailto:office@andreleherb.music">office@andreleherb.music</a>
      </p>
    </Legal>
  );
}
