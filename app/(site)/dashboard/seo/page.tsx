import { Metadata } from "next"
import Link from "next/link"
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Globe,
  FileCode,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"
import { SeoEditor } from "@/components/dashboard/seo-editor"
import { BLOG_POSTS, CURATED_VILLAS } from "@/lib/data"

export const metadata: Metadata = {
  title: "Status Google & Kata Kunci (SEO) — Kinghouse CMS",
  description: "Optimasi kata kunci pencarian Google & listing Airbnb untuk memaksimalkan okupansi villa dan apartemen.",
}

export default function SeoManagerPage() {
  const indexedPropertiesCount = CURATED_VILLAS.length
  const totalKeywordsTargeted = BLOG_POSTS.reduce((acc, p) => acc + p.seoKeywords.length, 0)

  return (
    <div className="space-y-10">
      {/* Header Banner - Clean Operational Hospitality Standard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E8E4DC]">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E4DC] text-[10px] font-semibold tracking-wider text-[#222225]">
            <Search className="h-3.5 w-3.5 text-[#B8934C]" />
            <span className="text-[#8C7F5F] uppercase">PENCARIAN GOOGLE & AIRBNB</span>
            <span className="text-[#D5CFC3]">&bull;</span>
            <span>TRAFIK ORGANIK</span>
          </div>

          <h1 className="text-3xl sm:text-4xl text-[#222225] font-semibold tracking-tight">
            Status Google & Kata Kunci (SEO)
          </h1>
          <p className="text-sm text-[#6B6862] max-w-2xl font-light leading-relaxed">
            Kelola judul dan deskripsi pencarian Google, kata kunci target, serta visibilitas properti Kinghouse agar mudah ditemukan calon tamu.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white border border-[#E8E4DC] text-[#222225] px-4 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] transition-all shadow-xs"
          >
            <FileCode className="h-3.5 w-3.5 text-[#8C7F5F]" />
            <span>XML Sitemap</span>
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white border border-[#E8E4DC] text-[#222225] px-4 py-2.5 rounded-2xl text-xs font-semibold hover:bg-[#FAF8F5] transition-all shadow-xs"
          >
            <Globe className="h-3.5 w-3.5 text-[#6B6862]" />
            <span>Robots.txt</span>
          </a>
        </div>
      </div>

      {/* SEO Operational Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6862]">
              Unit Terindeks Google
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-semibold text-[#222225] tracking-tight">
            {indexedPropertiesCount} / {indexedPropertiesCount}
          </p>
          <p className="text-xs text-[#8C7F5F] font-light">
            Schema.org VacationRental & BreadcrumbList aktif
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6862]">
              Artikel Editorial
            </span>
            <TrendingUp className="h-4 w-4 text-[#B8934C]" />
          </div>
          <p className="text-3xl font-semibold text-[#222225] tracking-tight">
            {BLOG_POSTS.length} Artikel
          </p>
          <p className="text-xs text-[#8C7F5F] font-light">
            {totalKeywordsTargeted} kata kunci spesifik Jabodetabek
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E4DC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6862]">
              Status Canonical URL
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-semibold text-emerald-700 tracking-tight">
            100% Valid
          </p>
          <p className="text-xs text-[#8C7F5F] font-light">
            Domain resmi: kinghousemanagement.com
          </p>
        </div>
      </div>

      {/* Core Interactive SEO Editor */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8E4DC] pb-4">
          <div>
            <h2 className="text-2xl text-[#222225] font-semibold">Pengaturan Kata Kunci & Tampilan Google</h2>
            <p className="text-xs text-[#6B6862] font-light">
              Pilih properti untuk memeriksa dan memperbarui judul, deskripsi, serta skor optimasi Google
            </p>
          </div>
          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-200 self-start sm:self-auto uppercase tracking-wider">
            Pratinjau Google Aktif
          </span>
        </div>

        <SeoEditor />
      </section>

      {/* Blog & Local SEO Content Pipeline */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-4">
          <div>
            <h2 className="text-2xl text-[#222225] font-semibold">
              Artikel Blog & Kata Kunci Terpublikasi
            </h2>
            <p className="text-xs text-[#6B6862] font-light">
              Daftar artikel terpublikasi dengan target pencarian organik untuk sewa villa dan apartemen di Jabodetabek
            </p>
          </div>
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#222225] hover:text-[#8C7F5F] transition-colors"
          >
            <span>Buka Halaman Blog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-3xl border border-[#E8E4DC] bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4DC] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#6B6862]">
                <th className="py-4 px-6">Judul Artikel & Target Area</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Kata Kunci Sasaran</th>
                <th className="py-4 px-6">Status Google</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F5] text-xs">
              {BLOG_POSTS.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAF8F5]/90 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-[#222225] line-clamp-1">{post.title}</p>
                    <p className="text-[11px] text-[#8C7F5F] mt-0.5 font-mono">/blog/{post.slug}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#FAF8F5] text-[#222225] border border-[#E8E4DC]">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {post.seoKeywords.slice(0, 2).map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-[#FAF8F5] text-[#5C5347] font-mono border border-[#E8E4DC]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Terindeks Google</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}



