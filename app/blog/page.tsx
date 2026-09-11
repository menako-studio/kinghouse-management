import { Metadata } from "next"
import { BookOpen, Rss } from "lucide-react"
import { getBlogPosts } from "@/lib/blog/service"
import { BlogIndexClient } from "@/components/blog/blog-index-client"
import { SITE_CONFIG } from "@/lib/constants"

export const revalidate = 120

export const metadata: Metadata = {
  title: "Blog & Hospitality Insights | KingHouse",
  description:
    "Panduan strategi Airbnb, SEO listing, optimasi okupansi, dan analisis pasar sewa properti jangka pendek di Jabodetabek bersama KingHouse.",
  keywords: [
    "Kinghouse Management blog",
    "King House Management",
    "kinghousemanagement.com",
    "airbnb property management blog",
    "superhost tips jabodetabek",
    "airbnb seo optimization",
    "short stay asset management",
    "jakarta property rental insights",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Hospitality Insights | KingHouse",
    description:
      "Panduan strategi Airbnb, SEO listing, optimasi okupansi, dan analisis pasar sewa properti jangka pendek di Jabodetabek bersama KingHouse.",
    url: "/blog",
    type: "website",
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts({ status: "Published" })

  const blogIndexSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Kinghouse Management Blog",
    description:
      "Tips, strategies, and property management guides for Airbnb hosts across Greater Jakarta from Kinghouse Management.",
    url: `${SITE_CONFIG.baseUrl}/blog`,
    author: {
      "@type": "Organization",
      name: "Kinghouse Management",
      url: SITE_CONFIG.baseUrl,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_CONFIG.baseUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: {
        "@type": "Organization",
        name: post.author.name,
      },
      image: post.heroImage,
      keywords: post.seoKeywords.join(", "),
    })),
  }


  return (
    <main className="min-h-screen bg-white">
      <script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexSchema) }}
      />

      {/* Hero Header */}
      <section className="border-b border-[#EBEBEB] bg-[#FAFAFA] pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#222222]">
              <BookOpen className="h-4 w-4 text-[#A69C8E]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A69C8E]">
              KingHouse Journal
            </span>
          </div>
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#222222] font-normal leading-tight mb-4">
              Insights & Strategic Guides
              <br />
              <span className="text-[#A69C8E]">for Jabodetabek Properties</span>
            </h1>
            <p className="text-base sm:text-lg text-[#717171] font-light leading-relaxed max-w-xl">
              Airbnb algorithms, regional market analyses, and operational guides from the KingHouse team to maximize your property yields.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-8 mt-10 pt-10 border-t border-[#EBEBEB]">
            <div className="space-y-0.5">
              <p className="font-serif text-2xl text-[#222225]">{posts.length}</p>
              <p className="text-xs text-[#A69C8E] uppercase tracking-wider">Articles Live</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-serif text-2xl text-[#222225]">4</p>
              <p className="text-xs text-[#A69C8E] uppercase tracking-wider">Managed Areas</p>
            </div>
            <div className="space-y-0.5">
              <p className="font-serif text-2xl text-[#222225]">Free</p>
              <p className="text-xs text-[#A69C8E] uppercase tracking-wider">Open Access</p>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Rss className="h-4 w-4 text-[#A69C8E]" />
              <span className="text-xs text-[#717171]">Direct API Dynamic Synced</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Blog Index & Filters */}
      <BlogIndexClient initialPosts={posts} />

      {/* CTA Banner */}
      <section className="bg-[#222222] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Ready to Maximize Your Property Yields?
          </h2>
          <p className="text-[#A69C8E] text-sm mb-8 max-w-md mx-auto">
            Consult with KingHouse asset managers regarding your Airbnb listing. Zero commitment, complimentary audit.
          </p>
          <a
            href="https://wa.me/6282123933218?text=Hello%20KingHouse!%20I%20would%20like%20a%20consultation%20regarding%20my%20Airbnb%20property%20management."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white text-[#222222] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#F5F4F0] transition-colors"
          >
            <span>Free WhatsApp Consultation</span>
          </a>
        </div>
      </section>
    </main>
  )
}
