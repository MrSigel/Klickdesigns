import type { Metadata } from "next";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Impressum | Klickdesigns",
  description: "Impressum und Anbieterangaben von Klickdesigns.",
};

export default function ImpressumPage() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Impressum">
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          Enrico Gross
          <br />
          Einzelunternehmen
          <br />
          Marke: Klickdesigns
          <br />
          Gerther Straße 76
          <br />
          44577 Castrop-Rauxel
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail: kontakt@klickdesigns.de
          <br />
          Telefon: <a href="tel:+4915563535989" className="text-ruby underline underline-offset-2">+49 155 63535989</a>
        </p>
      </LegalSection>

      <LegalSection title="Umsatzsteuer-Identifikationsnummer">
        <p>DE278597389</p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt">
        <p>
          Verantwortlich i. S. d. § 18 Abs. 2 MStV:
          <br />
          Enrico Gross
          <br />
          Gerther Straße 76
          <br />
          44577 Castrop-Rauxel
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht verpflichtet und nicht bereit, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
