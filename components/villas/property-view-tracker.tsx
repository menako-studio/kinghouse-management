"use client"

import { useEffect } from "react"
import { trackViewItem } from "@/lib/analytics"

interface PropertyViewTrackerProps {
  propertyId: string
  propertyName: string
  area: string
  price: number
  currency?: string
}

export function PropertyViewTracker({
  propertyId,
  propertyName,
  area,
  price,
  currency = "IDR",
}: PropertyViewTrackerProps) {
  useEffect(() => {
    trackViewItem({
      propertyId,
      propertyName,
      area,
      price,
      currency,
    })
  }, [propertyId, propertyName, area, price, currency])

  return null
}
