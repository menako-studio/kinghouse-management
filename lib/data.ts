import { Villa, Testimonial, ManagementTier, CaseStudy, VillaEvent } from "./types"

// ─── REAL MANAGED PROPERTIES (Jabodetabek) ───────────────────────────────────
// Source: https://www.airbnb.com/users/profile/1470743715397835749

export const CURATED_VILLAS: Villa[] = [
  {
    id: "villa-1",
    name: "Versatile House With Beautiful Garden Beyond",
    tagline: "Spacious 12-guest home with lush private garden in quiet South Jakarta",
    slug: "versatile-house-jagakarsa",
    area: "Jagakarsa",
    areaSlug: "jagakarsa",
    location: "Jagakarsa, Jakarta Selatan",
    propertyType: "entire-home",
    airbnbUrl: "https://www.airbnb.com/rooms/45834267",
    airbnbIcalUrl:
      process.env.AIRBNB_ICAL_VERSATILE_STAY ||
      "https://www.airbnb.com/calendar/ical/45834267.ics?t=79bf0763f91b42bab99d46765c2bc64b",
    airbnbEventUrl: "https://www.airbnb.com/rooms/1172798010727828525",
    airbnbEventIcalUrl:
      process.env.AIRBNB_ICAL_VERSATILE_EVENTS ||
      "https://www.airbnb.com/calendar/ical/1172798010727828525.ics?t=9688f0b50b1d4ddc9ab128b33cfc1e44",
    agodaUrl: "https://www.agoda.com/versatile-house-with-beautiful-garden-beyond-h88935814/hotel/jakarta-id.html",
    superhost: false,
    guestFavorite: false,
    rating: 4.9,
    reviewsCount: 68,
    price: {
      usd: 120,
      idr: 1900000,
      cleaningFeeIdr: 350000,
      serviceFeePercent: 14,
    },
    stayConfigurations: [
      {
        bedrooms: 2,
        maxGuests: 4,
        weekdayPriceIdr: 1900000,
        weekendPriceIdr: 2490000,
        peakSeasonPriceIdr: 3500000,
        extraGuestPriceIdr: 300000,
      },
      {
        bedrooms: 3,
        maxGuests: 6,
        weekdayPriceIdr: 2600000,
        weekendPriceIdr: 3490000,
        peakSeasonPriceIdr: 4750000,
        extraGuestPriceIdr: 300000,
      },
      {
        bedrooms: 4,
        maxGuests: 8,
        weekdayPriceIdr: 3300000,
        weekendPriceIdr: 4490000,
        peakSeasonPriceIdr: 5990000,
        extraGuestPriceIdr: 300000,
      },
      {
        bedrooms: 5,
        maxGuests: 10,
        weekdayPriceIdr: 4000000,
        weekendPriceIdr: 5490000,
        peakSeasonPriceIdr: 6990000,
        extraGuestPriceIdr: 300000,
      },
      {
        bedrooms: 6,
        maxGuests: 12,
        weekdayPriceIdr: 4700000,
        weekendPriceIdr: 6490000,
        peakSeasonPriceIdr: 8990000,
        extraGuestPriceIdr: 300000,
      },
    ],
    capacity: {
      guests: 12,
      bedrooms: 5,
      beds: 9,
      bathrooms: 3,
    },
    heroImage:
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    gallery: [
      {
        url: "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
        caption: "Lush private garden, sparkling swimming pool and tropical modern architecture in Jagakarsa",
        category: "pool",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_02_Living_Hall.jpg",
        caption: "Grand double-height open living hall with soaring ceiling and direct pool terrace access",
        category: "living",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_03_Master_Bedroom.jpg",
        caption: "Master bedroom retreat with king bed, hotel-grade linens, and panoramic garden views",
        category: "bedroom",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_04_Patio_Terrace.jpg",
        caption: "Covered outdoor patio terrace for alfresco dining and garden relaxation",
        category: "garden",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_05_Master_Bathroom.jpg",
        caption: "Luxury en-suite master bathroom with deep soaking bathtub overlooking private greenery",
        category: "bathroom",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_06_Dining_Chandelier.jpg",
        caption: "Formal dining hall crowned by an opulent designer crystal chandelier for group banquets",
        category: "dining",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_07_Kitchen.jpg",
        caption: "Fully equipped gourmet kitchen with prep island, gas range, refrigerator, and coffee station",
        category: "kitchen",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_08_Media_Lounge.jpg",
        caption: "Cozy entertainment media lounge with plush seating and 4K Smart TV",
        category: "living",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_09_Zen_Courtyard.jpg",
        caption: "Tranquil zen courtyard garden corridor providing natural light and tropical cross-ventilation",
        category: "garden",
      },
      {
        url: "/properties/versatile-house/new/VersatileHouse_10_Twin_Bedroom.jpg",
        caption: "Second guest bedroom with comfortable twin bedding and tranquil courtyard views",
        category: "bedroom",
      },
      {
        url: "/properties/versatile-house/new/gate.jpg",
        caption: "Private gated entrance, spacious multi-car parking court, and tropical facade",
        category: "exterior",
      },
    ],
    editorialDescription: {
      lead: "A generous family home nestled in Jagakarsa's leafy, low-traffic residential enclave. Built for togetherness — with a private 500m² garden, swimming pool, social kitchen, and customizable bedroom configurations from 2 to 6 bedrooms (up to 12 guests).",
      architecturalHighlights:
        "The property is designed around a central garden courtyard that acts as a natural air corridor, keeping the interior cool without heavy reliance on air conditioning. Generous ceiling heights and large jalousie windows flood every room with filtered natural light.",
      theSpace:
        "Flexible configuration from 2 to 6 comfortable bedrooms sleeping up to 12 guests, served by 3 full bathrooms. The fully equipped kitchen features a gas range, refrigerator, and ample counter space — ideal for preparing meals for the entire group. The garden beyond the living area is private, fenced, and has space for outdoor seating, swimming pool, and events.",
    },
    amenities: [
      { name: "Private Garden (500m²)", category: "outdoor", icon: "Leaf" },
      { name: "Private Swimming Pool", category: "outdoor", icon: "Waves" },
      { name: "High-Speed WiFi", category: "essentials", icon: "Wifi" },
      { name: "Air Conditioning (all rooms)", category: "essentials", icon: "Wind" },
      { name: "Fully Equipped Kitchen", category: "essentials", icon: "UtensilsCrossed" },
      { name: "Washing Machine", category: "essentials", icon: "Sparkles" },
      { name: "Smart TV / Streaming", category: "essentials", icon: "Tv" },
      { name: "24/7 WhatsApp Support", category: "services", icon: "MessageSquare" },
      { name: "Self Check-in (Keybox)", category: "services", icon: "Key" },
      { name: "Free Parking (4 cars)", category: "essentials", icon: "Car" },
    ],
    nearbySpots: [
      { name: "Cinere Mall", category: "mall", distance: "3.5 km", travelTime: "10 min drive" },
      { name: "Fatmawati MRT Station", category: "transport", distance: "5 km", travelTime: "15 min drive" },
      { name: "Lotte Mart Depok", category: "mall", distance: "4 km", travelTime: "12 min drive" },
      { name: "Soekarno-Hatta Airport", category: "airport", distance: "35 km", travelTime: "55 min drive" },
    ],
    houseRules: [
      "Pets: Pets are not allowed. Service animals accommodated as required by Airbnb policy.",
      "Events: Events are not allowed for standard overnight stays (separate event rates apply).",
      "Smoking: Smoking, vaping, and e-cigarettes are not allowed indoors (outdoor smoking in garden/gazebo only).",
      "Quiet Hours: 10:00 PM – 6:00 AM.",
      "Commercial Photography & Filming: Commercial photography and filming are not allowed without prior agreement.",
      "Maximum Overnight Guests: Maximum 12 guests for overnight stays (2 guests per bedroom).",
      "Check-in & Check-out: Check-in 3:00 PM (Flexible) • Check-out before 12:00 PM (Early Check-in / Late Check-out: Rp950,000).",
      "Additional Policies: Property surveys or site visits are not permitted prior to booking. All communication must be via Airbnb messaging.",
    ],
    featured: true,
    architecturalStyle: "Modern Tropical",
    seoMeta: {
      metaTitle: "Versatile House With Garden — Jagakarsa | Kinghouse",
      metaDescription:
        "Spacious 5BR luxury villa in Jagakarsa for up to 12 guests with private garden & pool. Book via Airbnb, Agoda, or Direct WhatsApp with perks.",
      focusKeyword: "rumah sewa jagakarsa jakarta selatan",
      ogImage:
        "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    },
  },
  {
    id: "villa-2",
    name: "Sky House • Hotel-Style Bed + IKEA 5min",
    tagline: "Premium hotel-feel room in the heart of Tangerang — just 5 minutes from IKEA",
    slug: "sky-house-tangerang",
    area: "Tangerang",
    areaSlug: "tangerang",
    location: "Pinang, Tangerang, Banten",
    propertyType: "private-room",
    airbnbUrl: "https://www.airbnb.com/rooms/1325106294978348497",
    airbnbIcalUrl:
      process.env.AIRBNB_ICAL_SKYHOUSE_TANGERANG ||
      "https://www.airbnb.com/calendar/ical/1325106294978348497.ics?t=2588041978df48fc81d21dbf1d690cee",
    agodaUrl: "https://www.agoda.com/sky-house-hotel-style-bed-ikea-5min/hotel/tangerang-id.html",
    superhost: false,
    guestFavorite: false,
    rating: 4.91,
    reviewsCount: 22,
    price: {
      usd: 19,
      idr: 299000,
      cleaningFeeIdr: 75000,
      serviceFeePercent: 14,
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    heroImage:
      "/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg",
    gallery: [
      {
        url: "/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg",
        caption: "Hotel-grade queen bed with Scandinavian styling, fresh linens, and warm natural lighting",
        category: "bedroom",
      },
      {
        url: "/properties/sky-house/SkyHouse_IKEA_Dapur.webp",
        caption: "Modern IKEA-equipped shared kitchenette and pantry area",
        category: "kitchen",
      },
      {
        url: "/properties/sky-house/SkyHouse_Fasilitas_Gym.jpeg",
        caption: "Full resident fitness gym facilities with cardio equipment and weights",
        category: "exterior",
      },
      {
        url: "/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg",
        caption: "Minimalist Scandinavian bedroom setup with ergonomic work corner",
        category: "living",
      },
      {
        url: "/properties/sky-house/SkyHouse_IKEA_Dapur.webp",
        caption: "Clean, functional dining and coffee preparation counter",
        category: "living",
      },
    ],
    editorialDescription: {
      lead: "A meticulously curated private room in Pinang, Tangerang — designed to feel like a boutique hotel stay at a fraction of the cost. Walking distance from IKEA Alam Sutera, perfect for business travelers and design lovers.",
      architecturalHighlights:
        "The room draws from Scandinavian minimalism: crisp white walls, warm-toned IKEA furniture, and layered warm lighting that creates a calm, hotel-like atmosphere. Every piece has been selected for both function and aesthetic harmony.",
      theSpace:
        "Your private room includes a premium queen-size bed with hotel-grade linens, a dedicated work desk, fast WiFi, and an en-suite bathroom with hot water and full toiletry set. Air conditioning keeps the room at a comfortable temperature year-round.",
    },
    amenities: [
      { name: "Hotel-Grade Queen Bed", category: "luxury", icon: "Bed" },
      { name: "High-Speed WiFi (100 Mbps)", category: "essentials", icon: "Wifi" },
      { name: "Air Conditioning", category: "essentials", icon: "Wind" },
      { name: "En-Suite Hot Shower", category: "essentials", icon: "Droplets" },
      { name: "Work Desk & Chair", category: "essentials", icon: "Monitor" },
      { name: "Smart TV / Netflix", category: "luxury", icon: "Tv" },
      { name: "Self Check-in", category: "services", icon: "Key" },
      { name: "Daily Linen Change", category: "services", icon: "Sparkles" },
    ],
    nearbySpots: [
      { name: "IKEA Alam Sutera", category: "mall", distance: "1.2 km", travelTime: "5 min drive" },
      { name: "Alam Sutera Mall", category: "mall", distance: "1.5 km", travelTime: "7 min drive" },
      { name: "BSD City", category: "landmark", distance: "8 km", travelTime: "20 min drive" },
      { name: "Soekarno-Hatta Airport", category: "airport", distance: "18 km", travelTime: "30 min drive" },
    ],
    houseRules: [
      "No smoking inside the room or indoor area.",
      "No pets allowed.",
      "Please flush the toilet after use.",
      "Please switch off all electricity points and AC when not in use.",
      "Please keep the room clean, tidy, and hygienic.",
      "Please do not make any noise pollution (respect quiet hours).",
      "Please keep the items back after usage.",
      "Any material damage by the guest will be charged.",
      "Please do not eat or drink on the bed (bedding stains subject to cleaning fee).",
      "Check-out: before 12:00 PM (turn off utilities, leave key & card on table, lock doors).",
    ],
    featured: true,
    architecturalStyle: "Scandinavian Minimalist",
    seoMeta: {
      metaTitle: "Sky House Tangerang — 5min to IKEA Alam Sutera | Kinghouse",
      metaDescription:
        "Boutique hotel-style room in Pinang, Tangerang, 5 min from IKEA Alam Sutera. Fast WiFi, AC, en-suite bathroom. Book on Airbnb or Direct.",
      focusKeyword: "sewa kamar tangerang dekat ikea alam sutera",
      ogImage:
        "/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg",
    },
  },

  {
    id: "villa-4",
    name: "Skyline Luxury at Orange County",
    tagline: "Executive apartment with skyline view inside Cikarang's premium Orange County complex",
    slug: "skyline-luxury-orange-county-cikarang",
    area: "Cikarang",
    areaSlug: "cikarang",
    location: "Cikarang Selatan, Bekasi",
    propertyType: "entire-apartment",
    airbnbUrl: "https://www.airbnb.com/rooms/1691723711820833674",
    airbnbIcalUrl:
      process.env.AIRBNB_ICAL_SKYLINE_CIKARANG ||
      "https://www.airbnb.com/calendar/ical/1691723711820833674.ics?t=e3300f11899546bebe679aa7570e8f5d",
    agodaUrl: "https://www.agoda.com/skyline-luxury-at-orange-county/hotel/cikarang-id.html",
    superhost: false,
    guestFavorite: false,
    rating: 4.83,
    reviewsCount: 6,
    price: {
      usd: 29,
      idr: 450000,
      cleaningFeeIdr: 100000,
      serviceFeePercent: 14,
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    heroImage:
      "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
    gallery: [
      {
        url: "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
        caption: "Executive master bedroom suite with plush bedding and designer accent wall",
        category: "bedroom",
      },
      {
        url: "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_Kitchenette.webp",
        caption: "Sleek modern kitchenette equipped with microwave, induction stove and refrigerator",
        category: "kitchen",
      },
      {
        url: "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_FasilitasGym.webp",
        caption: "Exclusive resident fitness center and gymnasium inside Orange County complex",
        category: "exterior",
      },
      {
        url: "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_PemandanganView.jpeg",
        caption: "Panoramic skyline view from the high-floor Orange County luxury apartment balcony",
        category: "exterior",
      },
      {
        url: "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
        caption: "Hotel-grade comfort with blackout curtains and centralized climate control",
        category: "living",
      },
    ],
    editorialDescription: {
      lead: "A premium executive apartment inside the prestigious Orange County Cikarang complex — Indonesia's most sought-after expat industrial township. Ideal for professionals and executives working in the Jababeka, EJIP, or MM2100 industrial zones.",
      architecturalHighlights:
        "Orange County's signature architecture delivers a Southern California-inspired aesthetic with high ceilings, resort-style podium amenities, and sweeping industrial skyline views from upper floors.",
      theSpace:
        "Your executive apartment includes a plush bedroom with blackout curtains, a modern living area with smart TV, a well-appointed kitchenette with Nespresso, and a sleek rain-shower bathroom. Access to Orange County's pool, gym, and retail facilities is included.",
    },
    amenities: [
      { name: "Skyline City View", category: "luxury", icon: "Building" },
      { name: "Resort Pool Access", category: "outdoor", icon: "Waves" },
      { name: "Gym Access", category: "luxury", icon: "Dumbbell" },
      { name: "High-Speed WiFi (100 Mbps)", category: "essentials", icon: "Wifi" },
      { name: "Air Conditioning (Smart)", category: "essentials", icon: "Wind" },
      { name: "Nespresso Machine", category: "luxury", icon: "Coffee" },
      { name: "Rain Shower + Toiletries", category: "luxury", icon: "Droplets" },
      { name: "Smart TV / Netflix", category: "luxury", icon: "Tv" },
      { name: "24-Hour Building Security", category: "services", icon: "ShieldCheck" },
      { name: "Basement Parking", category: "essentials", icon: "Car" },
    ],
    nearbySpots: [
      { name: "Jababeka Industrial Estate", category: "landmark", distance: "5 km", travelTime: "12 min drive" },
      { name: "EJIP Industrial Park", category: "landmark", distance: "3 km", travelTime: "8 min drive" },
      { name: "MM2100 Industrial Town", category: "landmark", distance: "8 km", travelTime: "18 min drive" },
      { name: "Halim Perdanakusuma Airport", category: "airport", distance: "35 km", travelTime: "50 min drive" },
    ],
    houseRules: [
      "No smoking 🚭 (Strictly prohibited inside the unit).",
      "No pets allowed.",
      "No parties or commercial use.",
      "Do not rearrange the furniture.",
      "Please keep the noise down and respect the neighbors 🙏.",
      "Electrical Safety: Please do not use high-power appliances (stove, hair dryer, kettle) simultaneously; kindly use them one at a time.",
      "Trash Disposal: Dispose of garbage in the KWH room (nearby the lift).",
      "Delivery: Package deliveries can be picked up at security in front of lobby (Unit N0510).",
      "Check-in: 3:00 PM • Check-out: 12:00 PM.",
    ],
    featured: true,
    architecturalStyle: "Contemporary Executive",
    seoMeta: {
      metaTitle: "Skyline Luxury — Orange County Cikarang | Kinghouse",
      metaDescription:
        "Executive apartment with skyline view in Orange County, Cikarang. Ideal for expat professionals near EJIP & Jababeka. Managed by Kinghouse.",
      focusKeyword: "apartemen orange county cikarang expat airbnb",
      ogImage:
        "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_PemandanganView.jpeg",
    },
  },
    {
    id: "villa-3",
    name: "Bright & Airy Apartment",
    tagline: "Central Jakarta West apartment filled with natural light and urban convenience",
    slug: "bright-airy-apartment-palmerah",
    area: "Palmerah",
    areaSlug: "palmerah",
    location: "Palmerah, Jakarta Barat",
    propertyType: "entire-apartment",
    airbnbUrl: "https://www.airbnb.com/rooms/1444158185166882045",
    superhost: false,
    guestFavorite: false,
    rating: 0,
    reviewsCount: 0,
    price: {
      usd: 18,
      idr: 280000,
      cleaningFeeIdr: 75000,
      serviceFeePercent: 14,
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    heroImage:
      "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
    gallery: [
      {
        url: "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
        caption: "Sun-drenched master bedroom with wide city-view windows and queen hotel bed",
        category: "bedroom",
      },
      {
        url: "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide-2.webp",
        caption: "Comfortable bedroom lounge perspective featuring natural lighting and clean layout",
        category: "bedroom",
      },
      {
        url: "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
        caption: "Crisp white minimalist room aesthetic tailored for remote work and short-stay comfort",
        category: "living",
      },
      {
        url: "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide-2.webp",
        caption: "Warm afternoon natural light across the bedroom suite",
        category: "living",
      },
      {
        url: "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
        caption: "Air-conditioned modern suite in central Palmerah Jakarta Barat",
        category: "exterior",
      },
    ],
    editorialDescription: {
      lead: "A bright, cheerful apartment in the strategic Palmerah district of West Jakarta — minutes from Palmerah Station, Senayan, and major business corridors. New listing with first-class Kinghouse hospitality standards.",
      architecturalHighlights:
        "The apartment maximizes its floor-to-ceiling windows to flood the interior with morning light, creating an energizing environment ideal for professionals working remotely or short business stays in the capital.",
      theSpace:
        "A complete entire apartment for two: cosy bedroom with fresh hotel linen, bright living-dining area, a kitchenette with refrigerator and cooking equipment, and a clean bathroom with hot water. Air conditioning and fast WiFi throughout.",
    },
    amenities: [
      { name: "Entire Private Apartment", category: "essentials", icon: "Home" },
      { name: "High-Speed WiFi", category: "essentials", icon: "Wifi" },
      { name: "Air Conditioning", category: "essentials", icon: "Wind" },
      { name: "Kitchenette", category: "essentials", icon: "UtensilsCrossed" },
      { name: "Hot Water Shower", category: "essentials", icon: "Droplets" },
      { name: "Smart TV", category: "luxury", icon: "Tv" },
      { name: "Self Check-in", category: "services", icon: "Key" },
      { name: "Free Street Parking", category: "essentials", icon: "Car" },
    ],
    nearbySpots: [
      { name: "Palmerah Station (KRL)", category: "transport", distance: "800 m", travelTime: "10 min walk" },
      { name: "Senayan City Mall", category: "mall", distance: "3 km", travelTime: "10 min drive" },
      { name: "Grand Indonesia", category: "mall", distance: "5 km", travelTime: "15 min drive" },
      { name: "Soekarno-Hatta Airport", category: "airport", distance: "30 km", travelTime: "50 min drive" },
    ],
    houseRules: [
      "No smoking inside the unit.",
      "No pets allowed.",
      "No parties or unauthorized external guests.",
      "Keep kitchen clean & dispose garbage in shaft room.",
      "Quiet hours: Harap menjaga ketenangan setelah pukul 22:00 WIB.",
      "Check-in: 3:00 PM • Check-out: 12:00 PM.",
    ],
    featured: false,
    architecturalStyle: "Urban Contemporary",
    seoMeta: {
      metaTitle: "Bright & Airy Apartment Palmerah Jakarta Barat | Kinghouse",
      metaDescription:
        "Modern 1BR apartment in Palmerah, West Jakarta, 10 min to KRL station & Senayan. Bright interior, full kitchenette, fast WiFi for 2 guests.",
      focusKeyword: "sewa apartemen palmerah jakarta barat airbnb",
      ogImage:
        "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
    },
  },
]

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    type: "owner",
    author: "Budi Santoso",
    roleOrLocation: "Owner, Versatile House Jagakarsa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "Kinghouse transformed our family home in Jagakarsa into a steady income stream. From zero bookings to 80%+ occupancy in 3 months — their Airbnb SEO and listing optimization is genuinely impressive.",
    propertyName: "Versatile House With Beautiful Garden Beyond",
    metricLift: "+80% Occupancy in 90 Days",
  },
  {
    id: "test-2",
    type: "guest",
    author: "David Lim",
    roleOrLocation: "Operations Manager, Singapore (Business Travel)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "Stayed at the Orange County apartment for 2 weeks while overseeing our Jababeka plant. The location is perfect, the apartment felt like a hotel suite, and Kinghouse's WhatsApp support was instant. Will rebook.",
    propertyName: "Skyline Luxury at Orange County",
  },
  {
    id: "test-3",
    type: "owner",
    author: "Sari Wijaya",
    roleOrLocation: "Owner, Sky House Tangerang",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "I was skeptical at first, but the team's photography and copywriting completely changed how guests perceive our humble room. Rating jumped from 4.6 to 4.9 and bookings are now fully automated.",
    propertyName: "Sky House • Hotel-Style Bed + IKEA 5min",
    metricLift: "4.6 → 4.9 Rating",
  },
  {
    id: "test-4",
    type: "guest",
    author: "Ayu Pramesti",
    roleOrLocation: "Marketing Director, Jakarta",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    rating: 5,
    quote:
      "Booked the Jagakarsa house for our team offsite — 10 colleagues, 5 days. The garden was perfect for morning sessions, the kitchen handled our catering, and the house was spotless on arrival. Effortless.",
    propertyName: "Versatile House With Beautiful Garden Beyond",
  },
]

// ─── MANAGEMENT TIERS ─────────────────────────────────────────────────────────

export const MANAGEMENT_TIERS: ManagementTier[] = [
  {
    id: "exclusive-marketing",
    name: "Exclusive Marketing",
    subtitle: "High-yield Airbnb distribution & revenue optimization for self-operating owners",
    feePercentage: 15,
    feeNote: "of gross rental revenue (performance-based)",
    description:
      "Designed for property owners who handle their own cleaning and operations, but want Kinghouse's Airbnb SEO expertise, dynamic pricing, and professional listing management to maximize bookings.",
    idealFor: "Owners with existing cleaning support who want maximum Airbnb revenue without full management.",
    popular: false,
    features: [
      { title: "Professional photography & editorial listing copy", included: true, highlight: true },
      { title: "Airbnb SEO optimization (title, description, keywords)", included: true, highlight: true },
      { title: "Real-time dynamic pricing & competitor analysis", included: true },
      { title: "24/7 multilingual guest communication & vetting", included: true },
      { title: "Automated payment processing & damage protection", included: true },
      { title: "Monthly revenue & occupancy reporting dashboard", included: true },
      { title: "Turnkey housekeeping & linen management", included: false },
      { title: "Preventive maintenance coordination", included: false },
      { title: "Dedicated on-site check-in host", included: false },
      { title: "Guest concierge & local recommendations service", included: false },
    ],
  },
  {
    id: "full-management",
    name: "Full Asset Management",
    subtitle: "Completely hands-off, 360° turnkey operations for maximum ROI",
    feePercentage: 20,
    feeNote: "of gross rental revenue (zero-effort, fully managed)",
    badge: "Most Popular",
    description:
      "Our complete management model — we handle everything from Airbnb listing to guest checkout, cleaning coordination, maintenance, and monthly financial reporting. You receive passive income without lifting a finger.",
    idealFor: "Busy professionals and investors who want true passive income from their Jabodetabek property.",
    popular: true,
    features: [
      { title: "Professional photography & editorial listing copy", included: true, highlight: true },
      { title: "Airbnb SEO optimization (title, description, keywords)", included: true, highlight: true },
      { title: "Real-time dynamic pricing & competitor analysis", included: true },
      { title: "24/7 multilingual guest communication & vetting", included: true },
      { title: "Automated payment processing & damage protection", included: true },
      { title: "Monthly revenue & occupancy reporting dashboard", included: true },
      { title: "Turnkey housekeeping & fresh linen for every guest", included: true, highlight: true },
      { title: "Preventive maintenance & rapid repair coordination", included: true, highlight: true },
      { title: "Dedicated check-in coordination & key management", included: true, highlight: true },
      { title: "Guest concierge & local recommendations service", included: true, highlight: true },
    ],
  },
]

// ─── CASE STUDIES ─────────────────────────────────────────────────────────────

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-1",
    propertyName: "Versatile House With Beautiful Garden Beyond",
    location: "Jagakarsa, Jakarta Selatan",
    image:
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    period: "90-Day Onboarding Performance",
    beforeMetrics: {
      occupancyRate: 28,
      monthlyRevenueIdr: 12000000,
      guestRating: 4.5,
    },
    afterMetrics: {
      occupancyRate: 82,
      monthlyRevenueIdr: 38000000,
      guestRating: 4.9,
      ebitdaMargin: 44,
    },
    summary:
      "Repositioned from an under-priced family home listing to a sought-after Jagakarsa group stay destination. Editorial photography, keyword-optimized copy, and dynamic weekend pricing tripled monthly revenue in 90 days.",
    quote: {
      text: "I had no idea our house could earn this much. Kinghouse basically turned a burden into a business.",
      author: "Budi Santoso (Owner)",
    },
  },
  {
    id: "cs-2",
    propertyName: "Skyline Luxury at Orange County",
    location: "Cikarang Selatan, Bekasi",
    image:
      "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
    period: "6-Month Revenue Review",
    beforeMetrics: {
      occupancyRate: 35,
      monthlyRevenueIdr: 8000000,
      guestRating: 4.6,
    },
    afterMetrics: {
      occupancyRate: 78,
      monthlyRevenueIdr: 22000000,
      guestRating: 4.83,
      ebitdaMargin: 41,
    },
    summary:
      "Targeted the high-demand expat-executive segment working in Cikarang's industrial zones. Premium positioning, Nespresso amenity add, and direct Jababeka/EJIP corporate keyword targeting doubled occupancy.",
    quote: {
      text: "The apartment now pays its own mortgage — and then some. The ROI has been remarkable.",
      author: "Property Owner, Cikarang",
    },
  },
]

// ─── TRUST PARTNERS ───────────────────────────────────────────────────────────

// `live: false` partners are not shown on the site; flip to true once the channel is active.
// Badge copy is translated via the `badgeKey` entries in localization-context.
export const TRUST_PARTNERS = [
  { name: "Airbnb", badgeKey: "partnerBadgeManagedHost", logoText: "Airbnb", live: true },
  { name: "Booking.com", badgeKey: "partnerBadgeComingSoon", logoText: "Booking.com", live: false },
  { name: "Agoda", badgeKey: "partnerBadgeComingSoon", logoText: "Agoda", live: false },
  { name: "Google", badgeKey: "partnerBadgeVerifiedBusiness", logoText: "Google", live: true },
  { name: "WhatsApp Business", badgeKey: "partnerBadgeVerifiedBusiness", logoText: "WhatsApp", live: true },
]

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────
// Blog content lives in lib/blog/posts.ts (split out for easier maintenance).
export { BLOG_POSTS } from "@/lib/blog/posts"


// ─── EVENTS & WEDDINGS ────────────────────────────────────────────────────────

export interface EventPricelistTier {
  category: "half-day" | "full-day" | "full-board"
  categoryLabel: string
  durationText: string
  description: string
  overnightStayMax?: number
  tiers: {
    name: string
    pax: number
    duration: string
    weekdayPriceIdr: number
    weekendPriceIdr: number
    highlights?: string[]
  }[]
}

export const VERSATILE_HOUSE_EVENT_PRICELIST: EventPricelistTier[] = [
  {
    category: "half-day",
    categoryLabel: "Half Day",
    durationText: "6 Hours",
    description: "Ideal for intimate akad ceremonies, morning/afternoon team workshops, or birthday gatherings.",
    tiers: [
      {
        name: "Small Gathering",
        pax: 20,
        duration: "6 Hours",
        weekdayPriceIdr: 2800000,
        weekendPriceIdr: 3800000,
      },
      {
        name: "Medium Gathering",
        pax: 30,
        duration: "6 Hours",
        weekdayPriceIdr: 3500000,
        weekendPriceIdr: 4800000,
      },
      {
        name: "Large Gathering",
        pax: 40,
        duration: "6 Hours",
        weekdayPriceIdr: 4200000,
        weekendPriceIdr: 5800000,
      },
      {
        name: "Corporate event",
        pax: 50,
        duration: "6 Hours",
        weekdayPriceIdr: 4900000,
        weekendPriceIdr: 6800000,
      },
    ],
  },
  {
    category: "full-day",
    categoryLabel: "Full Day",
    durationText: "12 Hours",
    description: "Full day access for comprehensive wedding receptions, all-day offsite retreats, and milestone celebrations.",
    tiers: [
      {
        name: "Small Gathering",
        pax: 20,
        duration: "12 Hours",
        weekdayPriceIdr: 4000000,
        weekendPriceIdr: 5400000,
      },
      {
        name: "Medium Gathering",
        pax: 30,
        duration: "12 Hours",
        weekdayPriceIdr: 5000000,
        weekendPriceIdr: 6400000,
      },
      {
        name: "Large Gathering",
        pax: 40,
        duration: "12 Hours",
        weekdayPriceIdr: 6000000,
        weekendPriceIdr: 7400000,
      },
      {
        name: "Corporate event",
        pax: 50,
        duration: "12 Hours",
        weekdayPriceIdr: 7000000,
        weekendPriceIdr: 8400000,
      },
    ],
  },
  {
    category: "full-board",
    categoryLabel: "Full Board (Overnight Stay)",
    durationText: "Event + Max 15 Pax Overnight Stay",
    overnightStayMax: 15,
    description: "The complete luxury experience: full event venue access during the day plus overnight stay for up to 15 guests in the private villa.",
    tiers: [
      {
        name: "Small Gathering",
        pax: 20,
        duration: "Event + 15 Pax Stay",
        weekdayPriceIdr: 5600000,
        weekendPriceIdr: 6600000,
      },
      {
        name: "Medium Gathering",
        pax: 30,
        duration: "Event + 15 Pax Stay",
        weekdayPriceIdr: 6600000,
        weekendPriceIdr: 7400000,
      },
      {
        name: "Large Gathering",
        pax: 40,
        duration: "Event + 15 Pax Stay",
        weekdayPriceIdr: 7600000,
        weekendPriceIdr: 8400000,
      },
      {
        name: "Corporate event",
        pax: 50,
        duration: "Event + 15 Pax Stay",
        weekdayPriceIdr: 8400000,
        weekendPriceIdr: 9800000,
      },
    ],
  },
]

export const VILLA_EVENTS: VillaEvent[] = [
  {
    id: "event-1",
    propertyId: "villa-1",
    propertySlug: "versatile-house-jagakarsa",
    propertyName: "Versatile House With Beautiful Garden Beyond",
    title: "Private Garden Wedding & Intimate Celebration",
    slug: "garden-wedding-jagakarsa",
    category: "wedding",
    tagline: "An intimate garden wedding in the heart of South Jakarta's greenest enclave",
    description:
      "The lush 500m² private garden of our Jagakarsa property creates a magical backdrop for intimate weddings and akad nikah ceremonies. Surrounded by tropical greenery, swimming pool, and space for up to 50 seated guests, this is South Jakarta's best-kept secret for a private garden-style celebration. No vendor corkage fee — book the entire residence and garden exclusively.",
    maxCapacity: 50,
    heroImage:
      "/properties/versatile-house/events/portfolio/ceremony-lawn-altar.jpg",
    gallery: [
      "/properties/versatile-house/events/portfolio/ceremony-lawn-altar.jpg",
      "/properties/versatile-house/events/portfolio/twilight-dinner-reception.jpg",
      "/properties/versatile-house/events/portfolio/bridal-suite-prep.jpg",
      "/properties/versatile-house/events/portfolio/blessing-ceremony-terrace.jpg",
      "/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg",
      "/properties/versatile-house/events/evening-garden-party-banquet.jpg",
      "/properties/versatile-house/events/cocktail-reception-terrace-lounge.jpg",
      "/properties/versatile-house/new/VersatileHouse_06_Dining_Chandelier.jpg",
    ],
    packages: [
      {
        name: "Half Day Garden Celebration (6 Hours)",
        description: "Perfect for akad nikah or intimate morning/evening ceremony (20 - 50 Pax)",
        packageType: "half-day",
        pax: 30,
        durationHours: 6,
        priceIdr: 2800000,
        weekendPriceIdr: 3800000,
        priceNote: "Starting from IDR 2,8 Jt (Weekday) / IDR 3,8 Jt (Weekend) for 20 Pax",
        includes: [
          "Exclusive full private garden (500m²) and living hall access",
          "6-Hour event duration with setup coordination window",
          "Outdoor lawn setup area with swimming pool ambiance",
          "Zero vendor markup & zero corkage fee (BYO caterer & decorator)",
          "Air-conditioned indoor preparation rooms for bridal party",
          "Parking area for up to 8 vehicles + security coordination",
        ],
      },
      {
        name: "Full Day Garden Wedding (12 Hours)",
        description: "Complete all-day wedding & reception experience for up to 50 guests",
        packageType: "full-day",
        pax: 50,
        durationHours: 12,
        priceIdr: 4000000,
        weekendPriceIdr: 5400000,
        priceNote: "Starting from IDR 4,0 Jt (Weekday) / IDR 5,4 Jt (Weekend) for 20 Pax (up to 50 Pax)",
        includes: [
          "Full 12-Hour property access for ceremony and evening reception",
          "Lush botanical garden lighting & indoor hall setup area",
          "Sound system & microphone coordination area",
          "Bridal suite & family preparation rooms",
          "Vendor coordination support (catering, MUA, photography)",
          "Zero vendor corkage fees",
          "Parking for 10+ vehicles with on-site staff assistance",
        ],
      },
      {
        name: "Full Board Wedding + Overnight Stay (15 Pax Stay)",
        description: "Event venue access + overnight villa stay for up to 15 family members",
        packageType: "full-board",
        pax: 50,
        durationHours: 24,
        priceIdr: 5600000,
        weekendPriceIdr: 6600000,
        priceNote: "Starting from IDR 5,6 Jt (Weekday) / IDR 6,6 Jt (Weekend) (20 Pax event + 15 Pax stay)",
        includes: [
          "Full property & event access + overnight accommodation for 15 guests",
          "5 to 6 private bedrooms with hotel-grade linens",
          "Swimming pool & private garden access throughout the stay",
          "Dedicated Kinghouse day-of coordination contact",
          "Kitchen facilities for family dining & morning coffee",
          "Zero corkage fee for outside catering",
          "Free parking for multiple vehicles",
        ],
      },
    ],
    highlights: [
      "Private 500m² tropical garden & swimming pool — zero shared space",
      "Tiered pricing: Half Day (6h), Full Day (12h), and Full Board with stay",
      "Air-conditioned indoor backup spaces for guests",
      "Overnight accommodation available for up to 15 pax",
      "Zero corkage fee for catering, decorators, and baristas",
      "15 minutes from Fatmawati MRT and close to TB Simatupang",
    ],
  },
  {
    id: "event-2",
    propertyId: "villa-1",
    propertySlug: "versatile-house-jagakarsa",
    propertyName: "Versatile House With Beautiful Garden Beyond",
    title: "Corporate Team Retreat & Offsite Workshop",
    slug: "corporate-retreat-jagakarsa",
    category: "corporate",
    tagline: "A focused, distraction-free offsite for your team in South Jakarta's green belt",
    description:
      "Escape the office without leaving the city. Our Jagakarsa home provides the ideal setting for team strategy sessions, quarterly reviews, and creative workshops — with dedicated indoor breakout zones, tropical garden lawn, high-speed WiFi, and overnight accommodation for up to 15 team members.",
    maxCapacity: 50,
    heroImage:
      "/properties/versatile-house/new/VersatileHouse_02_Living_Hall.jpg",
    gallery: [
      "/properties/versatile-house/new/VersatileHouse_02_Living_Hall.jpg",
      "/properties/versatile-house/events/cocktail-reception-terrace-lounge.jpg",
      "/properties/versatile-house/new/VersatileHouse_06_Dining_Chandelier.jpg",
      "/properties/versatile-house/new/VersatileHouse_08_Media_Lounge.jpg",
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    ],
    packages: [
      {
        name: "Half Day Team Workshop (6 Hours)",
        description: "Focused half-day strategy & workshop session for 20 - 50 participants",
        packageType: "half-day",
        pax: 30,
        durationHours: 6,
        priceIdr: 2800000,
        weekendPriceIdr: 3800000,
        priceNote: "Weekday: IDR 2,8 Jt (20 pax) to IDR 4,9 Jt (50 pax)",
        includes: [
          "Full property & meeting room access (6 hours)",
          "Indoor air-conditioned meeting area with natural lighting",
          "Garden breakout session areas around pool",
          "High-speed 100 Mbps WiFi",
          "Coffee & tea pantry setup",
          "Official corporate invoice & tax receipts provided",
        ],
      },
      {
        name: "Full Day Strategy Offsite (12 Hours)",
        description: "Comprehensive 12-hour offsite session with indoor presentation & outdoor activities",
        packageType: "full-day",
        pax: 50,
        durationHours: 12,
        priceIdr: 4000000,
        weekendPriceIdr: 5400000,
        priceNote: "Weekday: IDR 4,0 Jt (20 pax) to IDR 7,0 Jt (50 pax)",
        includes: [
          "Full day access (8:00 AM – 8:00 PM)",
          "Indoor plenary room + garden workshop breakout spaces",
          "Projector & sound system setup area",
          "Swimming pool access for team bonding activities",
          "BYO catering with fully equipped kitchen access",
          "Parking for up to 8 cars",
        ],
      },
      {
        name: "Full Board Residential Retreat (Overnight 15 Pax)",
        description: "2-Day immersive strategy offsite + overnight stay for up to 15 attendees",
        packageType: "full-board",
        pax: 50,
        durationHours: 24,
        priceIdr: 5600000,
        weekendPriceIdr: 6600000,
        priceNote: "Weekday: IDR 5,6 Jt (20 pax) to IDR 8,4 Jt (50 pax) including 15 pax overnight stay",
        includes: [
          "Overnight accommodation for up to 15 team members",
          "Private bedrooms with hotel bedding & AC",
          "Full 24-hour property usage (day sessions + evening barbecue)",
          "Swimming pool & lawn team building facilities",
          "Corporate invoice & seamless bank transfer checkout",
        ],
      },
    ],
    highlights: [
      "Quiet residential sanctuary with zero commercial distractions",
      "Flexible indoor air-conditioned hall & outdoor garden spaces",
      "Full kitchen for catering or private chef arrangements",
      "Sleep up to 15 participants on-site",
      "Official corporate invoicing and tax compliance supported",
    ],
  },
  {
    id: "event-3",
    propertyId: "villa-1",
    propertySlug: "versatile-house-jagakarsa",
    propertyName: "Versatile House With Beautiful Garden Beyond",
    title: "Birthday & Milestone Celebration Party",
    slug: "birthday-celebration-jagakarsa",
    category: "birthday",
    tagline: "Celebrate life's biggest moments in a private garden setting, your way",
    description:
      "Why rent an overcrowded venue when you can have an entire private home, pool, and garden for your party? Our Jagakarsa property is the perfect setting for milestone birthdays, graduation parties, family reunions, and bridal showers — with full indoor and outdoor flexibility and no corkage fees.",
    maxCapacity: 50,
    heroImage:
      "/properties/versatile-house/events/evening-garden-party-banquet.jpg",
    gallery: [
      "/properties/versatile-house/events/evening-garden-party-banquet.jpg",
      "/properties/versatile-house/events/cocktail-reception-terrace-lounge.jpg",
      "/properties/versatile-house/events/wedding-ceremony-lawn-pool.jpg",
      "/properties/versatile-house/new/VersatileHouse_04_Patio_Terrace.jpg",
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    ],
    packages: [
      {
        name: "Half Day Party (6 Hours)",
        description: "Private garden & poolside party for 20 - 50 guests (day or evening)",
        packageType: "half-day",
        pax: 30,
        durationHours: 6,
        priceIdr: 2800000,
        weekendPriceIdr: 3800000,
        priceNote: "Weekday: IDR 2,8 Jt – IDR 4,9 Jt | Weekend: IDR 3,8 Jt – IDR 6,8 Jt",
        includes: [
          "Full 500m² garden and indoor living lounge access (6 hours)",
          "Garden poolside seating area",
          "Bluetooth sound system setup",
          "Outdoor evening festoon lighting",
          "Dedicated parking & security coordinator",
        ],
      },
      {
        name: "Full Day Celebration (12 Hours)",
        description: "Extended all-day party with swimming pool, barbecue, and dining setup",
        packageType: "full-day",
        pax: 40,
        durationHours: 12,
        priceIdr: 4000000,
        weekendPriceIdr: 5400000,
        priceNote: "Weekday: IDR 4,0 Jt – IDR 6,0 Jt | Weekend: IDR 5,4 Jt – IDR 7,4 Jt",
        includes: [
          "12-hour property rental from noon till night",
          "Barbecue grill & kitchen access for family cooking",
          "Swimming pool access with poolside lounge",
          "Sound system & party decor setup area",
          "Zero corkage fee on catering, cakes, and drinks",
        ],
      },
      {
        name: "Full Board Sleepover Party (Overnight 15 Pax)",
        description: "All-day party + sleepover for inner circle and family (up to 15 guests)",
        packageType: "full-board",
        pax: 40,
        durationHours: 24,
        priceIdr: 5600000,
        weekendPriceIdr: 6600000,
        priceNote: "Weekday: IDR 5,6 Jt – IDR 7,6 Jt | Weekend: IDR 6,6 Jt – IDR 8,4 Jt",
        includes: [
          "Full property access with 15-person overnight stay",
          "Private bedrooms with fresh hotel linens & amenities",
          "Swimming pool and garden open day and night",
          "Self-catering or outside catering with no penalty",
          "Late checkout flexibility upon request",
        ],
      },
    ],
    highlights: [
      "100% Private — no strangers sharing your venue",
      "Zero corkage fees on outside catering, cakes, and mocktails",
      "BYO decorator or work with our vetted event partners",
      "Poolside & garden combined capacity up to 50 pax",
      "Sleep up to 15 close friends and family members on-site",
    ],
  },
]

