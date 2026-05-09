import type { Player } from '../types';
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_MAX_HP,
  PLAYER_SPEED,
  PLAYER_INVINCIBLE_TIME,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../constants';

export function createPlayer(): Player {
  return {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - PLAYER_HEIGHT - 20,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    hp: PLAYER_MAX_HP,
    maxHp: PLAYER_MAX_HP,
    speed: PLAYER_SPEED,
    lastShotTime: 0,
    invincible: false,
    invincibleTimer: 0,
  };
}

export function updatePlayer(
  player: Player,
  keys: { left: boolean; right: boolean; up: boolean; down: boolean }
): Player {
  let { x, y, invincible, invincibleTimer } = player;

  if (keys.left) x -= PLAYER_SPEED;
  if (keys.right) x += PLAYER_SPEED;
  if (keys.up) y -= PLAYER_SPEED;
  if (keys.down) y += PLAYER_SPEED;

  x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, x));
  y = Math.max(0, Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, y));

  if (invincible) {
    invincibleTimer--;
    if (invincibleTimer <= 0) {
      invincible = false;
      invincibleTimer = 0;
    }
  }

  return { ...player, x, y, invincible, invincibleTimer };
}

export function damagePlayer(player: Player): Player {
  if (player.invincible) return player;
  return {
    ...player,
    hp: player.hp - 1,
    invincible: true,
    invincibleTimer: PLAYER_INVINCIBLE_TIME,
  };
}

export function canPlayerShoot(player: Player, now: number, interval: number): boolean {
  return now - player.lastShotTime >= interval;
}

export function updatePlayerShootTime(player: Player, now: number): Player {
  return { ...player, lastShotTime: now };
}
