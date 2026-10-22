'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseBottomSheetDragOptions {
  isOpen: boolean;
  onClose: () => void;
  threshold?: number;
}

export function useBottomSheetDrag({
  isOpen,
  onClose,
  threshold = 80,
}: UseBottomSheetDragOptions) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const startYRef = useRef<number | null>(null);
  const currentYRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setDragOffset(0);
      setIsDragging(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setIsDragging(false);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDragOffset(0);
    }, 200);
  }, [onClose]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
    startTimeRef.current = Date.now();
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (startYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    currentYRef.current = currentY;
    const deltaY = currentY - startYRef.current;

    // Pull down only; slight rubber-banding if dragged up
    if (deltaY > 0) {
      setDragOffset(deltaY);
    } else {
      setDragOffset(deltaY * 0.15);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (startYRef.current === null) return;
    const deltaY = (currentYRef.current ?? startYRef.current) - startYRef.current;
    const timeElapsed = Date.now() - startTimeRef.current;
    const velocity = deltaY / Math.max(1, timeElapsed);

    startYRef.current = null;
    currentYRef.current = null;

    // Dismiss if dragged beyond threshold OR fast downward flick
    if (deltaY > threshold || (deltaY > 30 && velocity > 0.45)) {
      triggerClose();
    } else {
      setIsDragging(false);
      setDragOffset(0);
    }
  }, [threshold, triggerClose]);

  const sheetStyle: React.CSSProperties = {
    transform: isClosing
      ? 'translateY(100%)'
      : isDragging
      ? `translateY(${Math.max(0, dragOffset)}px)`
      : undefined,
    transition: isDragging
      ? 'none'
      : 'transform 0.24s cubic-bezier(0.32, 0.72, 0, 1)',
  };

  return {
    isDragging,
    isClosing,
    dragOffset,
    sheetStyle,
    triggerClose,
    dragHandleProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
