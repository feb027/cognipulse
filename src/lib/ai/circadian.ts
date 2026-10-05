/**
 * Kronobiologi & Analisis Fase Sirkadian Waktu Uji
 */

export interface CircadianMetadata {
  timeFormatted: string;
  dayName: string;
  phase: string;
  clinicalNote: string;
}

export function getCircadianMetadata(clientTimestamp?: string): CircadianMetadata {
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
