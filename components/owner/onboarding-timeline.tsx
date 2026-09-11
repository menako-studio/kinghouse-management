import { ClipboardCheck, Camera, Rocket, CheckCircle2 } from "lucide-react"

const ONBOARDING_STEPS = [
  {
    step: "01",
    icon: ClipboardCheck,
    title: "Valuation & Comprehensive Asset Audit",
    duration: "Day 1 – 3",
    description:
      "We conduct an on-site physical inspection, compile a competitive RevPAR analysis, review structural inventory, and present a projected EBITDA yield model.",
    deliverables: [
      "Full 120-point property condition report",
      "Dynamic pricing revenue projection",
      "Interior & amenity enhancement suggestions",
    ],
  },
  {
    step: "02",
    icon: Camera,
    title: "Media Production & Staff Protocol Onboarding",
    duration: "Day 4 – 10",
    description:
      "Our creative crew captures architectural photography, video reels, and 3D floorplans while our hospitality operations team trains staff to Kinghouse 5-star standards.",
    deliverables: [
      "Editorial photography & drone videography",
      "Standard Operating Procedures (SOP) deployment",
      "Starlink & smart digital lock installation",
    ],
  },
  {
    step: "03",
    icon: Rocket,
    title: "Global Syndication & Revenue Launch",
    duration: "Day 11 – 14",
    description:
      "Your property goes live on Airbnb Superhost networks, VRBO, Booking.com, and Kinghouse editorial channels with algorithmic dynamic pricing active immediately.",
    deliverables: [
      "Instant multi-channel listing deployment",
      "24/7 guest communication activation",
      "Real-time owner portal access granted",
    ],
  },
]

export function OnboardingTimeline() {
  return (
    <section id="onboarding" className="section-macro-spacing bg-[#FAFAFA] border-y border-[#EBEBEB]">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
            Rapid 14-Day Deployment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#222222]">
            The 3-Step Onboarding Process
          </h2>
          <p className="text-sm sm:text-base text-[#717171] leading-relaxed">
            From initial asset evaluation to generating high-yielding bookings in less than two weeks.
          </p>
        </div>

        {/* 3-Step Timeline Grid / Vertical Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {ONBOARDING_STEPS.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="relative flex flex-col justify-between rounded-2xl border border-[#EBEBEB] bg-white p-8 shadow-xs space-y-6"
              >
                <div className="space-y-6">
                  {/* Step Monogram & Duration */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-4xl text-[#A69C8E] font-normal">
                      {item.step}
                    </span>
                    <span className="rounded-full bg-[#FAFAFA] border border-[#EBEBEB] px-3 py-1 text-[11px] font-semibold text-[#222222]">
                      {item.duration}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-[#222222]" />
                      <h3 className="text-base font-semibold text-[#222222]">{item.title}</h3>
                    </div>
                    <p className="text-xs text-[#717171] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2 pt-2 border-t border-[#EBEBEB]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#222222] block">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-1.5">
                      {item.deliverables.map((deliv, dIdx) => (
                        <li key={dIdx} className="flex items-start space-x-2 text-[11px] text-[#555555]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#A69C8E] shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
