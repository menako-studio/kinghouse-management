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
  receiptUrl: z.string().url("URL kwitansi tidak valid").optional().or(z.literal("")),
})

export const SeoUpdateSchema = z.object({
  slug: z.string().min(1, "Slug properti wajib"),
  metaTitle: z.string().min(10, "Meta title minimal 10 karakter").max(70, "Meta title maksimal 70 karakter"),
  metaDescription: z.string().min(50, "Meta description minimal 50 karakter").max(160, "Meta description maksimal 160 karakter"),
  focusKeyword: z.string().min(2, "Focus keyword wajib diisi"),
  canonicalUrl: z.string().url("URL canonical tidak valid").optional().or(z.literal("")),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type ReservationInput = z.infer<typeof ReservationSchema>
export type ExpenseInput = z.infer<typeof ExpenseSchema>
export type SeoUpdateInput = z.infer<typeof SeoUpdateSchema>
