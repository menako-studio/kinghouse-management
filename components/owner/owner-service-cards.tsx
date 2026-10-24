"use client"

import { CheckCircle2, Home, KeyRound, Sparkles } from "lucide-react"
import { OWNER_SERVICES, type OwnerServiceId } from "@/lib/funnel/config"
import { useOwnerService } from "./owner-service-context"

const SERVICE_ICONS: Record<OwnerServiceId, typeof Home> = {
  "hk-on-demand": Sparkles,
  "co-hosting": KeyRound,
  "full-management": Home,
}

/** Funnel A step 2 — the three owner services, each pre-selecting the form below. */
export function OwnerServiceCards() {
  const { service, setService } = useOwnerService()

  const choose = (id: OwnerServiceId) => {
    setService(id)
    document.getElementById("owner-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section id="layanan" className="scroll-mt-24 border-b border-[#E8E4DC] bg-[#FAF7F1] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C7F5F]">Pilih layanan</span>
          <h2 className="mt-1 font-serif text-3xl text-[#222222] sm:text-4xl">Tiga cara kami bantu properti Anda</h2>
          <p className="mt-2 text-sm text-[#6B6862]">
            Pilih yang paling sesuai. Form di bawah langsung terisi dengan layanan pilihan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {OWNER_SERVICES.map((s) => {
            const Icon = SERVICE_ICONS[s.id]
            const isSelected = service === s.id
            return (
              <article
                key={s.id}
                className={`flex flex-col rounded-2xl border bg-white p-7 transition-shadow hover:shadow-md ${
                  isSelected ? "border-[#8C7F5F] ring-1 ring-[#8C7F5F]" : "border-[#E8E4DC]"
                }`}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-[#8C7F5F]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl text-[#222222]">{s.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B6862]">{s.audience}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#222222]">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8C7F5F]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => choose(s.id)}
                  className="mt-6 w-full cursor-pointer rounded-full bg-[#222222] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black"
                >
                  {s.cta}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
