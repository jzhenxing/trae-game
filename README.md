# 像素风机甲对战游戏 - 技术架构文档

## 1. 项目架构

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                    游戏入口 (index.html)              │
├─────────────────────────────────────────────────────┤
│                   游戏主控制器 (Game)                 │
│  ┌─────────────┬──────────────┬──────────────────┐  │
│  │ 状态管理器   │ 渲染引擎     │ 物理引擎          │  │
│  │ (State)     │ (Renderer)  │ (Physics)        │  │
│  └─────────────┴──────────────┴──────────────────┘  │
│  ┌─────────────┬──────────────┬──────────────────┐  │
│  │ 输入处理     │ 音效管理     │ 动画控制器         │  │
│  │ (Input)     │ (Audio)     │ (Animation)      │  │
│  └─────────────┴──────────────┴──────────────────┘  │
├─────────────────────────────────────────────────────┤
│                     游戏实体层                        │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │    机甲 A (P1)   │  │    机甲 B (P2)   │          │
│  │  - 位置/速度     │  │  - 位置/速度     │          │
│  │  - 生命值/能量   │  │  - 生命值/能量   │          │
│  │  - 状态机       │  │  - 状态机       │          │
│  │  - 动画帧       │  │  - 动画帧       │          │
│  └──────────────────┘  └──────────────────┘          │
├─────────────────────────────────────────────────────┤
│                     场景层                           │
│  ┌─────────────┬──────────────┬──────────────────┐  │
│  │   背景渲染   │   地面渲染    │   特效层          │  │
│  └─────────────┴──────────────┴──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 1.2 技术栈

- **渲染技术**：HTML5 Canvas 2D
- **动画循环**：RequestAnimationFrame
- **输入处理**：KeyboardEvent 事件监听
- **音效**：Web Audio API（可选）

## 2. 核心模块设计

### 2.1 游戏主循环 (Game Loop)

```javascript
class Game {
  // 60 FPS 主循环
  update(deltaTime) {
    this.handleInput();
    this.updatePhysics(deltaTime);
    this.checkCollisions();
    this.updateAnimations(deltaTime);
    this.updateUI();
  }

  render() {
    this.clearCanvas();
    this.drawBackground();
    this.drawMechs();
    this.drawEffects();
    this.drawUI();
  }
}
```

### 2.2 机甲实体 (Mech)

```javascript
class Mech {
  // 属性
  x, y           // 位置
  vx, vy         // 速度
  hp, sp         // 生命值、能量值
  state          // 状态：idle/move/attack/defend/hurt/dead
  facing         // 朝向：left/right
  animationFrame // 当前动画帧

  // 方法
  update(deltaTime)
  handleInput(keys)
  attack(target)
  defend()
  takeDamage(amount)
  draw(ctx)
}
```

### 2.3 状态机设计

```
待机 (idle) ──┬── 移动 (move) ──→ 待机
              │
              ├── 攻击 (attack) ──→ 待机
              │
              ├── 防御 (defend) ──→ 待机
              │
              └── 受伤 (hurt) ──→ 待机

待机/移动/攻击/防御 + 生命值归零 → 死亡 (dead)
```

### 2.4 碰撞检测

```javascript
// 矩形碰撞检测
function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}
```

## 3. 像素渲染配置

```javascript
// Canvas 像素化配置
const PIXEL_SCALE = 4; // 像素放大倍数
ctx.imageSmoothingEnabled = false; // 禁用抗锯齿

// 颜色配置
const COLORS = {
  background: '#0a0a12',
  ground: '#1a1a2e',
  grid: '#00d4ff',
  mechAPrimary: '#ff3366',
  mechASecondary: '#ff6b6b',
  mechBPrimary: '#00d4ff',
  mechBSecondary: '#00ffff',
  hpBar: '#ff3366',
  spBar: '#00d4ff',
  damage: '#ffff00'
};
```

## 4. 像素机甲绘制

使用 Canvas 路径绘制像素风格机甲：

```
机甲 A (突击型) - 红色系
    ■■■■■          头部
  ■■■■■■■■        躯干
    ■■■■          核心
  ■■■■■■■■■■      腿部
    ■  ■          脚部

机甲 B (防御型) - 蓝色系
  ■■■■■■■■        头部(更大)
■■■■■■■■■■■       躯干(更宽)
  ■■■■■■■■        核心
■■■■■■■■■■■■■     腿部(更粗)
  ■■■■  ■■■■      脚部(更稳)
```

## 5. 输入映射

| 功能 | 玩家1 | 玩家2 |
|------|-------|-------|
| 左移 | A | ArrowLeft |
| 右移 | D | ArrowRight |
| 跳跃 | W | ArrowUp |
| 攻击 | J | Numpad1 |
| 防御 | K | Numpad2 |
| 技能 | L | Numpad3 |

## 6. 文件结构

```
/workspace/
├── index.html          # 游戏入口
├── SPEC.md             # 产品需求文档
├── README.md           # 技术架构文档（本文档）
└── (所有代码内联在 index.html 中)
```

## 7. 性能优化策略

1. **双缓冲渲染**：使用离屏 Canvas 预渲染静态元素
2. **脏矩形更新**：仅重绘变化区域
3. **对象池**：复用粒子和特效对象
4. **节流输入**：输入事件使用 requestAnimationFrame 同步

## 8. 浏览器兼容

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
