import { useEffect, useRef, useCallback } from 'react';
import { KEYS } from '../constants';

export interface KeyActions {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  shoot: boolean;
}

export function useInput(): React.RefObject<KeyActions> {
  const keysRef = useRef<KeyActions>({
    left: false,
    right: false,
    up: false,
    down: false,
    shoot: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (KEYS.left.includes(e.code as typeof KEYS.left[number])) keysRef.current.left = true;
    if (KEYS.right.includes(e.code as typeof KEYS.right[number])) keysRef.current.right = true;
    if (KEYS.up.includes(e.code as typeof KEYS.up[number])) keysRef.current.up = true;
    if (KEYS.down.includes(e.code as typeof KEYS.down[number])) keysRef.current.down = true;
    if (KEYS.shoot.includes(e.code as typeof KEYS.shoot[number])) keysRef.current.shoot = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (KEYS.left.includes(e.code as typeof KEYS.left[number])) keysRef.current.left = false;
    if (KEYS.right.includes(e.code as typeof KEYS.right[number])) keysRef.current.right = false;
    if (KEYS.up.includes(e.code as typeof KEYS.up[number])) keysRef.current.up = false;
    if (KEYS.down.includes(e.code as typeof KEYS.down[number])) keysRef.current.down = false;
    if (KEYS.shoot.includes(e.code as typeof KEYS.shoot[number])) keysRef.current.shoot = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keysRef;
}
