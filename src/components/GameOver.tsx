interface GameOverProps {
  score: number;
  highScore: number;
  enemiesDestroyed: number;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({ score, highScore, enemiesDestroyed, onRestart, onMenu }: GameOverProps) {
  return (
    <div className="overlay game-over-overlay">
      <h1 className="game-over-title">GAME OVER</h1>
      <div className="stats">
        <div className="stat-row">
          <span className="label">SCORE</span>
          <span className="value score-value">{score}</span>
        </div>
        <div className="stat-row">
          <span className="label">HIGH SCORE</span>
          <span className="value">{highScore}</span>
        </div>
        <div className="stat-row">
          <span className="label">ENEMIES DESTROYED</span>
          <span className="value">{enemiesDestroyed}</span>
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-restart" onClick={onRestart}>
          RETRY
        </button>
        <button className="btn btn-menu" onClick={onMenu}>
          MENU
        </button>
      </div>
    </div>
  );
}
