# 01. Scientific Research & Neurocognitive Metrics
**Project:** CogniPulse (ICONFEST 2026 - Software Development / Health)  
**Document Status:** Approved Research Baseline  
**Date:** 2026-09-30  

---

## 1. Executive Summary & Problem Formulation
Dalam dunia kerja berisiko tinggi dan pekerja digital (programmer, pengemudi, operator alat berat, pekerja shift malam), terjadi fenomena yang disebut **Silent Fatigue (Kelelahan Kognitif Terselubung)**. Pekerja sering kali secara subjektif merasa "masih kuat dan fokus", padahal secara objektif sistem saraf pusatnya telah mengalami penurunan refleks, penyempitan atensi (*attentional tunneling*), dan keterlambatan respon motorik yang setara dengan kondisi intoksikasi alkohol (Dawson & Reid, *Nature* 1997).

Tantangan di lapangan:
1. **Pemeriksaan Medis/Wearable Konvensional:** Smartwatch atau EEG mahal, invasif, dan tidak praktis untuk skrining harian sebelum bekerja.
2. **Kamera/Eye-tracking:** Menimbulkan resistensi privasi dari karyawan dan sangat rentan gagal di kondisi pencahayaan ruangan yang dinamis.
3. **Kebutuhan Industri:** Dibutuhkan asesmen kilat berdurasi **< 90 detik**, non-invasif, tanpa kamera, berbasis gamifikasi interaktif, namun memiliki **validitas klinis yang ketat**.

---

## 2. Validasi Industri: Studi Kasus AlertMeter (Predictive Safety)
Berdasarkan riset pasar dan teknologi keselamatan kerja global, konsep ini terbukti berhasil diterapkan oleh **AlertMeter** (dikembangkan oleh *Predictive Safety*, berbasis riset NASA dan US Military):
* **Format:** Tes grafis interaktif berdurasi **45–60 detik** pada smartphone/tablet di awal shift kerja.
* **Aplikasi Nyata:** Digunakan di sektor pertambangan (*mining*), logistik truk (*trucking*), dan pabrik manufaktur berat di AS, Australia, dan Amerika Latin.
* **Metodologi Utama:** Mengukur deviasi performa terhadap **Personal Baseline**, bukan standar populasi umum.
* **Kesimpulan untuk Juri ICONFEST:** Ide kita memiliki landasan industri nyata yang bernilai komersial tinggi (B2B Health & Safety) dan bukan sekadar proyek main-main.

---

## 3. Landasan Ilmiah & Formulasi Matematis

Asesmen CogniPulse tidak mengukur "skor game", melainkan mengekstrak 3 parameter neurokognitif standar emas:

### A. Psychomotor Vigilance Task (PVT-B)
Dikembangkan oleh **Dr. David F. Dinges & Dr. Mathias Basner** (University of Pennsylvania / NASA Sleep Medicine):
* Merupakan standar emas dunia untuk mendeteksi *sleep deprivation* dan *sustained attention failure*.
* Stimulus visual muncul secara acak (*pseudo-random delay* antara $1.5\text{s}$ hingga $4.0\text{s}$).

#### Formulasi Standar Medis Dinges & Basner:
1. **Reciprocal Response Speed (Mean $1/\text{RT}$):**
   $$\text{Response Speed} = \frac{1000}{\text{RT}} \quad (\text{s}^{-1})$$
   *Rasional Ilmiah:* Mean RT biasa sangat sensitif terhadap outlier ekstrem. Menghitung kebalikan waktu reaksi ($1/\text{RT}$) menormalkan distribusi data miring (*skewed distribution*) dan memiliki korelasi tertinggi dengan penurunan fungsi otak.

2. **Attentional Lapses ($N_{\text{lapse}}$):**
   $$\text{Lapse} = \begin{cases} 1, & \text{jika } \text{RT} \ge 355\text{ ms (Brief PVT)} \\ 0, & \text{lainnya} \end{cases}$$
   *Rasional Ilmiah:* Lapses merepresentasikan kegagalan atensi mendadak (*micro-sleep* kognitif). Otak yang segar memiliki 0 lapses; otak lelah mengalami lonjakan lapses drastis.

3. **False Starts / Anticipatory Errors ($N_{\text{false}}$):**
   $$\text{False Start} = \begin{cases} 1, & \text{jika user merespons saat } \text{RT} < 100\text{ ms atau sebelum stimulus muncul} \\ 0, & \text{lainnya} \end{cases}$$
   Mengindikasikan hilangnya kontrol inhibisi saraf kognitif (impulsif karena cemas/lelah).

4. **PVT Performance Index ($PI$):**
   $$PI = \left( 1 - \frac{N_{\text{lapse}} + N_{\text{false}}}{N_{\text{total}}} \right) \times 100\%$$

---

### B. Cognitive Inhibitory Control (Go/No-Go & Stroop Paradigm)
* Mengukur fungsi lobus frontal otak dalam melakukan *decision conflict resolution* dan *inhibitory control*.
* Stimulus target muncul: Hijau (Go $\rightarrow$ tekan secepat mungkin) vs Merah/Distraktor (No-Go $\rightarrow$ tahan diri, jangan ditekan).
* **Metrik:**
  - *Commission Errors (False Alarms):* Menekan pada sinyal No-Go $\rightarrow$ mengindikasikan *Decision Fatigue* dan hilangnya *prefrontal inhibition*.
  - *Omission Errors (Misses):* Gagal menekan pada sinyal Go.

---

### C. Motor Cadence & Neuromuscular Rhythm Tapping
* Mengukur kelelahan saraf motorik halus dan tremor melalui ketukan ritmis selama 15 detik.
* **Metrik:**
  - *Inter-Tap Interval (ITI) Standard Deviation (Jitter):* Semakin tinggi varians ritme ketukan, semakin lelah sistem motorik.
  - *Cadence Decay Rate (Slope):* Penurunan kecepatan ketukan dari detik ke-1 hingga detik ke-15.

---

## 4. Analisis Risiko Teknis & Strategi Mitigasi

| Risiko Kritis | Dampak Jika Dibiarkan | Solusi Teknis CogniPulse (Pertahanan Juri) |
| :--- | :--- | :--- |
| **Hardware & Browser Latency (10–90 ms)** | Laptop 60Hz vs 144Hz memiliki input lag berbeda. Skor antar juri bisa timpang. | **Within-Subject Baseline Calibration:** Mengukur $\Delta$ deviasi dari baseline user di device yang sama. Ditambah optimasi: `performance.now()`, event `pointerdown` (tanpa delay 300ms mobile), dan `requestAnimationFrame`. |
| **Learning / Practice Effect** | Pengguna makin sering main, makin hafal ritme game sehingga menutupi rasa lelahnya. | **Involuntary Neuromarkers:** Stimulus diacak secara matematis. Otak yang lelah secara biologis **tidak dapat memalsukan atau melatih** lonjakan lapses dan variabilitas milidetik. |
| **The Dissociation Paradox** | User merasa bugar padahal otaknya lelah (Silent Fatigue). | **Dual-Layer Analysis:** Membandingkan *Subjective Self-Score (1-5)* dengan *Objective Telemetry*. Jurang disparitas tinggi menjadi pemicu alarm peringatan dini. |
| **Gimmick AI Wrapper Trap** | Juri IT mencap Gemini sebagai tempelan yang boros komputasi. | **Arsitektur Bertingkat:** Formula Dinges menghitung angka deterministik $\rightarrow$ Gemini bertindak sebagai *Clinical Reasoning & Risk Forecast Copilot* (bukan kalkulator angka). |
| **Live-Demo Failure (Internet Macet)** | Presentasi 15 menit gagal jika koneksi aula kampus putus. | **Deterministic Local Fallback Engine:** Jika API Gemini timeout $> 3.5\text{s}$, sistem beralih ke rule-engine klinis lokal tanpa interupsi UI. |
