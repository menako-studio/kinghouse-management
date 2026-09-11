import { DailyPriceRecommendation, PricingRuleConfig } from "./types"

/**
 * Generates a clean CSV string of daily price recommendations
 * compatible with Airbnb / OTA pricing spreadsheets and Excel.
 */
export function generatePricingCsv(
  propertyName: string,
  propertySlug: string,
  rules: PricingRuleConfig,
  recommendations: DailyPriceRecommendation[]
): string {
  const headers = [
    "Tanggal (YYYY-MM-DD)",
    "Hari",
    "Nama Properti",
    "Tarif Rekomendasi (IDR)",
    "Tarif Dasar (IDR)",
    "Selisih (+/- IDR)",
    "Status Keterisian",
    "Channel Booking",
    "Level Permintaan",
    "Skor Permintaan (0-100)",
    "Hari Libur Nasional",
    "Custom Override",
    "Faktor Akhir Pekan",
    "Faktor Libur",
    "Faktor Lead Time",
    "Catatan Strategi",
  ]

  const rows = recommendations.map((rec) => {
    const diff = rec.recommendedPriceIdr - rec.basePriceIdr
    const statusStr = rec.isBooked ? "Terpesona" : "Tersedia"
    const channelStr = rec.bookingChannel || "-"
    const holidayStr = rec.holidayName ? `"${rec.holidayName.replace(/"/g, '""')}"` : "-"
    const overrideStr = rec.overridePriceIdr ? `Rp ${rec.overridePriceIdr.toLocaleString("id-ID")}` : "Tidak"
    const notesStr = rec.notes.length > 0 ? `"${rec.notes.join(" | ").replace(/"/g, '""')}"` : "-"

    return [
      rec.date,
      rec.dayOfWeek,
      `"${propertyName.replace(/"/g, '""')}"`,
      rec.recommendedPriceIdr,
      rec.basePriceIdr,
      diff,
      statusStr,
      channelStr,
      rec.demandLevel,
      rec.demandScore,
      holidayStr,
      overrideStr,
      rec.multipliers.dayOfWeekFactor,
      rec.multipliers.holidayFactor,
      rec.multipliers.leadTimeFactor,
      notesStr,
    ].join(",")
  })

  return [headers.join(","), ...rows].join("\r\n")
}

/**
 * Triggers a browser download of the pricing CSV file.
 */
export function downloadPricingCsv(
  filename: string,
  propertyName: string,
  propertySlug: string,
  rules: PricingRuleConfig,
  recommendations: DailyPriceRecommendation[]
): void {
  const csvContent = generatePricingCsv(propertyName, propertySlug, rules, recommendations)
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
