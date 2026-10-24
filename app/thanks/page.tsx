"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, MessageCircle } from "lucide-react"
import { useMounted } from "@/lib/hooks/use-mounted"
import { readThanksPayload, type ThanksPayload } from "@/lib/funnel/client"
import { RESPONSE_TARGETS, type LeadTarget } from "@/lib/funnel/config"
import { buildLeadWhatsAppUrl, summarizeLead } from "@/lib/funnel/lead"
import { trackWhatsAppClick, type FunnelName } from "@/lib/analytics"
import { useLocalization } from "@/lib/context/localization-context"
import { CURATED_VILLAS } from "@/lib/data"

const FUNNEL_OF: Record<LeadTarget, FunnelName> = { OWNER: "owner", EVENT: "event", STAY: "stay" }

const linkClass = "inline-flex items-center gap-1.5 text-base font-semibold text-[#8C7F5F] hover:underline"

/** Next step per funnel: price list for events, the property for stays, the income simulator for owners. */
function NextStep({ payload }: { payload: ThanksPayload }) {
  const { t } = useLocalization()
  const target = payload.lead.target

  if (target === "EVENT") {
    return (
      <Link href="/events#pricelist" className={linkClass}>
        {t("f.thanks.next.EVENT")} <ArrowRight className="h-4 w-4" />
      </Link>
    )
  }
  if (target === "STAY") {
    const villa = CURATED_VILLAS.find((v) => v.slug === payload.propertySlug)
    return (
      <Link href={villa ? `/locations/${villa.areaSlug}/villas/${villa.slug}` : "/villas"} className={linkClass}>
        {villa ? t("f.thanks.next.STAY", { property: villa.name }) : t("f.thanks.next.STAYgeneric")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )
  }
  return (
    <Link href="/owner-services#calculator" className={linkClass}>
      {t("f.thanks.next.OWNER")} <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

export default function ThanksPage() {
  const { t, language } = useLocalization()
  const mounted = useMounted()
  const payload = mounted ? readThanksPayload() : null
  const lead = payload?.lead
  const locale = { t, language }

  return (
    <main className="min-h-screen bg-[#FAF7F1] pb-20 pt-16 sm:pt-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-[#E8E4DC] bg-white p-6 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#231F1A]">
            <CheckCircle2 className="h-8 w-8 text-[#DFC58E]" />
          </div>

          <h1 className="mt-6 font-serif text-3xl text-[#222222] sm:text-4xl">
            {lead ? t("f.thanks.title", { name: lead.name.trim().split(/\s+/)[0] }) : t("f.thanks.titleGeneric")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[#5C5347]">
            {lead
              ? t("f.thanks.reply", {
                  team: t(`f.thanks.team.${lead.target}`),
                  time: t(RESPONSE_TARGETS[lead.target].labelKey),
                })
              : t("f.thanks.replyGeneric")}
          </p>

          {payload && lead && (
            <>
              <dl className="mt-8 divide-y divide-[#F0ECE1] rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] text-left text-base">
                {summarizeLead(lead, locale).map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 px-5 py-3">
                    <dt className="text-[#5C5347]">{row.label}</dt>
                    <dd className="text-right font-medium text-[#222222]">{row.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-[#5C5347]">{t("f.thanks.reference")}</dt>
                  <dd className="font-mono text-sm text-[#222222]">{payload.leadId}</dd>
                </div>
              </dl>

              <a
                href={buildLeadWhatsAppUrl(lead, payload.leadId, locale)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({ source: "thank_you_page", funnel: FUNNEL_OF[lead.target], context: payload.leadId })
                }
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-md transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5 fill-white" /> {t("f.thanks.sendWhatsapp")}
              </a>
              <p className="mt-2 text-sm text-[#5C5347]">{t("f.thanks.sendHint")}</p>

              <div className="mt-6">
                <NextStep payload={payload} />
              </div>
            </>
          )}

          {!payload && mounted && (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
              <Link href="/villas" className={linkClass}>
                {t("f.thanks.link.stay")}
              </Link>
              <Link href="/events" className={linkClass}>
                {t("f.thanks.link.events")}
              </Link>
              <Link href="/owner-services" className={linkClass}>
                {t("f.thanks.link.owner")}
              </Link>
            </div>
          )}

          <p className="mt-10 flex flex-col items-center justify-center gap-1 text-sm text-[#5C5347] sm:flex-row sm:gap-1.5">
            <Clock className="h-4 w-4" /> {t("f.officeHours")}. {t("f.conciergeNote")}
          </p>
        </div>
      </div>
    </main>
  )
}
