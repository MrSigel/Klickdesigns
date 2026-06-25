import Header from '../components/Header';
import Footer from '../components/Footer';
import SeoAnswerSection from '../components/SeoAnswerSection';

export const metadata = {
  title: 'Grafikdesign für Creator – Profilgrafiken, Banner, Sticker und Social-Media-Vorlagen | Klickdesigns',
  description: 'Klickdesigns unterstützt Creator, Streamer und Content Creators mit Avatar-, Banner- und Social-Media-Designs für starke Markenwirkung.',
  openGraph: {
    title: 'Grafikdesign für Creator | Klickdesigns',
    description: 'Designs für Creator und Social Media.',
  },
};

export default function GrafikdesignFuerCreatorPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Grafikdesign für Creator</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Profilgrafiken, Banner, Sticker und Social-Media-Vorlagen für Creator, Streamer und Gaming.</p>

        <SeoAnswerSection
          className="mt-10"
          title="Grafikdesign für Creator"
          items={[
            { question: "Was bietet Klickdesigns für Creator?", answer: "Profilgrafiken, Banner, Sticker-Motive, Social-Media-Vorlagen und Aufbereitung bestehender Designs." },
            { question: "Für wen geeignet?", answer: "Für Creator, Streamer, Content-Projekte und Social-Media-Auftritte mit klarer visueller Linie." },
            { question: "Welche Einsatzbereiche?", answer: "Profile, Posts, Storys, Banner, Sticker, Kleidung, Web und einfache Printmedien." },
            { question: "Wie läuft die Anfrage ab?", answer: "Projekt kurz beschreiben, vorhandene Dateien mitsenden und gewünschte Formate oder Einsatzbereiche nennen." },
          ]}
          links={[
            { href: "/social-media-design", label: "Social-Media-Design" },
            { href: "/sticker-design", label: "Sticker-Design" },
            { href: "/kontakt", label: "Kontakt" },
          ]}
        />

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Creator-Design anfragen</a></div>
      </main>
      <Footer />
    </>
  );
}
