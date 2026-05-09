export const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

export const MechState = {
  IDLE: 'idle',
  MOVE: 'move',
  ATTACK: 'attack',
  DEFEND: 'defend',
  HURT: 'hurt',
  DEAD: 'dead',
  SKILL: 'skill',
} as const;

export type MechState = (typeof MechState)[keyof typeof MechState];

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
}

export interface GameStats {
  damageDealt: number;
  defendCount: number;
}

export interface GameResult {
  winner: 1 | 2;
  p1Stats: GameStats;
  p2Stats: GameStats;
}
