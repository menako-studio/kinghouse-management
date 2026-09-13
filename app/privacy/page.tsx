import { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Kinghouse Management",
  description:
    "Learn how Kinghouse Management collects, utilizes, and protects guest, property owner, and visitor personal data under Indonesian UU PDP.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Kinghouse Management",
    description:
      "Learn how Kinghouse Management collects, utilizes, and protects guest and property owner personal data.",
    url: "/privacy",
    type: "website",
  },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 1, 2026"

  return (
    <main className="min-h-screen bg-[#FAF7F1]">
      {/* Header */}
      <section className="bg-[#231F1A] text-white pt-28 pb-16 lg:pt-32 lg:pb-20 supergraphic-blueprint-charcoal">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-[#DFC58E] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
            <Shield className="h-4 w-4" />
            <span>Privacy &amp; Data Protection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.1em] font-normal leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#E0DACB] font-light">
            Last Updated &amp; In Effect: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8E4DC] bg-white p-8 sm:p-12 shadow-xs space-y-10 text-[#333333] font-light leading-relaxed">
            
            {/* Overview */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                1. Overview &amp; Commitment to Privacy
              </h2>
              <p className="text-sm">
                <strong>PT Kreasi Usman Gosse</strong> doing business as <strong>Kinghouse Management</strong> (&ldquo;Kinghouse&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is dedicated to protecting your personal data. This Privacy Policy details how we collect, process, store, and safeguard information obtained through <strong>kinghousemanagement.com</strong>, our direct reservation channels, WhatsApp concierge, and property management onboarding, in strict compliance with Indonesian Law No. 27 of 2022 on Personal Data Protection (UU PDP).
              </p>
            </div>

            {/* Information Collected */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                2. Information We Collect
              </h2>
              <p className="text-sm mb-3">Depending on whether you are a guest, property owner, or web visitor, we may collect:</p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong>Guest Data:</strong> Full name, email address, telephone/WhatsApp number, national identity card (KTP) or passport for check-in verification, arrival times, and special concierge requests.
                </li>
                <li>
                  <strong>Property Owner Data:</strong> Proof of property ownership, bank account details for revenue disbursements, utility accounts, and property inventory specifications.
                </li>
                <li>
                  <strong>Technical &amp; Analytics Data:</strong> IP address, device type, browser metadata, approximate geographic location, and navigational interactions collected via privacy-conscious analytics (Google Analytics 4).
                </li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                3. Purpose of Data Processing
              </h2>
              <p className="text-sm mb-3">Your personal data is strictly utilized for legitimate hospitality and business purposes:</p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>To confirm reservations, generate smart-keypad access PINs, and provide 24/7 on-stay concierge assistance.</li>
                <li>To execute owner revenue disbursements, calculate net yield splits, and issue transparent monthly statements.</li>
                <li>To ensure community safety, verify guest identity, and comply with local Indonesian residential neighborhood reporting (RT/RW) where mandated by law.</li>
                <li>To improve site performance, analyze booking demand across Jabodetabek, and deliver tailored promotional offers (with opt-out options).</li>
              </ul>
            </div>

            {/* Data Sharing & Third Parties */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                4. Data Sharing &amp; Third-Party Disclosures
              </h2>
              <p className="text-sm mb-3">We do not sell, rent, or trade your personal data. Data is shared solely with trusted parties under strict confidentiality agreements:</p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong>Operational Partners:</strong> On-site property managers, vetted housekeeping supervisors, and emergency maintenance technicians strictly on a need-to-know basis.
                </li>
                <li>
                  <strong>OTA Platforms:</strong> Airbnb, Booking.com, or VRBO for automated calendar availability synchronization.
                </li>
                <li>
                  <strong>Financial Institutions:</strong> Licensed payment gateways and Indonesian banks to securely process transactions and payouts.
                </li>
              </ul>
            </div>

            {/* Data Security & Retention */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                5. Security Measures &amp; Data Retention
              </h2>
              <p className="text-sm">
                We implement industry-standard administrative, physical, and technical safeguards — including HTTPS SSL/TLS encryption, restricted access controls, and encrypted database storage — to protect against unauthorized access, loss, or alteration. We retain personal data only as long as necessary to fulfill the reservation, accounting, and legal requirements.
              </p>
            </div>

            {/* User Rights */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                6. Your Rights Under UU PDP
              </h2>
              <p className="text-sm mb-3">Under Indonesian law, you maintain the right to:</p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request rectification of incomplete, inaccurate, or outdated information.</li>
                <li>Request the deletion or destruction of your personal data when no longer legally required.</li>
                <li>Withdraw consent for marketing communications at any time.</li>
              </ul>
            </div>

            {/* Cookies Policy */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                7. Cookies &amp; Tracking Technologies
              </h2>
              <p className="text-sm">
                Our platform utilizes essential cookies to remember currency preferences (IDR, USD, EUR, etc.), language settings, and anonymous telemetry. You may disable cookies in your web browser settings; however, certain interactive booking features may be impaired.
              </p>
            </div>

            {/* Contact Information */}
            <div className="pt-6 border-t border-[#E8E4DC]">
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-2">
                8. Contact Our Data Protection Officer (DPO)
              </h2>
              <p className="text-sm mb-4">
                To exercise your privacy rights or submit questions regarding data handling, please contact:
              </p>
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E8E4DC] text-xs space-y-1 text-[#555555]">
                <p className="font-semibold text-[#222222]">Kinghouse Data Privacy Desk</p>
                <p>PT Kreasi Usman Gosse</p>
                <p>Email: info@kinghousemanagement.com</p>
                <p>Phone / WhatsApp: +62 821 2393 3218</p>
                <p>Address: Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15416, Indonesia</p>
              </div>
            </div>

          </div>

          {/* Quick links footer */}
          <div className="mt-8 flex items-center justify-between text-xs text-[#777777]">
            <Link href="/terms" className="hover:text-[#8C7F5F] transition-colors flex items-center space-x-1">
              <Lock className="h-3.5 w-3.5" />
              <span>Read Terms &amp; Conditions</span>
            </Link>
            <Link href="/contact" className="hover:text-[#8C7F5F] transition-colors flex items-center space-x-1">
              <span>Contact Concierge</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
