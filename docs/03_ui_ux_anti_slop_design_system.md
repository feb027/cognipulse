# 03. UI/UX & Anti-Slop Design System
**Project:** CogniPulse (ICONFEST 2026 - Software Development / Health)  
**Document Status:** Approved Design System & Aesthetics Blueprint  
**Aesthetic Family:** Precision Medical Diagnostic HUD / Cockpit Instrument  
**Date:** 2026-09-30  

---

## 1. Analisis Kritis: Mengapa UI AI Sering Dicap "AI Slop"?

Ketika juri kompetisi software development melihat desain web buatan AI, mereka dengan sangat cepat mengenali pola-pola murahan (*AI-tells*) yang menurunkan kredibilitas proyek:

| Penyakit "AI Slop" | Ciri-Ciri Khas AI Default | Dampak Negatif di Mata Juri |
| :--- | :--- | :--- |
| **The Lila Gradient Disease** | Background ungu/biru neon menyala, tombol glowing gradien ungu-pink, mesh blur raksasa tanpa fungsi. | Terlihat seperti template landing page murahan; tidak pantas untuk aplikasi klinis/kesehatan. |
| **Bento-Card Bloat** | Seluruh layout diisi 6–9 kotak melayang dengan rounded corner besar, drop-shadow blur tebal, dan icon lingkaran di tengah. | Terlihat repetitif, membuang-buang ruang layar, dan minim hierarki informasi nyata. |
| **Centered Empty Hero** | Judul besar di tengah dengan 3 kalimat klise marketing, diikuti 3 kartu fitur yang sama persis formatnya. | Tidak terlihat seperti produk software nyata yang memecahkan masalah teknis. |
| **Typographic Monotony** | Menggunakan font standar Inter reguler untuk semua teks tanpa variasi monospace pada angka teknis. | Angka-angka telemetri (milidetik, deviasi standar) terlihat seperti teks biasa, bukan data instrumen. |
| **Static State Only** | Tidak ada state *loading skeletal*, transisi error yang elegan, atau tactile micro-interactions saat disentuh. | Terasa kaku dan tidak responsif saat dicoba langsung oleh juri. |

---

## 2. Arah Estetika CogniPulse: "Precision Medical Diagnostic HUD"

Alih-alih membuat web bertema game kartun atau kartu gradien ungu, CogniPulse mengadopsi estetika **Instrumen Diagnostik Presisi Tinggi (Medical Cockpit HUD)** yang terinspirasi dari produk kelas dunia seperti **Apple Health, WHOOP, Linear, dan NASA telemetry console**:

```
+---------------------------------------------------------------------------------+
| COGNIPULSE // NEURO-TELEMETRY CONSOLE                     [STATUS: CALIBRATED] |
+---------------------------------------------------------------------------------+
| [OPERATOR STATUS]                 | [LIVE REACTION RUNNER]                      |
| Shift: Night Shift (02:45 AM)     |                                             |
| Baseline: 232ms ± 14ms            |     +---------------------------------+     |
| Last Sleep: 4.5h [DEFICIT]        |     | STIMULUS DETECTED: 218 ms       |     |
|                                   |     | Jitter: ±4.2ms [NORMAL CADENCE] |     |
| CFI INDEX: 68/100                 |     +---------------------------------+     |
| [WARNING: ELEVATED DRIFT]         |                                             |
+-----------------------------------+---------------------------------------------+
| GEMINI CLINICAL DIAGNOSIS & 4-HOUR RISK RADAR                                   |
| > Differential: Prefrontal Attention Tunneling (Sleep-Induced)                  |
| > Risk Trajectory: Error rate spikes +42% in next 90 minutes                    |
| > Protocol: 15-min Non-Sleep Deep Rest (NSDR) + 250ml electrolyte fluid         |
+---------------------------------------------------------------------------------+
```

---

## 3. Konfigurasi "Three Dials" (Berdasarkan Taste-Skill Standards)

* **`DESIGN_VARIANCE: 6` (Structured Asymmetry):**
  Tata letak tidak simetris membosankan, melainkan fungsional dengan pembagian ruang yang jelas antara panel telemetri instrumen (kiri), arena micro-task responsif (kanan/tengah), dan *diagnostic clinical intelligence* (bawah).
* **`MOTION_INTENSITY: 4` (Disciplined Precision):**
  Tidak ada animasi memantul-mantul atau transisi lebay. Animasi hanya digunakan untuk hal yang bermakna fungsional: detak timer milidetik, indikator kedipan status, dan transisi mulus antar fase tes.
* **`VISUAL_DENSITY: 7.5` (Instrument Cockpit Density):**
  Informasi padat dan terstruktur dengan *hairline borders* (garis 1px `border-zinc-800/80`), bukan kartu-kartu berbayang tebal yang terisolasi.

---

## 4. Sistem Warna Klinis Fungsional (Zero Generic Purple)

Warna digunakan strictly untuk fungsi indikator status biologis:

| Token / Warna | Nilai Hex | Fungsi & Makna Fungsional |
| :--- | :--- | :--- |
| **Base Slate / Zinc** | `#09090b` (950), `#18181b` (900) | Latar belakang instrumen gelap yang nyaman di mata pekerja malam. |
| **Precision Cyan** | `#06b6d4` (Cyan 500) | Stimulus aktif, garis kalibrasi instrumen, kursor fokus. |
| **Clinical Emerald** | `#10b981` (Emerald 500) | Status **Fit for Duty** (CFI < 30) — Refleks & atensi normal prima. |
| **Warning Amber** | `#f59e0b` (Amber 500) | Status **Elevated Fatigue** (CFI 30–65) — Perlu istirahat mikro segera. |
| **Safety Crimson** | `#f43f5e` (Rose 500) | Status **Critical Impairment** (CFI > 65) — Bahaya operasional / Micro-sleep risk. |
| **Neutral Borders** | `#27272a` (Zinc 800) | Pembatas garis rambut 1px yang memisahkan modul instrumen tanpa drop-shadow tebal. |

---

## 5. Tipografi & Data Readouts

* **Display / Headline:** Font Sans modern (`Geist Sans` / `Inter Tight`) dengan `tracking-tight font-semibold` untuk judul instrumen dan status diagnosis.
* **Telemetry Numerals:** Font Monospaced (`Geist Mono` / `JetBrains Mono`) dengan fitur `tabular-nums` untuk pembacaan angka waktu reaksi (misal: `248.6 ms`), deviasi standar (`± 12.4 ms`), dan timestamp. Hal ini memberikan bobot ilmiah otentik bagi siapa saja yang melihatnya.
* **Labeling Hierarchy:** Label berada di atas data dengan ukuran kecil berhuruf kapital halus (`text-xs uppercase tracking-wider text-zinc-400 font-mono`), merefleksikan panel kontrol pesawat atau monitor ICU.

---

## 6. Feedback Taktil & Sensori (Web Audio Synthesizer)

Aplikasi game yang hebat bukan hanya visual, tapi memberikan umpan balik indera (*sensory feedback*):
1. **Audio Synthesis (Zero-Asset Web Audio):**
   * Menggunakan oscillator audio native browser (`AudioContext`) tanpa file `.mp3` eksternal yang lambat diunduh.
   * Frekuensi $880\text{ Hz}$ (nada tinggi jernih, $40\text{ms}$) saat stimulus PVT muncul.
   * Frekuensi $440\text{ Hz}$ (nada konfirmasi mantap) saat user melakukan tap tepat waktu.
   * Frekuensi $220\text{ Hz}$ (nada peringatan rendah) jika terjadi *false start* atau *No-Go error*.
2. **Tactile Response:**
   * Animasi tekan tombol mikro (`active:scale-[0.98] transition-transform duration-75`) yang memberikan sensasi menekan tombol instrumen fisik.
