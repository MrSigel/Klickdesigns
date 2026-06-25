import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "AGB | Klickdesigns",
  description: "Allgemeine Geschaeftsbedingungen von Klickdesigns.",
};

export default function AgbPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Allgemeine Geschäftsbedingungen"
      intro="Diese Bedingungen gelten für Design- und Grafikleistungen sowie für Druckdaten-Erstellung und Produktumsetzung auf Anfrage."
    >
      <LegalSection title="1. Geltungsbereich">
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für Verträge zwischen
          Klickdesigns und seinen Kunden über Design-, Grafik-,
          Aufbereitungs-, Druckdaten- und Produktumsetzungsleistungen.
          Abweichende Bedingungen des Kunden gelten nur, wenn Klickdesigns ihnen
          ausdrücklich zugestimmt hat. Individuelle Vereinbarungen im Angebot
          oder in der Auftragsbestätigung gehen diesen Bedingungen vor.
        </p>
      </LegalSection>

      <LegalSection title="2. Vertragspartner">
        <p>
          Vertragspartner des Kunden ist Enrico Gross, Einzelunternehmen,
          handelnd unter der Marke Klickdesigns, Gerther Straße 76, 44577
          Castrop-Rauxel, Deutschland. E-Mail: kontakt@klickdesigns.de.
        </p>
      </LegalSection>

      <LegalSection title="3. Angebote und Vertragsschluss">
        <p>
          Darstellungen von Leistungen auf der Website sind noch kein
          verbindliches Vertragsangebot. Ein Vertrag kommt zustande, wenn
          Klickdesigns eine Anfrage ausdrücklich annimmt, ein individuelles
          Angebot bestätigt wird oder eine Auftragsbestätigung erfolgt.
          Maßgeblich sind das individuelle Angebot, die Auftragsbestätigung und
          die dort festgehaltenen Anforderungen.
        </p>
        <p>
          Produktumsetzungen erfolgen ausschließlich nach individueller Anfrage,
          Prüfung, Angebot und Freigabe. Die Website stellt keine direkte
          Online-Bestellung und keine festen öffentlichen Produktpreise für
          T-Shirts, Pullover, Sticker, Autoaufkleber, Flyer oder ähnliche
          Produkte bereit.
        </p>
      </LegalSection>

      <LegalSection title="4. Leistungsangebot">
        <p>
          Klickdesigns bietet insbesondere Logo-Sprint, Logo-Vektorisierung,
          Design-Finalisierung, Business-Auftritt, Druckdaten-Erstellung und
          die optionale Produktumsetzung auf Anfrage an. Der konkrete
          Leistungsumfang richtet sich immer nach Paketbeschreibung,
          individuellem Angebot und Vereinbarung.
        </p>

        <div>
          <h3 className="font-semibold text-anthracite">Logo-Sprint - 20 € fix</h3>
          <p className="mt-2">
            Enthalten sind 4-5 Logo-Richtungen als Vorschau, die Auswahl eines
            Favoriten, eine einfache Farb- oder Namensanpassung, eine SVG-Datei,
            eine PNG-Datei mit transparentem Hintergrund und eine kleine
            Korrektur. Nicht enthalten sind vollständige Markenentwicklung,
            komplexe Illustrationen, Markenrecherche, rechtliche Prüfung,
            unbegrenzte Änderungen und aufwendige Sonderwünsche.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-anthracite">Logo-Vektorisierung - ab 49 €</h3>
          <p className="mt-2">
            Enthalten ist die einfache Aufbereitung eines bestehenden, gut
            erkennbaren Logos aus PNG, JPG, Screenshot oder ähnlicher Vorlage
            als SVG und PNG mit transparentem Hintergrund; eine PDF kann nach
            Vereinbarung hinzukommen. Eine vollständige Logo-Neugestaltung,
            komplexe Nachzeichnung, Markenprüfung oder rechtliche Logo-Prüfung
            ist nicht enthalten.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-anthracite">Design-Finalisierung - ab 149 €</h3>
          <p className="mt-2">
            Enthalten ist die professionelle Überarbeitung bestehender Flyer,
            Canva-Designs, Social-Media-Grafiken oder Designentwürfe. Layout,
            Farben, Typografie, Lesbarkeit und Dateiausgabe werden im
            vereinbarten Umfang optimiert.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-anthracite">Business-Auftritt - ab 299 €</h3>
          <p className="mt-2">
            Enthalten sind bis zu drei abgestimmte Designs oder Vorlagen,
            einheitliche Farben und Typografie, Prüfung oder Aufbereitung von
            Logo-Dateien sowie Ausgabe als PNG, JPG, PDF und gegebenenfalls SVG.
          </p>
        </div>
      </LegalSection>

      <LegalSection title="5. Druckdaten und Produktumsetzung auf Anfrage">
        <p>
          Auf Anfrage kann Klickdesigns zusätzlich die Umsetzung von Designs auf
          physischen Produkten vorbereiten oder koordinieren, zum Beispiel für
          T-Shirts, Pullover, Sticker, Autoaufkleber, Flyer oder weitere
          Druckprodukte nach individueller Abstimmung. Die Umsetzung erfolgt mit
          geeigneten Druck- oder Produktionspartnern.
        </p>
        <p>
          Produktart, Menge, Ausführung, Größen, Farben, Designposition,
          Material, Druckverfahren, Versand und Kosten werden im individuellen
          Angebot festgelegt. Es besteht kein Anspruch auf eine bestimmte
          Produktverfügbarkeit, Lieferzeit oder Produktionsmöglichkeit, sofern
          dies nicht ausdrücklich im Angebot bestätigt wurde.
        </p>
      </LegalSection>

      <LegalSection title="6. Preise, Versandkosten und zusätzlicher Aufwand">
        <p>
          Der Fixpreis des Logo-Sprints gilt ausschließlich für den beschriebenen
          Leistungsumfang. Mit „ab“ gekennzeichnete Preise gelten für einfache
          Ausgangssituationen und den jeweils beschriebenen Umfang. Bei höherem
          Aufwand, unzureichenden Vorlagen, zusätzlichen Varianten,
          Sonderformaten, Druckdatenanforderungen oder Produktumsetzung erstellt
          Klickdesigns vor der Umsetzung ein individuelles Angebot.
        </p>
        <p>
          Für Produktumsetzungen innerhalb Deutschlands gilt eine
          Versandpauschale von 4,99 €. Falls wegen Produktart, Menge, Sperrgut
          oder abweichender Versandart höhere oder andere Versandkosten
          entstehen, werden diese vor Beauftragung im individuellen Angebot
          ausgewiesen. Weitere Informationen stehen unter{" "}
          <Link href="/versand-lieferung" className="text-ruby underline underline-offset-2">
            Versand &amp; Lieferung
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Zahlung und Produktionsstart">
        <p>
          Zahlungsart, Zahlungszeitpunkt und Fälligkeit ergeben sich aus dem
          Angebot, der Auftragsbestätigung oder der Rechnung. Bei Aufträgen
          unter 300 € Auftragswert ist vor Produktionsstart eine Zahlung von
          100 % des Auftragswerts fällig. Ab 300 € Auftragswert ist vor
          Produktionsstart eine Anzahlung von 25 % fällig; die Restzahlung
          erfolgt per Rechnung nach Lieferung.
        </p>
        <p>
          Eine Produktumsetzung beginnt erst nach Zahlungseingang der fälligen
          Vorkasse beziehungsweise Anzahlung und nach ausdrücklicher
          Druckfreigabe durch den Kunden. Gesetzliche Rechte bei Zahlungsverzug
          bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="8. Mitwirkungspflichten des Kunden">
        <p>
          Der Kunde stellt rechtzeitig verwendbare Dateien, Inhalte,
          Informationen, Wünsche, Maße, Ausgabeformate, Produktangaben,
          Lieferdaten und sonstige für die Leistung erforderliche Vorgaben
          bereit. Verzögerungen oder Mehraufwand aufgrund fehlender,
          ungeeigneter oder verspäteter Mitwirkung können vereinbarte Termine
          verschieben und nach vorheriger Abstimmung zusätzlich berechnet
          werden.
        </p>
      </LegalSection>

      <LegalSection title="9. Rechte an bereitgestellten Inhalten">
        <p>
          Der Kunde ist dafür verantwortlich, dass er Logos, Marken, Bilder,
          Texte, Namen, Motive und sonstige bereitgestellte Inhalte für den
          Auftrag verwenden und durch Klickdesigns bearbeiten oder für
          Druck-/Produktionspartner bereitstellen lassen darf. Klickdesigns
          übernimmt keine Markenprüfung, Rechteprüfung oder rechtliche Prüfung
          von Kundenmotiven.
        </p>
        <p>
          Verbotene, rechtswidrige oder rechtsverletzende Inhalte dürfen nicht
          übermittelt oder beauftragt werden. Der Kunde stellt Klickdesigns von
          berechtigten Ansprüchen Dritter frei, die auf einer vom Kunden zu
          vertretenden unberechtigten Bereitstellung oder Nutzung beruhen; dies
          umfasst angemessene Kosten der Rechtsverteidigung.
        </p>
      </LegalSection>

      <LegalSection title="10. Korrekturen und Änderungen">
        <p>
          Korrekturrunden sind nur im ausdrücklich vereinbarten Umfang
          enthalten. Zusätzliche Änderungen, neue Wünsche, weitere Varianten
          oder deutliche Richtungswechsel nach Beginn der Bearbeitung können
          nach vorheriger Abstimmung zusätzlich berechnet werden. Änderungen
          nach Druckfreigabe können Mehrkosten verursachen.
        </p>
      </LegalSection>

      <LegalSection title="11. Digitale Lieferung und Dateiformate">
        <p>
          Digitale Leistungen werden in den nach Paket und Vereinbarung
          geschuldeten Formaten bereitgestellt, insbesondere SVG, PNG, JPG oder
          PDF. Offene, editierbare Arbeitsdateien, Zwischenstände und nicht
          ausgewählte Entwürfe werden nicht automatisch herausgegeben, sofern
          dies nicht ausdrücklich vereinbart wurde.
        </p>
      </LegalSection>

      <LegalSection title="12. Nutzungsrechte">
        <p>
          Der Kunde erhält nach vollständiger Zahlung die für den vereinbarten
          Zweck und Umfang erforderlichen Nutzungsrechte an der final
          freigegebenen und gelieferten Leistung. Der konkrete räumliche,
          zeitliche und inhaltliche Umfang richtet sich nach der Vereinbarung.
          Rechte an nicht ausgewählten Entwürfen und offenen Arbeitsdateien
          werden nicht übertragen.
        </p>
      </LegalSection>

      <LegalSection title="13. Prüfung, Druckfreigabe und Abnahme">
        <p>
          Der Kunde prüft Entwürfe, finale Dateien und Druckdaten vor Freigabe
          sorgfältig auf Inhalte, Texte, Schreibweisen, Zahlen, Größen, Farben,
          Platzierungen, Motive und sonstige Vorgaben. Vor Produktionsstart
          muss der Kunde das Design beziehungsweise die Druckdaten ausdrücklich
          freigeben.
        </p>
        <p>
          Nach Freigabe trägt der Kunde Verantwortung für freigegebene Inhalte,
          Texte, Schreibweisen, Größen, Farben, Platzierungen und Motive,
          soweit diese auf seinen Angaben beruhen. Gesetzliche Rechte bei
          Mängeln bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="14. Farb-, Material- und Produktionsabweichungen">
        <p>
          Bildschirmfarben können von Druckergebnissen abweichen. Leichte
          produktionsbedingte Abweichungen bei Positionierung, Farbe, Material,
          Größe oder Verarbeitung können auftreten. Materialangaben bei Textilien
          richten sich nach den Angaben des jeweiligen Herstellers oder
          Produktionspartners.
        </p>
      </LegalSection>

      <LegalSection title="15. Lieferung und Versand">
        <p>
          Liefergebiet für Produktumsetzungen ist Deutschland. Der Versand
          erfolgt in der Regel direkt durch den beauftragten Druck- oder
          Produktionspartner an den Kunden. Produktions- und Lieferzeiten hängen
          von Produktart, Menge, Druckpartner, Druckfreigabe und Zahlungseingang
          ab. Verbindliche Lieferzeiten werden nur genannt, wenn sie im
          individuellen Angebot oder in der Auftragskommunikation ausdrücklich
          angegeben werden.
        </p>
      </LegalSection>

      <LegalSection title="16. Individuell angefertigte Produkte und Widerruf">
        <p>
          Individuell bedruckte oder personalisierte Produkte können nach
          Kundenspezifikation angefertigt oder eindeutig auf persönliche
          Bedürfnisse zugeschnitten sein. Für solche Waren können besondere
          gesetzliche Regelungen zum Widerruf gelten. Hinweise hierzu stehen in
          der{" "}
          <Link href="/widerruf" className="text-ruby underline underline-offset-2">
            Widerrufsbelehrung
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="17. Reklamationen und Mängel">
        <p>
          Der Kunde soll erkennbare Mängel oder Transportschäden möglichst
          zeitnah mitteilen, damit eine Prüfung mit dem Druck- oder
          Produktionspartner erfolgen kann. Gesetzliche Gewährleistungsrechte
          bleiben unberührt. Keine Mängel sind leichte produktionsbedingte
          Abweichungen, die im Rahmen der üblichen Toleranzen liegen.
        </p>
      </LegalSection>

      <LegalSection title="18. Haftung">
        <p>
          Klickdesigns haftet unbeschränkt bei Vorsatz und grober
          Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit, nach
          dem Produkthaftungsgesetz sowie in sonstigen gesetzlich zwingenden
          Fällen. Bei leicht fahrlässiger Verletzung einer wesentlichen
          Vertragspflicht ist die Haftung auf den vertragstypischen,
          vorhersehbaren Schaden begrenzt. Zwingende Mängelrechte bleiben
          unberührt.
        </p>
      </LegalSection>

      <LegalSection title="19. Stornierung und Projektabbruch">
        <p>
          Wird ein Auftrag nach Vertragsschluss storniert oder abgebrochen, sind
          bereits vertragsgemäß erbrachte Leistungen und vereinbarter Aufwand zu
          vergüten. Sobald eine individuell freigegebene Produktumsetzung in die
          Produktion gegeben wurde, können bereits entstandene Produktions-,
          Material- und Versandkosten anfallen. Gesetzliche Widerrufsrechte von
          Verbrauchern bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="20. Kommunikation">
        <p>
          Die Projektkommunikation kann per E-Mail, Kontaktformular, Telefon
          oder über einen ausdrücklich vereinbarten Kommunikationsweg erfolgen.
          Der Kunde hält seine Kontakt- und Lieferdaten aktuell und prüft
          projektbezogene Mitteilungen in angemessenen Abständen.
        </p>
      </LegalSection>

      <LegalSection title="21. Schlussbestimmungen">
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
