import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

const publicRoutes = [
  "",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
  "/cookie-einstellungen",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
