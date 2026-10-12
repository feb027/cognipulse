# Review Rev3 - Fokus Konten (Isi Bab) - Laporan ICONFEST 2026

**Cara baca penanda:** **[Draf]** = berkas `TEMPLATE SOFTWARE DEVELOPMENT(1).docx` (draf kerja yang kamu kirim untuk direview). **[Repo]** = berkas `Laporan_CogniPulse_ICONFEST2026.docx` (versi yang ada di repo GitHub). Tiap temuan ditandai berlaku untuk versi yang mana.
**Dokumen utama yang direview:** `TEMPLATE SOFTWARE DEVELOPMENT(1).docx` - draf tim **[Draf]** (revisi ke-61, 10 Okt 2026). Jika sudah ada revisi baru, temuan pada bagian yang berubah mohon dicek ulang.
**Dokumen pembanding:** `Laporan_CogniPulse_ICONFEST2026.docx` - versi di repo **[Repo]** (format lengkap, 16 referensi).
**Status kode saat review:** commit `38b1d88` - `npx tsc --noEmit` 0 error, build produksi sukses, **21/21 unit test (4 berkas)**, live ter-deploy dan terverifikasi ulang.
**Tanggal review:** 12 Oktober 2026 · **Deadline penyisihan:** 16 Oktober 2026.
**Metode:** pembacaan penuh kedua dokumen + verifikasi silang ke kode + OCR tangkapan layar + probe deployment live + fact-check sitasi + hitung ulang angka skenario memakai fungsi asli di `src/lib/scoring/`.

> **Fokus review ini adalah ISI/KONTEN.** Isu format yang sudah jelas (daftar pustaka kosong, judul, caption, placeholder [Draf]) tetap didaftar singkat di bagian prioritas agar tidak terlupa, tapi bukan bahasan utama.

---

## 0. Status perbaikan sejak review rev2

| Item rev2 | Status |
|---|---|
| A3 - Build gagal (8 error TypeScript) | **BERES.** `9ef659c` + `38b1d88`; build sukses, sudah ter-deploy |
| A6 - Keamanan (token cek awalan, endpoint terbuka) | **BERES.** Token kini bertanda tangan HMAC; guard penuh; isolasi PIN; +5 unit test autentikasi |
| Verifikasi live ulang | PATCH & GET `/api/fleet` tanpa token: **401** · token palsu: **401** · PIN tidak bocor · `POST /api/drivers`: **403** |
| A1/A2/A4/A5 (daftar pustaka, judul, caption, sisa placeholder) | Masih terbuka di [Draf] - sudah jelas, tinggal dieksekusi sebelum submit |

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
| Konflik warna-kata melibatkan conflict monitoring | Ding dkk. (2023) | Cocok (Front. Neurol. 14:1271264) |
| Varian Flash dan Flash-Lite berlatensi rendah | Comanici dkk. (2025) | Cocok (arXiv:2507.06261) |
| Angka skenario, penalti, bobot, CFI (3/36/80), jarak reaksi | kode `src/lib/scoring/*` | Dihitung ulang dengan fungsi asli - cocok 100% |
| Lampiran A [Repo]: masukan mentah menghasilkan keluaran Tabel 4.4 | kode | PVT, Stroop, Corsi, konteks cocok (catatan motor di 2.3) |

---

## 2. Temuan konten (bagian yang tidak terlihat sekilas)

### 2.1 Formula per komponen CFI belum ditulis - [Draf & Repo]

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

### 2.2 Ambang lapse 500 ms: [Repo] sudah menjelaskan, [Draf] belum - [Draf]

Kode: ambang lapse = 500 ms dengan alasan kompensasi latensi peramban. [Repo] 4.5.c sudah menyebut eksplisit ("500 ms ... sedangkan dokumentasi proyek menyebut 355 ms"). [Draf] 4.5 hanya menulis "ambang lapse ... perlu diselaraskan" tanpa angka dan alasan. Adopsi penjelasan [Repo] ke [Draf] - kalimat pembuka penguji biasanya "kenapa 500, bukan 355 seperti literatur?".

### 2.3 Lampiran skenario: [Draf] belum punya; [Repo] perlu satu klarifikasi - [Draf & Repo]

- **[Draf]:** tidak ada lampiran masukan mentah. Tambahkan (model: Lampiran A [Repo]) supaya angka Tabel 4.4 dapat direproduksi dan diverifikasi penguji.
- **[Repo] Lampiran A, baris motorik:** "50 ketukan, ITI sekitar 236-244 ms" perlu klarifikasi. 50 ketukan dalam jendela 15 detik berarti ITI rata-rata sekitar 300 ms; angka 236-244 ms konsisten hanya bila ketukan efektif berjalan sekitar 12 detik (mulai sekitar 3 detik setelah timer). Tulis "ITI efektif" plus durasi aktifnya, atau sesuaikan angkanya, agar tidak dipertanyakan.

### 2.4 Tangkapan layar masih dari build lama - paling terlihat saat demo - [Draf & Repo]

- [Repo] Gambar 3.8 dan 3.9-kiri: masih "**75 detik**" dan "Belum ada data evaluasi hari ini" dengan tanggal lama (30 September), sementara teks laporan memakai 90 detik.
- [Repo] Gambar 3.9-kanan: form check-in hanya **3 pertanyaan** (tidur, kafein, perasaan) - build lama. Padahal Tabel 4.2 di laporan itu sendiri mengklaim 6 field (tidur, jam kerja, tipe shift, kafein, perasaan, beban fisik). Ini kontradiksi langsung antara gambar dan tabelnya sendiri.
- [Draf]: layar ringkasan juga masih "75 detik" (JUMAT, 9 OKTOBER).

**Tindakan:** ambil ulang semua tangkapan layar dari build terbaru (live sudah memakai build terbaru) sebelum submit dan sebelum rekaman demo.

### 2.5 Skema basis data: laporan menulis "tiga tabel", kode punya empat - [Draf & Repo]

Kode: `drivers`, `trip_history`, `assessments`, ditambah `dispatchers` (akun admin - dipakai fitur kelola admin). Kedua versi menulis "tiga tabel" dan tidak menyebut dispatchers (juga tidak ada di ERD [Repo] Gambar 3.5). Perbarui menjadi empat tabel, atau jelaskan cakupannya.

### 2.6 Jumlah pengujian berubah: 16 menjadi 21 - [Draf & Repo]

Commit `38b1d88` menambah `tests/auth.test.ts` (5 pengujian: token HMAC, isolasi PIN, guard). Kini **4 berkas, 21/21 lulus**. Perbarui Tabel 4.3 di [Draf] dan [Repo], abstrak [Draf], serta baris kontribusi. Ini kabar bagus: tulis sebagai keunggulan (token bertanda tangan, GET fleet ikut terproteksi).

### 2.7 Keamanan dan privasi - detail yang perlu dikoreksi - [Draf & Repo]

- **[Draf] 4.5 belum mengungkap** bahwa PIN dan kata sandi disimpan sebagai teks biasa (belum di-hash) - klaim KF-07 "Kredensial dan sesi terlindungi" berisiko dianggap overclaim. [Repo] 4.5.f sudah mengungkap ini dengan baik ("...masih disimpan dalam bentuk teks biasa (belum memanfaatkan salt-hashing)..."). Adopsi ke [Draf].
- **[Draf] 3.3.8:** daftar data yang dikirim ke Gemini ("NIP, tipe kendaraan, plat nomor, dan rute") kurang eksplisit - kode juga mengirim **nama** dan **riwayat kesehatan** (lihat `prompts.ts`, `driverContext`). [Repo] sudah menyebut lengkap.
- `Authorization: ***` masih ada di [Draf] (Tabel 4.2) dan [Repo] (4.5.f) - teks terpotong/placeholder; perbaiki jadi kalimat utuh.
- **[Repo] 4.5.f:** frasa "analisis klinis" sebaiknya cukup "analisis" - sistem diposisikan bukan alat klinis, jaga konsistensi posisi non-diagnostik.

### 2.8 Analisis sensitivitas [Draf]: metode belum cukup rinci - [Draf]

4.3.3 menyebut tiga perlakuan (ubah bobot terkontrol, samakan bobot, pengacakan "dalam rentang yang telah ditentukan"), tetapi: rentang pengacakan tidak disebut, jumlah pengulangan tidak disebut, dan Tabel 4.5 hanya berjudul "variasi (1) dan (2)". Tambahkan detail (jumlah undian, rentang, seed bila ada) supaya dapat direproduksi. ([Repo] belum punya bagian ini sama sekali - pertimbangkan adopsi.)

### 2.9 Pengukuran durasi [Draf]: bersihkan sisa draf dan jelaskan metode - [Draf]

- Kalimat "Nilai rata-rata dan rentang waktu **perlu diisi**..." bertentangan dengan Tabel 4.7 yang sudah terisi - hapus.
- Ada kolom header kosong di Tabel 4.7 (antara `n` dan `Rata-rata`).
- Metode pencatatan belum dijelaskan: siapa yang mengukur, dengan alat apa, ponsel apa. Beri catatan juga bahwa "Tutorial dilewati" berarti durasi nyata di lapangan akan lebih panjang.
- ([Repo] belum memuat bagian ini - adopsi, karena klaim "90 detik" jadi jauh lebih kuat dengan bukti ini.)

### 2.10 Rujukan silang dan konsistensi kecil - [Draf & Repo]

- [Draf] Tabel 4.8 (RM-1): "(Gambar 3.8 sampai 3.12)" seharusnya "(Gambar 4.1 sampai 4.5)".
- [Draf] kode kebutuhan dobel: Tabel 3.1 (fungsional) dan Tabel 3.2 (nonfungsional) sama-sama memakai KF-01 sampai KF-07 - ubah salah satu (mis. KNF-01 sampai KNF-07).
- Prosa tingkat kelelahan: [Draf] 3.3.7/4.4 masih memakai "mild fatigue"/"critical hazard" sementara tabel sudah bahasa Indonesia - samakan.
- [Draf] "PVT-B": beri definisi eksplisit pada kemunculan pertama ("varian singkat 6 percobaan"; 4.5 sudah jujur soal ini) supaya tidak disamakan dengan PVT-B tervalidasi.
- [Repo] 3.5: "Gambar 3.8 sampai 3.10" seharusnya "sampai 3.12"; caption 3.9 memuat kata Inggris "page" - ganti "halaman"; kata "supir" (4 kemunculan) - seragamkan jadi "pengemudi".
- [Repo] DAFTAR GAMBAR: cek ulang dan regenerate setelah caption final (pada audit sebelumnya ada entri yang tidak cocok dengan caption di badan).
- [Repo] daftar pustaka: "Comanici, G., et al." - pakai "dkk." atau penulis lengkap, konsisten dengan entri lain.
- [Draf] sisa kecil dari rev2 (pastikan masih relevan): "sskenario" (4.3.3), "dapat diperlihatkan melalui grafik tersendiri..." (4.3.2), tanda hubung campur "4 - 11" vs "83 - 106", sel kosong Tabel 2.1 baris Yogisutanti, titik hilang di akhir 3.2.1, "berbasis singkat" di abstrak.
- [Draf] sitasi "Cosentino dkk. (2025)" masih belum ditemukan sumbernya - ganti atau hapus.

### 2.11 Pengujian fungsional [Draf]: sudah bagus, dua tambahan kecil - [Draf]

Sudah mencakup kasus negatif (PIN salah, kata sandi lama salah, akses tanpa izin) - bagus, pertahankan. Tambahan: (a) skenario "token **palsu** (bukan hanya tanpa token) ditolak" - sekarang benar-benar ditolak berkat HMAC, jadi layak diklaim; (b) catat di 4.5 bahwa belum ada pembatasan percobaan login (rate limit) sebagai roadmap.

---

## 3. Pertanyaan tajam penguji (siapkan jawaban lisan)

1. **Kenapa bobot 0,30/0,20/0,20/0,15/0,15 dan ambang 25/45/70?** - Heuristik pengembang; PVT diberi bobot terbesar karena bukti literatur terkuat; analisis sensitivitas menunjukkan klasifikasi stabil; kalibrasi empiris masuk roadmap.
2. **Kenapa ambang lapse 500 ms, bukan 355 ms seperti literatur?** - Kompensasi latensi peramban; konservatif; sudah didokumentasikan di [Repo], lengkapi di [Draf].
3. **6 percobaan PVT - cukup?** - Antler (2022); Pahari (2025, r = 0,96); posisi sebagai skrining relatif; sebutkan granularitas lapse yang kasar (1 lapse = 16,7% indeks performa).
4. **Dari mana angka 240/372/600 ms?** - Buat eksplisit: A = baseline terjaga; B mendekati temuan pasca-mengemudi Al-Mekhlafi (353,57 ms); C = kondisi ekstrem kritis.
5. **Bagaimana kalau pengemudi "sengaja bagus"?** - False start dan lapse menangkap sebagian; motivasi tetap ancaman validitas; [Draf] 4.5 item 6 sudah menyinggung - perdalam satu kalimat.
6. **Data pribadi (termasuk riwayat kesehatan) dikirim ke Gemini - bagaimana kepatuhan UU PDP?** - Pengungkapan sudah ada; akui belum ada mekanisme consent formal; sampaikan rencana persetujuan dan minimisasi data.
7. **Kenapa CFI 25-44 (kelelahan ringan) sudah wajib co-driver?** - Kebijakan konservatif keselamatan; false-negative lebih mahal dari false-positive.
8. **"16 atau 21 unit test?"** - Perbarui laporan dulu (21/21, 4 berkas) supaya konsisten dengan repo.

---

## 4. Prioritas

**P0 - sebelum submit:**
1. Ambil ulang tangkapan layar dari build terbaru (2.4) - paling terlihat saat demo.
2. Sisipkan formula per komponen CFI dan skor modul (2.1).
3. Perbarui angka pengujian 16 menjadi 21 (2.6).
4. [Draf] pengungkapan kredensial teks biasa + daftar data Gemini yang lengkap (2.7); perbaiki `Authorization: ***` di [Draf] dan [Repo].
5. [Draf] lampiran masukan skenario; [Repo] klarifikasi ITI motorik Lampiran A (2.3).
6. [Draf] rujukan RM ke Gambar 4.1-4.5; kode KF dobel (2.10).
7. Plus item format [Draf] yang sudah jelas: daftar pustaka, judul, caption, sisa placeholder (rev2 A1/A2/A4/A5).

**P1:** [Draf] penjelasan ambang lapse (2.2); detail metode sensitivitas dan durasi (2.8, 2.9); empat tabel basis data (2.5); konsistensi istilah dan minor [Repo] (2.10); Cosentino.

**P2:** adopsi silang antar versi (bagian 5); frasa "analisis klinis"; tambahkan jawaban pertanyaan penguji ke 4.5 bila relevan.

---

## 5. Catatan dua versi - konsolidasikan menjadi satu

Saat ini ada dua berkas yang beredar dan keduanya belum saling melengkapi:

- **[Draf]** (`TEMPLATE SOFTWARE DEVELOPMENT(1).docx`): konten pengujian kaya (unit, simulasi, **sensitivitas**, **fungsional**, **durasi**), 21 referensi. Kurang: judul, daftar pustaka, caption, lampiran.
- **[Repo]** (`Laporan_CogniPulse_ICONFEST2026.docx`, repo): format lengkap (judul, daftar isi, daftar pustaka, abstrak EN, ucapan, lampiran). Kurang: hanya 2 subbagian pengujian (unit dan simulasi) - tidak ada sensitivitas/fungsional/durasi; 16 referensi; masih "tiga tabel".

**Rekomendasi:** satukan menjadi satu berkas final: kerangka dan format dari [Repo], konten pengujian dari [Draf], lalu terapkan perbaikan di atas. Jangan submit dua versi yang berbeda ke panitia.
