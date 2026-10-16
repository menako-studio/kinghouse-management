"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Quote, Award, CheckCircle, ArrowUpRight, ShieldCheck, Sparkles, Key } from "lucide-react"
import { TESTIMONIALS, TRUST_PARTNERS } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { useLocalization } from "@/lib/context/localization-context"

export function TrustSocialProof() {
  const { t } = useLocalization()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const current = TESTIMONIALS[currentTestimonial]

  return (
    <section className="bg-[#FAFAFA] border-y border-[#EBEBEB] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
        {/* Partner Badges & Trust Banner */}
        <div className="flex flex-col items-center text-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#717171]">
            {t("globalDistributionHeader")}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-2">
            {TRUST_PARTNERS.map((partner, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-[#222222] font-medium text-sm tracking-tight opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="h-2 w-2 rounded-full bg-[#A69C8E]" />
                <span className="font-serif text-lg font-normal tracking-normal">{partner.name}</span>
                <span className="text-[10px] text-[#717171] uppercase px-2 py-0.5 rounded-full border border-[#EBEBEB] bg-white">
                  {partner.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Airbnb Superhost Live Verification Spotlight */}
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[#222225] via-[#2A292E] to-[#1E1C1A] text-white p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#3E3A35] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#DFC58E]/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 rounded-full bg-[#DFC58E]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#DFC58E] border border-[#DFC58E]/30">
                <Sparkles className="h-3 w-3" />
                <span>Verified Airbnb Superhost Status</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Officially Recognized on Airbnb
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed max-w-xl">
                Kinghouse Management holds active Superhost status with 100% verified host identity, top hospitality hygiene, and exceptional guest reviews across all managed Jabodetabek residences.
              </p>
            </div>

            {/* Live Profile Specs Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 w-full md:w-auto shrink-0 space-y-4">
              <div className="flex items-center justify-between gap-6 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-white text-[#222225] flex items-center justify-center font-serif font-bold text-base shadow-sm">
                    K
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Kinghouse Management</h4>
                    <p className="text-[10px] text-[#DFC58E]">@kinghousemanagement &bull; Verified</p>
                  </div>
                </div>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                  Superhost
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-base font-bold text-white">10</p>
                  <p className="text-[10px] text-white/60 uppercase">Reviews</p>
                </div>
                <div>
                  <p className="text-base font-bold text-[#DFC58E]">4.5★</p>
                  <p className="text-[10px] text-white/60 uppercase">Rating</p>
                </div>
                <div>
                  <p className="text-base font-bold text-white">1 Yr</p>
                  <p className="text-[10px] text-white/60 uppercase">Hosting</p>
                </div>
              </div>

              <a
                href="https://www.airbnb.com/users/profile/1470743715397835749?previous_page_name=PdpHomeMarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 w-full py-2.5 rounded-xl bg-white text-[#19191B] hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>View Live Airbnb Profile</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#8C7F5F]" />
              </a>
            </div>
          </div>
        </div>

        {/* Verified Reviews Carousel */}
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 sm:p-12 lg:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#EBEBEB] relative">
          <Quote className="h-10 w-10 text-[#A69C8E]/25 absolute top-8 right-8" />

          <div className="flex flex-col space-y-6">
            {/* Top Tag & Stars */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={current.type === "owner" ? "accent" : "secondary"}
                  className="text-[11px] uppercase tracking-wider font-semibold"
                >
                  {current.type === "owner" ? t("verifiedVillaOwner") : t("verifiedGuestReview")}
                </Badge>
                {current.propertyName && (
                  <span className="text-xs text-[#717171] hidden sm:inline">
                    &bull; {current.propertyName}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#222222] text-[#222222]" />
                ))}
              </div>
            </div>

            {/* Quote Body */}
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal leading-relaxed text-[#222222] tracking-tight">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Metric Highlight (if owner) */}
            {current.metricLift && (
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#222222] bg-[#FAFAFA] border border-[#EBEBEB] rounded-lg px-3 py-1.5 self-start">
                <CheckCircle className="h-3.5 w-3.5 text-[#A69C8E]" />
                <span>{t("verifiedMetricHighlight")}: {current.metricLift}</span>
              </div>
            )}

            {/* Author Footer & Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#EBEBEB]">
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#EBEBEB] bg-[#F5F5F5]">
                  <Image
                    src={current.avatar}
                    alt={current.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222]">{current.author}</h4>
                  <p className="text-xs text-[#717171]">{current.roleOrLocation}</p>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevTestimonial}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EBEBEB] text-[#222222] hover:bg-[#FAFAFA] transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EBEBEB] text-[#222222] hover:bg-[#FAFAFA] transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
