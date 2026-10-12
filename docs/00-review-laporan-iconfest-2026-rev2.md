# Review Kritis Laporan ICONFEST 2026: Revisi Kedua (Tim WHEN YAH)

**Dokumen yang direview:** `TEMPLATE SOFTWARE DEVELOPMENT(1).docx` (revisi ke-61, terakhir diubah 10 Okt 2026; penulis: Muhamad Khilqi Alfadillah, Delely Rahmawati Hidayah, Febnawan Fatur Rochman)
**Commit repo saat review:** `f00c8a2` ("update di kelola admin")
**Deployment yang diuji:** https://iconfest.febnawanfr.my.id
**Tanggal review:** 12 Oktober 2026 | **Deadline penyisihan: 16 Oktober 2026**
**Metode:** pembacaan penuh dokumen + audit struktur DOCX (414 paragraf, 20 tabel, 17 gambar) + verifikasi langsung ke kode repo + probe deployment live + fact-check setiap sitasi ke sumber aslinya. Bukti lengkap di Lampiran B.

---

## Ringkasan Eksekutif

Laporan ini **lompatan besar** dari draf pertama: struktur akademik rapi (BAB I sampai V), metodologi dan pengujian dijelaskan dengan angka, keterbatasan ditulis jujur (bagian 4.5 bagus), dan hampir semua klaim teknis cocok dengan kode. Gaya penulisan bersih: tanpa frasa AI-slop, tanpa em dash, konsisten memakai "pengemudi".

**Tetapi belum layak submit apa adanya.** Ada 6 blocker:

| # | Blocker | Bukti singkat | Perbaikan |
|---|---------|---------------|-----------|
| A1 | DAFTAR PUSTAKA kosong | 0 entri setelah heading, padahal 21 sitasi dipakai di teks | Isi dari Lampiran A |
| A2 | Judul masih kosong, daftar isi/gambar/tabel belum digenerate | `[JUDUL KARYA]` di cover; kata pengantar `berjudul " "` | Pilih judul (bagian E), generate TOC |
| A3 | Kode terbaru GAGAL DI-BUILD dan belum ter-deploy | `npm run build` exit 1 (8 error TypeScript); live masih build lama | Perbaiki TS, deploy, uji ulang |
| A4 | Caption/penomoran gambar, tabel, persamaan kacau | Caption "Gambar 0.x", tabel tanpa caption, rujukan silang salah | Checklist bagian A4 |
| A5 | Sisa placeholder draf | "perlu diisi", "Authorization: ***", sel/kolom kosong, typo | Cari lalu ganti (bagian A5) |
| A6 | Klaim keamanan belum sekuat implementasi | Token cek prefix; POST /api/drivers terbuka | Bagian A6 |

Semua bisa dibereskan dalam 1 sampai 2 hari kerja. Urutan aksi ada di bagian G.

---

## A. RUSAK: Wajib Dibereskan Sebelum Submit

### A1. DAFTAR PUSTAKA kosong (0 entri)

**Temuan:** seluruh laporan mengutip 21 sumber, tetapi bagian DAFTAR PUSTAKA sama sekali tidak berisi entri. Laporan yang mengutip tanpa daftar rujukan kehilangan poin di aspek format dan langsung terlihat belum selesai di mata penguji.

**Bukti:** audit XML dokumen: setelah heading "DAFTAR PUSTAKA" terdapat 0 paragraf/tabel berisi teks.

**Perbaikan:** susun daftar pustaka dari **Lampiran A** (21 entri, urut alfabetis, gaya konsisten "dkk."). Semua sitasi utama sudah diverifikasi akurat (Lampiran B), kecuali Cosentino dkk. (2025) yang belum ditemukan sumbernya (lihat B12).

### A2. Judul masih kosong + daftar isi/gambar/tabel belum digenerate

**Temuan:** `[JUDUL KARYA]` masih placeholder di cover; kata pengantar berbunyi `laporan proyek yang berjudul " "`; DAFTAR ISI, DAFTAR GAMBAR, dan DAFTAR TABEL hanya berupa heading tanpa isi.

**Perbaikan:** pilih judul dari **bagian E** (rekomendasi #1), isikan di cover dan kata pengantar; setelah semua caption final, generate daftar isi/gambar/tabel otomatis di Word (References > Table of Contents; Insert Table of Figures); isi nomor halaman; simpan dengan nama file yang benar (bukan `TEMPLATE SOFTWARE DEVELOPMENT(1).docx`).

### A3. Kode terbaru gagal di-build dan belum ter-deploy (klaim 4.3.4 belum berlaku di live)

**Temuan (terverifikasi):**

- `npx tsc --noEmit` pada commit `f00c8a2` menghasilkan **8 error**:
  - `src/components/fleet/drivers/DriverManagementTable.tsx` baris 20 sampai 23: properti `text` hilang pada 4 objek konfigurasi (TS2741).
  - `src/lib/db/driver-service.ts` baris 98 dan 170: cast hasil `stripPin` (TS2352/TS2345).
- `npm run build` **exit 1** ("Failed to compile" pada tahap type check). Versi kode saat ini tidak dapat dijadikan build produksi.
- Deployment live masih build lama. Bukti probe:
  - `PATCH /api/fleet` tanpa token menghasilkan HTTP 400 (kode baru seharusnya 401 "Akses ditolak: sesi dispatcher diperlukan").
  - `GET /api/drivers` di live masih memuat `"pin":"1234"` (kode baru sudah menghapus field ini dari respons publik).
  - `/api/admin/profile` menghasilkan 404 (route baru belum ada di live).

**Konsekuensi:** dua baris klaim di Tabel 4.1/4.2 dan skenario pengujian fungsional 4.3.4 nomor 4 ("Proteksi endpoint: permintaan ditolak") dan nomor 5 ("Isolasi PIN: field PIN tidak disertakan") **tidak dapat direproduksi oleh juri di link deployment**. Juri yang mencoba akan menemukan kebalikannya. Ini risiko paling berbahaya dari daftar ini karena menyangkut kredibilitas tabel pengujian.

**Perbaikan (berurutan):**

1. Perbaiki 8 error TypeScript: tambahkan properti `text` (atau hapus dari tipe) di DriverManagementTable; perbaiki cast `stripPin` di driver-service.
2. Pastikan `npx tsc --noEmit` 0 error dan `npm run build` sukses.
3. Deploy ke server, lalu verifikasi:

```bash
curl -sS -X PATCH https://iconfest.febnawanfr.my.id/api/fleet \
  -H 'Content-Type: application/json' -d '{}' -w '\n%{http_code}\n'   # harus 401

curl -sS https://iconfest.febnawanfr.my.id/api/drivers | grep -c '"pin"'   # harus 0

curl -sS -o /dev/null -w '%{http_code}\n' \
  https://iconfest.febnawanfr.my.id/api/admin/profile                  # harus bukan 404
```

4. Setelah live terbaru, ulangi skenario 4.3.4 dan pastikan isi tabel tetap jujur.

### A4. Caption dan penomoran gambar/tabel/persamaan kacau

**Temuan:**

- Caption teks yang ada hanya 4 buah dan bernomor salah: "Gambar 0.1" sampai "Gambar 0.4" (harusnya 3.x). Nomor 0.x muncul karena field penomoran bab tidak terisi.
- Sebagian judul gambar justru tercetak di dalam berkas gambarnya (terverifikasi via OCR): "Gambar 3.2 Alur skrining CogniPulse", "Gambar 3.3 Arsitektur Sistem", "Gambar 3.4 Diagram Use Case CogniPulse", "Gambar 3.7 Logika Keputusan Dispatcher". Akibatnya caption dobel/tidak seragam antar gambar.
- **Tidak ada satu pun caption tabel** ("Tabel X.Y Judul" tidak ditemukan di seluruh dokumen).
- Rujukan silang salah: Tabel 4.8 baris RM-1 menyebut "(Gambar 3.8 sampai 3.12)", padahal gambar hanya sampai 3.7; yang dimaksud adalah tangkapan implementasi "Gambar 4.1 sampai 4.5".
- Nomor ganda: "Tabel 3.1" dipakai untuk dua tabel berbeda (kebutuhan fungsional dan rangkuman modul); "Tabel 3.2" juga dua kali (kebutuhan nonfungsional dan ambang klasifikasi).
- Persamaan: label pada gambar persamaan adalah (1), (2), (3), (3). Persamaan CFI seharusnya (4) karena teks menyebut "Persamaan 4"; nomor (3) dobel dengan rumus jarak reaksi.

**Perbaikan:** beri caption teks untuk SEMUA gambar (Gambar 3.1 sampai 3.7 dan Gambar 4.1 sampai 4.7) dan SEMUA tabel (Tabel 2.1, 3.1 sampai 3.4, 4.1 sampai 4.8); letakkan di bawah objek; hapus "Gambar 0.x"; rapikan judul yang tercetak di dalam gambar agar tidak dobel; perbaiki rujukan menjadi "(Gambar 4.1 sampai 4.5)"; selesaikan nomor Tabel 3.1/3.2 yang ganda; ubah label persamaan CFI menjadi (4). Setelah final, baru generate DAFTAR GAMBAR/TABEL.

### A5. Sisa placeholder/sisa draf

| Cari | Ganti / tindakan |
|------|------------------|
| "Nilai rata-rata dan rentang waktu **perlu diisi** berdasarkan hasil pencatatan aktual setiap percobaan." (4.3.5) | Hapus kalimat (Tabel 4.7 sudah terisi). Pastikan angka 6,5 / 85,1 / 91,6 detik memang hasil pencatatan 10 percobaan nyata dan siapkan catatan mentahnya bila ditanya penguji. |
| `Token sesi (Authorization: *** pada endpoint ...` (Tabel 4.2) | `Token sesi (Authorization: Bearer) pada endpoint mutasi ...` (tanda kurung ditutup, "***" dihapus) |
| Kolom header kosong di Tabel 4.7 (antara `n` dan `Rata-rata`) | Hapus kolom atau isi |
| Rentang "4 – 11" vs "83 - 106" (Tabel 4.7) | Seragamkan tanda hubung |
| Sel kolom "Pendekatan" kosong, Tabel 2.1 baris 6 (Yogisutanti dkk., 2013) | Isi, mis. "Waktu reaksi (reaction timer) pada 77 dosen; korelasi dengan lama tidur" |
| "ketiga **sskenario**" (4.3.3) | "skenario" |
| Akhir 3.2.1: "...validasi pada populasi masing-masing" | Tambahkan titik akhir kalimat |
| "Hubungan ... dapat diperlihatkan melalui grafik tersendiri apabila diperlukan." (4.3.2) | Hapus (sisa gambar yang dihapus) atau perjelas |

### A6. Keamanan: klaim vs implementasi

**Temuan (verifikasi kode):**

- Token sesi hanya divalidasi berdasarkan awalan (`drv_` / `disp_`), belum ditandatangani. Nilai palsu dengan awalan benar dianggap valid; komentar di kode sendiri menyebut ini "proteksi minimal".
- `POST /api/drivers` (pendaftaran pengemudi baru) belum dilindungi guard dispatcher.
- `GET /api/fleet` dan `GET /api/assessments?driverId=` masih terbuka tanpa autentikasi (memuat data pengemudi termasuk alamat dan riwayat medis; field PIN sudah di-strip untuk /api/drivers, pastikan konsisten untuk semua endpoint).

**Konsekuensi terhadap laporan:** KF-07 ("Kredensial dan sesi terlindungi") dan baris "Proteksi sesi" di Tabel 4.2 terlalu kuat untuk kondisi saat ini.

**Perbaikan minimal sebelum submit:** pasang guard dispatcher di `POST /api/drivers`; lunakkan kalimat klaim (mis. "proteksi sesi berbasis token; penguatan autentikasi direncanakan") atau perkuat implementasi (token ditandatangani); cantumkan pula di 4.5 sebagai keterbatasan. Klaim di tabel harus sama persis dengan perilaku live yang ter-deploy.

---

## B. REVISI: Penting, Bukan Blocker

**B1. Screenshot Gambar 4.1 masih build lama.** OCR menunjukkan teks "Luangkan **75 detik**" dan keadaan kosong "Belum ada data evaluasi hari ini", sedangkan teks laporan konsisten 90 detik. Ambil ulang dari build terbaru. Catatan: berkas gambarnya berukuran 1331x1496 piksel (tegak), periksa apakah ini benar-benar "dasbor pada layar komputer" sesuai narasi; jika itu tangkapan jendela ponsel, ubah narasi atau ganti gambar.

**B2. Istilah tingkat gangguan campur dua bahasa.** Tabel 3.2 memakai istilah Inggris (Fit / Mild fatigue / Moderate impairment / Critical hazard), Tabel 4.4 memakai Indonesia (Bugar / Kelelahan ringan / Bahaya kritis). Pilih satu (disarankan Indonesia) dan samakan di kedua tabel serta gambar.

**B3. Gaya sitasi belum seragam.** "Arce & McMullen, 2021" (2.2) vs "Arce dan McMullen (2021)" (4.5). Gunakan pola "dan" untuk teks berbahasa Indonesia. Periksa juga "Saleem, 2022" apakah perlu "dkk.".

**B4. Pilihan kata.** 3.2.1: "project ini" menjadi "proyek ini" (konsisten dengan pemakaian "proyek" di seluruh dokumen). Abstrak: "Psychomotor Vigilance Task **berbasis singkat**" menjadi "**versi singkat**"; "seluruh 16 unit test **berhasil dijalankan**" menjadi "**lulus**" (konsisten dengan 4.3.1 "16/16 lulus").

**B5. Tabel 4.5: "(1) dan (2)" tidak dijelaskan.** Teks menjelaskan tiga perlakuan (terkontrol, menyamakan bobot, pengacakan), tetapi header kolom berbunyi "Rentang CFI pada variasi (1) dan (2)". Beri label eksplisit atau ubah header menjadi "Rentang CFI pada tiga variasi bobot".

**B6. Lampiran hilang (regresi dari draf pertama).** Draf pertama melampirkan masukan skenario simulasi (daftar RT, lapse, dan lain-lain) sehingga hasil bisa direproduksi. Laporan ini tidak punya lampiran. Tambahkan "Lampiran A. Masukan Skenario Simulasi": ini juga jawaban siap pakai bila penguji meminta bukti.

**B7. Penamaan beberapa sub-bab menyimpang dari template resmi.** Template memakai "2.4 Keunggulan dan Nilai Inovasi" dan "3.2 Target Pengguna dan Potensi Pasar"; laporan memakai "2.4 State of the Art" dan "3.2 Analisis Kebutuhan Sistem" (konten keunggulan pindah ke 4.4.5; potensi pasar tidak eksplisit). Kesesuaian format dinilai 20 persen, jadi aman-nya: pertahankan judul template, boleh menambah sub-bab baru (mis. "2.5 State of the Art" atau "3.2.4 Potensi Pasar"). Periksa juga "4.1 Hasil Implementasi" vs template "4.1 Hasil Project".

**B8. Kode kebutuhan ganda.** Tabel kebutuhan nonfungsional memakai ulang kode KF-01 sampai KF-07 (sama dengan tabel fungsional). Ganti menjadi KNF-01 sampai KNF-07.

**B9. README repo belum disinkronkan.** README masih memuat hasil lama (10 unit test) dan klaim "0 TypeScript Errors" yang kini tidak benar (8 error). Perbarui setelah perbaikan build.

**B10. Nama file dan tanggal.** Ganti nama file laporan menjadi nama final (mis. `Laporan_CogniPulse_WHEN YAH.docx`); perbarui tanggal kata pengantar "6 Oktober 2026" ke tanggal submit.

**B11. Gambar 4.3/4.4 berisi layar tutorial** (OCR: "TAHAP 1 PANDUAN REFLEKS PVT" dan seterusnya), sedangkan narasi berbicara tentang "dua pengujian pertama". Sesuaikan narasi ("tampilan tahap tutorial dan pengujian ...") atau tambahkan tangkapan saat pengujian berlangsung.

**B12. Sitasi "Cosentino dkk. (2025)" belum dapat diverifikasi.** Tidak ditemukan publikasi dengan penulis tersebut yang cocok dengan klaim di 2.4 (beberapa kandidat penulis bernama Cosentino tidak membahas topik ini). Sebelum submit: temukan sumber aslinya dan lengkapi detailnya, atau ganti dengan sumber yang tepat (kandidat yang membahas topik serupa: Kronenberger dkk., 2025; Wolff, 2025).

---

## C. BAGUS: Terverifikasi Akurat

### C1. Fact-check sitasi (semua angka cocok dengan sumber asli)

| Sitasi | Klaim di laporan | Hasil verifikasi |
|--------|------------------|------------------|
| Watling dkk. (2021) | 21 studi; sensitivitas 39,0-98,8%; spesifisitas 73,0-98,9% | Cocok persis (Accident Analysis & Prevention 150:105900) |
| Fonseca & Ferreira (2025) | 81 studi; median akurasi dan F1 sekitar 0,95 | Cocok persis (Applied Sciences 15(16):9018) |
| Pahari dkk. (2025) | PVT 3 menit vs 10 menit laboratorium, 41 partisipan, r = 0,96 | Cocok persis (Scientific Reports 15:39115) |
| Perzl dkk. (2024) | PVT 30 detik, DSST dan SART 90 detik, 46 partisipan | Cocok persis (Assessment 31(6):1270-1291) |
| Yogisutanti dkk. (2013) | Waktu reaksi berkorelasi dengan lama tidur, r = -0,459 | Cocok persis (KEMAS 9(1):53-57) |
| Al-Mekhlafi dkk. (2023) | Waktu reaksi 286,82 menjadi 353,57 ms | Cocok (diverifikasi pada review pertama) |
| NASA (2026) | Konsep evolutionary (iterative) life cycle | Konsep benar (NASA Software Engineering Handbook SWE-019); format entri daftar pustaka perlu disesuaikan |
| 13 sitasi lain (Saleem, Mabry, Maki, Antler, Choong, Heimhofer, Anwyl-Irvine, Arce & McMullen, Albadawi, Thirunavukarasu, Syailendra, Razi, Heng) | Berbagai angka | Cocok (diverifikasi pada review pertama) |
| Cosentino dkk. (2025) | LLM belum menggabungkan interpretasi lintas pengujian | Belum ditemukan; verifikasi (B12) |

### C2. Konsistensi laporan dengan kode dan live

- Angka skenario simulasi dan CFI (3 / 36 / 80; jarak reaksi 6,7 / 10,3 / 16,7 meter; rincian penalti per komponen) cocok 100 persen dengan mesin skoring di repo (dihitung ulang memakai fungsi asli).
- Ambang CFI (25 / 45 / 70) konsisten di narasi, Tabel 3.2, Gambar 3.7, dan kode.
- Rantai model AI: Gambar 3.6 menampilkan 4 model plus fallback dengan batas waktu 5/5/5/8 detik dan jeda 30 detik; cocok persis dengan kode.
- Check-in konteks 6 pertanyaan (durasi tidur resolusi 0,5 jam, jam kerja, tipe shift, kafein, kelelahan subjektif, beban fisik) cocok dengan implementasi terbaru.
- "90 detik" konsisten antara teks dan kode terbaru; hanya screenshot yang belum diperbarui (B1).
- 16/16 unit test lulus pada commit terbaru (dijalankan ulang saat review).
- Analisis sensitivitas (rentang 2,3-3,3 / 33,4-37,1 / 76,6-81,6) cocok dengan grafik Gambar 4.7.
- Gaya: 0 em dash, 0 frasa AI-slop, "pengemudi" dipakai konsisten (132 kali), tanpa "supir" di teks laporan.
- Bagian 4.5 Keterbatasan jujur dan tepat (belum divalidasi klinis; PVT 6 percobaan; protokol Corsi/inhibisi disesuaikan): nilai plus di mata penguji.

---

## D. Status Temuan Review Pertama

| Temuan review #1 | Status sekarang |
|------------------|-----------------|
| Cover masih placeholder | Terisi (kecuali judul) |
| Check-in 3 field menjadi 6 field | Diperbaiki di kode dan laporan (belum ter-deploy) |
| API terbuka (PIN bocor, PATCH bebas) | Sebagian: guard PATCH/DELETE dan strip PIN ada di kode; belum deploy; POST /api/drivers dan GET fleet/assessments masih terbuka |
| Gambar rantai model hanya 3 model | Diperbaiki: 4 model plus fallback |
| "75 detik" vs "90 detik" | Teks dan kode sudah 90; screenshot masih 75 |
| Screenshot keadaan kosong | Gambar 4.1 masih kosong |
| Istilah tier campur | Tabel 4.4 sudah Indonesia; Tabel 3.2 masih Inggris |
| "&" vs "dan" | Masih ada |
| Reproduktifitas (lampiran) | Lampiran dihapus (regresi) |
| Lockfile npm ci | Diperbaiki (better-sqlite3 11.10.0; `npm ci --dry-run` bersih) |
| README usang | Masih |
| Preset demo 16/72/89 | Diperbaiki menjadi 1/63/85 (sesuai hitungan mesin) |

---

## E. Kandidat Judul

**Rekomendasi utama (#1):**

1. **CogniPulse: Platform Web Skrining Kelelahan Kognitif Non-Invasif Berbasis Empat Uji Neurokognitif dan Gemini untuk Pengemudi Armada Travel**
   Mencakup semuanya: bentuk (platform web), fungsi (skrining kelelahan kognitif), pembeda (non-invasif), metode (empat uji neurokognitif), teknologi (Gemini), objek (pengemudi armada travel).

**Alternatif:**

2. CogniPulse: Sistem Skrining Kesiapan Kerja Pengemudi Armada Travel Berbasis Empat Uji Neurokognitif dan Analisis Gemini
3. CogniPulse: Platform Skrining Kelelahan Kognitif Pengemudi Berbasis Empat Uji Neurokognitif, Composite Fatigue Index, dan Gemini
4. CogniPulse: Skrining Non-Invasif Kelelahan Kognitif Pengemudi Armada Travel dalam 90 Detik Berbasis Web
5. CogniPulse: Integrasi Empat Uji Neurokognitif dan Gemini dalam Platform Web untuk Skrining Kesiapan Kerja Pengemudi
6. CogniPulse: Platform Web Skrining Kesiapan Kerja Pengemudi dengan Empat Uji Neurokognitif Terintegrasi dan Interpretasi Gemini
7. CogniPulse: Skrining Kelelahan Kognitif Pengemudi Berbasis Web (versi pendek minimalis)

**Catatan:** samakan judul persis di cover, kata pengantar, dan video demo; hindari kata "deteksi"/"diagnosis" (implikasi medis, laporan sendiri sudah tepat memakai "skrining"); "non-invasif" aman dan menjadi pembeda utama dari pendekatan kamera/wearable.

---

## F. Antisipasi Pertanyaan Penguji

1. **Apa dasar ilmiah empat uji ini dan mengapa digabung?** PVT-B (atensi berkelanjutan), go/no-go konflik warna-kata (inhibisi eksekutif), Corsi (memori kerja spasial), ketukan motorik (kontrol neuromuskular). Kelelahan kognitif bersifat multidimensi; CFI menyatukan keempatnya dengan bobot terdokumentasi dan sudah diuji sensitivitasnya (4.3.3).
2. **Apakah ini alat diagnostik medis?** Bukan. Ini skrining relatif sebelum bertugas, bukan pengganti pengukuran baku. Jawaban lengkap ada di 4.5.
3. **Mengapa PVT hanya 6 percobaan? Bukankah PVT standar 3 sampai 10 menit?** Dasar durasi singkat: Antler dkk. (2022) dan Pahari dkk. (2025, r = 0,96 antara PVT 3 menit dan 10 menit). Trade-off disadari dan diakui di 4.5; roadmap memperpanjang protokol.
4. **Bagaimana keamanan data dan sesi?** Setelah deploy terbaru: endpoint mutasi menolak permintaan tanpa token (401), PIN tidak lagi muncul di respons publik, dan ada manajemen akun dispatcher. Jujur tambahkan: token saat ini masih proteksi dasar (belum ditandatangani), penguatan direncanakan; jangan sampai juri menemukan endpoint terbuka karena deploy belum diperbarui (A3).
5. **Bagaimana kalau Gemini salah atau berhalusinasi?** Skor CFI dihitung deterministik oleh mesin lokal, bukan oleh LLM. Gemini hanya menyusun interpretasi bahasa dari angka yang sudah jadi; ada fallback heuristik dan keputusan akhir tetap di dispatcher.
6. **Mengapa SQLite, bukan PostgreSQL?** Kebutuhan demo single-node, WAL untuk konkurensi baca, mudah di-deploy; skema siap dimigrasikan; keterbatasan dicatat di 4.5.
7. **Apa bedanya dengan aplikasi deteksi kantuk berbasis kamera atau wearable?** Tanpa kamera (privasi, UU PDP), tanpa hardware, 90 detik, hasil multi-dimensi plus rekomendasi operasional; perbandingan lengkap ada di Tabel 2.1.
8. **Apakah sudah diuji ke pengemudi nyata?** Belum. Pengujian saat ini: unit, fungsional, simulasi, dan durasi. Validasi lapangan adalah rencana lanjutan (4.5 dan 5.2).

---

## G. Rencana Aksi

### P0: wajib sebelum submit

- [ ] Isi DAFTAR PUSTAKA (Lampiran A), lalu generate DAFTAR ISI/GAMBAR/TABEL
- [ ] Pilih dan pasang judul (bagian E) di cover dan kata pengantar
- [ ] Perbaiki 8 error TypeScript, pastikan `npm run build` sukses, deploy, verifikasi live (perintah di A3)
- [ ] Seragamkan caption dan penomoran gambar/tabel/persamaan (A4); perbaiki rujukan "Gambar 3.8 sampai 3.12" menjadi "Gambar 4.1 sampai 4.5"
- [ ] Bersihkan placeholder: "perlu diisi", "Authorization: ***", kolom/sel kosong, "sskenario" (A5)
- [ ] Ambil ulang screenshot Gambar 4.1 dari build terbaru (B1)

### P1: sangat disarankan

- [ ] Guard `POST /api/drivers`; lunakkan atau perkuat klaim keamanan (A6)
- [ ] Samakan penamaan sub-bab dengan template (B7); samakan istilah tier (B2); KNF (B8)
- [ ] Perbaikan teks kecil: "project" menjadi "proyek", "berbasis singkat" menjadi "versi singkat", "berhasil dijalankan" menjadi "lulus", "Arce &" menjadi "Arce dan", kalimat tanpa titik, kalimat janggal 4.3.2, tabel 4.5 variasi (1)(2) (B3, B4, B5)
- [ ] Verifikasi atau ganti sitasi Cosentino (B12); tambahkan Lampiran A masukan skenario (B6)
- [ ] Sinkronkan README repo (B9); rapikan nama file dan tanggal (B10)

### P2: opsional

- [ ] Token sesi ditandatangani (JWT) dan rate limit endpoint mutasi
- [ ] Unit test untuk fitur admin baru (kelola pengemudi, profil dispatcher)
- [ ] Kompres gambar untuk memperkecil ukuran file laporan (saat ini 11,6 MB)

---

## Lampiran A. Daftar Sitasi yang Wajib Masuk DAFTAR PUSTAKA

21 entri (urut alfabetis; lengkapi detail jurnal/volume/halaman/DOI dari sumber asli):

1. Al-Mekhlafi dkk. (2023)
2. Albadawi dkk. (2022)
3. Antler dkk. (2022)
4. Anwyl-Irvine dkk. (2021)
5. Arce & McMullen (2021)
6. Choong dkk. (2024)
7. Cosentino dkk. (2025) *(belum terverifikasi, lihat B12)*
8. Fonseca & Ferreira (2025)
9. Heimhofer dkk. (2024)
10. Heng dkk. (2024)
11. Mabry dkk. (2022)
12. Maki dkk. (2022)
13. NASA (2026), format: NASA Software Engineering Handbook, SWE-019: Software Life Cycle (diakses 2026)
14. Pahari dkk. (2025)
15. Perzl dkk. (2024)
16. Razi dkk. (2024)
17. Saleem (2022)
18. Syailendra dkk. (2024)
19. Thirunavukarasu dkk. (2023)
20. Watling dkk. (2021)
21. Yogisutanti dkk. (2013)

---

## Lampiran B. Metode dan Bukti Verifikasi

**1. Audit dokumen (DOCX):** ekstraksi seluruh 414 paragraf, 20 tabel, dan 17 gambar dari `word/document.xml` (zipfile + XML), termasuk audit caption (style "Caption" hanya 4 buah, semua bernomor "Gambar 0.x"), deteksi placeholder, dan pemetaan posisi 17 gambar.

**2. Verifikasi kode (commit `f00c8a2`):** `npx vitest run` menghasilkan 16/16 lulus (3 berkas uji); `npx tsc --noEmit` menghasilkan 8 error (rincian di A3); `npm run build` exit 1; `npm ci --dry-run` bersih (lockfile sudah konsisten, better-sqlite3 11.10.0); pembacaan langsung: api-auth.ts, drivers/route.ts, fleet/route.ts, driver-service.ts, dispatcher-service.ts, database.ts, json-storage.ts, gemini-client.ts, ContextCheckinModal.tsx.

**3. Probe deployment live:** GET / (200), PATCH /api/fleet tanpa token (400, seharusnya 401 di kode baru), PATCH dengan token palsu `disp_123` (diproses seperti valid oleh kode baru), GET /api/drivers (masih memuat field `pin`), GET /api/admin/profile (404). Kesimpulan: live masih build lama.

**4. Fact-check sitasi:** pencarian web per sumber; hasil di C1. Verifikasi angka kunci (21 studi; 39,0-98,8%; 81 studi; 0,952; r = 0,96; r = -0,459; 286,82 menjadi 353,57 ms; 46 partisipan) cocok persis dengan sumber aslinya.

**5. OCR gambar (tesseract):** konfirmasi caption yang tercetak di dalam gambar, diagram ambang risiko (cocok dengan kode), rantai 4 model AI (cocok dengan kode), grafik kontribusi dan sensitivitas (cocok dengan Tabel 4.4/4.5), dan screenshot "75 detik" (tidak cocok dengan teks 90 detik).

**6. Hitung ulang mesin skoring:** skenario A/B/C direproduksi memakai fungsi asli repo; hasil cocok 100 persen dengan Tabel 4.4 dan 4.5.
