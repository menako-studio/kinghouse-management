import { Metadata } from "next"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react"
import { SeoEditor } from "@/components/dashboard/seo-editor"
import { BLOG_POSTS } from "@/lib/data"

export const metadata: Metadata = {
  title: "SEO Manager & Listing Optimizer — Kinghouse CMS",
  description: "Property SEO optimization and ranking strategies on Airbnb & Google to maximize occupancy rates.",
}

export default function SeoManagerPage() {
  return (
    <div className="space-y-12 animate-sana-fade-in">
      {/* Pitch Header with Sana Dark Luxury Theme */}
      <div className="rounded-3xl bg-[#19191B] text-white p-8 sm:p-12 relative overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Ambient Glow Spots */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-gradient-to-br from-[#B8934C]/20 via-[#381023]/30 to-transparent rounded-full blur-[100px] pointer-events-none animate-sana-glow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-gradient-to-tr from-[#B8934C]/15 via-[#2D1B0F]/25 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 text-[10px] font-semibold tracking-wider text-[#B8934C]">
            <Sparkles className="h-3.5 w-3.5 text-[#B8934C]" />
            <span className="uppercase">KEY OWNER PITCHING ASSET</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-white">
            SEO & Listing Algorithm Suite
          </h1>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light">
            Why do Kinghouse properties consistently outperform market occupancy? Every property is architected with
            dynamic metadata that converts Google local searches and Airbnb Superhost algorithms into high-intent,
            longer-stay bookings.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-5 border-t border-white/10">
            <div>
              <p className="text-3xl text-[#B8934C] font-bold tracking-tight">+280%</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mt-1">
                Airbnb Search Impressions
              </p>
            </div>
            <div>
              <p className="text-3xl text-[#B8934C] font-bold tracking-tight">Top 3</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mt-1">
                Google Organic Area Rank
              </p>
            </div>
            <div>
              <p className="text-3xl text-[#B8934C] font-bold tracking-tight">81.4%</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium mt-1">
                Average Occupancy Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Interactive SEO Editor */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8E4DC] pb-4">
          <div>
            <h2 className="text-2xl text-[#222225] font-semibold">Property SEO Editor</h2>
            <p className="text-xs text-[#717171] font-light">
              Select any of the 4 managed properties to inspect and modify real-time SEO metadata
            </p>
          </div>
          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-200 self-start sm:self-auto uppercase tracking-wider">
            Live Google SERP Preview Active
          </span>
        </div>

        <SeoEditor />
      </section>

      {/* Blog & Local SEO Content Pipeline */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-4">
          <div>
            <h2 className="text-2xl text-[#222225] font-semibold">
              Editorial Content & Targeted Keywords
            </h2>
            <p className="text-xs text-[#717171] font-light">
              Published high-converting articles generating organic short-stay and expat search traffic across Jabodetabek
            </p>
          </div>
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#222225] hover:text-[#B8934C] transition-colors"
          >
            <span>Open Public Blog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-3xl border border-[#E8E4DC] bg-white overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E4DC] bg-[#FAFAF8] text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                <th className="py-4 px-6">Article Title & Target Area</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Target Keywords</th>
                <th className="py-4 px-6">Index Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F5] text-xs">
              {BLOG_POSTS.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAFAF8]/90 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-[#222225] line-clamp-1">{post.title}</p>
                    <p className="text-[11px] text-[#B8934C] mt-0.5 font-mono">/blog/{post.slug}</p>
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
                          className="px-2 py-0.5 rounded-md text-[10px] bg-blue-50 text-blue-800 font-mono border border-blue-200/60"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Google Indexed</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pitching Guide Explainer for Clients */}
      <section className="rounded-3xl border border-[#E8E4DC] bg-[#FAFAF8] p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B8934C]">
            CLIENT PITCHING FRAMEWORK
          </span>
          <h3 className="text-2xl sm:text-3xl text-[#222225] font-semibold mt-2 mb-3">
            The Kinghouse Formula: Transforming Properties into Guest Magnets
          </h3>
          <p className="text-xs sm:text-sm text-[#717171] leading-relaxed font-light">
            Most property owners rely solely on default Airbnb traffic without algorithmic optimization.
            Kinghouse deploys a comprehensive 3-tier distribution strategy:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-2.5 shadow-xs">
            <div className="h-8 w-8 rounded-xl bg-[#222225] text-[#B8934C] flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-semibold text-sm text-[#222225]">Superhost Algorithm Engine</h4>
            <p className="text-xs text-[#717171] leading-relaxed font-light">
              Optimized response times under 15 minutes, editorial high-resolution photography, and 100% amenity completeness elevate listings to the top 10 search results.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-2.5 shadow-xs">
            <div className="h-8 w-8 rounded-xl bg-[#222225] text-[#B8934C] flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-semibold text-sm text-[#222225]">Organic Google Ingestion</h4>
            <p className="text-xs text-[#717171] leading-relaxed font-light">
              Each property features ultra-fast landing pages with Schema.org JSON-LD structured data (VacationRental & FAQPage), indexed directly in local search results.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-2.5 shadow-xs">
            <div className="h-8 w-8 rounded-xl bg-[#222225] text-[#B8934C] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-semibold text-sm text-[#222225]">High-Yield Guest Targeting</h4>
            <p className="text-xs text-[#717171] leading-relaxed font-light">
              Editorial SEO targets corporate long-stays, expats, and family retreat keywords, resulting in higher revenue yields and respectful guests.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}


