import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Compass, ShieldCheck, Sparkles, Building2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About Kinghouse | Editorial Hospitality & Asset Management",
  description:
    "Discover the Kinghouse philosophy: fusing editorial architectural curation with institutional-grade villa asset management in Greater Jakarta.",
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  const leadership = [
    {
      name: "Marcus Aurelius Tan",
      role: "Managing Director & Principal Architect",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      bio: "Former partner at leading architectural studios across Tokyo and Singapore with 15+ years in high-end tropical residential design.",
    },
    {
      name: "Sabrina Alistair",
      role: "Head of Revenue Engineering & OTAs",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      bio: "Ex-OTA yield manager with expertise in algorithmic dynamic pricing and global vacation rental syndication.",
    },
    {
      name: "Julian Danuatmadja",
      role: "Director of Hospitality Operations",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      bio: "Over two decades directing 5-star ultra-luxury boutique resort operations, preventative engineering, and private butler academies.",
    },
  ]

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Editorial Hero */}
      <section className="section-macro-spacing bg-[#FAFAFA] border-b border-[#EBEBEB]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A69C8E]">
              Our Manifesto &bull; Founded 2021
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#222222] font-normal leading-[1.1]">
              Architectural Reverence. <br />
              <span className="italic text-[#717171]">Frictionless Hospitality.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed">
              Kinghouse was created to bridge the divide between world-class architectural residential design and professional, institutional asset management. We believe every villa has a soul, and that exceptional spaces deserve meticulous, data-driven stewardship.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="section-macro-spacing bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
                The Dual Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#222222]">
                Where Never Too Small Meets Airbnb Superhost
              </h2>
              <div className="space-y-4 text-sm text-[#717171] leading-relaxed">
                <p>
                  We are inspired by the purity of micro-architectural documentaries and the seamless UX of the world&apos;s leading hospitality platforms. Our properties are not generic hotel rooms—they are bespoke spaces with distinct spatial stories.
                </p>
                <p>
                  For guests, we remove friction by integrating directly with Airbnb&apos;s trusted ecosystem, offering instant booking peace of mind, backed by on-site Kinghouse butlers and concierge staff.
                </p>
                <p>
                  For owners, we deliver institutional transparency: live accounting, dynamic RevPAR algorithms, and preventative estate maintenance that preserves long-term asset value.
                </p>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <Button size="lg" asChild>
                  <Link href="/owner-services">
                    Partner With Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/villas">
                    Explore Collection
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#EBEBEB] shadow-xs">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                alt="Architectural villa reflection pool"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-macro-spacing bg-[#FAFAFA] border-y border-[#EBEBEB]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A69C8E]">
              Leadership Team
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#222222]">
              Architects, Revenue Engineers & Concierge Directors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#EBEBEB] bg-white p-6 shadow-xs space-y-4"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#EBEBEB]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-[#222222]">{member.name}</h3>
                  <p className="text-xs text-[#A69C8E] font-medium">{member.role}</p>
                </div>
                <p className="text-xs text-[#717171] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
