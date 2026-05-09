import type { Player, GameStats } from '../types';
import { COLORS, CANVAS_WIDTH } from '../constants';

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  player: Player,
  stats: GameStats
): void {
  ctx.save();
  ctx.font = '12px "Press Start 2P", monospace';

  ctx.fillStyle = COLORS.primary;
  ctx.textAlign = 'right';
  ctx.shadowColor = COLORS.primary;
  ctx.shadowBlur = 10;
  ctx.fillText(`${stats.score}`, CANVAS_WIDTH - 10, 25);
  ctx.shadowBlur = 0;

  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#666';
  ctx.fillText('SCORE', CANVAS_WIDTH - 10, 38);

  const hpBarWidth = 120;
  const hpBarHeight = 12;
  const hpBarX = 10;
  const hpBarY = 10;

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

  const hpRatio = player.hp / player.maxHp;
  const hpColor = hpRatio > 0.3 ? COLORS.hpFull : COLORS.hpLow;

  if (hpRatio <= 0.3) {
    ctx.shadowColor = COLORS.hpLow;
    ctx.shadowBlur = 8;
  }

  ctx.fillStyle = hpColor;
  ctx.fillRect(hpBarX + 1, hpBarY + 1, (hpBarWidth - 2) * hpRatio, hpBarHeight - 2);

  ctx.shadowBlur = 0;
  ctx.strokeStyle = COLORS.primary;
  ctx.lineWidth = 2;
  ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

  ctx.fillStyle = COLORS.white;
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HP', hpBarX + 4, hpBarY + 9);

  ctx.restore();
}
