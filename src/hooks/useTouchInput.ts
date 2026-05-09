import { useEffect, useRef, useCallback } from 'react';

export interface TouchDirection {
  x: number;
  y: number;
}

interface UseTouchInputOptions {
  onDirectionChange?: (direction: TouchDirection) => void;
  containerRef?: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
}

export function useTouchInput(options: UseTouchInputOptions = {}) {
  const { onDirectionChange, containerRef, enabled = true } = options;
  const touchRef = useRef<TouchDirection>({ x: 0, y: 0 });
  const joystickRef = useRef<{ active: boolean; startX: number; startY: number; touchId: number | null }>({
    active: false,
    startX: 0,
    startY: 0,
    touchId: null,
  });

  const updateDirection = useCallback((x: number, y: number) => {
    touchRef.current = { x, y };
    onDirectionChange?.({ x, y });
  }, [onDirectionChange]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const joystickZone = screenWidth * 0.4;

    if (touch.clientX < joystickZone && !joystickRef.current.active) {
      e.preventDefault();
      joystickRef.current.active = true;
      joystickRef.current.startX = touch.clientX;
      joystickRef.current.startY = touch.clientY;
      joystickRef.current.touchId = touch.identifier;
      updateDirection(0, 0);
    }
  }, [enabled, updateDirection]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !joystickRef.current.active) return;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === joystickRef.current.touchId) {
        e.preventDefault();
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
  }, [enabled, updateDirection]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickRef.current.touchId) {
        joystickRef.current.active = false;
        joystickRef.current.touchId = null;
        updateDirection(0, 0);
        break;
      }
    }
  }, [enabled, updateDirection]);

  useEffect(() => {
    const target = containerRef?.current || document;
    const options: AddEventListenerOptions = { passive: false };

    if (enabled) {
      target.addEventListener('touchstart', handleTouchStart as EventListener, options);
      target.addEventListener('touchmove', handleTouchMove as EventListener, options);
      target.addEventListener('touchend', handleTouchEnd as EventListener, options);
      target.addEventListener('touchcancel', handleTouchEnd as EventListener, options);
    }

    return () => {
      target.removeEventListener('touchstart', handleTouchStart as EventListener);
      target.removeEventListener('touchmove', handleTouchMove as EventListener);
      target.removeEventListener('touchend', handleTouchEnd as EventListener);
      target.removeEventListener('touchcancel', handleTouchEnd as EventListener);
    };
  }, [enabled, containerRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return touchRef;
}
