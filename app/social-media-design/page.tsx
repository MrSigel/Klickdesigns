import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Social-Media-Design – Posts, Storys und Vorlagen für Instagram, Facebook & TikTok | Klickdesigns',
  description: 'Klickdesigns erstellt und optimiert Social-Media-Grafiken und Vorlagen für Creator, Streamer und Unternehmen. Einheitliche Markenwirkung auf allen Kanälen.',
  openGraph: {
    title: 'Social-Media-Design | Klickdesigns',
    description: 'Professionelle Designs für Social Media – Posts, Storys, Vorlagen.',
  },
};

export default function SocialMediaDesignPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <h1 className="font-display text-[2.8rem] font-bold tracking-[-0.04em] text-anthracite">Social-Media-Design</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-anthracite/70">Designs und Vorlagen für Instagram, Facebook und TikTok. Für bessere Wiedererkennung und professionelle Auftritte.</p>

        <div className="mt-10 text-center">
          <p className="mb-3 text-sm text-anthracite/70">Social-Media-Grafiken gestalten und für Merch oder Print auf Anfrage vorbereiten.</p>
          <a href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">Social-Media-Design anfragen</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
