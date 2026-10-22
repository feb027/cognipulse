'use client';

import { useRef, useEffect, useCallback } from 'react';

interface UseBottomSheetDragOptions {
  isOpen: boolean;
  onClose: () => void;
  threshold?: number;
}

export function useBottomSheetDrag({
  isOpen,
  onClose,
  threshold = 75,
}: UseBottomSheetDragOptions) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const currentYRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isClosingRef = useRef<boolean>(false);

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640;

  // Mount animation & Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    isClosingRef.current = false;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;

    // Mobile entrance: slide smoothly up from bottom
    if (sheet && isMobile()) {
      sheet.style.transform = 'translate3d(0, 100%, 0)';
      sheet.style.transition = 'none';
      if (backdrop) backdrop.style.opacity = '1';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!isClosingRef.current && sheet) {
            sheet.style.transition = 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)';
            sheet.style.transform = 'translate3d(0, 0, 0)';
          }
        });
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const triggerClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;

    if (isMobile() && sheet) {
      // Mobile: slide smoothly down off-screen with zero lag
      sheet.style.transition = 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)';
      sheet.style.transform = 'translate3d(0, 100%, 0)';
      if (backdrop) {
        backdrop.style.transition = 'opacity 180ms ease';
        backdrop.style.opacity = '0';
      }
      setTimeout(() => {
        onClose();
      }, 200);
    } else {
      // Desktop: immediate subtle fade out without vertical jumping
      if (sheet) {
        sheet.style.transition = 'opacity 100ms ease';
        sheet.style.opacity = '0';
      }
      if (backdrop) {
        backdrop.style.transition = 'opacity 100ms ease';
        backdrop.style.opacity = '0';
      }
      setTimeout(() => {
        onClose();
      }, 100);
    }
  }, [onClose]);

  // Touch handlers: direct DOM mutations for 60/120fps performance on older phones
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile() || isClosingRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    startTimeRef.current = Date.now();

    const sheet = sheetRef.current;
    if (sheet) {
      sheet.style.transition = 'none';
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile() || startYRef.current === null || isClosingRef.current) return;
    const currentY = e.touches[0].clientY;
    currentYRef.current = currentY;
    const deltaY = currentY - startYRef.current;

    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;

    if (sheet) {
      // Follow finger with hardware-accelerated transform
      const y = deltaY > 0 ? deltaY : deltaY * 0.15;
      sheet.style.transform = `translate3d(0, ${y}px, 0)`;

      if (backdrop && deltaY > 0) {
        const opacity = Math.max(0.15, 1 - deltaY / 320);
        backdrop.style.opacity = String(opacity);
      }
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isMobile() || startYRef.current === null || isClosingRef.current) return;
    const deltaY = (currentYRef.current ?? startYRef.current) - startYRef.current;
    const timeElapsed = Date.now() - startTimeRef.current;
    const velocity = deltaY / Math.max(1, timeElapsed);

    startYRef.current = null;
    currentYRef.current = null;

    if (deltaY > threshold || (deltaY > 30 && velocity > 0.45)) {
      triggerClose();
    } else {
      const sheet = sheetRef.current;
      const backdrop = backdropRef.current;
      if (sheet) {
        sheet.style.transition = 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)';
        sheet.style.transform = 'translate3d(0, 0, 0)';
      }
      if (backdrop) {
        backdrop.style.transition = 'opacity 180ms ease';
        backdrop.style.opacity = '1';
      }
    }
  }, [threshold, triggerClose]);

  return {
    sheetRef,
    backdropRef,
    triggerClose,
    dragHandleProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
