import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Clock, Calendar, ArrowLeft, Tag, ArrowRight } from "lucide-react"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog/service"
import { SITE_CONFIG } from "@/lib/constants"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return { title: "Article Not Found | KingHouse" }
  }

  return {
    title: `${post.title} | KingHouse Blog`,
    description: post.excerpt,
    keywords: post.seoKeywords,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.heroImage, width: 1600, height: 900, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage],
    },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  "owner-tips": "Owner Insights",
  "airbnb-seo": "Airbnb SEO",
  "jabodetabek-guide": "Area Guide",
  "revenue-management": "Revenue Strategy",
  "guest-experience": "Guest Experience",
}

const CATEGORY_COLORS: Record<string, string> = {
  "owner-tips": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "airbnb-seo": "bg-blue-50 text-blue-700 border-blue-200",
  "jabodetabek-guide": "bg-amber-50 text-amber-700 border-amber-200",
  "revenue-management": "bg-purple-50 text-purple-700 border-purple-200",
  "guest-experience": "bg-rose-50 text-rose-700 border-rose-200",
}

// Enhanced SEO-optimized markdown renderer for article content
function renderContent(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // 1. Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-serif text-2xl sm:text-3xl text-[#222222] mt-10 mb-4 font-normal tracking-tight">
          {line.slice(3)}
        </h2>
      )
    }
    // 2. Heading 3
    else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-serif text-xl sm:text-2xl text-[#222222] mt-8 mb-3 font-normal">
          {line.slice(4)}
        </h3>
      )
    }
    // 3. In-Content Markdown Image: ![Alt Text](imageUrl)
    else if (line.startsWith("![") && line.includes("](") && line.endsWith(")")) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)$/)
      if (match) {
        const altText = match[1] || "KingHouse Hospitality Visual"
        const imageUrl = match[2]
        elements.push(
          <figure key={`img-${i}`} className="my-8 rounded-3xl overflow-hidden border border-[#E8E4DC] bg-[#FAF8F5] p-2 space-y-2 shadow-xs">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#EAE7E0]">
              <Image src={imageUrl} alt={altText} fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            {altText && (
              <figcaption className="text-center text-xs text-[#717171] font-light py-1 px-4 italic">
                {altText}
              </figcaption>
            )}
          </figure>
        )
      }
    }
    // 4. Blockquote: > Callout text
    else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-[#B8934C] bg-[#FAF8F5] px-6 py-4 rounded-r-2xl my-6 text-sm sm:text-base text-[#222225] font-serif italic shadow-xs">
          {line.slice(2)}
        </blockquote>
      )
    }
    // 5. Bullet list: - Item
    else if (line.startsWith("- ")) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        listItems.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-none space-y-2.5 my-5 pl-2">
          {listItems.map((item, idx) => {
            const formatted = item
              .replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[#222222] font-semibold'>$1</strong>")
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-[#B8934C] hover:underline font-semibold'>$1</a>")
            return (
              <li key={idx} className="flex items-start space-x-3 text-sm sm:text-base text-[#555] leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B8934C] flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatted }} />
              </li>
            )
          })}
        </ul>
      )
      continue
    }
    // 6. Italic single line
    else if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      elements.push(
        <p key={`it-${i}`} className="text-xs text-[#8C7F5F] italic border-l-2 border-[#E8E4DC] pl-4 my-4">
          {line.slice(1, -1)}
        </p>
      )
    }
    // 7. Regular paragraph with links and bold formatting
    else if (line.trim() !== "") {
      const formatted = line
        .replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[#222222] font-semibold'>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-[#B8934C] hover:underline font-semibold'>$1</a>")

      elements.push(
        <p
          key={`p-${i}`}
          className="text-sm sm:text-base text-[#555] leading-relaxed my-4 font-light"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      )
    }
    i++
  }
  return elements
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getBlogPosts()
  const relatedPosts = allPosts.filter(
    (p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
  ).slice(0, 3)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    url: `${SITE_CONFIG.baseUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: SITE_CONFIG.baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Kinghouse Management",
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.baseUrl}/favicon.ico` },
    },
    keywords: post.seoKeywords.join(", "),
    wordCount: post.content.split(" ").length,
    timeRequired: `PT${post.readTime}M`,
    inLanguage: "id-ID",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.baseUrl}/blog/${post.slug}`,
    },
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const categoryColor = CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-700 border-gray-200"

  return (
    <main className="min-h-screen bg-white">
      <script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero Image */}
      <div className="relative h-[45vh] sm:h-[55vh] w-full">
        <Image src={post.heroImage} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="mx-auto max-w-4xl">
            <span
              className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border mb-4 ${categoryColor}`}
            >
              {categoryLabel}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-[#EBEBEB]">
          <div className="flex items-center space-x-3">
            <div className="relative h-9 w-9 rounded-full overflow-hidden">
              <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#222222]">{post.author.name}</p>
              <p className="text-xs text-[#A69C8E]">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-[#A69C8E]">
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{post.readTime} min read</span>
            </span>
          </div>
        </div>

        {/* Lead / Excerpt */}
        <div className="py-8 border-b border-[#EBEBEB]">
          <p className="text-lg sm:text-xl text-[#222222] font-light leading-relaxed font-serif italic">
            {post.excerpt}
          </p>
        </div>

        {/* Article Content */}
        <article className="py-10 prose-content max-w-none">
          {renderContent(post.content)}
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 py-8 border-t border-[#EBEBEB]">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center space-x-1 text-xs text-[#A69C8E] bg-[#F5F4F0] border border-[#EBEBEB] px-3 py-1 rounded-full"
            >
              <Tag className="h-2.5 w-2.5" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        {/* Back link */}
        <div className="pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-sm text-[#717171] hover:text-[#222222] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* CTA Banner */}
      <section className="bg-[#F5F4F0] border-t border-[#EBEBEB] py-16 mt-8">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          <div className="rounded-3xl bg-[#222222] p-10 sm:p-14 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">
              Optimize Your Property with KingHouse
            </h2>
            <p className="text-[#A69C8E] text-sm mb-8 max-w-sm mx-auto">
              Complimentary asset audit for villas and apartments across Greater Jakarta.
            </p>
            <a
              href="https://wa.me/6282123933218?text=Hello%20KingHouse!%20I%20read%20your%20journal%20article%20and%20would%20like%20a%20consultation%20for%20my%20property."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-[#222222] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#F5F4F0] transition-colors"
            >
              <span>Connect on WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-[#FAFAFA]">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <h2 className="font-serif text-2xl text-[#222222] mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const relCategoryLabel = CATEGORY_LABELS[related.category] ?? related.category
                const relCategoryColor =
                  CATEGORY_COLORS[related.category] ?? "bg-gray-50 text-gray-700 border-gray-200"
                return (
                  <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                    <div className="rounded-2xl overflow-hidden border border-[#EBEBEB] bg-white hover:shadow-md transition-shadow">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span
                          className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${relCategoryColor}`}
                        >
                          {relCategoryLabel}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-base text-[#222222] leading-snug group-hover:text-[#A69C8E] transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-xs text-[#717171] mt-2 line-clamp-2">{related.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
