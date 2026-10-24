# Funnel Setup — Owner / Stay / Event

Implementasi kode dari dokumen *Setup & Implementasi Funnel kinghousemanagement.com*.
Semua konfigurasi funnel ada di `lib/funnel/config.ts`.

## Alur di website

| Tahap | Pemilik (OWNER) | Menginap (STAY) | Event (EVENT) |
|---|---|---|---|
| Pintu masuk | Beranda → "Kelola Properti Saya" → `/owner-services#layanan` | Beranda → kartu "Menginap" → `/villas` | Beranda → kartu "Acara & Event" → `/events#jenis-acara` |
| Pilih kebutuhan | 3 kartu layanan (HK on Demand, Co-Hosting, Full Management) | Halaman properti | 3 kartu: Wedding, Gathering & Ulang Tahun, Shooting |
| Kualifikasi | Form 8 field (`#owner-form`, juga dipakai di `/management-inquiry`) | "Cek Ketersediaan" → tanggal alternatif + "Beri tahu saya" | Form event + pertanyaan khusus per jenis acara (`#event-form`) |
| Kirim | `POST /api/leads` dengan tag `OWNER` + layanan | `STAY` + `notify` | `EVENT` + jenis acara |
| Konfirmasi | `/thanks`: ringkasan + tombol WhatsApp berisi ringkasan | sama + link kembali ke properti | sama + link pricelist |

Tombol WhatsApp melayang menyesuaikan halaman: halaman pemilik → pesan owner, `/events` → pesan event,
halaman properti → pesan menginap, halaman lain → pesan menu 1/2/3.

## Environment variables

| Variabel | Wajib | Fungsi |
|---|---|---|
| `NEXT_PUBLIC_WA_OWNER`, `NEXT_PUBLIC_WA_STAY`, `NEXT_PUBLIC_WA_EVENT` | Tidak | Nomor WhatsApp per jalur (format `62812…`). Kosong = hotline utama. |
| `SUPABASE_SERVICE_ROLE_KEY` + tabel `leads` | Salah satu dari dua tujuan lead | Simpan lead ke Supabase. Jalankan bagian `4. LEADS TABLE` di `supabase/schema.sql`. Tabel ini RLS tanpa policy publik, jadi **wajib service role key** (anon key tidak bisa menulis). |
| `LEAD_WEBHOOK_URL` | Salah satu dari dua tujuan lead | Kirim lead ke Google Sheet / Make / Zapier / CRM, sekaligus notifikasi grup tim. |
| `LEAD_WEBHOOK_SECRET` | Opsional | Dikirim sebagai header `X-Kinghouse-Secret`. |

Jika keduanya belum diatur, form tetap berjalan (pengunjung tetap diarahkan ke `/thanks` dan WhatsApp),
tetapi lead hanya tercatat di log server (`[lead] … not persisted`).

### Google Sheet tanpa CRM (tahap awal)

1. Buat Sheet dengan header kolom: `id, created_at, target, need, name, whatsapp, email, event_date, check_out, guests_or_units, property, status, priority, route_to, pic, first_response_due_at, utm_source, utm_medium, utm_campaign, referrer, landing_page, notes`, lalu tambahkan kolom manual `first_response_at, last_contact_at, lost_reason`.
2. Extensions → Apps Script:

```js
const SECRET = "ganti-dengan-rahasia" // sama dengan ?secret= di LEAD_WEBHOOK_URL

function doPost(e) {
  if (e.parameter.secret !== SECRET) return ContentService.createTextOutput("forbidden")
  const { lead, notification } = JSON.parse(e.postData.contents)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  sheet.appendRow(headers.map((h) => (lead[h] ?? "")))
  MailApp.sendEmail("info@kinghousemanagement.com", "Lead baru " + lead.id, notification)
  return ContentService.createTextOutput("ok")
}
```

3. Deploy → Web app (Execute as: Me, Access: Anyone) → set
   `LEAD_WEBHOOK_URL=https://script.google.com/macros/s/…/exec?secret=ganti-dengan-rahasia`.
   Apps Script tidak bisa membaca header, karena itu rahasia dikirim lewat query string.

## GA4

Event baru (sudah terkirim ke `dataLayer` dan `gtag`):

- `submit_owner_form`, `submit_event_form` → tandai sebagai **Key event** di GA4 Admin.
- `submit_stay_form` (Beri tahu saya), `check_availability` (dengan `availability_result`).
- `whatsapp_click` tetap memakai nama lama (riwayat & Key event tidak putus) dengan parameter baru `funnel` = `owner | stay | event | general`.
- `/thanks` adalah halaman konversi (noindex). Data pribadi tidak masuk URL: ringkasan dikirim lewat `sessionStorage`.

UTM (`utm_source`, `utm_medium`, `utm_campaign`) + referrer + landing page dicatat otomatis di awal sesi
dan ikut tersimpan di setiap lead. Pasang UTM di link bio Instagram, Google Business, dan iklan.

## Yang masih perlu diputuskan tim

- Satu atau tiga nomor WhatsApp (isi env `NEXT_PUBLIC_WA_*`).
- HK on Demand: tetap di situs ini (sekarang di-route ke `cleaning`) atau dialihkan ke Kinghouse Cleaning.
- Fee final Full Management (kartu sekarang menulis "15%–20%").
- Aturan venue yang belum tampil karena belum dikonfirmasi: batas musik, deposit, dekorasi sejak pagi,
  penahanan tanggal. Isi `value` di `EVENT_VENUE_RULES` dan aturan otomatis muncul di `/events`.
- PIC per target (kolom `pic` di Sheet/tabel).

Di luar kode (sesuai dokumen): auto-reply menu WhatsApp Business, label Owner/Stay/Event, quick reply
dari Panduan Respons, dan pengingat follow-up 1 & 2.
