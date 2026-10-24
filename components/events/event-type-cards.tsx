"use client"

import Image from "next/image"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { EVENT_TYPES, type EventTypeId } from "@/lib/funnel/config"
import { useLocalization } from "@/lib/context/localization-context"

interface EventTypeCardsProps {
  selected: EventTypeId | null
  onSelect: (id: EventTypeId) => void
}

/** Funnel B2 step 2 — pick the event type; the form below follows the choice. */
export function EventTypeCards({ selected, onSelect }: EventTypeCardsProps) {
  const { t } = useLocalization()

  const choose = (id: EventTypeId) => {
    onSelect(id)
    document.getElementById("event-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section id="jenis-acara" className="scroll-mt-24 border-b border-[#E8E4DC] bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-8 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#8C7F5F]">{t("f.evt.eyebrow")}</span>
          <h2 className="mt-1 font-serif text-3xl text-[#222225] sm:text-4xl">{t("f.evt.title")}</h2>
          <p className="mt-2 text-base leading-relaxed text-[#5C5347]">{t("f.evt.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {EVENT_TYPES.map((type) => {
            const isSelected = selected === type.id
            const name = t(`f.evt.${type.id}.name`)
            const highlights = Array.from({ length: type.highlightCount }, (_, i) => t(`f.evt.${type.id}.h${i + 1}`))
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
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-serif text-2xl text-[#222225]">{name}</h3>
                  <p className="text-base leading-relaxed text-[#5C5347]">{t(`f.evt.${type.id}.text`)}</p>
                  <ul className="flex-1 space-y-2">
                    {highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-base text-[#222225]">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#8C7F5F]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#8C7F5F]">
                    {t("f.evt.cta")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
