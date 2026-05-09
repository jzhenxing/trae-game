import type { Particle } from '../types';
import { COLORS } from '../constants';

export function createExplosion(
  x: number,
  y: number,
  color: string,
  count: number = 15
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 3 + Math.random() * 4,
    });
  }
  return particles;
}

export function createThrustParticle(
  x: number,
  y: number,
  color: string = COLORS.accent
): Particle[] {
  return [
    {
      x: x + (Math.random() - 0.5) * 8,
      y: y + Math.random() * 4,
      vx: (Math.random() - 0.5) * 1,
      vy: 2 + Math.random() * 2,
      life: 10 + Math.random() * 10,
      maxLife: 20,
      color,
      size: 2 + Math.random() * 3,
    },
  ];
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vx: p.vx * 0.96,
      vy: p.vy * 0.96,
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0);
}
