import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFulfillmentSection from '../components/ProductFulfillmentSection';
import SeoAnswerSection from '../components/SeoAnswerSection';
import { deliveryTimes, SITE_URL } from '../site-config';
import { breadcrumbSchema, jsonLd, serviceSchema } from '@/lib/seo/schema';

export const metadata = {
  title: 'Design-Finalisierung – bestehende Entwürfe, Flyer & Social-Media-Grafiken optimieren | Klickdesigns',
  description: 'Klickdesigns finalisiert und optimiert bestehende Flyer, Canva-Designs und Social-Media-Grafiken. Layout, Farben, Typografie und Lesbarkeit für Print und Web.',
  alternates: {
    canonical: `${SITE_URL}/design-finalisierung`,
  },
  openGraph: {
    title: 'Design-Finalisierung ab 149 € | Klickdesigns',
    description: 'Bestehende Designs professionell aufbereiten – für Druck und Social Media.',
  },
};

export default function DesignFinalisierungPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Design-Finalisierung</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Sie haben bereits einen Entwurf, ein Canva-Design oder einen Flyer? Wir verbessern Layout, Farben, Typografie und bereiten druck- oder webfertige Dateien vor.</p>

        <SeoAnswerSection
          className="mt-10"
          items={[
            { question: "Was bedeutet Design-Finalisierung?", answer: "Bei der Design-Finalisierung wird ein vorhandener Entwurf professionell überarbeitet, vereinheitlicht und für die spätere Nutzung vorbereitet." },
            { question: "Kann ein Canva-Entwurf überarbeitet werden?", answer: "Ja, Canva-Designs, Flyer, Social-Media-Grafiken und andere Entwürfe können verbessert und exportfertig vorbereitet werden." },
            { question: "Für welche Medien kann ein Design vorbereitet werden?", answer: "Möglich sind Web, Druck, Social Media, Flyer, Sticker, Kleidung und weitere Werbemittel nach Vereinbarung." },
            { question: "Wie läuft die Anfrage ab?", answer: "Sie senden den vorhandenen Entwurf, beschreiben den Zweck und erhalten eine saubere Finalisierung mit vereinbartem Export." },
          ]}
          links={[
            { href: "/flyer-design", label: "Flyer-Design" },
            { href: "/social-media-design", label: "Social Media" },
            { href: "/versand-lieferung", label: "Produktumsetzung" },
          ]}
        />

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Was wir optimieren</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-anthracite/70">
            <li>• Layout und Struktur</li>
            <li>• Farbharmonie und Kontraste</li>
            <li>• Typografie und Lesbarkeit</li>
            <li>• CTA-Positionierung</li>
            <li>• Dateiformate für Print und Social</li>
          </ul>
        </div>

        <div className="mt-10 rounded-xl border p-6">
          <p className="font-semibold">Preis: Design-Finalisierung ab 149 €</p>
          <p className="text-sm mt-1">Inklusive 1 Korrekturrunde. Export als PNG, JPG oder PDF nach Vereinbarung.</p>
          <p className="mt-1 text-xs text-anthracite/60">Lieferzeit ca. {deliveryTimes.designFinalisierung} • In der Regel innerhalb weniger Werktage je nach Umfang.</p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Häufige Fragen</h2>
          <details className="border-b py-3"><summary>Kann ich ein Canva-Design einsenden?</summary><p className="mt-1 text-sm">Ja, wir arbeiten mit Canva-Designs und anderen Entwürfen.</p></details>
          <details className="border-b py-3"><summary>Bekomme ich druckfertige PDF?</summary><p className="mt-1 text-sm">Ja, je nach Projekt als PDF für Druck oder für Social Media.</p></details>
          <details className="border-b py-3"><summary>Wie viele Korrekturen gibt es?</summary><p className="mt-1 text-sm">Eine Korrekturrunde ist im Preis enthalten.</p></details>
        </div>

        <ProductFulfillmentSection className="mt-12" />

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Design finalisieren lassen</a></div>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Kann ich ein Canva-Design einsenden?", acceptedAnswer: { "@type": "Answer", text: "Ja, wir arbeiten mit Canva-Designs und anderen Entwürfen." } },
              { "@type": "Question", name: "Bekomme ich druckfertige PDF?", acceptedAnswer: { "@type": "Answer", text: "Ja, je nach Projekt als PDF für Druck oder für Social Media." } },
              { "@type": "Question", name: "Wie viele Korrekturen gibt es?", acceptedAnswer: { "@type": "Answer", text: "Eine Korrekturrunde ist im Preis enthalten." } }
            ]
          }).replace(/</g, "\\u003c")
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema("Design-Finalisierung", metadata.description, `${SITE_URL}/design-finalisierung`)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: "Startseite", url: SITE_URL }, { name: "Design-Finalisierung", url: `${SITE_URL}/design-finalisierung` }])) }} />
    </>
  );
}
