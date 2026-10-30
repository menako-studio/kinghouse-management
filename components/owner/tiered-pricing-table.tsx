"use client"

import { useState } from "react"
import Link from "@/components/ui/localized-link"
import { Check, X, ArrowRight, Sparkles, Calculator } from "lucide-react"
import { MANAGEMENT_TIERS } from "@/lib/marketing-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocalization } from "@/lib/context/localization-context"
import { MANAGEMENT_FEES } from "@/lib/constants"

const { apartmentPercent, villaMinPercent, villaMaxPercent, villaMinBedrooms } = MANAGEMENT_FEES

export function TieredPricingTable() {
  const { formatPrice, t, tc } = useLocalization()
  const [estimatedMonthlyRevenue, setEstimatedMonthlyRevenue] = useState(250000000)

  const feeAt = (pct: number) => Math.round((estimatedMonthlyRevenue * pct) / 100)
  const apartmentFee = feeAt(apartmentPercent)
  const villaFeeMin = feeAt(villaMinPercent)
  const villaFeeMax = feeAt(villaMaxPercent)

  return (
    <section id="pricing" className="section-macro-spacing bg-[#FAFAFA] border-y border-[#EBEBEB]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 text-center mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
            {tc("Transparent Fee Architecture")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222]">
            {tc("Zero Fixed Costs. Pure Performance.")}
          </h2>
          <p className="text-sm sm:text-base text-[#717171] leading-relaxed">
            {tc("We only earn when you earn. Choose between hands-on operations or completely passive turnkey villa asset management.")}
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
                    <Badge variant="default" className="text-xs font-semibold uppercase tracking-wider py-1 px-4">
                      {tc(tier.badge)}
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
                        {tc(tier.subtitle)}
                      </p>
                    </div>

                    {tier.feeKind === "by-property" ? (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#5C5347]">
                          {t("f.fee.title")} · {t("f.fee.ofRevenue")}
                        </span>
                        <div className="flex items-baseline justify-between gap-4 border-b border-[#EBEBEB] pb-2">
                          <span className="text-sm text-[#222222]">{t("f.fee.apartment")}</span>
                          <span className="font-serif text-4xl text-[#222222]">{apartmentPercent}%</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-sm text-[#222222]">{t("f.fee.villa", { beds: villaMinBedrooms })}</span>
                          <span className="font-serif text-4xl text-[#222222] whitespace-nowrap">
                            {villaMinPercent}–{villaMaxPercent}%
                          </span>
                        </div>
                        <p className="text-xs text-[#5C5347]">{t("f.fee.note")}</p>
                      </div>
                    ) : (
                      <div className="space-y-1 pt-2">
                        <span className="font-serif text-3xl sm:text-4xl text-[#222222]">{t("f.fee.onRequest")}</span>
                        <p className="text-xs text-[#5C5347]">{t("f.fee.onRequestNote")}</p>
                      </div>
                    )}

                    <p className="text-xs text-[#555555] leading-relaxed">
                      {tc(tier.description)}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#222222]">
                      {tc("Included Capabilities:")}
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
                            {tc(feature.title)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-10 pt-6 border-t border-[#EBEBEB] space-y-3">
                  <p className="text-xs text-[#717171] italic">
                    {tc("Ideal for:")} {tc(tier.idealFor)}
                  </p>
                  <Button
                    size="lg"
                    asChild
                    variant={isPopular ? "default" : "outline"}
                    className="w-full text-xs uppercase tracking-widest font-semibold h-12"
                  >
                    <a href="#owner-form">
                      {tc("Apply for")} {tier.name} <ArrowRight className="ml-2 h-4 w-4" />
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
                <h4 className="font-serif text-xl text-[#222222]">{tc("Interactive Fee & Net Yield Calculator")}</h4>
                <p className="text-xs text-[#717171]">{tc("Estimate your net owner payout based on gross monthly revenue")}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#717171] block">{tc("Estimated Gross Revenue")}</span>
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
            <div className="flex justify-between text-xs text-[#717171]">
              <span>{formatPrice(50000000)} / mo</span>
              <span>{formatPrice(250000000)} / mo</span>
              <span>{formatPrice(500000000)} / mo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EBEBEB]">
            <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] space-y-1">
              <span className="text-sm font-semibold text-[#222222] block">
                {t("f.fee.apartment")} · {apartmentPercent}%
              </span>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
                <span className="text-[#5C5347]">{t("f.fee.feeLabel")}: {formatPrice(apartmentFee)}</span>
                <span className="font-semibold text-[#222222]">
                  {t("f.fee.netLabel")}: {formatPrice(estimatedMonthlyRevenue - apartmentFee)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F4F0] border border-[#E4E0D8] space-y-1">
              <span className="text-sm font-semibold text-[#222222] block">
                {t("f.fee.villa", { beds: villaMinBedrooms })} · {villaMinPercent}–{villaMaxPercent}%
              </span>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
                <span className="text-[#5C5347]">
                  {t("f.fee.feeLabel")}: {formatPrice(villaFeeMin)} – {formatPrice(villaFeeMax)}
                </span>
                <span className="font-semibold text-[#222222]">
                  {t("f.fee.netLabel")}: {formatPrice(estimatedMonthlyRevenue - villaFeeMax)} – {formatPrice(estimatedMonthlyRevenue - villaFeeMin)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#5C5347]">{t("f.fee.note")}</p>
        </div>
      </div>
    </section>
  )
}
