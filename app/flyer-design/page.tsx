import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFulfillmentSection from '../components/ProductFulfillmentSection';
import SeoAnswerSection from '../components/SeoAnswerSection';

export const metadata = {
  title: 'Flyer-Design – Layouts finalisieren und für Druck vorbereiten | Klickdesigns',
  description: 'Klickdesigns verbessert und finalisiert Flyer und Printdesigns. Lesbarkeit, Farben und Struktur für professionelle Druckergebnisse.',
  openGraph: {
    title: 'Flyer-Design | Klickdesigns',
    description: 'Bestehende Flyer optimieren oder neue gestalten – druckfertig.',
  },
};

export default function FlyerDesignPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Flyer-Design</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Wir finalisieren und optimieren Flyer und einfache Printdesigns – für bessere Lesbarkeit und professionelle Ergebnisse.</p>

        <SeoAnswerSection
          className="mt-10"
          title="Zusammenfassung"
          items={[
            { question: "Was wird optimiert?", answer: "Layout, Lesbarkeit, Farben, Typografie und Dateiausgabe werden für den geplanten Einsatz vorbereitet." },
            { question: "Für wen geeignet?", answer: "Geeignet für Unternehmen, Vereine, Selbstständige und lokale Projekte mit Flyern oder einfachen Printdesigns." },
            { question: "Typische Einsatzbereiche", answer: "Flyer, Handzettel, Aktionen, Events, Angebote, lokale Werbung und begleitende Social-Media-Grafiken." },
            { question: "Produktumsetzung", answer: "Druck und Lieferung sind auf Anfrage möglich und erfolgen nicht als direkter Online-Shop." },
          ]}
          links={[
            { href: "/design-finalisierung", label: "Design-Finalisierung" },
            { href: "/versand-lieferung", label: "Versand & Lieferung" },
            { href: "/kontakt", label: "Kontakt" },
          ]}
        />

        <ProductFulfillmentSection className="mt-12" />

        <div className="mt-10 text-center">
          <p className="mb-3 text-sm text-anthracite/70">Flyer gestalten und für Druck auf Anfrage vorbereiten, inkl. Produktumsetzung.</p>
          <a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Flyer-Design anfragen</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
