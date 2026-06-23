import Image from 'next/image';

const footerLinkColumns = [
  {
    title: "Leistungen",
    links: [
      { label: "Logo vektorisieren", href: "/logo-vektorisieren" },
      { label: "Logo-Sprint", href: "/logo-sprint" },
      { label: "Design-Finalisierung", href: "/design-finalisierung" },
      { label: "Sticker-Design", href: "/sticker-design" },
      { label: "Flyer-Design", href: "/flyer-design" },
      { label: "Social-Media-Design", href: "/social-media-design" },
    ],
  },
  {
    title: "Zielgruppen",
    links: [
      { label: "Für Unternehmen", href: "/grafikdesign-fuer-unternehmen" },
      { label: "Für Vereine", href: "/grafikdesign-fuer-vereine" },
      { label: "Für Creator", href: "/grafikdesign-fuer-creator" },
      { label: "Autoaufkleber", href: "/autoaufkleber-design" },
      { label: "Logo-Design", href: "/logo-design" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "AGB", href: "/agb" },
      { label: "Widerruf", href: "/widerruf" },
      { label: "Cookie-Einstellungen", href: "/cookie-einstellungen" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-anthracite/10 bg-anthracite px-5 py-16 text-offwhite sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center">
              <Image
                src="/brand/klickdesigns-logo-light.svg"
                alt="Klickdesigns Logo"
                width={300}
                height={71}
                className="h-8 w-auto"
                loading="lazy"
              />
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-offwhite/55">
              Mediengestaltung und Grafikdesign für Logos, Flyer und
              Social-Media-Grafiken – aufbereitet für Web, Druck, Sticker,
              Kleidung und Social Media.
            </p>
          </div>

          {footerLinkColumns.map((col) => (
            <div key={col.title}>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/40">
                {col.title}
              </span>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-offwhite/65 transition-colors hover:text-offwhite"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-offwhite/10 pt-6 text-[12.5px] text-offwhite/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Klickdesigns. Alle Rechte vorbehalten.</span>
          <span className="font-mono text-[11px] uppercase tracking-wide">
            Design · Finalisierung · Aufbereitung
          </span>
        </div>
      </div>
    </footer>
  );
}
