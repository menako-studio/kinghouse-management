import { Metadata } from "next"
import Link from "next/link"
import { FileText, Shield, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions | KingHouse Management",
  description:
    "Official Terms and Conditions governing guest reservations, property asset management, and concierge services provided by KingHouse Management.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions | KingHouse Management",
    description:
      "Official Terms and Conditions governing guest reservations, property asset management, and concierge services provided by KingHouse Management.",
    url: "/terms",
    type: "website",
  },
}

export default function TermsPage() {
  const lastUpdated = "September 1, 2026"

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#24221F] text-white pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-[#DFC58E] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
            <FileText className="h-4 w-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.1em] font-normal leading-tight">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#E0DACB] font-light">
            Effective Date & Last Revised: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8E4DC] bg-white p-8 sm:p-12 shadow-xs space-y-10 text-[#333333] font-light leading-relaxed">
            
            {/* Introduction */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                1. Acceptance of Terms & Scope of Services
              </h2>
              <p className="text-sm">
                These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;Guest&rdquo;, &ldquo;Owner&rdquo;, or &ldquo;User&rdquo;) and <strong>PT Kreasi Usman Gosse</strong> operating as <strong>KingHouse Hospitality & Property Management</strong> (&ldquo;KingHouse&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing our website, booking a stay, reserving an event venue, or entering into an asset management agreement, you expressly agree to abide by these Terms.
              </p>
            </div>

            {/* Guest Reservations & Bookings */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                2. Guest Reservations & Payment Policies
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong>Booking Confirmation:</strong> Reservations made directly through KingHouse require full payment or an agreed deposit before confirmation vouchers and smart keypad access codes are issued.
                </li>
                <li>
                  <strong>Third-Party Portals (Airbnb, Booking.com):</strong> Bookings made through external online travel agencies remain subject to their respective terms alongside KingHouse house rules.
                </li>
                <li>
                  <strong>Check-in and Check-out:</strong> Check-in commences at 14:00 (2:00 PM) Western Indonesia Time (WIB) and check-out is strictly at 12:00 PM (noon). Early arrivals or late departures are subject to availability and supplementary fees.
                </li>
              </ul>
            </div>

            {/* House Rules & Guest Conduct */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                3. House Rules, Maximum Capacity & Security Deposits
              </h2>
              <p className="text-sm mb-3">
                To preserve residential tranquility and comply with local regulations (RT/RW) across Jakarta Selatan, Tangerang, Jakarta Barat, and Bekasi:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong>Quiet Hours:</strong> Quiet hours are observed between 22:00 (10:00 PM) and 07:00 (7:00 AM). Amplified music, excessive outdoor noise, and unauthorized commercial filming are prohibited without prior written permit.
                </li>
                <li>
                  <strong>Maximum Occupancy:</strong> The number of occupants must not exceed the stated capacity in your booking voucher. Unregistered overnight visitors are strictly disallowed.
                </li>
                <li>
                  <strong>Security Deposit & Damage:</strong> A refundable security deposit may be required upon check-in. The guest assumes financial responsibility for any damage, loss of keys, or required specialized restorative cleaning caused during their tenure.
                </li>
              </ul>
            </div>

            {/* Cancellations & Refunds */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                4. Cancellation, Alterations & Refunds
              </h2>
              <p className="text-sm">
                Direct booking cancellations initiated 14 days or more prior to the scheduled check-in date qualify for a 100% refund (less transaction processing fees). Cancellations between 7 and 13 days prior qualify for a 50% refund. Cancellations made fewer than 7 days prior to check-in, as well as no-shows, are non-refundable.
              </p>
            </div>

            {/* Owner Asset Management Agreement */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                5. Property Owner Asset Management Provisions
              </h2>
              <p className="text-sm mb-3">
                For property owners entrusting estates or apartments to KingHouse:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  <strong>Management Commission:</strong> KingHouse deducts an agreed management commission (15% Standard or 20% Premium) from gross booking revenue, as defined in the bespoke Asset Management Schedule.
                </li>
                <li>
                  <strong>Monthly Statements & Disbursements:</strong> Revenue statements and disbursements are issued on or before the 5th of every calendar month following audited ledger reconciliation.
                </li>
                <li>
                  <strong>Property Maintenance:</strong> Regular routine maintenance below pre-approved thresholds is executed promptly to safeguard guest satisfaction and protect long-term asset value.
                </li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                6. Limitation of Liability & Force Majeure
              </h2>
              <p className="text-sm">
                KingHouse Hospitality Management shall not be held liable for personal injury, theft, loss of personal effects, or disruptions caused by events beyond reasonable control (including acts of nature, municipal utility interruptions, government restrictions, or force majeure). Guests are encouraged to maintain comprehensive travel and personal property insurance.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-3">
                7. Governing Law & Dispute Resolution
              </h2>
              <p className="text-sm">
                These Terms shall be interpreted, construed, and enforced in accordance with the laws of the Republic of Indonesia. Any disputes arising from or in connection with these Terms shall first be attempted to be resolved amicably, failing which they shall be submitted to the exclusive jurisdiction of the District Court of South Jakarta (Pengadilan Negeri Jakarta Selatan).
              </p>
            </div>

            {/* Contact Information */}
            <div className="pt-6 border-t border-[#E8E4DC]">
              <h2 className="font-serif text-xl sm:text-2xl text-[#222222] uppercase tracking-wider mb-2">
                8. Contact & Legal Notices
              </h2>
              <p className="text-sm mb-4">
                If you have questions regarding these Terms &amp; Conditions or require formal legal correspondence, please contact:
              </p>
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E8E4DC] text-xs space-y-1 text-[#555555]">
                <p className="font-semibold text-[#222222]">PT Kreasi Usman Gosse / KingHouse Management</p>
                <p>Legal &amp; Compliance Department</p>
                <p>Email: ptkreasiusmangosse@gmail.com</p>
                <p>WhatsApp Hotline: +62 821 2393 3218</p>
                <p>Address: Jalan Jagakarsa No. 9, Jakarta Selatan, DKI Jakarta 12620, Indonesia</p>
              </div>
            </div>

          </div>

          {/* Quick links footer */}
          <div className="mt-8 flex items-center justify-between text-xs text-[#777777]">
            <Link href="/privacy" className="hover:text-[#8C7F5F] transition-colors flex items-center space-x-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Read Privacy Policy</span>
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
