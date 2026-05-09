import type { Star } from '../types';
import { CANVAS_WIDTH, GROUND_Y, PIXEL_SIZE, COLORS } from '../constants';

export function createStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * CANVAS_WIDTH,
    y: Math.random() * (GROUND_Y - 50),
    size: Math.random() * 2 + 1,
    brightness: Math.random(),
  }));
}

export function drawBackground(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, 450);

  const gradient = ctx.createRadialGradient(
    CANVAS_WIDTH / 2, 100, 0,
    CANVAS_WIDTH / 2, 100, 400
  );
  gradient.addColorStop(0, 'rgba(0, 50, 80, 0.3)');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, 450);

  ctx.fillStyle = COLORS.white;
  stars.forEach((star) => {
    const flicker = 0.5 + Math.sin(Date.now() * 0.003 + star.brightness * 10) * 0.5;
    ctx.globalAlpha = star.brightness * flicker;
    ctx.fillRect(
      Math.floor(star.x / PIXEL_SIZE) * PIXEL_SIZE,
      Math.floor(star.y / PIXEL_SIZE) * PIXEL_SIZE,
      star.size,
      star.size
    );
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgba(0, 212, 255, 0.05)';
  for (let i = 0; i < 3; i++) {
    const silhouetteY = 50 + i * 30;
    ctx.fillRect(50, silhouetteY, 30, 60 - i * 15);
    ctx.fillRect(80, silhouetteY + 10, 20, 40 - i * 10);
    ctx.fillRect(650, silhouetteY, 30, 60 - i * 15);
    ctx.fillRect(680, silhouetteY + 10, 20, 40 - i * 10);
  }
}
