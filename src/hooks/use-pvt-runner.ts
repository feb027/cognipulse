/**
 * Hook: usePVTRunner
 * Pengukur latensi waktu reaksi milidetik presisi tinggi berbasis performance.now().
 * Mematuhi aturan Vercel: transient state disimpan dalam useRef untuk mencegah re-render lag.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { PVTTrial } from '@/types/pvt';
import { playStimulusBeep, playTapClick, playWarningTone } from '@/lib/audio/sound-effects';
import { BRIEF_PVT_LAPSE_THRESHOLD_MS } from '@/lib/scoring/pvt-metrics';

interface PVTRunnerOptions {
  totalTrialsGoal?: number;
  onComplete: (trials: PVTTrial[]) => void;
}

export function usePVTRunner({ totalTrialsGoal = 6, onComplete }: PVTRunnerOptions) {
  const [phase, setPhase] = useState<'waiting' | 'stimulus' | 'feedback' | 'finished'>('waiting');
  const [currentTrialNumber, setCurrentTrialNumber] = useState(1);
  const [liveDisplayMs, setLiveDisplayMs] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const trialsRef = useRef<PVTTrial[]>([]);
  const stimulusTimestampRef = useRef<number | null>(null);
  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startNextTrial = useCallback(() => {
    if (trialsRef.current.length >= totalTrialsGoal) {
      setPhase('finished');
      onComplete(trialsRef.current);
      return;
    }

    setPhase('waiting');
    setLiveDisplayMs(null);
    setFeedbackMessage(null);
    stimulusTimestampRef.current = null;
    setCurrentTrialNumber(trialsRef.current.length + 1);

    // Jeda acak 1800ms - 3800ms (pseudo-random tidak dapat dihafal)
    const randomDelay = Math.floor(Math.random() * 2000) + 1800;

    timerTimeoutRef.current = setTimeout(() => {
      stimulusTimestampRef.current = performance.now();
      playStimulusBeep();
      setPhase('stimulus');

      // Animasi counter milidetik live
      const updateLiveTimer = () => {
        if (stimulusTimestampRef.current !== null) {
          const elapsed = Math.round(performance.now() - stimulusTimestampRef.current);
          setLiveDisplayMs(elapsed);
          animFrameRef.current = requestAnimationFrame(updateLiveTimer);
        }
      };
      animFrameRef.current = requestAnimationFrame(updateLiveTimer);
    }, randomDelay);
  }, [totalTrialsGoal, onComplete]);

  const handlePointerResponse = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const now = performance.now();

    // 1. Kasus False Start (klik saat masih waiting)
    if (phase === 'waiting' || stimulusTimestampRef.current === null) {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      playWarningTone();

      const falseTrial: PVTTrial = {
        trialIndex: trialsRef.current.length + 1,
        delayScheduledMs: 0,
        stimulusRenderedAt: 0,
        responseCapturedAt: now,
        reactionTimeMs: 0,
        isLapse: false,
        isFalseStart: true,
      };
      trialsRef.current.push(falseTrial);

      setPhase('feedback');
      setFeedbackMessage('FALSE START (Terlalu cepat!)');
      setTimeout(startNextTrial, 1400);
      return;
    }

    // 2. Kasus Respon Valid terhadap Stimulus
    if (phase === 'stimulus') {
      const rt = Math.round(now - stimulusTimestampRef.current);
      const isLapse = rt >= BRIEF_PVT_LAPSE_THRESHOLD_MS;

      if (isLapse) {
        playWarningTone();
      } else {
        playTapClick();
      }

      const validTrial: PVTTrial = {
        trialIndex: trialsRef.current.length + 1,
        delayScheduledMs: 0,
        stimulusRenderedAt: stimulusTimestampRef.current,
        responseCapturedAt: now,
        reactionTimeMs: rt,
        isLapse,
        isFalseStart: false,
      };
      trialsRef.current.push(validTrial);

      setLiveDisplayMs(rt);
      setPhase('feedback');
      setFeedbackMessage(isLapse ? `LAPSE (+${rt} ms)` : `${rt} ms`);
      setTimeout(startNextTrial, 1200);
    }
  }, [phase, startNextTrial]);

  useEffect(() => {
    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return {
    phase,
    currentTrialNumber,
    totalTrialsGoal,
    liveDisplayMs,
    feedbackMessage,
    startNextTrial,
    handlePointerResponse,
  };
}
