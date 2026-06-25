import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFulfillmentSection from '../components/ProductFulfillmentSection';

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

        <ProductFulfillmentSection className="mt-12" />

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Flyer-Design anfragen</a></div>
      </main>
      <Footer />
    </>
  );
}
