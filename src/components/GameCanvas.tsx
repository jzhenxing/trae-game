import { useRef, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameState } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { StartOverlay } from './StartOverlay';
import { GameOverOverlay } from './GameOverOverlay';
import { Controls } from './Controls';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, result, startGame, showMenu, init, destroy } = useGame(canvasRef);

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
          <StartOverlay onStart={startGame} />
        )}

        {gameState === GameState.GAME_OVER && result && (
          <GameOverOverlay
            result={result}
            onRestart={startGame}
            onMenu={showMenu}
          />
        )}
      </div>

      <Controls />
    </div>
  );
}
