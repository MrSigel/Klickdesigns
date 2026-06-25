import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

const publicRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/logo-vektorisieren", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/loesungen/logo-vektorisieren-fuer-vereine", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/loesungen/vektorgrafik-fuer-textildruck", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/loesungen/handwerker-logo-optimieren", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/logo-sprint", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/design-finalisierung", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/sticker-design", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/autoaufkleber-design", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/flyer-design", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/social-media-design", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/logo-design", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/grafikdesign-fuer-unternehmen", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/grafikdesign-fuer-vereine", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/grafikdesign-fuer-creator", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/logo-vorlagen", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/vorlagen/fussball-logo-vorlage-kostenlos-svg", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/vorlagen/handwerk-logo-template-gratis", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/kontakt", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/agb", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/widerruf", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/cookie-einstellungen", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/versand-lieferung", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
