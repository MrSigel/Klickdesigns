import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductFulfillmentSection from "../../components/ProductFulfillmentSection";
import { SITE_NAME, SITE_URL } from "../../site-config";
import { getSolutionPage, solutionPages } from "@/lib/seo/solutionPages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return solutionPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSolutionPage(slug);

  if (!page) {
    return {};
  }

  const url = `${SITE_URL}/loesungen/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSolutionPage(slug);

  if (!page) {
    notFound();
  }

  const url = `${SITE_URL}/loesungen/${page.slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.h1, item: url },
    ],
  };
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    description: page.metaDescription,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: "Deutschland",
    serviceType: page.eyebrow,
    url,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Header />
      <main className="bg-offwhite">
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-anthracite/55" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ruby">Startseite</Link>
            <span>/</span>
            <span className="text-anthracite/75">{page.h1}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-ruby/15 bg-ruby/[0.04] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ruby">
                {page.eyebrow}
              </span>
              <h1 className="mt-5 font-display text-[2.7rem] font-bold leading-[0.98] tracking-[-0.04em] text-anthracite sm:text-[4rem]">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-anthracite/70">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/kontakt" className="rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">
                  {page.ctaLabel}
                </Link>
                <Link href="/logo-vektorisieren" className="rounded-md border border-anthracite/15 bg-white px-6 py-3 text-sm font-semibold text-anthracite hover:border-ruby/30">
                  Logo-Vektorisierung
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-anthracite/10 bg-white p-6 shadow-[0_18px_45px_-36px_rgba(31,27,27,0.45)]">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ruby">Dateiformate</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {page.formats.map((format) => (
                  <span key={format} className="rounded-md border border-anthracite/10 bg-offwhite px-3 py-2 text-center text-sm font-semibold text-anthracite/70">
                    {format}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-anthracite/60">{page.productNote}</p>
            </div>
          </div>
        </section>

        <section className="border-y border-anthracite/10 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-anthracite">{page.problemTitle}</h2>
              <ul className="mt-5 space-y-3 text-anthracite/70">
                {page.problem.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ruby" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-anthracite">{page.solutionTitle}</h2>
              <ul className="mt-5 space-y-3 text-anthracite/70">
                {page.solution.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ruby" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-anthracite">Vorteile</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {page.benefits.map((benefit) => (
              <div key={benefit} className="rounded-xl border border-anthracite/10 bg-white p-5">
                <p className="text-sm leading-relaxed text-anthracite/70">{benefit}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-[-0.02em] text-anthracite">Ablauf</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {page.process.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-anthracite/10 bg-white p-5">
                <span className="font-mono text-xs font-semibold text-ruby">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-semibold text-anthracite">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-anthracite/65">{step.text}</p>
              </div>
            ))}
          </div>

          <ProductFulfillmentSection className="mt-12" />

          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-anthracite">Passende Leistungen</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {page.relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl border border-anthracite/10 bg-white p-5 transition-colors hover:border-ruby/30">
                  <span className="text-sm font-semibold text-ruby">{link.label}</span>
                  <p className="mt-2 text-sm leading-relaxed text-anthracite/65">{link.text}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-anthracite">Häufige Fragen</h2>
            <div className="mt-5 divide-y divide-anthracite/10 rounded-xl border border-anthracite/10 bg-white">
              {page.faq.map((item) => (
                <details key={item.question} className="group p-5">
                  <summary className="cursor-pointer font-semibold text-anthracite">{item.question}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-anthracite/65">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-xl border border-ruby/15 bg-ruby/[0.04] p-6 text-center sm:p-8">
            <h2 className="font-display text-3xl font-bold tracking-[-0.035em] text-anthracite">{page.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-anthracite/70">{page.ctaText}</p>
            <Link href="/kontakt" className="mt-6 inline-flex rounded-md bg-ruby px-6 py-3 text-sm font-semibold text-offwhite">
              {page.ctaLabel}
            </Link>
          </section>
        </section>
      </main>
      <Footer />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
    </>
  );
}
