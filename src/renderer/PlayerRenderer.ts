import type { Player } from '../types';
import { COLORS, PIXEL_SIZE } from '../constants';

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  const { x, y, width, invincible, invincibleTimer } = player;

  if (invincible && Math.floor(invincibleTimer / 4) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const p = PIXEL_SIZE;
  const cx = x + width / 2;

  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(cx - 2 * p, y, 4 * p, 2 * p);
  ctx.fillRect(cx - 3 * p, y + 2 * p, 6 * p, 2 * p);

  ctx.fillStyle = COLORS.dark;
  ctx.fillRect(cx - p, y + 2 * p, 2 * p, 2 * p);

  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(cx - 4 * p, y + 4 * p, 8 * p, 2 * p);

  ctx.fillStyle = COLORS.white;
  ctx.fillRect(cx - 3 * p, y + 4 * p, 6 * p, p);

  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(cx - 5 * p, y + 6 * p, 10 * p, 2 * p);

  ctx.fillStyle = COLORS.dark;
  ctx.fillRect(cx - 2 * p, y + 6 * p, p, 2 * p);
  ctx.fillRect(cx + p, y + 6 * p, p, 2 * p);

  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(cx - 3 * p, y + 8 * p, p, 4 * p);
  ctx.fillRect(cx + 2 * p, y + 8 * p, p, 4 * p);

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(cx - p, y + 10 * p, 2 * p, 2 * p);

  ctx.shadowColor = COLORS.primary;
  ctx.shadowBlur = 10;
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(cx - p, y + 12 * p, 2 * p, p);
  ctx.shadowBlur = 0;

  ctx.fillStyle = COLORS.secondary;
  ctx.fillRect(cx - 4 * p, y + 10 * p, p, p);
  ctx.fillRect(cx + 3 * p, y + 10 * p, p, p);

  ctx.restore();
}
