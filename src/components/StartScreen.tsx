interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export function StartScreen({ onStart, highScore }: StartScreenProps) {
  return (
    <div className="overlay start-overlay">
      <div className="title-container">
        <h1 className="title">NEON</h1>
        <h1 className="title">STRIKER</h1>
      </div>
      <div className="high-score">
        <span className="label">HIGH SCORE</span>
        <span className="value">{highScore}</span>
      </div>
      <button className="btn btn-start" onClick={onStart}>
        START GAME
      </button>
      <div className="scanlines" />
    </div>
  );
}
