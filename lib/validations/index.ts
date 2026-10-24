import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid").min(5, "Email minimal 5 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  rememberMe: z.boolean().optional(),
})

export const ReservationSchema = z.object({
  propertyId: z.string().min(1, "Properti wajib dipilih"),
  propertyName: z.string().min(1, "Nama properti wajib diisi"),
  guestName: z.string().min(2, "Nama tamu minimal 2 karakter"),
  guestPhone: z.string().optional(),
  guestEmail: z.string().email("Format email tamu tidak valid").optional().or(z.literal("")),
  channel: z.enum(["Airbnb", "Direct WhatsApp", "Booking.com", "Agoda", "Walk-in"]),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal check-in harus YYYY-MM-DD"),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal check-out harus YYYY-MM-DD"),
  nights: z.number().int().positive("Jumlah malam harus lebih dari 0"),
  guests: z.number().int().positive("Jumlah tamu harus minimal 1"),
  grossPayoutIdr: z.number().nonnegative("Nilai gross payout tidak boleh negatif"),
  cleaningFeeIdr: z.number().nonnegative("Cleaning fee tidak boleh negatif").default(0),
  feeTier: z.enum(["standard", "premium"]).default("standard"),
  status: z.enum(["Confirmed", "Checked-in Ready", "Active Stay", "Completed", "Cancelled", "Blocked"]).default("Confirmed"),
  notes: z.string().optional(),
}).refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
  message: "Tanggal check-out harus setelah tanggal check-in",
  path: ["checkOut"],
})

export const ExpenseSchema = z.object({
  propertyId: z.string().min(1, "Properti wajib dipilih"),
  propertyName: z.string().min(1, "Nama properti wajib diisi"),
  category: z.enum([
    "PLN & Utilities",
    "Linen & Laundry",
    "Guest Amenities",
    "Maintenance & Repairs",
    "Staff & Housekeeping",
    "Marketing & OTAs",
  ]),
  description: z.string().min(3, "Deskripsi pengeluaran minimal 3 karakter"),
  amountIdr: z.number().positive("Jumlah pengeluaran harus lebih dari 0"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  recordedBy: z.string().min(2, "Nama pencatat wajib diisi"),
  vendorName: z.string().optional(),
  receiptUrl: z
    .string()
    .regex(/^https?:\/\//i, "URL kwitansi harus diawali dengan http:// atau https://")
    .url("URL kwitansi tidak valid")
    .optional()
    .or(z.literal("")),
})

export const SeoUpdateSchema = z.object({
  slug: z.string().min(1, "Slug properti wajib"),
  metaTitle: z.string().min(10, "Meta title minimal 10 karakter").max(70, "Meta title maksimal 70 karakter"),
  metaDescription: z.string().min(50, "Meta description minimal 50 karakter").max(160, "Meta description maksimal 160 karakter"),
  focusKeyword: z.string().min(2, "Focus keyword wajib diisi"),
  canonicalUrl: z
    .string()
    .regex(/^https?:\/\//i, "URL canonical harus diawali dengan http:// atau https://")
    .url("URL canonical tidak valid")
    .optional()
    .or(z.literal("")),
})

// ------------------------------------------------------------------
// Lead funnel (Owner / Stay / Event) — public form submissions
// ------------------------------------------------------------------

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
const timeOfDay = z.string().regex(/^\d{2}:\d{2}$/, "Format jam harus HH:MM")

const LeadContactFields = {
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80, "Nama maksimal 80 karakter"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,19}$/, "Nomor WhatsApp tidak valid"),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0, "Spam terdeteksi").optional(),
  // Site language the visitor used, so the team replies in it.
  language: z.enum(["EN", "ID", "JA", "ZH-CN", "ZH-TW", "FR", "ES", "DE", "RU"]).optional(),
}

export const LeadSourceSchema = z
  .object({
    utmSource: z.string().max(100).optional(),
    utmMedium: z.string().max(100).optional(),
    utmCampaign: z.string().max(150).optional(),
    referrer: z.string().max(300).optional(),
    landingPage: z.string().max(300).optional(),
  })
  .optional()

export const OwnerLeadSchema = z.object({
  target: z.literal("OWNER"),
  ...LeadContactFields,
  email: z.string().trim().email("Format email tidak valid").optional().or(z.literal("")),
  service: z.enum(["hk-on-demand", "co-hosting", "full-management", "undecided"]),
  propertyType: z.enum(["rumah", "apartemen", "villa"]),
  location: z.string().trim().min(2, "Lokasi wajib diisi").max(120),
  units: z.number().int().min(1, "Jumlah kamar/unit minimal 1").max(500),
  propertyStatus: z.enum(["ota-live", "not-listed", "new-build"]),
  source: LeadSourceSchema,
})

export const EventLeadSchema = z
  .object({
    target: z.literal("EVENT"),
    ...LeadContactFields,
    eventType: z.enum(["wedding", "gathering", "shooting"]),
    eventDate: isoDate,
    backupDate: isoDate.optional().or(z.literal("")),
    startTime: timeOfDay,
    endTime: timeOfDay,
    guests: z.number().int().min(1, "Jumlah tamu/kru minimal 1").max(1000),
    property: z.string().trim().min(2).max(120),
    specialNeeds: z.array(z.enum(["music", "decoration", "catering", "overnight"])).max(4).default([]),
    // Type-specific questions
    weddingSession: z.enum(["akad", "resepsi", "keduanya"]).optional(),
    ownVendor: z.boolean().optional(),
    earlyDecoration: z.boolean().optional(),
    shootPurpose: z.enum(["komersial", "pribadi"]).optional(),
    heavyEquipment: z.boolean().optional(),
    notes: z.string().trim().max(500).optional(),
    source: LeadSourceSchema,
  })
  .refine((d) => d.endTime > d.startTime, {
    message: "Jam selesai harus setelah jam mulai",
    path: ["endTime"],
  })

export const StayLeadSchema = z
  .object({
    target: z.literal("STAY"),
    ...LeadContactFields,
    need: z.enum(["notify", "inquiry"]),
    property: z.string().trim().min(2).max(120),
    checkIn: isoDate,
    checkOut: isoDate,
    guests: z.number().int().min(1).max(50),
    source: LeadSourceSchema,
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Tanggal check-out harus setelah tanggal check-in",
    path: ["checkOut"],
  })

export const LeadSchema = z.union([OwnerLeadSchema, EventLeadSchema, StayLeadSchema])

export type LoginInput = z.infer<typeof LoginSchema>
export type ReservationInput = z.infer<typeof ReservationSchema>
export type ExpenseInput = z.infer<typeof ExpenseSchema>
export type SeoUpdateInput = z.infer<typeof SeoUpdateSchema>
export type OwnerLeadInput = z.infer<typeof OwnerLeadSchema>
export type EventLeadInput = z.infer<typeof EventLeadSchema>
export type StayLeadInput = z.infer<typeof StayLeadSchema>
export type LeadInput = z.infer<typeof LeadSchema>
