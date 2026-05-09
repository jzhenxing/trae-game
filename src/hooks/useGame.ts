import { useRef, useCallback, useState } from 'react';
import { GameState, MechState } from '../types';
import type { Particle, Star, GameResult } from '../types';
import type { MechData } from '../game/Mech';
import { createMech, updateMech, takeDamage } from '../game/Mech';
import { updateParticles } from '../game/Particle';
import { boxCollision, getHitbox, getAttackHitbox } from '../game/Collision';
import { ATTACK_DAMAGE, SKILL_DAMAGE } from '../constants';
import { drawBackground } from '../renderer/BackgroundRenderer';
import { drawGround } from '../renderer/GroundRenderer';
import { drawMech } from '../renderer/MechRenderer';
import { drawUI } from '../renderer/UIRenderer';
import { drawParticles } from '../renderer/ParticleRenderer';
import { createStars } from '../renderer/BackgroundRenderer';
import { useGameLoop } from './useGameLoop';
import { useInput } from './useInput';

export interface GameData {
  state: GameState;
  mech1: MechData;
  mech2: MechData;
  particles: Particle[];
  stars: Star[];
  screenShake: number;
  result: GameResult | null;
}

function createInitialGameData(): GameData {
  return {
    state: GameState.MENU,
    mech1: createMech(100, true),
    mech2: createMech(620, false),
    particles: [],
    stars: createStars(100),
    screenShake: 0,
    result: null,
  };
}

export function useGame(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const gameRef = useRef<GameData>(createInitialGameData());
  const keysRef = useInput();
  const { start, stop } = useGameLoop();

  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [result, setResult] = useState<GameResult | null>(null);

  const gameLoopRef = useRef<() => void>(() => {});

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = gameRef.current;
    ctx.imageSmoothingEnabled = false;

    ctx.save();

    if (game.screenShake > 0) {
      ctx.translate(
        Math.random() * game.screenShake - game.screenShake / 2,
        Math.random() * game.screenShake - game.screenShake / 2
      );
    }

    drawBackground(ctx, game.stars);
    drawGround(ctx);

    if (game.state === GameState.PLAYING || game.state === GameState.GAME_OVER) {
      drawMech(ctx, game.mech1);
      drawMech(ctx, game.mech2);
      drawUI(ctx, game.mech1, game.mech2);
    }

    drawParticles(ctx, game.particles);

    ctx.restore();
  }, [canvasRef]);

  const update = useCallback(() => {
    const game = gameRef.current;
    if (game.state !== GameState.PLAYING) return;

    const keys = keysRef.current;

    const result1 = updateMech(game.mech1, keys.p1, game.mech2);
    game.mech1 = result1.mech;
    game.particles.push(...result1.newParticles);

    const result2 = updateMech(game.mech2, keys.p2, game.mech1);
    game.mech2 = result2.mech;
    game.particles.push(...result2.newParticles);

    checkCollisions(game);

    game.particles = updateParticles(game.particles);

    if (game.screenShake > 0) game.screenShake--;

    if (game.mech1.hp <= 0) {
      game.state = GameState.GAME_OVER;
      game.result = {
        winner: 2,
        p1Stats: game.mech1.stats,
        p2Stats: game.mech2.stats,
      };
      setGameState(GameState.GAME_OVER);
      setResult(game.result);
    } else if (game.mech2.hp <= 0) {
      game.state = GameState.GAME_OVER;
      game.result = {
        winner: 1,
        p1Stats: game.mech1.stats,
        p2Stats: game.mech2.stats,
      };
      setGameState(GameState.GAME_OVER);
      setResult(game.result);
    }
  }, [keysRef]);

  const gameLoop = useCallback(() => {
    update();
    render();
  }, [update, render]);

  gameLoopRef.current = gameLoop;

  const startGame = useCallback(() => {
    gameRef.current = createInitialGameData();
    gameRef.current.state = GameState.PLAYING;
    setGameState(GameState.PLAYING);
    setResult(null);
  }, []);

  const showMenu = useCallback(() => {
    gameRef.current = createInitialGameData();
    gameRef.current.state = GameState.MENU;
    setGameState(GameState.MENU);
    setResult(null);
  }, []);

  const init = useCallback(() => {
    start(() => gameLoopRef.current());
  }, [start]);

  const destroy = useCallback(() => {
    stop();
  }, [stop]);

  return {
    gameRef,
    gameState,
    result,
    startGame,
    showMenu,
    init,
    destroy,
  };
}

function checkCollisions(game: GameData): void {
  if (game.mech1.hitboxActive && game.mech1.attackTimer > 5) {
    const attackBox = getAttackHitbox(game.mech1.x, game.mech1.y, game.mech1.facing);
    const targetBox = getHitbox(game.mech2.x, game.mech2.y);

    if (boxCollision(attackBox, targetBox)) {
      const damage = game.mech1.state === MechState.SKILL ? SKILL_DAMAGE : ATTACK_DAMAGE;
      const result = takeDamage(game.mech2, damage, game.mech1);
      game.mech2 = result.mech;
      if (result.attacker) game.mech1 = result.attacker;
      game.particles.push(...result.newParticles);
      game.mech1.hitboxActive = false;
      game.screenShake = 10;
    }
  }

  if (game.mech2.hitboxActive && game.mech2.attackTimer > 5) {
    const attackBox = getAttackHitbox(game.mech2.x, game.mech2.y, game.mech2.facing);
    const targetBox = getHitbox(game.mech1.x, game.mech1.y);

    if (boxCollision(attackBox, targetBox)) {
      const damage = game.mech2.state === MechState.SKILL ? SKILL_DAMAGE : ATTACK_DAMAGE;
      const result = takeDamage(game.mech1, damage, game.mech2);
      game.mech1 = result.mech;
      if (result.attacker) game.mech2 = result.attacker;
      game.particles.push(...result.newParticles);
      game.mech2.hitboxActive = false;
      game.screenShake = 10;
    }
  }
}
