/**
 * Hook: useMotorRunner
 * Perekam ritme ketukan motorik 15 detik untuk analisis kestabilan ITI dan tremor kelelahan.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { TapEvent } from '@/types/motor';
import { playTapClick } from '@/lib/audio/sound-effects';

interface MotorRunnerOptions {
  durationSeconds?: number;
  onComplete: (events: TapEvent[]) => void;
}

export function useMotorRunner({ durationSeconds = 15, onComplete }: MotorRunnerOptions) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [tapCount, setTapCount] = useState(0);
  const [recentIntervals, setRecentIntervals] = useState<number[]>([]);

  const eventsRef = useRef<TapEvent[]>([]);
  const lastTapTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTappingSession = useCallback(() => {
    eventsRef.current = [];
    lastTapTimeRef.current = null;
    setTapCount(0);
    setTimeLeft(durationSeconds);
    setIsActive(true);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setTimeout(() => {
            setIsActive(false);
            onComplete(eventsRef.current);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [durationSeconds, onComplete]);

  const recordTap = useCallback(() => {
    if (!isActive) return;

    const now = performance.now();
    playTapClick();

    let iti = 0;
    if (lastTapTimeRef.current !== null) {
      iti = Math.round(now - lastTapTimeRef.current);
    }
    lastTapTimeRef.current = now;

    const newEvent: TapEvent = {
      tapIndex: eventsRef.current.length + 1,
      timestampMs: now,
      interTapIntervalMs: iti,
    };

    eventsRef.current.push(newEvent);
    setTapCount(eventsRef.current.length);

    if (iti > 0) {
      setRecentIntervals((prev) => [...prev.slice(-15), iti]);
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return {
    isActive,
    timeLeft,
    tapCount,
    recentIntervals,
    startTappingSession,
    recordTap,
  };
}
