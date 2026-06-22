import type { Metadata } from "next";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "AGB | Klickdesigns",
  description: "Allgemeine Geschäftsbedingungen von Klickdesigns.",
};

export default function AgbPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Allgemeine Geschäftsbedingungen"
      intro="Diese Bedingungen gelten für Design- und Grafikleistungen von Klickdesigns."
    >
      <LegalSection title="1. Geltungsbereich">
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für Verträge über
          Design-, Grafik- und Aufbereitungsleistungen zwischen Klickdesigns
          und seinen Kunden. Abweichende Bedingungen des Kunden gelten nur,
          wenn Klickdesigns ihnen ausdrücklich zugestimmt hat. Individuelle
          Vereinbarungen im Angebot oder in der Auftragsbestätigung gehen diesen
          Bedingungen vor.
        </p>
      </LegalSection>

      <LegalSection title="2. Vertragspartner">
        <p>
          Vertragspartner des Kunden ist Enrico Gross, Einzelunternehmen,
          handelnd unter der Marke Klickdesigns, Gerther Straße 76, 44577
          Castrop-Rauxel, Deutschland.
        </p>
      </LegalSection>

      <LegalSection title="3. Angebote und Vertragsschluss">
        <p>
          Darstellungen von Leistungen auf der Website sind noch kein
          verbindliches Vertragsangebot. Ein Vertrag kommt zustande, wenn
          Klickdesigns eine Anfrage oder Bestellung ausdrücklich bestätigt
          oder mit der vereinbarten Leistung beginnt. Maßgeblich sind die
          Auftragsbestätigung, das individuelle Angebot und die darin
          festgehaltenen Anforderungen.
        </p>
      </LegalSection>

      <LegalSection title="4. Leistungsumfang">
        <p>Der konkrete Leistungsumfang richtet sich nach dem gebuchten Paket und der Vereinbarung:</p>

        <div>
          <h3 className="font-semibold text-anthracite">Logo-Sprint – 20 € fix</h3>
          <p className="mt-2">
            Enthalten sind 4–5 Logo-Richtungen als Vorschau, die Auswahl eines
            Favoriten, eine einfache Farb- oder Namensanpassung, eine SVG-Datei,
            eine PNG-Datei mit transparentem Hintergrund und eine kleine
            Korrektur. Nicht enthalten sind vollständige Markenentwicklung,
            komplexe Illustrationen, Markenrecherche, rechtliche Prüfung,
            unbegrenzte Änderungen und aufwendige Sonderwünsche.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-anthracite">Logo-Vektorisierung – ab 49 €</h3>
          <p className="mt-2">
            Enthalten ist die einfache Aufbereitung eines bestehenden, gut
            erkennbaren Logos aus PNG, JPG, Screenshot oder ähnlicher Vorlage
            als SVG und PNG mit transparentem Hintergrund; eine PDF kann nach
            Vereinbarung hinzukommen. Die Dateien können für Website, Sticker,
            Kleidung, Druck und Social Media vorbereitet werden. Eine
            vollständige Logo-Neugestaltung, komplexe Nachzeichnungen,
            Markenprüfung oder rechtliche Logo-Prüfung sind im Einstiegspreis
            nicht enthalten.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-anthracite">Design-Finalisierung – ab 149 €</h3>
          <p className="mt-2">
            Enthalten ist die professionelle Überarbeitung bestehender Canva-,
            PNG-, JPG-, Flyer-, Social-Media- oder Designentwürfe. Layout,
            Farben, Typografie, Lesbarkeit und Markenwirkung werden im
            vereinbarten Umfang optimiert. Die Ausgabe erfolgt als PNG, JPG oder
            PDF für Print oder Social Media nach Vereinbarung. Druckdaten werden
            nach den vom Kunden oder der Druckerei bereitgestellten Anforderungen
            erstellt; ein bestimmtes Ergebnis einer externen Druckerei wird
            nicht garantiert.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-anthracite">Business-Auftritt – ab 299 €</h3>
          <p className="mt-2">
            Enthalten sind mehrere Designs oder Vorlagen in einem einheitlichen
            Look, zum Beispiel die Prüfung oder Aufbereitung von Logo-Dateien,
            Flyer, Social-Media-Vorlagen, Geschäftsgrafiken oder einfache
            Markenbausteine. Vereinbart werden einheitliche Farben, Schriften
            und Gestaltung sowie die Ausgabe als PNG, JPG, PDF und bei
            Logo-Aufbereitung gegebenenfalls SVG. Eine vollständige
            Corporate-Identity-Entwicklung, Markenstrategie, Markenprüfung oder
            rechtliche Prüfung ist nur enthalten, wenn dies ausdrücklich
            vereinbart wurde.
          </p>
        </div>
      </LegalSection>

      <LegalSection title="5. Preise und zusätzlicher Aufwand">
        <p>
          Der Fixpreis des Logo-Sprints gilt ausschließlich für den beschriebenen
          Leistungsumfang. Mit „ab“ gekennzeichnete Preise gelten für einfache
          Ausgangssituationen und den jeweils beschriebenen Umfang. Bei höherem
          Aufwand, unzureichenden Vorlagen, zusätzlichen Varianten,
          Sonderformaten oder weitergehenden Anforderungen erstellt
          Klickdesigns vor der Umsetzung ein individuelles Angebot. Maßgeblich
          ist der vereinbarte Gesamtpreis.
        </p>
      </LegalSection>

      <LegalSection title="6. Zahlung, Fälligkeit und Leistungsbeginn">
        <p>
          Zahlungsart, Zahlungszeitpunkt und Fälligkeit ergeben sich aus dem
          Angebot, der Auftragsbestätigung oder der Rechnung. Klickdesigns kann
          den Leistungsbeginn von der Auftragsbestätigung und einer vereinbarten
          Vorauszahlung abhängig machen. Gesetzliche Rechte bei Zahlungsverzug
          bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="7. Mitwirkungspflichten des Kunden">
        <p>
          Der Kunde stellt rechtzeitig verwendbare Dateien, Inhalte,
          Informationen, Wünsche, Maße, Ausgabeformate und sonstige für die
          Leistung erforderliche Vorgaben bereit. Verzögerungen oder Mehraufwand
          aufgrund fehlender, ungeeigneter oder verspäteter Mitwirkung können
          vereinbarte Termine verschieben und nach vorheriger Abstimmung
          zusätzlich berechnet werden.
        </p>
      </LegalSection>

      <LegalSection title="8. Rechte an bereitgestellten Inhalten">
        <p>
          Der Kunde ist dafür verantwortlich, dass er Logos, Bilder, Texte,
          Marken, Namen und sonstige bereitgestellte Inhalte für den Auftrag
          verwenden und durch Klickdesigns bearbeiten lassen darf. Klickdesigns
          führt keine Markenrecherche, Urheberrechtsprüfung oder sonstige
          rechtliche Prüfung durch. Der Kunde stellt Klickdesigns von
          berechtigten Ansprüchen Dritter frei, die auf einer vom Kunden zu
          vertretenden unberechtigten Bereitstellung oder Nutzung beruhen; dies
          umfasst angemessene Kosten der Rechtsverteidigung.
        </p>
      </LegalSection>

      <LegalSection title="9. Korrekturen und Richtungswechsel">
        <p>
          Korrekturrunden sind nur im ausdrücklich vereinbarten Umfang
          enthalten. Zusätzliche Änderungen, neue Wünsche, weitere Varianten
          oder deutliche Richtungswechsel nach Beginn der Bearbeitung können
          nach vorheriger Abstimmung zusätzlich berechnet werden.
        </p>
      </LegalSection>

      <LegalSection title="10. Digitale Lieferung und Dateiformate">
        <p>
          Die Lieferung erfolgt digital in den nach Paket und Vereinbarung
          geschuldeten Formaten, insbesondere SVG, PNG, JPG oder PDF. Offene,
          editierbare Arbeitsdateien, Zwischenstände und nicht ausgewählte
          Entwürfe werden nicht automatisch herausgegeben, sofern dies nicht
          ausdrücklich vereinbart wurde.
        </p>
      </LegalSection>

      <LegalSection title="11. Nutzungsrechte">
        <p>
          Der Kunde erhält nach vollständiger Zahlung die für den vereinbarten
          Zweck und Umfang erforderlichen Nutzungsrechte an der final
          freigegebenen und gelieferten Leistung. Der konkrete räumliche,
          zeitliche und inhaltliche Umfang richtet sich nach der Vereinbarung.
          Rechte an nicht ausgewählten Entwürfen und offenen Arbeitsdateien
          werden nicht übertragen.
        </p>
      </LegalSection>

      <LegalSection title="12. Prüfung, Freigabe und Abnahme">
        <p>
          Der Kunde prüft Entwürfe und finale Dateien vor der Freigabe sorgfältig
          auf Inhalte, Schreibweisen, Zahlen, Kontaktdaten, Maße, Farben und
          sonstige Vorgaben. Eine Freigabe bestätigt, dass der vorgelegte Stand
          für die vereinbarte Verwendung eingesetzt werden kann. Gesetzliche
          Rechte bei Mängeln bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="13. Druckdaten und externe Produktion">
        <p>
          Druckdaten werden nach bestem Wissen anhand der bereitgestellten
          Anforderungen erstellt. Das Ergebnis externer Druckereien hängt unter
          anderem von Druckverfahren, Material, Farbprofil, Beschnitt und den
          technischen Vorgaben des jeweiligen Anbieters ab. Für Abweichungen,
          die außerhalb des Einflussbereichs von Klickdesigns liegen, wird keine
          Gewähr übernommen.
        </p>
      </LegalSection>

      <LegalSection title="14. Haftung">
        <p>
          Klickdesigns haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit,
          bei Verletzung von Leben, Körper oder Gesundheit, nach dem
          Produkthaftungsgesetz sowie in sonstigen gesetzlich zwingenden Fällen.
          Bei leicht fahrlässiger Verletzung einer wesentlichen Vertragspflicht
          ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden
          begrenzt. Nach einer inhaltlichen Freigabe haftet Klickdesigns nicht
          für vom Kunden übersehene Tipp-, Inhalts- oder Druckfehler, soweit
          diese nicht von Klickdesigns vorsätzlich oder grob fahrlässig
          verursacht wurden. Zwingende Mängelrechte bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="15. Stornierung und Projektabbruch">
        <p>
          Wird ein Auftrag nach Vertragsschluss storniert oder abgebrochen, sind
          bereits vertragsgemäß erbrachte Leistungen und vereinbarter Aufwand zu
          vergüten. Weitere Ansprüche richten sich nach den gesetzlichen
          Bestimmungen und der individuellen Vereinbarung. Gesetzliche
          Widerrufsrechte von Verbrauchern bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="16. Kommunikation">
        <p>
          Die Projektkommunikation kann per E-Mail, Kontaktformular, Telefon oder
          über einen ausdrücklich vereinbarten Kommunikationsweg erfolgen. Der
          Kunde hält seine Kontaktdaten aktuell und prüft projektbezogene
          Mitteilungen in angemessenen Abständen.
        </p>
      </LegalSection>

      <LegalSection title="17. Schlussbestimmungen">
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Bei
          Verbrauchern gilt diese Rechtswahl nur, soweit zwingender Schutz des
          Staates ihres gewöhnlichen Aufenthalts nicht entzogen wird. Ein
          Gerichtsstand wird nur vereinbart, soweit dies gesetzlich zulässig ist.
          Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der
          übrigen Bestimmungen unberührt.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
