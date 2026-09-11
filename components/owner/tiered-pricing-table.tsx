"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X, ArrowRight, Sparkles, Calculator } from "lucide-react"
import { MANAGEMENT_TIERS } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocalization } from "@/lib/context/localization-context"

export function TieredPricingTable() {
  const { formatPrice, t } = useLocalization()
  const [estimatedMonthlyRevenue, setEstimatedMonthlyRevenue] = useState(250000000)

  const optionAFee = Math.round(estimatedMonthlyRevenue * 0.15)
  const optionANet = estimatedMonthlyRevenue - optionAFee

  const optionBFee = Math.round(estimatedMonthlyRevenue * 0.20)
  const optionBNet = estimatedMonthlyRevenue - optionBFee

  return (
    <section id="pricing" className="section-macro-spacing bg-[#FAFAFA] border-y border-[#EBEBEB]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 text-center mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
            Transparent Fee Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222]">
            Zero Fixed Costs. Pure Performance.
          </h2>
          <p className="text-sm sm:text-base text-[#717171] leading-relaxed">
            We only earn when you earn. Choose between hands-on operations or completely passive turnkey villa asset management.
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {MANAGEMENT_TIERS.map((tier) => {
            const isPopular = tier.popular

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-12 transition-all ${
                  isPopular
                    ? "border-2 border-[#222222] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                    : "border border-[#EBEBEB] bg-white shadow-xs"
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 right-8">
                    <Badge variant="default" className="text-[11px] font-semibold uppercase tracking-wider py-1 px-4">
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Title & Fee Header */}
                  <div className="space-y-4 pb-6 border-b border-[#EBEBEB]">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#222222]">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-[#717171] leading-relaxed">
                        {tier.subtitle}
                      </p>
                    </div>

                    <div className="flex items-baseline space-x-2 pt-2">
                      <span className="font-serif text-5xl sm:text-6xl font-normal text-[#222222]">
                        {tier.feePercentage}%
                      </span>
                      <span className="text-xs text-[#717171] font-medium max-w-[180px]">
                        {tier.feeNote}
                      </span>
                    </div>

                    <p className="text-xs text-[#555555] leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-3">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-3 text-xs">
                          {feature.included ? (
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222] mt-0.5">
                              <Check className="h-3 w-3 text-[#222222]" />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-[#999999] mt-0.5">
                              <X className="h-3 w-3" />
                            </div>
                          )}
                          <span
                            className={`leading-snug ${
                              feature.included
                                ? feature.highlight
                                  ? "font-semibold text-[#222222]"
                                  : "text-[#444444]"
                                : "text-[#999999] line-through opacity-60"
                            }`}
                          >
                            {feature.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-10 pt-6 border-t border-[#EBEBEB] space-y-3">
                  <p className="text-[11px] text-[#717171] italic">
                    Ideal for: {tier.idealFor}
                  </p>
                  <Button
                    size="lg"
                    asChild
                    variant={isPopular ? "default" : "outline"}
                    className="w-full text-xs uppercase tracking-widest font-semibold h-12"
                  >
                    <a href="#audit">
                      Apply for {tier.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Interactive Revenue & Net Yield Estimator */}
        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-8 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] text-[#222222]">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl text-[#222222]">Interactive Fee & Net Yield Calculator</h4>
                <p className="text-xs text-[#717171]">Estimate your net owner payout based on gross monthly revenue</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#717171] block">Estimated Gross Revenue</span>
              <span className="font-serif text-2xl text-[#222222]">
                {formatPrice(estimatedMonthlyRevenue)} / mo
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="50000000"
              max="500000000"
              step="10000000"
              value={estimatedMonthlyRevenue}
              onChange={(e) => setEstimatedMonthlyRevenue(Number(e.target.value))}
              className="w-full accent-[#222222] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#717171]">
              <span>{formatPrice(50000000)} / mo</span>
              <span>{formatPrice(250000000)} / mo</span>
              <span>{formatPrice(500000000)} / mo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EBEBEB]">
            <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB]">
              <span className="text-xs font-semibold text-[#717171] block">Option A (15% Exclusive Marketing)</span>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-[#717171]">Management Fee: {formatPrice(optionAFee)}</span>
                <span className="text-sm font-semibold text-[#222222]">Net Owner: {formatPrice(optionANet)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F4F0] border border-[#E4E0D8]">
              <span className="text-xs font-semibold text-[#222222] block">Option B (20% Full Turnkey Management)</span>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-[#717171]">Management Fee: {formatPrice(optionBFee)}</span>
                <span className="text-sm font-semibold text-[#222222]">Net Owner: {formatPrice(optionBNet)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
