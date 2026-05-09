interface StartOverlayProps {
  onStart: () => void;
}

export function StartOverlay({ onStart }: StartOverlayProps) {
  return (
    <div className="overlay start-overlay">
      <h1 className="title">
        PIXEL MECHA<br />BATTLE
      </h1>
      <button className="btn btn-start" onClick={onStart}>
        START GAME
      </button>
    </div>
  );
}
