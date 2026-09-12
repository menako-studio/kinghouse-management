import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Building2,
  Award,
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

export const metadata = {
  title: "Tentang Kami | Kinghouse Management — PT Kreasi Usman Gosse",
  description:
    "Mengenal Kinghouse Management (PT Kreasi Usman Gosse): Berakar dari Kinghouse Cleaning (2020) yang memberdayakan komunitas, kini menghadirkan layanan co-hosting dan manajemen aset properti sewa harian profesional di Jabodetabek.",
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  const cleaningServices = [
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
  ]

  const industriesServed = [
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
  ]

  const managementPillars = [
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
  ]

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#231F1A] pb-24 selection:bg-[#CBBEA0] selection:text-[#231F1A]">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-[#231F1A] text-[#FAF7F1] pt-20 sm:pt-28 pb-20 border-b border-[#3D352E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(203,190,160,0.15),transparent_65%)] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-xs tracking-wider uppercase text-[#DFC58E]">
              <span className="h-2 w-2 rounded-full bg-[#DFC58E] animate-pulse" />
              <span>PT Kreasi Usman Gosse &bull; Established 2020</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-[1.1] tracking-tight">
              Dari Komitmen Kebersihan Berdaya Sosial, <br />
              <span className="italic text-[#CBBEA0]">Menuju Pengelolaan Properti Menyeluruh.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#D6CEBE] font-light leading-relaxed">
              Kinghouse Management hadir sebagai mitra co-hosting dan pengelolaan properti profesional terpercaya di Jabodetabek. Menghubungkan keunggulan operasional kebersihan berakar sejak 2020 dengan strategi pendapatan modern untuk villa, apartemen, dan rumah liburan Anda.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#CBBEA0]">
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Building2 className="h-3.5 w-3.5 text-[#DFC58E]" />
                <span>Legal Entity: PT Kreasi Usman Gosse</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-[#DFC58E]" />
                <span>Tangerang Selatan & Jabodetabek</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE EXPANDED VISION: KINGHOUSE MANAGEMENT */}
      <section className="py-20 bg-white border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#8C7F5F]">
                  Layanan Manajemen Menyeluruh
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#231F1A] font-normal leading-tight">
                  Maksimalkan Pendapatan Sewa Properti Anda Secara Pasif
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#5C5347] font-light leading-relaxed">
                <p className="bg-[#FAF7F1] p-5 rounded-xl border-l-4 border-[#8C7F5F] text-[#231F1A] font-normal">
                  <strong>Kinghouse Management</strong> adalah penyedia layanan pengelolaan properti dan co-hosting profesional khusus untuk villa, apartemen, dan rumah liburan (Airbnb & sewa harian). Kami membantu pemilik properti memaksimalkan pendapatan sewa secara pasif melalui manajemen menyeluruh—mulai dari optimasi listing, strategi harga harian, komunikasi tamu 24/7, hingga operasional kebersihan dan perawatan unit.
                </p>
                <p>
                  Bagi banyak pemilik, mengelola sewa harian seringkali menguras waktu dan tenaga: merespons chat di larut malam, memastikan unit bersih tepat waktu sebelum tamu baru tiba, hingga mengatasi komplain. Percayakan pengelolaan properti Anda pada Kinghouse Management untuk menghadirkan pengalaman menginap berkualitas tinggi bagi para tamu tanpa menyita waktu berharga Anda.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-[#231F1A] hover:bg-[#3D352E] text-white">
                  <Link href="/owner-services">
                    Pelajari Skema Bagi Hasil (15% vs 20%) <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-[#CBBEA0] text-[#231F1A] hover:bg-[#FAF7F1]">
                  <Link href="/villas">
                    Lihat Portofolio Unit
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
                    Superhost Hospitality
                  </span>
                  <p className="font-serif text-xl font-normal">
                    Versatile House With Garden, Jagakarsa
                  </p>
                  <p className="text-xs text-[#FAF7F1]/80 font-light mt-1">
                    4.90 ★ Superhost &bull; 68+ Ulasan Tamu Terverifikasi
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Pillars Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementPillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] hover:border-[#8C7F5F] hover:shadow-xs transition-all space-y-3"
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

      {/* 3. FOUNDER & LEADERSHIP SPOTLIGHT (REIZKY SYAHER PU) */}
      <section className="py-20 bg-[#FAF7F1] border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#8C7F5F]">
              Founder & Kepemimpinan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#231F1A] font-normal">
              Dedikasi Kepemimpinan di Balik PT Kreasi Usman Gosse
            </h2>
          </div>

          <div className="rounded-3xl border border-[#E8E4DC] bg-white p-8 sm:p-12 shadow-sm">
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
                    Founder & Managing Director
                  </p>
                  <p className="text-xs text-[#717171]">
                    PT Kreasi Usman Gosse &bull; Kinghouse
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
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </a>
                </div>
              </div>

              {/* Founder Bio & Narrative */}
              <div className="lg:col-span-8 space-y-5 text-[#5C5347] text-sm leading-relaxed font-light">
                <div className="space-y-3">
                  <h4 className="font-serif text-xl text-[#231F1A] font-normal">
                    Mengubah Properti Konvensional Menjadi Aset Hospitalitas Unggulan
                  </h4>
                  <p>
                    Sebagai pendiri <strong>PT Kreasi Usman Gosse</strong>, Reizky Syaher memiliki visi mendalam dalam memajukan sektor ekonomi kreatif dan pariwisata di Indonesia. Berbekal pengalaman profesional di lingkungan Kementerian Pariwisata dan Ekonomi Kreatif (Kemenparekraf) serta Badan Ekonomi Kreatif (BEKRAF), Reizky memiliki keahlian komprehensif dalam penguatan ekosistem startup, relasi publik, dan pengembangan program berskala nasional.
                  </p>
                  <p>
                    Latar belakang akademik di <strong>Universitas Padjadjaran</strong> serta spesialisasi digital marketing & performance dari <strong>RevoU</strong> melengkapi strateginya dalam menerapkan pendekatan berbasis data untuk mengelola properti sewa: mulai dari optimasi rasio konversi (CVR), dynamic pricing algorithm, SEO on-page, hingga direct multi-channel marketing.
                  </p>
                </div>

                {/* Founder Quote Card */}
                <div className="bg-[#FAF7F1] border-l-4 border-[#8C7F5F] p-4 rounded-r-xl italic text-xs sm:text-sm text-[#231F1A]">
                  &ldquo;Bagi kami, kebersihan dan manajemen properti bukan sekadar rutinitas operasional; ini adalah tentang memberdayakan komunitas lokal kami dan mentransformasi aset properti menjadi ruang tinggal bernilai tinggi yang menghadirkan ketenangan bagi pemilik dan kehangatan bagi setiap tamu.&rdquo;
                  <span className="block mt-2 not-italic font-semibold text-[#8C7F5F] text-xs">
                    — Reizky Syaher PU, Founder & Managing Director
                  </span>
                </div>

                {/* Badges / Credentials */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7F5F] block">
                      Pendidikan & Keahlian
                    </span>
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      Universitas Padjadjaran & RevoU
                    </span>
                    <span className="text-[11px] text-[#717171] block">
                      Digital Performance & SEO
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7F5F] block">
                      Pengalaman Publik
                    </span>
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      Kemenparekraf & BEKRAF
                    </span>
                    <span className="text-[11px] text-[#717171] block">
                      Tourism & Creative Economy
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7F5F] block">
                      Fokus Bisnis
                    </span>
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      Co-Hosting & Hospitality
                    </span>
                    <span className="text-[11px] text-[#717171] block">
                      Social Enterprise Leadership
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. THE FOUNDATIONAL ROOTS: KINGHOUSE CLEANING (EST. 2020) */}
      <section className="py-20 bg-white border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C7F5F] font-semibold">
                  <HeartHandshake className="h-4 w-4 text-[#8C7F5F]" />
                  <span>Sejarah Awal &bull; Social Enterprise Berkelanjutan</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#231F1A] font-normal leading-tight">
                  Kinghouse Cleaning: <br />
                  <span className="italic text-[#5C5347]">Cleaning is More Than Hygiene, It’s an Opportunity to Start Over.</span>
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#5C5347] font-light leading-relaxed">
                <p>
                  Didirikan pada tahun 2020, <strong>Kinghouse Cleaning</strong> adalah perusahaan jasa kebersihan profesional berbasis di Jakarta yang lahir dengan misi sosial untuk memberdayakan komunitas lokal. Sebagai wirausaha sosial (social enterprise), Kinghouse Cleaning berfokus memberikan keterampilan kerja, pelatihan teknis berstandar tinggi, serta dukungan kewirausahaan kepada para karyawannya—sebagian besar merupakan <em>single mothers</em> dan perempuan kepala rumah tangga—sehingga mereka dapat meningkatkan taraf dan kualitas hidup keluarga mereka secara mandiri dan bermartabat.
                </p>
                <p>
                  Kinghouse Cleaning meyakini bahwa tindakan membersihkan bukan sekadar menjaga kebersihan fisik, melainkan <strong>kesempatan untuk memulai lembaran baru</strong> (<em>opportunity to start over</em>). Prinsip inilah yang menumbuhkan dedikasi tanpa kompromi dalam memberikan standar kebersihan tertinggi dan perhatian pada setiap detail terkecil bagi setiap klien.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.kinghousecleaning.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-[#8C7F5F] hover:bg-[#72674c] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Kunjungi Situs Resmi Kinghouse Cleaning</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Social Impact Metric Card */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-[#FAF7F1] border border-[#E8E4DC] space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-[#231F1A] flex items-center justify-center text-white">
                    <Users className="h-5 w-5 text-[#DFC58E]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-[#231F1A] font-semibold">
                      Dampak Sosial Nyata
                    </h4>
                    <p className="text-xs text-[#717171]">Pemberdayaan Komunitas Berkelanjutan</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-[#5C5347] leading-relaxed">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-[#8C7F5F] shrink-0 mt-0.5" />
                    <p>
                      <strong>Pelatihan Keterampilan:</strong> Pembekalan standard operating procedure (SOP) sanitasi hotel internasional dan sertifikasi higienitas.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-[#8C7F5F] shrink-0 mt-0.5" />
                    <p>
                      <strong>Pendapatan Adil & Bermartabat:</strong> Memberikan upah kompetitif serta jaminan kesejahteraan yang menopang ekonomi keluarga.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-[#8C7F5F] shrink-0 mt-0.5" />
                    <p>
                      <strong>Fondasi Co-Hosting Kinghouse:</strong> Keahlian tim turnover inilah yang menjaga rating kebersihan 4.9★ di seluruh listing Airbnb kami.
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
                  Layanan Kebersihan & Operasional
                </h3>
                <span className="text-xs text-[#717171]">11 Layanan Khusus Berstandar Hospitality</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {cleaningServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] hover:border-[#8C7F5F] transition-all space-y-1"
                  >
                    <span className="text-xs font-semibold text-[#231F1A] block">
                      {service.name}
                    </span>
                    <span className="text-[11px] text-[#717171] block font-light">
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
                  Sektor Industri yang Dilayani
                </h3>
                <span className="text-xs text-[#717171]">14 Portofolio Klien & Fasilitas Komersial</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {industriesServed.map((industry, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-[#E8E4DC] text-xs font-medium text-[#5C5347] shadow-2xs hover:border-[#8C7F5F] transition-colors"
                  >
                    &bull; {industry}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CORPORATE TRANSPARENCY & CREDENTIALS */}
      <section className="py-16 bg-[#FAF7F1] border-b border-[#E8E4DC]">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E4DC] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8C7F5F] font-semibold">
                  <Building2 className="h-4 w-4" />
                  <span>Badan Hukum & Entitas Perusahaan</span>
                </div>
                <h3 className="font-serif text-2xl text-[#231F1A] font-semibold">
                  PT Kreasi Usman Gosse
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5347] font-light leading-relaxed">
                  Kantor Operasional & Registrasi Resmi: <br />
                  <span className="font-medium text-[#231F1A]">
                    Jl. Reni Jaya Blk. K2 No.16, Pd. Ranji, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15416
                  </span>
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
                <a
                  href="https://share.google/WHLcKlmJf8zZo27gO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FAF7F1] border border-[#CBBEA0] text-xs font-medium text-[#231F1A] transition-all group"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#8C7F5F]" />
                  <span>Google Business Profile</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </a>

                <a
                  href="https://glints.com/id/en/companies/pt-kreasi-usman-gosse/351bd7d6-fff5-4a77-a91b-f69918d3b2fe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#231F1A] hover:bg-[#3D352E] text-white text-xs font-semibold transition-all"
                >
                  <Briefcase className="h-3.5 w-3.5 text-[#DFC58E]" />
                  <span>Karir di Glints</span>
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
            Siap Mentransformasi Properti Anda Bersama Kinghouse?
          </h2>
          <p className="text-sm sm:text-base text-[#5C5347] font-light max-w-2xl mx-auto leading-relaxed">
            Dapatkan audit potensi pendapatan sewa gratis untuk villa atau apartemen Anda di Jabodetabek, dan biarkan tim profesional kami menangani seluruh operasional harian Anda.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="lg" asChild className="bg-[#231F1A] hover:bg-[#3D352E] text-white">
              <Link href="/management-inquiry">
                Ajukan Audit Properti Gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-[#CBBEA0] text-[#231F1A] hover:bg-white">
              <Link href="/contact">
                Hubungi Concierge Kami
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
