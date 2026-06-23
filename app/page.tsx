"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense, type ReactNode, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { submitInquiry } from "./actions/submit-inquiry";
import { createClient } from "@/lib/supabase/client";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: "Klickdesigns",
  description: "Mediengestaltung und Grafikdesign",
  url: "https://www.klickdesigns.de",
  founder: {
    "@type": "Person",
    name: "Enrico Gross",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gerther Straße 76",
    postalCode: "44577",
    addressLocality: "Castrop-Rauxel",
    addressRegion: "Nordrhein-Westfalen",
    addressCountry: "DE",
  },
  telephone: "+49 155 63535989",
  areaServed: [
    {
      "@type": "City",
      name: "Castrop-Rauxel",
    },
    {
      "@type": "Country",
      name: "Deutschland",
    },
  ],
  serviceType: [
    "Mediengestaltung",
    "Grafikdesign",
    "Logo-Vektorisierung",
    "Design-Finalisierung",
  ],
};

/* ----------------------------------------------------------------------- */
/*  Icons (small inline SVGs – no icon library required)                   */
/* ----------------------------------------------------------------------- */

function IconMenu({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMinus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ----------------------------------------------------------------------- */
/*  Shared small components                                                */
/* ----------------------------------------------------------------------- */

function FormatBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[4px] border border-anthracite/15 bg-white/90 px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-anthracite/70 shadow-[0_1px_0_rgba(31,27,27,0.05)]">
      {children}
    </span>
  );
}

/** The recurring "selection / design-handle" frame used throughout the page. */
function HandleFrame({
  children,
  className = "",
  active = true,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div className={`handle-frame ${className}`}>
      {children}
      {active && (
        <>
          <span className="handle-tl" aria-hidden="true" />
          <span className="handle-tr" aria-hidden="true" />
          <span className="handle-bl" aria-hidden="true" />
          <span className="handle-br" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-ruby/15 bg-ruby/[0.04] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ruby">
      <span className="h-1.5 w-1.5 rounded-full bg-ruby shadow-[0_0_0_3px_rgba(153,0,0,0.09)]" />
      {children}
    </span>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Content data                                                           */
/* ----------------------------------------------------------------------- */


const audienceChips = [
  "Kleine Unternehmen",
  "Freelancer",
  "Vereine",
  "Creator",
  "Lokale Dienstleister",
  "Shops",
  "Gaming & Social Media",
  "Events",
];

const problemPoints = [
  "Unscharfe Logos",
  "Kein SVG",
  "Kein transparenter Hintergrund",
  "Uneinheitliche Farben",
  "Schlechte Lesbarkeit",
  "Nicht druckbereit",
  "Unruhiges Layout",
];

const solutionPoints = [
  "Saubere Aufbereitung",
  "Klare Dateiformate",
  "Moderne Optik",
  "Nutzbar für Web, Druck, Social Media, Sticker und Kleidung",
];

const logoSprintIncluded = [
  "4–5 Logo-Richtungen als Vorschau",
  "Auswahl eines Favoriten",
  "Einfache Farb- oder Namensanpassung",
  "SVG-Datei",
  "PNG mit transparentem Hintergrund",
  "1 kleine Korrektur inklusive",
];

const logoSprintExcluded = [
  "Komplette Markenentwicklung",
  "Komplexe Illustrationen",
  "Markenrecherche",
  "Rechtliche Prüfung",
  "Unbegrenzte Änderungen",
  "Aufwendige Sonderwünsche",
];

type Pkg = {
  name: string;
  price: string;
  description: string;
  included: string[];
  excluded?: string[];
  highlighted?: boolean;
};

const packages: Pkg[] = [
  {
    name: "Logo-Vektorisierung",
    price: "ab 49 €",
    description:
      "Du hast dein Logo nur als PNG, JPG oder Screenshot? Wir bereiten dein bestehendes Logo als nutzbare Datei auf – ideal für Website, Sticker, Kleidung, Druck und Social Media.",
    included: [
      "SVG-Datei",
      "PNG mit transparentem Hintergrund",
      "Einfache Aufbereitung des bestehenden Logos",
      "1 Korrekturrunde",
      "Geeignet für einfache, gut erkennbare Logos",
    ],
    excluded: [
      "Komplette Logo-Neugestaltung",
      "Komplexe Illustrationen",
      "Aufwendige Nachzeichnungen",
      "Mehrere neue Logo-Varianten",
      "Markenentwicklung",
    ],
  },
  {
    name: "Design-Finalisierung",
    price: "ab 149 €",
    description:
      "Für bestehende Flyer, Canva-Designs, Social-Media-Grafiken oder Designentwürfe, die professioneller, klarer und nutzbarer werden sollen.",
    included: [
      "Verbesserung von Layout, Farben und Lesbarkeit",
      "Saubere Typografie und Abstände",
      "Export für Print oder Social Media",
      "PNG, JPG oder PDF nach Vereinbarung",
      "1 Korrekturrunde",
    ],
    highlighted: true,
  },
  {
    name: "Business-Auftritt",
    price: "ab 299 €",
    description:
      "Für Unternehmen, die mehrere Designs in einem einheitlichen Look benötigen.",
    included: [
      "Bis zu 3 abgestimmte Designs oder Vorlagen",
      "Einheitliche Farben und Typografie",
      "Logo-Dateien prüfen/aufbereiten",
      "Social-, Print- oder Business-Grafiken",
      "Ausgabe als PNG, JPG, PDF und ggf. SVG",
    ],
  },
];

type CompareCard = {
  title: string;
  before: string[];
  after: string[];
  badges: string[];
};

const compareCards: CompareCard[] = [
  {
    title: "Flyer",
    before: [
      "Unruhige Abstände",
      "Zu viele Schriftgrößen",
      "Keine klare Blickführung",
      "Nicht druckbereit",
    ],
    after: [
      "Klare Struktur",
      "Bessere Lesbarkeit",
      "Saubere Farben",
      "Druckfertige PDF",
    ],
    badges: ["PDF", "Print", "Lesbarkeit"],
  },
  {
    title: "Logo",
    before: [
      "Gute Idee, aber unsauber",
      "Schwer lesbar in klein",
      "Keine klare Hell-/Dunkel-Variante",
      "Nicht vielseitig nutzbar",
    ],
    after: [
      "Saubere Form",
      "Klare Icon-Version",
      "Hell/Dunkel nutzbar",
      "Geeignet für Website, Social, Print",
    ],
    badges: ["SVG", "PNG", "Hell/Dunkel"],
  },
  {
    title: "Social-Media-Post",
    before: [
      "Wirkt beliebig",
      "Keine Markenwirkung",
      "Text schwer erfassbar",
      "Nicht wiederverwendbar",
    ],
    after: [
      "Markentaugliche Vorlage",
      "Klare Headline",
      "Bessere Kontraste",
      "Als Template nutzbar",
    ],
    badges: ["Template", "Story", "Feed"],
  },
];

const templateCategories = [
  "Gaming",
  "Pixel",
  "E-Sport",
  "Fantasy",
  "Minimal",
  "Business",
  "Streetwear",
  "Creator",
];

const processSteps = [
  {
    number: "01",
    title: "Entwurf oder Wunsch senden",
    description: "Du schickst deinen bestehenden Entwurf oder beschreibst, was du brauchst.",
  },
  {
    number: "02",
    title: "Kurz prüfen lassen",
    description: "Wir sichten dein Material und klären offene Fragen zu Format und Verwendung.",
  },
  {
    number: "03",
    title: "Design finalisieren",
    description: "Layout, Farben und Dateiformate werden professionell aufbereitet.",
  },
  {
    number: "04",
    title: "Fertige Dateien erhalten",
    description: "Du erhältst nutzbare Dateien für Web, Druck, Sticker, Kleidung oder Social Media.",
  },
];

const qualityPromises = [
  "Klare Preise",
  "Transparente Pakete",
  "Nutzbare Dateiformate",
  "Geeignet für Web, Druck, Sticker, Kleidung und Social Media",
  "Keine versteckten Abo-Kosten",
  "Saubere Korrekturrunden",
  "Strukturierter Ablauf",
];

const faqItems = [
  {
    question: "Was ist der Logo-Sprint?",
    answer:
      "Der Logo-Sprint ist ein fester 20-€-Einstieg: Du erhältst 4–5 Logo-Richtungen als Vorschau, wählst deinen Favoriten und wir finalisieren ihn als nutzbare Datei.",
  },
  {
    question: "Was bedeutet Logo-Vektorisierung?",
    answer:
      "Dein bestehendes Logo – z. B. als PNG, JPG oder Screenshot – wird als saubere, skalierbare Datei aufbereitet, ohne das Design grundlegend neu zu gestalten.",
  },
  {
    question: "Bekomme ich SVG und PNG?",
    answer:
      "Ja. Je nach Paket erhältst du eine SVG-Datei sowie PNG mit transparentem Hintergrund, bei Bedarf ergänzt um PDF, JPG oder weitere Formate.",
  },
  {
    question: "Kann ich mein bestehendes Logo einsenden?",
    answer:
      "Ja, das ist sogar der Regelfall bei der Logo-Vektorisierung. Du schickst uns dein vorhandenes Logo, wir bereiten es als nutzbare Datei auf.",
  },
  {
    question: "Sind die Dateien für Kleidung oder Sticker geeignet?",
    answer:
      "Ja. Die finalisierten Dateien werden so aufbereitet, dass sie sich für Web, Druck, Sticker, Kleidung und Social Media nutzen lassen.",
  },
  {
    question: "Wie viele Korrekturen sind enthalten?",
    answer:
      "Das hängt vom Paket ab. Der Logo-Sprint und die Logo-Vektorisierung enthalten jeweils eine Korrekturrunde, Details findest du in der jeweiligen Paketbeschreibung.",
  },
  {
    question: "Gibt es eine rechtliche Markenprüfung?",
    answer:
      "Nein, eine rechtliche Prüfung auf Markenrechte ist nicht enthalten. Wir empfehlen, dies bei Bedarf separat prüfen zu lassen.",
  },
  {
    question: "Kann ich kostenlose Logos später anpassen lassen?",
    answer:
      "Ja. Eine kostenlose Logo-Vorlage kann jederzeit angepasst, finalisiert oder als nutzbare Datei aufbereitet werden.",
  },
  {
    question: "Was ist nicht im 20-€-Logo-Sprint enthalten?",
    answer:
      "Komplette Markenentwicklung, komplexe Illustrationen, Markenrecherche, rechtliche Prüfung, unbegrenzte Änderungen und aufwendige Sonderwünsche sind nicht enthalten.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const serviceOptions = [
  "Logo-Sprint",
  "Logo-Vektorisierung",
  "Design-Finalisierung",
  "Business-Auftritt",
  "Sonstiges",
];

const haveOptions = [
  "Logo",
  "PNG/JPG",
  "Screenshot",
  "Flyer",
  "Social-Media-Design",
  "Noch nichts",
];



/* ----------------------------------------------------------------------- */
/*  Hero                                                                    */
/* ----------------------------------------------------------------------- */

function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [6, -6]);
  const rotateY = useTransform(x, [0, 1], [-6, 6]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="hero-canvas relative mx-auto w-full max-w-[34rem] [perspective:1400px]"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.012 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="handle-frame relative z-10 rounded-xl border border-anthracite/15 bg-white/95 p-5 shadow-[0_42px_90px_-38px_rgba(31,27,27,0.48),0_18px_36px_-24px_rgba(153,0,0,0.28)] backdrop-blur sm:p-7"
      >
        <span className="handle-tl" />
        <span className="handle-tr" />
        <span className="handle-bl" />
        <span className="handle-br" />

        <div className="mb-5 flex items-center justify-between border-b border-dashed border-anthracite/15 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-wide text-anthracite/45">
            Entwurf.layer
          </span>
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sand" />
            <span className="h-2 w-2 rounded-full bg-ruby" />
            <span className="h-2 w-2 rounded-full bg-anthracite/20" />
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-md border border-transparent bg-offwhite px-4 py-3.5">
            <span className="font-mono text-[10px] text-anthracite/40">01</span>
            <span className="text-[13px] text-anthracite/60">Dein Entwurf</span>
            <span className="ml-auto h-1.5 w-10 rounded-full bg-anthracite/15" />
          </div>
          <div className="flex items-center gap-3 rounded-md border border-sand/70 bg-sand/25 px-4 py-3.5">
            <span className="font-mono text-[10px] text-anthracite/40">02</span>
            <span className="text-[13px] font-semibold text-anthracite">
              Professioneller Feinschliff
            </span>
            <span className="ml-auto h-1.5 w-10 rounded-full bg-ruby/50" />
          </div>
          <div className="flex items-center gap-3 rounded-md border border-ruby/25 bg-ruby/[0.055] px-4 py-3.5 shadow-[inset_3px_0_0_#990000]">
            <span className="font-mono text-[10px] text-anthracite/40">03</span>
            <span className="text-[13px] font-semibold text-anthracite">Fertige Dateien</span>
            <span className="ml-auto h-1.5 w-10 rounded-full bg-ruby" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-dashed border-anthracite/15 pt-5">
          {["SVG", "PNG", "PDF", "Print", "Social"].map((b) => (
            <FormatBadge key={b}>{b}</FormatBadge>
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-3 -top-5 z-20 hidden rotate-2 rounded-md border border-anthracite/15 bg-anthracite px-4 py-2 shadow-lg sm:block"
      >
        <span className="font-mono text-[10px] uppercase tracking-wide text-offwhite">
          finalisiert
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-7 -left-4 z-20 hidden rounded-lg border border-anthracite/10 bg-white px-4 py-3 shadow-[0_18px_40px_-20px_rgba(31,27,27,0.5)] sm:block"
      >
        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-anthracite/40">Ausgabe</span>
        <span className="mt-1 block text-[12px] font-semibold text-anthracite">Web + Print</span>
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="hero-premium dot-grid-bg relative overflow-hidden border-b border-anthracite/10 px-5 pb-24 pt-20 sm:px-8 sm:pb-36 sm:pt-28 lg:min-h-[760px] lg:py-32">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <Reveal>
          <Eyebrow>Mediengestaltung &amp; Grafikdesign</Eyebrow>
          <h1 className="mt-7 max-w-3xl text-balance font-display text-[3.35rem] font-bold leading-[0.99] tracking-[-0.055em] text-anthracite sm:text-[4.6rem] lg:text-[5.25rem] xl:text-[5.7rem]">
            Aus deinem Entwurf wird ein professioneller Markenauftritt.
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-[1.75] text-anthracite/68 sm:text-[19px]">
            Klickdesigns finalisiert Logos, Flyer, Social-Media-Grafiken und
            bestehende Designentwürfe für Web, Druck, Sticker, Kleidung und
            Social Media.
          </p>
          <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#kontakt"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-ruby px-8 py-4 text-[16px] font-semibold text-offwhite shadow-[0_14px_28px_-14px_rgba(153,0,0,0.72)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_36px_-16px_rgba(153,0,0,0.75)]"
            >
              Design anfragen
              <IconArrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#pakete"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-anthracite/20 bg-white/80 px-8 py-4 text-[16px] font-semibold text-anthracite shadow-[0_10px_24px_-18px_rgba(31,27,27,0.5)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-ruby/50 hover:bg-white hover:shadow-lg"
            >
              Angebote ansehen
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <HeroCanvas />
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Audience strip                                                         */
/* ----------------------------------------------------------------------- */

function AudienceStrip() {
  return (
    <section className="border-b border-anthracite/10 bg-anthracite px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {audienceChips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-offwhite/15 bg-offwhite/[0.035] px-4 py-2 text-[13px] font-medium text-offwhite/80"
          >
            {chip}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Problem / Solution                                                      */
/* ----------------------------------------------------------------------- */

function ProblemSolution() {
  return (
    <section id="leistungen" className="border-b border-anthracite/10 px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Leistungen</Eyebrow>
          <h2 className="mt-6 text-balance font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] text-anthracite sm:text-[3.2rem]">
            Viele Designs sehen zuerst okay aus, sind aber nicht sauber nutzbar.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="premium-card h-full rounded-xl border border-anthracite/12 bg-white p-7 sm:p-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-anthracite/45">
                Problem
              </span>
              <ul className="mt-6 space-y-4">
                {problemPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[16px] leading-relaxed text-anthracite/72">
                    <IconMinus className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-anthracite/35" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="premium-card h-full rounded-xl border border-ruby/25 bg-ruby p-7 text-offwhite shadow-[0_24px_50px_-30px_rgba(153,0,0,0.8)] sm:p-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sand">
                Lösung
              </span>
              <ul className="mt-6 space-y-4">
                {solutionPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[16px] leading-relaxed text-offwhite/90">
                    <IconCheck className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-sand" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Logo-Sprint                                                            */
/* ----------------------------------------------------------------------- */

function LogoSprint() {
  return (
    <section id="logo-sprint" className="border-b border-anthracite/10 bg-white px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <Reveal>
          <Eyebrow>Schneller Einstieg</Eyebrow>
          <h2 className="mt-6 font-display text-[2.4rem] font-bold leading-[1.05] tracking-[-0.04em] text-anthracite sm:text-[3.35rem]">
            Logo-Sprint
          </h2>
          <p className="mt-6 text-[16px] leading-[1.75] text-anthracite/70 sm:text-[17px]">
            Du möchtest schnell mehrere Logo-Richtungen sehen? Beim
            Logo-Sprint erhältst du 4–5 Logo-Richtungen als Vorschau. Deinen
            Favoriten finalisieren wir anschließend einfach und nutzbar für
            Web, Social Media, Sticker, Kleidung oder Druck.
          </p>
          <div className="mt-8 flex items-baseline gap-2 border-l-2 border-ruby pl-4">
            <span className="font-display text-5xl font-bold tracking-[-0.04em] text-anthracite">20 €</span>
            <span className="text-[14px] text-anthracite/55">fix</span>
          </div>
          <a
            href="#kontakt"
            className="group mt-8 inline-flex items-center gap-3 rounded-md bg-anthracite px-7 py-4 text-[15px] font-semibold text-offwhite shadow-[0_14px_24px_-16px_rgba(31,27,27,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Logo-Sprint anfragen
            <IconArrow className="h-4 w-4" />
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="premium-card rounded-xl border border-ruby/18 bg-offwhite p-6 sm:p-8">
              <span className="font-mono text-[11px] uppercase tracking-wide text-ruby">
                Enthalten
              </span>
              <ul className="mt-5 space-y-3.5">
                {logoSprintIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-anthracite/75">
                    <IconCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-ruby" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="premium-card rounded-xl border border-anthracite/12 bg-offwhite p-6 sm:p-8">
              <span className="font-mono text-[11px] uppercase tracking-wide text-anthracite/45">
                Nicht enthalten
              </span>
              <ul className="mt-5 space-y-3.5">
                {logoSprintExcluded.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-anthracite/55">
                    <IconMinus className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-anthracite/35" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Pakete                                                                 */
/* ----------------------------------------------------------------------- */

function Packages() {
  return (
    <section id="pakete" className="border-b border-anthracite/10 px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <Eyebrow>Pakete</Eyebrow>
          <h2 className="mt-6 font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] text-anthracite sm:text-[3.2rem]">
            Transparente Pakete für jede Ausgangslage
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 0.07}>
              <div
                className={`relative flex h-full flex-col rounded-xl p-7 transition-all duration-300 sm:p-9 ${
                  pkg.highlighted
                    ? "handle-frame border-2 border-ruby bg-gradient-to-br from-anthracite via-anthracite to-[#2a2020] text-offwhite shadow-[0_30px_70px_-30px_rgba(153,0,0,0.65)] hover:-translate-y-2 lg:-translate-y-2 lg:hover:-translate-y-3"
                    : "border border-anthracite/12 bg-white shadow-[0_18px_45px_-34px_rgba(31,27,27,0.5)] hover:-translate-y-2 hover:border-ruby/20 hover:shadow-[0_28px_55px_-30px_rgba(31,27,27,0.42)]"
                }`}
              >
                {pkg.highlighted && (
                  <>
                    <span className="handle-tl" />
                    <span className="handle-tr" />
                    <span className="handle-bl" />
                    <span className="handle-br" />
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-offwhite/20 bg-ruby px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-offwhite shadow-lg">
                      Empfohlen
                    </span>
                  </>
                )}

                <h3
                  className={`font-display text-[1.65rem] font-bold leading-tight tracking-[-0.025em] ${
                    pkg.highlighted ? "text-offwhite" : "text-anthracite"
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`mt-3 font-mono text-[14px] font-semibold ${
                    pkg.highlighted ? "text-sand" : "text-ruby"
                  }`}
                >
                  {pkg.price}
                </p>
                <p
                  className={`mt-5 text-[15px] leading-[1.7] ${
                    pkg.highlighted ? "text-offwhite/85" : "text-anthracite/75"
                  }`}
                >
                  {pkg.description}
                </p>

                <ul className="mt-7 flex-1 space-y-3">
                  {pkg.included.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-3 text-[14px] leading-relaxed ${
                        pkg.highlighted ? "text-offwhite/85" : "text-anthracite/75"
                      }`}
                    >
                      <IconCheck
                        className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${
                          pkg.highlighted ? "text-sand" : "text-ruby"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {pkg.excluded && (
                  <ul className="mt-5 space-y-2.5 border-t border-anthracite/10 pt-5">
                    {pkg.excluded.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[13px] leading-relaxed text-anthracite/45"
                      >
                        <IconMinus className="mt-0.5 h-3 w-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <a
                  href="#kontakt"
                  className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3.5 text-[14px] font-semibold shadow-[0_10px_24px_-16px_rgba(31,27,27,0.6)] transition-all duration-300 hover:-translate-y-1 ${
                    pkg.highlighted
                      ? "bg-ruby text-offwhite"
                      : "bg-anthracite text-offwhite"
                  }`}
                >
                  Paket anfragen
                  <IconArrow className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Vorher / Nachher                                                       */
/* ----------------------------------------------------------------------- */

function CompareCardView({ card }: { card: CompareCard }) {
  return (
    <div className="premium-card h-full rounded-xl border border-anthracite/12 bg-white p-5 sm:p-7">
      <div className="flex items-center justify-between border-b border-anthracite/10 pb-5">
        <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-anthracite">{card.title}</h3>
        <span className="h-2 w-2 rounded-full bg-ruby shadow-[0_0_0_4px_rgba(153,0,0,0.08)]" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="compare-before rounded-lg border border-dashed border-anthracite/15 bg-anthracite/[0.025] p-4">
          <span className="inline-flex rounded-sm bg-anthracite/8 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-anthracite/50">
            Vorher
          </span>
          <ul className="mt-4 space-y-2.5">
            {card.before.map((item) => (
              <li key={item} className="text-[13px] leading-snug text-anthracite/52">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="handle-frame rounded-lg border border-ruby/18 bg-offwhite p-4 shadow-[0_12px_25px_-22px_rgba(153,0,0,0.7)]">
          <span className="handle-tl" />
          <span className="handle-tr" />
          <span className="handle-bl" />
          <span className="handle-br" />
          <span className="inline-flex rounded-sm bg-ruby px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-offwhite">
            Nachher
          </span>
          <ul className="mt-4 space-y-2.5">
            {card.after.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] font-semibold leading-snug text-anthracite">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ruby" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-anthracite/10 pt-5">
        {card.badges.map((b) => (
          <FormatBadge key={b}>{b}</FormatBadge>
        ))}
      </div>
    </div>
  );
}

function CompareSection() {
  return (
    <section id="beispiele" className="border-b border-anthracite/10 bg-white px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <Eyebrow>Beispiele</Eyebrow>
          <h2 className="mt-6 font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] text-anthracite sm:text-[3.2rem]">
            Vorher / Nachher
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-anthracite/65">
            Beispielhafte Darstellung typischer Ausgangslagen – keine echten
            Kundenprojekte.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {compareCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.07}>
              <CompareCardView card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Ausgewählte Referenzen (Portfolio)                                     */
/* ----------------------------------------------------------------------- */

type PortfolioRef = {
  id: string
  title: string
  description: string | null
  category: string | null
  media_type: 'image' | 'video' | 'pdf'
  media_path: string
  alt_text: string | null
  external_url: string | null
  link_label: string | null
}

function ReferencesSection() {
  const [items, setItems] = useState<PortfolioRef[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('portfolio_references')
        .select('id,title,description,category,media_type,media_path,alt_text,external_url,link_label')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(24)
      if (!error && data) setItems(data as PortfolioRef[])
      setLoading(false)
    }
    load()
  }, [supabase])

  const getPublicUrl = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-media/${path}`

  const scroll = (direction: number) => {
    const el = scrollRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.82)
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  if (loading || items.length === 0) return null

  return (
    <section id="referenzen" className="border-b border-anthracite/10 bg-white px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Referenzen</Eyebrow>
          <h2 className="mt-6 font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] text-anthracite sm:text-[3.2rem]">
            Ausgewählte Referenzen
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-anthracite/65">
            Einblicke in Designs, Aufbereitungen und visuelle Arbeiten von Klickdesigns.
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 md:block">
            <button
              onClick={() => scroll(-1)}
              aria-label="Vorherige"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-anthracite/15 bg-white text-anthracite shadow-sm transition hover:border-ruby/30"
            >
              ←
            </button>
          </div>
          <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 md:block">
            <button
              onClick={() => scroll(1)}
              aria-label="Nächste"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-anthracite/15 bg-white text-anthracite shadow-sm transition hover:border-ruby/30"
            >
              →
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((ref, idx) => {
                const url = getPublicUrl(ref.media_path)
                const isExternal = !!ref.external_url
                const CardContent = (
                  <>
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-anthracite/10 bg-offwhite">
                      {ref.media_type === 'image' && (
                        <img
                          src={url}
                          alt={ref.alt_text || ref.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                          loading="lazy"
                        />
                      )}
                      {ref.media_type === 'video' && (
                        <video
                          src={url}
                          className="absolute inset-0 h-full w-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      )}
                      {ref.media_type === 'pdf' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-anthracite/[0.03]">
                          <div className="rounded border border-anthracite/15 bg-white px-5 py-2 text-[11px] font-semibold tracking-[0.1em] text-anthracite/70">PDF</div>
                          <div className="mt-2 text-center text-[13px] text-anthracite/60 px-4 line-clamp-2">{ref.title}</div>
                        </div>
                      )}
                      {ref.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-medium text-anthracite shadow-sm border border-anthracite/10">
                          {ref.category}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 px-1">
                      <div className="font-semibold tracking-[-0.01em] text-anthracite text-[15px] leading-snug">{ref.title}</div>
                      {ref.description && (
                        <p className="mt-1.5 text-[13px] leading-snug text-anthracite/60 line-clamp-2">{ref.description}</p>
                      )}
                      {ref.link_label && isExternal && (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ruby">
                          {ref.link_label} <span aria-hidden>↗</span>
                        </div>
                      )}
                    </div>
                  </>
                )

                return (
                  <Reveal key={ref.id} delay={Math.min(idx * 0.03, 0.2)} className="group w-[82%] min-w-[260px] max-w-[340px] flex-none snap-start md:w-[360px]">
                    {isExternal ? (
                      <a
                        href={ref.external_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-anthracite/10 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-ruby/20 hover:shadow-[0_20px_50px_-20px_rgba(31,27,27,0.18)]"
                      >
                        {CardContent}
                      </a>
                    ) : (
                      <div className="rounded-xl border border-anthracite/10 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-ruby/20 hover:shadow-[0_20px_50px_-20px_rgba(31,27,27,0.18)]">
                        {CardContent}
                      </div>
                    )}
                  </Reveal>
                )
              })}
            </div>
          </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------- */
/*  Kostenlose Logo-Vorlagen                                               */
/* ----------------------------------------------------------------------- */

function TemplateMark({ index }: { index: number }) {
  const designs = [
    // Gaming
    <g key="gaming">
      <path d="M10 17.5 14 11h12l4 6.5-2 11-8-4-8 4Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M14.5 18.5h5m-2.5-2.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="24" cy="18" r="1.2" fill="currentColor" />
      <circle cx="27" cy="21" r="1.2" fill="currentColor" />
    </g>,
    // Pixel
    <g key="pixel">
      <path d="M10 10h7v7h-7zm13 0h7v7h-7zM10 23h7v7h-7zm13 0h7v7h-7z" fill="currentColor" />
      <path d="M17 17h6v6h-6z" fill="currentColor" opacity="0.42" />
    </g>,
    // E-Sport
    <g key="esport">
      <path d="m8 13 12-4 12 4-3 13-9 6-9-6Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="m14 17 6-3 6 3-2 7-4 3-4-3Z" fill="currentColor" opacity="0.18" />
      <path d="m16 19 4-2 4 2-4 5Z" fill="currentColor" />
    </g>,
    // Fantasy
    <g key="fantasy">
      <path d="M20 7c1.5 6.5 5.5 9.5 12 11-6.5 1.5-10 5-12 12-2-7-5.5-10.5-12-12 6.5-1.5 10.5-4.5 12-11Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="18" r="3.5" fill="currentColor" opacity="0.2" />
    </g>,
    // Minimal
    <g key="minimal">
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 24 20 13l6 11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16.5 20h7" stroke="currentColor" strokeWidth="1.2" />
    </g>,
    // Business
    <g key="business">
      <path d="M9 29 15 11h10l6 18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 24h14M16 19h8M18 14h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>,
    // Streetwear
    <g key="streetwear">
      <path d="m10 15 5-5 5 3 5-3 5 5-4 4v11H14V19Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="m16 22 8-5m-8 9 8-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>,
    // Creator
    <g key="creator">
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="m17 15 8 5-8 5Z" fill="currentColor" />
      <circle cx="29" cy="11" r="2.5" fill="currentColor" opacity="0.35" />
    </g>,
  ];
  return (
    <svg viewBox="0 0 40 40" className="h-16 w-16 text-ruby transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {designs[index % designs.length]}
    </svg>
  );
}

function FreeTemplates() {
  return (
    <section className="border-b border-anthracite/10 px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <Eyebrow>Für den Start</Eyebrow>
          <h2 className="mt-6 font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] text-anthracite sm:text-[3.2rem]">
            Kostenlose Logo-Vorlagen
          </h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-anthracite/65">
            Starte mit einer kostenlosen Logo-Vorlage und lasse sie bei Bedarf
            professionell anpassen, finalisieren oder als nutzbare Datei
            aufbereiten.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 min-[440px]:grid-cols-2 lg:grid-cols-4">
          {templateCategories.map((cat, i) => (
            <Reveal key={cat} delay={i * 0.04}>
              <div className="handle-frame group relative overflow-hidden rounded-xl border border-anthracite/10 bg-white p-3 shadow-[0_16px_40px_-34px_rgba(31,27,27,0.5)] transition-all duration-300 hover:-translate-y-2 hover:border-ruby/30 hover:shadow-[0_28px_52px_-28px_rgba(31,27,27,0.38)]">
                <span className="handle-tl opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="handle-tr opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="handle-bl opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="handle-br opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="template-preview relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-lg border border-anthracite/8 bg-offwhite">
                  <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.14em] text-anthracite/35">Preview {String(i + 1).padStart(2, "0")}</span>
                  <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-ruby" />
                  <TemplateMark index={i} />
                  <span className="absolute bottom-4 left-1/2 h-px w-12 -translate-x-1/2 bg-anthracite/15 transition-all duration-500 group-hover:w-20 group-hover:bg-ruby/30" />
                </div>
                <div className="flex items-center justify-between px-2 pb-1 pt-4">
                  <span className="text-[15px] font-bold text-anthracite">{cat}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-anthracite/35">Logo</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="/logo-vorlagen"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-anthracite/20 bg-white px-6 py-3 text-[14px] font-semibold text-anthracite transition-all hover:-translate-y-0.5 hover:border-ruby/30 hover:shadow-md"
          >
            Kostenlose Logos ansehen
          </a>
          <a
            href="#kontakt"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ruby px-6 py-3 text-[14px] font-semibold text-offwhite shadow-[0_12px_24px_-16px_rgba(153,0,0,0.7)] transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            Anpassung anfragen
            <IconArrow className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Ablauf                                                                 */
/* ----------------------------------------------------------------------- */

function Process() {
  return (
    <section className="dot-grid-bg-light border-b border-anthracite/10 bg-anthracite px-5 py-28 text-offwhite sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <Eyebrow>Ablauf</Eyebrow>
          <h2 className="mt-6 font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] sm:text-[3.2rem]">
            Vier Schritte bis zur fertigen Datei
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-offwhite/15 lg:block" />
          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.08}>
              <div className="relative h-full rounded-lg border border-offwhite/10 bg-offwhite/[0.035] p-6 backdrop-blur-sm transition-colors hover:border-offwhite/20 hover:bg-offwhite/[0.055]">
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-ruby/40 bg-ruby/10 px-2 font-mono text-[12px] font-semibold text-sand">{step.number}</span>
                <h3 className="mt-5 font-display text-[18px] font-semibold text-offwhite">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-offwhite/62">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-14 max-w-xl rounded-lg border border-offwhite/15 bg-offwhite/[0.03] px-6 py-5 text-center">
          <p className="text-[14px] leading-relaxed text-offwhite/68">
            Beim Logo-Sprint erhältst du zuerst mehrere Logo-Richtungen zur
            Auswahl.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Qualitätsversprechen                                                  */
/* ----------------------------------------------------------------------- */

function QualityPromise() {
  return (
    <section className="border-b border-anthracite/10 px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <Eyebrow>Qualitätsversprechen</Eyebrow>
          <h2 className="mt-6 font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] text-anthracite sm:text-[3.2rem]">
            Keine Fake-Bewertungen. Dafür klare Fakten.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {qualityPromises.map((item, i) => (
            <Reveal key={item} delay={i * 0.04}>
              <div className="premium-card flex min-h-[76px] items-start gap-3 rounded-lg border border-anthracite/10 bg-white px-5 py-5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ruby/8">
                  <IconCheck className="h-3.5 w-3.5 text-ruby" />
                </span>
                <span className="text-[15px] leading-relaxed text-anthracite/75">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  FAQ                                                                     */
/* ----------------------------------------------------------------------- */

function FaqItemView({
  item,
  open,
  onToggle,
}: {
  item: { question: string; answer: string };
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-anthracite/10">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="text-[16px] font-semibold text-anthracite">{item.question}</span>
        <IconChevron
          className={`h-4 w-4 flex-shrink-0 text-anthracite/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-[15px] leading-[1.75] text-anthracite/65">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-anthracite/10 bg-white px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-6 font-display text-[2.25rem] font-bold leading-[1.1] tracking-[-0.035em] text-anthracite sm:text-[3.2rem]">
            Häufige Fragen
          </h2>
        </Reveal>

        <Reveal delay={0.06} className="mt-14 rounded-xl border border-anthracite/10 bg-offwhite/30 px-5 sm:px-8">
          {faqItems.map((item, i) => (
            <FaqItemView
              key={item.question}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Kontakt                                                                */
/* ----------------------------------------------------------------------- */

function ChipRadio({
  options,
  selected,
  onSelect,
  name,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={selected === option}
          onClick={() => onSelect(option)}
          className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 sm:px-5 ${
            selected === option
              ? "border-ruby bg-ruby text-offwhite shadow-[0_8px_18px_-10px_rgba(153,0,0,0.75)]"
              : "border-anthracite/15 bg-white text-anthracite/70 hover:border-ruby/40 hover:bg-ruby/[0.035]"
          }`}
        >
          {option}
          <span className="sr-only"> ({name})</span>
        </button>
      ))}
    </div>
  );
}

function Contact() {
  const [service, setService] = useState(serviceOptions[0]);
  const [have, setHave] = useState(haveOptions[0]);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // add controlled values
    data.set('service', service);
    data.set('have', have);
    const result = await submitInquiry(data);
    if (result?.success) {
      setSubmitted(true);
    } else if (result?.error) {
      // simple error for now
      alert(result.error);
    }
  }

  return (
    <section id="kontakt" className="contact-premium px-5 py-28 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>Kontakt</Eyebrow>
          <h2 className="mt-6 font-display text-[2.4rem] font-bold leading-[1.05] tracking-[-0.04em] text-anthracite sm:text-[3.4rem]">
            Design anfragen
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-anthracite/70">
            Beschreibe kurz dein Projekt – wir melden uns mit den nächsten
            Schritten.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <Reveal>
            <aside className="rounded-xl border border-anthracite/10 bg-anthracite p-7 text-offwhite shadow-[0_28px_60px_-38px_rgba(31,27,27,0.7)] sm:p-8 lg:sticky lg:top-28">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sand">Nach deiner Anfrage</span>
              <div className="mt-7 space-y-6">
                {[
                  ["01", "Kurze Prüfung"],
                  ["02", "Rückmeldung"],
                  ["03", "Umsetzung nach Absprache"],
                ].map(([number, label]) => (
                  <div key={number} className="flex items-center gap-4 border-b border-offwhite/10 pb-6 last:border-0 last:pb-0">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-ruby/50 bg-ruby/15 font-mono text-[11px] font-semibold text-sand">{number}</span>
                    <span className="text-[15px] font-semibold text-offwhite/88">{label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </Reveal>

          <Reveal delay={0.08}>
          {submitted ? (
            <div className="handle-frame rounded-xl border border-ruby/30 bg-white px-8 py-14 text-center shadow-[0_24px_55px_-35px_rgba(31,27,27,0.5)]">
              <span className="handle-tl" />
              <span className="handle-tr" />
              <span className="handle-bl" />
              <span className="handle-br" />
              <IconCheck className="mx-auto h-7 w-7 text-ruby" />
              <h3 className="mt-4 font-display text-lg font-bold text-anthracite">
                Anfrage vorbereitet
              </h3>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-7 inline-flex items-center gap-2 rounded-md border border-anthracite/20 px-5 py-3 text-[13px] font-semibold text-anthracite transition-colors hover:border-ruby/40 hover:text-ruby"
              >
                Zurück zum Formular
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border border-anthracite/10 bg-white shadow-[0_28px_65px_-40px_rgba(31,27,27,0.48)]">
              <div className="flex items-center justify-between border-b border-anthracite/10 bg-offwhite/65 px-6 py-4 sm:px-9">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-anthracite/55">Projekt-Briefing</span>
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-anthracite/35"><span className="h-1.5 w-1.5 rounded-full bg-ruby" />Anfrage</span>
              </div>
              <div className="p-6 sm:p-9 lg:p-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[14px] font-semibold text-anthracite/75">Name</span>
                  <input
                    required
                    type="text"
                    name="name"
                    className="briefing-input mt-3 w-full"
                  />
                </label>
                <label className="block">
                  <span className="text-[14px] font-semibold text-anthracite/75">E-Mail</span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="briefing-input mt-3 w-full"
                  />
                </label>
              </div>

              <label className="mt-6 block">
                <span className="text-[14px] font-semibold text-anthracite/75">
                  Unternehmen / Projekt
                </span>
                <input
                  type="text"
                  name="company"
                  className="briefing-input mt-3 w-full"
                />
              </label>

              <div className="mt-7 rounded-lg border border-anthracite/10 bg-offwhite/45 p-5">
                <span className="text-[14px] font-semibold text-anthracite/75">
                  Gewünschte Leistung
                </span>
                <div className="mt-3.5">
                  <ChipRadio
                    name="Leistung"
                    options={serviceOptions}
                    selected={service}
                    onSelect={setService}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-anthracite/10 bg-offwhite/45 p-5">
                <span className="text-[14px] font-semibold text-anthracite/75">
                  Was hast du bereits?
                </span>
                <div className="mt-3.5">
                  <ChipRadio
                    name="Bereits vorhanden"
                    options={haveOptions}
                    selected={have}
                    onSelect={setHave}
                  />
                </div>
              </div>

              <label className="mt-7 block">
                <span className="text-[14px] font-semibold text-anthracite/75">
                  Kurze Beschreibung
                </span>
                <textarea
                  rows={5}
                  name="message"
                  className="briefing-input mt-3 min-h-[150px] w-full resize-none"
                />
              </label>

              <button
                type="submit"
                className="group mt-9 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-ruby px-8 py-4 text-[16px] font-semibold text-offwhite shadow-[0_14px_28px_-14px_rgba(153,0,0,0.72)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_36px_-16px_rgba(153,0,0,0.75)] sm:w-auto"
              >
                Anfrage vorbereiten
                <IconArrow className="h-5 w-5" />
              </button>
              </div>
            </form>
          )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}


/* ----------------------------------------------------------------------- */
/*  Offer acceptance success banner (shown after public /angebot/[token] accept) */
/* ----------------------------------------------------------------------- */

function OfferAcceptedBanner() {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(true)

  if (searchParams.get('angebot_angenommen') !== 'true' || !visible) {
    return null
  }

  return (
    <div className="border-b border-ruby/10 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-6 sm:py-7">
        <div className="flex items-start gap-3 rounded-xl border border-ruby/15 bg-ruby/[0.035] px-5 py-4 sm:px-6">
          <div className="mt-0.5">
            <IconCheck className="h-5 w-5 text-ruby" />
          </div>
          <div className="flex-1 text-sm leading-relaxed text-anthracite/90">
            <div className="font-semibold text-anthracite">Angebot erfolgreich angenommen.</div>
            <div className="mt-1 text-anthracite/80">
              Wir melden uns zeitnah um alles weitere zu besprechen. Sie müssen nichts weiteres mehr tun. In der Regel melden wir uns innerhalb weniger Minuten bei Ihnen.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="text-anthracite/40 hover:text-anthracite/70 text-xl leading-none"
            aria-label="Hinweis schließen"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------- */
/*  Page                                                                    */
/* ----------------------------------------------------------------------- */

export default function Home() {
  return (
    <main className="bg-offwhite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <Suspense fallback={null}>
        <OfferAcceptedBanner />
      </Suspense>
      <Hero />
      <AudienceStrip />
      <ProblemSolution />
      <LogoSprint />
      <Packages />
      <CompareSection />
      <ReferencesSection />
      <FreeTemplates />
      <Process />
      <QualityPromise />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}
