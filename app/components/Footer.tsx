import Image from 'next/image';

const footerLinkColumns = [
  {
    title: "Seite",
    links: [
      { label: "Leistungen", href: "#leistungen" },
      { label: "Logo-Sprint", href: "#logo-sprint" },
      { label: "Pakete", href: "#pakete" },
      { label: "Beispiele", href: "#beispiele" },
      { label: "FAQ", href: "#faq" },
      { label: "Kontakt", href: "#kontakt" },
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
