import type { Enemy } from '../types';
import {
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_SPEED_MIN,
  ENEMY_SPEED_MAX,
  ENEMY_HP,
  BOSS_WIDTH,
  BOSS_HEIGHT,
  BOSS_HP,
  BOSS_SPEED,
  CANVAS_WIDTH,
} from '../constants';

let enemyId = 0;

export function createEnemy(x: number): Enemy {
  const speed = ENEMY_SPEED_MIN + Math.random() * (ENEMY_SPEED_MAX - ENEMY_SPEED_MIN);
  return {
    id: ++enemyId,
    x,
    y: -ENEMY_HEIGHT,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    hp: ENEMY_HP,
    maxHp: ENEMY_HP,
    speed,
    type: 'normal',
    lastShotTime: Date.now() + Math.random() * 1000,
    bobOffset: Math.random() * Math.PI * 2,
  };
}

export function createBoss(): Enemy {
  return {
    id: ++enemyId,
    x: CANVAS_WIDTH / 2 - BOSS_WIDTH / 2,
    y: -BOSS_HEIGHT,
    width: BOSS_WIDTH,
    height: BOSS_HEIGHT,
    hp: BOSS_HP,
    maxHp: BOSS_HP,
    speed: BOSS_SPEED,
    type: 'boss',
    lastShotTime: Date.now(),
    bobOffset: 0,
  };
}

export function updateEnemy(enemy: Enemy): Enemy {
  return {
    ...enemy,
    y: enemy.y + enemy.speed,
    bobOffset: enemy.bobOffset + 0.05,
  };
}

export function isEnemyOffScreen(enemy: Enemy): boolean {
  return enemy.y > 720 + enemy.height;
}
