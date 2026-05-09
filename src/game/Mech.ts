import type { GameStats, Particle } from '../types';
import { MechState } from '../types';
import {
  MECH_WIDTH,
  MECH_HEIGHT,
  MAX_HP,
  MAX_SP,
  MOVE_SPEED,
  JUMP_FORCE,
  ATTACK_COOLDOWN,
  SKILL_COST,
  DEFEND_REDUCTION,
  SP_REGEN_RATE,
  ATTACK_DURATION,
  SKILL_DURATION,
  HURT_DURATION,
  DEFEND_DURATION,
  COLORS,
} from '../constants';
import { applyGravity } from './Physics';
import { getHitbox, getAttackHitbox, clampPosition } from './Collision';
import { createExplosion } from './Particle';

export interface MechData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  sp: number;
  facing: number;
  state: MechState;
  isPlayer1: boolean;
  isGrounded: boolean;
  animFrame: number;
  animTimer: number;
  attackTimer: number;
  hurtTimer: number;
  defendTimer: number;
  attackCooldown: number;
  hitboxActive: boolean;
  stats: GameStats;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
}

export function createMech(x: number, isPlayer1: boolean): MechData {
  return {
    x,
    y: 380,
    vx: 0,
    vy: 0,
    hp: MAX_HP,
    sp: MAX_SP,
    facing: isPlayer1 ? 1 : -1,
    state: MechState.IDLE,
    isPlayer1,
    isGrounded: true,
    animFrame: 0,
    animTimer: 0,
    attackTimer: 0,
    hurtTimer: 0,
    defendTimer: 0,
    attackCooldown: 0,
    hitboxActive: false,
    stats: { damageDealt: 0, defendCount: 0 },
    primaryColor: isPlayer1 ? COLORS.mechAPrimary : COLORS.mechBPrimary,
    secondaryColor: isPlayer1 ? COLORS.mechASecondary : COLORS.mechBSecondary,
    darkColor: isPlayer1 ? COLORS.mechADark : COLORS.mechBDark,
  };
}

export function updateMech(
  mech: MechData,
  actions: Record<string, boolean>,
  opponent: MechData
): { mech: MechData; newParticles: Particle[] } {
  const newParticles: Particle[] = [];
  let m = { ...mech };

  if (m.state === MechState.DEAD) return { mech: m, newParticles };

  m.animTimer++;
  if (m.animTimer >= 8) {
    m.animTimer = 0;
    m.animFrame = (m.animFrame + 1) % 4;
  }

  if (m.attackCooldown > 0) m.attackCooldown--;
  if (m.hurtTimer > 0) m.hurtTimer--;
  if (m.defendTimer > 0) m.defendTimer--;

  if (m.attackTimer > 0) {
    m.attackTimer--;
    if (m.attackTimer === 10) m.hitboxActive = false;
    if (m.attackTimer === 0) m.state = MechState.IDLE;
  }

  m.sp = Math.min(MAX_SP, m.sp + SP_REGEN_RATE);

  if (m.state === MechState.HURT && m.hurtTimer === 0) {
    m.state = MechState.IDLE;
  }

  if (m.state !== MechState.ATTACK && m.state !== MechState.SKILL && m.state !== MechState.HURT) {
    const result = handleMovement(m, actions, opponent);
    m = result.mech;
    newParticles.push(...result.newParticles);
  }

  const physics = applyGravity(m.y, m.vy);
  m.y = physics.y;
  m.vy = physics.vy;
  m.isGrounded = physics.isGrounded;
  m.x += m.vx;
  m.x = clampPosition(m.x);

  if (opponent && m.state !== MechState.HURT) {
    m.facing = opponent.x > m.x ? 1 : -1;
  }

  return { mech: m, newParticles };
}

function handleMovement(
  mech: MechData,
  actions: Record<string, boolean>,
  _opponent: MechData
): { mech: MechData; newParticles: Particle[] } {
  const newParticles: Particle[] = [];
  let m = { ...mech };

  if (actions.defend && m.isGrounded && m.defendTimer === 0) {
    m.state = MechState.DEFEND;
    m.defendTimer = DEFEND_DURATION;
    m.stats = { ...m.stats, defendCount: m.stats.defendCount + 1 };
    return { mech: m, newParticles };
  }

  if (actions.skill && m.sp >= SKILL_COST && m.isGrounded && m.attackCooldown === 0) {
    m.state = MechState.SKILL;
    m.attackTimer = SKILL_DURATION;
    m.hitboxActive = true;
    m.attackCooldown = 60;
    m.sp -= SKILL_COST;
    newParticles.push(
      ...createExplosion(
        m.x + MECH_WIDTH / 2 + m.facing * 60,
        m.y - MECH_HEIGHT / 2,
        m.secondaryColor,
        20
      )
    );
    return { mech: m, newParticles };
  }

  let moving = false;
  if (actions.left) {
    m.vx = -MOVE_SPEED;
    moving = true;
  } else if (actions.right) {
    m.vx = MOVE_SPEED;
    moving = true;
  } else {
    m.vx = 0;
  }

  if (actions.jump && m.isGrounded) {
    m.vy = JUMP_FORCE;
    m.isGrounded = false;
  }

  if (actions.attack && m.attackCooldown === 0) {
    m.state = MechState.ATTACK;
    m.attackTimer = ATTACK_DURATION;
    m.hitboxActive = true;
    m.attackCooldown = ATTACK_COOLDOWN;
    return { mech: m, newParticles };
  }

  m.state = moving ? MechState.MOVE : MechState.IDLE;
  return { mech: m, newParticles };
}

export function takeDamage(
  mech: MechData,
  amount: number,
  attacker: MechData | null
): { mech: MechData; attacker: MechData | null; newParticles: Particle[] } {
  const newParticles: Particle[] = [];
  let m = { ...mech };
  let a = attacker ? { ...attacker } : null;

  if (m.state === MechState.DEAD) return { mech: m, attacker: a, newParticles };

  let actualDamage = amount;
  if (m.state === MechState.DEFEND) {
    actualDamage = Math.floor(amount * DEFEND_REDUCTION);
    newParticles.push(
      ...createExplosion(
        m.x + MECH_WIDTH / 2,
        m.y - MECH_HEIGHT / 2,
        COLORS.grid,
        8
      )
    );
  }

  m.hp -= actualDamage;
  if (a) {
    a = { ...a, stats: { ...a.stats, damageDealt: a.stats.damageDealt + actualDamage } };
  }

  if (m.hp <= 0) {
    m.hp = 0;
    m.state = MechState.DEAD;
  } else {
    m.state = MechState.HURT;
    m.hurtTimer = HURT_DURATION;
    newParticles.push(
      ...createExplosion(
        m.x + MECH_WIDTH / 2,
        m.y - MECH_HEIGHT / 2,
        m.primaryColor,
        5
      )
    );
  }

  return { mech: m, attacker: a, newParticles };
}

export { getHitbox, getAttackHitbox };
