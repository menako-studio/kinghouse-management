"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Quote, Award, CheckCircle } from "lucide-react"
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
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-20">
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
