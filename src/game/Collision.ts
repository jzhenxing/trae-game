import type { Player, Enemy, Bullet } from '../types';

export function boxCollision(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function checkPlayerBulletEnemyCollision(
  bullet: Bullet,
  enemy: Enemy
): boolean {
  return boxCollision(
    bullet.x,
    bullet.y,
    bullet.width,
    bullet.height,
    enemy.x,
    enemy.y,
    enemy.width,
    enemy.height
  );
}

export function checkEnemyBulletPlayerCollision(
  bullet: Bullet,
  player: Player
): boolean {
  return boxCollision(
    bullet.x,
    bullet.y,
    bullet.width,
    bullet.height,
    player.x,
    player.y,
    player.width,
    player.height
  );
}

export function checkEnemyPlayerCollision(
  enemy: Enemy,
  player: Player
): boolean {
  return boxCollision(
    enemy.x,
    enemy.y,
    enemy.width,
    enemy.height,
    player.x,
    player.y,
    player.width,
    player.height
  );
}
