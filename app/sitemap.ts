import { MetadataRoute } from "next"
import { SITE_CONFIG, MANAGED_AREAS } from "@/lib/constants"
import { CURATED_VILLAS } from "@/lib/data"
import { getBlogPosts } from "@/lib/blog/service"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.baseUrl
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
      url: `${baseUrl}/stay`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/management-inquiry`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
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

  // 3. Dynamic Property Pages (/villas/[slug] and /locations/[area]/villas/[slug])
  const villaRoutes: MetadataRoute.Sitemap = CURATED_VILLAS.flatMap((villa) => [
    {
      url: `${baseUrl}/villas/${villa.slug}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations/${villa.areaSlug}/villas/${villa.slug}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ])

  // 4. Dynamic Guest Compendium Pages (/stay/[slug])
  const stayRoutes: MetadataRoute.Sitemap = CURATED_VILLAS.map((villa) => ({
    url: `${baseUrl}/stay/${villa.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // 5. Dynamic Blog Articles (/blog/[slug])
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
      }))
  } catch (error) {
    console.error("[Sitemap] Failed to fetch dynamic blog posts:", error)
  }

  return [
    ...staticRoutes,
    ...areaRoutes,
    ...villaRoutes,
    ...stayRoutes,
    ...blogRoutes,
  ]
}
