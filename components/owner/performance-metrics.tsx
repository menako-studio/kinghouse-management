"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { CASE_STUDIES } from "@/lib/marketing-data"
import { summarizePayouts } from "@/lib/earnings/case-study"
import { useLocalization } from "@/lib/context/localization-context"

/**
 * Owner proof section. Every money figure is computed from the Airbnb earnings
 * export (lib/earnings/airbnb-monthly.ts), so the page can never claim more than
 * Airbnb actually paid out.
 */
export function PerformanceMetrics() {
  const { formatPrice, tc, language } = useLocalization()
  const locale = language === "ID" ? "id-ID" : "en-US"
  const monthLabel = (ym: string, withYear = true) =>
    new Date(`${ym}-01T00:00:00Z`).toLocaleDateString(locale, {
      month: "short",
      year: withYear ? "numeric" : undefined,
      timeZone: "UTC",
    })
  const dateLabel = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })

  const studies = CASE_STUDIES.map((cs) => ({ cs, payouts: summarizePayouts(cs.propertySlug) })).filter(
    (x): x is { cs: (typeof CASE_STUDIES)[number]; payouts: NonNullable<ReturnType<typeof summarizePayouts>> } =>
      x.payouts !== null
  )
  const exportedAt = studies[0]?.payouts.exportedAt

  return (
    <section id="case-studies" className="section-macro-spacing bg-white">
      <div className="mx-auto max-w-7xl space-y-12 px-6 lg:px-12">
        <div className="max-w-3xl space-y-3">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8C7F5F]">{tc("Results")}</span>
          <h2 className="font-serif text-4xl text-[#222222] sm:text-5xl">{tc("Real numbers from properties we manage")}</h2>
          <p className="text-base leading-relaxed text-[#5C5347] sm:text-lg">
            {tc("Payouts exactly as reported by Airbnb, after Airbnb's host fee.")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {studies.map(({ cs, payouts }) => {
            const first = payouts.months[0]
            const last = payouts.months[payouts.months.length - 1]
            return (
              <article key={cs.id} className="overflow-hidden rounded-3xl border border-[#E8E4DC] bg-[#FAF7F1]">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={cs.image}
                    alt={cs.propertyName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-md">
                    {tc(cs.location)}
                  </span>
                </div>
                <div className="space-y-6 p-6 sm:p-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold leading-snug text-[#222222]">{cs.propertyName}</h3>
                    <p className="text-base leading-relaxed text-[#5C5347]">{tc(cs.summary)}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 rounded-xl border border-[#E8E4DC] bg-white p-4">
                      <dt className="text-sm text-[#5C5347]">
                        {tc("Avg. monthly payout")} · {monthLabel(first, false)}–{monthLabel(last)}
                      </dt>
                      <dd className="mt-1 whitespace-nowrap font-serif text-3xl text-[#222222]">{formatPrice(payouts.averageIdr)}</dd>
                    </div>
                    <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
                      <dt className="text-sm text-[#5C5347]">
                        {tc("Best month")}
                        <span className="block text-xs">{monthLabel(payouts.best.month)}</span>
                      </dt>
                      <dd className="mt-1 whitespace-nowrap text-xl font-bold text-[#222222]">{formatPrice(payouts.best.idr)}</dd>
                    </div>
                    <div className="rounded-xl border border-[#E8E4DC] bg-white p-4">
                      <dt className="text-sm text-[#5C5347]">
                        {tc("Guest rating")}
                        <span className="block text-xs">
                          {cs.reviewsCount} {tc("reviews")}
                        </span>
                      </dt>
                      <dd className="mt-1 flex items-center gap-1 text-xl font-bold text-[#222222]">
                        <Star className="h-4 w-4 fill-[#B8934C] text-[#B8934C]" aria-hidden="true" />
                        {cs.rating.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            )
          })}
        </div>

        {exportedAt && (
          <p className="text-sm text-[#5C5347]">
            {tc("Source: Airbnb host earnings export, {date}. Past results do not guarantee future income.", {
              date: dateLabel(exportedAt),
            })}
          </p>
        )}
      </div>
    </section>
  )
}
