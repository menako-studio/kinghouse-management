"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BedDouble, Building2, PartyPopper } from "lucide-react"
import { useLocalization } from "@/lib/context/localization-context"

const GUEST_PATHS = [
  {
    href: "/villas",
    icon: BedDouble,
    titleKey: "f.gate.stayTitle",
    textKey: "f.gate.stayText",
    ctaKey: "f.gate.stayCta",
    image: "/properties/versatile-house/new/VersatileHouse_03_Master_Bedroom.jpg",
  },
  {
    href: "/events#jenis-acara",
    icon: PartyPopper,
    titleKey: "f.gate.eventTitle",
    textKey: "f.gate.eventText",
    ctaKey: "f.gate.eventCta",
    image: "/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg",
  },
] as const

/**
 * Funnel entry: the homepage asks one question first — owner or guest — and
 * routes each answer to its own qualification form and WhatsApp line.
 */
export function FunnelEntryGate() {
  const { t } = useLocalization()

  return (
    <section id="mulai" aria-labelledby="funnel-gate-heading" className="bg-[#FAF7F1] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8C7F5F]">{t("f.gate.eyebrow")}</span>
          <h2 id="funnel-gate-heading" className="mt-1 font-serif text-3xl text-[#222222] sm:text-4xl">
            {t("f.gate.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Target 1 — Owner / Host */}
          <div className="relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl bg-[#231F1A] p-8 text-white lg:col-span-2">
            <Image
              src="/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp"
              alt={t("f.gate.ownerImageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover brightness-[0.35]"
            />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold">
                <Building2 className="h-4 w-4 text-[#DFC58E]" />
                {t("f.gate.ownerBadge")}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl">{t("f.gate.ownerTitle")}</h3>
              <p className="text-base text-white/85">{t("f.gate.ownerText")}</p>
              <Link
                href="/owner-services#layanan"
                className="inline-flex items-center gap-2 rounded-full bg-[#DFC58E] px-6 py-3 text-sm font-bold text-[#19191B] transition-colors hover:bg-[#C9A96E]"
              >
                {t("f.gate.ownerCta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Target 2 — Guest: stay or event */}
          <div className="space-y-3 lg:col-span-3">
            <p className="text-sm font-bold uppercase tracking-wider text-[#5C5347]">{t("f.gate.guestLabel")}</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {GUEST_PATHS.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3EFE6]">
                    <Image
                      src={path.image}
                      alt={t(path.titleKey)}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <div className="flex items-center gap-2 text-[#8C7F5F]">
                      <path.icon className="h-5 w-5" />
                      <h3 className="font-serif text-2xl text-[#222222]">{t(path.titleKey)}</h3>
                    </div>
                    <p className="flex-1 text-base leading-relaxed text-[#5C5347]">{t(path.textKey)}</p>
                    <span className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#8C7F5F]">
                      {t(path.ctaKey)}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
