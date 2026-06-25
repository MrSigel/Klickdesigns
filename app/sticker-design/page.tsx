import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFulfillmentSection from '../components/ProductFulfillmentSection';

export const metadata = {
  title: 'Sticker-Design – Motive und Dateien für Sticker, Events und Marken | Klickdesigns',
  description: 'Klickdesigns erstellt und bereitet Sticker-Designs und Motive auf – klare Konturen, druckfähige Dateien für Web, Events, Kleidung und Fahrzeuge.',
  openGraph: {
    title: 'Sticker-Design | Klickdesigns',
    description: 'Professionelle Sticker-Motive und Dateivorbereitung.',
  },
};

export default function StickerDesignPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Sticker-Design</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Sticker für Marken, Events, Creator, Vereine oder Shops. Wir liefern klare, druckfähige Dateien.</p>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Was wir liefern</h2>
          <ul className="mt-3 space-y-1 text-sm text-anthracite/70">
            <li>• Klare Motive mit guten Konturen</li>
            <li>• PNG, SVG oder PDF nach Bedarf</li>
            <li>• Geeignet für Vinyl, Textil, Events</li>
            <li>• Logo- oder Motiv-Aufbereitung</li>
          </ul>
        </div>

        <ProductFulfillmentSection className="mt-12" />

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Sticker-Design anfragen</a></div>
      </main>
      <Footer />
    </>
  );
}
