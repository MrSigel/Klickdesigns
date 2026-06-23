import Header from '../components/Header';
import Footer from '../components/Footer';
import { deliveryTimes } from '../site-config';

export const metadata = {
  title: 'Logo vektorisieren lassen – SVG & PNG für Druck, Web und Sticker | Klickdesigns',
  description: 'Klickdesigns bereitet bestehende Logos aus PNG, JPG oder Screenshots als saubere SVG- und PNG-Dateien auf – ideal für Website, Druck, Kleidung, Sticker und Social Media.',
  openGraph: {
    title: 'Logo vektorisieren lassen – SVG & PNG | Klickdesigns',
    description: 'Bestehende Logos professionell als nutzbare Dateien aufbereiten. SVG, PNG transparent, druckfertig.',
  },
};

export default function LogoVektorisierenPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">
          Logo vektorisieren lassen
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">
          Sie haben ein Logo als PNG, JPG, Screenshot oder in schlechter Qualität? Wir bereiten es als skalierbare, druckfähige Datei auf.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-anthracite">Typische Ausgangslage</h2>
            <ul className="mt-4 space-y-2 text-anthracite/70">
              <li>• Unscharfes oder pixeliges Logo</li>
              <li>• Kein SVG, nur PNG/JPG</li>
              <li>• Kein transparenter Hintergrund</li>
              <li>• Nicht skalierbar für Druck oder Website</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-anthracite">Was wir daraus machen</h2>
            <ul className="mt-4 space-y-2 text-anthracite/70">
              <li>• Sauberes SVG (vektorisiert)</li>
              <li>• PNG mit transparentem Hintergrund</li>
              <li>• Dateien für Web, Druck, Sticker, Kleidung</li>
              <li>• 1 Korrekturrunde inklusive</li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold">Ablauf</h2>
          <ol className="mt-4 list-decimal pl-5 space-y-1 text-anthracite/70">
            <li>Logo-Datei oder Screenshot zusenden</li>
            <li>Wir analysieren und vektorisieren</li>
            <li>Sie erhalten SVG + PNG</li>
            <li>1 kleine Anpassung möglich</li>
          </ol>
        </div>

        <div className="mt-12 rounded-xl border border-anthracite/10 bg-white p-6">
          <p className="font-semibold">Preis: Logo-Vektorisierung ab 49 €</p>
          <p className="mt-2 text-sm text-anthracite/60">Geeignet für einfache, gut erkennbare Logos. Keine komplette Neugestaltung oder komplexe Illustrationen.</p>
          <p className="mt-3 text-xs text-anthracite/60">Klickdesigns aus Castrop-Rauxel unterstützt Kunden im Ruhrgebiet, NRW und deutschlandweit.</p>
          <p className="mt-2 text-xs text-anthracite/60">Lieferzeit ca. {deliveryTimes.logoVektorisierung} • In der Regel innerhalb weniger Werktage.</p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Häufige Fragen</h2>
          <details className="border-b py-3"><summary className="cursor-pointer font-medium">Bekomme ich eine SVG-Datei?</summary><p className="mt-2 text-sm text-anthracite/70">Ja, die Vektorisierung liefert ein skalierbares SVG.</p></details>
          <details className="border-b py-3"><summary className="cursor-pointer font-medium">Kann ich ein unscharfes Logo verbessern?</summary><p className="mt-2 text-sm text-anthracite/70">Ja, wir erstellen eine saubere Version.</p></details>
          <details className="border-b py-3"><summary className="cursor-pointer font-medium">Ist die Datei für Druck geeignet?</summary><p className="mt-2 text-sm text-anthracite/70">Ja, SVG und PNG sind für die meisten Druckverfahren nutzbar.</p></details>
          <details className="border-b py-3"><summary className="cursor-pointer font-medium">Was ist nicht enthalten?</summary><p className="mt-2 text-sm text-anthracite/70">Keine Markenrecherche, keine rechtliche Prüfung, keine komplexen Illustrationen.</p></details>
        </div>

        <div className="mt-12 text-center">
          <a href="/kontakt" className="inline-flex rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Logo jetzt vektorisieren lassen</a>
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
              {
                "@type": "Question",
                name: "Bekomme ich eine SVG-Datei?",
                acceptedAnswer: { "@type": "Answer", text: "Ja, die Vektorisierung liefert ein skalierbares SVG." }
              },
              {
                "@type": "Question",
                name: "Kann ich ein unscharfes Logo verbessern?",
                acceptedAnswer: { "@type": "Answer", text: "Ja, wir erstellen eine saubere Version." }
              },
              {
                "@type": "Question",
                name: "Ist die Datei für Druck geeignet?",
                acceptedAnswer: { "@type": "Answer", text: "Ja, SVG und PNG sind für die meisten Druckverfahren nutzbar." }
              },
              {
                "@type": "Question",
                name: "Was ist nicht enthalten?",
                acceptedAnswer: { "@type": "Answer", text: "Keine Markenrecherche, keine rechtliche Prüfung, keine komplexen Illustrationen." }
              }
            ]
          }).replace(/</g, "\\u003c")
        }}
      />
    </>
  );
}
