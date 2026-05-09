import type { Bullet } from '../types';
import {
  BULLET_SPEED,
  BULLET_WIDTH,
  BULLET_HEIGHT,
  ENEMY_BULLET_SPEED,
  ENEMY_BULLET_WIDTH,
  ENEMY_BULLET_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../constants';

let bulletId = 0;

export function createPlayerBullet(x: number, y: number): Bullet {
  return {
    id: ++bulletId,
    x: x - BULLET_WIDTH / 2,
    y: y - BULLET_HEIGHT,
    vx: 0,
    vy: -BULLET_SPEED,
    width: BULLET_WIDTH,
    height: BULLET_HEIGHT,
    isPlayerBullet: true,
    damage: 1,
  };
}

export function createEnemyBullet(x: number, y: number, targetX: number, targetY: number): Bullet {
  const dx = targetX - x;
  const dy = targetY - y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const vx = (dx / dist) * ENEMY_BULLET_SPEED;
  const vy = (dy / dist) * ENEMY_BULLET_SPEED;

  return {
    id: ++bulletId,
    x: x - ENEMY_BULLET_WIDTH / 2,
    y: y - ENEMY_BULLET_HEIGHT / 2,
    vx,
    vy,
    width: ENEMY_BULLET_WIDTH,
    height: ENEMY_BULLET_HEIGHT,
    isPlayerBullet: false,
    damage: 1,
  };
}

export function updateBullet(bullet: Bullet): Bullet {
  return {
    ...bullet,
    x: bullet.x + bullet.vx,
    y: bullet.y + bullet.vy,
  };
}

export function isBulletOffScreen(bullet: Bullet): boolean {
  return (
    bullet.x + bullet.width < 0 ||
    bullet.x > CANVAS_WIDTH ||
    bullet.y + bullet.height < 0 ||
    bullet.y > CANVAS_HEIGHT
  );
}
