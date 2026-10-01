<!-- prettier-ignore -->
<div align="center">

# CogniPulse

### Non-Invasive Neuro-Telemetry Cognitive Fatigue Assessment Platform
**Fit-for-Duty Rapid Screening Powered by 4-Modality Neurocognitive Engine & Gemini 3.8 Flash**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.26_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_Strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4_Tokens-38bdf8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash_API-4285f4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-10%2F10_Passing-6e9f18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Standards](https://img.shields.io/badge/Standard-NASA_Dinges--Basner_PVT-red?style=flat-square)](https://www.nasa.gov/)
[![Privacy](https://img.shields.io/badge/Privacy-UU_PDP_No._27%2F2022_Compliant-emerald?style=flat-square)](https://peraturan.go.id/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[Ringkasan](#ringkasan--urgensi-solusi) • [Landasan Ilmiah](#landasan-ilmiah-medis) • [4 Modalitas Asesmen](#4-modalitas-neurokognitif) • [Arsitektur Sistem](#arsitektur-sistem--resilience-ai) • [Panduan Memulai](#panduan-menjalankan-proyek) • [Verifikasi & Pengujian](#verifikasi--pengujian-sistem) • [Filosofi Desain](#filosofi-desain--anti-ai-slop) • [Struktur Repositori](#struktur-repositori-modular)

<br />

<img src="./docs/images/dashboard-desktop.png" alt="CogniPulse Console Dashboard" width="900" style="border-radius: 12px; border: 1px solid #27272a;" />

</div>

> [!TIP]
> **Ajang Kompetisi:** ICONFEST 2026 (Informatics Conference & Festival, Universitas Siliwangi)  
> **Kategori:** Software Development: Bidang Kesehatan  
> **Status Verifikasi:** 10/10 Vitest Unit Tests Passed (100%), 0 TypeScript Errors, Production Build Ready.

---

## Ringkasan & Urgensi Solusi

### Fenomena Silent Cognitive Fatigue
Pada sektor industri berisiko tinggi (operator transportasi, teknisi kelistrikan, petugas medis gawat darurat, dan *software engineers* pada insiden kritis), ancaman terbesar terhadap keselamatan operasional bukanlah kelelahan fisik yang kasat mata, melainkan **Silent Cognitive Fatigue (Kelelahan Kognitif Terselubung)**. 

Riset fisiologi tidur (Dawson & Reid, *Nature*) membuktikan bahwa defisit tidur selama 17-19 jam menurunkan fungsi eksekutif korteks prefrontal setara dengan kadar alkohol dalam darah (BAC) 0.05%, dan meningkat setara BAC 0.10% setelah 24 jam terjaga. Sayangnya, penilaian mandiri (*self-assessment*) subjektif sangat rentan bias: pekerja sering merasa "masih bugar dan sanggup bekerja" sesaat sebelum terjadi *micro-sleep* mematikan.

```
+---------------------------------------------------------------------------------------+
| PERBANDINGAN METODE PENGUKURAN KELELAHAN OPERASIONAL                                  |
+--------------------------+-----------------------+--------------------+---------------+
| Parameter                | Wearables (EEG/Ring)  | Camera Eye-Tracker | CogniPulse    |
+--------------------------+-----------------------+--------------------+---------------+
| Biaya Implementasi       | Tinggi (Jutaan/alat)  | Menengah (Webcam)  | Nol (Web-App) |
| Resistensi Privasi (PDP) | Rendah                | Tinggi (Wajah/Mata)| Nol (Privat)  |
| Ketergantungan Hardware  | Perangkat Khusus      | Kalibrasi Cahaya   | Standar Web   |
| Waktu Asesmen            | Kontinu               | Kontinu            | 90 Detik      |
| Validitas Uji Klinis     | Estimasi Fisiologis   | Estimasi Okular    | Uji Psikomotor|
+--------------------------+-----------------------+--------------------+---------------+
```

### Solusi CogniPulse
**CogniPulse** menghadirkan platform asesmen kesiapan kerja (*Fit-for-Duty*) non-invasif berbasis web yang mengevaluasi kesiapan neuromuskular dan neurokognitif hanya dalam **90 detik**. Tanpa pelacakan kamera, tanpa hardware khusus, dan tanpa mengorbankan privasi data pekerja (mematuhi UU PDP No. 27/2022).

---

## Landasan Ilmiah Medis

CogniPulse tidak menggunakan skor permainan acak, melainkan mengadopsi protokol baku laboratorium neurokognitif global:

1. **NASA Psychomotor Vigilance Task (PVT-B)**:
   - Diformulasikan oleh Dr. David F. Dinges dan Dr. Mathias Basner (Unit for Experimental Psychiatry, University of Pennsylvania / NASA).
   - Metrik primer: *Reciprocal Response Speed* ($1/\text{RT} \times 1000 \text{ s}^{-1}$) yang mentransformasi skew distribusi waktu reaksi menjadi parametrik normal.
   - Deteksi *Attentional Lapses* ($\ge 355\text{ ms}$): indikator utama kelelahan sirkadian dan degradasi atensi sustained.
   - Deteksi *False Starts / Anticipatory Errors* ($< 100\text{ ms}$): kegagalan kontrol inhibisi kortikal.

2. **Stroop Color-Word Interference Effect (1935)**:
   - Menguji *Inhibitory Executive Function* dan fleksibilitas kognitif di *anterior cingulate cortex* (ACC).
   - Menghitung efek interferensi (selisih latensi stimulus inkongruen vs kongruen) sebagai biomarker kelelahan lobus frontal.

3. **Corsi Block-Tapping Spatial Memory Task (1972)**:
   - Standar emas pengujian rentang memori kerja spasial (*visuospatial sketchpad*).
   - Mengukur degradasi retensi urutan spasial di bawah tekanan beban kerja mental.

4. **Neuromotor Cadence & Finger Tapping Jitter**:
   - Menghitung stabilitas *Inter-Tap Interval* (ITI) dan kemiringan regresi stamina neuromuscular (*fatigue decay slope*).

---

## 4 Modalitas Neurokognitif

CogniPulse mengintegrasikan 4 modul asesmen terstandarisasi yang dijalankan berurutan secara mulus:

```
[ Check-in Konteks ] -> [ PVT-B Sustained ] -> [ Stroop Focus ] -> [ Corsi Memory ] -> [ Motor Tapping ] -> [ Analisis Gemini 3.8 ]
```

### 1. Psychomotor Vigilance Task (PVT-B)
Menguji refleks sensorimotor terhadap kemunculan stimulus visual acak (interval jeda acak 2000-5000ms untuk mencegah respon antisipatif).

<div align="center">
  <img src="./docs/images/pvt-test.png" alt="Uji PVT-B Reaction Speed" width="700" style="border-radius: 8px; border: 1px solid #27272a;" />
</div>

* **Target Evaluasi:** Kecepatan respon milidetik murni, *lapses*, dan laju responsivitas sustained.
* **Audio Feedback:** Synthesizer Web Audio API native menghasilkan nada feedback instan tanpa latensi file audio eksternal.

---

### 2. Stroop Cognitive Inhibition Task
Pekerja diuji untuk memilih warna tinta teks, bukan kata yang tertulis, di bawah kondisi konflik semantik.

<div align="center">
  <img src="./docs/images/stroop-test.png" alt="Uji Inhibisi Kognitif Stroop" width="700" style="border-radius: 8px; border: 1px solid #27272a;" />
</div>

* **Target Evaluasi:** Efisiensi pemrosesan inhibisi, akurasi keputusan di bawah konflik, dan latensi keputusan kognitif.
* **Fitur Edukatif:** Disertai tutorial interaktif sebelum tes untuk memastikan pemahaman tanpa menimbulkan bias frustrasi.

---

### 3. Corsi Block-Tapping Spatial Working Memory
Pekerja mengingat dan mereplikasi urutan blok visual acak dengan panjang rangkaian yang bertahap.

<div align="center">
  <img src="./docs/images/corsi-test.png" alt="Uji Memori Kerja Spasial Corsi" width="700" style="border-radius: 8px; border: 1px solid #27272a;" />
</div>

* **Target Evaluasi:** Rentang memori kerja spasial, latensi mengingat, dan resistensi terhadap kebingungan urutan.
* **Arsitektur Stabil:** Dilengkapi sistem debounce state dan pembersihan timer otomatis untuk mencegah perulangan tak terbatas (*infinite render protection*).

---

### 4. Neuromotor Fast-Tapping Test
Uji ketukan cepat berirama untuk mengukur kecepatan transmisi neuromuskular dan konsistensi motorik halus.

* **Target Evaluasi:** Frekuensi ketukan (Hz), jitter deviasi standar antar-ketukan ($\pm\text{ms}$), dan rasio perlambatan irama (*fatigue decay*).

---

## Pengalaman Mobile-First

CogniPulse dirancang dengan pendekatan **Mobile-First murni** mengacu pada standar *Apple Human Interface Guidelines*:

<div align="center">
  <img src="./docs/images/dashboard-mobile.png" alt="CogniPulse Mobile Experience" width="380" style="border-radius: 16px; border: 1px solid #27272a;" />
</div>

* **Desain Apple Bottom Sheet:** Kartu vital dapat ditekan untuk memunculkan lembar informasi bawah dengan gestur tarikan halus (*touch drag handle*).
* **Zero Card Clutter:** Mengeliminasi kartu bertumpuk AI slop, digantikan oleh tipografi bernapas, pemisah garis 1px (*hairline borders*), dan angka tabular monospaced.
* **Target Sentuh Ergonomis:** Seluruh elemen interaktif memenuhi ukuran minimum 44px dengan efek sentuh pegas mikro (*active:scale-[0.98]*).

---

## Formulasi Composite Fatigue Index (CFI)

CogniPulse menggabungkan telemetri dari keempat modalitas menjadi satu metrik komposit terstandarisasi: **Composite Fatigue Index (CFI)** dengan rentang skor $0 - 100$:

$$\text{CFI} = 100 - \left( w_{\text{pvt}} \cdot P_{\text{pvt}} + w_{\text{stroop}} \cdot P_{\text{stroop}} + w_{\text{corsi}} \cdot P_{\text{corsi}} + w_{\text{motor}} \cdot P_{\text{motor}} + P_{\text{context}} \right)$$

Di mana bobot kontribusi klinis:
- $w_{\text{pvt}} = 0.35$ (Penalti waktu reaksi lambat, defisit $1/\text{RT}$, dan jumlah *attentional lapses*)
- $w_{\text{stroop}} = 0.25$ (Penalti kesalahan inhibisi dan waktu interferensi konflik)
- $w_{\text{corsi}} = 0.20$ (Penalti kegagalan retensi memori spasial)
- $w_{\text{motor}} = 0.15$ (Penalti instabilitas irama dan jitter neuromuskular)
- $P_{\text{context}} = 0.05$ (Penyesuaian kontekstual: durasi tidur $\le 5$ jam atau konsumsi stimulan berlebih)

### Klasifikasi Status Kebugaran Kerja
- **Optimal (Skor 80 - 100):** Refleks motorik prima, atensi sustained stabil, aman untuk tugas berisiko tinggi.
- **Waspada (Skor 50 - 79):** Penurunan kecepatan kognitif ringan, disarankan istirahat mikro sebelum mengoperasikan mesin.
- **Kritis (Skor < 50):** Terdeteksi gejala *micro-sleep* atau defisit kontrol inhibisi signifikan. Pekerja diwajibkan *stand-down*.

---

## Arsitektur Sistem & Resilience AI

CogniPulse mengimplementasikan arsitektur hybrid multi-tier untuk menjamin **keandalan 100% tanpa crash**, bahkan ketika jaringan internet terputus di lapangan operasional:

```mermaid
flowchart TD
    A["Interaksi Pengguna (90s Asesmen)"] --> B["Telemetri Presisi Tinggi (ms)"]
    B --> C["Client-Side Mathematical Engine"]
    C --> D["Kalkulasi Skor CFI, PVT, Stroop, Corsi, Motor"]
    D --> E["API Route /api/analyze"]
    
    subgraph "Resilience Failover Cascade"
        E --> F{"Gemini 3.8 Flash<br/>(Primary Model)"}
        F -- "Sukses" --> G["Diagnosis Klinis Terstruktur"]
        F -- "503 / Timeout 4s" --> H{"Gemini 3.5 Flash Lite<br/>(Fast Secondary)"}
        H -- "Sukses" --> G
        H -- "Gagal / Cooldown" --> I{"Gemini 2.5 Flash<br/>(Tertiary Model)"}
        I -- "Sukses" --> G
        I -- "Offline / Semua Gagal" --> J["Local Clinical Deterministic Heuristics"]
        J --> G
    end

    G --> K["Dashboard Hasil & Rekomendasi Presisi"]
```

### Karakteristik Model AI
* **Gemini 3.8 Flash:** Berfungsi sebagai *Clinical Neurophysiologist & Risk Copilot* yang menyintesis korelasi multi-faktor (ritme sirkadian, defisit tidur, waktu reaksi) untuk memproyeksikan risiko kerja 2-4 jam ke depan.
* **Deterministic Fallback Engine:** Algoritma berbasis aturan medis lokal yang otomatis aktif dalam waktu $\le 4$ detik jika API Gemini mengalami lonjakan beban atau jaringan terputus, memastikan demonstrasi kompetisi dan operasional pabrik tidak pernah terhenti.

---

## Kepatuhan Privasi & Regulasi (UU PDP)

CogniPulse dibangun dengan prinsip **Privacy-by-Design** yang sepenuhnya selaras dengan **Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022)**:

* **Zero-Camera / No Biometric Facial Capture:** Tidak mengambil foto, video, maupun rekaman suara pekerja. Menghilangkan risiko kebocoran data biometrik wajah.
* **Local-First Storage:** Seluruh riwayat asesmen disimpan secara eksklusif di ruang penyimpanan browser pengguna (`localStorage`) dan dapat dibersihkan seketika dengan 1 klik.
* **Zero PII Transmission:** Data yang dikirim ke API Gemini hanyalah angka telemetri anonim murni (milidetik dan angka kesalahan), tanpa nama lengkap, identitas KTP, maupun metadata pelacak.

---

## Panduan Menjalankan Proyek

### Prasyarat Sistem
* [Node.js](https://nodejs.org/) versi 18.18+ atau 20+
* [NPM](https://www.npmjs.com/) versi 9+
* Kunci API Google AI Studio (Gemini)

### 1. Kloning Repositori
```bash
git clone https://github.com/your-username/cognipulse.git
cd cognipulse
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (.env.local)
Buat berkas `.env.local` di direktori utama proyek:
```bash
cp .env.example .env.local
```
Isi konfigurasi kunci API:
```env
GEMINI_API_KEY=AIzaSyCatOsK2Wtdiq3ag8Axg1FWhavqAL2IraQ
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada tautan [http://localhost:3000](http://localhost:3000).

### 5. Membangun untuk Produksi
```bash
npm run build
npm run start
```

---

## Verifikasi & Pengujian Sistem

CogniPulse menerapkan pipeline verifikasi ketat untuk memastikan tidak ada kecacatan logika matematika maupun runtime:

```bash
# Menjalankan rangkaian unit test otomatis
npm run test

# Menjalankan verifikasi tipe statis TypeScript
npx tsc --noEmit
```

### Hasil Rangkaian Pengujian Vitest
```
 ✓ tests/pvt-scoring.test.ts (2 tests)
 ✓ tests/stroop-scoring.test.ts (2 tests)
 ✓ tests/motor-scoring.test.ts (2 tests)
 ✓ tests/corsi-scoring.test.ts (2 tests)
 ✓ tests/cfi-scoring.test.ts (1 test)
 ✓ tests/gemini-client.test.ts (1 test)

 Test Files  6 passed (6)
      Tests  10 passed (10)
   Start at  00:48:15
   Duration  495ms (transform 182ms, setup 0ms, collect 389ms, tests 25ms, environment 0ms, prepare 276ms)
```

---

## Filosofi Desain & Anti-AI Slop

Proyek ini dikembangkan di bawah pengawasan ketat aturan **Anti-AI Slop** dan pedoman keahlian visual:

1. **Anti-Lila & Palet Disiplin:** Menolak gradien ungu-pink neon template AI. Menggunakan tema gelap pekat berbasis Zinc (`#09090b`) dengan aksen fungsional medis (Emerald untuk bugar, Amber untuk waspada, Rose untuk kritis).
2. **Tipografi Fungsional:** Menggunakan angka tabular monospaced (`font-mono tabular-nums`) untuk data telemetri berkecepatan milidetik, mencegah angka melompat saat rendering.
3. **Hairline 1px Aesthetics:** Menghindari bayangan tebal kartu bento yang melayang tanpa fungsi. Mengedepankan pembatas tipis (`border-zinc-800/80`) dengan sudut presisi.
4. **Copywriting Klinis & Jujur:** Menolak frasa klise seperti *"Empower your wellness"*, *"Revolutionary platform"*, atau *"Seamless AI"*. Menggunakan bahasa Indonesia fungsional, padat, dan jelas.
5. **No Em Dash Policy:** Sepenuhnya menghindari karakter em dash (`—`) dalam teks antarmuka sesuai aturan kebersihan tata bahasa agen.

---

## Struktur Repositori Modular

Setiap berkas dalam repositori ini mematuhi prinsip **Single Responsibility Principle (SRP)** dengan batasan ketat maksimal 150-200 baris kode per berkas:

```
cognipulse/
├── docs/
│   └── images/                   # Tangkapan layar resolusi tinggi aplikasi
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── api/analyze/          # Route handler Gemini 3.8 Flash & failover
│   │   ├── layout.tsx            # Root layout & font configuration
│   │   └── page.tsx              # Halaman utama & orchestrator tab
│   ├── components/
│   │   ├── assessment/           # Modul asesmen neurokognitif
│   │   │   ├── pvt/              # Modul PVT-B (Timer, stage, HUD)
│   │   │   ├── stroop/           # Modul Stroop (Tutorial, visual conflict)
│   │   │   ├── corsi/            # Modul Corsi Block (Tutorial, memory grid)
│   │   │   └── motor/            # Modul Tapping (Cadence, rhythmic target)
│   │   ├── dashboard/            # Modul ringkasan, riwayat & bottom sheet
│   │   ├── navigation/           # Apple profile dropdown & menu
│   │   ├── results/              # Diagnosis visual & rekomendasi pemulihan
│   │   └── ui/                   # Primitif UI (Button, Card, Badge)
│   ├── hooks/                    # Custom hooks untuk runner asesmen
│   ├── lib/
│   │   ├── ai/                   # Gemini client & local resilience fallback
│   │   ├── audio/                # Web Audio API native synthesizer
│   │   └── scoring/              # Kalkulator matematika murni (CFI, PVT, dll)
│   └── types/                    # Kontrak TypeScript terpusat
├── tests/                        # 10 Unit tests Vitest
├── AGENTS.md                     # Aturan rekayasa workspace & antislop
└── package.json                  # Dependensi proyek
```

---

## Tim Pengembang & Apresiasi

Dikembangkan dengan dedikasi penuh untuk **ICONFEST 2026** (Universitas Siliwangi):
* **Fakultas Teknik, Jurusan Informatika**
* **Cabang Lomba:** Software Development (Bidang Kesehatan)
* **Tahun Kompetisi:** 2026

*Lisensi di bawah [MIT License](LICENSE).*
