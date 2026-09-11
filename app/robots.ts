import { MetadataRoute } from "next"

// Hardcoded canonical URL — never depends on environment variables
const CANONICAL_BASE_URL = "https://www.kinghousemanagement.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/api/*",
          "/login",
          "/stay/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/api/*",
          "/login",
          "/stay/*",
        ],
      },
    ],
    sitemap: `${CANONICAL_BASE_URL}/sitemap.xml`,
    host: CANONICAL_BASE_URL,
  }
}
