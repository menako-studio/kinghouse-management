import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Newspaper, Download, Mail, ExternalLink, ArrowRight, Award, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Press & Media Center | KingHouse Management",
  description:
    "Official news, press releases, media mentions, and downloadable brand assets from KingHouse Villa & Short-Stay Asset Management in Greater Jakarta.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "Press & Media Center | KingHouse Management",
    description:
      "Official news, press releases, media mentions, and downloadable brand assets from KingHouse Management.",
    url: "/press",
    type: "website",
  },
}

const PRESS_RELEASES = [
  {
    id: "press-1",
    date: "August 18, 2026",
    category: "Corporate Expansion",
    title: "KingHouse Expands Managed Villa Portfolio Across Jabodetabek with 85%+ Occupancy Benchmark",
    excerpt:
      "KingHouse Hospitality Management announces the integration of 4 new luxury short-stay estates across South Jakarta and Tangerang, surpassing regional occupancy averages through proprietary dynamic pricing algorithms.",
    readTime: "3 min read",
    publication: "KingHouse Newsroom",
  },
  {
    id: "press-2",
    date: "June 04, 2026",
    category: "Industry Recognition",
    title: "KingHouse Awarded Top Superhost Hospitality Partner in Greater Jakarta",
    excerpt:
      "Recognized for outstanding 4.9+ average guest reviews, 100% response rates, and editorial interior photography standards that set a new benchmark for private vacation rentals.",
    readTime: "2 min read",
    publication: "Hospitality Insider Asia",
  },
  {
    id: "press-3",
    date: "April 12, 2026",
    category: "Technology & Operations",
    title: "Zero-Commission Direct Booking Concierge & Multi-OTA Calendar Sync Launch",
    excerpt:
      "KingHouse unveils real-time calendar synchronization across Airbnb, Booking.com, and direct WhatsApp concierge, protecting property owners from double-booking risks and maximizing ADR.",
    readTime: "4 min read",
    publication: "Property Management Weekly",
  },
]

const MEDIA_MENTIONS = [
  {
    outlet: "Hospitality Asia",
    quote: "“KingHouse is reshaping short-stay asset management in Indonesia with hotel-grade linen operations and bespoke owner dashboards.”",
    author: "Editorial Review",
  },
  {
    outlet: "Jakarta Property Review",
    quote: "“By turning vacant private estates into cashflow-generating boutique retreats, KingHouse offers an enviable 2.4x yield uplift.”",
    author: "Special Report",
  },
  {
    outlet: "Urban Stay Digest",
    quote: "“From garden wedding venues in Jagakarsa to high-floor expat suites in Cikarang, KingHouse curates spaces that tell a story.”",
    author: "Travel & Leisure",
  },
]

export default function PressPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden bg-[#24221F] text-white pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
            alt="KingHouse Luxury Press"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24221F] via-[#24221F]/80 to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex items-center space-x-2.5 text-[#DFC58E] text-xs uppercase tracking-[0.2em] font-semibold mb-4">
            <Newspaper className="h-4 w-4" />
            <span>KingHouse Newsroom & Media</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[0.12em] font-normal leading-tight max-w-3xl">
            Press & Media Center
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#E0DACB] font-light max-w-2xl leading-relaxed">
            Latest announcements, editorial coverage, and brand assets for journalists, industry analysts, and property partners.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#press-releases"
              className="inline-flex items-center space-x-2 rounded-full bg-[#8C7F5F] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#776B4E] transition-all"
            >
              <span>View Releases</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="#media-kit"
              className="inline-flex items-center space-x-2 rounded-full border border-white/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Media Kit</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Media Quotes / Social Proof */}
      <section className="border-b border-[#E8E4DC] bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MEDIA_MENTIONS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center space-x-2 text-[#8C7F5F] mb-3">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-semibold text-xs tracking-wider uppercase">{item.outlet}</span>
                  </div>
                  <p className="font-serif text-sm italic text-[#333333] leading-relaxed">
                    {item.quote}
                  </p>
                </div>
                <p className="text-[11px] text-[#777777] uppercase tracking-wider font-medium mt-4">
                  {item.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Official Press Releases */}
      <section id="press-releases" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E4DC]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C7F5F]">
                Official Announcements
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#222222] uppercase tracking-[0.08em] mt-1 font-normal">
                Press Releases
              </h2>
            </div>
            <p className="text-xs text-[#777777] mt-2 md:mt-0">
              Showing official communications from KingHouse Management
            </p>
          </div>

          <div className="space-y-6">
            {PRESS_RELEASES.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#E8E4DC] bg-white p-7 sm:p-8 transition-all hover:border-[#8C7F5F]/60 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#888888] mb-3">
                  <span className="rounded-full bg-[#FAF8F3] px-3 py-1 font-medium text-[#8C7F5F] border border-[#8C7F5F]/20">
                    {item.category}
                  </span>
                  <span>&bull;</span>
                  <span>{item.date}</span>
                  <span>&bull;</span>
                  <span>{item.readTime}</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#222222] hover:text-[#8C7F5F] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[#666666] font-light leading-relaxed">
                  {item.excerpt}
                </p>

                <div className="mt-5 pt-4 border-t border-[#F5F3EE] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#888888]">Source: {item.publication}</span>
                  <a
                    href="mailto:ptkreasiusmangosse@gmail.com?subject=Press%20Inquiry:%20"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8C7F5F] hover:text-[#776B4E]"
                  >
                    <span>Request Full Media Pack</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Assets & Media Kit */}
      <section id="media-kit" className="border-t border-[#E8E4DC] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="rounded-3xl bg-[#8C7F5F] text-white p-8 sm:p-12 lg:p-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider mb-4">
                <Award className="h-3.5 w-3.5" />
                <span>KingHouse Official Brand Kit</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl uppercase tracking-[0.1em] font-normal leading-tight">
                Download Press & Media Assets
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#F0EBE0] font-light leading-relaxed">
                Access official KingHouse logos in high-resolution vector and PNG formats, executive portraits, and approved property photography for publications.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:ptkreasiusmangosse@gmail.com?subject=Media%20Kit%20Request%20-%20KingHouse"
                  className="inline-flex items-center space-x-2 rounded-full bg-white text-[#8C7F5F] px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all shadow-md"
                >
                  <Mail className="h-4 w-4" />
                  <span>Request Media Kit Access</span>
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center space-x-2 rounded-full border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
                >
                  <span>Company Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
