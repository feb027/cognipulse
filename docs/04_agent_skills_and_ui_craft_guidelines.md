# 04. Agent Skills & UI Craft Guidelines (Master 14-Skill Ecosystem)
**Project:** CogniPulse (ICONFEST 2026 - Software Development / Health)  
**Document Status:** Master Toolkit Reference  
**Date:** 2026-09-30  

---

## 1. Roster Lengkap 14 Skills Terpasang

Repositori ini kini dilengkapi dengan **14 skill terverifikasi** untuk menjamin tidak ada celah bagi "AI Slop" dan memastikan kualitas kode setara tim *engineering & product design* papan atas:

```
.agents/skills/
├── antislop/                   # [CORE FILTER] Filter utama pembersih slop AI di seluruh siklus
├── antislop-ui/                # [UI/VISUAL] Aturan layout, komponen, dan dekorasi non-generik
├── antislop-copywriting/       # [COPY] Eliminasi klise marketing AI, nada klinis manusiawi
├── antislop-human/             # [A11Y] Aksesibilitas mata/tangan, kontras WCAG, focus state
├── antislop-layoutmobile/      # [MOBILE] Viewport stability, reflow layar, tap target 44px+
├── antislop-code/              # [CODE HYGIENE] Pembersihan komentar kode AI yang tidak berguna
├── design-taste-frontend/      # [DESIGN TASTE] Anti-Lila Rule, tipografi non-default, layout asimetris
├── emil-design-eng/            # [MICRO-INTERACTION] Emil Kowalski craft: tactile scale 0.97, spring physics
├── ui-ux-pro-max/              # [DESIGN SYSTEM] Ergonomi kognitif, palette reasoning, UI data-dense
├── tailwind-design-system/     # [STYLING] Tokenisasi Tailwind terstruktur, strict utility discipline
├── vercel-react-best-practices/# [PERFORMANCE] 70 aturan performa Vercel, zero re-render, anti-waterfall
├── nextjs-app-router-patterns/ # [FRAMEWORK] Arsitektur Next.js 15, Server Components vs Client Leaf
├── gemini-api-dev/             # [AI ENGINE] Official SDK Google Gen AI, Gemini 3.8 Flash, JSON Schema
└── find-skills/                # [ECOSYSTEM] Discovery tools untuk memperluas kapabilitas agen
```

---

## 2. Matriks Integrasi Skill & Anti-Slop Enforcement

| Aspek Proyek | Skill yang Mengontrol | Penerapan Nyata pada CogniPulse |
| :--- | :--- | :--- |
| **Penyaringan Slop Menyeluruh** | `antislop` (Core) | Memastikan setiap keputusan visual memiliki *purpose test* (bukan sekadar "kelihatan keren"). |
| **Warna & Layout** | `antislop-ui` + `design-taste-frontend` | Melarang gradien ungu/pink melayang (*The Lila Rule*). Menggunakan latar Zinc gelap dengan indikator medis (*Cyan, Emerald, Amber, Crimson*). |
| **Bahasa & Istilah Medis** | `antislop-copywriting` | Tidak ada teks klise seperti "Empower your wellness". Teks diganti dengan label fungsional diagnostik: "Vigilance Latency", "Attentional Drift Rate", "Differential Diagnosis". |
| **Aksesibilitas & Kontras** | `antislop-human` | Kontras teks minimum $4.5:1$ (WCAG AA/AAA). Ramah bagi pekerja shift malam dengan pencahayaan rendah. |
| **Ergonomi Layar Sentuh** | `antislop-layoutmobile` | Target tombol tap $\ge 48\text{px}$, tidak ada layout jumping pada mobile (`min-h-[100dvh]`, bukan `h-screen`). |
| **Komentar Kode** | `antislop-code` | Hanya menyertakan komentar ilmiah berbobot (misal: sitasi rumus Dinges & Basner), tanpa komentar AI basi seperti `// this function calculates reaction time`. |
| **Sensory & Micro-Motion** | `emil-design-eng` | Animasi terukur: feedback sentuh `active:scale-[0.97]`, transisi presisi `150ms cubic-bezier(0.16, 1, 0.3, 1)`. |
| **Performa & Latensi Milidetik** | `vercel-react-best-practices` | Timestamp klik disimpan di `useRef`, event `onPointerDown` bebas delay 300ms, isolasi rendering milidetik. |
| **Integrasi AI Medis** | `gemini-api-dev` | Model **`gemini-3.8-flash`** via SDK resmi `@google/genai` dengan keluaran JSON Schema terstruktur. |
