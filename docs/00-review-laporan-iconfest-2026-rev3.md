# Review Rev3 - Fokus Konten (Isi Bab) - Draf Laporan ICONFEST 2026

**Dokumen yang direview:** `TEMPLATE SOFTWARE DEVELOPMENT(1).docx` - draf tim (revisi ke-61, 10 Okt 2026). Jika sudah ada revisi baru, temuan pada bagian yang berubah mohon dicek ulang.
**Cakupan:** khusus berkas draf ini. Berkas laporan lain yang ada di repo tidak termasuk dalam review ini.
**Status kode saat review:** commit `38b1d88` - `npx tsc --noEmit` 0 error, build produksi sukses, **21/21 unit test (4 berkas)**, live ter-deploy dan terverifikasi ulang.
**Tanggal review:** 12 Oktober 2026 · **Deadline penyisihan:** 16 Oktober 2026.
**Metode:** pembacaan penuh dokumen + verifikasi silang ke kode + OCR tangkapan layar + probe deployment live + fact-check sitasi + hitung ulang angka skenario memakai fungsi asli di `src/lib/scoring/`.

> **Fokus review ini adalah ISI/KONTEN.** Isu format yang sudah jelas (daftar pustaka kosong, judul, caption, placeholder) tetap didaftar singkat di bagian prioritas agar tidak terlupa, tapi bukan bahasan utama.

---

## 0. Status perbaikan sejak review rev2

| Item rev2 | Status |
|---|---|
| A3 - Build gagal (8 error TypeScript) | **BERES.** `9ef659c` + `38b1d88`; build sukses, sudah ter-deploy |
| A6 - Keamanan (token cek awalan, endpoint terbuka) | **BERES.** Token kini bertanda tangan HMAC; guard penuh; isolasi PIN; +5 unit test autentikasi |
| Verifikasi live ulang | PATCH & GET `/api/fleet` tanpa token: **401** · token palsu: **401** · PIN tidak bocor · `POST /api/drivers`: **403** |
| A1/A2/A4/A5 (daftar pustaka, judul, caption, sisa placeholder) | Masih terbuka - sudah jelas, tinggal dieksekusi sebelum submit |

---

## 1. Fondasi yang sudah kuat (terverifikasi - jangan diutak-atik tanpa alasan)

| Klaim di laporan | Sumber | Hasil verifikasi |
|---|---|---|
| 17 studi, 76.641 partisipan | Saleem (2022) | Persis: "17 observational studies ... 76,641 participants" |
| PVT-192; 44 dari 58 pengemudi; 2 hari; 286,82 ke 353,57 ms | Al-Mekhlafi dkk. (2023) | Persis: "44 subjects completed 2 days and four tests" |
| 39 studi Corsi, inkonsistensi metodologis | Arce & McMullen (2021) | Persis: "Thirty-nine CBT studies ... evaluated" |
| 24 studi / 712 partisipan; efek sedang go/no-go | Choong dkk. (2024) | Cocok |
| 370 partisipan; perlambatan sekitar 17% | Heimhofer dkk. (2024) | Cocok |
| PVT singkat tidak dapat dipertukarkan (r < 0,70) | Antler dkk. (2022) | Cocok |
| Angka skenario, penalti, bobot, CFI (3/36/80), jarak reaksi | kode `src/lib/scoring/*` | Dihitung ulang dengan fungsi asli - cocok 100% |

---

## 2. Temuan konten (bagian yang tidak terlihat sekilas)

### 2.1 Formula per komponen CFI belum ditulis

Laporan hanya memberi `CFI = 0,30 F_PVT + 0,20 F_Stroop + 0,20 F_motor + 0,15 F_Corsi + 0,15 F_konteks`. Bagaimana setiap `F` dihitung tidak tertulis, padahal sudah ada di kode dan penguji hampir pasti bertanya. Sisipkan di 3.3.5 atau lampiran:

| Komponen | Formula aktual (kode) |
|---|---|
| F_PVT | min(100; round(max(0; 4,5 - RS) x 20 + lapse x 18 + falseStart x 8)) |
| F_Stroop | 100 - skor kontrol inhibisi |
| F_Motor | min(100; round((100 - skor kestabilan) + max(0; jitter - 15) x 2,5)) |
| F_Corsi | 100 - skor memori kerja |
| F_Konteks | min(100; (6 - tidur) x 8 bila tidur < 6, + (jamKerja - 7) x 6 bila > 7, + 18 bila beban fisik berat, + 12 bila shift malam) |

Skor modul yang juga masih "kotak hitam" - tulis juga supaya metode dapat direproduksi:

- Kontrol inhibisi = 100 - (commission x 15 + omission x 10 + min(25; biaya interferensi / 8))
- Memori kerja Corsi = round(0,7 x skorBasisSpan + 0,3 x akurasiUrutan); skorBasis: span >= 6 = 100; 5 = 90; 4 = 75; 3 = 55; lainnya 35/20
- Kestabilan motorik = 100 - min(50; round(jitter x 0,9)) - min(30; round(slope x 10))

### 2.2 Ambang lapse 500 ms belum dijelaskan

Kode memakai ambang lapse 500 ms dengan alasan kompensasi latensi peramban, sementara literatur umumnya memakai 355 ms. Bagian 4.5 saat ini hanya menulis "ambang lapse ... perlu diselaraskan" tanpa menyebut angka dan alasannya. Tambahkan penjelasan eksplisit (nilai 500 ms, alasan, dan catatan selisihnya dengan 355 ms) - pertanyaan pembuka penguji biasanya "kenapa 500, bukan 355 seperti di literatur?".

### 2.3 Lampiran masukan skenario belum ada

Tambahkan lampiran berisi masukan mentah tiap skenario supaya angka Tabel 4.4 dapat direproduksi dan diverifikasi penguji. Catatan saat menyusunnya: pastikan aritmetika rentang ketukan motorik konsisten - 50 ketukan dalam jendela 15 detik berarti ITI rata-rata sekitar 300 ms; jika ingin menulis rentang 236-244 ms, tulis sebagai "ITI efektif" plus durasi aktifnya (sekitar 12 detik), supaya tidak dipertanyakan.

### 2.4 Tangkapan layar masih build lama - paling terlihat saat demo

- Layar ringkasan (JUMAT, 9 OKTOBER) masih menampilkan "**75 detik**" dan "Belum ada data evaluasi hari ini" - build lama, sementara teks laporan memakai 90 detik.
- Ambil ulang screenshot dari build terbaru (live sudah di-deploy), dan pastikan: layar ringkasan memakai "90 detik", form check-in memperlihatkan 6 field (tidur, jam kerja, shift, kafein, perasaan, beban fisik).

### 2.5 Skema basis data: laporan menulis "tiga tabel", kode punya empat

Kode: `drivers`, `trip_history`, `assessments`, ditambah `dispatchers` (akun admin - dipakai fitur kelola admin). Laporan menulis "tiga tabel" dan tidak menyebut dispatchers. Perbarui menjadi empat tabel, atau jelaskan cakupannya.

### 2.6 Jumlah pengujian berubah: 16 menjadi 21

Commit `38b1d88` menambah `tests/auth.test.ts` (5 pengujian: token HMAC, isolasi PIN, guard). Kini **4 berkas, 21/21 lulus**. Perbarui: Tabel 4.3, baris RM-4 ("16 dari 16 unit test lulus"), dan dua kalimat di BAB V. Ini kabar bagus: tulis sebagai keunggulan (token bertanda tangan, GET fleet ikut terproteksi).

### 2.7 Keamanan dan privasi - detail yang perlu dikoreksi

- **4.5 belum mengungkap** bahwa PIN dan kata sandi disimpan sebagai teks biasa (belum di-hash) - klaim KF-07 "Kredensial dan sesi terlindungi" berisiko dianggap overclaim. Tambahkan pengungkapan + rencana penguatan (salt-hashing) sebagai roadmap.
- **3.3.8:** daftar data yang dikirim ke Gemini ("NIP, tipe kendaraan, plat nomor, dan rute") kurang eksplisit - kode juga mengirim **nama** dan **riwayat kesehatan** (lihat `prompts.ts`, `driverContext`). Sebutkan lengkap.
- `Authorization: ***` di Tabel 4.2 - kalimat terpotong (tanda kurung tidak ditutup, placeholder "***"); perbaiki jadi kalimat utuh.

### 2.8 Analisis sensitivitas: metode belum cukup rinci

4.3.3 menyebut tiga perlakuan (ubah bobot terkontrol, samakan bobot, pengacakan "dalam rentang yang telah ditentukan"), tetapi: rentang pengacakan tidak disebut, jumlah pengulangan tidak disebut, dan Tabel 4.5 hanya berjudul "variasi (1) dan (2)". Tambahkan detail (jumlah undian, rentang, seed bila ada) supaya dapat direproduksi.

### 2.9 Pengukuran durasi: bersihkan sisa draf dan jelaskan metode

- Kalimat "Nilai rata-rata dan rentang waktu **perlu diisi**..." bertentangan dengan Tabel 4.7 yang sudah terisi - hapus.
- Ada kolom header kosong di Tabel 4.7 (antara `n` dan `Rata-rata`).
- Metode pencatatan belum dijelaskan: siapa yang mengukur, dengan alat apa, ponsel apa. Beri catatan juga bahwa "Tutorial dilewati" berarti durasi nyata di lapangan akan lebih panjang.

### 2.10 Rujukan silang dan konsistensi kecil

- Tabel 4.8 (RM-1): "(Gambar 3.8 sampai 3.12)" - samakan dengan penomoran gambar final (caption screenshot implementasi belum beres; masih ada caption "Gambar 0.x").
- Kode kebutuhan dobel: Tabel 3.1 (fungsional) dan Tabel 3.2 (nonfungsional) sama-sama memakai KF-01 sampai KF-07 - ubah salah satu (mis. KNF-01 sampai KNF-07).
- Istilah campur: prosa 3.3.7 memakai "mild fatigue" sementara tabel sudah memakai "Kelelahan ringan" - samakan.
- "PVT-B": beri definisi eksplisit pada kemunculan pertama ("varian singkat 6 percobaan"; 4.5 sudah jujur soal ini) supaya tidak disamakan dengan PVT-B tervalidasi.
- Sisa kecil dari rev2: "sskenario" (4.3.3), "dapat diperlihatkan melalui grafik tersendiri..." (4.3.2), tanda hubung campur "4 - 11" vs "83 - 106", sel kosong Tabel 2.1 baris Yogisutanti, titik hilang di akhir 3.2.1, frasa "berbasis singkat".
- Sitasi "Cosentino dkk. (2025)" masih belum ditemukan sumbernya - ganti atau hapus.

### 2.11 Pengujian fungsional - sudah bagus, dua tambahan kecil

Sudah mencakup kasus negatif (PIN salah, kata sandi lama salah, akses tanpa izin) - bagus, pertahankan. Tambahan: (a) skenario "token **palsu** (bukan hanya tanpa token) ditolak" - sekarang benar-benar ditolak berkat HMAC, jadi layak diklaim; (b) catat di 4.5 bahwa belum ada pembatasan percobaan login (rate limit) sebagai roadmap.

---

## 3. Pertanyaan tajam penguji (siapkan jawaban lisan)

1. **Kenapa bobot 0,30/0,20/0,20/0,15/0,15 dan ambang 25/45/70?** - Heuristik pengembang; PVT diberi bobot terbesar karena bukti literatur terkuat; analisis sensitivitas menunjukkan klasifikasi stabil; kalibrasi empiris masuk roadmap.
2. **Kenapa ambang lapse 500 ms, bukan 355 ms seperti literatur?** - Kompensasi latensi peramban; konservatif; dokumentasikan di 4.5.
3. **6 percobaan PVT - cukup?** - Antler (2022); Pahari (2025, r = 0,96); posisi sebagai skrining relatif; sebutkan granularitas lapse yang kasar (1 lapse = 16,7% indeks performa).
4. **Dari mana angka 240/372/600 ms?** - Buat eksplisit: A = baseline terjaga; B mendekati temuan pasca-mengemudi Al-Mekhlafi (353,57 ms); C = kondisi ekstrem kritis.
5. **Bagaimana kalau pengemudi "sengaja bagus"?** - False start dan lapse menangkap sebagian; motivasi tetap ancaman validitas; 4.5 item 6 sudah menyinggung - perdalam satu kalimat.
6. **Data pribadi (termasuk riwayat kesehatan) dikirim ke Gemini - bagaimana kepatuhan UU PDP?** - Pengungkapan sudah ada; akui belum ada mekanisme consent formal; sampaikan rencana persetujuan dan minimisasi data.
7. **Kenapa CFI 25-44 (kelelahan ringan) sudah wajib co-driver?** - Kebijakan konservatif keselamatan; false-negative lebih mahal dari false-positive.
8. **"16 atau 21 unit test?"** - Perbarui laporan dulu (21/21, 4 berkas) supaya konsisten dengan repo.

---

## 4. Prioritas

**P0 - sebelum submit:**
1. Ambil ulang tangkapan layar dari build terbaru (2.4) - paling terlihat saat demo.
2. Sisipkan formula per komponen CFI dan skor modul (2.1).
3. Perbarui angka pengujian 16 menjadi 21 (2.6).
4. Pengungkapan kredensial teks biasa + daftar data Gemini yang lengkap + perbaiki `Authorization: ***` (2.7).
5. Lampiran masukan skenario (2.3).
6. Rujukan RM ke penomoran gambar final + kode KF dobel (2.10).
7. Item format yang sudah jelas: daftar pustaka, judul, caption, sisa placeholder (rev2 A1/A2/A4/A5).

**P1:** penjelasan ambang lapse (2.2); detail metode sensitivitas dan durasi (2.8, 2.9); empat tabel basis data (2.5); konsistensi istilah (2.10); Cosentino.

**P2:** frasa kecil; tambahkan jawaban pertanyaan penguji ke 4.5 bila relevan.
