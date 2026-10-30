"use client"

import Image from "next/image"
import Link from "@/components/ui/localized-link"
import { ArrowRight, CheckCircle2, MapPin, MessageCircle } from "lucide-react"
import { useLocalization } from "@/lib/context/localization-context"
import { buildWhatsAppUrl, ownerWhatsAppMessage } from "@/lib/funnel/whatsapp"
import { trackWhatsAppClick } from "@/lib/analytics"
import { HK_FAQ } from "@/lib/funnel/config"
import { OwnerServiceProvider } from "./owner-service-context"
import { OwnerLeadForm } from "./owner-lead-form"

const INCLUDED = ["f.svc.hk.f1", "f.svc.hk.f2", "f.svc.hk.f3"] as const
const STEPS = [
  ["f.hk.step1", "f.hk.step1Text"],
  ["f.hk.step2", "f.hk.step2Text"],
  ["f.hk.step3", "f.hk.step3Text"],
] as const

/** HK on Demand landing page body — the owner form is pre-set to housekeeping. */
export function HousekeepingContent() {
  const { t, language } = useLocalization()
  const whatsappUrl = buildWhatsAppUrl("OWNER", ownerWhatsAppMessage({ service: "hk-on-demand" }, { t, language }))

  return (
    <OwnerServiceProvider initialService="hk-on-demand">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#231F1A] text-white">
        <Image
          src="/properties/versatile-house/new/VersatileHouse_03_Master_Bedroom.jpg"
          alt={t("f.hk.title")}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover brightness-[0.35]"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="max-w-2xl space-y-5">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#DFC58E]">{t("f.hk.eyebrow")}</span>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{t("f.hk.title")}</h1>
            <p className="text-lg text-white/85">{t("f.hk.intro")}</p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a
                href="#owner-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#DFC58E] px-7 py-3.5 text-base font-bold text-[#19191B] hover:bg-[#C9A96E]"
              >
                {t("f.hk.cta")} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ source: "owner_page", funnel: "owner", context: "hk_landing" })}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" /> {t("f.hk.ctaWhatsapp")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What you get + how it works */}
      <section className="bg-[#FAF7F1] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:px-12">
          <div className="space-y-5">
            <h2 className="font-serif text-3xl text-[#222222]">{t("f.hk.includedTitle")}</h2>
            <ul className="space-y-3">
              {INCLUDED.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-base text-[#222222]">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#8C7F5F]" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-[#E8E4DC] bg-white p-5">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[#222222]">
                <MapPin className="h-5 w-5 text-[#8C7F5F]" /> {t("f.hk.areasTitle")}
              </h3>
              <p className="mt-1.5 text-base text-[#5C5347]">{t("f.hk.areasText")}</p>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="font-serif text-3xl text-[#222222]">{t("f.hk.stepsTitle")}</h2>
            <ol className="space-y-4">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-[#E8E4DC] bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#231F1A] font-serif text-lg text-[#DFC58E]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#222222]">{t(title)}</h3>
                    <p className="mt-1 text-base text-[#5C5347]">{t(text)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl space-y-6 px-6">
          <h2 className="font-serif text-3xl text-[#222222]">{t("f.hk.faqTitle")}</h2>
          <div className="divide-y divide-[#E8E4DC] rounded-2xl border border-[#E8E4DC]">
            {HK_FAQ.map(([q, a]) => (
              <details key={q} className="group p-5">
                <summary className="cursor-pointer list-none text-lg font-semibold text-[#222222] marker:hidden">{t(q)}</summary>
                <p className="mt-2 text-base text-[#5C5347]">{t(a)}</p>
              </details>
            ))}
          </div>
          <Link href="/owner-services#layanan" className="inline-flex items-center gap-1.5 text-base font-semibold text-[#8C7F5F] hover:underline">
            {t("f.hk.otherServices")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <OwnerLeadForm />
    </OwnerServiceProvider>
  )
}
