import Header from '../components/Header';
import Footer from '../components/Footer';
import { deliveryTimes } from '../site-config';

export const metadata = {
  title: 'Logo-Sprint für 20 € – schnelle Logo-Richtungen für dein Projekt | Klickdesigns',
  description: 'Mit dem Logo-Sprint erhalten Sie 4–5 Logo-Richtungen als Vorschau und eine finale Datei als SVG und PNG mit transparentem Hintergrund für nur 20 €.',
  openGraph: {
    title: 'Logo-Sprint 20 € | Klickdesigns',
    description: 'Schneller Einstieg: mehrere Logo-Ideen als Vorschau und finale nutzbare Dateien.',
  },
};

export default function LogoSprintPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Logo-Sprint für 20 €</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Der schnelle Einstieg für neue Logo-Ideen. Sie erhalten mehrere Richtungen und eine finale, nutzbare Datei.</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-anthracite/10 p-6">
            <h2 className="font-semibold">Im Preis enthalten</h2>
            <ul className="mt-3 space-y-1 text-sm text-anthracite/70">
              <li>• 4–5 Logo-Richtungen als Vorschau</li>
              <li>• Auswahl eines Favoriten</li>
              <li>• Einfache Farb- oder Namensanpassung</li>
              <li>• SVG-Datei</li>
              <li>• PNG mit transparentem Hintergrund</li>
              <li>• 1 kleine Korrektur inklusive</li>
            </ul>
          </div>
          <div className="rounded-xl border border-anthracite/10 p-6">
            <h2 className="font-semibold">Nicht enthalten</h2>
            <ul className="mt-3 space-y-1 text-sm text-anthracite/70">
              <li>• Komplette Markenentwicklung</li>
              <li>• Komplexe Illustrationen</li>
              <li>• Markenrecherche</li>
              <li>• Rechtliche Prüfung</li>
              <li>• Unbegrenzte Änderungen</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Ablauf</h2>
          <p className="mt-3 text-anthracite/70">Sie beschreiben kurz Ihr Vorhaben oder senden eine Idee. Wir liefern die Richtungen. Sie wählen und wir finalisieren.</p>
        </div>

        <div className="mt-10 rounded-xl border border-ruby/20 bg-ruby/5 p-6">
          <p className="font-semibold">Preis: Logo-Sprint 20 € fix</p>
          <p className="mt-1 text-xs text-anthracite/60">Lieferzeit: ca. 48 Stunden • In der Regel innerhalb weniger Werktage erste Richtungen und Finalisierung.</p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Häufige Fragen</h2>
          <details className="border-b py-3"><summary>Wie viele Richtungen erhalte ich?</summary><p className="mt-1 text-sm">4–5 verschiedene Richtungen als Vorschau.</p></details>
          <details className="border-b py-3"><summary>Bekomme ich SVG und PNG?</summary><p className="mt-1 text-sm">Ja, beide Formate sind inklusive.</p></details>
          <details className="border-b py-3"><summary>Wie viele Korrekturen sind enthalten?</summary><p className="mt-1 text-sm">Eine kleine Korrektur ist im Preis enthalten.</p></details>
          <details className="border-b py-3"><summary>Was ist nicht im Sprint enthalten?</summary><p className="mt-1 text-sm">Komplette Markenentwicklung, komplexe Illustrationen oder unbegrenzte Änderungen.</p></details>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-anthracite/70">Nach dem Sprint kann das Logo auf Anfrage für Sticker, Kleidung oder andere Produkte vorbereitet werden.</p>
          <a href="/kontakt" className="inline-flex rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Logo-Sprint starten</a>
        </div>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Wie viele Richtungen erhalte ich?", acceptedAnswer: { "@type": "Answer", text: "4–5 verschiedene Richtungen als Vorschau." } },
              { "@type": "Question", name: "Bekomme ich SVG und PNG?", acceptedAnswer: { "@type": "Answer", text: "Ja, beide Formate sind inklusive." } },
              { "@type": "Question", name: "Wie viele Korrekturen sind enthalten?", acceptedAnswer: { "@type": "Answer", text: "Eine kleine Korrektur ist im Preis enthalten." } },
              { "@type": "Question", name: "Was ist nicht im Sprint enthalten?", acceptedAnswer: { "@type": "Answer", text: "Komplette Markenentwicklung, komplexe Illustrationen oder unbegrenzte Änderungen." } }
            ]
          }).replace(/</g, "\\u003c")
        }}
      />
    </>
  );
}
