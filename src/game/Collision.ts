import type { Rect } from '../types';
import { CANVAS_WIDTH, MECH_WIDTH, MECH_HEIGHT } from '../constants';

export function boxCollision(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function getHitbox(x: number, y: number): Rect {
  return {
    x,
    y: y - MECH_HEIGHT,
    width: MECH_WIDTH,
    height: MECH_HEIGHT,
  };
}

export function getAttackHitbox(
  x: number,
  y: number,
  facing: number
): Rect {
  const offset = facing === 1 ? MECH_WIDTH : -40;
  return {
    x: x + offset,
    y: y - MECH_HEIGHT + 20,
    width: 40,
    height: 60,
  };
}

export function clampPosition(x: number): number {
  return Math.max(0, Math.min(CANVAS_WIDTH - MECH_WIDTH, x));
}
