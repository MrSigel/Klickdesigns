import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

type ErrorPageShellProps = {
  eyebrow?: string;
  headline: string;
  text: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  email?: string;
};

export default function ErrorPageShell({
  eyebrow,
  headline,
  text,
  primaryHref = "/",
  primaryLabel = "Zur Startseite",
  secondaryHref,
  secondaryLabel,
  email,
}: ErrorPageShellProps) {
  return (
    <div className="min-h-screen bg-offwhite text-anthracite">
      <Header />
      <main className="px-5 py-16 sm:px-8 sm:py-24">
        <section className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-xl border border-anthracite/10 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(31,27,27,0.55)] sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,204,153,0.42),transparent_34%),linear-gradient(135deg,rgba(153,0,0,0.04),transparent_42%)]" />
            <div className="relative">
              {eyebrow && (
                <span className="inline-flex rounded-full border border-ruby/15 bg-ruby/[0.04] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ruby">
                  {eyebrow}
                </span>
              )}
              <h1 className="mt-5 max-w-3xl font-display text-[2.35rem] font-bold leading-[1.02] tracking-[-0.04em] text-anthracite sm:text-[4rem]">
                {headline}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-anthracite/70 sm:text-[18px]">
                {text}
              </p>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="mt-3 inline-flex text-sm font-semibold text-ruby transition-colors hover:text-anthracite"
                >
                  {email}
                </a>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite shadow-[0_12px_24px_-16px_rgba(153,0,0,0.75)] transition-all hover:-translate-y-0.5 hover:bg-ruby/90"
                >
                  {primaryLabel}
                </Link>
                {secondaryHref && secondaryLabel && (
                  <Link
                    href={secondaryHref}
                    className="inline-flex min-h-12 items-center justify-center rounded-md border border-anthracite/15 bg-offwhite px-6 py-3 text-sm font-semibold text-anthracite transition-all hover:-translate-y-0.5 hover:border-ruby/30"
                  >
                    {secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
