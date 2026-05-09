import { GROUND_Y, GRAVITY } from '../constants';

export function applyGravity(y: number, vy: number): { y: number; vy: number; isGrounded: boolean } {
  vy += GRAVITY;
  y += vy;

  let isGrounded = false;
  if (y >= GROUND_Y) {
    y = GROUND_Y;
    vy = 0;
    isGrounded = true;
  }

  return { y, vy, isGrounded };
}
