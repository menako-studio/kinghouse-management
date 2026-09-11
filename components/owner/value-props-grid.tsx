import { BarChart3, Globe, Sparkles, FileText } from "lucide-react"

const VALUE_PROPS = [
  {
    icon: BarChart3,
    title: "Data-Driven Pricing",
    subtitle: "Algorithmic Yield Optimization",
    description:
      "Our proprietary dynamic pricing engine updates rates in real-time based on local flight searches, market compression, seasonality, and competitor occupancy to maximize gross RevPAR.",
  },
  {
    icon: Globe,
    title: "Omnichannel Marketing",
    subtitle: "Global Direct & OTA Syndication",
    description:
      "Syndicated across Airbnb Superhost networks, VRBO, Booking.com, luxury travel agents, and our high-ranking editorial SEO direct booking funnel.",
  },
  {
    icon: Sparkles,
    title: "Immaculate Maintenance",
    subtitle: "5-Star Hotel Housekeeping & Care",
    description:
      "Rigorous preventative estate engineering, daily pool and garden upkeep, professional linen laundering, and regular architectural condition inspections.",
  },
  {
    icon: FileText,
    title: "Transparent Reporting",
    subtitle: "Live Owner Portal & Financials",
    description:
      "Complete visibility through your 24/7 owner portal. Track live bookings, calendar blocks, maintenance logs, and itemized monthly P&L statements with direct bank payouts.",
  },
]

export function ValuePropsGrid() {
  return (
    <section className="section-macro-spacing bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
            The Kinghouse Advantage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222]">
            Institutional Rigor. Bespoke Hospitality.
          </h2>
          <p className="text-sm sm:text-base text-[#717171] leading-relaxed">
            We treat your villa not merely as a rental, but as a high-performing real estate asset engineered for maximum capital appreciation and net yield.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUE_PROPS.map((prop, idx) => {
            const Icon = prop.icon

            return (
              <div
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA] p-8 transition-all hover:bg-white hover:shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:border-[#D8D5D0]"
              >
                <div className="space-y-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#EBEBEB] text-[#222222] group-hover:bg-[#222222] group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#222222]">{prop.title}</h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#A69C8E]">
                      {prop.subtitle}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-[#717171]">{prop.description}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#EBEBEB] text-[11px] font-semibold text-[#222222] flex items-center justify-between">
                  <span>Standard Metric:</span>
                  <span className="text-[#A69C8E]">Top 1% Performance</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
