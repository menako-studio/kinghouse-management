import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Compass, TrendingUp, Sparkles, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DualPathSplit() {
  return (
    <section className="section-macro-spacing bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left 50%: B2C Guest Escape */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#111111] text-white min-h-[520px] p-8 sm:p-12">
            {/* Background Lifestyle Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"
                alt="Versatile house garden and private pool"
                fill
                className="object-cover brightness-[0.45] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Top Label */}
            <div className="relative z-10 flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/15">
                <Compass className="mr-1.5 h-3 w-3 text-[#A69C8E]" />
                For Discerning Travelers (B2C)
              </span>
            </div>

            {/* Bottom Content & CTA */}
            <div className="relative z-10 space-y-4 max-w-md pt-24">
              <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                Architectural Retreats, <br />
                <span className="italic text-[#E5E2DC]">Frictionless Airbnb Stays.</span>
              </h3>
              <p className="text-sm text-white/80 font-light leading-relaxed">
                Discover private pool sanctuaries with dedicated concierge, artisan breakfasts, and verified Superhost guarantees.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-[#222222] hover:bg-[#F2EFEB] hover:text-black border-none font-semibold text-xs uppercase tracking-widest px-8 shadow-lg"
                >
                  <Link href="/villas">
                    Book Your Escape <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right 50%: B2B Owner ROI & Asset Management */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#1A1A18] text-white min-h-[520px] p-8 sm:p-12">
            {/* Background Architectural Blueprint / Structure Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp"
                alt="Skyline luxury skyline view and layout"
                fill
                className="object-cover brightness-[0.40] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
            </div>

            {/* Top Label */}
            <div className="relative z-10 flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-[#A69C8E]/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#EAE8E4] backdrop-blur-md border border-[#A69C8E]/40">
                <TrendingUp className="mr-1.5 h-3 w-3 text-[#A69C8E]" />
                For Villa Owners & Investors (B2B)
              </span>
            </div>

            {/* Bottom Content & CTA */}
            <div className="relative z-10 space-y-4 max-w-md pt-24">
              <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                Turnkey Operations, <br />
                <span className="italic text-[#E5E2DC]">Maximized Asset Yield.</span>
              </h3>
              <p className="text-sm text-white/80 font-light leading-relaxed">
                Dynamic revenue algorithms, transparent 15%–20% fee structures, 5-star hotel maintenance, and live owner P&L dashboards.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#A69C8E] text-white hover:bg-[#8F8577] border-none font-semibold text-xs uppercase tracking-widest px-8 shadow-lg"
                >
                  <Link href="/owner-services">
                    Maximize Your Villa&apos;s ROI <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
