import { UPSELL_SERVICES } from "./data"

export interface SelectedUpsellItem {
  serviceId: string
  quantity: number
}

export interface UpsellOrderSummary {
  items: {
    serviceId: string
    title: string
    unitPriceIdr: number
    quantity: number
    totalPriceIdr: number
  }[]
  totalAmountIdr: number
}

/**
 * Calculates itemized breakdown and total IDR for chosen upsell items
 */
export function calculateUpsellOrder(selected: SelectedUpsellItem[]): UpsellOrderSummary {
  const items = selected
    .map((sel) => {
      const service = UPSELL_SERVICES.find((s) => s.id === sel.serviceId)
      if (!service || sel.quantity <= 0) return null

      return {
        serviceId: service.id,
        title: service.title,
        unitPriceIdr: service.priceIdr,
        quantity: sel.quantity,
        totalPriceIdr: service.priceIdr * sel.quantity,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const totalAmountIdr = items.reduce((sum, item) => sum + item.totalPriceIdr, 0)

  return {
    items,
    totalAmountIdr,
  }
}

/**
 * Generates direct WhatsApp message URL with pre-filled items, guest name, and villa
 */
export function generateUpsellWhatsAppUrl(
  phone: string,
  propertyName: string,
  guestName: string,
  order: UpsellOrderSummary,
  specialNotes?: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "")
  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(order.totalAmountIdr)

  let text = `Halo Concierge Kinghouse! 🛎️\n\n`
  text += `Saya ingin memesan *In-Stay Add-On Services* untuk penginapan saya:\n`
  text += `🏡 *Properti:* ${propertyName}\n`
  if (guestName.trim()) {
    text += `👤 *Nama Tamu:* ${guestName.trim()}\n`
  }
  text += `\n*Daftar Layanan yang Dipesan:*\n`

  order.items.forEach((item, index) => {
    const formattedItemTotal = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(item.totalPriceIdr)
    text += `${index + 1}. ${item.title} (x${item.quantity}) — ${formattedItemTotal}\n`
  })

  text += `\n💰 *Total Biaya:* ${formattedTotal}\n`

  if (specialNotes && specialNotes.trim()) {
    text += `📝 *Catatan Khusus:* ${specialNotes.trim()}\n`
  }

  text += `\nMohon konfirmasi ketersediaan dan metode pembayarannya. Terima kasih!`

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}
