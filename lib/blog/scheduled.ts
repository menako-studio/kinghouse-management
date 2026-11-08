import type { BlogPost } from "@/lib/types"

// ─── EDITORIAL CALENDAR ───────────────────────────────────────────────────────
// Articles written ahead of time and published automatically on `publishedAt`
// (see lib/blog/schedule.ts). Until then they are invisible on the site: not in
// /blog, the sitemap or related posts, and their URL returns 404.
//
// Campaign: 16 November – 16 December 2026, one article every 10 days at 07:00 WIB.
// Prices and fees quoted below come from lib/data.ts and lib/constants.ts
// (MANAGEMENT_FEES); update the articles if those change.

const AUTHOR = {
  name: "Tim Kinghouse",
  role: "Property Management Specialist",
  avatar: "/brand/icon-favicon-simplified.png",
}

export const SCHEDULED_POSTS: BlogPost[] = [
  // ── 1. Owner checklist before the year-end peak ───────────────────────────
  {
    id: "blog-2026-11-16-persiapan-nataru",
    slug: "persiapan-airbnb-libur-natal-tahun-baru",
    title: "Checklist Persiapan Airbnb untuk Libur Natal & Tahun Baru",
    excerpt:
      "Desember adalah musim tersibuk untuk sewa harian di Jabodetabek. Ini 9 hal yang perlu pemilik properti siapkan sejak pertengahan November agar kalender penuh dan tamu puas.",
    category: "owner-tips",
    publishedAt: "2026-11-16T07:00:00+07:00",
    author: AUTHOR,
    heroImage: "/properties/versatile-house/new/VersatileHouse_03_Master_Bedroom.jpg",
    tags: ["Airbnb", "Libur Natal", "Tahun Baru", "Tips Pemilik", "Dynamic Pricing"],
    seoKeywords: [
      "persiapan airbnb",
      "persiapan airbnb libur akhir tahun",
      "tips airbnb natal tahun baru",
      "harga airbnb tahun baru",
      "checklist host airbnb",
    ],
    seoTitle: "Checklist Airbnb Libur Natal & Tahun Baru | Kinghouse",
    metaDescription:
      "9 persiapan wajib bagi pemilik Airbnb sebelum libur Natal & Tahun Baru: harga, minimum menginap, kebersihan, dan aturan rumah. Mulai dari pertengahan November.",
    readTime: 6,
    featured: true,
    language: "id",
    content: `Libur Natal dan Tahun Baru adalah periode dengan permintaan sewa harian paling tinggi di Jabodetabek. Keluarga mencari tempat berkumpul, kantor mencari venue acara akhir tahun, dan wisatawan domestik mencari tempat menginap dekat pusat kota. Tamu untuk periode ini biasanya memesan beberapa minggu sebelumnya, jadi pertengahan November adalah waktu yang tepat untuk persiapan Airbnb Anda.

Berikut checklist yang kami pakai untuk properti yang kami kelola.

![Kamar utama villa yang siap menyambut tamu libur akhir tahun](/properties/versatile-house/new/VersatileHouse_03_Master_Bedroom.jpg)

## Kalender & harga

### 1. Buka kalender sampai Januari

Pastikan kalender Airbnb dan kanal lain sudah terbuka minimal sampai pertengahan Januari. Listing dengan kalender tertutup tidak muncul di pencarian tanggal tersebut, sehingga Anda kehilangan tamu yang memesan jauh hari.

### 2. Pasang harga khusus musim ramai

Harga flat sepanjang tahun membuat Anda menjual murah di tanggal paling dicari. Tentukan tiga level harga:

- **Hari biasa** di awal Desember
- **Akhir pekan dan malam Natal** (24–25 Desember)
- **Malam Tahun Baru** (30 Desember – 1 Januari), level tertinggi

Sebagai gambaran, villa yang kami kelola di Jagakarsa memakai tarif musim ramai yang lebih tinggi dari tarif akhir pekan biasa. Kuncinya: naikkan harga di tanggal yang pasti dicari, tetapi pantau terus. Jika 10 hari sebelum tanggal masih kosong, turunkan bertahap.

### 3. Atur minimum menginap

Untuk malam Tahun Baru, minimum 2 malam membantu menghindari "lubang" satu malam yang sulit terjual. Di hari biasa, minimum 1 malam tetap paling fleksibel.

## Aturan & kesiapan properti

### 4. Tulis aturan rumah dengan jelas

Akhir tahun identik dengan pesta. Tulis secara spesifik:

- Jumlah tamu maksimal (termasuk tamu yang hanya berkunjung)
- Jam tenang dan aturan musik
- Kebijakan kembang api di area properti
- Biaya tambahan jika ada kerusakan

Aturan yang jelas di listing jauh lebih efektif daripada menegur tamu saat acara sudah berjalan.

### 5. Jadwalkan pembersihan sebelum musim ramai

Lakukan pembersihan menyeluruh (deep cleaning) di pertengahan November: kasur, sofa, AC, dapur, dan kamar mandi. Setelah itu, pastikan tim housekeeping siap untuk pergantian tamu yang rapat di akhir Desember. Jika Anda tidak punya tim sendiri, layanan [cleaning Airbnb & villa on demand](/airbnb-cleaning-jakarta) bisa dipesan per kunjungan.

### 6. Cek stok perlengkapan

Hitung linen, handuk, dan perlengkapan mandi untuk minimal dua kali pergantian tamu. Di musim ramai, laundry sering terlambat, jadi stok cadangan sangat membantu.

### 7. Periksa fasilitas yang sering rusak

AC, pemanas air, pompa air, dan WiFi adalah sumber keluhan terbanyak. Servis sebelum Desember lebih murah daripada mengembalikan uang tamu karena AC mati di malam Tahun Baru.

## Listing & komunikasi

### 8. Perbarui foto dan judul listing

Jika properti Anda cocok untuk kumpul keluarga atau acara kecil, sebutkan di judul dan foto pertama. Tamu yang mencari "villa untuk tahun baru" memutuskan dari beberapa foto pertama. Baca juga [cara optimasi listing agar tampil di halaman pertama](/blog/airbnb-seo-tips-halaman-1-pencarian).

### 9. Siapkan respons cepat

Di musim ramai, tamu menghubungi beberapa listing sekaligus dan memesan yang paling cepat membalas. Siapkan template jawaban untuk pertanyaan umum: harga, parkir, check-in, dan aturan acara.

## Tidak sempat mengurus semuanya?

Kinghouse menangani harga, komunikasi tamu, dan housekeeping untuk villa dan apartemen di Jabodetabek. Anda bisa memilih housekeeping on demand, co-hosting, atau full management. [Lihat layanan untuk pemilik properti](/owner-services), contoh [properti yang kami kelola](/villas), atau [minta proposal gratis](/management-inquiry).`,
  },

  // ── 2. Year-end office party venue ────────────────────────────────────────
  {
    id: "blog-2026-11-26-year-end-party",
    slug: "venue-year-end-party-kantor-jakarta-selatan",
    title: "Venue Year-End Party Kantor di Jakarta Selatan: Panduan Memilih Villa",
    excerpt:
      "Mencari venue year-end party kantor yang lebih santai dari ballroom hotel? Panduan memilih villa: kapasitas, durasi sewa, biaya, dan checklist booking.",
    category: "jabodetabek-guide",
    publishedAt: "2026-11-26T07:00:00+07:00",
    author: AUTHOR,
    heroImage: "/properties/versatile-house/events/evening-garden-party-banquet.jpg",
    tags: ["Year-End Party", "Acara Kantor", "Venue Jakarta Selatan", "Villa Event"],
    seoKeywords: [
      "venue year-end party kantor",
      "venue year end party jakarta",
      "tempat acara akhir tahun kantor jakarta selatan",
      "sewa villa untuk acara kantor",
      "venue gathering kantor jakarta",
    ],
    seoTitle: "Venue Year-End Party Kantor Jakarta Selatan | Kinghouse",
    metaDescription:
      "Panduan memilih villa untuk year-end party kantor di Jakarta Selatan: kapasitas, paket 6 dan 12 jam, kisaran biaya, dan checklist sebelum booking.",
    readTime: 5,
    featured: false,
    language: "id",
    content: `Banyak tim kini memilih merayakan akhir tahun di tempat yang lebih personal daripada ballroom hotel. Villa dengan taman memberi suasana santai, ruang untuk permainan tim, dan privasi penuh. Berikut panduan memilih venue year-end party kantor di Jakarta Selatan.

![Taman villa yang ditata untuk makan malam acara kantor](/properties/versatile-house/events/evening-garden-party-banquet.jpg)

## Kenapa villa cocok untuk acara kantor?

- **Privasi penuh.** Seluruh area dipakai tim Anda saja, tanpa tamu lain.
- **Fleksibel.** Anda bebas mengatur dekorasi, susunan acara, dan katering.
- **Ruang beragam.** Taman untuk acara utama, ruang dalam untuk presentasi, dan dapur untuk katering.
- **Bisa sekalian menginap.** Cocok untuk tim yang ingin lanjut ke sesi perencanaan tahun depan keesokan harinya.

## Checklist memilih venue

### 1. Tentukan jumlah peserta lebih dulu

Kapasitas menentukan paket dan harga. Untuk Versatile House di Jagakarsa, paket acara dibagi berdasarkan jumlah tamu: 20, 30, 40, dan 50 orang. Hitung juga tamu tambahan seperti vendor, fotografer, dan MC.

### 2. Pilih durasi: 6 jam atau 12 jam

- **6 jam (half day)** cukup untuk makan malam, sambutan, dan hiburan. Harga mulai **Rp 2,8 juta** (hari kerja, 20 orang) hingga **Rp 6,8 juta** (akhir pekan, 50 orang).
- **12 jam (full day)** cocok jika ada sesi kerja di siang hari lalu dilanjutkan pesta di malam hari. Harga mulai **Rp 4 juta** hingga **Rp 8,4 juta**.

Hari kerja selalu lebih hemat daripada akhir pekan. Jika memungkinkan, adakan acara di hari Kamis atau Jumat malam.

Daftar harga lengkap ada di halaman [acara & venue](/events). Harga dapat berubah, jadi konfirmasikan tanggal Anda sebelum memesan.

### 3. Cek akses dan parkir

Tanyakan berapa mobil yang bisa parkir dan apakah tersedia area drop-off. Untuk acara malam, pastikan jalan menuju lokasi mudah ditemukan dengan aplikasi peta.

### 4. Pahami aturan venue

Sebelum membayar uang muka, tanyakan:

- Batas jam musik dan jam selesai acara
- Apakah boleh membawa katering dan vendor sendiri
- Ketentuan dekorasi (paku, lakban, balon)
- Kebijakan pembatalan dan perubahan tanggal

### 5. Pesan lebih awal

Tanggal Jumat dan Sabtu di pertengahan Desember paling cepat habis. Idealnya, kunci tanggal 3–4 minggu sebelum acara.

## Contoh susunan acara 6 jam

- 16.00 – Kedatangan dan welcome drink di taman
- 17.00 – Sambutan pimpinan dan apresiasi karyawan
- 18.00 – Makan malam
- 19.30 – Permainan tim dan doorprize
- 21.00 – Foto bersama dan penutupan

## Lihat venue-nya

[Versatile House di Jagakarsa](/locations/jagakarsa/villas/versatile-house-jagakarsa) memiliki taman, kolam renang, dan 5 kamar tidur bagi yang ingin menginap. Lihat detail [paket corporate retreat](/events/corporate-retreat-jagakarsa) atau [kirim tanggal acara Anda](/events) untuk cek ketersediaan.`,
  },

  // ── 3. New Year's Eve villa (guest intent) ────────────────────────────────
  {
    id: "blog-2026-12-06-villa-tahun-baru",
    slug: "sewa-villa-malam-tahun-baru-jakarta-selatan",
    title: "Sewa Villa untuk Malam Tahun Baru di Jakarta Selatan: Tips & Harga",
    excerpt:
      "Merayakan malam Tahun Baru bersama keluarga atau teman di villa privat dengan kolam renang. Kisaran harga, cara memilih, dan tips agar tidak kehabisan tanggal.",
    category: "jabodetabek-guide",
    publishedAt: "2026-12-06T07:00:00+07:00",
    author: AUTHOR,
    heroImage: "/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg",
    tags: ["Tahun Baru", "Sewa Villa", "Jakarta Selatan", "Villa Kolam Renang"],
    seoKeywords: [
      "sewa villa untuk malam tahun baru",
      "sewa villa malam tahun baru jakarta",
      "villa tahun baru jakarta selatan",
      "villa private pool jakarta untuk tahun baru",
      "tempat merayakan tahun baru bersama keluarga jakarta",
    ],
    seoTitle: "Sewa Villa Malam Tahun Baru Jakarta Selatan | Kinghouse",
    metaDescription:
      "Tips sewa villa untuk malam Tahun Baru di Jakarta Selatan: kisaran harga musim ramai, kapasitas, aturan acara, dan cara memesan sebelum tanggal habis.",
    readTime: 5,
    featured: false,
    language: "id",
    content: `Sewa villa untuk malam Tahun Baru semakin populer: tidak perlu terjebak macet ke luar kota, tidak berdesakan di keramaian, dan semua anggota keluarga bisa berkumpul di satu tempat. Jakarta Selatan, khususnya Jagakarsa, menawarkan suasana hijau dan tenang tanpa harus keluar dari Jakarta.

![Kolam renang dan taman villa privat di Jagakarsa](/properties/versatile-house/new/VersatileHouse_01_Pool_Hero.jpg)

## Kapan sebaiknya memesan?

Tanggal 31 Desember adalah tanggal dengan permintaan tertinggi dalam setahun. Banyak villa besar sudah penuh sejak awal Desember. Jika masih ada tanggal, segera kunci, terutama untuk rombongan di atas 10 orang.

## Kisaran harga villa saat musim ramai

Harga musim ramai lebih tinggi daripada akhir pekan biasa. Sebagai contoh, tarif musim ramai Versatile House di Jagakarsa bergantung pada jumlah kamar yang dibuka:

- **2 kamar tidur:** Rp 3,5 juta per malam
- **4 kamar tidur:** Rp 5,99 juta per malam
- **5 kamar tidur:** Rp 6,99 juta per malam

Harga di atas belum termasuk biaya kebersihan dan biaya layanan platform. Untuk malam Tahun Baru, banyak villa juga menerapkan minimum 2 malam. Cek harga final dan ketersediaan di halaman [Versatile House](/locations/jagakarsa/villas/versatile-house-jagakarsa).

## Cara memilih villa untuk Tahun Baru

### 1. Hitung kapasitas dengan jujur

Jumlah tamu menentukan harga dan kenyamanan. Sebutkan juga jika ada tamu yang hanya datang untuk acara tanpa menginap. Sebagian besar villa membatasi jumlah total orang di properti.

### 2. Pastikan fasilitas untuk acara

Untuk perayaan, perhatikan:

- Taman atau teras untuk berkumpul dan barbeku
- Dapur lengkap untuk memasak bersama
- Kolam renang (pastikan ada pengawasan untuk anak-anak)
- Cukup kamar mandi untuk rombongan

### 3. Baca aturan rumah

Tanyakan aturan musik, kembang api, dan jam tenang. Banyak kompleks perumahan punya aturan sendiri. Lebih baik tahu dari awal daripada acara terpaksa dihentikan.

### 4. Cek ulasan tamu sebelumnya

Ulasan memberi gambaran nyata tentang kebersihan dan respons tuan rumah. Versatile House memiliki rating 4,9 dari 68 ulasan di Airbnb.

## Tips agar malam Tahun Baru lancar

- Datang lebih awal untuk menyiapkan makanan sebelum malam
- Pesan katering atau bahan masakan sehari sebelumnya, karena banyak toko tutup lebih awal
- Siapkan tempat sampah tambahan agar check-out lebih mudah
- Simpan nomor WhatsApp tuan rumah untuk keperluan mendadak

## Pilihan lain di Jabodetabek

Untuk pasangan atau keluarga kecil, apartemen harian bisa menjadi pilihan yang lebih hemat. Lihat semua [villa dan apartemen kami](/villas) di Jagakarsa, Tangerang, Palmerah, dan Cikarang.`,
  },

  // ── 4. Management fees explained (owner, commercial intent) ───────────────
  {
    id: "blog-2026-12-16-biaya-jasa-kelola",
    slug: "biaya-jasa-kelola-airbnb-jakarta",
    title: "Biaya Jasa Kelola Airbnb di Jakarta: Rincian Fee & Contoh Hitungan",
    excerpt:
      "Sebelum menyerahkan properti ke jasa pengelola, pahami dulu cara fee dihitung, apa yang termasuk, dan berapa yang Anda terima. Lengkap dengan contoh hitungan.",
    category: "revenue-management",
    publishedAt: "2026-12-16T07:00:00+07:00",
    author: AUTHOR,
    heroImage: "/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg",
    tags: ["Jasa Kelola Airbnb", "Biaya Pengelolaan", "Co-Hosting", "Pemilik Properti"],
    seoKeywords: [
      "biaya jasa kelola airbnb",
      "fee co host airbnb jakarta",
      "jasa manajemen airbnb jakarta",
      "berapa persen fee pengelola airbnb",
    ],
    seoTitle: "Biaya Jasa Kelola Airbnb di Jakarta: Rincian Fee | Kinghouse",
    metaDescription:
      "Berapa fee jasa kelola Airbnb di Jakarta? Penjelasan sistem bagi hasil, apa saja yang termasuk, dan contoh hitungan pendapatan pemilik properti.",
    readTime: 6,
    featured: true,
    language: "id",
    content: `Pertanyaan pertama hampir setiap pemilik properti soal biaya jasa kelola Airbnb adalah: berapa fee-nya, dan berapa yang saya terima? Artikel ini menjelaskan cara umum fee dihitung dan contoh hitungannya.

![Apartemen bergaya hotel yang dikelola Kinghouse di Tangerang](/properties/sky-house/SkyHouse_IKEA_KamarUtama_Wide.jpeg)

## Model biaya yang umum

Ada tiga model yang sering dipakai jasa pengelola:

- **Bagi hasil (persentase pendapatan).** Pengelola mendapat persentase dari pendapatan sewa. Jika properti tidak tersewa, pengelola juga tidak dibayar. Model ini paling umum.
- **Biaya tetap bulanan.** Anda membayar jumlah yang sama setiap bulan, berapa pun okupansinya.
- **Biaya per layanan.** Misalnya per kali pembersihan atau per check-in. Cocok jika Anda hanya butuh bantuan sebagian.

Kinghouse memakai model bagi hasil, tanpa biaya tetap bulanan, dan biaya per layanan untuk housekeeping on demand.

## Fee Kinghouse

- **Apartemen:** 23% dari pendapatan sewa
- **Villa dan rumah dengan 6 kamar atau lebih:** 15–18% dari pendapatan sewa
- **Co-hosting:** fee disesuaikan dengan properti dan lingkup pekerjaan
- **Housekeeping on demand:** dibayar per kunjungan

Persentase final dan dasar perhitungannya ditulis di perjanjian sebelum kerja sama dimulai.

## Apa saja yang termasuk?

Untuk full management, fee mencakup pekerjaan harian yang biasanya paling menyita waktu pemilik:

- Foto profesional dan penulisan listing
- Pengaturan harga harian sesuai musim dan permintaan
- Komunikasi dengan tamu 24/7, dari pertanyaan sampai check-out
- Koordinasi housekeeping dan linen untuk setiap tamu
- Koordinasi perawatan dan perbaikan
- Laporan pendapatan bulanan

Biaya operasional seperti listrik, air, internet, dan bahan habis pakai umumnya tetap menjadi tanggungan pemilik. Tanyakan hal ini secara spesifik ke pengelola mana pun yang Anda pertimbangkan.

## Contoh hitungan sederhana

### Apartemen

Misalnya apartemen Anda menghasilkan pendapatan sewa **Rp 10.000.000** dalam satu bulan.

- Fee pengelola 23%: **Rp 2.300.000**
- Diterima pemilik sebelum biaya operasional: **Rp 7.700.000**

### Villa

Untuk villa 6 kamar dengan pendapatan sewa **Rp 40.000.000** per bulan dan fee 15%:

- Fee pengelola: **Rp 6.000.000**
- Diterima pemilik sebelum biaya operasional: **Rp 34.000.000**

Angka di atas hanya ilustrasi untuk menunjukkan cara hitung, bukan proyeksi pendapatan properti Anda. Pendapatan nyata bergantung pada lokasi, ukuran, kondisi properti, dan musim.

## Kapan jasa pengelola layak dipakai?

Jasa pengelola biasanya sepadan jika:

- Anda tidak punya waktu membalas tamu setiap hari
- Anda tinggal jauh dari lokasi properti
- Harga dan okupansi Anda stagnan
- Anda ingin pendapatan dari properti tanpa mengurus operasional

Jika Anda masih ragu, baca perbandingan lengkap [kelola sendiri vs jasa manajemen](/blog/kelola-sendiri-vs-jasa-manajemen-properti-airbnb).

## Hitung untuk properti Anda

Lihat dulu [properti yang kami kelola](/villas), gunakan [kalkulator pendapatan](/owner-services#calculator) untuk melihat estimasi berdasarkan lokasi dan jumlah kamar, atau [minta proposal gratis](/management-inquiry). Kami membalas dalam 1 jam kerja.`,
  },
]
