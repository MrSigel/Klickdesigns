import Header from '../components/Header';
import Footer from '../components/Footer';

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

        <div className="mt-10 text-center"><a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Creator-Design anfragen</a></div>
      </main>
      <Footer />
    </>
  );
}
