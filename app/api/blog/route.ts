import { NextRequest, NextResponse } from "next/server"
import { getBlogPosts, getBlogPostBySlug, saveBlogPost, deleteBlogPost, restoreBlogPost } from "@/lib/blog/service"
import { BlogPost } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const slug = searchParams.get("slug") || undefined
    const status = (searchParams.get("status") as "Published" | "Draft" | "Archived" | "all") || undefined
    const search = searchParams.get("search") || undefined

    if (slug) {
      const post = await getBlogPostBySlug(slug)
      if (!post) {
        return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 })
      }
      return NextResponse.json({ success: true, post })
    }

    const posts = await getBlogPosts({ category, status, search })

    return NextResponse.json({
      success: true,
      total: posts.length,
      posts,
    })
  } catch (err) {
    console.error("GET /api/blog error:", err)
    return NextResponse.json({ error: "Gagal mengambil data blog" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { action, id, slug } = body

    if (action === "restore" && (id || slug)) {
      await restoreBlogPost(id || slug)
      return NextResponse.json({ success: true, message: "Artikel berhasil dipulihkan (Restored)." })
    }

    const { title, excerpt, content, category, heroImage, authorName, authorRole, tags, seoKeywords, seoScore, readTime, status } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul (title) dan isi artikel (content) wajib diisi." },
        { status: 400 }
      )
    }

    const finalSlug = slug || title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")
    const postId = id || `post-${Date.now()}`

    const newPost: BlogPost = {
      id: postId,
      slug: finalSlug,
      title,
      excerpt: excerpt || content.slice(0, 150) + "...",
      content,
      category: category || "owner-tips",
      heroImage: heroImage || "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
      author: {
        name: authorName || "Kinghouse Hospitality",
        avatar: "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
        role: authorRole || "Property Management Specialist",
      },
      publishedAt: new Date().toISOString().split("T")[0],
      readTime: typeof readTime === "number" ? readTime : Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      tags: Array.isArray(tags) ? tags : [category || "tips"],
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : [],
      featured: Boolean(seoScore && seoScore >= 90),
    }

    const saved = await saveBlogPost(newPost, status || "Published", seoScore || 85)

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diterbitkan.",
      post: saved,
    }, { status: 201 })
  } catch (err) {
    console.error("POST /api/blog error:", err)
    return NextResponse.json({ error: "Gagal membuat artikel blog" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { id, slug, title, excerpt, content, category, heroImage, authorName, authorRole, tags, seoKeywords, seoScore, readTime, status } = body

    if (!id && !slug) {
      return NextResponse.json({ error: "ID atau Slug artikel wajib disertakan untuk pembaruan." }, { status: 400 })
    }

    const existing = await getBlogPostBySlug(slug || id)
    const targetId = id || existing?.id || `post-${Date.now()}`
    const targetSlug = slug || existing?.slug || title?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")

    const updatedPost: BlogPost = {
      id: targetId,
      slug: targetSlug,
      title: title || existing?.title || "Untitled Article",
      excerpt: excerpt !== undefined ? excerpt : existing?.excerpt || "",
      content: content !== undefined ? content : existing?.content || "",
      category: category || existing?.category || "owner-tips",
      heroImage: heroImage || existing?.heroImage || "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
      author: {
        name: authorName || existing?.author.name || "Kinghouse Hospitality",
        avatar: existing?.author.avatar || "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
        role: authorRole || existing?.author.role || "Property Management Specialist",
      },
      publishedAt: existing?.publishedAt || new Date().toISOString().split("T")[0],
      readTime: typeof readTime === "number" ? readTime : existing?.readTime || 4,
      tags: Array.isArray(tags) ? tags : existing?.tags || [],
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : existing?.seoKeywords || [],
      featured: Boolean((seoScore !== undefined ? seoScore : 85) >= 90),
    }

    const saved = await saveBlogPost(updatedPost, status || existing?.status || "Published", seoScore || existing?.seoScore || 85)

    return NextResponse.json({
      success: true,
      message: "Artikel berhasil diperbarui.",
      post: saved,
    })
  } catch (err) {
    console.error("PUT /api/blog error:", err)
    return NextResponse.json({ error: "Gagal memperbarui artikel blog" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const slug = searchParams.get("slug")
    const permanent = searchParams.get("permanent") === "true"
    const target = id || slug

    if (!target) {
      return NextResponse.json({ error: "Parameter ID atau Slug wajib diisi untuk menghapus artikel." }, { status: 400 })
    }

    await deleteBlogPost(target, permanent)

    return NextResponse.json({
      success: true,
      message: permanent
        ? `Artikel #${target} berhasil dihapus permanen.`
        : `Artikel #${target} berhasil dipindahkan ke Sampah (Soft Delete).`,
    })
  } catch (err) {
    console.error("DELETE /api/blog error:", err)
    return NextResponse.json({ error: "Gagal menghapus artikel blog" }, { status: 500 })
  }
}
