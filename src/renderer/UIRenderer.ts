import type { MechData } from '../game/Mech';
import { MAX_HP, COLORS, PIXEL_SIZE } from '../constants';

export function drawUI(ctx: CanvasRenderingContext2D, mech1: MechData, mech2: MechData): void {
  const barWidth = 250;
  const barHeight = 20;
  const barY = 20;

  drawHealthBar(ctx, 50, barY, barWidth, barHeight, mech1, true);
  drawHealthBar(ctx, 500, barY, barWidth, barHeight, mech2, false);

  ctx.fillStyle = COLORS.white;
  ctx.font = '12px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.fillText('P1', 50, barY - 5);
  ctx.textAlign = 'right';
  ctx.fillText('P2', 750, barY - 5);
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  mech: MechData,
  isLeft: boolean
): void {
  const hpPercent = mech.hp / MAX_HP;
  const spPercent = mech.sp / MAX_HP;

  ctx.fillStyle = COLORS.hpBarBg;
  ctx.fillRect(x, y, width, height);

  const hpGradient = ctx.createLinearGradient(x, y, x + width, y);
  if (isLeft) {
    hpGradient.addColorStop(0, mech.primaryColor);
    hpGradient.addColorStop(1, mech.secondaryColor);
  } else {
    hpGradient.addColorStop(0, mech.secondaryColor);
    hpGradient.addColorStop(1, mech.primaryColor);
  }
  ctx.fillStyle = hpGradient;

  const hpWidth = Math.floor(width * hpPercent / PIXEL_SIZE) * PIXEL_SIZE;
  if (isLeft) {
    ctx.fillRect(x, y, hpWidth, height);
  } else {
    ctx.fillRect(x + width - hpWidth, y, hpWidth, height);
  }

  ctx.strokeStyle = mech.primaryColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = COLORS.spBarBg;
  ctx.fillRect(x, y + height + 5, width, 8);

  ctx.fillStyle = COLORS.spBar;
  const spWidth = Math.floor(width * spPercent / PIXEL_SIZE) * PIXEL_SIZE;
  if (isLeft) {
    ctx.fillRect(x, y + height + 5, spWidth, 8);
  } else {
    ctx.fillRect(x + width - spWidth, y + height + 5, spWidth, 8);
  }
}
