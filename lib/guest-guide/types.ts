export interface WifiInfo {
  networkName: string
  password: string
  speed: string
  notes?: string
}

export interface AccessGuide {
  checkInTime: string
  checkOutTime: string
  smartLockCodeOrPin: string
  accessInstructions: string[]
  parkingInfo: string
}

export interface ApplianceGuide {
  title: string
  icon: string
  instructions: string[]
}

export interface LocalPlace {
  name: string
  category: "Food & Cafe" | "Convenience & Grocery" | "Emergency & Pharmacy" | "Attraction"
  distance: string
  highlight: string
  mapsUrl: string
}

export interface UpsellService {
  id: string
  title: string
  category: "timing" | "comfort" | "experience" | "housekeeping"
  description: string
  priceIdr: number
  unit: string // e.g. "per stay", "per unit", "per pax"
  icon: string
  popular?: boolean
  applicableSlugs?: string[] // If empty, applies to all
}

export interface GuestCompendium {
  propertySlug: string
  propertyName: string
  area: string
  heroImage: string
  whatsappConciergePhone: string
  wifi: WifiInfo
  access: AccessGuide
  houseRules: string[]
  appliances: ApplianceGuide[]
  localGuide: LocalPlace[]
}
