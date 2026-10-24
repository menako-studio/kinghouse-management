"use client"

import Image from "next/image"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { EVENT_TYPES, type EventTypeId } from "@/lib/funnel/config"

interface EventTypeCardsProps {
  selected: EventTypeId | null
  onSelect: (id: EventTypeId) => void
}

/** Funnel B2 step 2 — pick the event type; the form below follows the choice. */
export function EventTypeCards({ selected, onSelect }: EventTypeCardsProps) {
  const choose = (id: EventTypeId) => {
    onSelect(id)
    document.getElementById("event-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section id="jenis-acara" className="scroll-mt-24 border-b border-[#E8E4DC] bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-8 max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C7F5F]">Pilih jenis acara</span>
          <h2 className="mt-1 font-serif text-3xl text-[#222225] sm:text-4xl">Acara apa yang Anda rencanakan?</h2>
          <p className="mt-2 text-xs leading-relaxed text-[#6B6862] sm:text-sm">
            Pilih satu, isi form singkat, dan tim event membalas dengan pricelist dalam 30 menit kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {EVENT_TYPES.map((type) => {
            const isSelected = selected === type.id
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => choose(type.id)}
                aria-pressed={isSelected}
                className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#FAF8F5] text-left transition-shadow hover:shadow-lg ${
                  isSelected ? "border-[#8C7F5F] ring-1 ring-[#8C7F5F]" : "border-[#E8E4DC]"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={type.image}
                    alt={type.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-serif text-2xl text-[#222225]">{type.name}</h3>
                  <p className="text-xs leading-relaxed text-[#6B6862]">{type.description}</p>
                  <ul className="flex-1 space-y-1.5">
                    {type.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-[#222225]">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8C7F5F]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 pt-2 text-xs font-semibold uppercase tracking-wider text-[#8C7F5F]">
                    Cek tanggal & harga <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
