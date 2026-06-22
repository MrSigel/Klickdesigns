import type { Metadata } from "next";
import { CookieSettings } from "../components/cookie-settings";
import { LegalPage, LegalSection } from "../components/legal-page";

export const metadata: Metadata = {
  title: "Cookie-Einstellungen | Klickdesigns",
  description: "Cookie- und Speichereinstellungen für Klickdesigns verwalten.",
};

export default function CookieEinstellungenPage() {
  return (
    <LegalPage
      eyebrow="Datenschutz"
      title="Cookie-Einstellungen"
      intro="Hier kannst du deine Auswahl für notwendige Speicherung und optionale Analyse lesen und ändern."
    >
      <LegalSection title="Kategorien">
        <CookieSettings />
      </LegalSection>

      <LegalSection title="Änderung der Auswahl">
        <p>
          Die gespeicherte Auswahl kann auf dieser Seite jederzeit geändert
          werden. Eine Änderung gilt für zukünftige Seitenaufrufe. Notwendige
          lokale Speicherung bleibt aktiv, damit die Auswahl berücksichtigt
          werden kann.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
