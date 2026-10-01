# 05. Modular Architecture & Anti-Monolith Specification
**Project:** CogniPulse (ICONFEST 2026 - Software Development / Health)  
**Standard:** Clean Architecture, Single Responsibility Principle (SRP), Scalability  
**Date:** 2026-09-30  

---

## 1. Aturan Anti-Monolith (Hard Limits)

1. **Batas Maksimal Baris Kode (LOC):**
   * **Maksimal 150–200 baris per file.**
   * Jika ada file yang melebihi 200 baris, file tersebut **harus didekomposisi** menjadi sub-komponen, hook, atau fungsi utilitas terpisah.
2. **Pemisahan Logika vs UI (Separation of Concerns):**
   * File `.tsx` dilarang memuat logika komputasi matematika rumit atau panggilan API langsung.
   * File UI hanya bertugas merender state dan menangani aksi pengguna via event handler sederhana.
   * Semua kalkulasi neuropsikologi diletakkan pada modul murni TypeScript di `src/lib/scoring/`.
3. **No "God Components":**
   * Komponen asesmen tidak digabung dalam satu file raksasa. Setiap micro-game memiliki direktori mandiri.

---

## 2. Rancang Bangun Struktur Direktori Modular

```
src/
├── app/                                # Next.js App Router (RSC Roots)
│   ├── layout.tsx                      # Root layout, font declaration, theme metadata
│   ├── page.tsx                        # Master Cockpit Shell (tab switcher, zero monolithic code)
│   └── globals.css                     # Minimal styling rules & theme tokens
│
├── types/                              # Sentralisasi Kontrak Data TypeScript
│   ├── assessment.ts                   # Tipe data sesi asesmen & telemetri
│   ├── pvt.ts                          # Tipe data spesifik PVT (lapses, reaction speed)
│   ├── stroop.ts                       # Tipe data Stroop / Go-NoGo
│   ├── motor.ts                        # Tipe data Motor Tapping & jitter
│   ├── gemini.ts                       # Skema kontrak respons Gemini 3.8 Flash
│   └── team.ts                         # Tipe data dashboard kesiapan tim
│
├── lib/
│   ├── scoring/                        # Pure Mathematical Engines (Zero React Dependency)
│   │   ├── pvt-metrics.ts              # Rumus Dinges & Basner (1/RT, lapses, false starts)
│   │   ├── stroop-metrics.ts           # Commission/omission error rate & d-prime
│   │   ├── motor-metrics.ts            # ITI jitter standard deviation & slope decay
│   │   └── cfi-aggregator.ts           # Komposit Cognitive Fatigue Index (0-100)
│   │
│   ├── ai/                             # Gemini 3.8 Flash Integration & Resilience
│   │   ├── gemini-client.ts            # Inisialisasi official SDK @google/genai
│   │   ├── prompts.ts                  # Prompt clinical neurophysiologist terkalibrasi
│   │   ├── json-schema.ts              # Definisi structured schema Gemini
│   │   └── local-fallback-engine.ts    # Rule engine offline medis (anti-demo crash)
│   │
│   └── audio/                          # Web Audio Synthesizer Native
│       ├── audio-context.ts            # Singleton audio context browser
│       └── sound-effects.ts            # Synthesizer sinyal: 880Hz (stimulus), 440Hz (tap), 220Hz (error)
│
├── hooks/                              # Custom React Hooks untuk Transient State
│   ├── use-pvt-runner.ts               # Hook pengukur milidetik PVT (useRef isolated)
│   ├── use-stroop-runner.ts            # Hook pengatur interval Go/No-Go
│   ├── use-motor-runner.ts             # Hook perekam ketukan ritmik motorik
│   ├── use-session-storage.ts          # Hook persistensi baseline personal lokal
│   └── use-copilot-chat.ts             # Hook komunikasi chat dengan Gemini
│
├── components/
│   ├── ui/                             # Primitif UI Anti-Slop (Atomic Components)
│   │   ├── Badge.tsx                   # Status badge klinis (Fit/Warning/Critical)
│   │   ├── Button.tsx                  # Tombol dengan tactile scale 0.97 (Emil Kowalski)
│   │   ├── HairlineDivider.tsx         # Pembatas garis 1px zinc-800
│   │   ├── TelemetryDisplay.tsx        # Render angka monospace tabular (tabular-nums)
│   │   └── ModalShell.tsx              # Wrapper dialog terisolasi
│   │
│   ├── assessment/                     # Modul Asesmen Micro-Tasks
│   │   ├── AssessmentWizard.tsx        # Controller state machine antar-fase
│   │   ├── ContextCheckinModal.tsx     # Form input 15 detik (jam tidur, shift)
│   │   │
│   │   ├── pvt/                        # Modul PVT Mandiri
│   │   │   ├── PVTStage.tsx            # Arena visual PVT
│   │   │   ├── PVTCountdown.tsx        # Indikator hitung mundur
│   │   │   └── PVTTimerDisplay.tsx     # Tampilan milidetik presisi tinggi
│   │   │
│   │   ├── stroop/                     # Modul Go/No-Go Mandiri
│   │   │   ├── StroopStage.tsx         # Arena visual warna & kata
│   │   │   └── StroopFeedback.tsx      # Umpan balik benar/salah instan
│   │   │
│   │   └── motor/                      # Modul Motor Tapping Mandiri
│   │       ├── MotorStage.tsx          # Tombol tap besar responsif
│   │       └── MotorCadenceGraph.tsx   # Grafik mini stabilitas ritme
│   │
│   ├── results/                        # Modul Visualisasi Hasil & AI
│   │   ├── ResultSummaryHeader.tsx     # Status CFI & tingkat keparahan
│   │   ├── TelemetryBreakdown.tsx      # Rincian 1/RT, lapses, jitter
│   │   ├── GeminiDifferentialView.tsx  # Diagnosis diferensial Gemini 3.8
│   │   ├── FourHourRiskRadar.tsx       # Proyeksi risiko kerja 2-4 jam ke depan
│   │   ├── RecoveryRoadmap.tsx         # Protokol pemulihan presisi
│   │   └── CopilotChatDrawer.tsx       # Asisten chat interaktif
│   │
│   └── dashboard/                      # Modul Tren & B2B Shift Monitor
│       ├── TrendHistoryView.tsx        # Grafik tren sirkadian personal
│       ├── TeamShiftHeatmap.tsx        # Heatmap kesiapan tim B2B (anonim)
│       └── BaselineCalibrationCard.tsx # Status kalibrasi baseline perangkat
```

---

## 3. Manfaat Arsitektur Modular bagi Kompetisi ICONFEST
* **Skor Maksimal di Kriteria *Teknis & Fungsionalitas (45%)*:** Sub-kriteria babak final menguji *"Implementasi Arsitektur dan Maintainability"*. Juri dapat melihat kode yang sangat rapi, terdokumentasi, dan bebas dari file monolithic yang berantakan.
* **Kemudahan Pengujian (Testability):** Setiap rumus matematis di `src/lib/scoring/` dapat diuji dengan unit test mandiri tanpa perlu me-mount komponen UI React.
* **Kolaborasi Tim yang Bersih:** Anggota tim dapat mengerjakan komponen terpisah tanpa risiko konflik merge Git.
