"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { trackCurrencyChange, trackLanguageChange } from "@/lib/analytics"



export type CurrencyCode = "IDR" | "USD" | "EUR" | "CNY" | "TWD" | "RUB" | "JPY" | "AUD" | "SGD" | "GBP"
export type LanguageCode = "EN" | "ID" | "JA" | "ZH-CN" | "ZH-TW" | "FR" | "ES" | "DE" | "RU"

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  label: string
  short: string
  rateFromIdr: number
  prefix: boolean
}

export interface LanguageConfig {
  code: LanguageCode
  label: string
  nativeName: string
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "IDR", symbol: "Rp", label: "IDR (Rp)", short: "RP", rateFromIdr: 1, prefix: true },
  { code: "USD", symbol: "$", label: "USD ($)", short: "$", rateFromIdr: 1 / 15800, prefix: true },
  { code: "EUR", symbol: "€", label: "EUR (€)", short: "€", rateFromIdr: 1 / 17200, prefix: true },
  { code: "CNY", symbol: "¥", label: "CNY (¥)", short: "¥", rateFromIdr: 1 / 2180, prefix: true },
  { code: "TWD", symbol: "NT$", label: "TWD (NT$)", short: "NT$", rateFromIdr: 1 / 490, prefix: true },
  { code: "RUB", symbol: "₽", label: "RUB (₽)", short: "₽", rateFromIdr: 1 / 170, prefix: true },
  { code: "JPY", symbol: "¥", label: "JPY (¥)", short: "¥", rateFromIdr: 1 / 105, prefix: true },
  { code: "AUD", symbol: "A$", label: "AUD (A$)", short: "A$", rateFromIdr: 1 / 10300, prefix: true },
  { code: "SGD", symbol: "S$", label: "SGD (S$)", short: "S$", rateFromIdr: 1 / 11700, prefix: true },
  { code: "GBP", symbol: "£", label: "GBP (£)", short: "£", rateFromIdr: 1 / 20100, prefix: true },
]

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "EN", label: "English", nativeName: "English" },
  { code: "ID", label: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "JA", label: "Japanese", nativeName: "日本語" },
  { code: "ZH-CN", label: "Simplified Chinese", nativeName: "中文 (简体)" },
  { code: "ZH-TW", label: "Traditional Chinese", nativeName: "中文 (繁體)" },
  { code: "FR", label: "French", nativeName: "Français" },
  { code: "ES", label: "Spanish", nativeName: "Español" },
  { code: "DE", label: "German", nativeName: "Deutsch" },
  { code: "RU", label: "Russian", nativeName: "Русский" },
]

// Multilingual translations for UI elements
const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: {
    home: "HOME",
    ourProperties: "OUR PROPERTIES",
    monthlyOffers: "MONTHLY OFFERS",
    events: "EVENTS",
    rewards: "REWARDS",
    enquire: "ENQUIRE",
    signIn: "SIGN IN",
    byPropertyType: "BY PROPERTY TYPE",
    byLocation: "BY LOCATION",
    villasUpTo4: "Villas up to 4 Bedroom",
    villas5Plus: "Villas 5 Bedroom+",
    resortApartment: "Resort & Apartment",
    eventsAndWeddings: "Events & Gatherings",
    allLocations: "All Jabodetabek Locations",
    subscribeNewsletter: "Subscribe to our Newsletter",
    newsletterHeadline: "GET EXCLUSIVE DEALS & THE LATEST NEWS",
    emailPlaceholder: "Enter your email address",
    signUp: "SIGN UP",
    aboutUs: "ABOUT US",
    reservation: "RESERVATION",
    guestAssistance: "GUEST ASSISTANCE",
    management: "MANAGEMENT",
    office: "OFFICE",
    hours: "HOURS",
    connectWithUs: "CONNECT WITH US",
    perNight: "/ night",
    bookOnAirbnb: "Book on Airbnb",
    details: "Details",
    guests: "Guests",
    bedrooms: "Bedrooms",
    baths: "Baths",
    guestFavorite: "Guest Favorite",
    exploreProperties: "Explore Properties",
    ownerServices: "Owner Services",
    forPropertyOwners: "For Property Owners",
    directConcierge: "Direct Concierge & Desk",

    // Hero Section
    curatedResidencesJabodetabek: "Kinghouse Curated Residences • Jabodetabek",
    extraordinaryHospitality: "Extraordinary Hospitality & Asset Management",
    curatedVillasTitle: "Curated Villas,",
    managedToPerfection: "Managed to Perfection.",
    heroDescription: "Immerse in architectural retreats across South Jakarta, Tangerang, Palmerah, and Cikarang — paired with institutional-grade asset management delivering superior yield for property owners.",
    exploreVillasB2C: "Explore Villas (B2C)",
    partnerWithUsB2B: "Partner With Us (B2B)",
    lifestyle: "Lifestyle",
    architecture: "Architecture",
    scrollToDiscover: "Scroll to Discover",

    // Search Bar
    destinationLabel: "DESTINATION",
    allGreaterJakarta: "All Greater Jakarta Enclaves",
    datesLabel: "DATES",
    guestsLabel: "GUESTS",
    searchVillas: "Search Villas",

    // Curated Grid
    collection2026: "COLLECTION 2026",
    architecturalSanctuaries: "Architectural Sanctuaries",
    curatedGridSubtitle: "Every residence in the Kinghouse portfolio undergoes a 120-point architectural and hospitality audit before curation.",
    viewAllVillas: "View All Villas",
    startFrom: "Start From",

    // Dual Path Split
    forDiscerningTravelers: "For Discerning Travelers (B2C)",
    travelerHeadline: "Architectural Retreats,",
    travelerSubheadline: "Frictionless Airbnb Stays.",
    travelerDescription: "Discover private pool sanctuaries with dedicated concierge, artisan breakfasts, and verified Superhost guarantees.",
    bookYourEscape: "Book Your Escape",
    forOwnersInvestors: "For Villa Owners & Investors (B2B)",
    ownerHeadline: "Turnkey Operations,",
    ownerSubheadline: "Maximized Asset Yield.",
    ownerDescription: "Dynamic revenue algorithms, transparent 15%–20% fee structures, 5-star hotel maintenance, and live owner P&L dashboards.",
    maximizeRoi: "Maximize Your Villa's ROI",

    // Trust & Proof
    globalDistributionHeader: "Global Distribution & Verified Hospitality Accreditations",
    verifiedVillaOwner: "Verified Villa Owner",
    verifiedGuestReview: "Verified Guest",
    verifiedMetricHighlight: "Verified Metric",

    // Catalog & Sidebar Filters
    filtersHeader: "FILTERS",
    propertyTypeHeader: "PROPERTY TYPE",
    villaForEvents: "Villa for Events",
    villaUpTo4Label: "Villa up to 4 Bedrooms",
    villa5PlusLabel: "Villa 5 Bedroom and Above",
    entireApartmentLabel: "Entire Apartment / Suite",
    availabilityHeader: "AVAILABILITY",
    destinationHeader: "DESTINATION",
    allDestinations: "All Destinations",
    haveVillaInMind: "HAVE A VILLA IN MIND?",
    searchByNameOrArea: "Search by name or area...",
    applyButton: "APPLY",
    clearButton: "CLEAR",
    findStayHeader: "FIND A STAY IN JABODETABEK",
    propertyNamePlaceholder: "PROPERTY NAME",
    sortByHeader: "SORT BY",
    sortPriceLowHigh: "PRICE: LOW TO HIGH",
    sortPriceHighLow: "PRICE: HIGH TO LOW",
    sortHighestRated: "HIGHEST RATED",
    downloadBrochure: "Download Brochure",
    noVillasFoundMessage: "No properties match your filter criteria.",
    resetFiltersButton: "Reset All Filters",
    cleaningFeeText: "One-time Cleaning Fee",

    // Events Page
    privateEventsHeader: "Private Events & Gatherings",
    privateEventsSubtitle: "Intimate weddings, garden gatherings, corporate retreats, and creative productions hosted in private architectural estates.",
    packageTierHeader: "Package Tier",
    capacityHeader: "Capacity",
    durationHeader: "Duration",
    weekdayRateHeader: "Weekday Rate",
    weekendRateHeader: "Weekend Rate",
    reserveButton: "Reserve",
    overnightStayHeader: "VILLA OVERNIGHT STAY OPTION",
    roomConfigurationHeader: "Room Configuration & Stay Rates (Versatile House)",
    roomConfigurationDesc: "Need extra accommodation for bridal families or retreat participants? Versatile House supports flexible room unlocks from 2 to 6 bedrooms.",
    inquireWhatsApp: "Inquire Custom Stay via WhatsApp",

    // Owner Services Page
    passiveVillaIncome: "Passive Villa Income. Zero Operational Headache.",
    ownerServicesHeroDesc: "Full-spectrum short-stay asset management for luxury homes, villas, and boutique apartments across Jabodetabek.",
    requestAuditButton: "Request Free Revenue Audit",
    compareModelsButton: "Compare Pricing Models",
    transparentFeeHeader: "Transparent Fee Architecture",
    zeroFixedHeadline: "Zero Fixed Costs. Pure Performance.",
    interactiveCalculatorTitle: "Interactive Fee & Net Yield Calculator",
    calculatorSubtitle: "Estimate your net owner payout based on gross monthly revenue",
    estimatedGrossRevenueLabel: "Estimated Gross Revenue",
    applyForModel: "Apply for",

    // Concierge & WA
    conciergeOnline: "Concierge Online",
    conciergeResponseTime: "Typically replies in under 15 minutes",
    chatWhatsApp: "Chat on WhatsApp",
  },
  ID: {
    home: "BERANDA",
    ourProperties: "PROPERTI KAMI",
    monthlyOffers: "PENAWARAN BULANAN",
    events: "ACARA",
    rewards: "REWARDS",
    enquire: "KONSULTASI",
    signIn: "MASUK",
    byPropertyType: "BERDASARKAN TIPE PROPERTI",
    byLocation: "BERDASARKAN LOKASI",
    villasUpTo4: "Villa hingga 4 Kamar Tidur",
    villas5Plus: "Villa 5 Kamar Tidur+",
    resortApartment: "Resor & Apartemen",
    eventsAndWeddings: "Acara & Pernikahan",
    allLocations: "Semua Lokasi Jabodetabek",
    subscribeNewsletter: "Berlangganan Newsletter Kami",
    newsletterHeadline: "DAPATKAN PENAWARAN EKSKLUSIF & BERITA TERBARU",
    emailPlaceholder: "Masukkan alamat email Anda",
    signUp: "DAFTAR",
    aboutUs: "TENTANG KAMI",
    reservation: "RESERVASI",
    guestAssistance: "BANTUAN TAMU",
    management: "MANAJEMEN",
    office: "KANTOR",
    hours: "JAM OPERASIONAL",
    connectWithUs: "IKUTI KAMI",
    perNight: "/ malam",
    bookOnAirbnb: "Pesan di Airbnb",
    details: "Detail",
    guests: "Tamu",
    bedrooms: "Kamar Tidur",
    baths: "Kamar Mandi",
    guestFavorite: "Favorit Tamu",
    exploreProperties: "Jelajahi Properti",
    ownerServices: "Layanan Pemilik Properti",
    forPropertyOwners: "Untuk Pemilik Properti",
    directConcierge: "Layanan Concierge Langsung",

    // Hero Section
    curatedResidencesJabodetabek: "Hunian Terkurasi Kinghouse • Jabodetabek",
    extraordinaryHospitality: "Hospitaliti Luar Biasa & Manajemen Aset",
    curatedVillasTitle: "Villa Terkurasi,",
    managedToPerfection: "Dikelola dengan Sempurna.",
    heroDescription: "Nikmati hunian arsitektur terbaik di Jakarta Selatan, Tangerang, Palmerah, dan Cikarang — berpadu dengan manajemen aset kelas institusi yang memberikan imbal hasil unggul bagi pemilik properti.",
    exploreVillasB2C: "Jelajahi Villa (Tamu)",
    partnerWithUsB2B: "Bermitra dengan Kami (Pemilik)",
    lifestyle: "Gaya Hidup",
    architecture: "Arsitektur",
    scrollToDiscover: "Gulir untuk Menjelajah",

    // Search Bar
    destinationLabel: "DESTINASI",
    allGreaterJakarta: "Semua Kawasan Jabodetabek",
    datesLabel: "TANGGAL",
    guestsLabel: "TAMU",
    searchVillas: "Cari Villa",

    // Curated Grid
    collection2026: "KOLEKSI 2026",
    architecturalSanctuaries: "Sanctuary Arsitektural",
    curatedGridSubtitle: "Setiap hunian dalam portofolio Kinghouse melewati audit arsitektur dan standar hospitaliti 120 poin sebelum kurasi.",
    viewAllVillas: "Lihat Semua Villa",
    startFrom: "Mulai Dari",

    // Dual Path Split
    forDiscerningTravelers: "Untuk Tamu & Liburan (B2C)",
    travelerHeadline: "Retreat Arsitektural,",
    travelerSubheadline: "Menginap Tanpa Repot via Airbnb.",
    travelerDescription: "Temukan villa privat berkolam renang dengan layanan concierge khusus, sarapan lezat, dan jaminan Superhost terverifikasi.",
    bookYourEscape: "Pesan Liburan Anda",
    forOwnersInvestors: "Untuk Pemilik Villa & Investor (B2B)",
    ownerHeadline: "Operasional Otomatis,",
    ownerSubheadline: "Imbal Hasil Aset Maksimal.",
    ownerDescription: "Algoritma tarif dinamis, bagi hasil transparan 15%–20%, perawatan standar hotel bintang 5, dan dashboard laporan laba rugi langsung.",
    maximizeRoi: "Maksimalkan ROI Villa Anda",

    // Trust & Proof
    globalDistributionHeader: "Distribusi Global & Akreditasi Hospitaliti Terverifikasi",
    verifiedVillaOwner: "Pemilik Villa Terverifikasi",
    verifiedGuestReview: "Tamu Terverifikasi",
    verifiedMetricHighlight: "Metrik Terverifikasi",

    // Catalog & Sidebar Filters
    filtersHeader: "FILTER",
    propertyTypeHeader: "TIPE PROPERTI",
    villaForEvents: "Villa untuk Acara",
    villaUpTo4Label: "Villa hingga 4 Kamar Tidur",
    villa5PlusLabel: "Villa 5 Kamar Tidur ke Atas",
    entireApartmentLabel: "Seluruh Apartemen / Suite",
    availabilityHeader: "KETERSEDIAAN",
    destinationHeader: "DESTINASI",
    allDestinations: "Semua Destinasi",
    haveVillaInMind: "PUNYA VILLA IMPIAN?",
    searchByNameOrArea: "Cari berdasarkan nama atau area...",
    applyButton: "TERAPKAN",
    clearButton: "RESET",
    findStayHeader: "CARI PENGINAPAN DI JABODETABEK",
    propertyNamePlaceholder: "NAMA PROPERTI",
    sortByHeader: "URUTKAN",
    sortPriceLowHigh: "HARGA: RENDAH KE TINGGI",
    sortPriceHighLow: "HARGA: TINGGI KE RENDAH",
    sortHighestRated: "RATING TERTINGGI",
    downloadBrochure: "Unduh Brosur",
    noVillasFoundMessage: "Tidak ada properti yang cocok dengan filter aktif Anda.",
    resetFiltersButton: "Reset Semua Filter",
    cleaningFeeText: "Biaya Kebersihan Sekali Bayar",

    // Events Page
    privateEventsHeader: "Acara & Pernikahan Privat",
    privateEventsSubtitle: "Pernikahan intim, gathering taman, retret korporat, dan produksi kreatif di kawasan arsitektur privat Jabodetabek.",
    packageTierHeader: "Paket Acara",
    capacityHeader: "Kapasitas",
    durationHeader: "Durasi",
    weekdayRateHeader: "Tarif Weekday",
    weekendRateHeader: "Tarif Weekend",
    reserveButton: "Reservasi",
    overnightStayHeader: "OPSI MENGINAP DI VILLA",
    roomConfigurationHeader: "Konfigurasi Kamar & Tarif Menginap (Versatile House)",
    roomConfigurationDesc: "Membutuhkan akomodasi ekstra untuk keluarga pengantin atau peserta retret? Versatile House mendukung pembukaan 2 hingga 6 kamar tidur fleksibel.",
    inquireWhatsApp: "Tanya Opsi Menginap via WhatsApp",

    // Owner Services Page
    passiveVillaIncome: "Penghasilan Villa Pasif. Tanpa Beban Operasional.",
    ownerServicesHeroDesc: "Manajemen aset sewa jangka pendek menyeluruh untuk hunian mewah, villa, dan apartemen butik di Jabodetabek.",
    requestAuditButton: "Minta Audit Pendapatan Gratis",
    compareModelsButton: "Bandingkan Skema Biaya",
    transparentFeeHeader: "Arsitektur Biaya Transparan",
    zeroFixedHeadline: "Nol Biaya Tetap. Murni Kinerja.",
    interactiveCalculatorTitle: "Kalkulator Interaktif Biaya & Hasil Bersih",
    calculatorSubtitle: "Perkirakan pembayaran bersih pemilik berdasarkan estimasi pendapatan kotor bulanan",
    estimatedGrossRevenueLabel: "Estimasi Pendapatan Kotor",
    applyForModel: "Daftar untuk",

    // Concierge & WA
    conciergeOnline: "Concierge Online",
    conciergeResponseTime: "Biasanya membalas dalam 15 menit",
    chatWhatsApp: "Chat via WhatsApp",
  },
  JA: {
    home: "ホーム",
    ourProperties: "宿泊施設",
    monthlyOffers: "マンスリー特典",
    events: "イベント",
    rewards: "リワード",
    enquire: "お問い合わせ",
    signIn: "ログイン",
    byPropertyType: "タイプ別",
    byLocation: "エリア別",
    villasUpTo4: "ヴィラ（最大4ベッドルーム）",
    villas5Plus: "ヴィラ（5ベッドルーム以上）",
    resortApartment: "リゾート＆アパートメント",
    eventsAndWeddings: "イベント＆パーティー",
    allLocations: "すべてのエリア（ジャボデタベック）",
    subscribeNewsletter: "ニュースレターに登録する",
    newsletterHeadline: "最新ニュースとお得な限定プランをお届け",
    emailPlaceholder: "メールアドレスを入力",
    signUp: "登録する",
    aboutUs: "キングハウスについて",
    reservation: "ご予約",
    guestAssistance: "ゲストサポート",
    management: "マネジメント",
    office: "所在地",
    hours: "営業時間",
    connectWithUs: "SNS",
    perNight: "/ 泊",
    bookOnAirbnb: "Airbnbで予約",
    details: "詳細",
    guests: "ゲスト",
    bedrooms: "ベッドルーム",
    baths: "バスルーム",
    guestFavorite: "ゲストに人気",
    exploreProperties: "物件を探す",
    ownerServices: "オーナー向けサービス",
    forPropertyOwners: "不動産オーナー様へ",
    directConcierge: "専任コンシェルジュデスク",

    // Hero Section
    curatedResidencesJabodetabek: "キングハウス厳選レジデンス • ジャカルタ首都圏",
    extraordinaryHospitality: "最高峰のホスピタリティ＆資産管理",
    curatedVillasTitle: "選りすぐりのヴィラ、",
    managedToPerfection: "完璧なる運営管理。",
    heroDescription: "南ジャカルタ、タンゲラン、パルメラー、チカランの建築美あふれる邸宅で過ごす特別なひととき。不動産オーナー様へ高利回りをお届けします。",
    exploreVillasB2C: "ヴィラを探す（ゲスト）",
    partnerWithUsB2B: "委託・提携のご相談（オーナー様）",
    lifestyle: "ライフスタイル",
    architecture: "建築デザイン",
    scrollToDiscover: "スクロールして詳細を見る",

    // Search Bar
    destinationLabel: "目的地",
    allGreaterJakarta: "ジャカルタ首都圏全域",
    datesLabel: "日程",
    guestsLabel: "宿泊人数",
    searchVillas: "ヴィラを検索",

    // Curated Grid
    collection2026: "2026年コレクション",
    architecturalSanctuaries: "洗練された建築サンクチュアリ",
    curatedGridSubtitle: "キングハウスのすべての物件は、選定前に120項目の建築およびホスピタリティ監査を実施しています。",
    viewAllVillas: "すべてのヴィラを見る",
    startFrom: "料金",

    // Dual Path Split
    forDiscerningTravelers: "ご旅行・ご滞在（B2C）",
    travelerHeadline: "建築美が息づく隠れ家、",
    travelerSubheadline: "快適なAirbnbステイ。",
    travelerDescription: "専用コンシェルジュ、上質な朝食、スーパーホスト品質の保証付きプライベートプールヴィラをお楽しみください。",
    bookYourEscape: "滞在を予約する",
    forOwnersInvestors: "オーナー様・投資家様向け（B2B）",
    ownerHeadline: "手間いらずのフル運営、",
    ownerSubheadline: "最大化される資産利回り。",
    ownerDescription: "ダイナミック価格設定、透明な15%〜20%の手数料体系、5つ星ホテル基準の維持管理、オンライン収支レポート。",
    maximizeRoi: "収益を最大化する",

    // Trust & Proof
    globalDistributionHeader: "世界規模の販売網＆認証済みホスピタリティ実績",
    verifiedVillaOwner: "認定ヴィラオーナー様",
    verifiedGuestReview: "認定ゲスト",
    verifiedMetricHighlight: "実績データ",

    // Catalog & Sidebar Filters
    filtersHeader: "絞り込み条件",
    propertyTypeHeader: "物件タイプ",
    villaForEvents: "イベント対応ヴィラ",
    villaUpTo4Label: "ヴィラ（最大4寝室）",
    villa5PlusLabel: "ヴィラ（5寝室以上）",
    entireApartmentLabel: "アパートメント / スイート",
    availabilityHeader: "空室カレンダー",
    destinationHeader: "エリア",
    allDestinations: "すべてのエリア",
    haveVillaInMind: "お探しのヴィラがありますか？",
    searchByNameOrArea: "物件名またはエリアで検索...",
    applyButton: "適用する",
    clearButton: "クリア",
    findStayHeader: "ジャボデタベックの滞在先を探す",
    propertyNamePlaceholder: "物件名",
    sortByHeader: "並び替え",
    sortPriceLowHigh: "料金：安い順",
    sortPriceHighLow: "料金：高い順",
    sortHighestRated: "高評価順",
    downloadBrochure: "パンフレットをダウンロード",
    noVillasFoundMessage: "条件に一致する物件が見つかりませんでした。",
    resetFiltersButton: "条件をリセット",
    cleaningFeeText: "清掃費（1回分）",

    // Events Page
    privateEventsHeader: "プライベートイベント＆パーティー",
    privateEventsSubtitle: "ガーデンウェディング、リトリート、法人オフサイト、撮影のための建築邸宅。",
    packageTierHeader: "パッケージプラン",
    capacityHeader: "定員",
    durationHeader: "利用時間",
    weekdayRateHeader: "平日料金",
    weekendRateHeader: "週末料金",
    reserveButton: "予約する",
    overnightStayHeader: "ヴィラ宿泊オプション",
    roomConfigurationHeader: "部屋構成と宿泊料金（Versatile House）",
    roomConfigurationDesc: "ご親族や参加者のための宿泊スペース。Versatile Houseでは2〜6部屋の柔軟なアンロックが可能です。",
    inquireWhatsApp: "WhatsAppでお問い合わせ",

    // Owner Services Page
    passiveVillaIncome: "手放しのヴィラ収益。運営ストレスはゼロ。",
    ownerServicesHeroDesc: "ジャカルタ首都圏の高級邸宅・ヴィラ・デザイナーズアパートメントを対象とした包括的な民泊・短期賃貸資産管理。",
    requestAuditButton: "無料収益査定を申し込む",
    compareModelsButton: "プラン比較",
    transparentFeeHeader: "透明な手数料体系",
    zeroFixedHeadline: "固定費ゼロ。完全成果報酬型。",
    interactiveCalculatorTitle: "収益シミュレーター",
    calculatorSubtitle: "月間総売上に基づくオーナー様の手取り受取額を試算",
    estimatedGrossRevenueLabel: "想定月間総売上",
    applyForModel: "申し込む",

    // Concierge & WA
    conciergeOnline: "コンシェルジュ対応中",
    conciergeResponseTime: "通常15分以内に返答いたします",
    chatWhatsApp: "WhatsAppでチャットする",
  },
  "ZH-CN": {
    home: "首页",
    ourProperties: "精选房源",
    monthlyOffers: "月度特惠",
    events: "活动与聚会",
    rewards: "会员奖励",
    enquire: "咨询洽谈",
    signIn: "登录",
    byPropertyType: "按房源类型",
    byLocation: "按地理位置",
    villasUpTo4: "豪华别墅（最多4卧）",
    villas5Plus: "豪华别墅（5卧及以上）",
    resortApartment: "度假村与精品公寓",
    eventsAndWeddings: "活动与私人宴会",
    allLocations: "大雅加达所有区域",
    subscribeNewsletter: "订阅我们的通讯",
    newsletterHeadline: "获取独家专属优惠与最新动态",
    emailPlaceholder: "输入您的电子邮箱",
    signUp: "立即订阅",
    aboutUs: "关于我们",
    reservation: "预订服务",
    guestAssistance: "贵宾礼宾支持",
    management: "资产管理",
    office: "办公地点",
    hours: "服务时间",
    connectWithUs: "关注我们",
    perNight: "/ 晚",
    bookOnAirbnb: "在 Airbnb 预订",
    details: "查看详情",
    guests: "位客人",
    bedrooms: "间卧室",
    baths: "间浴室",
    guestFavorite: "房客最爱",
    exploreProperties: "探索所有房源",
    ownerServices: "业主托管服务",
    forPropertyOwners: "业主合作专区",
    directConcierge: "专属礼宾及客服",

    // Hero Section
    curatedResidencesJabodetabek: "Kinghouse 精选名邸 • 大雅加达区域",
    extraordinaryHospitality: "卓越奢华款待与高端资产托管",
    curatedVillasTitle: "匠心严选别墅，",
    managedToPerfection: "至臻托管运营。",
    heroDescription: "置身南雅加达、唐格朗、帕尔梅拉与芝卡朗的建筑美学圣地，尊享机构级托管运营服务，为业主创造超额投资回报。",
    exploreVillasB2C: "探索精选别墅（房客）",
    partnerWithUsB2B: "与我们合作（业主托管）",
    lifestyle: "生活美学",
    architecture: "建筑典范",
    scrollToDiscover: "下滑开启探索",

    // Search Bar
    destinationLabel: "目的地",
    allGreaterJakarta: "大雅加达全部区域",
    datesLabel: "入住/离店日期",
    guestsLabel: "入住人数",
    searchVillas: "搜索房源",

    // Curated Grid
    collection2026: "2026年度甄选",
    architecturalSanctuaries: "建筑美学栖居典范",
    curatedGridSubtitle: "Kinghouse 旗下的每一处房源在入选前均通过 120 项严苛的建筑与款待服务审计。",
    viewAllVillas: "查看全部房源",
    startFrom: "起价",

    // Dual Path Split
    forDiscerningTravelers: "品味旅行者专区（B2C）",
    travelerHeadline: "建筑美学度假体验，",
    travelerSubheadline: "无忧无虑的 Airbnb 入住。",
    travelerDescription: "探索带有专属私人泳池的宁静度假屋，配备私享礼宾、精致手作早餐与 Airbnb 超赞房东品质保障。",
    bookYourEscape: "预订您的假期",
    forOwnersInvestors: "房产所有者与投资人专区（B2B）",
    ownerHeadline: "一站式全托管，",
    ownerSubheadline: "资产回报最大化。",
    ownerDescription: "智能动态收益定价、透明的 15%–20% 佣金模式、五星级酒店运维标准与实时财务收支看板。",
    maximizeRoi: "提升别墅投资回报率",

    // Trust & Proof
    globalDistributionHeader: "全球多渠道分销与认证级奢华款待背书",
    verifiedVillaOwner: "认证别墅业主",
    verifiedGuestReview: "真实入住房客",
    verifiedMetricHighlight: "验证经营指标",

    // Catalog & Sidebar Filters
    filtersHeader: "筛选条件",
    propertyTypeHeader: "房源类型",
    villaForEvents: "宴会与活动别墅",
    villaUpTo4Label: "别墅（最多4卧）",
    villa5PlusLabel: "别墅（5卧及以上）",
    entireApartmentLabel: "整套精品公寓 / 套房",
    availabilityHeader: "空房日期",
    destinationHeader: "所在区域",
    allDestinations: "全部目的地",
    haveVillaInMind: "心中已有心仪的别墅？",
    searchByNameOrArea: "按房源名称或区域搜索...",
    applyButton: "应用筛选",
    clearButton: "重置清除",
    findStayHeader: "在大雅加达寻找您的专属居所",
    propertyNamePlaceholder: "输入房源名称",
    sortByHeader: "排序方式",
    sortPriceLowHigh: "价格：从低到高",
    sortPriceHighLow: "价格：从高到低",
    sortHighestRated: "房客评分最高",
    downloadBrochure: "下载房源宣传册",
    noVillasFoundMessage: "未找到符合当前筛选条件的房源。",
    resetFiltersButton: "重置所有筛选",
    cleaningFeeText: "单次深度保洁费",

    // Events Page
    privateEventsHeader: "私人派对与定制宴会",
    privateEventsSubtitle: "在雅加达私享庄园中举办私密婚礼、花园派对、企业高管团建与商业创意拍摄。",
    packageTierHeader: "套餐方案",
    capacityHeader: "容纳人数",
    durationHeader: "使用时长",
    weekdayRateHeader: "工作日价格",
    weekendRateHeader: "周末价格",
    reserveButton: "立即预约",
    overnightStayHeader: "别墅客房套订选项",
    roomConfigurationHeader: "客房配置与连住价格（Versatile House）",
    roomConfigurationDesc: "需要为婚礼亲友或团建同仁提供额外住宿？Versatile House 支持 2 至 6 间卧室的灵活解锁预订。",
    inquireWhatsApp: "通过 WhatsApp 咨询定制方案",

    // Owner Services Page
    passiveVillaIncome: "坐享被动别墅收益。零运营琐事烦扰。",
    ownerServicesHeroDesc: "面向大雅加达地区豪华独栋住宅、度假别墅及精品公寓的全链路短租资产托管。",
    requestAuditButton: "申请免费收益评估",
    compareModelsButton: "对比合作方案",
    transparentFeeHeader: "透明费率架构",
    zeroFixedHeadline: "零固定成本支出。纯靠业绩收益分成。",
    interactiveCalculatorTitle: "净收益交互测算工具",
    calculatorSubtitle: "基于预估月度总营业额，测算业主的实际净收益",
    estimatedGrossRevenueLabel: "预估月度总营业额",
    applyForModel: "申请方案",

    // Concierge & WA
    conciergeOnline: "客服在线",
    conciergeResponseTime: "通常在 15 分钟内快速响应",
    chatWhatsApp: "通过 WhatsApp 咨询",
  },
  "ZH-TW": {
    home: "首頁",
    ourProperties: "精選房源",
    monthlyOffers: "月度特惠",
    events: "活動與聚會",
    rewards: "會員獎勵",
    enquire: "諮詢洽談",
    signIn: "登入",
    byPropertyType: "按房源類型",
    byLocation: "按地理位置",
    villasUpTo4: "豪華別墅（最多4房）",
    villas5Plus: "豪華別墅（5房以上）",
    resortApartment: "度假村與精品公寓",
    eventsAndWeddings: "活動與私人宴會",
    allLocations: "大雅加達所有區域",
    subscribeNewsletter: "訂閱我們的通訊",
    newsletterHeadline: "獲取獨家專屬優惠與最新動態",
    emailPlaceholder: "輸入您的電子郵件",
    signUp: "立即訂閱",
    aboutUs: "關於我們",
    reservation: "預訂服務",
    guestAssistance: "貴賓禮賓支持",
    management: "資產管理",
    office: "辦公地點",
    hours: "服務時間",
    connectWithUs: "關注我們",
    perNight: "/ 晚",
    bookOnAirbnb: "在 Airbnb 預訂",
    details: "查看詳情",
    guests: "位房客",
    bedrooms: "間臥室",
    baths: "間衛浴",
    guestFavorite: "房客最愛",
    exploreProperties: "探索所有房源",
    ownerServices: "業主託管服務",
    forPropertyOwners: "業主合作專區",
    directConcierge: "專屬禮賓及客服",

    // Hero Section
    curatedResidencesJabodetabek: "Kinghouse 精選名邸 • 大雅加達區域",
    extraordinaryHospitality: "卓越奢華款待與高端資產託管",
    curatedVillasTitle: "匠心嚴選別墅，",
    managedToPerfection: "至臻託管運營。",
    heroDescription: "置身南雅加達、唐格朗、帕爾梅拉與芝卡朗的建築美學聖地，尊享機構級託管運營服務，為業主創造超額投資回報。",
    exploreVillasB2C: "探索精選別墅（房客）",
    partnerWithUsB2B: "與我們合作（業主託管）",
    lifestyle: "生活美學",
    architecture: "建築典範",
    scrollToDiscover: "下滑開啟探索",

    // Search Bar
    destinationLabel: "目的地",
    allGreaterJakarta: "大雅加達全部區域",
    datesLabel: "入住/退房日期",
    guestsLabel: "入住人數",
    searchVillas: "搜尋房源",

    // Curated Grid
    collection2026: "2026年度甄選",
    architecturalSanctuaries: "建築美學棲居典範",
    curatedGridSubtitle: "Kinghouse 旗下的每一處房源在入選前均通過 120 項嚴苛的建築與款待服務審計。",
    viewAllVillas: "查看全部房源",
    startFrom: "起價",

    // Dual Path Split
    forDiscerningTravelers: "品味旅行者專區（B2C）",
    travelerHeadline: "建築美學度假體驗，",
    travelerSubheadline: "無憂無慮的 Airbnb 入住。",
    travelerDescription: "探索帶有專屬私人泳池的寧靜度假屋，配備私享禮賓、精緻手作早餐與 Airbnb 超讚房東品質保障。",
    bookYourEscape: "預訂您的假期",
    forOwnersInvestors: "房產所有者與投資人專區（B2B）",
    ownerHeadline: "一站式全託管，",
    ownerSubheadline: "資產回報最大化。",
    ownerDescription: "智能動態收益定價、透明的 15%–20% 佣金模式、五星級酒店運維標準與即時財務收支看板。",
    maximizeRoi: "提升別墅投資回報率",

    // Trust & Proof
    globalDistributionHeader: "全球多通路分銷與認證級奢華款待背書",
    verifiedVillaOwner: "認證別墅業主",
    verifiedGuestReview: "真實入住房客",
    verifiedMetricHighlight: "驗證經營指標",

    // Catalog & Sidebar Filters
    filtersHeader: "篩選條件",
    propertyTypeHeader: "房源類型",
    villaForEvents: "宴會與活動別墅",
    villaUpTo4Label: "別墅（最多4房）",
    villa5PlusLabel: "別墅（5房以上）",
    entireApartmentLabel: "整套精品公寓 / 套房",
    availabilityHeader: "空房日期",
    destinationHeader: "所在區域",
    allDestinations: "全部目的地",
    haveVillaInMind: "心中已有心儀的別墅？",
    searchByNameOrArea: "按房源名稱或區域搜尋...",
    applyButton: "套用篩選",
    clearButton: "重設清除",
    findStayHeader: "在大雅加達尋找您的專屬居所",
    propertyNamePlaceholder: "輸入房源名稱",
    sortByHeader: "排序方式",
    sortPriceLowHigh: "價格：從低到高",
    sortPriceHighLow: "價格：從高到低",
    sortHighestRated: "房客評分最高",
    downloadBrochure: "下載房源宣傳冊",
    noVillasFoundMessage: "未找到符合當前篩選條件的房源。",
    resetFiltersButton: "重設所有篩選",
    cleaningFeeText: "單次深度清潔費",

    // Events Page
    privateEventsHeader: "私人派對與客製化宴會",
    privateEventsSubtitle: "在雅加達私享莊園中舉辦私密婚禮、花園派對、企業高階團建與商業創意拍攝。",
    packageTierHeader: "方案套餐",
    capacityHeader: "容納人數",
    durationHeader: "使用時長",
    weekdayRateHeader: "平日價格",
    weekendRateHeader: "週末價格",
    reserveButton: "立即預約",
    overnightStayHeader: "別墅客房加訂選項",
    roomConfigurationHeader: "客房配置與連住價格（Versatile House）",
    roomConfigurationDesc: "需要為婚禮親友或團建同仁提供額外住宿？Versatile House 支援 2 至 6 間臥室的靈活解鎖預訂。",
    inquireWhatsApp: "透過 WhatsApp 諮詢客製方案",

    // Owner Services Page
    passiveVillaIncome: "坐享被動別墅收益。零營運瑣事煩擾。",
    ownerServicesHeroDesc: "面向大雅加達地區豪華獨棟住宅、度假別墅及精品公寓的全鏈路短租資產託管。",
    requestAuditButton: "申請免費收益評估",
    compareModelsButton: "比較合作方案",
    transparentFeeHeader: "透明費率架構",
    zeroFixedHeadline: "零固定成本支出。純靠業績收益分成。",
    interactiveCalculatorTitle: "淨收益互動試算工具",
    calculatorSubtitle: "基於預估月度總營業額，試算業主的實際淨收益",
    estimatedGrossRevenueLabel: "預估月度總營業額",
    applyForModel: "申請方案",

    // Concierge & WA
    conciergeOnline: "客服線上中",
    conciergeResponseTime: "通常在 15 分鐘內快速回覆",
    chatWhatsApp: "透過 WhatsApp 諮詢",
  },
  FR: {
    home: "ACCUEIL",
    ourProperties: "NOS PROPRIÉTÉS",
    monthlyOffers: "OFFRES DU MOIS",
    events: "ÉVÉNEMENTS",
    rewards: "RÉCOMPENSES",
    enquire: "DEMANDE",
    signIn: "CONNEXION",
    byPropertyType: "PAR TYPE DE PROPRIÉTÉ",
    byLocation: "PAR DESTINATION",
    villasUpTo4: "Villas jusqu'à 4 Chambres",
    villas5Plus: "Villas 5 Chambres et +",
    resortApartment: "Résidences & Appartements",
    eventsAndWeddings: "Événements & Célébrations",
    allLocations: "Toutes les Destinations",
    subscribeNewsletter: "Abonnez-vous à notre Newsletter",
    newsletterHeadline: "RECEVEZ NOS OFFRES EXCLUSIVES ET DERNIÈRES NOUVELLES",
    emailPlaceholder: "Votre adresse e-mail",
    signUp: "S'INSCRIRE",
    aboutUs: "À PROPOS",
    reservation: "RÉSERVATIONS",
    guestAssistance: "ASSISTANCE CLIENTS",
    management: "GESTION",
    office: "BUREAU",
    hours: "HORAIRES",
    connectWithUs: "REJOIGNEZ-NOUS",
    perNight: "/ nuit",
    bookOnAirbnb: "Réserver sur Airbnb",
    details: "Détails",
    guests: "Voyageurs",
    bedrooms: "Chambres",
    baths: "Salles de bain",
    guestFavorite: "Coup de cœur",
    exploreProperties: "Explorer les Villas",
    ownerServices: "Services Propriétaires",
    forPropertyOwners: "Espace Propriétaires",
    directConcierge: "Service Conciergerie Dédié",

    // Hero Section
    curatedResidencesJabodetabek: "Résidences d'exception Kinghouse • Grand Jakarta",
    extraordinaryHospitality: "Hospitalité remarquable & Gestion de patrimoine",
    curatedVillasTitle: "Villas d'exception,",
    managedToPerfection: "Gérées avec perfection.",
    heroDescription: "Immergez-vous dans des sanctuaires architecturaux à Jakarta Sud, Tangerang, Palmerah et Cikarang, associés à une gestion de niveau institutionnel garantissant des rendements optimaux pour les propriétaires.",
    exploreVillasB2C: "Découvrir les villas (Voyageurs)",
    partnerWithUsB2B: "Confier votre bien (Propriétaires)",
    lifestyle: "Art de vivre",
    architecture: "Architecture",
    scrollToDiscover: "Défiler pour découvrir",

    // Search Bar
    destinationLabel: "DESTINATION",
    allGreaterJakarta: "Toutes les destinations du Grand Jakarta",
    datesLabel: "DATES",
    guestsLabel: "VOYAGEURS",
    searchVillas: "Rechercher",

    // Curated Grid
    collection2026: "COLLECTION 2026",
    architecturalSanctuaries: "Sanctuaires Architecturaux",
    curatedGridSubtitle: "Chaque propriété de notre collection fait l'objet d'un audit architectural et hôtelier en 120 points avant d'être référencée.",
    viewAllVillas: "Voir toutes les villas",
    startFrom: "À partir de",

    // Dual Path Split
    forDiscerningTravelers: "Pour voyageurs exigeants (B2C)",
    travelerHeadline: "Retraites architecturales,",
    travelerSubheadline: "Séjours fluides sur Airbnb.",
    travelerDescription: "Découvrez des havres de paix avec piscine privée, conciergerie dédiée, petits déjeuners artisanaux et garantie Superhost vérifiée.",
    bookYourEscape: "Réservez votre séjour",
    forOwnersInvestors: "Pour propriétaires & investisseurs (B2B)",
    ownerHeadline: "Gestion clé en main,",
    ownerSubheadline: "Rendement locatif maximisé.",
    ownerDescription: "Algorithmes de tarification dynamique, commissions transparentes de 15% à 20%, entretien 5 étoiles et tableau de bord financier en temps réel.",
    maximizeRoi: "Maximiser la rentabilité",

    // Trust & Proof
    globalDistributionHeader: "Distribution globale & Accréditations hôtelières vérifiées",
    verifiedVillaOwner: "Propriétaire vérifié",
    verifiedGuestReview: "Voyageur vérifié",
    verifiedMetricHighlight: "Indicateur vérifié",

    // Catalog & Sidebar Filters
    filtersHeader: "FILTRES",
    propertyTypeHeader: "TYPE DE PROPRIÉTÉ",
    villaForEvents: "Villas pour événements",
    villaUpTo4Label: "Villas jusqu'à 4 chambres",
    villa5PlusLabel: "Villas de 5 chambres et plus",
    entireApartmentLabel: "Appartements & Suites",
    availabilityHeader: "DISPONIBILITÉS",
    destinationHeader: "DESTINATION",
    allDestinations: "Toutes les destinations",
    haveVillaInMind: "UNE VILLA EN TÊTE ?",
    searchByNameOrArea: "Recherche par nom ou quartier...",
    applyButton: "APPLIQUER",
    clearButton: "RÉINITIALISER",
    findStayHeader: "TROUVER UN SÉJOUR À JABODETABEK",
    propertyNamePlaceholder: "NOM DE LA PROPRIÉTÉ",
    sortByHeader: "TRIER PAR",
    sortPriceLowHigh: "PRIX : DU PLUS BAS AU PLUS HAUT",
    sortPriceHighLow: "PRIX : DU PLUS HAUT AU PLUS BAS",
    sortHighestRated: "MEILLEURES NOTES",
    downloadBrochure: "Télécharger la brochure",
    noVillasFoundMessage: "Aucune propriété ne correspond à vos critères de recherche.",
    resetFiltersButton: "Réinitialiser les filtres",
    cleaningFeeText: "Frais de ménage uniques",

    // Events Page
    privateEventsHeader: "Événements privés & Réceptions",
    privateEventsSubtitle: "Mariages intimistes, réceptions de jardin, séminaires d'entreprise et tournages dans des domaines architecturaux d'exception.",
    packageTierHeader: "Formule",
    capacityHeader: "Capacité",
    durationHeader: "Durée",
    weekdayRateHeader: "Tarif en semaine",
    weekendRateHeader: "Tarif le week-end",
    reserveButton: "Réserver",
    overnightStayHeader: "OPTION SÉJOUR EN VILLA",
    roomConfigurationHeader: "Configuration des chambres & Tarifs (Versatile House)",
    roomConfigurationDesc: "Besoin d'hébergement pour la famille des mariés ou les participants ? Versatile House permet d'ouvrir de 2 à 6 chambres à votre convenance.",
    inquireWhatsApp: "Demande sur mesure via WhatsApp",

    // Owner Services Page
    passiveVillaIncome: "Revenus locatifs passifs. Zéro contrainte opérationnelle.",
    ownerServicesHeroDesc: "Gestion intégrale pour propriétés d'exception, villas et appartements de standing à travers Jabodetabek.",
    requestAuditButton: "Demander un audit de revenus gratuit",
    compareModelsButton: "Comparer nos formules",
    transparentFeeHeader: "Structure tarifaire transparente",
    zeroFixedHeadline: "Zéro coût fixe. Rémunération 100% à la performance.",
    interactiveCalculatorTitle: "Simulateur de revenus & rentabilité nette",
    calculatorSubtitle: "Estimez vos gains nets de propriétaire selon votre chiffre d'affaires mensuel estimé",
    estimatedGrossRevenueLabel: "Chiffre d'affaires brut estimé",
    applyForModel: "Choisir la formule",

    // Concierge & WA
    conciergeOnline: "Conciergerie en ligne",
    conciergeResponseTime: "Réponse habituelle en moins de 15 minutes",
    chatWhatsApp: "Discuter sur WhatsApp",
  },
  ES: {
    home: "INICIO",
    ourProperties: "NUESTRAS PROPIEDADES",
    monthlyOffers: "OFERTAS MENSUALES",
    events: "EVENTOS",
    rewards: "RECOMPENSAS",
    enquire: "CONSULTAR",
    signIn: "INICIAR SESIÓN",
    byPropertyType: "POR TIPO DE PROPIEDAD",
    byLocation: "POR DESTINO",
    villasUpTo4: "Villas de hasta 4 Dormitorios",
    villas5Plus: "Villas de 5+ Dormitorios",
    resortApartment: "Resorts y Apartamentos",
    eventsAndWeddings: "Eventos y Celebraciones",
    allLocations: "Todas las Ubicaciones",
    subscribeNewsletter: "Suscríbete a nuestro boletín",
    newsletterHeadline: "OBTÉN OFERTAS EXCLUSIVAS Y ÚLTIMAS NOVEDADES",
    emailPlaceholder: "Introduce tu correo electrónico",
    signUp: "SUSCRIBIRSE",
    aboutUs: "SOBRE NOSOTROS",
    reservation: "RESERVAS",
    guestAssistance: "ATENCIÓN AL CLIENTE",
    management: "GESTIÓN",
    office: "OFICINA",
    hours: "HORARIO",
    connectWithUs: "SÍGUENOS",
    perNight: "/ noche",
    bookOnAirbnb: "Reservar en Airbnb",
    details: "Detalles",
    guests: "Huéspedes",
    bedrooms: "Habitaciones",
    baths: "Baños",
    guestFavorite: "Favorito de huéspedes",
    exploreProperties: "Explorar Propiedades",
    ownerServices: "Servicios para Propietarios",
    forPropertyOwners: "Para Propietarios",
    directConcierge: "Conserjería Directa",

    // Hero Section
    curatedResidencesJabodetabek: "Residencias Exclusivas Kinghouse • Gran Yakarta",
    extraordinaryHospitality: "Hospitalidad extraordinaria y gestión de activos",
    curatedVillasTitle: "Villas de autor,",
    managedToPerfection: "Gestionadas a la perfección.",
    heroDescription: "Disfruta de retiros arquitectónicos en el sur de Yakarta, Tangerang, Palmerah y Cikarang, con gestión institucional que maximiza el rendimiento para los propietarios.",
    exploreVillasB2C: "Explorar villas (Huéspedes)",
    partnerWithUsB2B: "Asóciate con nosotros (Propietarios)",
    lifestyle: "Estilo de vida",
    architecture: "Arquitectura",
    scrollToDiscover: "Desplaza para descubrir",

    // Search Bar
    destinationLabel: "DESTINO",
    allGreaterJakarta: "Todas las zonas del Gran Yakarta",
    datesLabel: "FECHAS",
    guestsLabel: "HUÉSPEDES",
    searchVillas: "Buscar villas",

    // Curated Grid
    collection2026: "COLECCIÓN 2026",
    architecturalSanctuaries: "Santuarios Arquitectónicos",
    curatedGridSubtitle: "Cada residencia de la cartera Kinghouse supera una auditoría arquitectónica y de hospitalidad de 120 puntos antes de su selección.",
    viewAllVillas: "Ver todas las villas",
    startFrom: "Desde",

    // Dual Path Split
    forDiscerningTravelers: "Para huéspedes exigentes (B2C)",
    travelerHeadline: "Retiros arquitectónicos,",
    travelerSubheadline: "Estancias sin fricción en Airbnb.",
    travelerDescription: "Descubre villas con piscina privada, conserjería dedicada, desayunos artesanales y garantías verificadas de Superhost.",
    bookYourEscape: "Reserva tu escapada",
    forOwnersInvestors: "Para propietarios e inversores (B2B)",
    ownerHeadline: "Operaciones llave en mano,",
    ownerSubheadline: "Máximo rendimiento del activo.",
    ownerDescription: "Tarifas dinámicas por algoritmo, comisiones transparentes del 15% al 20%, mantenimiento de 5 estrellas y panel financiero en tiempo real.",
    maximizeRoi: "Maximizar el ROI de su villa",

    // Trust & Proof
    globalDistributionHeader: "Distribución global y acreditaciones de hospitalidad verificadas",
    verifiedVillaOwner: "Propietario verificado",
    verifiedGuestReview: "Huésped verificado",
    verifiedMetricHighlight: "Métrica verificada",

    // Catalog & Sidebar Filters
    filtersHeader: "FILTROS",
    propertyTypeHeader: "TIPO DE PROPIEDAD",
    villaForEvents: "Villas para eventos",
    villaUpTo4Label: "Villas de hasta 4 habitaciones",
    villa5PlusLabel: "Villas de 5 habitaciones o más",
    entireApartmentLabel: "Apartamentos completos / Suites",
    availabilityHeader: "DISPONIBILIDAD",
    destinationHeader: "DESTINO",
    allDestinations: "Todos los destinos",
    haveVillaInMind: "¿TIENES UNA VILLA EN MENTE?",
    searchByNameOrArea: "Buscar por nombre o zona...",
    applyButton: "APLICAR",
    clearButton: "LIMPIAR",
    findStayHeader: "ENCUENTRA TU ESTANCIA EN JABODETABEK",
    propertyNamePlaceholder: "NOMBRE DE PROPIEDAD",
    sortByHeader: "ORDENAR POR",
    sortPriceLowHigh: "PRECIO: MENOR A MAYOR",
    sortPriceHighLow: "PRECIO: MAYOR A MENOR",
    sortHighestRated: "MEJOR VALORADAS",
    downloadBrochure: "Descargar catálogo",
    noVillasFoundMessage: "No se encontraron propiedades con los filtros seleccionados.",
    resetFiltersButton: "Restablecer filtros",
    cleaningFeeText: "Tarifa única de limpieza",

    // Events Page
    privateEventsHeader: "Eventos privados y celebraciones",
    privateEventsSubtitle: "Bodas íntimas, eventos en jardines, retiros corporativos y producciones en exclusivos recintos arquitectónicos.",
    packageTierHeader: "Paquete",
    capacityHeader: "Capacidad",
    durationHeader: "Duración",
    weekdayRateHeader: "Tarifa entre semana",
    weekendRateHeader: "Tarifa fin de semana",
    reserveButton: "Reservar",
    overnightStayHeader: "OPCIÓN DE ALOJAMIENTO EN VILLA",
    roomConfigurationHeader: "Configuración de habitaciones y tarifas (Versatile House)",
    roomConfigurationDesc: "¿Necesitas alojamiento adicional para invitados o asistentes? Versatile House permite habilitar de 2 a 6 dormitorios según tus necesidades.",
    inquireWhatsApp: "Consultar opciones por WhatsApp",

    // Owner Services Page
    passiveVillaIncome: "Ingresos pasivos por tu villa. Cero dolores de cabeza operativos.",
    ownerServicesHeroDesc: "Gestión integral de alquileres de corta estancia para villas, residencias de lujo y apartamentos boutique en Jabodetabek.",
    requestAuditButton: "Solicitar auditoría de ingresos gratuita",
    compareModelsButton: "Comparar modelos de tarifas",
    transparentFeeHeader: "Estructura de tarifas transparente",
    zeroFixedHeadline: "Cero costes fijos. Rendimiento puro.",
    interactiveCalculatorTitle: "Calculadora de comisiones y rendimiento neto",
    calculatorSubtitle: "Estima tus ingresos netos como propietario según la facturación mensual prevista",
    estimatedGrossRevenueLabel: "Ingresos brutos estimados",
    applyForModel: "Solicitar",

    // Concierge & WA
    conciergeOnline: "Conserje en línea",
    conciergeResponseTime: "Respuesta habitual en menos de 15 minutos",
    chatWhatsApp: "Chatear por WhatsApp",
  },
  DE: {
    home: "STARTSEITE",
    ourProperties: "UNSERE UNTERKÜNFTE",
    monthlyOffers: "MONATSANGEBOTE",
    events: "EVENTS",
    rewards: "PRÄMIEN",
    enquire: "ANFRAGEN",
    signIn: "ANMELDEN",
    byPropertyType: "NACH UNTERKUNFTSTYP",
    byLocation: "NACH STANDORT",
    villasUpTo4: "Villen bis zu 4 Schlafzimmer",
    villas5Plus: "Villen ab 5 Schlafzimmer",
    resortApartment: "Resort & Apartments",
    eventsAndWeddings: "Events & Hochzeiten",
    allLocations: "Alle Standorte",
    subscribeNewsletter: "Newsletter abonnieren",
    newsletterHeadline: "EXKLUSIVE ANGEBOTE & AKTUELLE NEWS ERHALTEN",
    emailPlaceholder: "E-Mail-Adresse eingeben",
    signUp: "ANMELDEN",
    aboutUs: "ÜBER UNS",
    reservation: "RESERVIERUNG",
    guestAssistance: "GÄSTEBETREUUNG",
    management: "MANAGEMENT",
    office: "BÜRO",
    hours: "ÖFFNUNGSZEITEN",
    connectWithUs: "FOLGEN SIE UNS",
    perNight: "/ Nacht",
    bookOnAirbnb: "Auf Airbnb buchen",
    details: "Details",
    guests: "Gäste",
    bedrooms: "Schlafzimmer",
    baths: "Bäder",
    guestFavorite: "Gäste-Favorit",
    exploreProperties: "Unterkünfte erkunden",
    ownerServices: "Eigentümer-Services",
    forPropertyOwners: "Für Immobilieneigentümer",
    directConcierge: "Direkter Concierge-Service",

    // Hero Section
    curatedResidencesJabodetabek: "Kinghouse Kuratierte Residenzen • Großraum Jakarta",
    extraordinaryHospitality: "Erstklassige Gastfreundschaft & Vermögensverwaltung",
    curatedVillasTitle: "Kuratierte Villen,",
    managedToPerfection: "In Perfektion verwaltet.",
    heroDescription: "Erleben Sie architektonische Meisterwerke in Süd-Jakarta, Tangerang, Palmerah und Cikarang — kombiniert mit institutionellem Asset Management für maximale Eigentümerrendite.",
    exploreVillasB2C: "Villen entdecken (Gäste)",
    partnerWithUsB2B: "Partner werden (Eigentümer)",
    lifestyle: "Lifestyle",
    architecture: "Architektur",
    scrollToDiscover: "Nach unten scrollen zum Entdecken",

    // Search Bar
    destinationLabel: "REISEZIEL",
    allGreaterJakarta: "Alle Regionen im Großraum Jakarta",
    datesLabel: "DATEN",
    guestsLabel: "GÄSTE",
    searchVillas: "Villen suchen",

    // Curated Grid
    collection2026: "KOLLEKTION 2026",
    architecturalSanctuaries: "Architektonische Zufluchtsorte",
    curatedGridSubtitle: "Jede Residenz im Kinghouse-Portfolio durchläuft vor der Aufnahme ein 120-Punkte-Audit für Architektur und Gastfreundschaft.",
    viewAllVillas: "Alle Villen ansehen",
    startFrom: "Ab",

    // Dual Path Split
    forDiscerningTravelers: "Für anspruchsvolle Reisende (B2C)",
    travelerHeadline: "Architektonische Refugien,",
    travelerSubheadline: "Reibungslose Airbnb-Aufenthalte.",
    travelerDescription: "Entdecken Sie Villen mit privatem Pool, persönlichem Concierge, handgemachtem Frühstück und geprüfter Superhost-Garantie.",
    bookYourEscape: "Aufenthalt buchen",
    forOwnersInvestors: "Für Eigentümer & Investoren (B2B)",
    ownerHeadline: "Schlüsselfertiger Betrieb,",
    ownerSubheadline: "Maximierte Vermögensrendite.",
    ownerDescription: "Dynamische Preisalgorithmen, transparente 15%–20% Gebührenmodelle, 5-Sterne-Instandhaltung und Live-Eigentümer-Dashboard.",
    maximizeRoi: "Villa-Rendite maximieren",

    // Trust & Proof
    globalDistributionHeader: "Weltweiter Vertrieb & Zertifizierte Hospitality-Standards",
    verifiedVillaOwner: "Verifizierter Villen-Eigentümer",
    verifiedGuestReview: "Verifizierter Gast",
    verifiedMetricHighlight: "Geprüfte Kennzahl",

    // Catalog & Sidebar Filters
    filtersHeader: "FILTER",
    propertyTypeHeader: "UNTERKUNFTSTYP",
    villaForEvents: "Villen für Events",
    villaUpTo4Label: "Villen bis zu 4 Schlafzimmer",
    villa5PlusLabel: "Villen ab 5 Schlafzimmer",
    entireApartmentLabel: "Apartment / Suite",
    availabilityHeader: "VERFÜGBARKEIT",
    destinationHeader: "STANDORT",
    allDestinations: "Alle Standorte",
    haveVillaInMind: "BESTIMMTE VILLA GESUCHT?",
    searchByNameOrArea: "Nach Name oder Bezirk suchen...",
    applyButton: "ANWENDEN",
    clearButton: "ZURÜCKSETZEN",
    findStayHeader: "UNTERKUNFT IN JABODETABEK FINDEN",
    propertyNamePlaceholder: "NAME DER UNTERKUNFT",
    sortByHeader: "SORTIEREN NACH",
    sortPriceLowHigh: "PREIS: AUFSTEIGEND",
    sortPriceHighLow: "PREIS: ABSTEIGEND",
    sortHighestRated: "BESTE BEWERTUNGEN",
    downloadBrochure: "Broschüre herunterladen",
    noVillasFoundMessage: "Keine Unterkünfte für Ihre Filterkriterien gefunden.",
    resetFiltersButton: "Alle Filter zurücksetzen",
    cleaningFeeText: "Einmalige Reinigungsgebühr",

    // Events Page
    privateEventsHeader: "Private Feiern & Veranstaltungen",
    privateEventsSubtitle: "Stilvolle Hochzeiten, Gartenpartys, Firmen-Offsites und Medienproduktionen in exklusiven architektonischen Anwesen.",
    packageTierHeader: "Paket-Stufe",
    capacityHeader: "Kapazität",
    durationHeader: "Dauer",
    weekdayRateHeader: "Wochentags-Tarif",
    weekendRateHeader: "Wochenend-Tarif",
    reserveButton: "Reservieren",
    overnightStayHeader: "ÜBERNACHTUNGSOPTION",
    roomConfigurationHeader: "Zimmeraufteilung & Übernachtungstarife (Versatile House)",
    roomConfigurationDesc: "Unterkunft für Hochzeitsgäste oder Retreat-Teilnehmer benötigt? Im Versatile House können 2 bis 6 Schlafzimmer flexibel gebucht werden.",
    inquireWhatsApp: "Individuelle Anfrage via WhatsApp",

    // Owner Services Page
    passiveVillaIncome: "Passives Villen-Einkommen. Kein Betriebsaufwand.",
    ownerServicesHeroDesc: "Ganzheitliches Kurzzeitvermietungs-Management für Luxusanwesen, Villen und Boutique-Apartments im Großraum Jakarta.",
    requestAuditButton: "Kostenlose Ertragsanalyse anfordern",
    compareModelsButton: "Preismodelle vergleichen",
    transparentFeeHeader: "Transparente Vergütungsstruktur",
    zeroFixedHeadline: "Null Fixkosten. Reine Leistungsorientierung.",
    interactiveCalculatorTitle: "Interaktiver Ertrags- & Renditerechner",
    calculatorSubtitle: "Schätzen Sie Ihre Netto-Auszahlung basierend auf dem monatlichen Bruttoumsatz",
    estimatedGrossRevenueLabel: "Geschätzter monatlicher Bruttoumsatz",
    applyForModel: "Modell wählen",

    // Concierge & WA
    conciergeOnline: "Concierge online",
    conciergeResponseTime: "Antwortet gewöhnlich in unter 15 Minuten",
    chatWhatsApp: "Über WhatsApp chatten",
  },
  RU: {
    home: "ГЛАВНАЯ",
    ourProperties: "НАШИ ОБЪЕКТЫ",
    monthlyOffers: "ПРЕДЛОЖЕНИЯ МЕСЯЦА",
    events: "МЕРОПРИЯТИЯ",
    rewards: "ПРОГРАММА ЛОЯЛЬНОСТИ",
    enquire: "ЗАПРОС",
    signIn: "ВОЙТИ",
    byPropertyType: "ПО ТИПУ ОБЪЕКТА",
    byLocation: "ПО РАСПОЛОЖЕНИЮ",
    villasUpTo4: "Виллы до 4 спален",
    villas5Plus: "Виллы от 5 спален",
    resortApartment: "Курортные апартаменты",
    eventsAndWeddings: "Мероприятия и праздники",
    allLocations: "Все локации Джакарты",
    subscribeNewsletter: "Подпишитесь на рассылку",
    newsletterHeadline: "ПОЛУЧАЙТЕ ЭКСКЛЮЗИВНЫЕ СКИДКИ И НОВОСТИ",
    emailPlaceholder: "Введите ваш e-mail",
    signUp: "ПОДПИСАТЬСЯ",
    aboutUs: "О НАС",
    reservation: "БРОНИРОВАНИЕ",
    guestAssistance: "СЛУЖБА ПОДДЕРЖКИ",
    management: "УПРАВЛЕНИЕ",
    office: "ОФИС",
    hours: "ЧАСЫ РАБОТЫ",
    connectWithUs: "МЫ В СОЦСЕТЯХ",
    perNight: "/ ночь",
    bookOnAirbnb: "Забронировать на Airbnb",
    details: "Подробнее",
    guests: "Гостей",
    bedrooms: "Спальни",
    baths: "Ванные",
    guestFavorite: "Выбор гостей",
    exploreProperties: "Смотреть объекты",
    ownerServices: "Услуги для владельцев",
    forPropertyOwners: "Для владельцев",
    directConcierge: "Прямой консьерж-сервис",

    // Hero Section
    curatedResidencesJabodetabek: "Премиальные резиденции Kinghouse • Джакарта",
    extraordinaryHospitality: "Исключительный сервис и доверительное управление",
    curatedVillasTitle: "Коллекция вилл,",
    managedToPerfection: "Безупречное управление.",
    heroDescription: "Погрузитесь в атмосферу уникальных вилл в Южной Джакарте, Тангеранге, Пальмере и Чикаранге в сочетании с институциональным управлением для максимального дохода владельцев.",
    exploreVillasB2C: "Выбрать виллу (Гости)",
    partnerWithUsB2B: "Доверительное управление (Владельцы)",
    lifestyle: "Стиль жизни",
    architecture: "Архитектура",
    scrollToDiscover: "Прокрутите вниз для обзора",

    // Search Bar
    destinationLabel: "НАПРАВЛЕНИЕ",
    allGreaterJakarta: "Все районы Большой Джакарты",
    datesLabel: "ДАТЫ",
    guestsLabel: "ГОСТИ",
    searchVillas: "Найти виллу",

    // Curated Grid
    collection2026: "КОЛЛЕКЦИЯ 2026",
    architecturalSanctuaries: "Архитектурные оазисы",
    curatedGridSubtitle: "Каждый объект в портфолио Kinghouse проходит аудит из 120 параметров архитектуры и сервиса перед включением в коллекцию.",
    viewAllVillas: "Все объекты",
    startFrom: "От",

    // Dual Path Split
    forDiscerningTravelers: "Для искушенных гостей (B2C)",
    travelerHeadline: "Архитектурные убежища,",
    travelerSubheadline: "Комфортный отдых через Airbnb.",
    travelerDescription: "Виллы с частными бассейнами, персональным консьержем, изысканными завтраками и гарантией статуса Superhost.",
    bookYourEscape: "Забронировать виллу",
    forOwnersInvestors: "Для владельцев и инвесторов (B2B)",
    ownerHeadline: "Управление под ключ,",
    ownerSubheadline: "Максимизация доходности.",
    ownerDescription: "Динамическое ценообразование, прозрачные комиссии 15%–20%, обслуживание стандарта 5 звезд и онлайн-отчетность.",
    maximizeRoi: "Увеличить доход от виллы",

    // Trust & Proof
    globalDistributionHeader: "Международная дистрибуция и подтвержденные стандарты сервиса",
    verifiedVillaOwner: "Подтвержденный владелец",
    verifiedGuestReview: "Реальный гость",
    verifiedMetricHighlight: "Подтвержденный показатель",

    // Catalog & Sidebar Filters
    filtersHeader: "ФИЛЬТРЫ",
    propertyTypeHeader: "ТИП ОБЪЕКТА",
    villaForEvents: "Виллы для мероприятий",
    villaUpTo4Label: "Виллы до 4 спален",
    villa5PlusLabel: "Виллы от 5 спален",
    entireApartmentLabel: "Апартаменты и люксы",
    availabilityHeader: "ДОСТУПНОСТЬ",
    destinationHeader: "ЛОКАЦИЯ",
    allDestinations: "Все локации",
    haveVillaInMind: "ИЩЕТЕ ОПРЕДЕЛЕННУЮ ВИЛЛУ?",
    searchByNameOrArea: "Поиск по названию или району...",
    applyButton: "ПРИМЕНИТЬ",
    clearButton: "СБРОСИТЬ",
    findStayHeader: "НАЙТИ ЖИЛЬЕ В ДЖАКАРТЕ",
    propertyNamePlaceholder: "НАЗВАНИЕ ОБЪЕКТА",
    sortByHeader: "СОРТИРОВКА",
    sortPriceLowHigh: "ЦЕНА: ПО ВОЗРАСТАНИЮ",
    sortPriceHighLow: "ЦЕНА: ПО УБЫВАНИЮ",
    sortHighestRated: "ВЫСОКИЙ РЕЙТИНГ",
    downloadBrochure: "Скачать буклет",
    noVillasFoundMessage: "По выбранным критериям объекты не найдены.",
    resetFiltersButton: "Сбросить все фильтры",
    cleaningFeeText: "Единоразовый сбор за уборку",

    // Events Page
    privateEventsHeader: "Частные мероприятия и торжества",
    privateEventsSubtitle: "Камерные свадьбы, праздники в саду, корпоративные ретриты и съемки в частных архитектурных резиденциях.",
    packageTierHeader: "Пакет",
    capacityHeader: "Вместимость",
    durationHeader: "Длительность",
    weekdayRateHeader: "Будние дни",
    weekendRateHeader: "Выходные дни",
    reserveButton: "Забронировать",
    overnightStayHeader: "ВАРИАНТ ПРОЖИВАНИЯ НА ВИЛЛЕ",
    roomConfigurationHeader: "Конфигурация номеров и тарифы (Versatile House)",
    roomConfigurationDesc: "Нужно дополнительное размещение для гостей свадьбы или ретрита? В Versatile House можно гибко открыть от 2 до 6 спален.",
    inquireWhatsApp: "Индивидуальный запрос в WhatsApp",

    // Owner Services Page
    passiveVillaIncome: "Пассивный доход от виллы. Ноль операционных забот.",
    ownerServicesHeroDesc: "Комплексное управление краткосрочной арендой элитных домов, вилл и бутик-апартаментов в Джакарте.",
    requestAuditButton: "Заказать бесплатный аудит дохода",
    compareModelsButton: "Сравнить модели тарифов",
    transparentFeeHeader: "Прозрачная структура комиссий",
    zeroFixedHeadline: "Ноль фиксированных затрат. Оплата за результат.",
    interactiveCalculatorTitle: "Калькулятор доходности",
    calculatorSubtitle: "Рассчитайте чистую прибыль владельца на основе ожидаемой валовой выручки",
    estimatedGrossRevenueLabel: "Ожидаемая валовая выручка",
    applyForModel: "Выбрать модель",

    // Concierge & WA
    conciergeOnline: "Консьерж на связи",
    conciergeResponseTime: "Обычно отвечает в течение 15 минут",
    chatWhatsApp: "Написать в WhatsApp",
  },
}

interface LocalizationContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  currentCurrencyConfig: CurrencyConfig
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  currentLanguageConfig: LanguageConfig
  formatPrice: (amountInIdr: number, customCurrency?: CurrencyCode) => string
  t: (key: string) => string
}

const LocalizationContext = createContext<LocalizationContextType | null>(null)

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("IDR")
  const [language, setLanguageState] = useState<LanguageCode>("EN")

  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("kinghouse_currency") as CurrencyCode
      if (savedCurrency && SUPPORTED_CURRENCIES.some((c) => c.code === savedCurrency)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrencyState(savedCurrency)
      }
      const savedLang = localStorage.getItem("kinghouse_language") as LanguageCode
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang)
      }
    } catch {
      // ignore SSR / storage access restrictions
    }
  }, [])

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c)
    trackCurrencyChange(c)
    try {
      localStorage.setItem("kinghouse_currency", c)
    } catch {}
  }

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l)
    trackLanguageChange(l)
    try {
      localStorage.setItem("kinghouse_language", l)
    } catch {}
  }


  const currentCurrencyConfig =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency) ?? SUPPORTED_CURRENCIES[0]

  const currentLanguageConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0]

  const formatPrice = (amountInIdr: number, customCurrency?: CurrencyCode): string => {
    const activeCurrencyCode = customCurrency ?? currency
    const activeConfig =
      SUPPORTED_CURRENCIES.find((c) => c.code === activeCurrencyCode) ?? SUPPORTED_CURRENCIES[0]

    const converted = amountInIdr * activeConfig.rateFromIdr

    if (activeConfig.code === "IDR") {
      return `Rp ${Math.round(converted).toLocaleString("id-ID")}`
    } else if (activeConfig.code === "USD") {
      return `$${Math.round(converted).toLocaleString("en-US")}`
    } else if (activeConfig.code === "EUR") {
      return `€${Math.round(converted).toLocaleString("de-DE")}`
    } else if (activeConfig.code === "CNY" || activeConfig.code === "JPY") {
      return `¥${Math.round(converted).toLocaleString("zh-CN")}`
    } else if (activeConfig.code === "TWD") {
      return `NT$ ${Math.round(converted).toLocaleString("zh-TW")}`
    } else if (activeConfig.code === "RUB") {
      return `₽ ${Math.round(converted).toLocaleString("ru-RU")}`
    } else if (activeConfig.code === "AUD") {
      return `A$ ${Math.round(converted).toLocaleString("en-AU")}`
    } else if (activeConfig.code === "SGD") {
      return `S$ ${Math.round(converted).toLocaleString("en-SG")}`
    } else if (activeConfig.code === "GBP") {
      return `£${Math.round(converted).toLocaleString("en-GB")}`
    }

    return `${activeConfig.symbol} ${Math.round(converted).toLocaleString()}`
  }

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language]
    if (langDict && langDict[key]) {
      return langDict[key]
    }
    // Fallback to English
    return TRANSLATIONS.EN[key] ?? key
  }

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        setCurrency,
        currentCurrencyConfig,
        language,
        setLanguage,
        currentLanguageConfig,
        formatPrice,
        t,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization() {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider")
  }
  return context
}
