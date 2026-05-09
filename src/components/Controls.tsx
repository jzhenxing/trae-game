export function Controls() {
  return (
    <div className="controls">
      <div className="control-panel p1">
        <h3>PLAYER 1</h3>
        <div><span className="key">A</span><span className="key">D</span> 移动</div>
        <div><span className="key">W</span> 跳跃</div>
        <div><span className="key">J</span> 攻击</div>
        <div><span className="key">K</span> 防御</div>
        <div><span className="key">L</span> 技能</div>
      </div>
      <div className="control-panel p2">
        <h3>PLAYER 2</h3>
        <div><span className="key">←</span><span className="key">→</span> 移动</div>
        <div><span className="key">↑</span> 跳跃</div>
        <div><span className="key">1</span> 攻击</div>
        <div><span className="key">2</span> 防御</div>
        <div><span className="key">3</span> 技能</div>
      </div>
    </div>
  );
}
