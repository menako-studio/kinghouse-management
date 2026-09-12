"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  Briefcase,
  Users,
  Linkedin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocalization } from "@/lib/context/localization-context"

interface ServiceItem {
  name: string
  desc: string
}

interface PillarItem {
  icon: typeof TrendingUp
  title: string
  desc: string
}

export default function AboutPage() {
  const { language } = useLocalization()
  const isId = language === "ID"

  const content = isId
    ? {
        heroBadge: "PT Kreasi Usman Gosse • Established 2020",
        heroTitleStart: "Dari Komitmen Kebersihan Berdaya Sosial,",
        heroTitleHighlight: "Menuju Pengelolaan Properti Menyeluruh.",
        heroDesc:
          "Kinghouse Management hadir sebagai mitra co-hosting dan pengelolaan properti profesional terpercaya di Jabodetabek. Menghubungkan keunggulan operasional kebersihan berakar sejak 2020 dengan strategi pendapatan modern untuk villa, apartemen, dan rumah liburan Anda.",
        legalEntity: "Badan Hukum: PT Kreasi Usman Gosse",
        locationBadge: "Tangerang Selatan & Jabodetabek",

        visionEyebrow: "Layanan Manajemen Menyeluruh",
        visionTitle: "Maksimalkan Pendapatan Sewa Properti Anda Secara Pasif",
        visionHighlight:
          "Kinghouse Management adalah penyedia layanan pengelolaan properti dan co-hosting profesional khusus untuk villa, apartemen, dan rumah liburan (Airbnb & sewa harian). Kami membantu pemilik properti memaksimalkan pendapatan sewa secara pasif melalui manajemen menyeluruh—mulai dari optimasi listing, strategi harga harian, komunikasi tamu 24/7, hingga operasional kebersihan dan perawatan unit.",
        visionDesc:
          "Bagi banyak pemilik, mengelola sewa harian seringkali menguras waktu dan tenaga: merespons chat di larut malam, memastikan unit bersih tepat waktu sebelum tamu baru tiba, hingga mengatasi komplain. Percayakan pengelolaan properti Anda pada Kinghouse Management untuk menghadirkan pengalaman menginap berkualitas tinggi bagi para tamu tanpa menyita waktu berharga Anda.",
        btnFeeSplit: "Pelajari Skema Bagi Hasil (15% vs 20%)",
        btnViewPortfolio: "Lihat Portofolio Unit",
        photoTag: "Superhost Hospitality",
        photoTitle: "Versatile House With Garden, Jagakarsa",
        photoReviews: "4.90 ★ Superhost • 68+ Ulasan Tamu Terverifikasi",

        pillars: [
          {
            icon: TrendingUp,
            title: "Optimasi Listing & Dynamic Pricing",
            desc: "Fotografi editorial arsitektural, copywriting berbasis SEO, serta algoritma penyesuaian harga harian untuk memaksimalkan okupansi dan yield pendapatan sewa.",
          },
          {
            icon: Clock,
            title: "Komunikasi Tamu 24/7",
            desc: "Respon multilingual instan dalam hitungan menit, koordinasi self check-in dengan smart lock, dan layanan concierge sepanjang masa menginap.",
          },
          {
            icon: Sparkles,
            title: "Kebersihan & Linen Hotel Bintang 5",
            desc: "Didukung langsung oleh divisi Kinghouse Cleaning; standar inspeksi berlapis, pencucian linen higienis, dan restock amenities premium.",
          },
          {
            icon: ShieldCheck,
            title: "Perawatan & Proteksi Aset Menyeluruh",
            desc: "Preventative maintenance berkala (AC, plumbing, kelistrikan), inventarisasi berkala, serta laporan keuangan transparan setiap bulan bagi pemilik.",
          },
        ] as PillarItem[],

        founderEyebrow: "Founder & Kepemimpinan",
        founderHeadline: "Dedikasi Kepemimpinan di Balik PT Kreasi Usman Gosse",
        founderRole: "Founder & Managing Director",
        founderCompany: "PT Kreasi Usman Gosse • Kinghouse",
        founderLinkedIn: "Connect di LinkedIn",
        founderSubheading: "Mengubah Properti Konvensional Menjadi Aset Hospitalitas Unggulan",
        founderBio1:
          "Sebagai pendiri PT Kreasi Usman Gosse, Reizky Syaher memiliki visi mendalam dalam memajukan sektor ekonomi kreatif dan pariwisata di Indonesia. Berbekal pengalaman profesional di lingkungan Kementerian Pariwisata dan Ekonomi Kreatif (Kemenparekraf) serta Badan Ekonomi Kreatif (BEKRAF), Reizky memiliki keahlian komprehensif dalam penguatan ekosistem startup, relasi publik, dan pengembangan program berskala nasional.",
        founderBio2:
          "Latar belakang akademik di Universitas Padjadjaran serta spesialisasi digital marketing & performance dari RevoU melengkapi strateginya dalam menerapkan pendekatan berbasis data untuk mengelola properti sewa: mulai dari optimasi rasio konversi (CVR), dynamic pricing algorithm, SEO on-page, hingga direct multi-channel marketing.",
        founderQuote:
          "“Bagi kami, kebersihan dan manajemen properti bukan sekadar rutinitas operasional; ini adalah tentang memberdayakan komunitas lokal kami dan mentransformasi aset properti menjadi ruang tinggal bernilai tinggi yang menghadirkan ketenangan bagi pemilik dan kehangatan bagi setiap tamu.”",
        founderQuoteAuthor: "— Reizky Syaher PU, Founder & Managing Director",
        credEdu: "Pendidikan & Keahlian",
        credEduSub: "Universitas Padjadjaran & RevoU",
        credEduDetail: "Digital Performance & SEO",
        credPub: "Pengalaman Publik",
        credPubSub: "Kemenparekraf & BEKRAF",
        credPubDetail: "Tourism & Creative Economy",
        credBiz: "Fokus Bisnis",
        credBizSub: "Co-Hosting & Hospitality",
        credBizDetail: "Social Enterprise Leadership",

        heritageEyebrow: "Sejarah Awal • Social Enterprise Berkelanjutan",
        heritageTitle: "Kinghouse Cleaning:",
        heritageQuote: "Cleaning is More Than Hygiene, It’s an Opportunity to Start Over.",
        heritageBio1:
          "Didirikan pada tahun 2020, Kinghouse Cleaning adalah perusahaan jasa kebersihan profesional berbasis di Jakarta yang lahir dengan misi sosial untuk memberdayakan komunitas lokal. Sebagai wirausaha sosial (social enterprise), Kinghouse Cleaning berfokus memberikan keterampilan kerja, pelatihan teknis berstandar tinggi, serta dukungan kewirausahaan kepada para karyawannya—sebagian besar merupakan single mothers dan perempuan kepala rumah tangga—sehingga mereka dapat meningkatkan taraf dan kualitas hidup keluarga mereka secara mandiri dan bermartabat.",
        heritageBio2:
          "Kinghouse Cleaning meyakini bahwa tindakan membersihkan bukan sekadar menjaga kebersihan fisik, melainkan kesempatan untuk memulai lembaran baru (opportunity to start over). Prinsip inilah yang menumbuhkan dedikasi tanpa kompromi dalam memberikan standar kebersihan tertinggi dan perhatian pada setiap detail terkecil bagi setiap klien.",
        heritageBtn: "Kunjungi Situs Resmi Kinghouse Cleaning",
        impactTitle: "Dampak Sosial Nyata",
        impactSubtitle: "Pemberdayaan Komunitas Berkelanjutan",
        impactCheck1Title: "Pelatihan Keterampilan: ",
        impactCheck1Desc:
          "Pembekalan standard operating procedure (SOP) sanitasi hotel internasional dan sertifikasi higienitas.",
        impactCheck2Title: "Pendapatan Adil & Bermartabat: ",
        impactCheck2Desc:
          "Memberikan upah kompetitif serta jaminan kesejahteraan yang menopang ekonomi keluarga.",
        impactCheck3Title: "Fondasi Co-Hosting Kinghouse: ",
        impactCheck3Desc:
          "Keahlian tim turnover inilah yang menjaga rating kebersihan 4.9★ di seluruh listing Airbnb kami.",

        servicesTitle: "Layanan Kebersihan & Operasional",
        servicesSubtitle: "11 Layanan Khusus Berstandar Hospitality",
        cleaningServices: [
          { name: "Commercial Cleaning", desc: "Kantor komersial, ritel, & ruang publik" },
          { name: "Residential Cleaning", desc: "Perumahan, hunian tapak, & private residence" },
          { name: "Rental Cleaning (Airbnb)", desc: "Turnover kilat standar hotel 5-bintang" },
          { name: "Move Out / In Cleaning", desc: "Deep cleaning transisi penyewa baru" },
          { name: "Common Area Cleaning", desc: "Area lobi, koridor, & fasilitas bersama" },
          { name: "Construction Cleaning", desc: "Pembersihan sisa renovasi & serah terima" },
          { name: "Event Cleaning", desc: "Pembersihan sebelum & sesudah pesta / wedding" },
          { name: "Day Porter Services", desc: "Staf kebersihan on-site harian berdedikasi" },
          { name: "Floor & Carpet Care", desc: "Treatment marmer, vinil, & cuci karpet" },
          { name: "Window Washing Services", desc: "Pembersihan kaca luar & dalam bebas noda" },
          { name: "Disinfecting Services", desc: "Sterilisasi uap & disinfektan bersertifikasi" },
        ] as ServiceItem[],

        industriesTitle: "Sektor Industri yang Dilayani",
        industriesSubtitle: "13 Portofolio Klien & Fasilitas Komersial",
        industriesServed: [
          "Short-term rentals (Airbnb)",
          "Hospitality & Boutique Resorts",
          "Real-Estate & Developer",
          "Retail & Showrooms",
          "Restaurant & Cafe",
          "Office Buildings",
          "Production Offices & Studios",
          "Record Studios & Editing Suites",
          "Warehouse Facilities",
          "Distribution Centers",
          "Medical & Clinic Facilities",
          "Religious Facilities",
          "Municipalities & Gov Buildings",
        ],

        corpEyebrow: "Badan Hukum & Entitas Perusahaan",
        corpCompany: "PT Kreasi Usman Gosse",
        corpAddressLabel: "Kantor Operasional & Registrasi Resmi:",
        corpAddress:
          "Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15416",
        btnGbp: "Google Business Profile",
        btnCareers: "Karir di Glints",

        ctaTitle: "Siap Mentransformasi Properti Anda Bersama Kinghouse?",
        ctaDesc:
          "Dapatkan audit potensi pendapatan sewa gratis untuk villa atau apartemen Anda di Jabodetabek, dan biarkan tim profesional kami menangani seluruh operasional harian Anda.",
        ctaBtnPrimary: "Ajukan Audit Properti Gratis",
        ctaBtnSecondary: "Hubungi Concierge Kami",
      }
    : {
        heroBadge: "PT Kreasi Usman Gosse • Established 2020",
        heroTitleStart: "From Socially-Empowered Cleaning Roots,",
        heroTitleHighlight: "Towards Full-Spectrum Property Stewardship.",
        heroDesc:
          "Kinghouse Management stands as a trusted professional co-hosting and short-stay property asset management partner in Greater Jakarta. Bridging operational cleaning excellence established in 2020 with modern dynamic yield strategies for your luxury villas, apartments, and vacation retreats.",
        legalEntity: "Legal Entity: PT Kreasi Usman Gosse",
        locationBadge: "South Tangerang & Greater Jakarta",

        visionEyebrow: "Full-Spectrum Asset Management",
        visionTitle: "Maximize Your Property Rental Yield Passively",
        visionHighlight:
          "Kinghouse Management is a professional property management and co-hosting service provider specializing in luxury villas, boutique apartments, and vacation homes (Airbnb & short-stay rentals). We help property owners maximize rental revenue passively through end-to-end management—from listing optimization and dynamic pricing algorithms to 24/7 guest communications, 5-star cleaning, and proactive maintenance.",
        visionDesc:
          "For many owners, managing short-term rentals is demanding and time-consuming: responding to late-night guest inquiries, ensuring turnover cleaning finishes before the next check-in, and handling on-site maintenance. Entrust your property to Kinghouse Management to deliver exceptional guest experiences while safeguarding your valuable time.",
        btnFeeSplit: "Explore Revenue Split (15% vs 20%)",
        btnViewPortfolio: "View Unit Portfolio",
        photoTag: "Superhost Hospitality",
        photoTitle: "Versatile House With Garden, Jagakarsa",
        photoReviews: "4.90 ★ Superhost • 68+ Verified Guest Reviews",

        pillars: [
          {
            icon: TrendingUp,
            title: "Listing Optimization & Dynamic Pricing",
            desc: "Architectural editorial photography, SEO-driven copywriting, and real-time algorithmic daily rate adjustments to maximize occupancy and rental yield.",
          },
          {
            icon: Clock,
            title: "24/7 Multilingual Guest Communications",
            desc: "Instant multilingual responses within minutes, seamless smart-lock self check-in coordination, and dedicated concierge care throughout the guest stay.",
          },
          {
            icon: Sparkles,
            title: "5-Star Hotel Cleaning & Linen Care",
            desc: "Powered directly by Kinghouse Cleaning; multi-tier inspection protocols, commercial hygienic linen laundering, and premium luxury amenities replenishment.",
          },
          {
            icon: ShieldCheck,
            title: "Comprehensive Asset Care & Protection",
            desc: "Routine preventative maintenance (HVAC, plumbing, electrical), periodic inventory audits, and transparent monthly financial reporting for owners.",
          },
        ] as PillarItem[],

        founderEyebrow: "Founder & Leadership",
        founderHeadline: "Dedicated Leadership Behind PT Kreasi Usman Gosse",
        founderRole: "Founder & Managing Director",
        founderCompany: "PT Kreasi Usman Gosse • Kinghouse",
        founderLinkedIn: "Connect on LinkedIn",
        founderSubheading: "Transforming Conventional Real Estate into Premier Hospitality Assets",
        founderBio1:
          "As the founder of PT Kreasi Usman Gosse, Reizky Syaher brings a profound commitment to advancing Indonesia's creative economy and tourism ecosystem. With distinguished professional experience across the Ministry of Tourism and Creative Economy (Kemenparekraf) and the Indonesian Creative Economy Agency (BEKRAF), Reizky possesses extensive expertise in startup ecosystem strengthening, public-private partnerships, and national-scale development programs.",
        founderBio2:
          "His academic foundation from Padjadjaran University combined with digital performance and growth marketing specialization from RevoU guides his data-driven methodology in property portfolio management: encompassing conversion rate optimization (CVR), dynamic pricing algorithms, technical on-page SEO, and multi-channel direct distribution.",
        founderQuote:
          "“For us, cleanliness and property management transcend routine operations; it is about empowering our local communities and transforming real estate assets into high-value living sanctuaries that bring peace of mind to owners and warmth to every guest.”",
        founderQuoteAuthor: "— Reizky Syaher PU, Founder & Managing Director",
        credEdu: "Education & Expertise",
        credEduSub: "Padjadjaran University & RevoU",
        credEduDetail: "Digital Performance & SEO",
        credPub: "Public Sector Experience",
        credPubSub: "Kemenparekraf & BEKRAF",
        credPubDetail: "Tourism & Creative Economy",
        credBiz: "Core Business Focus",
        credBizSub: "Co-Hosting & Hospitality",
        credBizDetail: "Social Enterprise Leadership",

        heritageEyebrow: "Origins & Heritage • Sustainable Social Enterprise",
        heritageTitle: "Kinghouse Cleaning:",
        heritageQuote: "Cleaning is More Than Hygiene, It’s an Opportunity to Start Over.",
        heritageBio1:
          "Founded in 2020, Kinghouse Cleaning is a professional cleaning service enterprise based in Jakarta born with a vibrant social mission: empowering local communities. As a dedicated social enterprise, Kinghouse Cleaning equips its team members—principally single mothers and women heads of household—with market-ready professional skills, international hotel-standard sanitation training, and entrepreneurial empowerment, enabling them to elevate their families' livelihoods with pride and dignity.",
        heritageBio2:
          "Kinghouse Cleaning firmly believes that cleaning is more than physical hygiene; it represents an opportunity to start over. This philosophy drives an uncompromising dedication to delivering the highest sanitation standards and meticulous attention to every detail for every client.",
        heritageBtn: "Visit Kinghouse Cleaning Official Website",
        impactTitle: "Tangible Social Impact",
        impactSubtitle: "Sustainable Community Empowerment",
        impactCheck1Title: "Vocational Training: ",
        impactCheck1Desc:
          "International hotel sanitation standard operating procedures (SOP) and certified hygiene protocols.",
        impactCheck2Title: "Fair & Dignified Income: ",
        impactCheck2Desc:
          "Competitive living wages and comprehensive welfare assurances supporting domestic family stability.",
        impactCheck3Title: "Kinghouse Co-Hosting Foundation: ",
        impactCheck3Desc:
          "This meticulous turnover workforce maintains our 4.9★ cleanliness rating across all managed listings.",

        servicesTitle: "Specialized Cleaning & Operations",
        servicesSubtitle: "11 Hospitality-Grade Cleaning Services",
        cleaningServices: [
          { name: "Commercial Cleaning", desc: "Commercial offices, retail, & public facilities" },
          { name: "Residential Cleaning", desc: "Private estates, landed residences, & apartments" },
          { name: "Rental Cleaning (Airbnb)", desc: "Rapid 5-star hotel-standard turnover cleaning" },
          { name: "Move Out / In Cleaning", desc: "Comprehensive deep sanitization for tenant transitions" },
          { name: "Common Area Cleaning", desc: "Lobbies, corridors, & shared resident amenities" },
          { name: "Construction Cleaning", desc: "Post-renovation debris clearing & handover prep" },
          { name: "Event Cleaning", desc: "Pre- and post-celebration event & wedding venue care" },
          { name: "Day Porter Services", desc: "Dedicated on-site daily cleanliness stewards" },
          { name: "Floor & Carpet Care", desc: "Marble restoration, vinyl polishing, & steam carpet wash" },
          { name: "Window Washing Services", desc: "Streak-free exterior & interior architectural glass care" },
          { name: "Disinfecting Services", desc: "Certified electrostatic misting & thermal steam sterilization" },
        ] as ServiceItem[],

        industriesTitle: "Industries & Facilities Served",
        industriesSubtitle: "13 Client Portfolios & Commercial Spaces",
        industriesServed: [
          "Short-term rentals (Airbnb)",
          "Hospitality & Boutique Resorts",
          "Real-Estate & Developer",
          "Retail & Showrooms",
          "Restaurant & Cafe",
          "Office Buildings",
          "Production Offices & Studios",
          "Record Studios & Editing Suites",
          "Warehouse Facilities",
          "Distribution Centers",
          "Medical & Clinic Facilities",
          "Religious Facilities",
          "Municipalities & Gov Buildings",
        ],

        corpEyebrow: "Legal Entity & Corporate Governance",
        corpCompany: "PT Kreasi Usman Gosse",
        corpAddressLabel: "Official Registered Operational Headquarters:",
        corpAddress:
          "Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15416",
        btnGbp: "Google Business Profile",
        btnCareers: "Careers on Glints",

        ctaTitle: "Ready to Transform Your Property with Kinghouse?",
        ctaDesc:
          "Request a complimentary rental revenue audit for your villa or apartment in Greater Jakarta, and let our professional team handle end-to-end daily operations.",
        ctaBtnPrimary: "Request Free Property Audit",
        ctaBtnSecondary: "Contact Our Concierge",
      }

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#231F1A] pb-24 selection:bg-[#CBBEA0] selection:text-[#231F1A]">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-[#231F1A] text-[#FAF7F1] pt-20 sm:pt-28 pb-20 border-b border-[#3D352E] supergraphic-blueprint-charcoal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(203,190,160,0.18),transparent_65%)] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-xs tracking-wider uppercase text-[#DFC58E]">
              <span className="h-2 w-2 rounded-full bg-[#DFC58E] animate-pulse" />
              <span>{content.heroBadge}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-[1.1] tracking-tight">
              {content.heroTitleStart} <br />
              <span className="italic text-[#CBBEA0]">{content.heroTitleHighlight}</span>
            </h1>

            <p className="text-base sm:text-lg text-[#D6CEBE] font-light leading-relaxed">
              {content.heroDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#CBBEA0]">
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Building2 className="h-3.5 w-3.5 text-[#DFC58E]" />
                <span>{content.legalEntity}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-[#DFC58E]" />
                <span>{content.locationBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supergraphic Architectural Divider */}
      <div className="supergraphic-divider" />

      {/* 2. THE EXPANDED VISION: KINGHOUSE MANAGEMENT */}
      <section className="py-20 bg-white border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#8C7F5F]">
                  {content.visionEyebrow}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#231F1A] font-normal leading-tight">
                  {content.visionTitle}
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#5C5347] font-light leading-relaxed">
                <p className="bg-[#FAF7F1] p-5 rounded-xl border-l-4 border-[#8C7F5F] text-[#231F1A] font-normal leading-relaxed">
                  {content.visionHighlight}
                </p>
                <p>
                  {content.visionDesc}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-[#231F1A] hover:bg-[#3D352E] text-white shadow-xs">
                  <Link href="/owner-services">
                    {content.btnFeeSplit} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-[#CBBEA0] text-[#231F1A] hover:bg-[#FAF7F1]">
                  <Link href="/villas">
                    {content.btnViewPortfolio}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Photo Illustration */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#E8E4DC] shadow-md group">
                <Image
                  src="/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg"
                  alt="Versatile House Jagakarsa managed by Kinghouse Management"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] uppercase tracking-wider text-[#DFC58E] font-semibold">
                    {content.photoTag}
                  </span>
                  <p className="font-serif text-xl font-normal">
                    {content.photoTitle}
                  </p>
                  <p className="text-xs text-[#FAF7F1]/80 font-light mt-1">
                    {content.photoReviews}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Pillars Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-[#FAF7F1] border border-[#E8E4DC] hover:border-[#8C7F5F] hover:shadow-subtle transition-all duration-300 space-y-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#8C7F5F] text-white">
                    <Icon className="h-5 w-5 text-[#FAF7F1]" />
                  </div>
                  <h3 className="font-serif text-lg text-[#231F1A] font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#5C5347] font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Supergraphic Architectural Divider */}
      <div className="supergraphic-divider" />

      {/* 3. FOUNDER & LEADERSHIP SPOTLIGHT (REIZKY SYAHER PU) */}
      <section className="py-20 bg-[#FAF7F1] border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#8C7F5F]">
              {content.founderEyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#231F1A] font-normal">
              {content.founderHeadline}
            </h2>
          </div>

          <div className="rounded-3xl border border-[#E8E4DC] bg-white p-8 sm:p-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Founder Photo */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative aspect-square w-60 sm:w-64 rounded-2xl overflow-hidden border-2 border-[#CBBEA0] shadow-md bg-[#231F1A]">
                  <Image
                    src="/team/reizky-syaher.jpg"
                    alt="Reizky Syaher PU — Founder & Managing Director PT Kreasi Usman Gosse"
                    fill
                    sizes="(max-width: 640px) 240px, 256px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-serif text-2xl text-[#231F1A] font-semibold">
                    Reizky Syaher PU
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#8C7F5F] font-semibold">
                    {content.founderRole}
                  </p>
                  <p className="text-xs text-[#5C5347]">
                    {content.founderCompany}
                  </p>
                </div>

                <div className="mt-4 pt-2">
                  <a
                    href="https://www.linkedin.com/in/reizky-syaher/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5 fill-current" />
                    <span>{content.founderLinkedIn}</span>
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </a>
                </div>
              </div>

              {/* Founder Bio & Narrative */}
              <div className="lg:col-span-8 space-y-5 text-[#5C5347] text-sm leading-relaxed font-light">
                <div className="space-y-3">
                  <h4 className="font-serif text-xl text-[#231F1A] font-normal">
                    {content.founderSubheading}
                  </h4>
                  <p>
                    {content.founderBio1}
                  </p>
                  <p>
                    {content.founderBio2}
                  </p>
                </div>

                {/* Founder Quote Card */}
                <div className="bg-[#FAF7F1] border-l-4 border-[#8C7F5F] p-4 rounded-r-xl italic text-xs sm:text-sm text-[#231F1A] supergraphic-blueprint-bone">
                  {content.founderQuote}
                  <span className="block mt-2 not-italic font-semibold text-[#8C7F5F] text-xs">
                    {content.founderQuoteAuthor}
                  </span>
                </div>

                {/* Badges / Credentials */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7F5F] block">
                      {content.credEdu}
                    </span>
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      {content.credEduSub}
                    </span>
                    <span className="text-[11px] text-[#5C5347] block">
                      {content.credEduDetail}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7F5F] block">
                      {content.credPub}
                    </span>
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      {content.credPubSub}
                    </span>
                    <span className="text-[11px] text-[#5C5347] block">
                      {content.credPubDetail}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F1] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7F5F] block">
                      {content.credBiz}
                    </span>
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      {content.credBizSub}
                    </span>
                    <span className="text-[11px] text-[#5C5347] block">
                      {content.credBizDetail}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Supergraphic Architectural Divider */}
      <div className="supergraphic-divider" />

      {/* 4. THE FOUNDATIONAL ROOTS: KINGHOUSE CLEANING (EST. 2020) */}
      <section className="py-20 bg-white border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C7F5F] font-semibold">
                  <HeartHandshake className="h-4 w-4 text-[#8C7F5F]" />
                  <span>{content.heritageEyebrow}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#231F1A] font-normal leading-tight">
                  {content.heritageTitle} <br />
                  <span className="italic text-[#5C5347]">{content.heritageQuote}</span>
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#5C5347] font-light leading-relaxed">
                <p>
                  {content.heritageBio1}
                </p>
                <p>
                  {content.heritageBio2}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.kinghousecleaning.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-[#8C7F5F] hover:bg-[#776B4E] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>{content.heritageBtn}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Social Impact Metric Card */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-[#FAF7F1] border border-[#E8E4DC] space-y-6 supergraphic-blueprint-bone">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-[#231F1A] flex items-center justify-center text-white">
                    <Users className="h-5 w-5 text-[#DFC58E]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-[#231F1A] font-semibold">
                      {content.impactTitle}
                    </h4>
                    <p className="text-xs text-[#5C5347]">{content.impactSubtitle}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-[#5C5347] leading-relaxed">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-[#8C7F5F] shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#231F1A]">{content.impactCheck1Title}</strong>
                      {content.impactCheck1Desc}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-[#8C7F5F] shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#231F1A]">{content.impactCheck2Title}</strong>
                      {content.impactCheck2Desc}
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-[#8C7F5F] shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-[#231F1A]">{content.impactCheck3Title}</strong>
                      {content.impactCheck3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. SERVICES & INDUSTRIES SERVED BREAKDOWN */}
          <div className="pt-8 border-t border-[#E8E4DC] space-y-10">
            
            {/* Services List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-serif text-2xl text-[#231F1A]">
                  {content.servicesTitle}
                </h3>
                <span className="text-xs text-[#5C5347]">{content.servicesSubtitle}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {content.cleaningServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF7F1] border border-[#E8E4DC] hover:border-[#8C7F5F] transition-all duration-200 space-y-1"
                  >
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      {service.name}
                    </span>
                    <span className="text-[11px] text-[#5C5347] block font-light">
                      {service.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industries Served */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-serif text-2xl text-[#231F1A]">
                  {content.industriesTitle}
                </h3>
                <span className="text-xs text-[#5C5347]">{content.industriesSubtitle}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {content.industriesServed.map((industry, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FAF7F1] border border-[#E8E4DC] text-xs font-medium text-[#5C5347] shadow-2xs hover:border-[#8C7F5F] transition-colors"
                  >
                    &bull; {industry}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Supergraphic Architectural Divider */}
      <div className="supergraphic-divider" />

      {/* 6. CORPORATE TRANSPARENCY & CREDENTIALS */}
      <section className="py-16 bg-[#FAF7F1] border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8C7F5F] font-semibold">
                  <Building2 className="h-4 w-4" />
                  <span>{content.corpEyebrow}</span>
                </div>
                <h3 className="font-serif text-2xl text-[#231F1A] font-semibold">
                  {content.corpCompany}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5347] font-light leading-relaxed">
                  {content.corpAddressLabel} <br />
                  <span className="font-medium text-[#231F1A]">
                    {content.corpAddress}
                  </span>
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
                <a
                  href="https://share.google/WHLcKlmJf8zZo27gO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FAF7F1] hover:bg-white border border-[#CBBEA0] text-xs font-medium text-[#231F1A] transition-all group"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#8C7F5F]" />
                  <span>{content.btnGbp}</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </a>

                <a
                  href="https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#231F1A] hover:bg-[#3D352E] text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <Briefcase className="h-3.5 w-3.5 text-[#DFC58E]" />
                  <span>{content.btnCareers}</span>
                  <ExternalLink className="h-3 w-3 opacity-80" />
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="pt-20">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl text-[#231F1A] font-normal leading-tight">
            {content.ctaTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#5C5347] font-light max-w-2xl mx-auto leading-relaxed">
            {content.ctaDesc}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="lg" asChild className="bg-[#231F1A] hover:bg-[#3D352E] text-white shadow-xs">
              <Link href="/management-inquiry">
                {content.ctaBtnPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-[#CBBEA0] text-[#231F1A] hover:bg-white">
              <Link href="/contact">
                {content.ctaBtnSecondary}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
