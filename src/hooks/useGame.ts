import { useRef, useCallback, useState } from 'react';
import type { Player, Enemy, Bullet, Particle, Star, GameStats, GameState } from '../types';
import { GameState as GS } from '../types';
import { createPlayer, updatePlayer, damagePlayer, canPlayerShoot, updatePlayerShootTime } from '../game/Player';
import { createEnemy, createBoss, updateEnemy, isEnemyOffScreen } from '../game/Enemy';
import { createPlayerBullet, createEnemyBullet, updateBullet, isBulletOffScreen } from '../game/Bullet';
import { createExplosion, createThrustParticle, updateParticles } from '../game/Particle';
import { updateStars } from '../renderer/BackgroundRenderer';
import { checkPlayerBulletEnemyCollision, checkEnemyBulletPlayerCollision, checkEnemyPlayerCollision } from '../game/Collision';
import {
  INITIAL_SPAWN_INTERVAL,
  MIN_SPAWN_INTERVAL,
  SPAWN_DECREASE_SCORE,
  SPAWN_DECREASE_AMOUNT,
  ENEMY_SCORE,
  BOSS_SPAWN_SCORE,
  BOSS_SCORE,
  PLAYER_SHOOT_INTERVAL,
  ENEMY_SHOOT_INTERVAL,
  CANVAS_WIDTH,
  COLORS,
} from '../constants';
import { drawBackground } from '../renderer/BackgroundRenderer';
import { drawPlayer } from '../renderer/PlayerRenderer';
import { drawEnemy } from '../renderer/EnemyRenderer';
import { drawBullet } from '../renderer/BulletRenderer';
import { drawParticle } from '../renderer/ParticleRenderer';
import { drawHUD } from '../renderer/HUDRenderer';
import { useGameLoop } from './useGameLoop';
import { useTouchInput } from './useTouchInput';

export interface GameData {
  state: GameState;
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  particles: Particle[];
  stars: Star[];
  stats: GameStats;
  spawnTimer: number;
  lastBossScore: number;
  screenShake: number;
}

function createInitialGameData(): GameData {
  return {
    state: GS.MENU,
    player: createPlayer(),
    enemies: [],
    bullets: [],
    particles: [],
    stars: [],
    stats: { score: 0, highScore: parseInt(localStorage.getItem('neonStrikerHighScore') || '0'), enemiesDestroyed: 0 },
    spawnTimer: 0,
    lastBossScore: 0,
    screenShake: 0,
  };
}

export function useGame(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  touchStateRef?: React.MutableRefObject<{ x: number; y: number }>
) {
  const gameRef = useRef<GameData>(createInitialGameData());
  const touchRef = useTouchInput({
    onDirectionChange: (dir) => {
      if (touchStateRef) {
        touchStateRef.current = dir;
      }
    },
  });
  const { start, stop } = useGameLoop();

  const [gameState, setGameState] = useState<GameState>(GS.MENU);
  const [stats, setStats] = useState<GameStats>({ score: 0, highScore: 0, enemiesDestroyed: 0 });

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
      game.screenShake--;
    }

    drawBackground(ctx, game.stars);

    for (const enemy of game.enemies) {
      drawEnemy(ctx, enemy);
    }

    if (game.state === GS.PLAYING || game.state === GS.GAME_OVER) {
      drawPlayer(ctx, game.player);
      drawHUD(ctx, game.player, game.stats);
    }

    for (const bullet of game.bullets) {
      drawBullet(ctx, bullet);
    }

    for (const particle of game.particles) {
      drawParticle(ctx, particle);
    }

    ctx.restore();
  }, [canvasRef]);

  const update = useCallback(() => {
    const game = gameRef.current;
    if (game.state !== GS.PLAYING) return;

    const touch = touchRef.current;
    const now = Date.now();

    const keys = {
      left: touch.x < -0.3,
      right: touch.x > 0.3,
      up: touch.y < -0.3,
      down: touch.y > 0.3,
      shoot: true,
    };

    game.player = updatePlayer(game.player, keys);

    if (Math.random() < 0.3) {
      game.particles.push(...createThrustParticle(
        game.player.x + game.player.width / 2,
        game.player.y + game.player.height
      ));
    }

    if (canPlayerShoot(game.player, now, PLAYER_SHOOT_INTERVAL)) {
      game.player = updatePlayerShootTime(game.player, now);
      game.bullets.push(
        createPlayerBullet(
          game.player.x + game.player.width / 2,
          game.player.y
        )
      );
    }

    game.spawnTimer++;
    const spawnInterval = Math.max(
      MIN_SPAWN_INTERVAL / 16.67,
      (INITIAL_SPAWN_INTERVAL - Math.floor(game.stats.score / SPAWN_DECREASE_SCORE) * SPAWN_DECREASE_AMOUNT) / 16.67
    );

    if (game.spawnTimer >= spawnInterval) {
      game.spawnTimer = 0;
      const spawnX = 40 + Math.random() * (CANVAS_WIDTH - 80);
      game.enemies.push(createEnemy(spawnX));
    }

    if (game.stats.score - game.lastBossScore >= BOSS_SPAWN_SCORE) {
      game.lastBossScore = game.stats.score;
      game.enemies.push(createBoss());
      game.screenShake = 15;
    }

    game.enemies = game.enemies
      .map((e) => {
        let enemy = updateEnemy(e);
        if (enemy.type === 'boss' && enemy.y >= 60) {
          enemy.y = 60;
        }
        return enemy;
      })
      .filter((e) => !isEnemyOffScreen(e));

    game.bullets = game.bullets.map(updateBullet).filter((b) => !isBulletOffScreen(b));

    for (const bullet of game.bullets) {
      if (bullet.isPlayerBullet) {
        for (const enemy of game.enemies) {
          if (checkPlayerBulletEnemyCollision(bullet, enemy)) {
            bullet.y = -100;
            enemy.hp -= bullet.damage;
            game.particles.push(...createExplosion(bullet.x, bullet.y, COLORS.accent, 5));

            if (enemy.hp <= 0) {
              enemy.hp = 0;
              const score = enemy.type === 'boss' ? BOSS_SCORE : ENEMY_SCORE;
              game.stats.score += score;
              game.stats.enemiesDestroyed++;
              if (game.stats.score > game.stats.highScore) {
                game.stats.highScore = game.stats.score;
                localStorage.setItem('neonStrikerHighScore', String(game.stats.score));
              }
              setStats({ ...game.stats });
              game.particles.push(...createExplosion(
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                enemy.type === 'boss' ? COLORS.accent : COLORS.secondary,
                enemy.type === 'boss' ? 30 : 15
              ));
              game.screenShake = enemy.type === 'boss' ? 20 : 8;
            }
          }
        }
      } else {
        if (!game.player.invincible && checkEnemyBulletPlayerCollision(bullet, game.player)) {
          bullet.y = 800;
          game.player = damagePlayer(game.player);
          game.particles.push(...createExplosion(
            game.player.x + game.player.width / 2,
            game.player.y + game.player.height / 2,
            COLORS.hpLow,
            10
          ));
          game.screenShake = 12;

          if (game.player.hp <= 0) {
            game.state = GS.GAME_OVER;
            setGameState(GS.GAME_OVER);
          }
        }
      }
    }

    for (const enemy of game.enemies) {
      if (!game.player.invincible && checkEnemyPlayerCollision(enemy, game.player)) {
        game.player = damagePlayer(game.player);
        game.particles.push(...createExplosion(
          game.player.x + game.player.width / 2,
          game.player.y + game.player.height / 2,
          COLORS.hpLow,
          10
        ));
        game.screenShake = 15;

        if (game.player.hp <= 0) {
          game.state = GS.GAME_OVER;
          setGameState(GS.GAME_OVER);
        }
      }

      if (now - enemy.lastShotTime > ENEMY_SHOOT_INTERVAL && enemy.y > 0 && enemy.y < 600) {
        enemy.lastShotTime = now;
        game.bullets.push(
          createEnemyBullet(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height,
            game.player.x + game.player.width / 2,
            game.player.y + game.player.height / 2
          )
        );
      }
    }

    game.enemies = game.enemies.filter((e) => e.hp > 0);
    game.particles = updateParticles(game.particles);
    game.stars = updateStars(game.stars);
  }, [touchRef]);

  const gameLoop = useCallback(() => {
    update();
    render();
  }, [update, render]);

  gameLoopRef.current = gameLoop;

  const startGame = useCallback(() => {
    gameRef.current = createInitialGameData();
    gameRef.current.state = GS.PLAYING;
    setGameState(GS.PLAYING);
    setStats({ ...gameRef.current.stats });
  }, []);

  const showMenu = useCallback(() => {
    gameRef.current = createInitialGameData();
    gameRef.current.state = GS.MENU;
    setGameState(GS.MENU);
    setStats({ ...gameRef.current.stats });
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
    stats,
    startGame,
    showMenu,
    init,
    destroy,
  };
}
