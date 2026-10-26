// FAQ content shared by /faq, /id/faq and their FAQPage structured data.
import { HelpCircle, ShieldCheck, Home, Key } from "lucide-react"

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  title: string
  icon: typeof HelpCircle
  items: FaqItem[]
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "guests",
    title: "Guest Stays & Booking",
    icon: Key,
    items: [
      {
        question: "How do check-in and check-out work at Kinghouse properties?",
        answer:
          "Standard check-in is at 14:00 (2:00 PM) and check-out is at 12:00 PM (noon). All Kinghouse properties feature smart keypad self check-in or a dedicated butler meet-and-greet. 24 hours before your arrival, you will receive full access codes and a localized arrival guide.",
      },
      {
        question: "Can I host private events or garden weddings?",
        answer:
          "Yes! Selected estates such as Versatile House in Jagakarsa are fully licensed and equipped for private garden weddings, birthdays, and corporate retreats up to 150 guests. Event bookings require pre-coordination with our events concierge for noise permits and layout setup.",
      },
      {
        question: "What is the cancellation policy for guest bookings?",
        answer:
          "Direct bookings through Kinghouse qualify for a full 100% refund if cancelled at least 14 days before check-in, and a 50% refund if cancelled up to 7 days before check-in. Bookings made via Airbnb follow the strict or moderate policy indicated on the respective listing.",
      },
      {
        question: "Are pets allowed at Kinghouse villas?",
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
        question: "How does Kinghouse calculate owner revenue and management fees?",
        answer:
          "Full Management costs 23% of rental revenue for apartments and 15–18% for villas and homes with 6 or more bedrooms; the final rate is agreed per property. Co-Hosting and HK on Demand are quoted per property. Owners receive transparent monthly statements with zero hidden markups.",
      },
      {
        question: "When and how are monthly owner payouts disbursed?",
        answer:
          "Statements and payouts are disbursed automatically on the 5th business day of each calendar month via Indonesian bank transfer (BCA, Mandiri, BNI, BRI) or international wire, accompanied by a 1-click downloadable CSV/PDF ledger of all gross bookings, cleaning fees, and net yield.",
      },
      {
        question: "What dynamic pricing strategy does Kinghouse employ?",
        answer:
          "Our revenue desk uses real-time market occupancy signals, seasonal concert/expo demand in Jakarta, weekend vs weekday elasticity, and competitor benchmarking to optimize nightly rates dynamically, routinely lifting client RevPAR by 25% to 40%.",
      },
      {
        question: "How does Kinghouse vet incoming guests to safeguard my property?",
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
        question: "What are Kinghouse's linen and hygiene standards?",
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
