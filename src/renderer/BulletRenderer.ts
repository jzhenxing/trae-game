import type { Bullet } from '../types';
import { COLORS } from '../constants';

export function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  ctx.save();

  if (bullet.isPlayerBullet) {
    ctx.shadowColor = COLORS.primary;
    ctx.shadowBlur = 8;
    ctx.fillStyle = COLORS.primary;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(bullet.x + 1, bullet.y + 2, bullet.width - 2, bullet.height - 4);
  } else {
    ctx.shadowColor = COLORS.secondary;
    ctx.shadowBlur = 6;
    ctx.fillStyle = COLORS.secondary;
    ctx.beginPath();
    ctx.arc(
      bullet.x + bullet.width / 2,
      bullet.y + bullet.height / 2,
      bullet.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}
