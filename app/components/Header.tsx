'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Logo-Sprint", href: "#logo-sprint" },
  { label: "Pakete", href: "#pakete" },
  { label: "Beispiele", href: "#beispiele" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

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

function IconArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-anthracite/10 bg-offwhite/90 shadow-[0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[74px] max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="/" className="flex items-center gap-2 py-1" aria-label="Klickdesigns Startseite">
          <Image
            src="/brand/klickdesigns-logo.svg"
            alt="Klickdesigns Logo"
            width={300}
            height={71}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </a>

        <nav className="hidden items-center gap-8 xl:gap-10 lg:flex" aria-label="Hauptnavigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-2 text-[14px] font-semibold text-anthracite/70 transition-colors hover:text-anthracite"
            >
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ruby transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-2 rounded-md bg-ruby px-5 py-3 text-[14px] font-semibold text-offwhite shadow-[0_8px_22px_-10px_rgba(153,0,0,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-12px_rgba(153,0,0,0.7)]"
          >
            Design anfragen
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-anthracite/10 bg-white/70 text-anthracite transition-colors hover:border-ruby/30 hover:text-ruby lg:hidden"
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-anthracite/10 bg-offwhite lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-5 sm:px-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-[16px] font-semibold text-anthracite/80 transition-colors hover:bg-anthracite/5 hover:text-ruby"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#kontakt"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-ruby px-5 py-3.5 text-[15px] font-semibold text-offwhite"
              >
                Design anfragen
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
