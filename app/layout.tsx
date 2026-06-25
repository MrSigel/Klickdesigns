import type { Metadata } from "next";
import { CookieConsent } from "./components/cookie-consent";
import {
  HAS_FINAL_DOMAIN,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "./site-config";
import "./globals.css";
import { ConsentAnalytics } from "./components/consent-analytics";
import ExitIntentPopup from "./components/ExitIntentPopup";
import WhatsappButton from "./components/WhatsappButton";

export const metadata: Metadata = {
  metadataBase: HAS_FINAL_DOMAIN ? new URL(SITE_URL) : undefined,
  title: {
    default: SITE_TITLE,
    template: "%s | Klickdesigns",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Enrico Gross", url: SITE_URL }],
  creator: "Enrico Gross",
  publisher: SITE_NAME,
  category: "Design & Grafik",
  keywords: [
    "Mediengestaltung",
    "Grafikdesign",
    "Logo-Vektorisierung",
    "Logo als SVG erstellen lassen",
    "Logo vektorisieren lassen",
    "Design-Finalisierung",
    "Flyer überarbeiten lassen",
    "Social-Media-Design",
    "Design für kleine Unternehmen",
    "Logo für Sticker",
    "Logo für Kleidung",
    "Druckdatei erstellen lassen",
    "Canva Design überarbeiten lassen",
    "Grafikdesign Castrop-Rauxel",
    "Logo Design Ruhrgebiet",
    "Mediengestaltung Nordrhein-Westfalen",
    "Grafikdesign Deutschland",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "de_DE",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="font-body antialiased">
        {children}
        <CookieConsent />
        <ExitIntentPopup />
        <WhatsappButton />
        <ConsentAnalytics />
      </body>
    </html>
  );
}
