import { MetadataRoute } from "next"
import { MANAGED_AREAS } from "@/lib/constants"
import { CURATED_VILLAS, VILLA_EVENTS } from "@/lib/data"
import { getBlogPosts } from "@/lib/blog/service"
import { hasIdVersion, localizePath } from "@/lib/i18n/site"

// Revalidate sitemap every hour to pick up new blog posts & property pages
export const revalidate = 3600

const CANONICAL_BASE_URL = "https://www.kinghousemanagement.com"

/**
 * XML sitemaps strictly require '&' characters to be encoded as '&amp;'.
 * Next.js built-in sitemap serialization does not auto-escape '&' inside <image:loc>,
 * which causes browser XML parsing failures ('EntityRef: expecting ;').
 */
function sanitizeXmlUrl(url: string): string {
  if (!url) return ""
  return url.replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;")
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CANONICAL_BASE_URL
  const currentDate = new Date()

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/villas`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/owner-services`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/management-inquiry`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/airbnb-cleaning-jakarta`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/press`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // 2. Dynamic Area Landing Pages (/locations/[area])
  const areaRoutes: MetadataRoute.Sitemap = MANAGED_AREAS.map((area) => ({
    url: `${baseUrl}/locations/${area.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }))

  // 3. Dynamic Canonical Property Pages (/locations/[area]/villas/[slug])
  // Note: /villas/[slug] automatically 308 redirects to the canonical localized URL
  // and is omitted from the XML sitemap to prevent GSC redirect-in-sitemap warnings.
  const villaRoutes: MetadataRoute.Sitemap = CURATED_VILLAS.map((villa) => ({
    url: `${baseUrl}/locations/${villa.areaSlug}/villas/${villa.slug}`,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 0.9,
    images: villa.gallery
      .map((g) => (g.url.startsWith("http") ? g.url : `${baseUrl}${g.url}`))
      .map(sanitizeXmlUrl),
  }))

  // 4. Dynamic Event Packages (/events/[slug])
  const eventRoutes: MetadataRoute.Sitemap = VILLA_EVENTS.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
    images: [
      sanitizeXmlUrl(event.heroImage.startsWith("http") ? event.heroImage : `${baseUrl}${event.heroImage}`),
    ],
  }))

  // 5. Dynamic Blog Articles (/blog/[slug])
  // Note: /stay and /stay/[slug] are private guest guides (noindex) and /thanks is a conversion page (noindex) — not listed
  // and are intentionally omitted from public sitemap indexing.
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getBlogPosts()
    blogRoutes = posts
      .filter((post) => post.status === "Published")
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt || currentDate),
        changeFrequency: "weekly",
        priority: 0.8,
        images: [
          sanitizeXmlUrl(post.heroImage.startsWith("http") ? post.heroImage : `${baseUrl}${post.heroImage}`),
        ],
      }))
  } catch (error) {
    console.error("[Sitemap] Failed to fetch dynamic blog posts:", error)
  }

  // 6. Indonesian versions (/id/…) with reciprocal hreflang on both entries
  const localized = [...staticRoutes, ...areaRoutes, ...villaRoutes, ...eventRoutes].flatMap((entry) => {
    const path = entry.url.slice(baseUrl.length) || "/"
    if (!hasIdVersion(path)) return [entry]
    const languages = { en: entry.url, id: `${baseUrl}${localizePath(path, "id")}` }
    return [
      { ...entry, alternates: { languages } },
      { ...entry, url: languages.id, alternates: { languages } },
    ]
  })

  return [...localized, ...blogRoutes]
}
