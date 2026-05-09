import { useRef, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameState } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { StartScreen } from './StartScreen';
import { GameOver } from './GameOver';
import { Joystick } from './Joystick';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStateRef = useRef({ x: 0, y: 0 });

  const { gameState, stats, startGame, showMenu, init, destroy } = useGame(canvasRef, touchStateRef);

  useEffect(() => {
    init();
    return () => destroy();
  }, [init, destroy]);

  return (
    <div className="game-wrapper">
      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />

        {gameState === GameState.MENU && (
          <StartScreen onStart={startGame} highScore={stats.highScore} />
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOver
            score={stats.score}
            highScore={stats.highScore}
            enemiesDestroyed={stats.enemiesDestroyed}
            onRestart={startGame}
            onMenu={showMenu}
          />
        )}

        {gameState === GameState.PLAYING && (
          <Joystick direction={touchStateRef.current} />
        )}
      </div>
    </div>
  );
}
