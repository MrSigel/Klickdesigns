import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Versand & Lieferung | Klickdesigns",
  description:
    "Informationen zu Versand, Lieferung und Produktionsstart bei Produktumsetzung auf Anfrage durch Klickdesigns.",
};

export default function VersandLieferungPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Versand & Lieferung"
      intro="Informationen zu Versand, Lieferung und Produktionsstart bei Druck & Produktumsetzung auf Anfrage."
    >
      <LegalSection title="Kein klassischer Online-Shop">
        <p>
          Klickdesigns verkauft keine Lagerware und betreibt keinen klassischen
          Online-Shop. Produktumsetzungen erfolgen ausschließlich nach
          individueller Anfrage, Prüfung, Angebot und Freigabe.
        </p>
      </LegalSection>

      <LegalSection title="Liefergebiet und Versandweg">
        <p>
          Die Lieferung individuell beauftragter Produkte erfolgt innerhalb
          Deutschlands. Der Versand erfolgt in der Regel direkt durch den
          beauftragten Druck- oder Produktionspartner an den Kunden.
        </p>
      </LegalSection>

      <LegalSection title="Versandkosten">
        <p>
          Die Versandpauschale beträgt 4,99 €. Bei besonderen Produkten,
          größeren Mengen, Sperrgut oder abweichenden Versandarten können
          abweichende Versandkosten anfallen. Solche Kosten werden vor
          Auftragserteilung im individuellen Angebot ausgewiesen.
        </p>
      </LegalSection>

      <LegalSection title="Produktions- und Lieferzeiten">
        <p>
          Produktions- und Lieferzeiten hängen von Produktart, Menge,
          Druckpartner, Druckfreigabe und Zahlungseingang ab. Verbindliche
          Lieferzeiten werden, soweit möglich, im individuellen Angebot oder in
          der Auftragskommunikation genannt.
        </p>
        <p>
          Die Produktion startet erst nach ausdrücklicher Druckfreigabe und nach
          Zahlungseingang der erforderlichen Vorkasse beziehungsweise Anzahlung.
        </p>
      </LegalSection>

      <LegalSection title="Zahlung vor Produktionsstart">
        <p>
          Unter 300 € Auftragswert sind 100 % Vorkasse vor Produktionsstart
          fällig. Ab 300 € Auftragswert sind 25 % Anzahlung vor Produktionsstart
          fällig; die Restzahlung erfolgt per Rechnung nach Lieferung.
        </p>
      </LegalSection>

      <LegalSection title="Individuell angefertigte Produkte">
        <p>
          Für individuell angefertigte oder personalisierte Produkte gelten
          besondere Hinweise zum Widerruf. Dazu zählen zum Beispiel bedruckte
          T-Shirts, Pullover, Sticker, Autoaufkleber, Flyer oder ähnliche
          Produkte mit Kundenlogo, Kundenmotiv, Wunschtext, individueller Farbe,
          Größe, Platzierung oder sonstiger kundenspezifischer Gestaltung.
        </p>
      </LegalSection>

      <LegalSection title="Anfrage stellen">
        <p>
          Du möchtest dein Logo oder Design auf T-Shirts, Pullover, Sticker,
          Autoaufkleber oder Flyer umsetzen lassen? Stelle eine Anfrage über das{" "}
          <Link href="/kontakt" className="text-ruby underline underline-offset-2">
            Kontaktformular
          </Link>
          .
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/agb" className="text-ruby underline underline-offset-2">
            AGB
          </Link>
          <Link href="/widerruf" className="text-ruby underline underline-offset-2">
            Widerruf
          </Link>
          <Link href="/datenschutz" className="text-ruby underline underline-offset-2">
            Datenschutz
          </Link>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
