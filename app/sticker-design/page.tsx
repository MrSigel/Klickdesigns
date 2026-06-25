import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductFulfillmentSection from '../components/ProductFulfillmentSection';
import SeoAnswerSection from '../components/SeoAnswerSection';

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

        <SeoAnswerSection
          className="mt-10"
          title="Typische Einsatzbereiche"
          items={[
            { question: "Wofür sind Sticker-Designs geeignet?", answer: "Für Marken, Vereine, Events, Verpackungen, Creator, Fahrzeuge und einfache Produktkennzeichnung." },
            { question: "Welche Dateien sind sinnvoll?", answer: "Je nach Anwendung eignen sich SVG, PNG oder PDF mit klaren Konturen und sauberem Hintergrund." },
            { question: "Kann ein bestehendes Logo genutzt werden?", answer: "Ja, vorhandene Logos oder Motive können geprüft und für Sticker vorbereitet werden." },
            { question: "Gibt es eine direkte Bestellung?", answer: "Nein, Produktumsetzung und Druck erfolgen nur auf Anfrage nach Abstimmung." },
          ]}
          links={[
            { href: "/logo-vektorisieren", label: "Logo vektorisieren" },
            { href: "/loesungen/vektorgrafik-fuer-textildruck", label: "Vektorgrafik" },
            { href: "/versand-lieferung", label: "Versand & Lieferung" },
          ]}
        />

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

        <div className="mt-10 text-center">
          <p className="mb-3 text-sm text-anthracite/70">Klickdesigns gestaltet Sticker-Dateien und unterstützt bei der Umsetzung auf Anfrage.</p>
          <a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Sticker-Design anfragen</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
