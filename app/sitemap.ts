import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

const publicRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/agb", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/widerruf", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/cookie-einstellungen", priority: 0.3, changeFrequency: "yearly" as const },
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
