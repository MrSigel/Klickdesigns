import type { Metadata } from "next";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Datenschutz | Klickdesigns",
  description: "Datenschutzerklärung von Klickdesigns.",
};

export default function DatenschutzPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      intro="Informationen zur Verarbeitung personenbezogener Daten beim Besuch dieser Website und bei der Kontaktaufnahme mit Klickdesigns."
    >
      <LegalSection title="1. Verantwortlicher">
        <p>
          Klickdesigns
          <br />
          Enrico Gross, Einzelunternehmen
          <br />
          Gerther Straße 76
          <br />
          44577 Castrop-Rauxel, Deutschland
          <br />
          E-Mail: kontakt@klickdesigns.de
          <br />
          Website: https://www.klickdesigns.de
          <br />
          Telefon:{" "}
          <a href="tel:+4915563535989" className="text-ruby underline underline-offset-2">
            +49 155 63535989
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. Allgemeine Hinweise zur Datenverarbeitung">
        <p>
          Personenbezogene Daten werden nur verarbeitet, soweit dies für die
          Bereitstellung der Website, die Bearbeitung von Anfragen, die
          Angebotserstellung, die Durchführung vereinbarter Design-,
          Druckdaten- oder Produktumsetzungsleistungen, die Kommunikation oder
          die Erfüllung gesetzlicher Pflichten erforderlich ist.
        </p>
      </LegalSection>

      <LegalSection title="3. Rechtsgrundlagen">
        <p>Je nach Verarbeitung stützen wir uns insbesondere auf:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Art. 6 Abs. 1 lit. a DSGVO bei erteilter Einwilligung,</li>
          <li>
            Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche Maßnahmen und die
            Durchführung eines Vertrags,
          </li>
          <li>Art. 6 Abs. 1 lit. c DSGVO zur Erfüllung rechtlicher Pflichten,</li>
          <li>
            Art. 6 Abs. 1 lit. f DSGVO zur Wahrung berechtigter Interessen,
            insbesondere an einer sicheren und technisch stabilen Website und
            einer geordneten Kommunikation.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Zugriffsdaten und Server-Logs">
        <p>
          Beim Aufruf der Website können technisch erforderliche Zugriffsdaten
          verarbeitet werden. Dazu können IP-Adresse, Datum und Uhrzeit des
          Zugriffs, aufgerufene Seite oder Datei, Referrer-URL, Browser- und
          Betriebssysteminformationen, übertragene Datenmenge und HTTP-Status
          gehören. Die Verarbeitung dient der Auslieferung, Stabilität,
          Fehleranalyse und Sicherheit der Website. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="5. Hosting über Vercel">
        <p>
          Für diese Website ist Hosting über Vercel vorgesehen. Dabei können
          für die technische Bereitstellung Server-Logdaten durch Vercel
          verarbeitet werden. Je nach eingesetzter Infrastruktur kann eine
          Verarbeitung außerhalb der Europäischen Union oder des Europäischen
          Wirtschaftsraums stattfinden. In diesem Fall werden die gesetzlich
          vorgesehenen Schutzmechanismen für Drittlandübermittlungen
          berücksichtigt.
        </p>
      </LegalSection>

      <LegalSection title="6. Anfrageformular und Projektanfragen">
        <p>
          Bei einer Kontaktaufnahme per Kontaktformular, E-Mail oder Telefon
          verarbeiten wir die übermittelten Angaben zur Bearbeitung der Anfrage,
          zur Angebotserstellung und für die weitere Kommunikation. Dazu können
          insbesondere Name, E-Mail-Adresse, Telefonnummer, Unternehmensdaten,
          Projektbeschreibung, gewünschte Leistung, Produktumsetzungswünsche,
          Mengenangaben, Größen oder Ausführungen, Farben, Designpositionen und
          sonstige Hinweise gehören.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage
          auf einen Vertrag oder vorvertragliche Maßnahmen gerichtet ist. In
          anderen Fällen erfolgt die Verarbeitung auf Grundlage von Art. 6
          Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der
          Bearbeitung von Anfragen.
        </p>
      </LegalSection>

      <LegalSection title="7. Datei-Uploads und Projektdateien">
        <p>
          Im Rahmen einer Anfrage oder eines Auftrags können Logos, Entwürfe,
          Bilder, Druckdaten, PDFs, ZIP-Dateien oder sonstige vom Kunden
          bereitgestellte Projektdateien verarbeitet werden. Die Verarbeitung
          erfolgt zur Bearbeitung der Anfrage, Angebotserstellung,
          Designumsetzung, Druckdatenprüfung, Produktumsetzung, Abstimmung und
          Kommunikation mit dem Kunden.
        </p>
        <p>
          Bitte übermittle nur Daten, Dateien und Inhalte, zu deren Weitergabe
          und Nutzung du berechtigt bist.
        </p>
      </LegalSection>

      <LegalSection title="8. Weitergabe an Druck- und Produktionspartner">
        <p>
          Für Produktumsetzungen kann es erforderlich sein, Projektdateien,
          Druckdaten, Versanddaten und auftragsbezogene Informationen an
          geeignete Druck- oder Produktionspartner weiterzugeben. Die Weitergabe
          erfolgt nur, soweit sie zur Angebotserstellung, Produktion, Lieferung
          oder Abwicklung des konkreten Auftrags erforderlich ist.
        </p>
        <p>
          Eine Weitergabe für fremde Werbung erfolgt nicht.
        </p>
      </LegalSection>

      <LegalSection title="9. Versanddaten">
        <p>
          Für die Lieferung individuell beauftragter Produkte können Name oder
          Firma, Lieferadresse, Kontaktinformationen und auftragsbezogene
          Produktinformationen verarbeitet werden. Diese Daten werden genutzt,
          um die Lieferung und Versandabwicklung durch den beauftragten
          Druck- oder Produktionspartner zu ermöglichen.
        </p>
      </LegalSection>

      <LegalSection title="10. Zahlungs- und Rechnungsdaten">
        <p>
          Zur Vertragsabwicklung, Buchhaltung und Erfüllung gesetzlicher
          Nachweispflichten verarbeiten wir Rechnungsdaten, Zahlungsstatus,
          Angebotsdaten sowie Buchungs- und Auftragsdaten. Rechtsgrundlagen sind
          insbesondere Art. 6 Abs. 1 lit. b und c DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="11. Empfänger und Dienstleister">
        <p>
          Daten können an technische Dienstleister, Hosting-Anbieter,
          Kommunikationsdienste, Zahlungs- oder Rechnungsdienstleister,
          Druck-/Produktionspartner oder sonstige Auftragsverarbeiter
          übermittelt werden, soweit dies für Betrieb, Kommunikation,
          Angebotserstellung, Durchführung der vereinbarten Leistung, Lieferung
          oder gesetzliche Pflichten erforderlich ist.
        </p>
      </LegalSection>

      <LegalSection title="12. Drittlandübermittlung">
        <p>
          Bei technischen Dienstleistern kann eine Verarbeitung in Drittländern
          nicht vollständig ausgeschlossen werden. Soweit erforderlich, erfolgt
          eine Übermittlung auf Grundlage eines Angemessenheitsbeschlusses,
          geeigneter Garantien wie Standardvertragsklauseln oder einer anderen
          gesetzlichen Voraussetzung nach Kapitel V DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="13. Speicherdauer">
        <p>
          Daten werden nur so lange gespeichert, wie es für Anfrage,
          Projektabwicklung, Vertragsabwicklung, gesetzliche
          Aufbewahrungspflichten oder berechtigte Interessen erforderlich ist.
          Anschließend werden sie gelöscht, sofern keine weitere Aufbewahrung
          erforderlich oder zulässig ist.
        </p>
        <p>
          Hochgeladene Projektdateien können nach Abschluss des Projekts
          gelöscht werden, soweit keine weitere Aufbewahrung für
          Projektabwicklung, Nachweise, gesetzliche Pflichten oder berechtigte
          Interessen erforderlich ist.
        </p>
      </LegalSection>

      <LegalSection title="14. Cookies und lokale Speicherung">
        <p>
          Die Website speichert die Cookie-Consent-Auswahl im lokalen Speicher
          des Browsers. Diese notwendige Speicherung dient dazu, die getroffene
          Auswahl bei weiteren Seitenaufrufen zu berücksichtigen. Sie enthält
          nur die gewählten Consent-Kategorien und keine Analysewerte.
        </p>
      </LegalSection>

      <LegalSection title="15. Cookie-Consent und Analyse">
        <p>
          Optionale Analyse darf nur nach Einwilligung aktiviert werden. Vercel
          Analytics und Vercel Speed Insights sind derzeit nicht eingebunden.
          Falls sie später technisch aktiviert werden, werden entsprechende
          Komponenten nur nach Zustimmung zur Kategorie „Analyse“ geladen. Eine
          erteilte Einwilligung kann jederzeit über die Cookie-Einstellungen mit
          Wirkung für die Zukunft geändert oder widerrufen werden.
        </p>
      </LegalSection>

      <LegalSection title="16. Betroffenenrechte">
        <p>Betroffene Personen haben nach Maßgabe der DSGVO insbesondere das Recht auf:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Auskunft über verarbeitete personenbezogene Daten,</li>
          <li>Berichtigung unrichtiger oder unvollständiger Daten,</li>
          <li>Löschung oder Einschränkung der Verarbeitung,</li>
          <li>Datenübertragbarkeit, soweit die Voraussetzungen vorliegen,</li>
          <li>Widerspruch gegen Verarbeitungen nach Art. 6 Abs. 1 lit. e oder f DSGVO,</li>
          <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft.</li>
        </ul>
      </LegalSection>

      <LegalSection title="17. Beschwerderecht">
        <p>
          Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu
          beschweren, wenn du der Ansicht bist, dass die Verarbeitung deiner
          personenbezogenen Daten gegen die DSGVO verstößt.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
