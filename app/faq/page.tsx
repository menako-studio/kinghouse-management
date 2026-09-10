"use client"

import { useState } from "react"
import Link from "next/link"
import { HelpCircle, ChevronDown, MessageCircle, ArrowRight, ShieldCheck, Home, Key } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

interface FaqCategory {
  id: string
  title: string
  icon: typeof HelpCircle
  items: FaqItem[]
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "guests",
    title: "Guest Stays & Booking",
    icon: Key,
    items: [
      {
        question: "How do check-in and check-out work at KingHouse properties?",
        answer:
          "Standard check-in is at 14:00 (2:00 PM) and check-out is at 12:00 PM (noon). All KingHouse properties feature smart keypad self check-in or a dedicated butler meet-and-greet. 24 hours before your arrival, you will receive full access codes and a localized arrival guide.",
      },
      {
        question: "Can I host private events or garden weddings?",
        answer:
          "Yes! Selected estates such as Versatile House in Jagakarsa are fully licensed and equipped for private garden weddings, birthdays, and corporate retreats up to 150 guests. Event bookings require pre-coordination with our events concierge for noise permits and layout setup.",
      },
      {
        question: "What is the cancellation policy for guest bookings?",
        answer:
          "Direct bookings through KingHouse qualify for a full 100% refund if cancelled at least 14 days before check-in, and a 50% refund if cancelled up to 7 days before check-in. Bookings made via Airbnb follow the strict or moderate policy indicated on the respective listing.",
      },
      {
        question: "Are pets allowed at KingHouse villas?",
        answer:
          "Pet policies vary by property. Standalone estates with enclosed gardens (like Versatile House) allow well-behaved small-to-medium pets with prior notification and a standard pet sanitation deposit. High-rise apartment suites in Palmerah and Cikarang observe building management pet regulations.",
      },
    ],
  },
  {
    id: "owners",
    title: "Property Owner Management",
    icon: Home,
    items: [
      {
        question: "How does KingHouse calculate owner revenue and management fees?",
        answer:
          "We offer two transparent models: 15% Standard (full OTA management, dynamic pricing, guest communications, calendar sync) and 20% Premium (adds full end-to-end linen laundry, amenities replenishment, and dedicated on-site butler operations). Owners receive transparent monthly statements with zero hidden markups.",
      },
      {
        question: "When and how are monthly owner payouts disbursed?",
        answer:
          "Statements and payouts are disbursed automatically on the 5th business day of each calendar month via Indonesian bank transfer (BCA, Mandiri, BNI, BRI) or international wire, accompanied by a 1-click downloadable CSV/PDF ledger of all gross bookings, cleaning fees, and net yield.",
      },
      {
        question: "What dynamic pricing strategy does KingHouse employ?",
        answer:
          "Our revenue desk uses real-time market occupancy signals, seasonal concert/expo demand in Jakarta, weekend vs weekday elasticity, and competitor benchmarking to optimize nightly rates dynamically, routinely lifting client RevPAR by 25% to 40%.",
      },
      {
        question: "How does KingHouse vet incoming guests to safeguard my property?",
        answer:
          "All prospective guests undergo ID verification, Airbnb review history screening, and party-risk assessment. For standalone villas, security deposits are held, and noise monitoring decibel thresholds are actively enforced.",
      },
    ],
  },
  {
    id: "operations",
    title: "Safety, Cleaning & Housekeeping",
    icon: ShieldCheck,
    items: [
      {
        question: "What are KingHouse's linen and hygiene standards?",
        answer:
          "We maintain commercial hotel-grade white cotton 300+ thread count linens, sanitized duvets, and vacuum-sealed guest amenities (shampoo, body wash, dental kit). Every turnover follows a 48-point deep cleaning protocol inspected by a supervisor before guest arrival.",
      },
      {
        question: "What happens if a guest damages something in my villa?",
        answer:
          "Any damages are documented with photo evidence during same-day check-out inspection. Funds are deducted directly from the guest security deposit or claimed via Airbnb AirCover protection (up to $3M). Our on-call maintenance technician repairs or replaces items immediately.",
      },
    ],
  },
]

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("guests")
  const [openItem, setOpenItem] = useState<string | null>("guests-0")

  const currentCategoryData =
    FAQ_CATEGORIES.find((c) => c.id === activeCategory) || FAQ_CATEGORIES[0]

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="bg-[#24221F] text-white pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <div className="inline-flex items-center space-x-2 text-[#DFC58E] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
            <HelpCircle className="h-4 w-4" />
            <span>KingHouse Knowledge Base</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[0.1em] font-normal leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#E0DACB] font-light max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about booking private stays, hosting events, and partnering with our asset management team.
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
                  <span>{cat.title}</span>
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
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#8C7F5F] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#666666] font-light leading-relaxed border-t border-[#F5F3EE]">
                      {item.answer}
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
                Have a specific question?
              </h3>
              <p className="text-xs text-[#F0EBE0] font-light max-w-md">
                Our concierge team is available 24/7 on WhatsApp to assist with bespoke villa requests, check-in logistics, or asset management feasibility audits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href="https://wa.me/6282123933218?text=Hello%20KingHouse!%20I%20have%20a%20question%20regarding%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-full bg-white text-[#8C7F5F] px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all shadow-sm"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-1.5 rounded-full border border-white/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
              >
                <span>Contact Form</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
