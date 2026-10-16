import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/categories",
          "/categories/",
          "/images/",
          "/icon.png",
          "/apple-icon.png",
          "/favicon.ico",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/battle",
          "/battle/",
          "/lobby",
          "/lobby/",
          "/results",
          "/results/",
          "/history",
          "/history/",
          "/profile",
          "/profile/",
          "/leaderboard",
          "/dashboard",
          "/login",
          "/register",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
