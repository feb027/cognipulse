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
[![Live Production](https://img.shields.io/badge/Live_Demo-iconfest.febnawanfr.my.id-2563eb?style=flat-square&logo=cloudflare&logoColor=white)](https://iconfest.febnawanfr.my.id)
[![Standards](https://img.shields.io/badge/Standard-NASA_Dinges--Basner_PVT-red?style=flat-square)](https://www.nasa.gov/)
[![Privacy](https://img.shields.io/badge/Privacy-UU_PDP_No._27%2F2022_Compliant-emerald?style=flat-square)](https://peraturan.go.id/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[Live Demo](https://iconfest.febnawanfr.my.id) • [Ringkasan](#ringkasan--urgensi-solusi) • [Landasan Ilmiah](#landasan-ilmiah-medis) • [4 Modalitas Asesmen](#4-modalitas-neurokognitif) • [Tutorial Interaktif](#2-stage-interactive-tutorial-engine) • [Pengalaman Mobile-First](#pengalaman-mobile-first--ergonomi-sentuh) • [Arsitektur Sistem](#arsitektur-sistem--resilience-ai) • [Ketahanan Server](#ketahanan-server--self-healing-daemon) • [Panduan Memulai](#panduan-menjalankan-proyek) • [Struktur Repositori](#struktur-repositori-modular)

<br />

<img src="./docs/images/dashboard-desktop.png" alt="CogniPulse Console Dashboard" width="900" style="border-radius: 12px; border: 1px solid #27272a;" />

</div>

> [!TIP]
> **Ajang Kompetisi:** ICONFEST 2026 (Informatics Conference & Festival, Universitas Siliwangi)  
> **Kategori:** Software Development: Bidang Kesehatan  
> **Akses Produksi (Live):** [https://iconfest.febnawanfr.my.id](https://iconfest.febnawanfr.my.id) (Cloudflare Zero Trust + Caddy + systemd)  
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

* **Target Evaluasi:** Kecepatan respon milidetik murni, *attentional lapses* ($\ge 355\text{ ms}$), false start ($< 100\text{ ms}$), dan laju responsivitas sustained ($1/\text{RT} \times 1000$).
* **Audio Feedback:** Synthesizer Web Audio API native menghasilkan nada feedback frekuensi presisi tanpa latensi I/O audio eksternal.

---

### 2. Stroop Cognitive Inhibition Task
Pekerja diuji untuk memilih warna tinta teks, bukan kata yang tertulis, di bawah kondisi konflik semantik (*Stroop Effect*).

<div align="center">
  <img src="./docs/images/stroop-test.png" alt="Uji Inhibisi Kognitif Stroop" width="700" style="border-radius: 8px; border: 1px solid #27272a;" />
</div>

* **Target Evaluasi:** Efisiensi pemrosesan inhibisi di korteks singulat anterior (ACC), akurasi keputusan di bawah stimulus inkongruen, dan latensi interferensi kognitif.
* **Layout Presisi:** Dua target sentuh berukuran penuh di zona jempol bawah layar untuk respon motorik seimbang.

---

### 3. Corsi Block-Tapping Spatial Working Memory
Pekerja mengingat dan mereplikasi urutan blok visual acak dengan panjang rentang bertahap.

<div align="center">
  <img src="./docs/images/corsi-test.png" alt="Uji Memori Kerja Spasial Corsi" width="700" style="border-radius: 8px; border: 1px solid #27272a;" />
</div>

* **Target Evaluasi:** Rentang memori kerja spasial (*visuospatial sketchpad*), latensi penarikan memori, dan toleransi disorientasi spasial.
* **Layout Rigid Zero-Shift:** Tata letak grid 3x3 terkunci dengan dimensi proporsional stabil, mengeliminasi getaran layout (*layout shift*) saat blok dipilih.

---

### 4. Neuromotor Fast-Tapping Test
Uji ketukan cepat berirama untuk mengukur kecepatan konduksi neuromuskular dan konsistensi motorik halus.

* **Target Evaluasi:** Frekuensi ketukan (Hz), *Inter-Tap Interval* (ITI), jitter deviasi standar ($\pm\text{ms}$), dan rasio perlambatan irama (*fatigue decay slope*).
* **Surface Target Penuh:** Area sentuh memanjang tanpa batas kotak kaku, mengakomodasi teknik ketukan jempol tunggal maupun dua jari bergantian.

---

## 2-Stage Interactive Tutorial Engine

Untuk mengeliminasi kebingungan pengguna (terutama pada tes konflik warna Stroop dan ketukan ritmis) tanpa membebani pekerja dengan teks panjang pasif, CogniPulse menghadirkan **Engine Tutorial 2-Tahap Interaktif** sebelum setiap tes dimulai (`PVTTutorial`, `StroopTutorial`, `CorsiTutorial`, `MotorTutorial`):

```
+---------------------------------------------------------------------------------------+
| ALUR TUTORIAL DUA TAHAP COGNIPULSE                                                    |
+---------------------------------------------------+-----------------------------------+
| Tahap 1: Live Animated Demonstration             | Tahap 2: Interactive Sandbox      |
+---------------------------------------------------+-----------------------------------+
| • Simulasi visual otomatis berjalan tanpa batas   | • Pengguna mencoba langsung       |
| • Memperlihatkan skenario BENAR vs SALAH          | • Umpan balik audio & visual riil |
| • Menghilangkan beban baca instruksi teks         | • Tanpa penalti & tanpa batas     |
| • Menjelaskan aturan secara intuitif              | • Gerbang "Saya Mengerti" aktif   |
+---------------------------------------------------+-----------------------------------+
```

1. **Tahap 1 — Animasi Simulasi Otomatis (Demo):**
   - Menampilkan siklus demonstrasi visual otomatis yang memperagakan bagaimana stimulus muncul dan aksi apa yang diharapkan.
   - Contoh pada Stroop: mendemonstrasikan kata "MERAH" bertinta Biru, lalu kursor virtual memilih opsi warna "Biru", bukan "Merah".
   - Contoh pada PVT: mengilustrasikan lingkaran stimulus berubah hijau dengan simulasi waktu reaksi, serta peringatan visual jika terjadi *False Start* (mengetuk terlalu dini).
2. **Tahap 2 — Latihan Bebas Tanpa Penalti (Sandbox):**
   - Pekerja dapat berlatih langsung mengetuk tombol atau memilih urutan blok secara mandiri.
   - Sistem memberikan umpan balik mikro langsung (*"Tepat! Lanjutkan"*, *"Terlalu cepat"*, *"Pilih warna tinta"*).
   - Tombol **"Saya Mengerti, Mulai Tes"** memberikan kendali penuh kepada pekerja untuk memulai sesi evaluasi hanya ketika mereka benar-benar telah siap.

---

## Pengalaman Mobile-First & Ergonomi Sentuh

CogniPulse dirancang dari fondasi awal dengan pendekatan **Mobile-First Ergonomics** mengacu pada standar *Apple Human Interface Guidelines*:

<div align="center">
  <img src="./docs/images/dashboard-mobile.png" alt="CogniPulse Mobile Experience" width="380" style="border-radius: 16px; border: 1px solid #27272a;" />
</div>

* **Zona Jempol Bawah Layar (Bottom Thumb-Zone Architecture):**
  - Mengeliminasi desain lama kartu melayang (*floating cards*) di tengah atau atas layar yang memicu ketegangan jempol (*thumb reach strain*).
  - Area respon tes PVT, tombol Stroop, dan pad Motor Tapping diposisikan di separuh bawah layar dengan area sentuh yang luas, mengikuti jangkauan natural satu tangan pekerja.
* **Auto-Hiding Navigation Bar:**
  - Bilah menu bawah (`AppleTabBar`) secara otomatis menyusut dan menghilang saat sesi tes aktif, memaksimalkan area vertikal layar dan mencegah ketidaksengajaan keluar tes.
* **Input Presisi dengan Touch-Debounce:**
  - Stepper pengatur durasi tidur dengan resolusi 0.5 jam dilengkapi filter *touch-debounce* 180ms, meniadakan lonjakan ganda (*double-fire touch event*) pada layar sentuh sensitif.
  - Pemilih mood 3-segmen taktil (*Buruk*, *Biasa*, *Bugar*) yang cepat diakses sebelum tes.
* **Desain Apple Bottom Sheet:**
  - Detail diagnostik vital dapat diakses melalui lembar geser bawah interaktif dengan penarik gestur (*drag handle*) halus.
* **Zero Card Clutter & Hairline Borders:**
  - Menolak kartu bertumpuk AI slop, menggunakan pembatas tipis 1px (`border-zinc-800`), kontras tinggi, dan angka tabular monospaced.

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
    D --> E["Injeksi Kronobiologi Sirkadian & Jam Tes"]
    E --> F["API Route /api/analyze"]
    
    subgraph "Resilience Failover Cascade"
        F --> G{"Gemini 3.8 Flash<br/>(Primary Model)"}
        G -- "Sukses" --> H["Diagnosis Klinis Terstruktur"]
        G -- "503 / Timeout 4s" --> I{"Gemini 3.5 Flash Lite<br/>(Fast Secondary)"}
        I -- "Sukses" --> H
        I -- "Gagal / Cooldown" --> J{"Gemini 2.5 Flash<br/>(Tertiary Model)"}
        J -- "Sukses" --> H
        J -- "Offline / Semua Gagal" --> K["Local Clinical Deterministic Heuristics"]
        K --> H
    end

    H --> L["Dashboard Hasil & Rekomendasi Presisi"]
```

### Telemetri Kronobiologi & Fisiologi Sirkadian Real-Time
Untuk meningkatkan akurasi diagnosis diferensial, payload evaluasi Gemini dilengkapi parameter kronobiologi temporal:
* **Injeksi Waktu & Fase Sirkadian:** Jam pengujian dipetakan secara matematis ke salah satu dari 6 fase fisiologis sirkadian:
  1. `DAWN_CIRCADIAN_NADIR` (03:00 - 06:59): Titik terendah kewaspadaan biologis, penurunan suhu tubuh inti.
  2. `MORNING_CORTISOL_PEAK` (07:00 - 11:59): Puncak pelepasan hormon kortisol, periode kesiapan kerja optimal.
  3. `POST_PRANDIAL_DIP` (12:00 - 14:59): Penurunan kewaspadaan pasca-makan siang, dorongan tidur homeostatik sekunder.
  4. `AFTERNOON_SUSTAINED` (15:00 - 18:59): Kewaspadaan sore stabil sebelum sintesis melatonin dimulai.
  5. `EVENING_MELATONIN_ONSET` (19:00 - 22:59): Peningkatan sekresi melatonin endogen, penurunan kecepatan motorik.
  6. `NIGHT_VULNERABILITY_WINDOW` (23:00 - 02:59): Jendela kerentanan malam hari, desinkronisasi sirkadian akut.
* **Kompensasi Latensi Hardware Layar Sentuh:** Menghitung toleransi polling digitizer sentuh (8-16ms) pada perangkat seluler untuk memastikan data waktu reaksi murni tanpa bias latensi layar.
* **Skor Keyakinan Klinis Ternormalisasi:** Skala keyakinan diagnosis AI distandarisasi pada rentang 0-100% untuk representasi kepastian medis yang akurat.

### Karakteristik Model AI
* **Gemini 3.8 Flash:** Berfungsi sebagai *Clinical Neurophysiologist & Risk Copilot* yang menyintesis korelasi multi-faktor (ritme sirkadian, defisit tidur, waktu reaksi) untuk memproyeksikan risiko kerja 2-4 jam ke depan.
* **Deterministic Fallback Engine:** Algoritma berbasis aturan medis lokal yang otomatis aktif dalam waktu $\le 4$ detik jika API Gemini mengalami lonjakan beban atau jaringan terputus, memastikan demonstrasi kompetisi dan operasional pabrik tidak pernah terhenti.

---

## Ketahanan Server & Self-Healing Daemon

CogniPulse di-deploy pada server produksi mandiri (*self-hosted edge server*) dengan arsitektur ketahanan tinggi (*zero-downtime tolerance*):

```
[ Pengguna / Smartphone / Browser ]
           │ (HTTPS / TLS 1.3 Terenkripsi)
           ▼
[ Cloudflare Zero Trust Edge (Anycast Global Network) ]
           │ (Encrypted Tunnel / Protokol QUIC)
           ▼
[ Cloudflare Tunnel Daemon (cloudflared service) ]
           │ (Local Loopback Forwarding)
           ▼
[ Caddy High-Performance Web Server (Port 80) ]
           │ (Virtual Host Header Routing)
           ▼
[ CogniPulse Next.js 15 Standalone Daemon (Port 3000) ]
└── Dikawal oleh systemd (cognipulse.service)
```

### Spesifikasi Infrastruktur Produksi
* **Akses Publik (Live):** [https://iconfest.febnawanfr.my.id](https://iconfest.febnawanfr.my.id)
* **Cloudflare Zero Trust Tunnel:** Mengeliminasi pembukaan port publik (tanpa *port-forwarding* pada router), memberikan mitigasi serangan DDoS otomatis, dan mengelola sertifikat SSL secara dinamis.
* **Caddy Reverse-Proxy:** Menangani multi-domain virtual host dan perutean internal berkinerja tinggi dengan konsumsi memori minimal.
* **Linux systemd Self-Healing Service (`cognipulse.service`):**
  - **Otomatis Saat Booting (`WantedBy=multi-user.target`):** Server CogniPulse langsung aktif otomatis saat mesin dinyalakan kembali tanpa perlu intervensi manual.
  - **Pemulihan Otomatis Mandiri (`Restart=always`, `RestartSec=3s`):** Jika terjadi crash atau kegagalan tak terduga, sistem mendeteksi dan menghidupkan kembali service dalam waktu $\le 3$ detik (telah terverifikasi dengan uji pematian paksa `kill -9`).
  - **Batas Alokasi Sumber Daya (`MemoryMax=1.2G`, `LimitNOFILE=65535`):** Mencegah potensi kebocoran memori dari node worker dan menjaga stabilitas konkurensi server.

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
git clone https://github.com/feb027/cognipulse.git
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
 ✓ tests/scoring.test.ts (7 tests)
 ✓ tests/fallback.test.ts (3 tests)

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Duration  1.86s
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
│   │   ├── layout.tsx            # Root layout & konfigurasi font
│   │   └── page.tsx              # Halaman utama & orkestrator tab
│   ├── components/
│   │   ├── assessment/           # Modul asesmen neurokognitif
│   │   │   ├── corsi/            # Modul Corsi Block (Memory grid stage)
│   │   │   ├── motor/            # Modul Tapping (Cadence, rhythmic target)
│   │   │   ├── pvt/              # Modul PVT-B (Timer display, stage)
│   │   │   ├── stroop/           # Modul Stroop (Visual conflict stage)
│   │   │   └── tutorials/        # 2-Stage Interactive Tutorials (Demo & Sandbox)
│   │   ├── dashboard/            # Modul ringkasan, riwayat & bottom sheet
│   │   ├── navigation/           # Apple header, profile dropdown & tab bar
│   │   ├── results/              # Diagnosis visual & rekomendasi pemulihan
│   │   └── ui/                   # Primitif UI (Button, Card, Badge, Modal)
│   ├── hooks/                    # Custom hooks untuk runner asesmen & session
│   ├── lib/
│   │   ├── ai/                   # Gemini client & local resilience fallback
│   │   ├── audio/                # Web Audio API native synthesizer
│   │   ├── scoring/              # Kalkulator matematika murni (CFI, PVT, dll)
│   │   └── session-utils.ts      # Utilitas sesi, waktu & kronobiologi
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
