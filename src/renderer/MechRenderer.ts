import type { MechData } from '../game/Mech';
import { MechState } from '../types';
import { COLORS } from '../constants';

export function drawMech(ctx: CanvasRenderingContext2D, mech: MechData): void {
  ctx.save();

  const drawX = mech.x;
  const drawY = mech.y - 100;

  if (mech.hurtTimer > 0 && mech.hurtTimer % 4 < 2) {
    ctx.globalAlpha = 0.5;
  }

  if (mech.state === MechState.HURT) {
    ctx.translate(drawX + 40, drawY + 50);
    ctx.translate(Math.random() * 6 - 3, 0);
    ctx.translate(-(drawX + 40), -(drawY + 50));
  }

  ctx.translate(drawX + 40, drawY + 100);
  ctx.scale(mech.facing, 1);
  ctx.translate(-40, -100);

  if (mech.state === MechState.DEFEND) {
    drawShield(ctx);
  }

  if (mech.state === MechState.SKILL) {
    drawSkillBeam(ctx, mech);
  }

  drawMechBody(ctx, mech);

  ctx.restore();
}

function drawMechBody(ctx: CanvasRenderingContext2D, mech: MechData): void {
  const bobOffset = mech.state === MechState.IDLE ? Math.sin(mech.animTimer * 0.3) * 2 : 0;

  ctx.fillStyle = mech.darkColor;
  ctx.fillRect(16, 72 + bobOffset, 48, 28);

  ctx.fillStyle = mech.primaryColor;
  ctx.fillRect(20, 68 + bobOffset, 40, 8);
  ctx.fillRect(24, 76 + bobOffset, 32, 20);

  ctx.fillStyle = mech.secondaryColor;
  ctx.fillRect(28, 60 + bobOffset, 24, 12);
  ctx.fillRect(32, 48 + bobOffset, 16, 16);

  ctx.fillStyle = COLORS.white;
  ctx.fillRect(34, 52 + bobOffset, 12, 8);
  ctx.fillStyle = mech.primaryColor;
  ctx.fillRect(36, 54 + bobOffset, 8, 4);

  ctx.fillStyle = mech.primaryColor;
  ctx.fillRect(0, 64 + bobOffset, 20, 16);
  ctx.fillRect(60, 64 + bobOffset, 20, 16);

  ctx.fillStyle = mech.secondaryColor;
  ctx.fillRect(4, 56 + bobOffset, 12, 12);
  ctx.fillRect(64, 56 + bobOffset, 12, 12);

  ctx.fillStyle = mech.primaryColor;
  ctx.fillRect(28, 96 + bobOffset, 10, 8);
  ctx.fillRect(42, 96 + bobOffset, 10, 8);

  ctx.fillStyle = mech.darkColor;
  ctx.fillRect(24, 100 + bobOffset, 14, 12);
  ctx.fillRect(42, 100 + bobOffset, 14, 12);

  if (mech.state === MechState.ATTACK) {
    drawAttackArm(ctx, mech, bobOffset);
  } else {
    ctx.fillStyle = mech.primaryColor;
    ctx.fillRect(56, 68 + bobOffset, 24, 12);
    ctx.fillStyle = mech.secondaryColor;
    ctx.fillRect(72, 72 + bobOffset, 12, 8);
  }

  ctx.fillStyle = mech.darkColor;
  ctx.fillRect(8, 64 + bobOffset, 12, 16);
  ctx.fillStyle = mech.secondaryColor;
  ctx.fillRect(4, 60 + bobOffset, 8, 8);
}

function drawAttackArm(ctx: CanvasRenderingContext2D, mech: MechData, bobOffset: number): void {
  const attackProgress = 1 - (mech.attackTimer / 15);
  const armExtend = Math.sin(attackProgress * Math.PI) * 20;

  ctx.fillStyle = mech.primaryColor;
  ctx.fillRect(56 + armExtend, 68 + bobOffset, 24, 12);

  ctx.fillStyle = mech.secondaryColor;
  ctx.fillRect(72 + armExtend, 72 + bobOffset, 16, 8);

  if (attackProgress > 0.3 && attackProgress < 0.7) {
    ctx.fillStyle = COLORS.damage;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(
        80 + armExtend + i * 8 + Math.random() * 4,
        68 + bobOffset + Math.random() * 12,
        6,
        6
      );
    }
  }
}

function drawShield(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.6;

  ctx.beginPath();
  ctx.arc(40, 50, 50, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(40, 50, 45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function drawSkillBeam(ctx: CanvasRenderingContext2D, mech: MechData): void {
  const progress = 1 - (mech.attackTimer / 25);

  ctx.fillStyle = mech.secondaryColor;
  ctx.globalAlpha = 0.8;

  for (let i = 0; i < 5; i++) {
    const beamX = 70 + i * 15 + Math.sin(progress * 10 + i) * 5;
    const beamHeight = 40 + Math.random() * 20;
    ctx.fillRect(beamX, 50 - beamHeight / 2, 10, beamHeight);
  }

  ctx.globalAlpha = 1;
}
