import Image from "next/image"
import { TrendingUp, Award, Star, CheckCircle } from "lucide-react"
import { CASE_STUDIES } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

export function PerformanceMetrics() {
  return (
    <section id="case-studies" className="section-macro-spacing bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
            Empirical Results
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222]">
            Before vs. After Kinghouse Management
          </h2>
          <p className="text-sm sm:text-base text-[#717171] leading-relaxed">
            Real performance audits from flagship properties under KingHouse asset management. Verified metrics independently audited from live Airbnb and OTA reporting.
          </p>
        </div>

        {/* Case Studies Cards */}
        <div className="space-y-12">
          {CASE_STUDIES.map((cs) => {
            const revLift = Math.round(
              ((cs.afterMetrics.monthlyRevenueIdr - cs.beforeMetrics.monthlyRevenueIdr) /
                cs.beforeMetrics.monthlyRevenueIdr) *
                100
            )
            const occLift = cs.afterMetrics.occupancyRate - cs.beforeMetrics.occupancyRate

            return (
              <div
                key={cs.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 rounded-3xl border border-[#EBEBEB] bg-[#FAFAFA] p-8 sm:p-12 items-center"
              >
                {/* Visual Column */}
                <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-[#EBEBEB]">
                  <Image
                    src={cs.image}
                    alt={cs.propertyName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white">
                    {cs.location}
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-[#222222] shadow-sm">
                    {cs.period}
                  </div>
                </div>

                {/* Metrics Column */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#222222]">
                      {cs.propertyName}
                    </h3>
                    <p className="text-xs text-[#717171] leading-relaxed">
                      {cs.summary}
                    </p>
                  </div>

                  {/* Before vs After Comparison Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Occupancy Lift */}
                    <div className="p-4 rounded-xl bg-white border border-[#EBEBEB] space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#717171] font-medium block">
                        Occupancy Rate
                      </span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-xs text-[#999999] line-through">
                          {cs.beforeMetrics.occupancyRate}%
                        </span>
                        <span className="text-lg font-bold text-[#222222]">
                          {cs.afterMetrics.occupancyRate}%
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#25D366] block">
                        +{occLift}% Net Lift
                      </span>
                    </div>

                    {/* Monthly RevPAR */}
                    <div className="p-4 rounded-xl bg-white border border-[#EBEBEB] space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#717171] font-medium block">
                        Monthly Revenue
                      </span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-xs text-[#999999] line-through">
                          Rp {(cs.beforeMetrics.monthlyRevenueIdr / 1000000).toFixed(0)}jt
                        </span>
                        <span className="text-lg font-bold text-[#222222]">
                          Rp {(cs.afterMetrics.monthlyRevenueIdr / 1000000).toFixed(0)}jt
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#25D366] block">
                        +{revLift}% Lift
                      </span>
                    </div>

                    {/* Superhost Rating & EBITDA */}
                    <div className="p-4 rounded-xl bg-[#F5F4F0] border border-[#E4E0D8] space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#222222] font-semibold block">
                        EBITDA Margin
                      </span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-lg font-bold text-[#222222]">
                          {cs.afterMetrics.ebitdaMargin}%
                        </span>
                      </div>
                      <span className="text-[10px] text-[#A69C8E] font-medium block">
                        ★ {cs.afterMetrics.guestRating} Rating
                      </span>
                    </div>
                  </div>

                  {/* Owner Pull Quote */}
                  <blockquote className="border-l-2 border-[#A69C8E] pl-4 text-xs italic text-[#555555]">
                    &ldquo;{cs.quote.text}&rdquo;
                    <span className="block mt-1 font-semibold not-italic text-[#222222]">
                      — {cs.quote.author}
                    </span>
                  </blockquote>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
