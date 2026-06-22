import type { MetadataRoute } from "next";
import { HAS_FINAL_DOMAIN, SITE_URL } from "./site-config";

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/dashboard", "/api"],
  };

  if (HAS_FINAL_DOMAIN) {
    return {
      rules,
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return { rules };
}
