import type { Metadata } from "next"
import { MANAGED_AREAS } from "@/lib/constants"
import { AreaView, areaMetadata } from "@/components/pages/area-view"

interface PageProps {
  params: Promise<{ area: string }>
}

export async function generateStaticParams() {
  return MANAGED_AREAS.map((area) => ({ area: area.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params
  return areaMetadata(area, "id")
}

export default async function IdAreaLandingPage({ params }: PageProps) {
  const { area } = await params
  return <AreaView area={area} locale="id" />
}
