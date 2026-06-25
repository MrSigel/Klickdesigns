import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFulfillmentSection from '../components/ProductFulfillmentSection';
import SeoAnswerSection from '../components/SeoAnswerSection';
import { deliveryTimes, SITE_URL } from '../site-config';
import { breadcrumbSchema, jsonLd, serviceSchema } from '@/lib/seo/schema';

export const metadata = {
  title: 'Logo vektorisieren lassen – SVG & PNG für Druck, Web und Sticker | Klickdesigns',
  description: 'Klickdesigns bereitet bestehende Logos aus PNG, JPG oder Screenshots als saubere SVG- und PNG-Dateien auf – ideal für Website, Druck, Kleidung, Sticker und Social Media.',
  alternates: {
    canonical: `${SITE_URL}/logo-vektorisieren`,
  },
  openGraph: {
    title: 'Logo vektorisieren lassen – SVG & PNG | Klickdesigns',
    description: 'Bestehende Logos professionell als nutzbare Dateien aufbereiten. SVG, PNG transparent, druckfertig.',
    url: `${SITE_URL}/logo-vektorisieren`,
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

        <SeoAnswerSection
          className="mt-10"
          items={[
            {
              question: "Was ist Logo-Vektorisierung?",
              answer: "Eine Logo-Vektorisierung wandelt ein bestehendes Logo aus PNG, JPG, PDF oder Screenshot in eine saubere Vektordatei um.",
            },
            {
              question: "Für wen ist diese Leistung geeignet?",
              answer: "Geeignet für Unternehmen, Vereine, Creator und Privatkunden, die ein vorhandenes Logo für Web, Druck, Kleidung, Sticker oder Fahrzeuge nutzen möchten.",
            },
            {
              question: "Welche Dateien werden benötigt?",
              answer: "Hilfreich sind PNG, JPG, PDF, SVG oder ein gut erkennbarer Screenshot des vorhandenen Logos.",
            },
            {
              question: "Welche Dateien können am Ende genutzt werden?",
              answer: "Am Ende können je nach Ausgangsdatei SVG und PNG mit transparentem Hintergrund bereitgestellt werden, weitere Formate nach Vereinbarung.",
            },
          ]}
          links={[
            { href: "/loesungen/logo-vektorisieren-fuer-vereine", label: "Für Vereine" },
            { href: "/loesungen/vektorgrafik-fuer-textildruck", label: "Für Textildruck" },
            { href: "/versand-lieferung", label: "Versand & Lieferung" },
          ]}
        />

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

        <ProductFulfillmentSection className="mt-12" />

        <div className="mt-12 rounded-xl border border-anthracite/10 bg-white p-6">
          <h2 className="text-xl font-semibold text-anthracite">Passende Lösungen</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a href="/loesungen/logo-vektorisieren-fuer-vereine" className="rounded-lg border border-anthracite/10 bg-offwhite/70 p-4 text-sm font-semibold text-ruby hover:border-ruby/30">
              Logo vektorisieren für Vereine
            </a>
            <a href="/loesungen/vektorgrafik-fuer-textildruck" className="rounded-lg border border-anthracite/10 bg-offwhite/70 p-4 text-sm font-semibold text-ruby hover:border-ruby/30">
              Vektorgrafik für Textildruck
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-anthracite/70">Auf Anfrage kann das vektorisierte Logo für T-Shirts, Pullover, Sticker oder Autoaufkleber vorbereitet und umgesetzt werden.</p>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema("Logo vektorisieren lassen", metadata.description, `${SITE_URL}/logo-vektorisieren`)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: "Startseite", url: SITE_URL }, { name: "Logo vektorisieren", url: `${SITE_URL}/logo-vektorisieren` }])) }} />
    </>
  );
}
