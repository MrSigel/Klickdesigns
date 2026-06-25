import Header from '../components/Header';
import Footer from '../components/Footer';
import SeoAnswerSection from '../components/SeoAnswerSection';

export const metadata = {
  title: 'Grafikdesign für Vereine – Logo, Sticker, Flyer und Eventgrafiken | Klickdesigns',
  description: 'Klickdesigns unterstützt Vereine, Teams und Gruppen mit Logo-Aufbereitung, Flyer, Sticker, Kleidungsgrafiken und Social-Media-Designs.',
  openGraph: {
    title: 'Grafikdesign für Vereine | Klickdesigns',
    description: 'Grafiklösungen für Vereine und Events.',
  },
};

export default function GrafikdesignFuerVereinePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Grafikdesign für Vereine</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Vereinslogo aufbereiten, Flyer, Sticker, Eventgrafiken und Social-Media-Designs für Gruppen und Teams.</p>

        <SeoAnswerSection
          className="mt-10"
          title="Grafikdesign für Vereine"
          items={[
            { question: "Was kann umgesetzt werden?", answer: "Logo-Aufbereitung, Flyer, Sticker, Eventgrafiken, Social-Media-Designs und Druckdaten für Vereine und Teams." },
            { question: "Welche Dateien sind wichtig?", answer: "Für Vereinslogos sind SVG, PNG und PDF je nach Einsatzbereich sinnvoll." },
            { question: "Typische Einsatzbereiche", answer: "Website, Social Media, Kleidung, Sticker, Banner, Flyer und Vereinskommunikation." },
            { question: "Produktumsetzung", answer: "Kleidung, Sticker oder Druckprodukte sind auf Anfrage möglich und werden individuell geprüft." },
          ]}
          links={[
            { href: "/loesungen/logo-vektorisieren-fuer-vereine", label: "Vereinslogo vektorisieren" },
            { href: "/vorlagen/fussball-logo-vorlage-kostenlos-svg", label: "Fußball-Vorlage" },
            { href: "/kontakt", label: "Kontakt" },
          ]}
        />

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Vereinsprojekt starten</a></div>
      </main>
      <Footer />
    </>
  );
}
