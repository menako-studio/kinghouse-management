"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, MessageCircle } from "lucide-react"
import { useMounted } from "@/lib/hooks/use-mounted"
import { readThanksPayload, type ThanksPayload } from "@/lib/funnel/client"
import { OFFICE_HOURS, RESPONSE_TARGETS, type LeadTarget } from "@/lib/funnel/config"
import { trackWhatsAppClick, type FunnelName } from "@/lib/analytics"
import { CURATED_VILLAS } from "@/lib/data"

const TEAM_NAME: Record<LeadTarget, string> = {
  OWNER: "Tim owner relations",
  EVENT: "Tim event",
  STAY: "Tim reservasi",
}

const FUNNEL_OF: Record<LeadTarget, FunnelName> = { OWNER: "owner", EVENT: "event", STAY: "stay" }

/** Next step per funnel: pricelist for events, booking for stays, simulator for owners. */
function NextStep({ lead }: { lead: ThanksPayload }) {
  if (lead.target === "EVENT") {
    return (
      <Link href="/events#pricelist" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7F5F] hover:underline">
        Sambil menunggu, lihat pricelist paket event <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    )
  }
  if (lead.target === "STAY") {
    const villa = CURATED_VILLAS.find((v) => v.slug === lead.propertySlug)
    const href = villa ? `/locations/${villa.areaSlug}/villas/${villa.slug}` : "/villas"
    return (
      <Link href={href} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7F5F] hover:underline">
        {villa ? `Kembali ke ${villa.name}` : "Lihat properti lain yang tersedia"} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    )
  }
  return (
    <Link href="/owner-services#calculator" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7F5F] hover:underline">
      Simulasikan proyeksi pendapatan properti Anda <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  )
}

export default function ThanksPage() {
  const mounted = useMounted()
  const lead = mounted ? readThanksPayload() : null

  return (
    <main className="min-h-screen bg-[#FAF7F1] pb-20 pt-32">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-[#E8E4DC] bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#231F1A]">
            <CheckCircle2 className="h-8 w-8 text-[#DFC58E]" />
          </div>

          <h1 className="mt-6 font-serif text-3xl text-[#222222] sm:text-4xl">
            {lead ? `Terima kasih, ${lead.name.split(" ")[0]}!` : "Terima kasih!"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6B6862]">
            {lead
              ? `${TEAM_NAME[lead.target]} akan menghubungi Anda via WhatsApp dalam ${RESPONSE_TARGETS[lead.target].label} kerja.`
              : "Permintaan Anda sudah kami terima. Tim kami akan menghubungi Anda via WhatsApp."}
          </p>

          {lead && (
            <>
              <dl className="mt-8 divide-y divide-[#F0ECE1] rounded-2xl border border-[#E8E4DC] bg-[#FAF8F5] text-left text-sm">
                {lead.summary.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 px-5 py-2.5">
                    <dt className="text-[#6B6862]">{row.label}</dt>
                    <dd className="text-right font-medium text-[#222222]">{row.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 px-5 py-2.5">
                  <dt className="text-[#6B6862]">No. referensi</dt>
                  <dd className="font-mono text-xs text-[#222222]">{lead.leadId}</dd>
                </div>
              </dl>

              <a
                href={lead.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({ source: "thank_you_page", funnel: FUNNEL_OF[lead.target], context: lead.leadId })
                }
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4 fill-white" /> Kirim ringkasan ini via WhatsApp
              </a>
              <p className="mt-2 text-[11px] text-[#717171]">Opsional — agar bisa langsung kami balas di chat.</p>

              <div className="mt-6">
                <NextStep lead={lead} />
              </div>
            </>
          )}

          {!lead && mounted && (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/villas" className="text-xs font-semibold text-[#8C7F5F] hover:underline">
                Cari tempat menginap
              </Link>
              <Link href="/events" className="text-xs font-semibold text-[#8C7F5F] hover:underline">
                Venue acara
              </Link>
              <Link href="/owner-services" className="text-xs font-semibold text-[#8C7F5F] hover:underline">
                Layanan pemilik
              </Link>
            </div>
          )}

          <p className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-[#717171]">
            <Clock className="h-3.5 w-3.5" /> Jam kantor {OFFICE_HOURS.label}. {OFFICE_HOURS.conciergeNote}
          </p>
        </div>
      </div>
    </main>
  )
}
