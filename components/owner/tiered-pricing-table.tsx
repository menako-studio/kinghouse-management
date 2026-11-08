"use client"

import { Check, X, ArrowRight } from "lucide-react"
import { MANAGEMENT_TIERS } from "@/lib/marketing-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocalization } from "@/lib/context/localization-context"
import { MANAGEMENT_FEES } from "@/lib/constants"

const { apartmentPercent, villaMinPercent, villaMaxPercent, villaMinBedrooms } = MANAGEMENT_FEES

export function TieredPricingTable() {
  const { t, tc } = useLocalization()

  return (
    <section id="pricing" className="section-macro-spacing bg-[#FAFAFA] border-y border-[#EBEBEB]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 text-center mx-auto">
          <span className="text-sm uppercase tracking-[0.18em] font-semibold text-[#8C7F5F]">
            {tc("Fees")}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#222222]">
            {tc("No fixed costs. We earn when you earn.")}
          </h2>
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
                      <p className="text-base text-[#5C5347] leading-relaxed">
                        {tc(tier.subtitle)}
                      </p>
                    </div>

                    {tier.feeKind === "by-property" ? (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#5C5347]">
                          {t("f.fee.title")} · {t("f.fee.ofRevenue")}
                        </span>
                        <div className="flex items-baseline justify-between gap-4 border-b border-[#EBEBEB] pb-2">
                          <span className="text-base text-[#222222]">{t("f.fee.apartment")}</span>
                          <span className="font-serif text-4xl text-[#222222]">{apartmentPercent}%</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-base text-[#222222]">{t("f.fee.villa", { beds: villaMinBedrooms })}</span>
                          <span className="font-serif text-4xl text-[#222222] whitespace-nowrap">
                            {villaMinPercent}–{villaMaxPercent}%
                          </span>
                        </div>
                        <p className="text-sm text-[#5C5347]">{t("f.fee.note")}</p>
                      </div>
                    ) : (
                      <div className="space-y-1 pt-2">
                        <span className="font-serif text-3xl sm:text-4xl text-[#222222]">{t("f.fee.onRequest")}</span>
                        <p className="text-sm text-[#5C5347]">{t("f.fee.onRequestNote")}</p>
                      </div>
                    )}

                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#222222]">
                      {tc("What's included")}
                    </span>
                    <ul className="space-y-3">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-base">
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
                  <p className="text-base text-[#5C5347]">
                    {tc("Ideal for:")} {tc(tier.idealFor)}
                  </p>
                  <Button
                    size="lg"
                    asChild
                    variant={isPopular ? "default" : "outline"}
                    className="h-14 w-full text-base font-semibold"
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

      </div>
    </section>
  )
}
