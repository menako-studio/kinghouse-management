"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Home, KeyRound, Sparkles } from "lucide-react"
import { OWNER_SERVICES, type OwnerServiceId } from "@/lib/funnel/config"
import { useLocalization } from "@/lib/context/localization-context"
import { MANAGEMENT_FEES } from "@/lib/constants"
import { useOwnerService } from "./owner-service-context"

const FEE_VARS = {
  apt: MANAGEMENT_FEES.apartmentPercent,
  min: MANAGEMENT_FEES.villaMinPercent,
  max: MANAGEMENT_FEES.villaMaxPercent,
}

/** Services with their own landing page. */
const SERVICE_PAGES: Partial<Record<OwnerServiceId, string>> = {
  "hk-on-demand": "/airbnb-cleaning-jakarta",
}

const SERVICE_ICONS: Record<OwnerServiceId, typeof Home> = {
  "hk-on-demand": Sparkles,
  "co-hosting": KeyRound,
  "full-management": Home,
}

/** Funnel A step 2 — the three owner services, each pre-selecting the form below. */
export function OwnerServiceCards() {
  const { t } = useLocalization()
  const { service, setService } = useOwnerService()

  const choose = (id: OwnerServiceId) => {
    setService(id)
    document.getElementById("owner-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section id="layanan" className="scroll-mt-24 border-b border-[#E8E4DC] bg-[#FAF7F1] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8C7F5F]">{t("f.svc.eyebrow")}</span>
          <h2 className="mt-1 font-serif text-3xl text-[#222222] sm:text-4xl">{t("f.svc.title")}</h2>
          <p className="mt-2 text-base text-[#5C5347]">{t("f.svc.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {OWNER_SERVICES.map((s) => {
            const Icon = SERVICE_ICONS[s.id]
            const isSelected = service === s.id
            const features = Array.from({ length: s.featureCount }, (_, i) => t(`${s.key}.f${i + 1}`, FEE_VARS))
            return (
              <article
                key={s.id}
                className={`flex flex-col rounded-2xl border bg-white p-7 transition-shadow hover:shadow-md ${
                  isSelected ? "border-[#8C7F5F] ring-1 ring-[#8C7F5F]" : "border-[#E8E4DC]"
                }`}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-[#8C7F5F]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#222222]">{t(`${s.key}.name`)}</h3>
                <p className="mt-2 text-base leading-relaxed text-[#5C5347]">{t(`${s.key}.audience`)}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-base text-[#222222]">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#8C7F5F]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {SERVICE_PAGES[s.id] && (
                  <Link
                    href={SERVICE_PAGES[s.id]!}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C7F5F] hover:underline"
                  >
                    {t("f.svc.learnMore")} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => choose(s.id)}
                  className="mt-6 w-full cursor-pointer rounded-full bg-[#222222] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  {t(`${s.key}.cta`)}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
