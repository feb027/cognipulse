# Review Kritis Pra-Submisi — Laporan CogniPulse (ICONFEST 2026)

- **Objek**: `Laporan_CogniPulse_ICONFEST2026.docx` — ± 5.700 kata, 259 paragraf, 12 tabel, 15 gambar
- **Peran review**: penguji independen (kritis) — kacamata penguji teknis + bidang kesehatan kerja
- **Tanggal**: 7 Oktober 2026
- **Basis verifikasi**: salinan repo `feb027/cognipulse` (commit `1d38cbd`), eksekusi ulang unit test & fungsi skor asli, pembacaan kode, uji endpoint produksi `iconfest.febnawanfr.my.id`, ekstraksi + OCR 15 gambar, verifikasi referensi ke sumber asli.

> ⚠ Dokumen ini memuat temuan keamanan (A-3). Perbaiki lebih dulu; setelah diperbaiki, bagian temuan tersebut wajar diarsipkan atau dihapus dari repo publik.

---

## 0. Ringkasan & Putusan

**Putusan: BELUM SIAP SUBMIT APA ADANYA.** Substansi teknis laporan tergolong kuat dan jujur — angka-angka intinya terverifikasi penuh saat diuji ulang — tetapi ada **3 temuan RUSAK** yang tidak boleh lolos: cover masih placeholder, satu tabel fitur tidak sesuai aplikasi, dan celah keamanan API yang bertentangan dengan narasi privasi/kontrol akses. Sisanya revisi ringan dan pemolesan.

| Aspek | Penilaian | Catatan singkat |
|---|---|---|
| Akurasi teknis & pengujian | **KUAT** | 16/16 test + seluruh angka skenario cocok saat direproduksi |
| Kesesuaian laporan ↔ produk | **CUKUP** | 2 klaim tidak sesuai implementasi (check-in konteks; gambar rantai model) |
| Bahasa & tata tulis | **BAIK** | Tanpa em dash & klise AI; ada campur istilah + beberapa kalimat rancu |
| Struktur & kelengkapan | **BAIK** | Kerangka BAB I–V lengkap; identitas tim belum diisi |
| Kepatuhan format resmi | **BAIK** | Struktur & format dokumen identik dengan template panitia (lihat bagian Kepatuhan) |
| Keamanan & privasi (klaim) | **LEMAH** | API terbuka tanpa autentikasi; tidak diungkap di laporan |

---

## 1. Yang diverifikasi (bukti & metode)

1. **Unit test dijalankan ulang** pada salinan repo: `npx vitest run` → **3 berkas, 16/16 lulus, Vitest 2.1.9** — persis seperti klaim §4.3.1. `npx tsc --noEmit` → 0 error.
2. **Skenario Lampiran A direproduksi** memakai fungsi asli (`pvt-metrics`, `cfi-aggregator`, `saveAssessmentRecord`): mean RT 240/372/600 ms; CFI **3/36/80**; jarak reaksi **6,7/10,3/16,7 m**; rekomendasi siap solo / wajib co-driver / stand-down — semuanya **cocok persis** dengan Tabel 4.4.
3. **Produksi diuji langsung**: situs live merespons 200 (via Caddy + Cloudflare); `POST /api/analyze` mengembalikan analisis Gemini asli (rantai model cloud aktif, bukan fallback).
4. **Gambar**: 15 gambar diekstrak dan diverifikasi isinya via OCR + metadata (grafik 4.1/4.2 terbukti dihasilkan dari pipeline skor, bukan gambar buatan tangan).
5. **Sitasi**: 16/16 referensi nyata; 7 angka kunci dicek ke sumber aslinya (lihat §6).
6. **Guidebook & template resmi** diunduh dari tautan panitia (Guidebook.pdf + folder Drive template laporan) dan dibandingkan dengan laporan — struktur bab, format dokumen, dan kriteria penilaian (lihat bagian "Kepatuhan Guidebook & Template").
7. **Tidak diverifikasi**: estetika penuh tiap gambar (keterbatasan alat), klaim `systemd`, dan isi visual gambar sampul.

---

## Kepatuhan Guidebook & Template Resmi ICONFEST

- **Struktur bab SESUAI template.** Template resmi (`TEMPLATE SOFTWARE DEVELOPMENT.docx` dari folder Drive panitia) memuat BAB I–V dengan sub-bab 1.1–1.4, 2.1–2.4, 3.1–3.4 + Prototipe, dan 4.1–4.3. Laporan mengikuti semuanya, lalu menambah 1.5, 1.6, 4.4, 4.5, 5.1, 5.2, UCAPAN TERIMA KASIH, DAFTAR PUSTAKA, LAMPIRAN, dan ABSTRACT — **diizinkan eksplisit** oleh template ("setiap sub bab boleh ditambahkan sesuai kebutuhan").
- **Format dokumen identik dengan template**: font default Calibri 11 pt, ukuran halaman dan margin sama persis (atas/kiri 4 cm; bawah/kanan 3 cm). Laporan terbukti dibangun di atas template resmi.
- **Catatan kecil**: template asli salah nomor ("3.3 Prototype dan Implementasi" diletakkan setelah 3.4); laporan sudah membetulkan menjadi 3.5.
- **Tema "Kesehatan"** selaras dengan salah satu dari empat tema resmi lomba.
- **Implikasi kriteria penilaian (Guidebook)** — babak penyisihan menilai komponen "Laporan dan Progres" (20%) yang memuat **Kesesuaian Format Penulisan**; babak final menilai **Teknis & Fungsionalitas 45%** dan **UI/UX 30%**. Artinya: perbaikan A-2/A-3/B-3 berdampak langsung ke skor final (sesi demo + tanya jawab termasuk pengujian langsung oleh penonton), dan kerapian format (C-6 dsb.) berdampak ke skor penyisihan.
- **Deliverables penyisihan lain yang wajib (di luar laporan ini)**: link repository, link deployment/prototype, video demo singkat, dan surat pernyataan orisinalitas bermaterai (template tersedia di folder panitia). Jangan sampai terlewat.

---

## 2. TEMUAN RUSAK — wajib dibereskan sebelum submit/demo

### A-1. Cover & identitas tim masih placeholder
**Bukti**: halaman cover masih berisi `[NAMA TIM]`, `[Ketua Tim] (NIM)`, `[Anggota 1] (NIM)`, `[Anggota 2] (NIM)`, dan `[Kota], Oktober 2026`; Kata Pengantar juga masih `[Kota], Oktober 2026`.
**Kenapa fatal**: ini dokumen identitas lomba — juri melihat cover lebih dulu.
**Perbaikan**: isi nama tim & NIM anggota; ganti "Tim Penyusun" dengan daftar nama; isi kota & bulan.

### A-2. Klaim check-in konteks tidak sesuai implementasi
**Bukti**: Tabel 4.2 menulis check-in mencakup "Durasi tidur, **jam kerja, tipe shift**, asupan kafein, kelelahan subjektif, **dan beban fisik berat**". Verifikasi kode (`src/components/assessment/ContextCheckinModal.tsx`): modal hanya bertanya 3 hal (tidur, kafein, perasaan); `jamKerja = 6` dan `shift = 'morning'` di-hardcode; `heavyPhysicalLabor` **tidak pernah diisi dari UI mana pun**. Efeknya, komponen konteks CFI pada pemakaian nyata hanya mencerminkan durasi tidur.
**Perbaikan (pilih salah satu)**:
- (a) Tambahkan input jam kerja, tipe shift, dan beban fisik ke modal check-in (perubahan kecil, ± 1 jam kerja) — **disarankan**, karena juri kemungkinan besar membuka aplikasinya langsung; atau
- (b) Revisi Tabel 4.2, §2.3, dan §3.3.5 + tambahkan catatan keterbatasan di §4.5 bahwa input konteks dari UI saat ini terbatas.

### A-3. Celah keamanan API bertentangan dengan narasi kontrol akses & privasi
**Bukti (uji endpoint produksi, 7 Oktober 2026)**:
- `GET /api/fleet` dan `GET /api/drivers` **tanpa autentikasi** mengembalikan seluruh data pengemudi — termasuk `address`, `medical_history`, dan field **`pin`** (contoh nilai: `"1234"`).
- `PATCH /api/fleet` terbuka (status/keputusan penugasan dapat diubah siapa pun tanpa login); `GET /api/assessments?driverId=1` juga terbuka.
- Tidak ada verifikasi sesi di seluruh route API — proteksi peran hanya ada di lapisan tampilan (client-side).

**Kenapa serius**: laporan (§3.3.8, §4.2) membangun narasi kontrol akses berbasis peran dan minimisasi data; §4.5(f) jujur soal hash PIN, tetapi tidak mengungkap bahwa API-nya terbuka. Jika juri teknis menguji, kredibilitas bab keamanan jatuh. (Data masih data contoh — tetapi prinsipnya tetap salah.)
**Perbaikan minimal sebelum demo**:
- (a) Hapus field `pin` dari semua respons API (satu baris per query);
- (b) Tambahkan verifikasi token/sesi pada route mutasi (`PATCH /api/fleet`, `POST /api/drivers`) dan route data sensitif;
- (c) Jika tidak sempat: tambahkan paragraf keterbatasan eksplisit di §4.5 dan turunkan klaim di §3.3.8.

---

## 3. TEMUAN REVISI — perbaiki agar klaim–isi–format konsisten

### B-1. Gambar 3.6 (rantai model) tidak lengkap
Kode mencoba **4 model**: `gemini-3.8-flash` → `gemini-3.5-flash-lite` → `gemini-3.1-flash-lite` → `gemini-3.5-flash` (timeout 5 s; 8 s untuk 3.5-flash; cooldown 30 s). Gambar hanya menampilkan 3 model.
**Perbaikan**: tambahkan `gemini-3.5-flash` pada diagram (atau beri catatan penyederhanaan).

### B-2. Durasi "90 detik" tidak konsisten & tanpa bukti ukur
Teks laporan dan sebagian UI menulis **90 detik**, tetapi screenshot di dalam laporan sendiri (Gambar 3.8/3.9) menampilkan "Luangkan **75 detik**..." (`src/components/dashboard/AppleHighlightsCard.tsx`), sementara string lain menulis 90 detik (`src/components/driver/DriverProfileBar.tsx`). Tidak ada pengukuran durasi asesmen di laporan.
**Perbaikan**: (1) samakan string UI (pilih 90 detik, perbaiki yang 75); (2) tambahkan satu kalimat pengukuran di §3.5/§4.3 (mis. "durasi rata-rata 4 modul ± 85–100 detik tanpa tutorial") atau tulis eksplisit "sekitar 90 detik (di luar tutorial)".

### B-3. Screenshot 3.8 & 3.9 menampilkan kondisi kosong
Kedua screenshot menampilkan state kosong ("Belum ada data evaluasi hari ini") — kurang informatif untuk laporan hasil.
**Perbaikan**: ganti dengan state terisi (hasil + vital + tren) dan tambahkan satu screenshot konsol armada terisi + keputusan dispatcher.

### B-4. Istilah tingkat gangguan campur bahasa
Tabel 3.2 & 4.4 memakai `Fit / Mild fatigue / Moderate impairment / Critical hazard`, sedangkan abstrak dan teks memakai istilah Indonesia.
**Perbaikan**: seragamkan — lihat tabel Cari → Ganti di §7.

### B-5. Gaya sitasi campur
Satu-satunya bentuk "&" adalah "Arce & McMullen" (dua tempat); bibliografi memakai "et al." (Comanici) sedangkan teks memakai "dkk.".
**Perbaikan**: seragamkan ke konvensi Indonesia — "Arce dan McMullen"; "Comanici, G., dkk. (2025)".

### B-6. Lampiran A belum cukup untuk reproduksi penuh
Deret RT PVT sudah dilampirkan (bagus), tetapi motorik hanya diberi rentang ITI ("sekitar 236–244 ms") dan inhibisi hanya hitungan error — sehingga angka jitter (2,6/18,6/61,9) dan skor 75/50 tidak bisa dihitung ulang verifikator.
**Perbaikan**: lampirkan deret ITI dan RT Stroop aktual (array angka), mengikuti pola PVT yang sudah baik.

### B-7. Kalimat perlu diperbaiki
Lihat tabel Cari → Ganti di §7 (baris 1–3).

---

## 4. TEMUAN KURANG — minor (boleh setelah submit)

- **C-1.** "project" (± 38×) vs "proyek" (2×, pada frasa "dokumentasi proyek") — seragamkan (ikuti template lomba bila memakai "Project").
- **C-2.** Pembuka kalimat "Pada ..." ± 10× — variasikan (mulai dengan subjek, angka, atau klausa).
- **C-3.** Pemiringan istilah asing tidak konsisten: "fit-for-duty", "Psychomotor Vigilance Task", "inter-tap interval" dimiringkan; "dispatcher", "lapse", "baseline", "go/no-go", "stand-down", "check-in", "feedback" tidak. Tetapkan satu kebijakan (miringkan saat pertama muncul).
- **C-4.** Abstrak Inggris memakai ejaan UK ("recognise", "colour") — samakan ke satu varian.
- **C-5.** Kata Pengantar dan Ucapan Terima Kasih duplikatif (sama-sama berterima kasih ke panitia) — rapikan salah satu.
- **C-6.** Daftar Isi/Gambar/Tabel: perbarui nomor halaman setelah semua editan (akan bergeser setelah cover diisi).
- **C-7.** Penulisan rentang tidak seragam: "1.800 - 3.800 ms", "23.00 - 04.59", "3 - 6" — pilih satu gaya (disarankan "1.800–3.800 ms").
- **C-8.** Baris infrastruktur Tabel 3.4 diberi "(menurut dokumentasi proyek)" — sebagian terverifikasi live (Caddy/Cloudflare); bila bisa, lampirkan bukti (unit systemd/config) agar tanpa disclaimer.

---

## 5. YANG SUDAH BAGUS — pertahankan

- **D-1. Kejujuran metodologis luar biasa.** §1.5 & §4.5 mengakui tanpa validasi manusia, bobot heuristik, ambang tidak baku, PIN tanpa hash, data contoh. Ini menaikkan kredibilitas — jangan dihapus.
- **D-2. Angka pengujian terverifikasi penuh.** 16/16 lulus (Vitest 2.1.9); CFI 3/36/80; jarak 6,7/10,3/16,7; keputusan & risiko microsleep — direproduksi persis dengan kode asli.
- **D-3. Sitasi sehat.** 16/16 referensi nyata (2021–2025); 7 angka kunci dicek ke sumber asli dan cocok — tidak ada sitasi hantu.
- **D-4. Bahasa bersih.** 0 em dash, 0 frasa klise AI yang umum, gaya faktual-padat. (Catatan: ini pemeriksaan pola gaya, bukan detektor AI statistik.)
- **D-5. Istilah teknis selaras kode.** Parameter modul (6 percobaan/1.800–3.800 ms; 8 percobaan/1.400 ms; 4 ronde 3–6; 15 detik), ambang lapse 500 ms/false start 100 ms, fase sirkadian, bobot CFI, skema 3 tabel, endpoint API, field konteks ke Gemini — akurat.
- **D-6. Gambar sesuai kode.** ERD 3 tabel + cascade; diagram keputusan (CFI 70/45; lapse 4/2) cocok; grafik 4.1/4.2 konsisten dengan Tabel 4.4; screenshot adalah aplikasi asli (bukan mockup).
- **D-7. Rantai AI terbukti hidup.** Uji langsung ke produksi: analisis Gemini asli (bukan fallback); fallback lokal juga teruji lewat unit test.
- **D-8. Kepatuhan template & format.** Struktur bab, penomoran, font, dan margin identik dengan template resmi panitia — tinggal mengisi identitas tim (A-1).

---

## 6. Hasil fact-check (ringkas)

| Klaim | Status |
|---|---|
| 16/16 unit test lulus; Vitest 2.1.9 | ✅ TERVERIFIKASI (dijalankan ulang) |
| CFI 3/36/80; jarak 6,7/10,3/16,7; rekomendasi dispatcher | ✅ TERVERIFIKASI (re-eksekusi fungsi asli) |
| Ambang lapse kode 500 ms vs dokumentasi 355 ms (§4.5c) | ✅ TERVERIFIKASI (kode: 500 ms) |
| Fase sirkadian Tabel 3.3 | ✅ TERVERIFIKASI (`circadian.ts`) |
| Skema DB 3 tabel + WAL + cascade | ✅ TERVERIFIKASI (`database.ts`) |
| Endpoint API Tabel 4.1 | ✅ TERVERIFIKASI (semua ada) |
| Konteks pengemudi ke Gemini (NIP, nama, kendaraan, plat, rute, riwayat kesehatan) | ✅ TERVERIFIKASI (`prompts.ts`) |
| Referensi & angka kunci (Saleem 76.641; Choong 712; Antler <0,70; Heimhofer 370/17%; Maki 28; Al-Mekhlafi 286,82→353,57; Comanici 2025) | ✅ TERVERIFIKASI (spot-check sumber) |
| Rantai model: 4 model di kode vs 3 di Gambar 3.6 | ⚠️ TIDAK KONSISTEN (B-1) |
| Check-in: jam kerja/shift/beban fisik | ❌ TIDAK SESUAI (A-2) |
| "90 detik" | ⚠️ TIDAK KONSISTEN (UI lain menulis 75; tanpa bukti ukur) (B-2) |
| Infrastruktur (Cloudflare/Caddy/systemd) | ◐ SEBAGIAN (live via Caddy+Cloudflare; systemd tidak dapat diverifikasi) |
| Akses API & privasi | ❌ TIDAK SESUAI (A-3) |

---

## 7. Cari → Ganti (bahasa & konsistensi)

| # | Cari | Ganti menjadi |
|---|---|---|
| 1 | `Judul project ini menjawab beberapa pertanyaan mendasar.` | `Pilihan rancangan project ini menjawab beberapa pertanyaan mendasar:` |
| 2 | `konsistensi implementasi terhadap rancangan` | `konsistensi implementasi dengan rancangannya` |
| 3 | `berada pada orde yang masuk akal` | `berada pada kisaran yang wajar` |
| 4 | `Arce & McMullen` (2 tempat) | `Arce dan McMullen` |
| 5 | `Comanici, G., et al. (2025)` | `Comanici, G., dkk. (2025)` |
| 6 | `44 pengemudi tangki minyak dan gas` | `44 pengemudi (dari 58 partisipan yang terlibat)` |
| 7 | `Fit` / `Mild fatigue` / `Moderate impairment` / `Critical hazard` (Tabel 3.2 & 4.4) | `Bugar` / `Kelelahan ringan` / `Gangguan sedang` / `Bahaya kritis` |

---

## 8. Catatan tambahan (repo & demo — di luar laporan)

- **F-1. `npm ci` GAGAL pada salinan baru.** `package-lock.json` tidak sinkron dengan `package.json` (lock: `better-sqlite3 13.0.3`; package.json: `^11.8.1`). Jalankan `npm install` lalu commit lockfile-nya.
- **F-2. README belum sinkron dengan kode & laporan.** Blok hasil test masih 10 test (kini 16); badge "Tailwind v4" padahal v3.4 (laporan sudah benar menulis "Tailwind CSS 3.4"); nama fase sirkadian di README berbeda dari kode (kode: nadir 23.00–04.59); diagram mermaid menyebut "Gemini 2.5 Flash" (kode: 3.1/3.5 lite). Samakan.
- **F-3. Mode demo juri memakai CFI preset yang tidak sama dengan mesin skor saat ini.** `src/lib/demo-scenarios.ts`: preset 16/72/89 vs hasil hitung ulang dengan aggregator sekarang: **1/63/85**. Perbarui preset (atau hitung ulang saat demo) agar tidak kontradiksi bila ditelusuri.
- **F-4. Nada keluaran copilot** ("bro/sis", "gacor", "baterai kognitif") kurang sejalan dengan positioning klinis laporan — pertimbangkan menyesuaikan untuk audiens pengemudi. (Keputusan desain, bukan kesalahan.)
- **F-5. Repo**: `.agents/` (± 171 berkas, ± 4,7 MB, termasuk `__pycache__/*.pyc` yang ikut ter-commit) — pertimbangkan bersihkan dan tambahkan ke `.gitignore` untuk repo publik.
- **F-6. Tenggat & kelengkapan lomba (terverifikasi di Guidebook resmi)**: batas pengumpulan babak penyisihan **16 Oktober 2026**; babak final (presentasi offline, 5 tim teratas) **26 Oktober 2026**. Deliverables: laporan + link repo + link deployment + video demo + surat orisinalitas bermateran. Prioritaskan A-1..A-3 lebih dulu.

---

## 9. Rencana aksi (urutan prioritas)

1. **A-1** — Isi cover & kata pengantar (± 15 menit).
2. **A-3** — Hapus `pin` dari respons API + proteksi endpoint mutasi (± 1–2 jam); atau minimal hapus `pin` + tambah paragraf keterbatasan.
3. **A-2** — Tambah 3 field check-in ATAU revisi klaim Tabel 4.2/§2.3 (± 1 jam).
4. **B-1..B-3** — Gambar 3.6 + screenshot terisi + samakan "90/75 detik".
5. **B-4..B-7 & C-1..C-8** — Sapu bahasa via tabel Cari → Ganti + konsistensi.
6. Perbarui Daftar Isi/Gambar/Tabel → ekspor PDF final → cek ulang penomoran halaman.
7. (Opsional) F-1, F-2: rapikan lockfile & README.

---

*Review ini disusun sebagai audit internal pra-submisi. Setelah temuan diperbaiki, simpan/arsipkan sesuai kebutuhan tim.*
