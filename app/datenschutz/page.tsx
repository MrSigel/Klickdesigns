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
          Enrico Gross, Einzelunternehmen
          <br />
          Klickdesigns
          <br />
          Gerther Straße 76
          <br />
          44577 Castrop-Rauxel, Deutschland
          <br />
          E-Mail: [OFFIZIELLE KLICKDESIGNS-E-MAIL EINTRAGEN]
          <br />
          Telefon: <a href="tel:+4915563535989" className="text-ruby underline underline-offset-2">+49 155 63535989</a>
        </p>
      </LegalSection>

      <LegalSection title="2. Allgemeine Hinweise zur Datenverarbeitung">
        <p>
          Personenbezogene Daten werden nur verarbeitet, soweit dies für die
          Bereitstellung der Website, die Bearbeitung von Anfragen, die
          Angebotserstellung, die Durchführung vereinbarter Design- und
          Grafikleistungen, die Kommunikation oder die Erfüllung gesetzlicher
          Pflichten erforderlich ist.
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

      <LegalSection title="6. Kontaktaufnahme">
        <p>
          Bei einer Kontaktaufnahme per E-Mail oder Telefon verarbeiten wir die
          mitgeteilten Kontaktdaten und Inhalte zur Bearbeitung der Anfrage und
          für die weitere Kommunikation. Das derzeit auf der Website sichtbare
          Kontaktformular übermittelt keine Daten. Wird es später technisch
          aktiviert, gelten für die darüber übermittelten Angaben dieselben
          Zwecke und Rechtsgrundlagen.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage
          auf einen Vertrag oder vorvertragliche Maßnahmen gerichtet ist. In
          anderen Fällen erfolgt die Verarbeitung auf Grundlage von Art. 6
          Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der
          Bearbeitung von Anfragen.
        </p>
      </LegalSection>

      <LegalSection title="7. Angebots- und Projektanfragen">
        <p>
          Für Anfragebearbeitung, Angebotserstellung, Durchführung von Design-
          und Grafikleistungen, Kommunikation und Dokumentation verarbeiten wir
          die hierfür erforderlichen Angaben. Dazu können Namen,
          Kontaktdaten, Unternehmens- und Projektdaten, gewünschte Leistungen,
          Vereinbarungen und Abrechnungsdaten gehören.
        </p>
      </LegalSection>

      <LegalSection title="8. Eingesendete Dateien und Inhalte">
        <p>
          Im Rahmen einer Anfrage oder eines Auftrags können Logos, PNG- oder
          JPG-Dateien, Screenshots, Flyer, Social-Media-Designs,
          Designentwürfe, Texte oder andere Projektdateien verarbeitet werden.
          Die Verarbeitung erfolgt zur Prüfung der Anfrage, Angebotserstellung,
          Durchführung der vereinbarten Leistung, Abstimmung und Dokumentation.
          Bitte übermittle nur Daten und Inhalte, zu deren Weitergabe du
          berechtigt bist.
        </p>
      </LegalSection>

      <LegalSection title="9. Speicherdauer">
        <p>
          Daten werden nur so lange gespeichert, wie sie für den jeweiligen
          Zweck erforderlich sind. Anschließend werden sie gelöscht, sofern
          keine gesetzlichen Aufbewahrungspflichten, die Durchsetzung oder
          Abwehr von Ansprüchen oder eine wirksame Einwilligung eine weitere
          Speicherung rechtfertigen. Gesetzlich aufbewahrungspflichtige
          Unterlagen werden bis zum Ablauf der jeweiligen Frist gespeichert.
        </p>
      </LegalSection>

      <LegalSection title="10. Empfänger und Dienstleister">
        <p>
          Daten können an technische Dienstleister, Hosting-Anbieter,
          Kommunikationsdienste oder sonstige Auftragsverarbeiter übermittelt
          werden, soweit dies für Betrieb, Kommunikation oder Durchführung der
          vereinbarten Leistung erforderlich ist. Eine Weitergabe an andere
          Empfänger erfolgt nur mit Rechtsgrundlage oder gesetzlicher Pflicht.
        </p>
      </LegalSection>

      <LegalSection title="11. Drittlandübermittlung">
        <p>
          Bei technischen Dienstleistern kann eine Verarbeitung in Drittländern
          nicht vollständig ausgeschlossen werden. Soweit erforderlich, erfolgt
          eine Übermittlung auf Grundlage eines Angemessenheitsbeschlusses,
          geeigneter Garantien wie Standardvertragsklauseln oder einer anderen
          gesetzlichen Voraussetzung nach Kapitel V DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="12. Cookies und lokale Speicherung">
        <p>
          Die Website speichert die Cookie-Consent-Auswahl im lokalen Speicher
          des Browsers. Diese notwendige Speicherung dient dazu, die getroffene
          Auswahl bei weiteren Seitenaufrufen zu berücksichtigen. Sie enthält
          nur die gewählten Consent-Kategorien und keine Analysewerte.
        </p>
      </LegalSection>

      <LegalSection title="13. Cookie-Consent und Analyse">
        <p>
          Optionale Analyse darf nur nach Einwilligung aktiviert werden. Vercel
          Analytics und Vercel Speed Insights sind derzeit nicht eingebunden.
          Falls sie später technisch aktiviert werden, werden entsprechende
          Komponenten nur nach Zustimmung zur Kategorie „Analyse“ geladen. Eine
          erteilte Einwilligung kann jederzeit über die Cookie-Einstellungen mit
          Wirkung für die Zukunft geändert oder widerrufen werden.
        </p>
      </LegalSection>

      <LegalSection title="14. Betroffenenrechte">
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

      <LegalSection title="15. Beschwerderecht">
        <p>
          Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu
          beschweren, wenn du der Ansicht bist, dass die Verarbeitung deiner
          personenbezogenen Daten gegen die DSGVO verstößt.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
