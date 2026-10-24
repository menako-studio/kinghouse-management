"use client"

import Image from "next/image"
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  CalendarCheck,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import { trackWhatsAppClick } from "@/lib/analytics"
import { buildWhatsAppUrl, ownerWhatsAppMessage } from "@/lib/funnel/whatsapp"
import { OwnerLeadForm } from "@/components/owner/owner-lead-form"
import { useLocalization } from "@/lib/context/localization-context"

export default function ManagementInquiryPage() {
  const { t, language } = useLocalization()

  return (
    <main className="min-h-screen bg-[#FAF7F1]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#231F1A] text-white pt-28 pb-16 lg:pt-32 lg:pb-24 supergraphic-blueprint-charcoal">
        <div className="absolute inset-0 z-0">
          <Image
            src="/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"
            alt="Versatile House Flagship Villa"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231F1A] via-[#231F1A]/80 to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFC58E]">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Villa &amp; Property Asset Management</span>
                </div>
                <a
                  href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 rounded-full bg-[#DFC58E]/20 hover:bg-[#DFC58E]/30 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#DFC58E] border border-[#DFC58E]/50 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Official Airbnb Superhost ↗</span>
                </a>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[0.1em] font-normal leading-tight">
                Unlock Maximum Yield <br />
                <span className="text-[#DFC58E]">From Your Property</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#E0DACB] font-light leading-relaxed">
                Transform your luxury home or apartment in Jabodetabek into a high-yielding, 5-star short-stay destination. Zero operational hassle, full transparency, and automated monthly owner payouts.
              </p>

              {/* Stats pill bar */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl text-white">85%+</p>
                  <p className="text-xs uppercase tracking-wider text-[#DFC58E]">Avg. Occupancy</p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl text-white">2.4x</p>
                  <p className="text-xs uppercase tracking-wider text-[#DFC58E]">Yield vs Long-Term</p>
                </div>
                <div>
                  <a
                    href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <p className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#DFC58E] transition-colors">Superhost ↗</p>
                    <p className="text-xs uppercase tracking-wider text-[#DFC58E]">Verified Airbnb Host</p>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp fast-track badge */}
            <div className="w-full lg:w-auto shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center max-w-sm">
              <Sparkles className="h-6 w-6 text-[#DFC58E] mx-auto mb-2" />
              <h3 className="font-serif text-lg text-white font-normal">Need an Instant Feasibility Audit?</h3>
              <p className="text-xs text-[#E0DACB] font-light mt-1 mb-4">
                Send property photos and location to our WhatsApp for a 24-hour yield estimate.
              </p>
              <a
                href={buildWhatsAppUrl("OWNER", ownerWhatsAppMessage({ service: "undecided" }, { t, language }))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ source: "management_inquiry", funnel: "owner", context: "fast_track" })}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-full bg-[#25D366] text-white py-3 px-5 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>Fast-Track WhatsApp Audit</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Management Pillars & Benefits */}
      <section className="py-16 lg:py-20 border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C7F5F]">
              End-to-End Asset Care
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#222222] uppercase tracking-wider font-normal mt-1">
              Why Owners Choose Kinghouse
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#8C7F5F] mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-[#222222] font-normal mb-2">
                Dynamic Revenue Maximization
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
                Algorithmic pricing synced to regional concert schedules, business conventions, and seasonal holidays across Greater Jakarta to maximize ADR and eliminate empty nights.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#8C7F5F] mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-[#222222] font-normal mb-2">
                Vetted Guests &amp; Asset Protection
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
                Rigorous multi-layer guest screening, security deposits, strict quiet-hour enforcement, and up to $3M AirCover safety protection to keep your estate pristine.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-8 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#8C7F5F] mb-5">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-[#222222] font-normal mb-2">
                Hotel-Grade Linen &amp; Operations
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
                300+ thread count commercial linens, 48-point turnover inspections, preventive plumbing/AC maintenance, and dedicated on-site hospitality butlers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Owner qualification form — same form, tags and /thanks flow as /owner-services */}
      <OwnerLeadForm source="management_inquiry" />
    </main>
  )
}
