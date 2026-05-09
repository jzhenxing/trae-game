import { useEffect, useRef, useCallback } from 'react';

export interface TouchDirection {
  x: number;
  y: number;
}

interface UseTouchInputOptions {
  onDirectionChange?: (direction: TouchDirection) => void;
}

export function useTouchInput(options: UseTouchInputOptions = {}) {
  const touchRef = useRef<TouchDirection>({ x: 0, y: 0 });
  const joystickRef = useRef<{ active: boolean; startX: number; startY: number; touchId: number | null }>({
    active: false,
    startX: 0,
    startY: 0,
    touchId: null,
  });

  const updateDirection = useCallback((x: number, y: number) => {
    touchRef.current = { x, y };
    options.onDirectionChange?.({ x, y });
  }, [options.onDirectionChange]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const joystickZone = screenWidth * 0.4;

    if (touch.clientX < joystickZone && !joystickRef.current.active) {
      joystickRef.current.active = true;
      joystickRef.current.startX = touch.clientX;
      joystickRef.current.startY = touch.clientY;
      joystickRef.current.touchId = touch.identifier;
      updateDirection(0, 0);
    }
  }, [updateDirection]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    if (!joystickRef.current.active) return;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === joystickRef.current.touchId) {
        const deltaX = touch.clientX - joystickRef.current.startX;
        const deltaY = touch.clientY - joystickRef.current.startY;
        const maxDistance = 50;

        const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDistance));
        const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDistance));

        updateDirection(
          Math.abs(normalizedX) < 0.3 ? 0 : normalizedX,
          Math.abs(normalizedY) < 0.3 ? 0 : normalizedY
        );
        break;
      }
    }
  }, [updateDirection]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickRef.current.touchId) {
        joystickRef.current.active = false;
        joystickRef.current.touchId = null;
        updateDirection(0, 0);
        break;
      }
    }
  }, [updateDirection]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return touchRef;
}
