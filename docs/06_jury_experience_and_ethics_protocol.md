# 06. Jury Experience & Medical Ethics Protocol
**Project:** CogniPulse (ICONFEST 2026 - Software Development / Health)  
**Document Status:** Approved Competition Strategy Blueprint  
**Date:** 2026-09-30  

---

## 1. Strategi "The 60-Second Jury Hook" (Demo Cepat untuk Juri Lomba)

### Tantangan Nyata Penjurian Babak Penyisihan
* Juri lomba meninjau puluhan tautan aplikasi (*Link Deployment*) dalam waktu yang sangat terbatas (rata-rata 2–3 menit per proposal).
* Jika aplikasi mewajibkan juri bermain 3 hari berturut-turut untuk membangun baseline atau alur pendaftarannya rumit, juri akan langsung menutup tab dan memberikan nilai rendah.

### Solusi Teknis: `JuryScenarioSimulator`
CogniPulse menyertakan bilah navigasi cepat khusus penilai lomba:
1. **Mode Live Self-Assessment:** Juri dapat langsung menguji refleksnya sendiri dengan kalibrasi otomatis instan dalam 75 detik.
2. **Preset Profil Skenario 1-Klik:**
   - **Profil A: "Pekerja Bugar / Shift Normal" (CFI: 18 / Fit for Duty):**
     Latency rata-rata $212\text{ms}$, 0 lapses, jitter motorik stabil $\pm 3.1\text{ms}$. Gemini AI mendiagnosis kesiapan optimal dan menyarankan mode kerja fokus.
   - **Profil B: "Software Engineer Begadang" (CFI: 74 / Moderate Fatigue):**
     Latency $348\text{ms}$, 3 attentional lapses, variasi tapping $\pm 18.4\text{ms}$. Gemini AI mendiagnosis *Sleep-Deprived Attention Tunneling*, memprediksi risiko bug/kesalahan koding meningkat $+38\%$, dan meresepkan 15 menit *Non-Sleep Deep Rest (NSDR)*.
   - **Profil C: "Pengemudi Truk Malam / Kritis" (CFI: 91 / Critical Hazard):**
     Latency $462\text{ms}$, 7 attentional lapses, penurunan tempo motorik drastis. Gemini AI membunyikan alarm bahaya merah (*Micro-Sleep Risk Alert*) dan instruksi penghentian kemudi segera.

*Dampak di Mata Juri:* Juri langsung menyaksikan ketepatan diagnosis dan kecerdasan reasoning Gemini 3.8 Flash secara komparatif hanya dalam 30 detik pengujian!

---

## 2. Kepatuhan Etika Medis & Regulasi Privasi (UU PDP Indonesia)

Sesuai arahan Guidebook ICONFEST 2026 (Halaman 2: *"memiliki kesadaran etis dan sosial dalam menciptakan solusi teknologi"*), CogniPulse menerapkan protokol etika medis:

### A. Non-Diagnostic Disclosure
* CogniPulse secara transparan diposisikan sebagai **Sistem Skrining Kesiapan Kerja Operasional (Operational Fitness-for-Duty Screening)**, bukan sebagai alat diagnosis penyakit medis formal (*medical diagnostic device*).
* Menghindarkan tim dari pelanggaran regulasi kefarmasian/alat kesehatan Kemenkes RI atau FDA.

### B. Arsitektur Privasi Data (UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi)
* **Zero Personally Identifiable Information (Zero-PII):** Tidak ada data nama KTP, nomor HP, atau email yang dikirimkan ke cloud AI.
* **Local-First Benchmarking:** Riwayat telemetri disimpan secara lokal di peramban pekerja (IndexedDB / LocalStorage terenkripsi).
* **Payload AI Anonim:** Data yang dikirimkan ke Gemini API murni berupa vektor statistik numerik:
  $$\text{Payload} = \{ \text{speed\_reciprocal}: 4.21, \text{lapses}: 3, \text{jitter\_ms}: 14.2, \text{sleep\_hours}: 4.5 \}$$
  tanpa ada metadata identitas yang dapat dilacak ke individu tertentu.

---

## 3. Strategi Pengujian Otomatis (Vitest Automated Suite)

Untuk mengamankan nilai sempurna pada sub-kriteria babak final **"Stabilitas dan Keandalan Sistem" (Bobot 45%)**, repositori dilengkapi pengujian unit otomatis:
* `tests/scoring.test.ts`: Menguji kebenaran formula Dinges & Basner ($1/\text{RT}$, attentional lapses, ITI standard deviation).
* `tests/fallback.test.ts`: Menguji transisi mulus ke *Tier 3 Local Fallback Engine* saat API mock terputus.
* `npm run test`: Berjalan cepat dengan Vitest dalam $< 2\text{ detik}$.
