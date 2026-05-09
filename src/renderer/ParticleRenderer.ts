import type { Particle } from '../types';

export function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
  const { x, y, size, color, life, maxLife } = particle;
  const alpha = life / maxLife;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x - size / 2), Math.floor(y - size / 2), size, size);
  ctx.restore();
}
