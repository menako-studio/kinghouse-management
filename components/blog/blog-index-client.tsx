"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { BlogPost } from "@/lib/types"
import { BlogCard } from "@/components/blog/blog-card"

interface BlogIndexClientProps {
  initialPosts: BlogPost[]
}

const CATEGORY_FILTERS = [
  { slug: "all", label: "All Articles" },
  { slug: "owner-tips", label: "Owner Insights" },
  { slug: "airbnb-seo", label: "Airbnb SEO" },
  { slug: "revenue-management", label: "Yield & Revenue" },
  { slug: "jabodetabek-guide", label: "Area Guides" },
]

export function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.seoKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [initialPosts, selectedCategory, searchQuery])

  const featuredPosts = filteredPosts.filter((p) => p.featured)
  const regularPosts = filteredPosts.filter((p) => !p.featured)

  return (
    <>
      {/* Category Filter Tabs & Search */}
      <section className="border-b border-[#EBEBEB] bg-white sticky top-16 z-20 shadow-xs">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-[#222222] text-white shadow-xs"
                    : "text-[#717171] hover:text-[#222222] hover:bg-[#F5F4F0] bg-[#FAFAFA] border border-[#EBEBEB]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#717171]" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 rounded-full bg-[#FAFAFA] border border-[#EBEBEB] text-xs focus:outline-none focus:border-[#222222] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && selectedCategory === "all" && !searchQuery && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-[#222222]">Featured Article</h2>
              <span className="text-xs text-[#A69C8E] uppercase tracking-wider font-medium">Editor&apos;s Pick</span>
            </div>
            <div className="space-y-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles Grid */}
      <section className="pb-24 bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-[#222222]">
              {selectedCategory === "all" && !searchQuery ? "All Articles" : "Filtered Articles"}
            </h2>
            <span className="text-xs text-[#A69C8E]">{filteredPosts.length} posts</span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === "all" && !searchQuery ? regularPosts : filteredPosts).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#EBEBEB] bg-white p-12 text-center space-y-3 shadow-xs">
              <p className="font-serif text-xl text-[#222222]">No Articles Found</p>
              <p className="text-xs text-[#717171] max-w-sm mx-auto">
                No published articles matched your search query. Try clearing the filter to see all hospitality insights.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all")
                  setSearchQuery("")
                }}
                className="px-5 py-2 rounded-full bg-[#222222] text-white text-xs font-semibold hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
