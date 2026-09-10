import { Villa, Testimonial, ManagementTier, CaseStudy, BlogPost, VillaEvent } from "./types"

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
      metaTitle: "Versatile House With Garden — Jagakarsa, South Jakarta | KingHouse",
      metaDescription:
        "Spacious 2-6 bedroom home in Jagakarsa for up to 12 guests. Private garden, pool, full kitchen, free parking. Book via Airbnb, Agoda, or Direct WhatsApp with perks.",
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
      metaTitle: "Sky House Tangerang — Hotel-Style Room Near IKEA Alam Sutera | KingHouse",
      metaDescription:
        "Boutique hotel-feel private room in Pinang, Tangerang. 5 min from IKEA Alam Sutera. Premium bed, fast WiFi, en-suite bathroom. Book on Airbnb, Agoda, or Direct via KingHouse.",
      focusKeyword: "sewa kamar tangerang dekat ikea alam sutera",
      ogImage:
        "/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg",
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
      lead: "A bright, cheerful apartment in the strategic Palmerah district of West Jakarta — minutes from Palmerah Station, Senayan, and major business corridors. New listing with first-class KingHouse hospitality standards.",
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
      metaTitle: "Bright & Airy Apartment Palmerah, Jakarta Barat | KingHouse",
      metaDescription:
        "Entire modern apartment in Palmerah, West Jakarta. 10 min walk to Palmerah KRL Station. Bright interior, full amenities for 2 guests. Managed by KingHouse.",
      focusKeyword: "sewa apartemen palmerah jakarta barat airbnb",
      ogImage:
        "/properties/bright-airy/BrightAiry_Apartment_Kamar_Wide.webp",
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
      metaTitle: "Skyline Luxury — Orange County Cikarang Apartment | KingHouse",
      metaDescription:
        "Executive apartment with skyline view inside Orange County, Cikarang Selatan. Perfect for expats & professionals near Jababeka & EJIP. Managed by KingHouse on Airbnb.",
      focusKeyword: "apartemen orange county cikarang expat airbnb",
      ogImage:
        "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_PemandanganView.jpeg",
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
      "KingHouse transformed our family home in Jagakarsa into a steady income stream. From zero bookings to 80%+ occupancy in 3 months — their Airbnb SEO and listing optimization is genuinely impressive.",
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
      "Stayed at the Orange County apartment for 2 weeks while overseeing our Jababeka plant. The location is perfect, the apartment felt like a hotel suite, and KingHouse's WhatsApp support was instant. Will rebook.",
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
      "Designed for property owners who handle their own cleaning and operations, but want KingHouse's Airbnb SEO expertise, dynamic pricing, and professional listing management to maximize bookings.",
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
      text: "I had no idea our house could earn this much. KingHouse basically turned a burden into a business.",
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

export const TRUST_PARTNERS = [
  { name: "Airbnb", badge: "Managed Host 2026", logoText: "Airbnb" },
  { name: "Booking.com", badge: "Coming Soon", logoText: "Booking.com" },
  { name: "Agoda", badge: "Coming Soon", logoText: "Agoda" },
  { name: "Google", badge: "Google Verified Business", logoText: "Google" },
  { name: "WhatsApp Business", badge: "Verified Business", logoText: "WhatsApp" },
]

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────

const AUTHOR_KINGHOUSE = {
  name: "KingHouse Team",
  role: "Property Management Experts",
  avatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "5 Cara Memaksimalkan Pendapatan Airbnb di Jagakarsa, Jakarta Selatan",
    slug: "maksimalkan-pendapatan-airbnb-jagakarsa",
    excerpt:
      "Jagakarsa menyimpan potensi Airbnb yang masih under-the-radar. Dengan strategi SEO listing yang tepat, foto profesional, dan dynamic pricing, properti di sini bisa menghasilkan Rp 30-50 juta per bulan.",
    content: `Jagakarsa adalah salah satu kecamatan paling hijau di Jakarta Selatan — tenang, sejuk, dan semakin diminati tamu yang mencari alternatif menginap di luar hotel berbintang. Namun banyak pemilik properti di sini belum memaksimalkan potensinya di Airbnb.

## 1. Optimalkan Judul Listing dengan Kata Kunci Strategis

Judul Airbnb Anda adalah elemen SEO nomor satu. Hindari judul generik seperti "Rumah Nyaman di Jakarta". Gunakan spesifik: lokasi, keunggulan unik, dan target tamu. Contoh: *"Spacious 5BR Family Home • Private Garden • Quiet Jagakarsa"*.

## 2. Foto Profesional adalah Investasi Wajib

Data Airbnb menunjukkan listing dengan foto profesional mendapatkan 40% lebih banyak klik. Di Jagakarsa, tonjolkan taman hijau, suasana tenang, dan ruang keluarga yang lapang — elemen yang tidak bisa ditemukan di apartemen tengah kota.

## 3. Dynamic Pricing Sesuai Musim dan Event

Harga flat sepanjang tahun adalah kesalahan terbesar. Naikkan harga 20-35% di akhir pekan, libur nasional, dan musim liburan (Juni-Juli, Desember). Gunakan tools seperti PriceLabs atau biarkan KingHouse mengelolanya.

## 4. Targetkan Segmen Tamu yang Tepat

Rumah besar di Jagakarsa cocok untuk: arisan keluarga, team offsite perusahaan, ulang tahun kelompok, dan keluarga besar yang berlibur. Buat deskripsi yang berbicara langsung pada segmen ini.

## 5. Respons Cepat = Lebih Banyak Booking

Airbnb memprioritaskan listing dengan response rate tinggi (>90%) dan response time <1 jam. Aktifkan notifikasi atau gunakan layanan manajemen seperti KingHouse yang merespons tamu 24/7.`,
    category: "owner-tips",
    publishedAt: "2026-07-15",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    tags: ["jagakarsa", "airbnb", "tips owner", "jakarta selatan", "optimasi listing"],
    seoKeywords: [
      "airbnb jagakarsa",
      "sewa rumah jagakarsa",
      "properti airbnb jakarta selatan",
      "tips listing airbnb indonesia",
    ],
    readTime: 5,
    featured: true,
  },
  {
    id: "blog-2",
    title: "Mengapa Cikarang Adalah Hidden Gem Investasi Properti Airbnb di Indonesia",
    slug: "cikarang-hidden-gem-investasi-airbnb",
    excerpt:
      "Puluhan ribu ekspatriat bekerja di kawasan industri Cikarang setiap tahun — dan mereka membutuhkan akomodasi berkualitas. Pelajari mengapa ROI Airbnb di Cikarang bisa melampaui lokasi populer seperti Bali.",
    content: `Cikarang Selatan adalah pusat industri terbesar di Asia Tenggara. Kawasan ini menampung lebih dari 4,000 perusahaan multinasional dengan puluhan ribu ekspatriat yang rotasi setiap 3-12 bulan. Namun stok Airbnb berkualitas di sini masih sangat terbatas.

## Kenapa Cikarang Berbeda dari Destinasi Wisata?

Di destinasi wisata, Anda bersaing dengan ratusan listing. Di Cikarang, segmen ekspatriat korporat hampir tidak punya pilihan selain hotel bisnis yang mahal atau apartemen long-stay yang kaku. Di sinilah peluang Airbnb paling besar.

## Siapa Tamu di Cikarang?

- **Ekspatriat baru** yang belum mendapatkan hunian tetap (stay 1-4 minggu)
- **Tim audit & konsultan** dari perusahaan manufaktur global
- **Teknisi commissioning** dari industri otomotif, elektronik, kimia
- **Keluarga yang menemani** rotasi kerja pasangan

## Apa yang Mereka Cari?

Kenyamanan setara hotel dengan privasi apartemen: dapur lengkap, laundry, WiFi cepat, parkir aman, dan dekat kawasan industri (Jababeka, EJIP, MM2100, KIC).

## ROI yang Kompetitif

Dengan harga sewa Airbnb Rp 400.000–700.000/malam dan occupancy 70-85% dari segmen korporat, sebuah unit apartemen 1BR di Cikarang dapat menghasilkan Rp 18-25 juta bersih per bulan — mengalahkan banyak properti di kota besar.`,
    category: "airbnb-seo",
    publishedAt: "2026-07-28",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
    tags: ["cikarang", "investasi properti", "airbnb", "bekasi", "ekspat"],
    seoKeywords: [
      "airbnb cikarang",
      "investasi properti cikarang",
      "sewa apartemen orange county",
      "properti ekspat cikarang bekasi",
    ],
    readTime: 6,
    featured: true,
  },
  {
    id: "blog-3",
    title: "Airbnb SEO: Cara Listing Properti Anda Muncul di Halaman 1 Pencarian",
    slug: "airbnb-seo-tips-halaman-1-pencarian",
    excerpt:
      "Airbnb memiliki algoritma pencarian sendiri yang menentukan mana listing yang ditampilkan. Pelajari faktor-faktor kunci dan cara KingHouse mengoptimalkan setiap listing untuk mendapatkan lebih banyak klik dan booking.",
    content: `Airbnb Search Algorithm (atau yang disebut internal sebagai 'Superhost Algorithm') mempertimbangkan puluhan sinyal untuk menentukan ranking listing. Berikut faktor-faktor yang paling berpengaruh.

## Faktor Utama Airbnb SEO

### 1. Completeness Score (Skor Kelengkapan)
Listing dengan semua field terisi — deskripsi lengkap, foto minimal 20, semua amenitas terdaftar, house rules jelas — mendapat boost signifikan di ranking.

### 2. Response Rate & Response Time
Host dengan response rate >90% dan response time <1 jam mendapat label "Responsive" dan diprioritaskan Airbnb. Ini adalah faktor yang paling mudah dikontrol.

### 3. Acceptance Rate
Sering menolak permintaan booking? Algoritma akan menurunkan ranking Anda. Kuncinya: hanya tampilkan ketersediaan yang memang Anda siap terima.

### 4. Review Score dan Volume
Rating tinggi (>4.8) dan jumlah review yang banyak adalah social proof terkuat. Minta tamu untuk memberikan review setelah checkout — jangan tunggu mereka ingat sendiri.

### 5. Pricing Competitiveness
Listing dengan harga terlalu jauh di atas rata-rata pasar lokal cenderung mendapat lebih sedikit klik. Dynamic pricing yang dikalibrasi ke pasar sangat penting.

### 6. Instant Book
Listing dengan fitur Instant Book (tidak memerlukan konfirmasi host) mendapat prioritas tampilan di hasil pencarian.

## Bagaimana KingHouse Mengoptimalkan SEO Airbnb Klien Kami

Kami melakukan audit SEO menyeluruh untuk setiap properti baru: judul dan deskripsi berbasis riset kata kunci, foto profesional dengan caption SEO-friendly, kelengkapan 100%, dan setup Instant Book. Hasilnya rata-rata peningkatan tayangan 3-5x dalam 30 hari pertama.`,
    category: "airbnb-seo",
    publishedAt: "2026-08-05",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
    tags: ["airbnb seo", "optimasi listing", "algoritma airbnb", "tips host"],
    seoKeywords: [
      "cara optimasi listing airbnb",
      "airbnb seo indonesia",
      "tips host airbnb",
      "cara naik ranking airbnb",
    ],
    readTime: 7,
    featured: false,
  },
  {
    id: "blog-4",
    title: "Tangerang vs BSD City: Mana Lokasi Airbnb dengan ROI Lebih Tinggi?",
    slug: "tangerang-vs-bsd-city-roi-airbnb",
    excerpt:
      "Tangerang dan BSD City sama-sama menjanjikan untuk investasi Airbnb — tapi dengan profil tamu yang berbeda. Analisis lengkap occupancy rate, harga rata-rata, dan tipe properti terbaik di masing-masing lokasi.",
    content: `Wilayah Tangerang Raya mencakup berbagai micromarket dengan karakteristik yang sangat berbeda. Dua yang paling sering dibandingkan oleh investor Airbnb adalah **Tangerang Kota** (area Pinang, Cipondoh) dan **BSD City** (Serpong, Tangerang Selatan).

## Tangerang Kota (Pinang, Cipondoh)

**Profil Tamu Dominan**: Pelancong bisnis ke kawasan industri Tangerang, keluarga yang mengunjungi sanak saudara, wisatawan transit Bandara Soetta.

**Harga Rata-rata**: Rp 250.000–450.000/malam (tipe kamar/studio)

**Occupancy**: 65-75% (konsisten sepanjang tahun)

**Keunggulan**: Dekat Bandara Soetta (30 menit), harga sewa unit rendah → margin lebih tinggi, demand dari segmen bisnis yang stabil.

## BSD City (Serpong, Tangerang Selatan)

**Profil Tamu Dominan**: Profesional muda, keluarga urban, wisatawan yang menghadiri event di ICE BSD, keluarga yang mengunjungi mahasiswa.

**Harga Rata-rata**: Rp 400.000–800.000/malam (apartment/townhouse)

**Occupancy**: 60-70% (lebih tinggi di akhir pekan dan musim event)

**Keunggulan**: Demand premium lebih tinggi, properti modern, IKEA dan mall world-class sebagai anchor.

## Kesimpulan

Tangerang Kota lebih cocok untuk **investor value** yang mencari yield konsisten dengan modal lebih rendah. BSD City lebih cocok untuk **investor premium** yang mengejar harga malam lebih tinggi dan profil tamu lebih premium. KingHouse mengelola properti di kedua area — hubungi kami untuk analisis properti Anda.`,
    category: "revenue-management",
    publishedAt: "2026-08-10",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=85",
    tags: ["tangerang", "bsd city", "investasi airbnb", "analisis pasar", "roi properti"],
    seoKeywords: [
      "airbnb tangerang",
      "airbnb bsd city",
      "investasi properti tangerang selatan",
      "roi airbnb jabodetabek",
    ],
    readTime: 6,
    featured: false,
  },
  {
    id: "blog-5",
    title: "Panduan Lengkap: Cara Sewa Apartemen Jakarta Barat via Airbnb",
    slug: "panduan-sewa-apartemen-jakarta-barat-airbnb",
    excerpt:
      "Jakarta Barat — khususnya Palmerah — menawarkan akomodasi Airbnb yang strategis: dekat stasiun KRL, pusat bisnis Senayan, dan Grand Indonesia. Ini panduan lengkap untuk tamu yang ingin menginap di sini.",
    content: `Jakarta Barat sering diabaikan sebagai destinasi Airbnb — padahal kawasan Palmerah dan sekitarnya menawarkan posisi yang sangat strategis untuk wisatawan bisnis dan keluarga yang berkunjung ke Jakarta.

## Mengapa Palmerah?

Palmerah terletak di perbatasan Jakarta Barat dan Pusat — memberikan akses mudah ke:
- **Senayan & SCBD**: 10-15 menit via Tol Dalam Kota
- **Sudirman-Thamrin CBD**: 15-20 menit
- **Tanah Abang**: 10 menit
- **Palmerah KRL Station**: jalan kaki 5-10 menit

## Apa yang Harus Diperhatikan Saat Booking di Airbnb Jakarta Barat?

### 1. Pilih Listing dengan Foto Profesional
Foto adalah indikator langsung kualitas manajemen properti. Listing dengan foto amatir sering mencerminkan standar kebersihan dan pelayanan yang tidak konsisten.

### 2. Cek Lokasi Persisnya di Map
"Jakarta Barat" cukup luas. Pastikan listing benar-benar di kawasan yang dekat dengan tujuan Anda — bukan di pinggiran yang membutuhkan 30+ menit perjalanan ke pusat.

### 3. Baca Ulasan Tamu Sebelumnya
Fokus pada ulasan yang menyebut kebersihan, respons host, dan keakuratan deskripsi. Ini tiga faktor yang paling menentukan kenyamanan stay Anda.

### 4. Konfirmasi Check-in & Parking
Tanyakan prosedur check-in (self check-in atau perlu bertemu host?) dan ketersediaan parkir sebelum booking — terutama jika membawa kendaraan.

## KingHouse-Managed Properties di Jakarta Barat

Bright & Airy Apartment kami di Palmerah dikelola dengan standar hotel: foto profesional, deskripsi akurat, respons 24/7, dan kebersihan terverifikasi. Booking langsung melalui Airbnb untuk harga terbaik.`,
    category: "jabodetabek-guide",
    publishedAt: "2026-08-14",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=85",
    tags: ["jakarta barat", "palmerah", "airbnb", "panduan tamu", "sewa apartemen"],
    seoKeywords: [
      "airbnb jakarta barat",
      "sewa apartemen palmerah",
      "airbnb dekat senayan",
      "penginapan jakarta barat murah",
    ],
    readTime: 5,
    featured: false,
  },
  {
    id: "blog-6",
    title: "Dari 28% ke 82% Occupancy: Kisah Sukses Rumah di Jagakarsa",
    slug: "kisah-sukses-jagakarsa-occupancy-82-persen",
    excerpt:
      "Bagaimana sebuah rumah keluarga biasa di Jagakarsa berhasil meraih occupancy 82% dalam 90 hari pertama bersama KingHouse? Ini adalah studi kasus lengkap transformasi listing Airbnb.",
    content: `Pak Budi mendekati KingHouse dengan frustrasi. Rumah 5 kamarnya di Jagakarsa sudah terdaftar di Airbnb selama 8 bulan — namun occupancy-nya stagnan di 28%, jauh di bawah potensinya.

## Masalah yang Ditemukan

Setelah audit menyeluruh, kami menemukan lima masalah utama:

1. **Foto amatir** yang gelap dan tidak merepresentasikan luas rumah sebenarnya
2. **Judul generik**: "Rumah Bagus di Jakarta" tanpa keyword spesifik
3. **Deskripsi dangkal** tanpa menyebut kapasitas, fasilitas, atau keunggulan lokasi
4. **Harga flat** Rp 750.000/malam sepanjang tahun — terlalu murah di weekend, terlalu mahal di weekday
5. **Response time 6-12 jam** membuat Airbnb menurunkan ranking listing

## Apa yang Kami Lakukan

### Minggu 1: Audit & Repositioning
Kami memotret ulang seluruh properti dengan kamera profesional dan natural light. 24 foto mencakup setiap sudut: taman, dapur, semua kamar, ruang tamu, dan area parkir.

### Minggu 2: Listing Overhaul
Judul baru: *"Spacious 5BR Family Home • Lush Private Garden • Quiet Jagakarsa, South Jakarta"*

Deskripsi baru menyasar segmen keluarga besar, arisan, dan team offsite — lengkap dengan jarak ke toll, mall, dan stasiun MRT terdekat.

### Minggu 3: Pricing Strategy
Implementasi dynamic pricing: Rp 1.200.000–1.800.000/malam (weekday vs weekend vs peak holiday). Ini meningkatkan average nightly rate dari Rp 750K ke Rp 1.45 juta.

### Ongoing: 24/7 Guest Communication
Tim KingHouse merespons semua inquiry dalam <30 menit, meningkatkan response rate ke 98%.

## Hasil Setelah 90 Hari

- Occupancy: **28% → 82%**
- Monthly Revenue: **Rp 12 juta → Rp 38 juta**
- Average Rating: **4.5 → 4.9**
- Response Rate: **62% → 98%**

*"Saya tidak menyangka bisa secepat ini. KingHouse benar-benar mengubah cara pandang saya tentang properti sebagai aset."* — Pak Budi, Owner`,
    category: "owner-tips",
    publishedAt: "2026-08-18",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&w=1600&q=85",
    tags: ["studi kasus", "occupancy", "jagakarsa", "sukses airbnb", "manajemen properti"],
    seoKeywords: [
      "studi kasus airbnb jagakarsa",
      "meningkatkan occupancy airbnb",
      "manajemen properti jakarta",
      "kinghouse property management",
    ],
    readTime: 8,
    featured: true,
  },
  {
    id: "blog-7",
    title: "Panduan Lengkap Investasi Properti Airbnb Jabodetabek 2026: Strategi ROI & Okupansi Maksimal",
    slug: "panduan-investasi-airbnb-jabodetabek-2026",
    excerpt:
      "Panduan komprehensif investasi properti sewa harian di Jabodetabek tahun 2026. Analisis yield per wilayah, strategi dynamic pricing, dan cara mencetak return 18-28% per tahun.",
    content: `Pasar sewa properti jangka pendek (short-stay rental) di wilayah Jabodetabek mengalami pertumbuhan eksponensial dalam dua tahun terakhir. Pergeseran pola kerja hybrid, tren staycation perkotaan, dan tingginya permintaan venue acara privat menjadikan Airbnb sebagai instrumen investasi properti dengan yield jauh melampaui sewa tahunan tradisional.

Jika sewa residensial konvensional hanya memberikan yield 4% hingga 7% per tahun, portofolio sewa harian yang dikelola secara profesional mampu menghasilkan net yield **18% hingga 28% per tahun**.

## Analisis Potensi Yield per Wilayah di Jabodetabek

Setiap klaster di Jabodetabek memiliki profil tamu dan kekuatan pasar yang unik:

1. **Jakarta Selatan (Jagakarsa, Cilandak, TB Simatupang)**
   - **Target Tamu:** Keluarga besar, arisan, pernikahan intim (*garden wedding*), dan workshop perusahaan.
   - **Tipe Properti Unggulan:** Rumah tapak 4–6 kamar dengan halaman luas dan kolam renang privat seperti [Versatile House Jagakarsa](/locations/jagakarsa/villas/versatile-house-jagakarsa).
   - **Estimasi Yield:** 20% – 28% per tahun dengan okupansi rata-rata 75%–85%.

2. **Tangerang & Alam Sutera (Pinang, BSD)**
   - **Target Tamu:** Business traveler, ekspatriat, dan pengunjung exhibition center (ICE BSD / IKEA).
   - **Tipe Properti Unggulan:** Hotel-style suites dan studio modern seperti [Sky House Tangerang](/locations/tangerang/villas/sky-house-tangerang).
   - **Estimasi Yield:** 16% – 22% per tahun.

3. **Cikarang & Bekasi (Orange County, Meikarta, Jababeka)**
   - **Target Tamu:** Eksekutif industri manufaktur (Jepang, Korea) dan transit project manager.
   - **Tipe Properti Unggulan:** Apartemen premium dengan fasilitas gym, kolam renang, dan akses mall seperti [Skyline Luxury Cikarang](/locations/cikarang/villas/skyline-luxury-orange-county).
   - **Estimasi Yield:** 18% – 24% per tahun.

## 4 Pilar Sukses Memaksimalkan Pendapatan Airbnb

Untuk bersaing di peringkat teratas algoritma pencarian Airbnb dan Google, pemilik properti harus mengeksekusi empat pilar utama:

### 1. Fotografi Editorial & Listing Storytelling
Foto berkualitas studio dengan pencahayaan alami (*golden hour*) terbukti meningkatkan Click-Through Rate (CTR) hingga 45%. Jangan hanya memotret ruangan—ceritakan pengalaman menginap (*experiential hospitality*).

### 2. Algoritma Dynamic Pricing
Menetapkan harga statis adalah penyebab utama hilangnya potensi pendapatan. Gunakan kalibrasi harga dinamis berbasis okupansi real-time, event lokal, hari libur nasional, dan pola booking kompetitor.

### 3. Layanan Concierge & Guest Communication 24/7
Airbnb memberikan ranking istimewa kepada Host dengan response time di bawah 15 menit dan acceptance rate 100%. Layanan cepat tanggap juga memicu review bintang 5 yang konsisten.

### 4. Operasional Turnover & Housekeeping Standar Hotel
Standar kebersihan adalah faktor penentu ulasan tamu. Pastikan sanitasi berkala, linen hotel premium, dan inspeksi 120-titik sebelum setiap tamu check-in.

> Pelajari lebih lanjut bagaimana KingHouse membantu pemilik aset mengotomasi seluruh operasional melalui [Layanan Manajemen Properti KingHouse](/owner-services).`,
    category: "revenue-management",
    publishedAt: "2026-08-25",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    tags: ["investasi properti", "airbnb jabodetabek", "roi sewa harian", "manajemen villa", "revenue management"],
    seoKeywords: [
      "investasi airbnb jabodetabek",
      "manajemen properti jakarta",
      "roi sewa harian villa",
      "jasa kelola airbnb indonesia",
      "kinghouse management",
    ],
    readTime: 7,
    featured: true,
  },
  {
    id: "blog-8",
    title: "5 Rekomendasi Villa Intimate Wedding & Family Gathering Terbaik di Jakarta 2026",
    slug: "rekomendasi-villa-intimate-wedding-family-gathering-jakarta",
    excerpt:
      "Mencari venue pernikahan intim atau staycation keluarga dengan private pool dan taman luas di Jakarta? Temukan rekomendasi villa eksklusif tanpa corkage fee di sini.",
    content: `Tren pernikahan intim (*intimate wedding*) dan pertemuan keluarga privat (*family gathering*) semakin digemari di Jakarta. Alih-alih menyewa ballroom hotel yang kaku dan mahal dengan batasan vendor yang ketat, semakin banyak pasangan dan keluarga memilih menyewa private villa bernuansa tropis.

Menyewa villa privat memberikan privasi 100%, fleksibilitas dekorasi tanpa biaya corkage, serta fasilitas menginap untuk keluarga inti.

## Kriteria Memilih Villa Event di Jakarta

Sebelum memutuskan tempat acara, pastikan villa pilihan Anda memenuhi kriteria berikut:
- **Kapasitas Nyaman:** Mampu menampung 20 hingga 50 tamu tanpa terasa sesak.
- **Area Indoor & Outdoor Terintegrasi:** Tersedia taman terbuka untuk seremoni dan ruangan ber-AC untuk antisipasi cuaca.
- **Bebas Biaya Corkage:** Bebas membawa katering, dekorator, dan fotografer pilihan tanpa penalti markup.
- **Fasilitas Menginap:** Kamar tidur hotel-grade yang cukup untuk keluarga inti menginap setelah acara.

## Rekomendasi Unggulan: Versatile House with Garden Beyond (Jagakarsa)

Terletak di kawasan asri Jakarta Selatan, [Versatile House Jagakarsa](/events/garden-wedding-jagakarsa) merupakan pilihan nomor satu untuk acara privat:

- **Luas Area:** 500 m² taman tropis dengan kolam renang privat.
- **Kapasitas Event:** Hingga 50 orang (*seated*) atau 70 orang (*standing reception*).
- **Akomodasi Menginap:** 5 kamar tidur ber-AC mewah yang mampu menampung hingga 15 anggota keluarga.
- **Paket Fleksibel:** Tersedia opsi sewa Half Day (6 jam), Full Day (12 jam), dan Full Board (24 jam termasuk menginap).
- **Keunggulan:** Zero vendor corkage fee, parkir luas, dan dukungan staf operasional di lokasi.

## Tips Menghemat Budget Wedding & Gathering di Private Villa

1. **Pilih Paket Full Board:** Menggabungkan venue acara dan tempat menginap keluarga menghemat biaya transportasi dan akomodasi hotel terpisah hingga 40%.
2. **Bawa Katering Langganan:** Nikmati kebebasan memilih menu makanan favorit keluarga tanpa minimum order dari hotel.
3. **Manfaatkan Pencahayaan Alami:** Gelar akad nikah di pagi hari atau resepsi senja (*sunset ceremony*) untuk hasil foto estetik maksimal.

> Jelajahi paket pricelist lengkap dan unduh brosur resmi di [Halaman Paket Acara & Wedding KingHouse](/events).`,
    category: "guest-experience",
    publishedAt: "2026-08-28",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    tags: ["villa wedding jakarta", "intimate wedding", "family gathering", "jagakarsa", "private pool villa"],
    seoKeywords: [
      "villa intimate wedding jakarta",
      "venue pernikahan jagakarsa",
      "villa family gathering jakarta selatan",
      "sewa villa private pool jakarta",
      "kinghouse events",
    ],
    readTime: 6,
    featured: true,
  },
  {
    id: "blog-9",
    title: "Strategi Maksimalkan Okupansi Sewa Apartemen Harian di Cikarang & Orange County",
    slug: "strategi-maksimalkan-okupansi-apartemen-cikarang",
    excerpt:
      "Cikarang memiliki pasar ekspat dan corporate traveler yang sangat menjanjikan. Pelajari taktik positioning apartemen premium di Orange County untuk okupansi di atas 80%.",
    content: `Cikarang dikenal sebagai pusat kawasan industri terbesar di Asia Tenggara, menampung ribuan perusahaan multinasional di EJIP, Jababeka, MM2100, dan GIIC. Tingginya mobilitas tenaga ahli ekspatriat asal Jepang, Korea Selatan, dan Eropa menciptakan permintaan sewa apartemen harian yang sangat stabil.

Namun, banyak pemilik apartemen di Cikarang menghadapi masalah unit kosong karena hanya mengandalkan sewa tahunan konvensional yang kerap kali mengalami masa sewa terputus (*vacancy rate* tinggi).

## Mengapa Model Sewa Short-Stay Lebih Menguntungkan di Cikarang?

- **Rata-rata Tarif Sewa Harian:** Rp 450.000 – Rp 850.000 / malam.
- **Potensi Pendapatan Bulanan:** Rp 12.000.000 – Rp 22.000.000 / unit (pada okupansi 75%).
- **Bandingkan dengan Sewa Tahunan:** Rata-rata hanya Rp 4.000.000 – Rp 6.500.000 / bulan.

## 3 Kunci Menarik Tamu Korporat & Ekspat di Orange County

### 1. Standar Interior & Amenity ala Suite Eksekutif
Ekspatriat dan profesional bisnis mengharapkan fasilitas penunjang produktivitas:
- Koneksi internet WiFi Dedicated berkecepatan minimal 50–100 Mbps.
- Meja kerja ergonomis, Smart TV dengan Netflix & YouTube Premium.
- Mesin pembuat kopi (Nespresso/drip coffee) dan peralatan memasak modern.
- Unit seperti [Skyline Luxury Orange County](/locations/cikarang/villas/skyline-luxury-orange-county) menjadi benchmark favorit karena menyajikan panorama skyline kota dan interior kontemporer.

### 2. Multi-Channel Distribution (Airbnb, Agoda, Booking.com & Direct B2B)
Jangan hanya terpaku pada satu platform. Hubungkan kalender reservasi dengan sinkronisasi iCal otomatis untuk mencegah *double booking* dan raih visibilitas global di berbagai OTA terkemuka.

### 3. Dukungan Respon Cepat & Self Check-in Digital
Tamu bisnis kerap tiba pada larut malam setelah penerbangan internasional. Sistem Smart Lock self check-in dipadukan dengan panduan digital berbahasa Inggris/Jepang memastikan pengalaman kedatangan yang mulus tanpa repot.

> Ingin apartemen Anda di Cikarang dikelola dengan sistem revenue management otomatis? [Konsultasikan properti Anda bersama tim KingHouse](/owner-services).`,
    category: "airbnb-seo",
    publishedAt: "2026-08-29",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "/properties/skyline-luxury/SkylineLuxury_OrangeCounty_KamarUtama.webp",
    tags: ["apartemen cikarang", "orange county cikarang", "sewa harian ekspat", "airbnb cikarang", "jababeka"],
    seoKeywords: [
      "sewa apartemen cikarang harian",
      "airbnb orange county cikarang",
      "apartemen ekspat cikarang",
      "kelola apartemen cikarang",
      "manajemen properti bekasi",
    ],
    readTime: 6,
    featured: false,
  },
  {
    id: "blog-10",
    title: "Kelola Sendiri vs Jasa Manajemen Properti Airbnb: Perbandingan Biaya, Waktu, & ROI 2026",
    slug: "kelola-sendiri-vs-jasa-manajemen-properti-airbnb",
    excerpt:
      "Bingung memilih antara mengelola Airbnb sendiri atau menggunakan jasa property management profesional? Simak perbandingan mendalam biaya operasional, efisiensi waktu, dan net profit.",
    content: `Memiliki properti sewa harian adalah bisnis yang sangat menguntungkan, namun operasional hariannya menuntut waktu dan dedikasi penuh. Banyak pemilik properti (*hosts*) memulai dengan mengelola unit mereka sendiri, sebelum akhirnya menyadari bahwa manajemen hospitality memerlukan keahlian multi-disiplin: dari dynamic pricing, marketing SEO, hingga penanganan darurat 24 jam.

Berikut adalah perbandingan objektif antara model **Self-Managed (Kelola Sendiri)** vs **Full-Service Property Management (KingHouse)**.

## Perbandingan Komprehensif

| Aspek Operasional | Kelola Sendiri (Self-Managed) | Manajemen Profesional (KingHouse) |
| :--- | :--- | :--- |
| **Alokasi Waktu Owner** | 20–35 jam / minggu (chat, komplain, cuci linen, check-in) | **0 jam / minggu (100% Pasif)** |
| **Strategi Penetapan Harga** | Harga statis atau manual tebak-tebakan | **Algoritma Dynamic Pricing berbasis AI real-time** |
| **Response Time ke Tamu** | 1–6 jam (tergantung kesibukan pribadi) | **< 15 menit 24/7 Concierge Service** |
| **Saluran Pemasaran** | Terbatas 1 platform (Airbnb saja) | **Multi-channel: Airbnb, Agoda, Booking.com, Web Direct** |
| **Kualitas Fotografi & SEO** | Foto HP standar | **Editorial Architectural Photography & Keyword SEO** |
| **Rata-rata Okupansi** | 35% – 50% | **75% – 85%+** |
| **Net Income Bulanan (Simulasi)** | Rp 12.000.000 – Rp 15.000.000 | **Rp 28.000.000 – Rp 38.000.000** |

## Mengapa Manajemen Profesional Menghasilkan Net Profit Lebih Tinggi?

Banyak pemilik khawatir dengan potongan komisi manajemen (15%–20%). Namun secara finansial, **80% dari pendapatan Rp 40 juta jauh lebih besar daripada 100% dari pendapatan Rp 15 juta**.

1. **Lonjakan Okupansi & ADR:** Melalui SEO listing dan dynamic pricing, KingHouse mampu melipatgandakan tingkat hunian properti.
2. **Review Positif Berkelanjutan:** Tamu yang puas dengan kebersihan hotel-grade dan concierge 24 jam akan memberikan review bintang 5 yang mendongkrak peringkat Superhost.
3. **Perawatan Preventif Aset:** Inspeksi rutin memastikan fasilitas AC, pompa air, dan furniture tetap terawat prima tanpa depresiasi berlebihan.

> Hitung potensi pendapatan properti Anda dengan [Kalkulator ROI & Layanan Manajemen KingHouse](/owner-services).`,
    category: "owner-tips",
    publishedAt: "2026-08-30",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=85",
    tags: ["jasa kelola airbnb", "manajemen properti", "biaya pengelola villa", "superhost indonesia", "kinghouse management"],
    seoKeywords: [
      "jasa kelola airbnb jakarta",
      "biaya manajemen properti villa",
      "superhost management indonesia",
      "kinghouse hospitality",
      "passive income properti",
    ],
    readTime: 7,
    featured: true,
  },
  {
    id: "blog-11",
    title: "Tips Memilih Villa Private Pool Mewah & Asri di Jakarta Selatan untuk Weekend Escape",
    slug: "tips-staycation-villa-private-pool-jakarta-selatan",
    excerpt:
      "Ingin staycation seru tanpa macet ke luar kota? Simak tips memilih villa privat bernuansa tropis dengan fasilitas lengkap dan kolam renang pribadi di Jakarta Selatan.",
    content: `Bagi warga Jabodetabek yang ingin melepas penat di akhir pekan, kemacetan menuju Puncak atau Bandung kerap kali menghabiskan energi sebelum liburan dimulai. Solusi terbaik yang kian populer adalah staycation di private villa mewah di dalam kota Jakarta.

Jakarta Selatan, khususnya kawasan hijau Jagakarsa dan Cilandak, menyimpan sejumlah villa eksklusif dengan taman rimbun dan kolam renang privat yang menghadirkan suasana tenang ala Ubud Bali tanpa harus keluar kota.

## Keuntungan Staycation di Private Villa Jakarta Selatan

1. **Bebas Macet Jalur Luar Kota:** Akses cepat via Tol Desari (Depok-Antasari) atau Tol TB Simatupang dalam 20–40 menit dari pusat kota.
2. **Privasi Maksimal:** Tidak ada tamu asing yang berbagi fasilitas kolam renang atau ruang santai bersama keluarga Anda.
3. **Kapasitas Rombongan Besar:** Dapat menampung 10–15 orang dengan biaya per orang yang jauh lebih hemat dibanding menyewa beberapa kamar hotel.

## Fasilitas Wajib yang Harus Dicek Sebelum Booking

- **Private Swimming Pool:** Pastikan kolam renang bersih dan terawat secara profesional.
- **Koneksi Internet Cepat & Hiburan:** Smart TV dengan Netflix, YouTube 4K, dan WiFi stabil untuk menonton film bersama.
- **Dapur Lengkap (Fully Equipped Kitchen):** Tersedia kulkas besar, kompor, microwave, dan alat makan lengkap untuk memasak bersama atau mengadakan pesta BBQ.
- **Area Parkir Luas:** Keamanan 24 jam dan ruang parkir yang memadai untuk beberapa kendaraan keluarga.

Koleksi properti seperti [Versatile House Jagakarsa](/locations/jagakarsa/villas/versatile-house-jagakarsa) dan [Katalog Lengkap Villa KingHouse](/villas) dirancang untuk memberikan standar hospitality hotel bintang 5 dengan kehangatan rumah pribadi.

> Temukan pilihan villa impian Anda dan lakukan reservasi instan melalui [Portal Katalog Villa KingHouse](/villas).`,
    category: "jabodetabek-guide",
    publishedAt: "2026-08-31",
    author: AUTHOR_KINGHOUSE,
    heroImage:
      "/properties/versatile-house/VersatileHouse_LivingRoom_Lounge.jpg",
    tags: ["villa private pool jakarta", "staycation jakarta selatan", "sewa villa jagakarsa", "weekend gateaway", "villa murah jakarta"],
    seoKeywords: [
      "villa private pool jakarta selatan",
      "staycation murah jagakarsa",
      "sewa villa jakarta kolam renang",
      "rekomendasi villa jabodetabek",
      "kinghouse curated villas",
    ],
    readTime: 5,
    featured: false,
  },
]

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
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    gallery: [
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
      "/properties/versatile-house/new/VersatileHouse_04_Patio_Terrace.jpg",
      "/properties/versatile-house/new/VersatileHouse_09_Zen_Courtyard.jpg",
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
          "Dedicated KingHouse day-of coordination contact",
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
      "/properties/versatile-house/new/VersatileHouse_04_Patio_Terrace.jpg",
    gallery: [
      "/properties/versatile-house/new/VersatileHouse_04_Patio_Terrace.jpg",
      "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
      "/properties/versatile-house/new/VersatileHouse_06_Dining_Chandelier.jpg",
      "/properties/versatile-house/new/VersatileHouse_02_Living_Hall.jpg",
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

