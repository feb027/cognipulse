# AGENTS.md — Antigravity Workspace Guidelines
**Project:** CogniPulse (ICONFEST 2026 - Software Development / Health)  
**Standard:** Enterprise Modular Architecture & Strict Anti-AI Slop Enforcement  

---

## 1. Core Engineering Mandates

### A. Anti-Monolith & Modular Architecture (STRICT)
1. **File Size Limit:** Tidak boleh ada berkas yang melampaui **150–200 baris kode**. Jika sebuah komponen atau modul mulai membengkak, **WAJIB dipecah** ke dalam sub-komponen atau sub-modul terpisah.
2. **Single Responsibility Principle (SRP):**
   - File UI hanya merender antarmuka (`components/ui/` atau `components/assessment/...`).
   - Logika komputasi matematika PVT murni terisolasi di `lib/scoring/` tanpa JSX.
   - Logika audio native synthesizer murni di `lib/audio/`.
   - Logika pemanggilan Gemini 3.8 Flash di `lib/ai/`.
   - Tipe data TypeScript tersentralisasi di `types/`.
   - Hook untuk state transien di `hooks/`.
3. **No God Components:** Setiap micro-task (PVT, Stroop/Go-NoGo, Motor Tapping) memiliki direktori modularnya sendiri dengan berkas-berkas terpisah: state hook, canvas/renderer, instruksi modal, dan telemetry collector.

---

## 2. Skill Dispatch Matrix (Wajib Baca Sebelum Bekerja)

Setiap agen yang mengerjakan tugas di repositori ini **WAJIB** membaca berkas `SKILL.md` yang relevan di `.agents/skills/` sebelum melakukan perubahan kode atau merancang arsitektur:

| Kategori Tugas / Konteks Prompt | Skill yang WAJIB Dibaca | Lokasi Berkas SKILL.md |
| :--- | :--- | :--- |
| **UI & Visual Craft** | `antislop-ui` & `design-taste-frontend` | `.agents/skills/antislop-ui/SKILL.md`<br>`.agents/skills/design-taste-frontend/SKILL.md` |
| **Micro-Interactions & Animasi** | `emil-design-eng` | `.agents/skills/emil-design-eng/SKILL.md` |
| **Sistem Desain & UX Medis** | `ui-ux-pro-max` & `tailwind-design-system` | `.agents/skills/ui-ux-pro-max/SKILL.md`<br>`.agents/skills/tailwind-design-system/SKILL.md` |
| **Responsive & Mobile Viewport** | `antislop-layoutmobile` | `.agents/skills/antislop-layoutmobile/SKILL.md` |
| **Aksesibilitas & Kontras Warna** | `antislop-human` | `.agents/skills/antislop-human/SKILL.md` |
| **Copywriting & Teks Medis** | `antislop-copywriting` | `.agents/skills/antislop-copywriting/SKILL.md` |
| **Komentar Kode & Higienitas** | `antislop-code` | `.agents/skills/antislop-code/SKILL.md` |
| **Next.js 15 & React Architecture** | `nextjs-app-router-patterns` | `.agents/skills/nextjs-app-router-patterns/SKILL.md` |
| **Optimasi Performa & Latensi** | `vercel-react-best-practices` | `.agents/skills/vercel-react-best-practices/SKILL.md` |
| **Integrasi AI Gemini 3.8 Flash** | `gemini-api-dev` | `.agents/skills/gemini-api-dev/SKILL.md` |

---

## 3. Aturan Anti-AI Slop Visual

1. **Anti-Lila Rule:** Dilarang menggunakan gradien ungu-pink, tombol glowing neon, atau background blur melayang tanpa fungsi.
2. **Palette Disiplin:** Background Slate/Zinc gelap pekat (`#09090b`), dengan aksen fungsional medis (Cyan untuk stimulus, Emerald untuk normal, Amber untuk warning, Crimson untuk critical).
3. **Typography:** Monospaced tabular (`font-mono tabular-nums`) untuk data telemetri milidetik (misal: `248.6 ms ± 12.4 ms`).
4. **Hairline 1px Borders:** Gunakan pembatas tipis (`border-zinc-800`), bukan bento-cards mengambang dengan shadow tebal.
5. **No AI Cliché Copy:** Jangan gunakan frasa klise seperti "Empower your journey", "Seamless experience", "Revolutionize health". Gunakan bahasa klinis/fungsional yang presisi.

---

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.agents/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.agents/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->
