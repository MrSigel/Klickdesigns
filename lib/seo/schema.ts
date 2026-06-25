import { SITE_NAME, SITE_URL } from "@/app/site-config";

export const businessAddress = {
  "@type": "PostalAddress",
  streetAddress: "Gerther Straße 76",
  postalCode: "44577",
  addressLocality: "Castrop-Rauxel",
  addressRegion: "NRW",
  addressCountry: "DE",
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: SITE_NAME,
  url: SITE_URL,
  email: "kontakt@klickdesigns.de",
  founder: {
    "@type": "Person",
    name: "Enrico Gross",
  },
  address: businessAddress,
  areaServed: ["Castrop-Rauxel", "Ruhrgebiet", "NRW", "Deutschland"],
  description:
    "Klickdesigns ist eine Grafikdesign- und Mediengestaltungsagentur aus Castrop-Rauxel für Logos, Logo-Vektorisierung, Design-Finalisierung, Flyer, Social-Media-Grafiken, Sticker, Autoaufkleber, Druckdaten und Produktumsetzung auf Anfrage.",
  serviceType: [
    "Grafikdesign",
    "Mediengestaltung",
    "Logo-Design",
    "Logo-Vektorisierung",
    "Design-Finalisierung",
    "Flyer",
    "Social Media",
    "Sticker",
    "Autoaufkleber",
    "Druckdaten",
    "Produktumsetzung auf Anfrage",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "de-DE",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: "Deutschland",
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function jsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
