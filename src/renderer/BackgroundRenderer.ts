import type { Star } from '../types';
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export function createStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() < 0.3 ? 2 : 1,
      brightness: 0.3 + Math.random() * 0.7,
      speed: 0.5 + Math.random() * 1.5,
    });
  }
  return stars;
}

export function updateStars(stars: Star[]): Star[] {
  return stars.map((star) => {
    let y = star.y + star.speed;
    if (y > CANVAS_HEIGHT) {
      y = 0;
      star.x = Math.random() * CANVAS_WIDTH;
    }
    return { ...star, y };
  });
}

export function drawBackground(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (const star of stars) {
    const flicker = 0.7 + Math.sin(Date.now() * 0.003 + star.x) * 0.3;
    const alpha = star.brightness * flicker;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
  }

  for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
    ctx.strokeStyle = `rgba(0, 240, 255, 0.03)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
}
