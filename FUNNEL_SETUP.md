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

## Bahasa (i18n)

Semua teks funnel ada di `lib/i18n/funnel/<bahasa>.ts` untuk 9 bahasa situs (EN default, ID, JA,
ZH-CN, ZH-TW, FR, ES, DE, RU) dan dipanggil lewat `t("f....")` dari `useLocalization()`.
TypeScript menolak build jika satu bahasa kehilangan kunci, dan test `tests/funnel-i18n.test.ts`
memastikan placeholder `{...}` sama di semua bahasa. Bahasa pengunjung disimpan di lead
(`details.language`), sehingga balasan pertama admin (`reply_whatsapp_url`) memakai bahasa tersebut.
Notifikasi internal tim tetap berbahasa Indonesia.

## Environment variables

| Variabel | Wajib | Fungsi |
|---|---|---|
| `NEXT_PUBLIC_WA_OWNER` | Disarankan | Nomor WhatsApp produk Kinghouse (HK on Demand, Co-Hosting, Full Management), format `62812…`. |
| `NEXT_PUBLIC_WA_GUEST` | Disarankan | Nomor WhatsApp tamu: menginap & sewa event di properti Kinghouse. Kosong = hotline utama. Nilai `NEXT_PUBLIC_*` ditanam saat build: wajib Redeploy setelah diubah. |
| `SUPABASE_SERVICE_ROLE_KEY` + tabel `leads` | Salah satu dari dua tujuan lead | Simpan lead ke Supabase. Jalankan bagian `4. LEADS TABLE` di `supabase/schema.sql`. Tabel ini RLS tanpa policy publik, jadi **wajib service role key** (anon key tidak bisa menulis). |
| `LEAD_WEBHOOK_URL` | Salah satu dari dua tujuan lead | Kirim lead ke Google Sheet / Make / Zapier / CRM, sekaligus notifikasi grup tim. |
| `LEAD_WEBHOOK_SECRET` | Opsional | Dikirim sebagai header `X-Kinghouse-Secret`. |
| `CRON_SECRET` | Disarankan | String acak. Vercel Cron mengirimnya otomatis; setelah diisi, sinkronisasi iCal (`/api/erp/ical-sync?action=sync-all`) hanya bisa dipicu cron atau admin. |

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

## Notifikasi tim & batas waktu balasan

- **Batas balasan** dihitung dalam jam kantor (Senin–Jumat 08.00–18.00 WIB): Stay 15 menit, Event 30 menit,
  Owner 1 jam. Lead Jumat 17.50 untuk Owner jatuh tempo Senin 08.50. Hari libur nasional belum dikecualikan.
- **Notifikasi lead baru** lewat `LEAD_WEBHOOK_URL` (Google Sheet + email dari Apps Script). Payload berisi
  `notification` (teks ringkasan) dan `reply_whatsapp_url`: link chat ke nomor lead dengan *Balasan admin
  pertama* dari Panduan Respons, sudah terisi data form. Di Apps Script, tambahkan link itu ke isi email.
- **Daftar harian PIC**: simpan query "lead lewat batas" di Supabase SQL Editor (lihat panduan setup tabel).

## Cek ketersediaan (Funnel B1)

"Cek Ketersediaan" menggabungkan reservasi yang sudah tersinkron di ERP/Supabase dengan **kalender iCal
Airbnb/Agoda yang dibaca langsung saat itu** (cache 5 menit), sehingga booking yang masuk setelah cron
harian tetap terdeteksi. Jika kalender OTA tidak bisa dibaca, atau properti belum punya URL iCal
(saat ini Bright & Airy Apartment Palmerah), website menampilkan "Kemungkinan tersedia" dan meminta
konfirmasi via WhatsApp alih-alih menjanjikan tanggal. Tambahkan `airbnbIcalUrl` di `lib/data.ts` agar
properti tersebut juga terverifikasi.

## GA4

Event baru (sudah terkirim ke `dataLayer` dan `gtag`):

- `submit_owner_form`, `submit_event_form` → tandai sebagai **Key event** di GA4 Admin.
- `submit_stay_form` (Beri tahu saya), `check_availability` (dengan `availability_result` dan `availability_verified`).
- `whatsapp_click` tetap memakai nama lama (riwayat & Key event tidak putus) dengan parameter baru `funnel` = `owner | stay | event | general`.
- `/thanks` adalah halaman konversi (noindex). Data pribadi tidak masuk URL: ringkasan dikirim lewat `sessionStorage`.

UTM (`utm_source`, `utm_medium`, `utm_campaign`) + referrer + landing page dicatat otomatis di awal sesi
dan ikut tersimpan di setiap lead. Pasang UTM di link bio Instagram, Google Business, dan iklan.

## Keamanan database (wajib, sekali jalan)

Skema lama memberi anon key publik akses baca **dan** tulis/hapus ke `reservations`, `expenses`, dan
`blog_posts` (data tamu & keuangan). Setelah `SUPABASE_SERVICE_ROLE_KEY` terpasang di Vercel dan
di-redeploy, jalankan `supabase/migrations/20261024_restrict_public_access.sql` di SQL Editor.
Setelah itu publik hanya bisa membaca artikel blog berstatus *Published*.

## Keputusan owner (Okt 2026) yang sudah diterapkan

- **WhatsApp 2 nomor**: produk Kinghouse (`NEXT_PUBLIC_WA_OWNER`) dan tamu menginap/event (`NEXT_PUBLIC_WA_GUEST`).
- **HK on Demand tetap di website ini** dengan halaman SEO sendiri `/airbnb-cleaning-jakarta`
  (schema Service + FAQ). Saran: pasang link dari kinghousecleaning.id ke halaman ini.
- **Fee Full Management**: apartemen 23%, villa & rumah 6+ kamar 15–18% (nego per properti).
  Satu sumber: `MANAGEMENT_FEES` di `lib/constants.ts`. Co-Hosting tampil "Fee sesuai penawaran".
- **Aturan acara** dikirim via OTA/WhatsApp setelah booking; web menampilkan catatan itu.

## Yang masih perlu diputuskan tim

- (Opsional) Jika suatu saat batas musik, deposit, dekorasi pagi, atau penahanan tanggal ingin tampil
  di web, tambahkan kuncinya ke kamus `lib/i18n/funnel` dan ke `EVENT_VENUE_RULES`.
- PIC per target (kolom `pic` di Sheet/tabel).

Di luar kode (sesuai dokumen): auto-reply menu WhatsApp Business, label Owner/Stay/Event, quick reply
dari Panduan Respons, dan pengingat follow-up 1 & 2.
