export type SeoFaq = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  text: string;
};

export type ProcessStep = {
  title: string;
  text: string;
};

export type SolutionPage = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string;
  problemTitle: string;
  problem: string[];
  solutionTitle: string;
  solution: string[];
  benefits: string[];
  process: ProcessStep[];
  formats: string[];
  productNote: string;
  relatedLinks: RelatedLink[];
  faq: SeoFaq[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
};

export const solutionPages: SolutionPage[] = [
  {
    slug: "logo-vektorisieren-fuer-vereine",
    metaTitle: "Logo vektorisieren für Vereine | SVG & PNG | Klickdesigns",
    metaDescription:
      "Klickdesigns bereitet Vereinslogos aus PNG, JPG oder Screenshot als saubere SVG- und PNG-Dateien für Druck, Textil, Sticker und Web auf.",
    h1: "Logo vektorisieren für Vereine",
    eyebrow: "Vereinslogo aufbereiten",
    intro:
      "Wenn ein Vereinslogo nur als unscharfes Bild vorliegt, wird es für Trikots, Banner, Sticker oder Website schnell problematisch. Klickdesigns bereitet bestehende Vereinslogos als nutzbare Dateien auf.",
    problemTitle: "Typische Probleme bei Vereinslogos",
    problem: [
      "Das Logo liegt nur als PNG, JPG oder Screenshot vor.",
      "Kanten wirken unscharf oder pixelig.",
      "Für Textildruck, Sticker oder Banner fehlt eine skalierbare Datei.",
      "Ein transparenter Hintergrund oder eine saubere Exportdatei fehlt.",
    ],
    solutionTitle: "Saubere Dateien für Verein, Druck und Web",
    solution: [
      "Aufbereitung des bestehenden Logos als SVG-Datei.",
      "PNG mit transparentem Hintergrund für digitale Nutzung.",
      "Prüfung einfacher Formen, Konturen und Lesbarkeit.",
      "Dateien für Web, Druck, Social Media, Sticker und Kleidung.",
    ],
    benefits: [
      "Vereinslogo bleibt auch groß skaliert klar.",
      "Bessere Grundlage für Trikots, Schilder, Flyer und Website.",
      "Einheitlichere Nutzung in digitaler und gedruckter Form.",
      "Keine komplette Neugestaltung, wenn das vorhandene Logo erhalten bleiben soll.",
    ],
    process: [
      { title: "Datei senden", text: "PNG, JPG, Screenshot oder vorhandene Logo-Datei wird geprüft." },
      { title: "Aufbereitung", text: "Das Logo wird für eine saubere, skalierbare Nutzung vorbereitet." },
      { title: "Export", text: "Sie erhalten nutzbare Dateien wie SVG und PNG mit transparentem Hintergrund." },
      { title: "Korrektur", text: "Eine kleine Korrektur ist im Rahmen der Logo-Vektorisierung enthalten." },
    ],
    formats: ["SVG", "PNG", "PDF nach Vereinbarung", "Web", "Druck", "Textil", "Sticker"],
    productNote:
      "Produktumsetzung für Trikots, Kleidung, Sticker oder Banner ist auf Anfrage möglich und erfolgt erst nach individueller Prüfung.",
    relatedLinks: [
      { label: "Logo-Vektorisierung", href: "/logo-vektorisieren", text: "Bestehende Logos als SVG und PNG aufbereiten lassen." },
      { label: "Grafikdesign für Vereine", href: "/grafikdesign-fuer-vereine", text: "Designs für Vereine, Events und lokale Kommunikation." },
      { label: "Textildruck-Vektorgrafik", href: "/loesungen/vektorgrafik-fuer-textildruck", text: "Dateien für Kleidung und Druck sauber vorbereiten." },
    ],
    faq: [
      { question: "Kann ein altes Vereinslogo vektorisiert werden?", answer: "Ja, wenn das vorhandene Logo ausreichend erkennbar ist, kann es als nutzbare SVG- und PNG-Datei aufbereitet werden." },
      { question: "Ist das für Trikots und Vereinskleidung geeignet?", answer: "Die Dateien können für Kleidung vorbereitet werden. Die konkrete Produktumsetzung erfolgt auf Anfrage nach Prüfung." },
      { question: "Wird das Logo komplett neu gestaltet?", answer: "Nein, bei der Vektorisierung wird das bestehende Logo aufbereitet. Eine komplette Neugestaltung ist nicht enthalten." },
      { question: "Welche Dateien bekomme ich?", answer: "In der Regel SVG und PNG mit transparentem Hintergrund. Weitere Formate können nach Vereinbarung vorbereitet werden." },
    ],
    ctaTitle: "Vereinslogo aufbereiten lassen",
    ctaText: "Senden Sie das vorhandene Logo oder einen Screenshot und beschreiben Sie kurz, wofür die Datei genutzt werden soll.",
    ctaLabel: "Logo anfragen",
  },
  {
    slug: "vektorgrafik-fuer-textildruck",
    metaTitle: "Vektorgrafik für Textildruck erstellen lassen | Klickdesigns",
    metaDescription:
      "Klickdesigns bereitet Logos und Motive als Vektorgrafik für Textildruck, Kleidung, Sticker und weitere Produktumsetzungen auf Anfrage vor.",
    h1: "Vektorgrafik für Textildruck",
    eyebrow: "Druckdaten vorbereiten",
    intro:
      "Für T-Shirts, Pullover oder Arbeitskleidung braucht ein Motiv klare Konturen und nutzbare Dateien. Klickdesigns bereitet bestehende Logos und Motive für Textildruck und Produktanfragen auf.",
    problemTitle: "Warum normale Bilddateien oft nicht reichen",
    problem: [
      "PNG- oder JPG-Dateien werden bei großer Ausgabe unscharf.",
      "Konturen sind für Folie, Druck oder Stickerei nicht sauber genug.",
      "Der Hintergrund ist nicht transparent.",
      "Druckdienstleister benötigen andere Dateiformate als für Social Media.",
    ],
    solutionTitle: "Aufbereitung für Kleidung und Produkte",
    solution: [
      "Vektorisierung oder saubere Aufbereitung vorhandener Logos und Motive.",
      "Export als SVG, PNG oder PDF nach Bedarf.",
      "Klare Dateigrundlage für Textil, Sticker und weitere Produkte.",
      "Produktumsetzung nur auf Anfrage und nach individueller Prüfung.",
    ],
    benefits: [
      "Bessere Skalierbarkeit für große und kleine Druckflächen.",
      "Klarere Konturen für Textil- und Folienanwendungen.",
      "Nutzbare Dateien für Anfrage, Freigabe und Produktion.",
      "Geeignet für Vereine, Handwerk, Creator und lokale Unternehmen.",
    ],
    process: [
      { title: "Motiv prüfen", text: "Vorhandene Datei, Screenshot oder Logo wird auf Eignung geprüft." },
      { title: "Datei aufbereiten", text: "Konturen, Transparenz und Export werden für den Zweck vorbereitet." },
      { title: "Formate liefern", text: "Geeignete Dateien werden nach Vereinbarung bereitgestellt." },
      { title: "Umsetzung anfragen", text: "Produktumsetzung kann separat geprüft und angeboten werden." },
    ],
    formats: ["SVG", "PNG", "PDF", "Textil", "Sticker", "Druck", "Web"],
    productNote:
      "T-Shirts, Pullover, Sticker und weitere Produkte sind auf Anfrage möglich. Es handelt sich nicht um eine direkte Online-Bestellung.",
    relatedLinks: [
      { label: "Logo vektorisieren lassen", href: "/logo-vektorisieren", text: "Bestehendes Logo als skalierbare Datei aufbereiten." },
      { label: "Sticker-Design", href: "/sticker-design", text: "Motive und Dateien für Sticker vorbereiten." },
      { label: "Autoaufkleber-Design", href: "/autoaufkleber-design", text: "Dateien für Fahrzeug-Sticker und Beschriftung." },
    ],
    faq: [
      { question: "Ist eine Vektorgrafik für Textildruck immer nötig?", answer: "Nicht immer, aber für viele Anwendungen ist eine saubere, skalierbare Datei die bessere Grundlage." },
      { question: "Kann ein PNG für Textildruck vorbereitet werden?", answer: "Ja, wenn das Motiv ausreichend erkennbar ist, kann es geprüft und passend aufbereitet werden." },
      { question: "Kann ich direkt T-Shirts bestellen?", answer: "Nein, es gibt keine direkte Online-Bestellung. Produktumsetzung erfolgt nur auf Anfrage und nach Prüfung." },
      { question: "Welche Formate sind möglich?", answer: "Je nach Zweck kommen SVG, PNG oder PDF infrage." },
    ],
    ctaTitle: "Motiv für Textildruck vorbereiten",
    ctaText: "Beschreiben Sie kurz das Produkt, die geplante Nutzung und senden Sie die vorhandene Datei mit.",
    ctaLabel: "Druckdatei anfragen",
  },
  {
    slug: "handwerker-logo-optimieren",
    metaTitle: "Handwerker Logo optimieren lassen | Klickdesigns",
    metaDescription:
      "Klickdesigns optimiert bestehende Handwerker-Logos für Web, Druck, Fahrzeugbeschriftung, Kleidung und Social Media als nutzbare Dateien.",
    h1: "Handwerker Logo optimieren lassen",
    eyebrow: "Logo für Betrieb und Auftritt",
    intro:
      "Für Handwerksbetriebe muss ein Logo auf Fahrzeugen, Kleidung, Angeboten, Flyern und online funktionieren. Klickdesigns bereitet bestehende Logos sauber auf und verbessert die Nutzbarkeit.",
    problemTitle: "Häufige Schwächen bei bestehenden Logos",
    problem: [
      "Das Logo ist nur in kleiner Auflösung vorhanden.",
      "Schrift, Farben oder Konturen wirken nicht sauber.",
      "Für Fahrzeugbeschriftung oder Kleidung fehlen passende Dateien.",
      "Die Datei ist für Angebote, Website und Social Media uneinheitlich nutzbar.",
    ],
    solutionTitle: "Optimierung statt unnötiger Neuanfang",
    solution: [
      "Prüfung und Aufbereitung bestehender Logo-Dateien.",
      "Verbesserung von Lesbarkeit, Konturen und Exporten.",
      "SVG und PNG mit transparentem Hintergrund nach Eignung.",
      "Vorbereitung für Web, Druck, Kleidung und Fahrzeugbeschriftung.",
    ],
    benefits: [
      "Professionellerer Eindruck im Alltag des Betriebs.",
      "Ein Logo, das auf mehreren Medien sauber nutzbar ist.",
      "Bessere Grundlage für Schilder, Fahrzeuge, Kleidung und Dokumente.",
      "Keine komplette Markenentwicklung, wenn nur die Datei verbessert werden soll.",
    ],
    process: [
      { title: "Logo senden", text: "Vorhandene Datei oder Screenshot wird mit dem geplanten Zweck übermittelt." },
      { title: "Machbarkeit prüfen", text: "Klickdesigns prüft, ob Optimierung oder Vektorisierung sinnvoll ist." },
      { title: "Aufbereitung", text: "Dateien werden für die relevanten Anwendungen vorbereitet." },
      { title: "Ausgabe", text: "Nutzbare Dateien werden nach Vereinbarung bereitgestellt." },
    ],
    formats: ["SVG", "PNG", "PDF nach Vereinbarung", "Web", "Druck", "Kleidung", "Fahrzeug"],
    productNote:
      "Umsetzung auf Kleidung, Stickern oder Fahrzeugbeschriftung kann separat angefragt werden und ist keine direkte Bestellung.",
    relatedLinks: [
      { label: "Logo-Vektorisierung", href: "/logo-vektorisieren", text: "Logo aus PNG, JPG oder Screenshot aufbereiten." },
      { label: "Autoaufkleber-Design", href: "/autoaufkleber-design", text: "Design-Dateien für Fahrzeugbeschriftung vorbereiten." },
      { label: "Handwerk Logo Template", href: "/vorlagen/handwerk-logo-template-gratis", text: "Hinweise zu kostenlosen Handwerk-Logo-Vorlagen." },
    ],
    faq: [
      { question: "Kann ein bestehendes Handwerker-Logo verbessert werden?", answer: "Ja, wenn die Vorlage ausreichend erkennbar ist, kann das Logo aufbereitet und besser nutzbar gemacht werden." },
      { question: "Ist eine komplette Neugestaltung enthalten?", answer: "Nein, diese Seite bezieht sich auf Optimierung und Aufbereitung bestehender Logos." },
      { question: "Eignet sich das für Fahrzeugbeschriftung?", answer: "Die Dateien können dafür vorbereitet werden. Die konkrete Umsetzung erfolgt auf Anfrage nach Prüfung." },
      { question: "Welche Datei soll ich senden?", answer: "PNG, JPG, PDF, Screenshot oder vorhandene Logo-Dateien sind geeignet, wenn das Motiv erkennbar ist." },
    ],
    ctaTitle: "Handwerker-Logo prüfen lassen",
    ctaText: "Senden Sie das vorhandene Logo und nennen Sie den geplanten Einsatz, zum Beispiel Fahrzeug, Kleidung, Website oder Druck.",
    ctaLabel: "Logo optimieren anfragen",
  },
];

export function getSolutionPage(slug: string) {
  return solutionPages.find((page) => page.slug === slug);
}
