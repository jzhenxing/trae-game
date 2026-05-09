import type { GameResult } from '../types';

interface GameOverOverlayProps {
  result: GameResult;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOverOverlay({ result, onRestart, onMenu }: GameOverOverlayProps) {
  const winnerClass = result.winner === 1 ? 'p1' : 'p2';
  const winnerText = result.winner === 1 ? 'P1 WINS!' : 'P2 WINS!';

  return (
    <div className="overlay game-over-overlay">
      <div className={`victory-text ${winnerClass}`}>{winnerText}</div>
      <div className="game-stats">
        P1 伤害: {result.p1Stats.damageDealt} | 防御: {result.p1Stats.defendCount}
        <br />
        P2 伤害: {result.p2Stats.damageDealt} | 防御: {result.p2Stats.defendCount}
      </div>
      <div>
        <button className="btn btn-restart" onClick={onRestart}>
          PLAY AGAIN
        </button>
        <button className="btn btn-menu" onClick={onMenu}>
          MAIN MENU
        </button>
      </div>
    </div>
  );
}
