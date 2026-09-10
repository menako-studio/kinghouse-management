"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  Trash2,
  X,
  Check,
  Tag,
  ImageIcon,
  ArrowRight,
  Filter,
  RefreshCw,
  ExternalLink,
  Layers,
  FileText,
  Heading,
  Bold,
  Italic,
  List,
  Quote,
  Link2,
  Undo,
  AlertCircle,
  ShieldCheck,
  BarChart2,
  CheckCircle2,
  Info,
} from "lucide-react"
import { BLOG_POSTS, CURATED_VILLAS } from "@/lib/data"
import { BlogPost } from "@/lib/types"

import { useNotifications } from "@/components/dashboard/notification-context"

export interface DashboardArticle {
  id: string
  title: string
  slug: string
  category: string
  author: {
    name: string
    role: string
    avatar: string
  }
  date: string
  status: "Published" | "Draft" | "Archived"
  views: string
  seoScore: number
  excerpt: string
  content: string
  heroImage: string
  tags: string[]
  seoKeywords: string[]
  readTime: number
}

const STORAGE_KEY = "kinghouse_cms_blog_articles_v4"

const CATEGORY_OPTIONS = [
  "Owner Tips",
  "Revenue Management",
  "Airbnb SEO",
  "Guest Experience",
  "Jabodetabek Guide",
  "Wedding & Events",
]

const IMAGE_PRESETS = [
  {
    name: "Versatile House Garden Pool (Jagakarsa)",
    url: "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    altSuggestion: "Kolam renang dan taman luas private villa Jagakarsa Jakarta Selatan",
  },
  {
    name: "Versatile House Master Bedroom (Jagakarsa)",
    url: "/properties/versatile-house/VersatileHouse_KamarUtama.webp",
    altSuggestion: "Kamar tidur utama King bed Versatile House Jagakarsa",
  },
  {
    name: "Sky House Hotel-Style Bed (Pinang Tangerang)",
    url: "/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg",
    altSuggestion: "Kamar tidur hotel-style Sky House Tangerang dekat IKEA",
  },
  {
    name: "Sky House Modern Kitchen (Pinang Tangerang)",
    url: "/properties/sky-house/SkyHouse_IKEA_Dapur.webp",
    altSuggestion: "Dapur bersih modern studio apartment Sky House Tangerang",
  },
  {
    name: "Skyline Luxury Living Lounge (Cikarang)",
    url: "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
    altSuggestion: "Executive master suite Skyline Luxury Orange County Cikarang",
  },
  {
    name: "Bright & Airy Apartment (Palmerah)",
    url: "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
    altSuggestion: "Apartemen modern minimalis Palmerah Jakarta Barat dekat stasiun",
  },
]

// Initialize default articles from SSOT
const INITIAL_DASHBOARD_ARTICLES: DashboardArticle[] = BLOG_POSTS.map((post, idx) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  category:
    post.category === "owner-tips"
      ? "Owner Tips"
      : post.category === "revenue-management"
      ? "Revenue Management"
      : post.category === "airbnb-seo"
      ? "Airbnb SEO"
      : post.category === "guest-experience"
      ? "Guest Experience"
      : "Jabodetabek Guide",
  author: post.author,
  date: post.publishedAt,
  status: idx === 4 ? "Draft" : "Published",
  views: idx === 0 ? "2,420" : idx === 1 ? "1,850" : idx === 2 ? "3,100" : idx === 3 ? "1,240" : "120",
  seoScore: idx === 0 ? 98 : idx === 1 ? 95 : idx === 2 ? 100 : idx === 3 ? 92 : 88,
  excerpt: post.excerpt,
  content: post.content,
  heroImage: post.heroImage,
  tags: post.tags,
  seoKeywords: post.seoKeywords,
  readTime: post.readTime,
}))

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function DashboardBlogPage() {
  const { addAlert, showToast } = useNotifications()

  const [articles, setArticles] = useState<DashboardArticle[]>(INITIAL_DASHBOARD_ARTICLES)
  const [isHydrated, setIsHydrated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Published" | "Draft" | "Archived">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState<{ id: string; title: string; permanent: boolean } | null>(null)
  const [activeTab, setActiveTab] = useState<"form" | "seo" | "preview">("form")

  // Form states
  const [formTitle, setFormTitle] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formCategory, setFormCategory] = useState("Owner Tips")
  const [formAuthorName, setFormAuthorName] = useState("KingHouse Editorial")
  const [formAuthorRole, setFormAuthorRole] = useState("Hospitality Asset Manager")
  const [formExcerpt, setFormExcerpt] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formHeroImage, setFormHeroImage] = useState(IMAGE_PRESETS[0].url)
  const [formFocusKeyword, setFormFocusKeyword] = useState("sewa villa jagakarsa")
  const [formKeywords, setFormKeywords] = useState("sewa villa jabodetabek, airbnb superhost, tips properti")
  const [formStatus, setFormStatus] = useState<"Published" | "Draft" | "Archived">("Published")
  const [formReadTime, setFormReadTime] = useState(5)

  // In-Content Image Inserter Modal Sub-State
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
  const [selectedPresetImage, setSelectedPresetImage] = useState(IMAGE_PRESETS[0].url)
  const [customImageUrl, setCustomImageUrl] = useState("")
  const [imageAltText, setImageAltText] = useState(IMAGE_PRESETS[0].altSuggestion)
  const [imagePickerTab, setImagePickerTab] = useState<"presets" | "custom">("presets")

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Mount flag for Portal
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Fetch articles from API
  const fetchArticlesFromApi = async () => {
    try {
      const res = await fetch("/api/blog?status=all")
      const data = await res.json()
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        const mapped: DashboardArticle[] = data.posts.map((p: BlogPost, idx: number) => ({
          id: p.id || `post-${idx}`,
          title: p.title,
          slug: p.slug,
          category:
            p.category === "owner-tips" || p.category === "Owner Tips"
              ? "Owner Tips"
              : p.category === "revenue-management" || p.category === "Revenue Management"
              ? "Revenue Management"
              : p.category === "airbnb-seo" || p.category === "Airbnb SEO"
              ? "Airbnb SEO"
              : p.category === "guest-experience" || p.category === "Guest Experience"
              ? "Guest Experience"
              : "Jabodetabek Guide",
          author: p.author || {
            name: "KingHouse Editorial",
            role: "Hospitality Asset Manager",
            avatar: "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
          },
          date: p.publishedAt || new Date().toISOString().split("T")[0],
          status: p.status || (idx === 4 ? "Draft" : "Published"),
          views: idx === 0 ? "2,420" : idx === 1 ? "1,850" : idx === 2 ? "3,100" : idx === 3 ? "1,240" : "120",
          seoScore: p.seoScore || (p.featured ? 95 : 85),
          excerpt: p.excerpt || "",
          content: p.content || "",
          heroImage: p.heroImage || IMAGE_PRESETS[0].url,
          tags: Array.isArray(p.tags) ? p.tags : [],
          seoKeywords: Array.isArray(p.seoKeywords) ? p.seoKeywords : [],
          readTime: p.readTime || 4,
        }))
        setArticles(mapped)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped))
        } catch {}
      }
    } catch (err) {
      console.warn("Failed to fetch articles from API, using cached state:", err)
    }
  }

  // Load initial from localStorage + API
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setArticles(parsed)
        }
      }
    } catch {}
    setIsHydrated(true)
    fetchArticlesFromApi()
  }, [])


  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
      } catch {}
    }
  }, [articles, isHydrated])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImagePickerOpen) setIsImagePickerOpen(false)
        else if (isModalOpen) setIsModalOpen(false)
        if (deleteConfirmArticle) setDeleteConfirmArticle(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen, isImagePickerOpen, deleteConfirmArticle])

  // Real-Time SEO Analyzer (Rank Math Style)
  const seoChecklist = useMemo(() => {
    const kw = formFocusKeyword.toLowerCase().trim()
    const titleLower = formTitle.toLowerCase()
    const excerptLower = formExcerpt.toLowerCase()
    const contentLower = formContent.toLowerCase()

    const hasTitleKw = kw.length > 2 && titleLower.includes(kw)
    const titleLengthOk = formTitle.length >= 35 && formTitle.length <= 70
    const hasExcerptKw = kw.length > 2 && (excerptLower.includes(kw) || contentLower.slice(0, 300).includes(kw))
    const excerptLengthOk = formExcerpt.length >= 70 && formExcerpt.length <= 180
    const wordCount = formContent.trim().split(/\s+/).filter(Boolean).length
    const wordCountOk = wordCount >= 300
    const hasH2 = formContent.includes("## ")
    const hasH3 = formContent.includes("### ")
    const hasImage = formContent.includes("![") && formContent.includes("](")
    const hasInternalLink = formContent.includes("](/villas") || formContent.includes("](/locations") || formContent.includes("](https://wa.me")

    let score = 30
    if (hasTitleKw) score += 15
    if (titleLengthOk) score += 10
    if (hasExcerptKw) score += 10
    if (excerptLengthOk) score += 5
    if (wordCountOk) score += 10
    if (hasH2) score += 8
    if (hasH3) score += 4
    if (hasImage) score += 4
    if (hasInternalLink) score += 4

    return {
      score: Math.min(100, score),
      wordCount,
      hasTitleKw,
      titleLengthOk,
      hasExcerptKw,
      excerptLengthOk,
      wordCountOk,
      hasH2,
      hasH3,
      hasImage,
      hasInternalLink,
    }
  }, [formTitle, formExcerpt, formContent, formFocusKeyword])

  // Formatting Toolbar Action Helper
  const insertMarkdownSyntax = (prefix: string, suffix = "") => {
    const textarea = contentTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formContent.substring(start, end) || "Teks Contoh"
    const replacement = `${prefix}${selectedText}${suffix}`

    const newContent = formContent.substring(0, start) + replacement + formContent.substring(end)
    setFormContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length)
    }, 50)
  }

  // Insert Internal Villa Link Helper
  const insertVillaLink = (villaSlug: string, villaName: string) => {
    const linkText = `[Lihat detail ${villaName}](/villas/${villaSlug})`
    insertMarkdownSyntax(`\n\n> 🏡 **Rekomendasi KingHouse**: `, `${linkText}\n\n`)
    showToast("Internal Link Disisipkan!", `Tautan ke ${villaName} ditambahkan untuk meningkatkan SEO Topical Authority.`, "info")
  }

  // Handle In-Content Image Insertion
  const handleInsertImageToContent = () => {
    const targetUrl = imagePickerTab === "presets" ? selectedPresetImage : customImageUrl.trim()
    if (!targetUrl) return

    const alt = imageAltText.trim() || formTitle || "Visual KingHouse Hospitality"
    const markdownImage = `\n\n![${alt}](${targetUrl})\n\n`

    const textarea = contentTextareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = formContent.substring(0, start) + markdownImage + formContent.substring(end)
      setFormContent(newContent)
    } else {
      setFormContent((prev) => prev + markdownImage)
    }

    setIsImagePickerOpen(false)
    setCustomImageUrl("")
    showToast("Foto & Alt-Text Disisipkan!", "Gambar berhasil ditambahkan ke dalam artikel dengan tag SEO lengkap.", "success")
  }

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setModalMode("create")
    setEditingArticleId(null)
    setFormTitle("")
    setFormSlug("")
    setFormCategory("Owner Tips")
    setFormAuthorName("KingHouse Editorial")
    setFormAuthorRole("Hospitality Asset Manager")
    setFormExcerpt("")
    setFormFocusKeyword("sewa villa jagakarsa")
    setFormContent(
      "## Mengapa Pasar Hospitality di Jabodetabek Terus Bertumbuh\n\nPermintaan sewa villa keluarga dan staycation di area Jabodetabek mengalami lonjakan signifikan sepanjang tahun 2026.\n\n![Kolam renang dan taman luas private villa Jagakarsa](/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg)\n\n### 3 Faktor Utama Pendorong Okupansi Tinggi\n\n- **Kualitas Fasilitas & Kebersihan Hotel**: Tamu modern mendambakan standar linen dan AC prima.\n- **Konektivitas OTA 2-Arah**: Kalender sinkron tanpa double-booking.\n- **Topical SEO & Google Map Presence**: Listing yang mudah ditemukan di Google Organik.\n\n> 🏡 **Rekomendasi KingHouse**: [Lihat detail Versatile House Jagakarsa](/villas/versatile-house-jagakarsa) untuk inspirasi tata kelola aset premium."
    )
    setFormHeroImage(IMAGE_PRESETS[0].url)
    setFormKeywords("sewa villa jagakarsa, airbnb superhost, tips properti, yield manajemen")
    setFormStatus("Published")
    setFormReadTime(4)
    setActiveTab("form")
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (article: DashboardArticle) => {
    setModalMode("edit")
    setEditingArticleId(article.id)
    setFormTitle(article.title)
    setFormSlug(article.slug)
    setFormCategory(article.category)
    setFormAuthorName(article.author.name)
    setFormAuthorRole(article.author.role)
    setFormExcerpt(article.excerpt)
    setFormContent(article.content)
    setFormHeroImage(article.heroImage || IMAGE_PRESETS[0].url)
    setFormFocusKeyword(article.seoKeywords?.[0] || article.tags?.[0] || "sewa villa")
    setFormKeywords(article.seoKeywords ? article.seoKeywords.join(", ") : "")
    setFormStatus(article.status)
    setFormReadTime(article.readTime || 5)
    setActiveTab("form")
    setIsModalOpen(true)
  }

  // Handle Save (Create / Update)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()

    const rawKeywords = formKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    if (formFocusKeyword && !rawKeywords.includes(formFocusKeyword)) {
      rawKeywords.unshift(formFocusKeyword)
    }

    const finalSlug = formSlug || slugify(formTitle) || `artikel-${Date.now()}`

    const payload = {
      title: formTitle,
      slug: finalSlug,
      category: formCategory,
      excerpt: formExcerpt || formContent.slice(0, 140) + "...",
      content: formContent,
      heroImage: formHeroImage,
      authorName: formAuthorName || "KingHouse Editorial",
      authorRole: formAuthorRole || "Hospitality Asset Manager",
      tags: [formCategory.toLowerCase().replace(/\s+/g, "-")],
      seoKeywords: rawKeywords,
      seoScore: seoChecklist.score,
      readTime: formReadTime || 4,
      status: formStatus,
    }

    if (modalMode === "create") {
      const newArticle: DashboardArticle = {
        id: `blog-${Date.now()}`,
        ...payload,
        author: {
          name: payload.authorName,
          role: payload.authorRole,
          avatar: "/properties/versatile-house/VersatileHouse_Exterior_PoolAndGarden.webp",
        },
        date: new Date().toISOString().split("T")[0],
        views: formStatus === "Published" ? "120" : "—",
      }

      setArticles([newArticle, ...articles])
      setIsModalOpen(false)

      try {
        await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: newArticle.id }),
        })
      } catch (err) {
        console.warn("API Create Error:", err)
      }

      addAlert({
        title: `Artikel Diterbitkan: "${newArticle.title.slice(0, 35)}..."`,
        message: `SEO Score: ${newArticle.seoScore}/100. Langsung aktif di Google Index & Frontend /blog.`,
        category: "blog",
        actionUrl: `/dashboard/blog`,
      })

      showToast("Artikel Berhasil Dibuat!", `Status: ${newArticle.status}. SEO Score: ${newArticle.seoScore}/100.`, "success")
    } else if (modalMode === "edit" && editingArticleId) {
      setArticles(
        articles.map((art) => {
          if (art.id === editingArticleId) {
            return {
              ...art,
              title: formTitle,
              slug: finalSlug,
              category: formCategory,
              author: {
                ...art.author,
                name: formAuthorName,
                role: formAuthorRole,
              },
              excerpt: formExcerpt,
              content: formContent,
              heroImage: formHeroImage,
              status: formStatus,
              seoKeywords: rawKeywords,
              seoScore: seoChecklist.score,
              readTime: formReadTime,
            }
          }
          return art
        })
      )
      setIsModalOpen(false)

      try {
        await fetch("/api/blog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingArticleId }),
        })
      } catch (err) {
        console.warn("API Update Error:", err)
      }

      addAlert({
        title: `Artikel Diperbarui: "${formTitle.slice(0, 35)}..."`,
        message: `SEO Score: ${seoChecklist.score}/100. Data tersinkronisasi ke API.`,
        category: "blog",
        actionUrl: `/dashboard/blog`,
      })

      showToast("Perubahan Disimpan!", "Artikel dan metadata SEO berhasil diperbarui.", "success")
    }
  }

  // Soft Delete (Archive)
  const handleSoftDelete = async (article: DashboardArticle) => {
    setArticles(articles.map((a) => (a.id === article.id ? { ...a, status: "Archived" } : a)))
    setDeleteConfirmArticle(null)

    try {
      await fetch(`/api/blog?id=${encodeURIComponent(article.id)}`, {
        method: "DELETE", // default is soft delete to Archived
      })
    } catch (err) {
      console.warn("API Soft Delete Error:", err)
    }

    addAlert({
      title: `Artikel Dipindahkan ke Sampah: "${article.title.slice(0, 30)}..."`,
      message: `Artikel diarsipkan (Soft Delete). Peringkat Google tetap aman dari broken link 404.`,
      category: "blog",
    })

    showToast("Artikel Dipindahkan ke Sampah", `Status: Archived. Anda bisa memulihkannya kapan saja di tab Sampah.`, "info")
  }

  // Permanent Delete
  const handlePermanentDelete = async (id: string) => {
    const target = articles.find((a) => a.id === id)
    setArticles(articles.filter((a) => a.id !== id))
    setDeleteConfirmArticle(null)

    try {
      await fetch(`/api/blog?id=${encodeURIComponent(id)}&permanent=true`, {
        method: "DELETE",
      })
    } catch (err) {
      console.warn("API Permanent Delete Error:", err)
    }

    if (target) {
      showToast("Artikel Dihapus Permanen", `Artikel #${target.id} telah dihapus dari database.`, "info")
    }
  }

  // Restore Article
  const handleRestoreArticle = async (article: DashboardArticle) => {
    setArticles(articles.map((a) => (a.id === article.id ? { ...a, status: "Draft" } : a)))

    try {
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", id: article.id, slug: article.slug }),
      })
    } catch (err) {
      console.warn("API Restore Error:", err)
    }

    addAlert({
      title: `Artikel Dipulihkan: "${article.title.slice(0, 30)}..."`,
      message: `Status artikel dikembalikan menjadi Draft.`,
      category: "blog",
    })

    showToast("Artikel Berhasil Dipulihkan!", `Status sekarang: Draft. Siap diedit dan dipublikasikan.`, "success")
  }

  // 1-Click Status Toggle
  const handleToggleStatus = async (article: DashboardArticle) => {
    const nextStatus: "Published" | "Draft" = article.status === "Published" ? "Draft" : "Published"
    setArticles(articles.map((a) => (a.id === article.id ? { ...a, status: nextStatus } : a)))

    try {
      await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, slug: article.slug, status: nextStatus }),
      })
    } catch (err) {
      console.warn("API Toggle Status Error:", err)
    }

    showToast(
      nextStatus === "Published" ? "Artikel Dipublikasikan! ✓" : "Artikel Diubah Jadi Draft",
      `Status artikel sekarang: ${nextStatus}. Frontend /blog otomatis tersinkronisasi.`,
      nextStatus === "Published" ? "success" : "info"
    )
  }

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.seoKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus =
        statusFilter === "all"
          ? art.status !== "Archived" // by default "all" excludes Trash
          : art.status === statusFilter

      const matchesCategory = categoryFilter === "all" || art.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [articles, searchQuery, statusFilter, categoryFilter])

  // KPIs
  const publishedCount = articles.filter((a) => a.status === "Published").length
  const draftCount = articles.filter((a) => a.status === "Draft").length
  const archivedCount = articles.filter((a) => a.status === "Archived").length
  const activeArticles = articles.filter((a) => a.status !== "Archived")
  const avgSeo =
    activeArticles.length > 0
      ? (activeArticles.reduce((sum, a) => sum + (a.seoScore || 85), 0) / activeArticles.length).toFixed(1)
      : "0"

  return (
    <div className="space-y-8 animate-sana-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-[#222225] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E8E4DC] mb-3">
            <BookOpen className="h-3.5 w-3.5 text-[#B8934C]" />
            <span>EDITORIAL & SEO CMS SUITE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Editorial Blog & SEO Articles
          </h1>
          <p className="text-sm text-[#717171] mt-1 font-light leading-relaxed">
            Buat, edit, dan kelola artikel edukasi hospitality dengan editor media lengkap dan live SEO Scorecard untuk memenangkan peringkat 1 Google.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchArticlesFromApi}
            className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-[#717171] hover:text-[#222225] hover:bg-[#EAE7E0] transition-colors cursor-pointer"
            title="Refresh data dari Supabase API"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-2 bg-[#222225] text-white px-5 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#2B2A30] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#B8934C]" />
            <span>Buat Artikel Baru</span>
          </button>
        </div>
      </div>

      {/* Dynamic Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-1 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">
            Total Artikel Aktif
          </span>
          <p className="text-3xl font-bold text-[#222225] tracking-tight">{activeArticles.length}</p>
          <span className="inline-block text-[10px] font-semibold text-[#717171] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E8E4DC]">
            {publishedCount} Terbit &bull; {draftCount} Draft
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-1 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">
            Artikel Tayang (Live)
          </span>
          <p className="text-3xl font-bold text-emerald-700 tracking-tight">{publishedCount} Live</p>
          <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Terindeks di Google & /blog
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-1 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">
            Rata-Rata SEO Score
          </span>
          <p className="text-3xl font-bold text-[#222225] tracking-tight">{avgSeo} / 100</p>
          <span className="inline-block text-[10px] font-semibold text-[#B8934C] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E8E4DC]">
            Standar Editorial SEO
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-1 hover:-translate-y-0.5 transition-transform">
          <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">
            Sampah (Soft Deleted)
          </span>
          <p className="text-3xl font-bold text-[#717171] tracking-tight">{archivedCount}</p>
          <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Zero Broken Link (404)
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717171]" />
          <input
            type="text"
            placeholder="Cari judul artikel, topik, atau kata kunci SEO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs focus:outline-none focus:border-[#B8934C] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs (Including Soft-Delete Trash) */}
          <div className="flex items-center space-x-1 bg-[#FAF8F5] p-1 rounded-2xl border border-[#E8E4DC]">
            {[
              { key: "all", label: "Semua" },
              { key: "Published", label: "Published" },
              { key: "Draft", label: "Draft" },
              { key: "Archived", label: `Sampah (${archivedCount})` },
            ].map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => setStatusFilter(st.key as "all" | "Published" | "Draft" | "Archived")}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st.key
                    ? "bg-[#222225] text-white shadow-xs"
                    : "text-[#717171] hover:text-[#222225]"
                }`}
              >
                {st.label}

              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-medium text-[#222225] focus:outline-none focus:border-[#B8934C] cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#222225] hover:text-[#B8934C] px-3 py-1.5 rounded-2xl hover:bg-[#FAF8F5] transition-colors"
          >
            <span>Public Blog</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Article Table */}
      <div className="rounded-3xl border border-[#E8E4DC] bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
        <div className="p-6 sm:p-8 border-b border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-[#FAF8F5]">
          <div>
            <h3 className="text-xl text-[#222225] font-semibold">
              Daftar Artikel {statusFilter === "Archived" ? "Sampah (Archived)" : "Aktif"} ({filteredArticles.length})
            </h3>
            <p className="text-xs text-[#717171] mt-0.5">
              {statusFilter === "Archived"
                ? "Artikel yang dihapus tersimpan di sini agar Google tidak mengalami broken link 404. Anda dapat memulihkannya kapan saja."
                : "Klik judul untuk preview, tombol edit untuk mengubah konten, atau tombol status untuk switch draft/publish."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4DC] bg-[#FAFAF8] text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                <th className="py-4 px-6">Judul & Kategori</th>
                <th className="py-4 px-6">Status Publikasi</th>
                <th className="py-4 px-6">SEO Score</th>
                <th className="py-4 px-6">Tanggal Rilis</th>
                <th className="py-4 px-6">Estimasi Pembaca</th>
                <th className="py-4 px-6 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F5] text-xs">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#FAFAF8]/90 transition-colors group">
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#FAF8F5] border border-[#E8E4DC]">
                          <Image src={article.heroImage || IMAGE_PRESETS[0].url} alt={article.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#222225] line-clamp-1 group-hover:text-[#B8934C] transition-colors">
                            {article.title}
                          </p>
                          <div className="flex items-center space-x-2 text-[11px] text-[#717171] mt-0.5">
                            <span className="font-medium text-[#B8934C]">{article.category}</span>
                            <span>&bull;</span>
                            <span className="font-mono text-[10px]">/blog/{article.slug}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {article.status === "Archived" ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
                          <span>Archived (Trash)</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(article)}
                          title="Klik untuk mengubah status Publikasi"
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            article.status === "Published"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {article.status === "Published" ? (
                            <>
                              <CheckCircle className="h-3 w-3 text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 text-amber-600" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1.5 font-mono font-semibold text-[#222225]">
                        <Sparkles className={`h-3.5 w-3.5 ${article.seoScore >= 90 ? "text-[#B8934C]" : "text-amber-600"}`} />
                        <span>{article.seoScore || 85}/100</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#717171] font-mono">{article.date}</td>

                    <td className="py-4 px-6 font-semibold text-[#222225]">
                      {article.views} reads
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        {article.status === "Archived" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRestoreArticle(article)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px] transition-colors cursor-pointer border border-emerald-200"
                              title="Pulihkan Artikel ke Draft"
                            >
                              <Undo className="h-3.5 w-3.5" />
                              <span>Pulihkan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmArticle({ id: article.id, title: article.title, permanent: true })}
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Permanen dari Database"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(article)}
                              className="p-2 rounded-xl text-[#717171] hover:text-[#222225] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                              title="Edit Artikel & SEO"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <Link
                              href={`/blog/${article.slug}`}
                              target="_blank"
                              className="p-2 rounded-xl text-[#717171] hover:text-[#222225] hover:bg-[#FAF8F5] transition-colors"
                              title="Lihat Pratinjau Public"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmArticle({ id: article.id, title: article.title, permanent: false })}
                              className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Pindahkan ke Sampah (Soft Delete)"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#717171] space-y-2">
                    <p className="font-semibold text-[#222225]">Tidak ada artikel yang cocok dengan filter ini.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                        setCategoryFilter("all")
                      }}
                      className="text-[#B8934C] hover:underline font-semibold cursor-pointer"
                    >
                      Reset Filter Pencarian
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PORTAL: MAIN CREATE & EDIT MODAL WITH RICH TOOLBAR & SEO CHECKLIST */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <div className="bg-white rounded-3xl max-w-4xl w-full flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E8E4DC] max-h-[92vh] overflow-hidden">
              {/* Modal Header (Fixed) */}
              <div className="p-6 pb-4 border-b border-[#E8E4DC] flex items-center justify-between flex-shrink-0 bg-white">
                <div>
                  <h3 className="text-2xl text-[#222225] font-semibold">
                    {modalMode === "create" ? "Buat Artikel Blog & SEO Baru" : "Edit Konten & SEO Artikel"}
                  </h3>
                  <p className="text-xs text-[#717171] mt-0.5">
                    Editor ramah pengguna dengan live visual alt-tag inserter dan SEO scorecard untuk ranking 1 Google.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Live SEO Score Badge */}
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] font-mono text-xs font-bold text-[#222225]">
                    <Sparkles className="h-3.5 w-3.5 text-[#B8934C]" />
                    <span>SEO {seoChecklist.score}/100</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-9 w-9 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#717171] hover:text-[#222225] transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center space-x-2 px-6 pt-3 border-b border-[#FAF8F5] bg-white flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`px-4 py-2 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "form"
                      ? "border-[#222225] text-[#222225]"
                      : "border-transparent text-[#717171] hover:text-[#222225]"
                  }`}
                >
                  📝 Form & Markdown Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`px-4 py-2 border-b-2 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === "seo"
                      ? "border-[#222225] text-[#222225]"
                      : "border-transparent text-[#717171] hover:text-[#222225]"
                  }`}
                >
                  <BarChart2 className="h-3.5 w-3.5 text-[#B8934C]" />
                  <span>🎯 Live SEO Inspector ({seoChecklist.score}/100)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-2 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "border-[#222225] text-[#222225]"
                      : "border-transparent text-[#717171] hover:text-[#222225]"
                  }`}
                >
                  👁️ Pratinjau Tampilan Live
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white">
                {activeTab === "form" ? (
                  <form id="article-form" onSubmit={handleSaveArticle} className="space-y-5 text-xs">
                    {/* Title & Slug */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-semibold text-[#555] uppercase tracking-wider">
                            Judul Artikel (Headline H1) *
                          </label>
                          <span className={`text-[11px] font-mono ${seoChecklist.titleLengthOk ? "text-emerald-700 font-bold" : "text-amber-700"}`}>
                            {formTitle.length} karakter (Rekomendasi: 40-60)
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Cara Meningkatkan Okupansi Villa di Jagakarsa: Panduan Lengkap 2026"
                          value={formTitle}
                          onChange={(e) => {
                            setFormTitle(e.target.value)
                            if (modalMode === "create") {
                              setFormSlug(slugify(e.target.value))
                            }
                          }}
                          className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-semibold text-[#222225] focus:outline-none focus:border-[#B8934C] text-sm shadow-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                            Target Keyword Utama (Focus SEO) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="sewa villa jagakarsa"
                            value={formFocusKeyword}
                            onChange={(e) => setFormFocusKeyword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                            URL Slug
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="cara-meningkatkan-okupansi-villa"
                            value={formSlug}
                            onChange={(e) => setFormSlug(slugify(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-mono text-[11px] text-[#555] focus:outline-none focus:border-[#B8934C]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                            Kategori Artikel
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                          >
                            {CATEGORY_OPTIONS.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-semibold text-[#555] uppercase tracking-wider">
                          Ringkasan Singkat (Lead / Meta Description Google) *
                        </label>
                        <span className={`text-[11px] font-mono ${seoChecklist.excerptLengthOk ? "text-emerald-700 font-bold" : "text-amber-700"}`}>
                          {formExcerpt.length} karakter (Rekomendasi: 120-160)
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        required
                        placeholder="Tulis 1-2 kalimat ringkasan yang menarik minat pembaca dan mengandung target keyword untuk cuplikan Google SERP..."
                        value={formExcerpt}
                        onChange={(e) => setFormExcerpt(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C] leading-relaxed resize-none"
                      />
                    </div>

                    {/* Markdown Toolbar & In-Content Media */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-[#555] uppercase tracking-wider">
                          Isi Konten Artikel (Markdown) *
                        </label>
                        <span className="text-[11px] text-[#717171] font-mono">
                          {seoChecklist.wordCount} kata &bull; Est. {Math.max(1, Math.ceil(seoChecklist.wordCount / 200))} menit baca
                        </span>
                      </div>

                      {/* FORMATTING TOOLBAR */}
                      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#FAF8F5] border border-[#E8E4DC] rounded-2xl">
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax("## ")}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#E8E4DC] text-[#222225] hover:bg-[#EAE7E0] font-bold text-xs flex items-center space-x-1 cursor-pointer"
                          title="Tambahkan Subheading H2"
                        >
                          <Heading className="h-3.5 w-3.5 text-[#B8934C]" />
                          <span>H2</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax("### ")}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#E8E4DC] text-[#222225] hover:bg-[#EAE7E0] font-bold text-xs flex items-center space-x-1 cursor-pointer"
                          title="Tambahkan Subheading H3"
                        >
                          <Heading className="h-3 w-3 text-[#B8934C]" />
                          <span>H3</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax("**", "**")}
                          className="p-1.5 rounded-xl bg-white border border-[#E8E4DC] text-[#222225] hover:bg-[#EAE7E0] cursor-pointer"
                          title="Teks Tebal (Bold)"
                        >
                          <Bold className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax("*", "*")}
                          className="p-1.5 rounded-xl bg-white border border-[#E8E4DC] text-[#222225] hover:bg-[#EAE7E0] cursor-pointer"
                          title="Teks Miring (Italic)"
                        >
                          <Italic className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax("- ")}
                          className="p-1.5 rounded-xl bg-white border border-[#E8E4DC] text-[#222225] hover:bg-[#EAE7E0] cursor-pointer"
                          title="Daftar Poin (List)"
                        >
                          <List className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax("> ")}
                          className="p-1.5 rounded-xl bg-white border border-[#E8E4DC] text-[#222225] hover:bg-[#EAE7E0] cursor-pointer"
                          title="Kutipan (Blockquote)"
                        >
                          <Quote className="h-3.5 w-3.5" />
                        </button>

                        <div className="h-4 w-px bg-[#D5CFC3] mx-1" />

                        {/* IN-CONTENT IMAGE INSERTER BUTTON */}
                        <button
                          type="button"
                          onClick={() => setIsImagePickerOpen(true)}
                          className="px-3 py-1 rounded-xl bg-[#222225] text-white hover:bg-[#2B2A30] font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
                          title="Sisipkan foto berkualitas tinggi dengan Alt Tag SEO ke artikel"
                        >
                          <ImageIcon className="h-3.5 w-3.5 text-[#B8934C]" />
                          <span>+ Sisipkan Foto (Alt SEO)</span>
                        </button>

                        {/* INTERNAL LINK PRESET SELECTOR */}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const villa = CURATED_VILLAS.find((v) => v.slug === e.target.value)
                              if (villa) insertVillaLink(villa.slug, villa.name)
                              e.target.value = ""
                            }
                          }}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#E8E4DC] text-[11px] font-medium text-[#222225] focus:outline-none cursor-pointer"
                        >
                          <option value="">🔗 Sisipkan Link Villa...</option>
                          {CURATED_VILLAS.map((v) => (
                            <option key={v.slug} value={v.slug}>
                              {v.name} ({v.area})
                            </option>
                          ))}
                        </select>
                      </div>

                      <textarea
                        ref={contentTextareaRef}
                        rows={10}
                        required
                        placeholder="Tulis isi artikel secara lengkap di sini. Gunakan tombol toolbar di atas untuk menyisipkan subjudul, gambar, atau link..."
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-mono text-xs text-[#222225] focus:outline-none focus:border-[#B8934C] leading-relaxed resize-y"
                      />
                    </div>

                    {/* Cover Hero Image & Preset Picker */}
                    <div>
                      <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                        Gambar Sampul Utama (Hero Cover)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {IMAGE_PRESETS.slice(0, 4).map((preset) => (
                          <div
                            key={preset.name}
                            onClick={() => setFormHeroImage(preset.url)}
                            className={`relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                              formHeroImage === preset.url
                                ? "border-[#B8934C] ring-2 ring-[#B8934C]/20 scale-[1.02]"
                                : "border-transparent opacity-75 hover:opacity-100"
                            }`}
                          >
                            <Image src={preset.url} alt={preset.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                              <span className="text-[10px] text-white font-medium line-clamp-1">{preset.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status & Read Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#FAF8F5]">
                      <div>
                        <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                          Status Publikasi
                        </label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as "Published" | "Draft" | "Archived")}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-semibold text-[#222225] focus:outline-none focus:border-[#B8934C]"
                        >
                          <option value="Published">Published (Tayang di Web & Terindeks)</option>
                          <option value="Draft">Draft (Disimpan Internal)</option>
                          <option value="Archived">Archived (Sampah / Soft Delete)</option>
                        </select>

                      </div>

                      <div>
                        <label className="block font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                          Kata Kunci Tambahan (Pisahkan Koma)
                        </label>
                        <input
                          type="text"
                          placeholder="sewa villa jagakarsa, airbnb jakarta, tips properti"
                          value={formKeywords}
                          onChange={(e) => setFormKeywords(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                        />
                      </div>
                    </div>
                  </form>
                ) : activeTab === "seo" ? (
                  /* LIVE SEO INSPECTOR & SCORECARD TAB */
                  <div className="space-y-6 animate-sana-fade-in text-xs">
                    {/* Meter Gauge Card */}
                    <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                          TOTAL SEO QUALITY SCORE
                        </span>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-4xl font-bold text-[#222225] font-mono">{seoChecklist.score}</span>
                          <span className="text-sm text-[#717171]">/ 100</span>
                        </div>
                        <p className="text-xs text-[#717171] mt-1">
                          {seoChecklist.score >= 90
                            ? "🌟 Luar Biasa! Artikel ini memenuhi seluruh standar optimasi mesin pencari Google & Rank #1 Ready."
                            : seoChecklist.score >= 70
                            ? "👍 Kualitas Baik. Lengkapi beberapa checklist di bawah untuk skor maksimal."
                            : "⚠️ Perlu Peningkatan. Ikuti panduan di checklist untuk meningkatkan potensi traffic organik."}
                        </p>
                      </div>

                      {/* Google SERP Preview Card */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] max-w-sm w-full space-y-1 shadow-xs">
                        <div className="flex items-center space-x-1.5 text-[11px] text-[#717171]">
                          <span className="h-3.5 w-3.5 rounded-full bg-[#222225] text-white flex items-center justify-center text-[9px] font-bold">K</span>
                          <span className="truncate">https://www.kinghousemanagement.com/blog/{formSlug || "artikel"}</span>
                        </div>
                        <p className="font-semibold text-blue-700 text-sm hover:underline line-clamp-1">
                          {formTitle || "Judul Artikel KingHouse"}
                        </p>
                        <p className="text-[11px] text-[#555] line-clamp-2 leading-relaxed">
                          {formExcerpt || "Ringkasan artikel Anda akan muncul di sini sebagai cuplikan hasil pencarian Google..."}
                        </p>
                      </div>
                    </div>

                    {/* Checklist Grid */}
                    <div className="space-y-3">
                      <h4 className="font-bold uppercase tracking-wider text-[#222225]">
                        Daftar Periksa Optimasi Mesin Pencari (SEO Checklist)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${seoChecklist.hasTitleKw ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
                          {seoChecklist.hasTitleKw ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />}
                          <div>
                            <strong className="block font-semibold">Focus Keyword di Judul H1</strong>
                            <span className="text-[11px] opacity-85">Keyword &quot;{formFocusKeyword}&quot; harus ada di headline utama.</span>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${seoChecklist.hasExcerptKw ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
                          {seoChecklist.hasExcerptKw ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />}
                          <div>
                            <strong className="block font-semibold">Keyword di Paragraf Pembuka / Excerpt</strong>
                            <span className="text-[11px] opacity-85">Muncul di lead teks atau 100 kata pertama.</span>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${seoChecklist.hasH2 ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                          {seoChecklist.hasH2 ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />}
                          <div>
                            <strong className="block font-semibold">Struktur Subheading (H2 / H3)</strong>
                            <span className="text-[11px] opacity-85">Gunakan tombol H2 pada toolbar untuk membagi topik.</span>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${seoChecklist.hasImage ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                          {seoChecklist.hasImage ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />}
                          <div>
                            <strong className="block font-semibold">Gambar In-Content dengan Alt Tag</strong>
                            <span className="text-[11px] opacity-85">Gunakan tombol &quot;+ Sisipkan Foto&quot; di toolbar.</span>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${seoChecklist.hasInternalLink ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                          {seoChecklist.hasInternalLink ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />}
                          <div>
                            <strong className="block font-semibold">Tautan Internal (Internal Link)</strong>
                            <span className="text-[11px] opacity-85">Tautkan ke salah satu listing properti KingHouse.</span>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${seoChecklist.wordCountOk ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                          {seoChecklist.wordCountOk ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />}
                          <div>
                            <strong className="block font-semibold">Kedalaman Konten ({seoChecklist.wordCount} Kata)</strong>
                            <span className="text-[11px] opacity-85">Minimal 300 kata untuk otoritas mesin pencari.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* LIVE CARD PREVIEW TAB */
                  <div className="space-y-6 animate-sana-fade-in">
                    <div className="max-w-md mx-auto rounded-3xl overflow-hidden border border-[#E8E4DC] bg-white shadow-lg space-y-4 p-4">
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAF8F5]">
                        <Image src={formHeroImage} alt={formTitle || "Cover"} fill className="object-cover" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#222225]">
                          {formCategory}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-serif text-[#222225] font-normal leading-snug">
                          {formTitle || "Judul Artikel Akan Muncul Di Sini"}
                        </h3>
                        <p className="text-xs text-[#717171] line-clamp-2 leading-relaxed">
                          {formExcerpt || "Ringkasan artikel akan tampil di kartu pratinjau publik..."}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-[#717171] pt-2 border-t border-[#FAF8F5]">
                          <span>{formAuthorName}</span>
                          <span>{formReadTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer (Sticky) */}
              <div className="p-4 sm:p-6 border-t border-[#E8E4DC] flex items-center justify-between flex-shrink-0 bg-[#FAF8F5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl border border-[#E8E4DC] text-[#717171] hover:text-[#222225] hover:bg-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveArticle}
                  className="inline-flex items-center space-x-2 px-7 py-2.5 rounded-2xl bg-[#222225] text-white hover:bg-[#2B2A30] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <Check className="h-4 w-4 text-[#B8934C]" />
                  <span>{modalMode === "create" ? "Simpan & Publikasikan" : "Simpan Pembaruan"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* SUB-MODAL: IN-CONTENT IMAGE INSERTER WITH ALT TAG SEO */}
      {mounted &&
        isImagePickerOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsImagePickerOpen(false)
            }}
          >
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E4DC] space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#B8934C]">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#222225]">Sisipkan Foto ke Artikel</h3>
                    <p className="text-xs text-[#717171]">Pilih foto properti beresolusi tinggi dan tentukan Alt-Text untuk Google Image SEO.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImagePickerOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#717171] hover:text-[#222225] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center space-x-2 border-b border-[#FAF8F5] pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImagePickerTab("presets")}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    imagePickerTab === "presets" ? "bg-[#222225] text-white" : "bg-[#FAF8F5] text-[#717171] hover:text-[#222225]"
                  }`}
                >
                  📸 Galeri Properti Terverifikasi
                </button>
                <button
                  type="button"
                  onClick={() => setImagePickerTab("custom")}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    imagePickerTab === "custom" ? "bg-[#222225] text-white" : "bg-[#FAF8F5] text-[#717171] hover:text-[#222225]"
                  }`}
                >
                  🌐 Custom Image URL
                </button>
              </div>

              {/* Body */}
              {imagePickerTab === "presets" ? (
                <div className="space-y-3 text-xs">
                  <span className="font-semibold text-[#555] block uppercase tracking-wider">
                    Pilih Foto Villa / Apartemen:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {IMAGE_PRESETS.map((preset) => (
                      <div
                        key={preset.name}
                        onClick={() => {
                          setSelectedPresetImage(preset.url)
                          setImageAltText(preset.altSuggestion)
                        }}
                        className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedPresetImage === preset.url
                            ? "border-[#B8934C] ring-2 ring-[#B8934C]/20 scale-[1.02]"
                            : "border-[#E8E4DC] opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image src={preset.url} alt={preset.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex items-end">
                          <span className="text-[10px] text-white font-medium line-clamp-1">{preset.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <label className="font-semibold text-[#555] uppercase tracking-wider block">
                    URL Gambar Eksternal / Supabase:
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/foto-villa-kolam-renang.webp"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-mono text-xs text-[#222225] focus:outline-none focus:border-[#B8934C]"
                  />
                </div>
              )}

              {/* Alt Text Input (Mandatory for Google SEO) */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-[#FAF8F5]">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[#555] uppercase tracking-wider">
                    Image Alt-Text (Deskripsi Kata Kunci SEO) *
                  </label>
                  <span className="text-[10px] text-[#B8934C] font-semibold">Wajib untuk Google Image Index</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kolam renang private dan taman luas villa Jagakarsa"
                  value={imageAltText}
                  onChange={(e) => setImageAltText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] font-medium text-[#222225] focus:outline-none focus:border-[#B8934C]"
                />
              </div>

              {/* Action */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8E4DC]">
                <button
                  type="button"
                  onClick={() => setIsImagePickerOpen(false)}
                  className="px-4 py-2 rounded-2xl border border-[#E8E4DC] text-[#717171] hover:text-[#222225] text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleInsertImageToContent}
                  className="px-6 py-2 rounded-2xl bg-[#222225] text-white hover:bg-[#2B2A30] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Sisipkan ke Teks Artikel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* CONFIRMATION MODAL: SOFT DELETE VS PERMANENT PURGE */}
      {mounted &&
        deleteConfirmArticle &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeleteConfirmArticle(null)
            }}
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-xl text-[#222225] font-semibold">
                  {deleteConfirmArticle.permanent ? "Hapus Artikel Permanen?" : "Pindahkan ke Sampah?"}
                </h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  {deleteConfirmArticle.permanent ? (
                    <>
                      Artikel <strong className="text-[#222225]">&quot;{deleteConfirmArticle.title}&quot;</strong> akan dihapus permanen dari database Supabase dan tidak dapat dikembalikan.
                    </>
                  ) : (
                    <>
                      Artikel <strong className="text-[#222225]">&quot;{deleteConfirmArticle.title}&quot;</strong> akan diarsipkan (Soft Delete). Peringkat Google tetap terlindungi dan artikel dapat dipulihkan kapan saja.
                    </>
                  )}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmArticle(null)}
                  className="flex-1 py-2.5 rounded-2xl border border-[#E8E4DC] text-[#717171] hover:text-[#222225] hover:bg-[#FAF8F5] text-xs font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteConfirmArticle.permanent) {
                      handlePermanentDelete(deleteConfirmArticle.id)
                    } else {
                      const art = articles.find((a) => a.id === deleteConfirmArticle.id)
                      if (art) handleSoftDelete(art)
                    }
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  {deleteConfirmArticle.permanent ? "Hapus Permanen" : "Pindahkan ke Sampah"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
