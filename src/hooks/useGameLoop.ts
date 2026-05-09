import { useRef, useCallback } from 'react';

export function useGameLoop() {
  const rafRef = useRef<number>(0);

  const start = useCallback((callback: () => void) => {
    const loop = () => {
      callback();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  return { start, stop };
}
