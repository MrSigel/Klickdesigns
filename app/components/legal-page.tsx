import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

const legalLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Widerruf", href: "/widerruf" },
  { label: "Cookie-Einstellungen", href: "/cookie-einstellungen" },
  { label: "Versand & Lieferung", href: "/versand-lieferung" },
];

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-anthracite/10 pt-8 first:border-0 first:pt-0">
      <h2 className="font-display text-2xl font-bold tracking-[-0.025em] text-anthracite sm:text-[1.75rem]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-anthracite/75 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-offwhite text-anthracite">
      <header className="border-b border-anthracite/10 bg-offwhite/95 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-5">
          <Link href="/" aria-label="Klickdesigns Startseite">
            <Image
              src="/brand/klickdesigns-logo.svg"
              alt="Klickdesigns Logo"
              width={300}
              height={71}
              className="h-9 w-auto sm:h-10"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-anthracite/65 transition-colors hover:text-ruby"
          >
            Zur Startseite
          </Link>
        </div>
      </header>

      <main className="px-5 py-16 sm:px-8 sm:py-20">
        <article className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ruby">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[2.15rem] font-bold leading-[1.05] tracking-[-0.04em] text-anthracite [overflow-wrap:anywhere] sm:text-[3.4rem]">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-base leading-7 text-anthracite/65 sm:text-lg">
              {intro}
            </p>
          )}

          <div className="mt-12 space-y-10 rounded-xl border border-anthracite/10 bg-white p-6 shadow-[0_28px_65px_-48px_rgba(31,27,27,0.42)] sm:p-10">
            {children}
          </div>
        </article>
      </main>

      <footer className="border-t border-anthracite/10 bg-anthracite px-5 py-10 text-offwhite sm:px-8">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Rechtliche Seiten" className="flex flex-wrap gap-x-6 gap-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-offwhite/65 transition-colors hover:text-offwhite"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 border-t border-offwhite/10 pt-6 text-xs text-offwhite/40">
            © {new Date().getFullYear()} Klickdesigns. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
