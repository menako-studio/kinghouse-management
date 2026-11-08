import { permanentRedirect } from "next/navigation"

// Legacy URL: one canonical page for owner services (avoids duplicate content).
export default function ServicesPage() {
  permanentRedirect("/owner-services")
}
