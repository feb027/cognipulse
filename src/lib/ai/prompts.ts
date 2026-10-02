/**
 * Clinical Neurophysiology & Fatigue Assessment Prompts
 * Diformulasikan untuk menghasilkan diagnosis ringkas, ramah, dan 100% Bahasa Indonesia.
 */

import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { UserContext, CompositeFatigueResult } from '@/types/assessment';

export const CLINICAL_SYSTEM_INSTRUCTION = `
Anda adalah AI Neuro-Evaluator & Sahabat Kesehatan Kerja yang cerdas, solutif, dan punya selera humor segar.
Tugas Anda: Menganalisis telemetri neurokognitif pengguna (waktu reaksi ms, momen bengong/lapses, akurasi Stroop, rentang memori Corsi, kestabilan jari, serta waktu uji sirkadian), lalu memberikan ulasan yang LUCU, RELATABLE, HANGAT, tapi TETAP BERMANFAAT & ILMIAH.

PEDOMAN GAYA BAHASA (LUCU TAPI BERMANFAAT):
1. WAJIB 100% BAHASA INDONESIA yang komunikatif, luwes, dan menggelitik senyum pembaca.
2. JANGAN KAKU & JANGAN TERLALU TEKNIS: Hindari istilah medis berbelit-belit yang membosankan seperti laporan lab kering.
3. JANGAN ALAY / CRINGE GEN-Z: Hindari slang yang dipaksakan seperti "RAM mental", "otak nge-lag", "mode gacor parah", atau "parah sih bro".
4. GUNAKAN HUMOR SITUASIONAL YANG CERDAS: Bikin analogi sehari-hari yang relatable (misal: "bengong bukan mikirin masa lalu tapi otak minta bantal", "refleks cepat nyamuk lewat pun sungkan", "segar sehabis mandi cuma jebakan ilusi", "awas typo salah kirim pesan ke bos").
5. TETAP BERBOBOT & BERMANFAAT: Di balik humor, ulasannya harus akurat mencerminkan data telemetri nyata pengguna dan memberikan solusi pemulihan yang nyata.
6. INTEGRASI WAKTU & KRONOBIOLOGI: Perhatikan data jam pengujian ('kronobiologiDanWaktu'). Sesuaikan analisis dengan waktu saat ini (misal: jika siang sebutkan pengaruh wajar post-lunch dip, jika pagi bahas kesegaran alami, jika malam/dini hari ingatkan bahaya biological nadir dan microsleep).

STRUKTUR KELUARAN JSON:
- 'headlineTitle': Judul evaluasi 1 baris yang lucu dan pas menggambarkan kondisi (misal: "Refleks Secepat Kilat, Siap Babat Tugas!" atau "Otak Mulai Minta Kasur: Awas Jebakan Ilusi Bugar").
- 'shortSummary': 1 kalimat singkat intisari kebugaran (maksimal 15 kata, berbeda dan lebih padat dari clinicalRationale) untuk kartu sorotan atas.
- 'primaryCause': 1 kalimat ringkas penyebab/kondisi utama (misal: "Koordinasi Mata dan Jari Sedang di Puncak Kejayaan" atau "Defisit Tidur Sedang Mengirim Sinyal Mogok Kerja").
- 'confidenceScore': Angka desimal antara 0.0 sampai 1.0 (contoh: 0.88, BUKAN 88).
- 'clinicalRationale': 3-4 kalimat ulasan komprehensif yang menghibur sekaligus berwawasan ilmiah untuk tab Rincian Kondisi, mengaitkan hasil tes (refleks ms, akurasi, kestabilan jari) dengan waktu jam saat ini dan jam tidur semalam.
- 'reactionTimeDecayTrajectory': 1-2 kalimat prediksi 2-4 jam ke depan yang lucu tapi membuka mata jika memaksakan diri.
- 'immediateAction': Tindakan pemulihan taktis yang spesifik dan masuk akal.
- 'hydrationElectrolyteMl': Takaran air (ml).
- 'recommendedScreenBreakMins': Menit istirahat layar.
- 'circadianAlignmentNote': Nasihat jam biologis yang ramah dan solutif.
- 'criticalWarningAlert': Jika kondisi 'critical_hazard' atau banyak bengong, berikan peringatan keselamatan tegas berbalut kepedulian hangat. Jika aman/fit, isi null.
`.trim();

function getCircadianMetadata(clientTimestamp?: string) {
  const d = clientTimestamp ? new Date(clientTimestamp) : new Date();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const timeFormatted = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} WIB`;
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = days[d.getDay()];

  let phase = 'Puncak Kewaspadaan Pagi';
  let clinicalNote = 'Fase kewaspadaan kortisol alami optimal.';

  if (hour >= 23 || hour < 5) {
    phase = 'Biological Nadir (Zona Bahaya Dini Hari)';
    clinicalNote = 'Titik terendah sirkadian tubuh. Waktu reaksi melambat alami 15-25%, risiko microsleep tinggi.';
  } else if (hour >= 5 && hour < 8) {
    phase = 'Inersia Bangun Tidur (Pagi Awal)';
    clinicalNote = 'Fase transisi dari istirahat malam. Rawan grogginess sisa tidur.';
  } else if (hour >= 8 && hour < 12) {
    phase = 'Puncak Kewaspadaan Pagi (Morning Peak)';
    clinicalNote = 'Jendela fokus emas manusia. Refleks lambat menandakan defisit tidur nyata.';
  } else if (hour >= 12 && hour < 15) {
    phase = 'Post-Lunch Dip (Penurunan Sirkadian Siang)';
    clinicalNote = 'Dip sirkadian alami pasca makan siang. Penurunan energi wajar secara biologis.';
  } else if (hour >= 15 && hour < 19) {
    phase = 'Pemulihan Sore (Afternoon Alertness)';
    clinicalNote = 'Kewaspadaan sekunder sebelum penurunan malam hari.';
  } else {
    phase = 'Fase Relaksasi Malam (Evening Wind-Down)';
    clinicalNote = 'Akumulasi adenosin harian tinggi, tubuh bersiap istirahat malam.';
  }

  return { timeFormatted, dayName, phase, clinicalNote };
}

export function buildTelemetryPrompt(
  cfi: CompositeFatigueResult,
  pvt: PVTMetrics,
  stroop: StroopMetrics,
  motor: MotorMetrics,
  context?: UserContext,
  corsi?: CorsiMetrics,
  options?: {
    deviceBaselineMs?: number;
    clientTimestamp?: string;
  }
): string {
  const circadian = getCircadianMetadata(options?.clientTimestamp);
  const spreadMs = Math.round(pvt.slowestTenPercentRT - pvt.fastestTenPercentRT);

  return JSON.stringify(
    {
      kronobiologiDanWaktu: {
        jamUji: circadian.timeFormatted,
        hari: circadian.dayName,
        faseSirkadian: circadian.phase,
        catatanKronobiologi: circadian.clinicalNote,
      },
      ringkasanKelelahan: {
        skorCFI: cfi.cfiScore,
        kategori: cfi.impairmentTier,
        silentFatigueTerdeteksi: cfi.subjectiveObjectiveDisparity,
      },
      refleksPVT: {
        rerataRefleksMs: pvt.meanReactionTimeMs,
        kecepatanRespon: pvt.responseSpeed,
        jumlahHilangFokusBengong: pvt.attentionalLapseCount,
        ketukanTerlaluCepat: pvt.falseStartCount,
        rentangVariabilitasEkstremMs: spreadMs,
      },
      koreksiHardwareTouchscreen: options?.deviceBaselineMs
        ? {
            latensiLayarHpMs: options.deviceBaselineMs,
            refleksNeuralBersihMs: Math.max(100, Math.round(pvt.meanReactionTimeMs - options.deviceBaselineMs)),
          }
        : null,
      fokusStroop: {
        akurasiPersen: stroop.accuracyRate,
        skorKontrolFokus: stroop.inhibitoryControlScore,
      },
      memoriSpasialCorsi: corsi
        ? {
            rentangBalokMaksimal: corsi.maxSpan,
            akurasiUrutanPersen: corsi.sequenceAccuracyRate,
            skorMemoriKerja: corsi.workingMemoryScore,
          }
        : null,
      motorik: {
        ritmeKetukanPerDetik: motor.cadenceTapsPerSecond,
        variasiKetukanJitterMs: motor.itiStandardDeviationMs,
      },
      konteksHarian: context
        ? {
            shiftKerja: context.shiftType,
            jamTidurSemalam: context.hoursSleptLastNight,
            jamBekerjaHariIni: context.hoursWorkedToday,
            asupanKafein: context.caffeineIntake,
            perasaanSubjektif: context.subjectiveFatigueScore,
            aktivitasFisikBerat: context.heavyPhysicalLabor,
          }
        : null,
    },
    null,
    2
  );
}
