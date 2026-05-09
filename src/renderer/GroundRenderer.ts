import { CANVAS_WIDTH, GROUND_Y, PIXEL_SIZE, COLORS } from '../constants';

export function drawGround(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 450 - GROUND_Y);

  ctx.strokeStyle = COLORS.gridDim;
  ctx.lineWidth = 1;
  for (let x = 0; x < CANVAS_WIDTH; x += PIXEL_SIZE * 2) {
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.lineTo(x, 450);
    ctx.stroke();
  }
  for (let y = GROUND_Y; y < 450; y += PIXEL_SIZE * 2) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
  ctx.stroke();

  ctx.shadowColor = COLORS.grid;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 2);
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}
