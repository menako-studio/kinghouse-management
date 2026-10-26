"use client"

import { useState } from "react"
import Link from "@/components/ui/localized-link"
import { HelpCircle, ChevronDown, MessageCircle, ArrowRight } from "lucide-react"
import { FAQ_CATEGORIES } from "@/lib/faq"
import { useLocalization } from "@/lib/context/localization-context"

export default function FaqPage() {
  const { tc } = useLocalization()
  const [activeCategory, setActiveCategory] = useState("guests")
  const [openItem, setOpenItem] = useState<string | null>("guests-0")

  const currentCategoryData =
    FAQ_CATEGORIES.find((c) => c.id === activeCategory) || FAQ_CATEGORIES[0]

  return (
    <main className="min-h-screen bg-[#FAF7F1]">
      {/* Hero */}
      <section className="bg-[#231F1A] text-white pt-28 pb-16 lg:pt-32 lg:pb-20 supergraphic-blueprint-charcoal">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <div className="inline-flex items-center space-x-2 text-[#DFC58E] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
            <HelpCircle className="h-4 w-4" />
            <span>{tc("Kinghouse Knowledge Base")}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[0.1em] font-normal leading-tight">
            {tc("Frequently Asked Questions")}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#E0DACB] font-light max-w-2xl mx-auto leading-relaxed">
            {tc("Everything you need to know about booking private stays, hosting events, and partnering with our asset management team.")}
          </p>
        </div>
      </section>

      {/* Category Tabs & Accordion */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setOpenItem(`${cat.id}-0`)
                  }}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#8C7F5F] text-white shadow-md scale-102"
                      : "bg-white text-[#666666] border border-[#E8E4DC] hover:border-[#8C7F5F] hover:text-[#222222]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tc(cat.title)}</span>
                </button>
              )
            })}
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {currentCategoryData.items.map((item, idx) => {
              const itemId = `${currentCategoryData.id}-${idx}`
              const isOpen = openItem === itemId

              return (
                <div
                  key={itemId}
                  className="rounded-2xl border border-[#E8E4DC] bg-white transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenItem(isOpen ? null : itemId)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-[#FAF8F5]"
                  >
                    <span className="font-serif text-base sm:text-lg text-[#222222] font-normal pr-4">
                      {tc(item.question)}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#8C7F5F] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#666666] font-light leading-relaxed border-t border-[#F5F3EE]">
                      {tc(item.answer)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-14 rounded-3xl bg-[#8C7F5F] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-serif text-2xl uppercase tracking-wider font-normal">
                {tc("Have a specific question?")}
              </h3>
              <p className="text-xs text-[#F0EBE0] font-light max-w-md">
                {tc("Our concierge team is available 24/7 on WhatsApp to assist with bespoke villa requests, check-in logistics, or asset management feasibility audits.")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href="https://wa.me/6282123933218?text=Hello%20Kinghouse!%20I%20have%20a%20question%20regarding%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-full bg-white text-[#8C7F5F] px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all shadow-sm"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>{tc("Chat on WhatsApp")}</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-1.5 rounded-full border border-white/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
              >
                <span>{tc("Contact Form")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
