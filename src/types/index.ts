export const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'gameover',
} as const;
export type GameState = (typeof GameState)[keyof typeof GameState];

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  speed: number;
  lastShotTime: number;
  invincible: boolean;
  invincibleTimer: number;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  speed: number;
  type: 'normal' | 'boss';
  lastShotTime: number;
  bobOffset: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isPlayerBullet: boolean;
  damage: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  speed: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  enemiesDestroyed: number;
}
