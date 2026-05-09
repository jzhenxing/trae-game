import type { Enemy } from '../types';
import { COLORS, PIXEL_SIZE } from '../constants';

export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  const { x, y, width, height, type, bobOffset, hp, maxHp } = enemy;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const p = PIXEL_SIZE;
  const cx = x + width / 2;
  const cy = y + height / 2 + Math.sin(bobOffset) * 2;

  const isBoss = type === 'boss';
  const enemyColor = isBoss ? COLORS.accent : COLORS.secondary;
  const darkColor = isBoss ? '#aa8800' : '#990066';

  if (isBoss) {
    ctx.shadowColor = COLORS.accent;
    ctx.shadowBlur = 15;
  }

  ctx.fillStyle = enemyColor;
  ctx.fillRect(cx - 2 * p, cy - 4 * p, 4 * p, 2 * p);
  ctx.fillRect(cx - 3 * p, cy - 2 * p, 6 * p, 2 * p);

  ctx.fillStyle = darkColor;
  ctx.fillRect(cx - p, cy - 2 * p, 2 * p, 2 * p);

  ctx.fillStyle = enemyColor;
  ctx.fillRect(cx - 4 * p, cy, 8 * p, 2 * p);

  ctx.fillStyle = COLORS.white;
  ctx.fillRect(cx - 3 * p, cy, 6 * p, p);

  ctx.fillStyle = enemyColor;
  ctx.fillRect(cx - 5 * p, cy + 2 * p, 10 * p, 2 * p);

  ctx.fillStyle = darkColor;
  ctx.fillRect(cx - 2 * p, cy + 2 * p, p, 2 * p);
  ctx.fillRect(cx + p, cy + 2 * p, p, 2 * p);

  ctx.fillStyle = enemyColor;
  ctx.fillRect(cx - 3 * p, cy + 4 * p, p, 3 * p);
  ctx.fillRect(cx + 2 * p, cy + 4 * p, p, 3 * p);

  ctx.fillStyle = '#ff3366';
  ctx.fillRect(cx - p, cy + 5 * p, 2 * p, p);

  ctx.shadowBlur = 0;

  if (hp < maxHp) {
    const barWidth = width;
    const barHeight = 4;
    const barY = y - 8;
    const hpRatio = hp / maxHp;

    ctx.fillStyle = '#333';
    ctx.fillRect(x, barY, barWidth, barHeight);

    ctx.fillStyle = hpRatio > 0.3 ? COLORS.hpFull : COLORS.hpLow;
    ctx.fillRect(x, barY, barWidth * hpRatio, barHeight);

    ctx.strokeStyle = COLORS.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, barY, barWidth, barHeight);
  }

  ctx.restore();
}
