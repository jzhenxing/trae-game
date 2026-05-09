import type { Particle } from '../types';
import { PIXEL_SIZE } from '../constants';

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  particles.forEach((p) => {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;

    const drawX = Math.floor(p.x / PIXEL_SIZE) * PIXEL_SIZE;
    const drawY = Math.floor(p.y / PIXEL_SIZE) * PIXEL_SIZE;
    const size = Math.floor(p.size / PIXEL_SIZE) * PIXEL_SIZE;

    ctx.fillRect(drawX, drawY, size, size);
  });
  ctx.globalAlpha = 1;
}
