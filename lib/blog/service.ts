import { BlogPost } from "@/lib/types"
import { BLOG_POSTS } from "@/lib/data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// In-memory runtime store initialized with verified seed articles
let runtimeBlogPosts: (BlogPost & { status?: string })[] = BLOG_POSTS.map((post) => ({ ...post, status: "Published" }))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRowToBlogPost(row: any): BlogPost & { status: string; seoScore: number } {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    heroImage: row.cover_image || "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
    author: {
      name: row.author_name || "KingHouse Hospitality",
      avatar: row.author_avatar || "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
      role: "Property Management Specialist",
    },
    publishedAt: typeof row.published_at === "string" ? row.published_at.split("T")[0] : row.published_at || row.created_at,
    readTime: typeof row.reading_time === "number" ? row.reading_time : 4,
    tags: Array.isArray(row.tags) ? row.tags : [],
    seoKeywords: Array.isArray(row.tags) ? row.tags : [],
    featured: Boolean(row.seo_score && row.seo_score >= 90),
    status: row.status || "Published",
    seoScore: typeof row.seo_score === "number" ? row.seo_score : 85,
  }
}

export interface BlogFilterOptions {
  category?: string
  status?: "Published" | "Draft" | "Archived" | "all"
  search?: string
  slug?: string
}

/**
 * Fetch all blog posts dynamically from Supabase or memory fallback
 */
export async function getBlogPosts(options?: BlogFilterOptions): Promise<(BlogPost & { status?: string; seoScore?: number })[]> {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    try {
      let query = supabase.from("blog_posts").select("*").order("published_at", { ascending: false })

      if (options?.category && options.category !== "All" && options.category !== "all") {
        query = query.ilike("category", options.category)
      }

      if (options?.status && options.status !== "all") {
        query = query.eq("status", options.status)
      } else if (!options?.status) {
        // Default public fetch excludes Archived (soft deleted)
        query = query.neq("status", "Archived")
      }

      if (options?.slug) {
        query = query.eq("slug", options.slug)
      }

      const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error("Supabase fetch timeout") }), 1500)
      )

      const { data, error } = (await Promise.race([query, timeoutPromise])) as {
        data: Record<string, unknown>[] | null
        error: unknown
      }

      if (!error && data && data.length > 0) {
        let results = data.map(mapRowToBlogPost)
        if (options?.search) {
          const q = options.search.toLowerCase()
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.excerpt.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          )
        }
        return results
      }
    } catch (err) {
      console.warn("Supabase blog fetch failed, using runtime fallback:", err)
    }
  }

  // Fallback to runtime memory store
  let filtered = [...runtimeBlogPosts]

  if (options?.status && options.status !== "all") {
    filtered = filtered.filter((p) => (p.status || "Published") === options.status)
  } else if (!options?.status) {
    filtered = filtered.filter((p) => (p.status || "Published") !== "Archived")
  }

  if (options?.category && options.category !== "All" && options.category !== "all") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === options.category?.toLowerCase()
    )
  }

  if (options?.slug) {
    filtered = filtered.filter((p) => p.slug === options.slug)
  }

  if (options?.search) {
    const q = options.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  return filtered
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<(BlogPost & { status?: string; seoScore?: number }) | null> {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    try {
      const query = supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle()

      const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error("Supabase single fetch timeout") }), 1500)
      )

      const { data, error } = (await Promise.race([query, timeoutPromise])) as {
        data: Record<string, unknown> | null
        error: unknown
      }

      if (!error && data) {
        return mapRowToBlogPost(data)
      }
    } catch (err) {
      console.warn("Supabase single blog fetch failed:", err)
    }
  }

  const found = runtimeBlogPosts.find((p) => p.slug === slug)
  return found || null
}

/**
 * Create or save a blog post
 */
export async function saveBlogPost(post: BlogPost, status: "Published" | "Draft" | "Archived" = "Published", seoScore = 85) {
  const supabase = getSupabaseServerClient()

  const dbRecord = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    cover_image: post.heroImage,
    author_name: post.author.name,
    author_avatar: post.author.avatar,
    published_at: post.publishedAt || new Date().toISOString().split("T")[0],
    status,
    reading_time: `${post.readTime} min read`,
    tags: post.tags,
    seo_score: seoScore,
    meta_title: post.title,
    meta_description: post.excerpt,
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("blog_posts").upsert(dbRecord, { onConflict: "slug" })
      if (error) {
        console.warn("Supabase upsert warning:", error)
      }
    } catch (err) {
      console.warn("Supabase upsert error:", err)
    }
  }

  // Update in-memory store
  const existingIdx = runtimeBlogPosts.findIndex((p) => p.id === post.id || p.slug === post.slug)
  if (existingIdx >= 0) {
    runtimeBlogPosts[existingIdx] = { ...post, status }
  } else {
    runtimeBlogPosts = [{ ...post, status }, ...runtimeBlogPosts]
  }

  return { ...post, status, seoScore }
}

/**
 * Soft delete or hard delete a blog post
 */
export async function deleteBlogPost(idOrSlug: string, permanent = false): Promise<boolean> {
  const supabase = getSupabaseServerClient()

  if (permanent) {
    if (supabase) {
      try {
        await supabase
          .from("blog_posts")
          .delete()
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      } catch (err) {
        console.warn("Supabase permanent delete error:", err)
      }
    }
    runtimeBlogPosts = runtimeBlogPosts.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug)
  } else {
    // Soft delete: set status to Archived
    if (supabase) {
      try {
        await supabase
          .from("blog_posts")
          .update({ status: "Archived" })
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      } catch (err) {
        console.warn("Supabase soft delete error:", err)
      }
    }
    const target = runtimeBlogPosts.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
    if (target) {
      target.status = "Archived"
    }
  }

  return true
}

/**
 * Restore a soft-deleted blog post
 */
export async function restoreBlogPost(idOrSlug: string): Promise<boolean> {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    try {
      await supabase
        .from("blog_posts")
        .update({ status: "Draft" })
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    } catch (err) {
      console.warn("Supabase restore error:", err)
    }
  }

  const target = runtimeBlogPosts.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
  if (target) {
    target.status = "Draft"
  }

  return true
}
