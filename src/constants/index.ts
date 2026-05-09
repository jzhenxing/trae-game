export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;
export const PIXEL_SIZE = 4;
export const GROUND_Y = 380;
export const GRAVITY = 0.8;
export const JUMP_FORCE = -15;
export const MOVE_SPEED = 5;
export const ATTACK_COOLDOWN = 30;
export const SKILL_COST = 30;
export const ATTACK_DAMAGE = 10;
export const SKILL_DAMAGE = 25;
export const DEFEND_REDUCTION = 0.5;
export const SP_REGEN_RATE = 0.15;
export const MAX_HP = 100;
export const MAX_SP = 100;
export const MECH_WIDTH = 80;
export const MECH_HEIGHT = 100;
export const ATTACK_DURATION = 15;
export const SKILL_DURATION = 25;
export const HURT_DURATION = 15;
export const DEFEND_DURATION = 15;
export const ATTACK_HIT_FRAME = 10;
export const SKILL_HIT_FRAME = 10;

export const COLORS = {
  background: '#0a0a12',
  ground: '#1a1a2e',
  grid: '#00d4ff',
  gridDim: '#0d3d4d',
  mechAPrimary: '#ff3366',
  mechASecondary: '#ff6b6b',
  mechADark: '#991f3d',
  mechBPrimary: '#00d4ff',
  mechBSecondary: '#00ffff',
  mechBDark: '#007a99',
  hpBar: '#ff3366',
  hpBarBg: '#330011',
  spBar: '#ffcc00',
  spBarBg: '#332200',
  white: '#ffffff',
  damage: '#ffff00',
} as const;

export const P1_KEYS: Record<string, string> = {
  a: 'left',
  d: 'right',
  w: 'jump',
  j: 'attack',
  k: 'defend',
  l: 'skill',
};

export const P2_KEYS: Record<string, string> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'jump',
  1: 'attack',
  2: 'defend',
  3: 'skill',
};
