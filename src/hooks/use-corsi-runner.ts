'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CorsiTrial } from '@/types/corsi';
import { playTapClick, playStimulusBeep, playWarningTone } from '@/lib/audio/sound-effects';

export type CorsiPhase = 'tutorial' | 'demonstrating' | 'recalling' | 'trial_feedback' | 'complete';

const ROUND_SPANS = [3, 4, 5, 6];

function generateDynamicSequences(): number[][] {
  return ROUND_SPANS.map((span) => {
    const seq: number[] = [];
    while (seq.length < span) {
      const block = Math.floor(Math.random() * 9);
      if (!seq.includes(block)) {
        seq.push(block);
      }
    }
    return seq;
  });
}

interface UseCorsiRunnerProps {
  onComplete: (trials: CorsiTrial[]) => void;
}

export function useCorsiRunner({ onComplete }: UseCorsiRunnerProps) {
  const [phase, setPhase] = useState<CorsiPhase>('tutorial');
  const [currentRound, setCurrentRound] = useState(0);
  const [activeHighlightBlock, setActiveHighlightBlock] = useState<number | null>(null);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [feedbackText, setFeedbackText] = useState<string>('Perhatikan urutan balok!');

  const trialsRef = useRef<CorsiTrial[]>([]);
  const sequencesRef = useRef<number[][]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isStartedRef = useRef(false);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const finishTest = useCallback(() => {
    setPhase('complete');
    const timer = setTimeout(() => {
      onComplete(trialsRef.current);
    }, 400);
    timeoutsRef.current.push(timer);
  }, [onComplete]);

  // Mainkan demonstrasi urutan balok
  const playDemonstration = useCallback((seq: number[]) => {
    clearAllTimeouts();
    setPhase('demonstrating');
    setUserTaps([]);
    setFeedbackText('Perhatikan urutan balok yang menyala...');

    seq.forEach((blockIndex, step) => {
      const onTimer = setTimeout(() => {
        setActiveHighlightBlock(blockIndex);
        playTapClick();
      }, (step + 1) * 750);

      const offTimer = setTimeout(() => {
        setActiveHighlightBlock(null);
      }, (step + 1) * 750 + 450);

      timeoutsRef.current.push(onTimer, offTimer);
    });

    const totalDemoTime = (seq.length + 1) * 750 + 200;
    const finishDemoTimer = setTimeout(() => {
      setPhase('recalling');
      startTimeRef.current = performance.now();
      setFeedbackText('Giliran Anda: Ketuk balok sesuai urutan tadi!');
    }, totalDemoTime);

    timeoutsRef.current.push(finishDemoTimer);
  }, [clearAllTimeouts]);

  const startNextRound = useCallback((roundIdx: number) => {
    if (roundIdx >= ROUND_SPANS.length) {
      finishTest();
      return;
    }
    setCurrentRound(roundIdx);
    const seq = sequencesRef.current[roundIdx] || [];
    playDemonstration(seq);
  }, [finishTest, playDemonstration]);

  const startTest = useCallback(() => {
    if (isStartedRef.current) return;
    isStartedRef.current = true;
    sequencesRef.current = generateDynamicSequences();
    startNextRound(0);
  }, [startNextRound]);

  const handleBlockTap = (blockIndex: number) => {
    if (phase !== 'recalling') return;

    playTapClick();
    const nextTaps = [...userTaps, blockIndex];
    setUserTaps(nextTaps);

    const currentSequence = sequencesRef.current[currentRound] || [];
    const stepIndex = nextTaps.length - 1;
    const isCorrectSoFar = currentSequence[stepIndex] === blockIndex;

    if (!isCorrectSoFar || nextTaps.length === currentSequence.length) {
      const responseTime = Math.round(performance.now() - startTimeRef.current);
      const isFullCorrect = isCorrectSoFar && nextTaps.length === currentSequence.length;

      if (isFullCorrect) {
        playStimulusBeep();
        setFeedbackText('Hebat! Urutan tepat.');
      } else {
        playWarningTone();
        setFeedbackText('Urutan kurang tepat.');
      }

      const trial: CorsiTrial = {
        trialIndex: currentRound + 1,
        spanLength: currentSequence.length,
        targetSequence: currentSequence,
        userSequence: nextTaps,
        isCorrect: isFullCorrect,
        responseTimeMs: responseTime,
      };
      trialsRef.current.push(trial);

      setPhase('trial_feedback');
      const nextTimer = setTimeout(() => {
        startNextRound(currentRound + 1);
      }, 1000);
      timeoutsRef.current.push(nextTimer);
    }
  };

  return {
    phase,
    currentRound: currentRound + 1,
    totalRounds: ROUND_SPANS.length,
    activeHighlightBlock,
    userTaps,
    feedbackText,
    handleBlockTap,
    startTest,
  };
}
