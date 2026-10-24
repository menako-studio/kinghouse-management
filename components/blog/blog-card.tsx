"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Calendar, ArrowRight, Tag } from "lucide-react"
import { BlogPost } from "@/lib/types"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
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

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category
  const categoryColor = CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-700 border-gray-200"

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-[#EBEBEB] bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span
              className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full border ${categoryColor}`}
            >
              {categoryLabel}
            </span>
          </div>
          {/* Content */}
          <div className="p-8 lg:p-10 flex flex-col justify-between">
            <div className="space-y-4">
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
              <h2 className="font-serif text-2xl lg:text-3xl text-[#222222] leading-snug group-hover:text-[#A69C8E] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-[#717171] leading-relaxed line-clamp-3">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-[#EBEBEB] mt-6">
              <div className="flex items-center space-x-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#F5F4F0]">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#222222]">{post.author.name}</p>
                  <p className="text-xs text-[#A69C8E]">{post.author.role}</p>
                </div>
              </div>
              <span className="flex items-center space-x-1 text-xs font-semibold text-[#222222] group-hover:gap-2 transition-all">
                <span>Read</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="rounded-2xl overflow-hidden border border-[#EBEBEB] bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor}`}
          >
            {categoryLabel}
          </span>
        </div>
        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center space-x-3 text-xs text-[#A69C8E] mb-3">
            <span className="flex items-center space-x-1">
              <Calendar className="h-2.5 w-2.5" />
              <span>{formattedDate}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center space-x-1">
              <Clock className="h-2.5 w-2.5" />
              <span>{post.readTime} min</span>
            </span>
          </div>
          <h3 className="font-serif text-lg text-[#222222] leading-snug group-hover:text-[#A69C8E] transition-colors mb-3 flex-1">
            {post.title}
          </h3>
          <p className="text-xs text-[#717171] leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center space-x-1 text-xs text-[#A69C8E] bg-[#F5F4F0] px-2 py-0.5 rounded-full"
              >
                <Tag className="h-2 w-2" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#EBEBEB]">
            <div className="flex items-center space-x-2">
              <div className="relative h-6 w-6 rounded-full overflow-hidden bg-[#F5F4F0]">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <p className="text-xs font-medium text-[#717171]">{post.author.name}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[#A69C8E] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  )
}
