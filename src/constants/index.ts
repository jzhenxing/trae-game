export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 720;
export const PIXEL_SIZE = 4;

export const PLAYER_SPEED = 6;
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 48;
export const PLAYER_MAX_HP = 3;
export const PLAYER_SHOOT_INTERVAL = 150;
export const PLAYER_INVINCIBLE_TIME = 120;

export const BULLET_SPEED = 12;
export const BULLET_WIDTH = 6;
export const BULLET_HEIGHT = 16;
export const PLAYER_BULLET_DAMAGE = 1;
export const ENEMY_BULLET_SPEED = 6;
export const ENEMY_BULLET_DAMAGE = 1;
export const ENEMY_BULLET_WIDTH = 8;
export const ENEMY_BULLET_HEIGHT = 8;

export const ENEMY_WIDTH = 36;
export const ENEMY_HEIGHT = 40;
export const ENEMY_SPEED_MIN = 2;
export const ENEMY_SPEED_MAX = 4;
export const ENEMY_HP = 2;
export const ENEMY_SHOOT_INTERVAL = 2000;
export const ENEMY_SCORE = 100;
export const INITIAL_SPAWN_INTERVAL = 1500;
export const MIN_SPAWN_INTERVAL = 600;
export const SPAWN_DECREASE_SCORE = 500;
export const SPAWN_DECREASE_AMOUNT = 100;

export const BOSS_WIDTH = 80;
export const BOSS_HEIGHT = 96;
export const BOSS_HP = 20;
export const BOSS_SPEED = 1.5;
export const BOSS_SPAWN_SCORE = 3000;
export const BOSS_SCORE = 500;

export const STAR_COUNT = 100;

export const COLORS = {
  background: '#0a0a12',
  primary: '#00f0ff',
  secondary: '#ff00aa',
  accent: '#ffee00',
  white: '#ffffff',
  dark: '#1a1a2e',
  grid: '#00f0ff33',
  hpFull: '#00ff88',
  hpLow: '#ff3366',
  neonGlow: 'rgba(0, 240, 255, 0.5)',
} as const;

export const KEYS = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  shoot: ['Space'],
} as const;
