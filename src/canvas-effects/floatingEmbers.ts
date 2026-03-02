import type { DrawContext } from "./index";

interface Particle {
  x: number;
  y: number;
  r: number; // 真实的半径大小
  vy: number; // 垂直上升速度
  vx: number; // 水平漂流速度 (风向)
  alpha: number; // 透明度
  decay: number; // 闪烁和消亡的概率
}

let particles: Particle[] = [];
let lastW = 0;
let lastH = 0;

/**
 * 获取主题颜色
 * @param theme 主题
 * @param defaultColor 默认颜色
 * @returns 颜色
 */
const getThemeColor = (theme?: string, defaultColor?: string) => {
  switch (theme) {
    case "warm":
      return { r: 255, g: 100, b: 50 }; // 篝火橙
    case "cool":
      return { r: 50, g: 150, b: 255 }; // 深海蓝
    case "cyber":
      return { r: 255, g: 0, b: 255 }; // 赛博粉
    default:
      return { r: 255, g: 255, b: 255 };
  }
};

export const drawFloatingEmbers = ({
  ctx,
  W,
  H,
  color,
  config,
}: DrawContext) => {
  if (!W || !H || !isFinite(W) || !isFinite(H)) return;
  const count = Number(config?.particleCount) || 50;
  const baseSpeed = Number(config?.speed) || 3;
  const baseSize = Number(config?.size) || 4;
  const theme = config?.theme || "warm";
  // --- 动态生成或修补宇宙 ---
  // 如果屏幕翻转了或者数量要求增加了，补充粒子！
  if (W !== lastW || H !== lastH || particles.length < count) {
    lastW = W;
    lastH = H;
    const diff = count - particles.length;
    for (let i = 0; i < diff; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H, // 初始时撒在全屏幕
        r: Math.random() * baseSize + 1,
        vy: (Math.random() * 0.5 + 0.5) * baseSpeed,
        vx: (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.015 + 0.005,
      });
    }
  }
  // 如果滑块把粒子数拉低了，直接砍掉多出来的宇宙渣滓
  if (particles.length > count) {
    particles.length = count;
  }

  const tc = getThemeColor(theme, color);
  ctx.save();

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    // 让粒子移动 (y 轴往上飘，x 轴左右摇摆)
    p.y -= p.vy;
    p.x += Math.sin(Date.now() * 0.001 + i) * p.vx; // 使用 Sin 函数制造完美随风摇曳
    p.alpha -= p.decay;
    if (p.y < 0 || p.alpha <= 0) {
      p.y = H + p.r;
      p.x = Math.random() * W;
      p.alpha = Math.random() * 0.8 + 0.2;
      p.vy = (Math.random() * 0.5 + 0.5) * baseSpeed;
    }
    // 画一颗发了光的高斯火星
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(${tc.r}, ${tc.g}, ${tc.b}, ${p.alpha})`;
    ctx.shadowColor = `rgba(${tc.r}, ${tc.g}, ${tc.b}, ${p.alpha})`;
    ctx.shadowBlur = p.r * 3; // 强光晕让它看起来像自发光

    ctx.fill();
  }
  ctx.restore();
};
