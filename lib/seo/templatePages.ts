import type { RelatedLink, SeoFaq } from "./solutionPages";

export type TemplatePage = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string;
  audience: string[];
  benefits: string[];
  availabilityTitle: string;
  availabilityText: string;
  formats: string[];
  relatedLinks: RelatedLink[];
  faq: SeoFaq[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
};

export const templatePages: TemplatePage[] = [
  {
    slug: "fussball-logo-vorlage-kostenlos-svg",
    metaTitle: "Fußball Logo Vorlage kostenlos SVG | Klickdesigns",
    metaDescription:
      "Kostenlose Fußball-Logo-Vorlagen von Klickdesigns mit Hinweisen zu SVG, PNG, Vereinslogos und passenden Logo-Dateien.",
    h1: "Fußball Logo Vorlage kostenlos SVG",
    eyebrow: "Logo-Vorlagen für Vereine",
    intro:
      "Für Fußballvereine, Teams und kleine Vereinsprojekte sind klare Logo-Dateien wichtig. Diese Seite bündelt Hinweise zu kostenlosen Logo-Vorlagen und passenden Dateiformaten.",
    audience: [
      "Fußballvereine und Teams, die eine einfache visuelle Grundlage suchen.",
      "Vereinsprojekte, die ein Logo für Social Media, Druck oder Kleidung vorbereiten möchten.",
      "Nutzer, die gezielt nach SVG- oder PNG-Dateien für ein Vereinslogo suchen.",
    ],
    benefits: [
      "Orientierung zu passenden Dateiformaten wie SVG und PNG.",
      "Direkter Verweis auf die bestehende Logo-Vorlagen-Seite.",
      "Klare Abgrenzung zwischen Vorlage, Aufbereitung und individueller Umsetzung.",
      "Weiterführende Links zur Logo-Vektorisierung für Vereine.",
    ],
    availabilityTitle: "Vorlagen-Verfügbarkeit",
    availabilityText:
      "Kostenlose Logo-Vorlagen werden ausschließlich über die bestehende Logo-Vorlagen-Seite bereitgestellt. Wenn dort keine passende Fußball- oder Vereinsvorlage verfügbar ist, kann eine Logo-Aufbereitung oder individuelle Anfrage sinnvoller sein.",
    formats: ["SVG falls verfügbar", "PNG falls verfügbar", "Web", "Druck", "Social Media", "Textil auf Anfrage"],
    relatedLinks: [
      { label: "Kostenlose Logo-Vorlagen", href: "/logo-vorlagen?kategorie=verein", text: "Verfügbare Vereins-Vorlagen im bestehenden Vorlagenbereich prüfen." },
      { label: "Logo vektorisieren für Vereine", href: "/loesungen/logo-vektorisieren-fuer-vereine", text: "Bestehende Vereinslogos als nutzbare Dateien aufbereiten lassen." },
      { label: "Logo-Sprint", href: "/logo-sprint", text: "Schneller Einstieg für neue Logo-Richtungen." },
    ],
    faq: [
      { question: "Gibt es hier einen direkten Download?", answer: "Nein, Downloads laufen ausschließlich über die bestehende Logo-Vorlagen-Seite, wenn dort eine passende Vorlage verfügbar ist." },
      { question: "Sind SVG-Dateien immer verfügbar?", answer: "Nur wenn die jeweilige Vorlage im bestehenden Vorlagenbereich mit SVG bereitgestellt wird." },
      { question: "Kann ein Vereinslogo daraus direkt gedruckt werden?", answer: "Das hängt von der konkreten Datei und dem geplanten Produkt ab. Für Textil oder Druck sollte die Datei vorher geprüft werden." },
      { question: "Kann Klickdesigns ein bestehendes Vereinslogo aufbereiten?", answer: "Ja, über die Logo-Vektorisierung kann ein vorhandenes Vereinslogo als nutzbare Datei vorbereitet werden." },
    ],
    ctaTitle: "Passende Vereinsvorlage prüfen",
    ctaText: "Öffnen Sie den bestehenden Vorlagenbereich oder fragen Sie eine Aufbereitung an, wenn bereits ein Vereinslogo vorhanden ist.",
    ctaLabel: "Zu den Vorlagen",
  },
  {
    slug: "handwerk-logo-template-gratis",
    metaTitle: "Handwerk Logo Template gratis | Klickdesigns",
    metaDescription:
      "Kostenlose Handwerk-Logo-Templates von Klickdesigns mit Hinweisen zu SVG, PNG, Druck, Kleidung und Logo-Optimierung.",
    h1: "Handwerk Logo Template gratis",
    eyebrow: "Logo-Vorlagen für Handwerk",
    intro:
      "Ein Handwerk-Logo muss auf Fahrzeug, Kleidung, Website und Angeboten klar funktionieren. Diese Seite führt zu passenden Logo-Vorlagen und erklärt, wann eine Optimierung sinnvoll ist.",
    audience: [
      "Handwerksbetriebe, die eine einfache Logo-Grundlage suchen.",
      "Gründer, die erste visuelle Ideen für einen professionellen Auftritt prüfen.",
      "Betriebe, die Dateien für Web, Druck oder Kleidung benötigen.",
    ],
    benefits: [
      "Hinweise zu SVG, PNG und nutzbaren Logo-Dateien.",
      "Direkter Einstieg in den bestehenden Vorlagenbereich.",
      "Klare Trennung zwischen kostenloser Vorlage und individueller Logo-Optimierung.",
      "Weiterführende Links für Fahrzeug, Kleidung und Druckdaten.",
    ],
    availabilityTitle: "Vorlagen-Verfügbarkeit",
    availabilityText:
      "Kostenlose Logo-Templates werden nur über die bestehende Logo-Vorlagen-Seite angeboten. Wenn dort kein passendes Handwerk-Template verfügbar ist, kann ein vorhandenes Logo optimiert oder individuell angefragt werden.",
    formats: ["SVG falls verfügbar", "PNG falls verfügbar", "Web", "Druck", "Kleidung auf Anfrage", "Fahrzeug auf Anfrage"],
    relatedLinks: [
      { label: "Kostenlose Logo-Vorlagen", href: "/logo-vorlagen?kategorie=handwerk", text: "Verfügbare Handwerk-Vorlagen im bestehenden Vorlagenbereich prüfen." },
      { label: "Handwerker Logo optimieren", href: "/loesungen/handwerker-logo-optimieren", text: "Bestehende Logos für Betrieb, Druck und Web verbessern lassen." },
      { label: "Design-Finalisierung", href: "/design-finalisierung", text: "Bestehende Entwürfe sauber finalisieren lassen." },
    ],
    faq: [
      { question: "Kann ich hier direkt ein Handwerk-Logo herunterladen?", answer: "Nein, direkte Downloads gibt es nur im bestehenden Logo-Vorlagen-Bereich, wenn eine passende Vorlage verfügbar ist." },
      { question: "Ist ein gratis Template eine individuelle Logo-Erstellung?", answer: "Nein, ein Template ist eine Vorlage. Individuelle Optimierung oder Aufbereitung muss separat angefragt werden." },
      { question: "Sind die Dateien für Fahrzeugbeschriftung geeignet?", answer: "Das hängt von der konkreten Datei ab. Für Fahrzeugbeschriftung sollte die Datei vorher geprüft und vorbereitet werden." },
      { question: "Kann mein bestehendes Logo optimiert werden?", answer: "Ja, Klickdesigns kann bestehende Handwerker-Logos prüfen und als nutzbare Dateien aufbereiten." },
    ],
    ctaTitle: "Handwerk-Vorlagen prüfen",
    ctaText: "Öffnen Sie die bestehenden Logo-Vorlagen oder fragen Sie eine Optimierung für ein vorhandenes Handwerker-Logo an.",
    ctaLabel: "Zu den Vorlagen",
  },
];

export function getTemplatePage(slug: string) {
  return templatePages.find((page) => page.slug === slug);
}
