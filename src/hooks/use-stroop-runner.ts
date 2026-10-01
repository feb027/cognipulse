/**
 * Hook: useStroopRunner
 * Pengelola siklus tes Stroop / Go-NoGo untuk inhibisi eksekutif lobus frontal.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { StroopTrial, StroopStimulusType } from '@/types/stroop';
import { playStimulusBeep, playTapClick, playWarningTone } from '@/lib/audio/sound-effects';

const COLOR_PALETTE = [
  { name: 'HIJAU', hex: '#10b981' }, // emerald
  { name: 'MERAH', hex: '#f43f5e' }, // crimson
  { name: 'BIRU', hex: '#06b6d4' },  // cyan
  { name: 'KUNING', hex: '#f59e0b' } // amber
];

interface StroopRunnerOptions {
  totalTrialsGoal?: number;
  onComplete: (trials: StroopTrial[]) => void;
}

export function useStroopRunner({ totalTrialsGoal = 8, onComplete }: StroopRunnerOptions) {
  const [phase, setPhase] = useState<'idle' | 'stimulus' | 'feedback' | 'finished'>('idle');
  const [currentTrialNumber, setCurrentTrialNumber] = useState(1);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>('');
  const [stimulusType, setStimulusType] = useState<StroopStimulusType>('go_match');
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const trialsRef = useRef<StroopTrial[]>([]);
  const stimulusStartRef = useRef<number | null>(null);
  const timeoutWindowRef = useRef<NodeJS.Timeout | null>(null);

  const presentNextStimulus = useCallback(() => {
    if (trialsRef.current.length >= totalTrialsGoal) {
      setPhase('finished');
      onComplete(trialsRef.current);
      return;
    }

    setFeedback(null);
    setCurrentTrialNumber(trialsRef.current.length + 1);

    // 60% peluang Go (cocok), 40% peluang No-Go (konflik)
    const isGo = Math.random() < 0.6;
    const wordObj = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    let colorObj = wordObj;

    if (!isGo) {
      const otherColors = COLOR_PALETTE.filter((c) => c.name !== wordObj.name);
      colorObj = otherColors[Math.floor(Math.random() * otherColors.length)];
    }

    const type: StroopStimulusType = isGo ? 'go_match' : 'no_go_mismatch';
    setCurrentWord(wordObj.name);
    setCurrentColor(colorObj.hex);
    setStimulusType(type);
    setPhase('stimulus');

    stimulusStartRef.current = performance.now();
    playStimulusBeep();

    // Jendela waktu respon 1400ms
    timeoutWindowRef.current = setTimeout(() => {
      // Waktu habis: evaluasi jika user tidak menekan
      const expectedAction = isGo ? 'press' : 'withhold';
      const isCorrect = expectedAction === 'withhold'; // Jika no-go dan tidak ditekan = BENAR

      if (isCorrect) {
        playTapClick();
      } else {
        playWarningTone();
      }

      trialsRef.current.push({
        trialIndex: trialsRef.current.length + 1,
        wordText: wordObj.name,
        displayColor: colorObj.hex,
        stimulusType: type,
        expectedAction,
        userAction: 'withheld',
        reactionTimeMs: null,
        isCorrect,
        errorType: isGo ? 'omission' : undefined,
      });

      setPhase('feedback');
      setFeedback({
        isSuccess: isCorrect,
        text: isCorrect ? 'BENAR (Tahan Diri)' : 'TERLEWATKAN (Harusnya Tekan!)',
      });

      setTimeout(presentNextStimulus, 700);
    }, 1400);
  }, [totalTrialsGoal, onComplete]);

  const handleUserPress = useCallback(() => {
    if (phase !== 'stimulus' || stimulusStartRef.current === null) return;
    if (timeoutWindowRef.current) clearTimeout(timeoutWindowRef.current);

    const now = performance.now();
    const rt = Math.round(now - stimulusStartRef.current);
    const isGo = stimulusType === 'go_match';
    const isCorrect = isGo; // Ditekan saat Go = BENAR, ditekan saat No-Go = SALAH (Commission Error)

    if (isCorrect) {
      playTapClick();
    } else {
      playWarningTone();
    }

    trialsRef.current.push({
      trialIndex: trialsRef.current.length + 1,
      wordText: currentWord,
      displayColor: currentColor,
      stimulusType,
      expectedAction: isGo ? 'press' : 'withhold',
      userAction: 'pressed',
      reactionTimeMs: rt,
      isCorrect,
      errorType: !isGo ? 'commission' : undefined,
    });

    setPhase('feedback');
    setFeedback({
      isSuccess: isCorrect,
      text: isCorrect ? `TEPAT (${rt} ms)` : 'SALAH INHIBISI (Harusnya Tahan!)',
    });

    setTimeout(presentNextStimulus, 700);
  }, [phase, stimulusType, currentWord, currentColor, presentNextStimulus]);

  useEffect(() => {
    return () => {
      if (timeoutWindowRef.current) clearTimeout(timeoutWindowRef.current);
    };
  }, []);

  return {
    phase,
    currentTrialNumber,
    totalTrialsGoal,
    currentWord,
    currentColor,
    stimulusType,
    feedback,
    startTest: presentNextStimulus,
    handleUserPress,
  };
}
