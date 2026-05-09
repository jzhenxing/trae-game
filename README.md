# 霓虹战机 - NEON STRIKER 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────┐
│           React + TypeScript          │
│              Vite 构建                │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────┐ │
│  │ 组件层   │  │  Hooks 层         │ │
│  │ GameCanvas │ │ useGame          │ │
│  │ StartScreen│ │ useInput         │ │
│  │ GameOver  │  │ useGameLoop      │ │
│  └──────────┘  └──────────────────┘ │
├─────────────────────────────────────┤
│  ┌──────────────────────────────────┐│
│  │          游戏逻辑层                ││
│  │ Player │ Enemy │ Bullet │Particle││
│  └──────────────────────────────────┘│
├─────────────────────────────────────┤
│  ┌──────────────────────────────────┐│
│  │         Canvas 2D 渲染层           ││
│  │ Background │ Entity │ UI         ││
│  └──────────────────────────────────┘│
└─────────────────────────────────────┘
```

## 2. 技术选型

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18+ | UI 框架 |
| TypeScript | 5+ | 类型安全 |
| Vite | 5+ | 构建工具 |
| Canvas 2D | - | 游戏渲染 |
| requestAnimationFrame | - | 游戏循环 |

## 3. 目录结构

```
src/
├── components/          # React 组件
│   ├── GameCanvas.tsx   # 游戏画布容器
│   ├── StartScreen.tsx  # 开始界面
│   ├── GameOver.tsx     # 游戏结束界面
│   └── HUD.tsx          # 分数/HP 显示
├── game/                # 游戏逻辑
│   ├── Player.ts        # 玩家战机逻辑
│   ├── Enemy.ts         # 敌机逻辑
│   ├── Bullet.ts        # 子弹逻辑
│   ├── Collision.ts     # 碰撞检测
│   └── Particle.ts      # 粒子系统
├── renderer/            # Canvas 渲染
│   ├── drawPlayer.ts    # 绘制玩家
│   ├── drawEnemy.ts     # 绘制敌机
│   ├── drawBullet.ts    # 绘制子弹
│   ├── drawBackground.ts # 绘制背景
│   └── drawParticle.ts  # 绘制粒子
├── hooks/               # React Hooks
│   ├── useGame.ts       # 游戏状态管理
│   ├── useInput.ts      # 输入处理
│   └── useGameLoop.ts   # 游戏循环
├── constants/           # 常量配置
│   └── index.ts         # 游戏参数
└── types/               # TypeScript 类型
    └── index.ts         # 类型定义
```

## 4. 核心数据结构

```typescript
interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  speed: number;
  lastShotTime: number;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  speed: number;
  type: 'normal' | 'boss';
  lastShotTime: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isPlayerBullet: boolean;
  damage: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

type GameState = 'menu' | 'playing' | 'gameover';
```

## 5. 游戏循环

```
requestAnimationFrame
    ↓
update() - 更新所有游戏实体
    ├── 更新玩家位置
    ├── 更新敌机位置
    ├── 更新子弹位置
    ├── 碰撞检测
    ├── 生成新敌机
    └── 更新分数/HP
    ↓
render() - 渲染所有游戏实体
    ├── 绘制背景
    ├── 绘制敌机
    ├── 绘制玩家
    ├── 绘制子弹
    ├── 绘制粒子
    └── 绘制 HUD
    ↓
requestAnimationFrame ← 循环
```

## 6. 输入处理

- **桌面端**：WASD 或方向键移动，空格键射击
- **移动端**：触摸拖拽控制移动，自动射击
- 所有输入通过 `useInput` hook 统一管理
