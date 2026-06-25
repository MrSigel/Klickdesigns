import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Widerruf | Klickdesigns",
  description: "Widerrufsbelehrung und Muster-Widerrufsformular von Klickdesigns.",
};

export default function WiderrufPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Widerrufsbelehrung"
      intro="Informationen zum gesetzlichen Widerrufsrecht für Verbraucher bei Dienstleistungen, digitalen Leistungen und individuell angefertigten Waren."
    >
      <LegalSection title="Widerrufsrecht bei Dienstleistungen">
        <p>
          Verbraucher haben bei Dienstleistungen grundsätzlich das Recht, binnen
          vierzehn Tagen ohne Angabe von Gründen den Vertrag zu widerrufen. Die
          Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
        </p>
      </LegalSection>

      <LegalSection title="Ausübung des Widerrufs">
        <p>
          Um dein Widerrufsrecht auszuüben, musst du uns mittels einer
          eindeutigen Erklärung, zum Beispiel per Brief oder E-Mail, über deinen
          Entschluss informieren, diesen Vertrag zu widerrufen:
        </p>
        <p>
          Enrico Gross, Einzelunternehmen
          <br />
          Klickdesigns
          <br />
          Gerther Straße 76
          <br />
          44577 Castrop-Rauxel, Deutschland
          <br />
          E-Mail: kontakt@klickdesigns.de
          <br />
          Telefon:{" "}
          <a href="tel:+4915563535989" className="text-ruby underline underline-offset-2">
            +49 155 63535989
          </a>
        </p>
        <p>
          Du kannst dafür das unten stehende Muster-Widerrufsformular verwenden,
          das jedoch nicht vorgeschrieben ist. Zur Wahrung der Widerrufsfrist
          reicht es aus, dass du die Mitteilung über die Ausübung des
          Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
        </p>
      </LegalSection>

      <LegalSection title="Folgen des Widerrufs">
        <p>
          Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die
          wir von dir erhalten haben, einschließlich der Lieferkosten mit
          Ausnahme zusätzlicher Kosten, die sich aus einer anderen als der von
          uns angebotenen günstigsten Standardlieferung ergeben, unverzüglich
          und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem
          die Mitteilung über deinen Widerruf bei uns eingegangen ist.
        </p>
        <p>
          Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei
          der ursprünglichen Transaktion eingesetzt hast, sofern nicht
          ausdrücklich etwas anderes vereinbart wurde. Wegen dieser Rückzahlung
          werden keine Entgelte berechnet.
        </p>
      </LegalSection>

      <LegalSection title="Vorzeitiger Beginn von Dienstleistungen">
        <p>
          Soll die Dienstleistung bereits während der Widerrufsfrist beginnen,
          ist hierfür grundsätzlich deine ausdrückliche Zustimmung erforderlich.
          Widerrufst du nach einem solchen Verlangen, kann für die bis zum
          Widerruf vertragsgemäß erbrachte Leistung ein angemessener Anteil des
          vereinbarten Gesamtpreises zu zahlen sein.
        </p>
        <p>
          Das Widerrufsrecht bei einer Dienstleistung erlischt nicht allein
          deshalb, weil die Leistung individuell nach Kundenwunsch erstellt
          wird. Es kann bei vollständiger Vertragserfüllung vor Ablauf der
          Widerrufsfrist nur unter den gesetzlichen Voraussetzungen erlöschen,
          insbesondere wenn der Verbraucher vor Beginn ausdrücklich zugestimmt
          und bestätigt hat, dass er sein Widerrufsrecht bei vollständiger
          Vertragserfüllung verliert.
        </p>
      </LegalSection>

      <LegalSection title="Digitale Inhalte und gestalterische Leistungen">
        <p>
          Soweit im Einzelfall ein Vertrag über die Bereitstellung digitaler
          Inhalte geschlossen wird, die sich nicht auf einem körperlichen
          Datenträger befinden, gelten die hierfür vorgesehenen gesetzlichen
          Voraussetzungen. Ein vorzeitiges Erlöschen des Widerrufsrechts setzt
          insbesondere die erforderliche ausdrückliche Zustimmung zum Beginn der
          Vertragserfüllung, die Bestätigung der Kenntnis vom möglichen Verlust
          des Widerrufsrechts und die gesetzlich erforderliche
          Vertragsbestätigung voraus.
        </p>
      </LegalSection>

      <LegalSection title="Individuell angefertigte und personalisierte Waren">
        <p>
          Bei Waren, die nach Kundenspezifikation angefertigt werden oder
          eindeutig auf persönliche Bedürfnisse zugeschnitten sind, kann ein
          Widerrufsrecht ausgeschlossen sein. Dies betrifft insbesondere
          individuell bedruckte oder personalisierte Produkte wie T-Shirts,
          Pullover, Sticker, Autoaufkleber, Flyer oder ähnliche Produkte mit
          Kundenlogo, Kundenmotiv, Wunschtext, individueller Farbe, Größe,
          Platzierung oder sonstiger kundenspezifischer Gestaltung.
        </p>
        <p>
          Der Kunde wird vor Beauftragung und Produktionsstart über die
          individuelle Anfertigung und den möglichen Ausschluss des Widerrufs
          informiert. Die Produktion startet erst nach ausdrücklicher
          Druckfreigabe und nach Zahlungseingang der fälligen Vorkasse
          beziehungsweise Anzahlung.
        </p>
        <p>
          Hinweise zu Versand, Lieferung und Produktionsstart stehen unter{" "}
          <Link href="/versand-lieferung" className="text-ruby underline underline-offset-2">
            Versand &amp; Lieferung
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Muster-Widerrufsformular">
        <div className="rounded-lg border border-anthracite/10 bg-offwhite/55 p-5 sm:p-6">
          <p>
            Wenn du den Vertrag widerrufen willst, kannst du dieses Formular
            ausfüllen und an uns übermitteln:
          </p>
          <p>
            An Enrico Gross, Klickdesigns, Gerther Straße 76, 44577
            Castrop-Rauxel, Deutschland
            <br />
            E-Mail: kontakt@klickdesigns.de
          </p>
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
            Vertrag über die Erbringung der folgenden Dienstleistung (*) / die
            Bereitstellung der folgenden digitalen Inhalte (*) / die Lieferung
            der folgenden Ware (*):
          </p>
          <p>
            ______________________________________________
            <br />
            Bestellt am (*) / Vertrag geschlossen am (*):
            <br />
            ______________________________________________
            <br />
            Erhalten am (*) bei Warenlieferung:
            <br />
            ______________________________________________
            <br />
            Name des/der Verbraucher(s):
            <br />
            ______________________________________________
            <br />
            Anschrift des/der Verbraucher(s):
            <br />
            ______________________________________________
            <br />
            Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
            <br />
            ______________________________________________
            <br />
            Datum:
            <br />
            ______________________________________________
          </p>
          <p>(*) Unzutreffendes streichen.</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
