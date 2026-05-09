import { useEffect, useRef, useCallback } from 'react';
import { P1_KEYS, P2_KEYS } from '../constants';

export type KeyActions = {
  p1: Record<string, boolean>;
  p2: Record<string, boolean>;
};

function mapKeys(pressedKeys: Set<string>): KeyActions {
  const p1: Record<string, boolean> = {};
  const p2: Record<string, boolean> = {};

  for (const [key, action] of Object.entries(P1_KEYS)) {
    p1[action] = pressedKeys.has(key);
  }
  for (const [key, action] of Object.entries(P2_KEYS)) {
    p2[action] = pressedKeys.has(key);
  }

  return { p1, p2 };
}

export function useInput(): React.RefObject<KeyActions> {
  const keysRef = useRef<KeyActions>({
    p1: { left: false, right: false, jump: false, attack: false, defend: false, skill: false },
    p2: { left: false, right: false, jump: false, attack: false, defend: false, skill: false },
  });
  const pressedKeysRef = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    pressedKeysRef.current.add(e.key);
    keysRef.current = mapKeys(pressedKeysRef.current);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    pressedKeysRef.current.delete(e.key);
    keysRef.current = mapKeys(pressedKeysRef.current);
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
