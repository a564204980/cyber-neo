import type { DrawContext } from "./index";

interface Particle {
  x: number;
  y: number;
  r: number; // 真实的半径大小
  vy: number; // 垂直上升速度
  vx: number; // 水平漂流速度 (风向)
  alpha: number; // 透明度
  decay: number; // 闪烁和消亡的概率
  rotation: number; // 旋转角度
  rotationSpeed: number; // 旋转速度
}

let particles: Particle[] = [];
let lastW = 0;
let lastH = 0;

/**
 * 将十六进制颜色转换为 RGB
 */
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
};

/**
 * 绘制五角星
 */
const drawStar = (
  ctx: any,
  x: number,
  y: number,
  r: number,
  rotation: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      Math.cos(((18 + i * 72) / 180) * Math.PI) * r,
      -Math.sin(((18 + i * 72) / 180) * Math.PI) * r
    );
    ctx.lineTo(
      Math.cos(((54 + i * 72) / 180) * Math.PI) * (r / 2),
      -Math.sin(((54 + i * 72) / 180) * Math.PI) * (r / 2)
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

/**
 * 绘制爱心
 */
const drawHeart = (
  ctx: any,
  x: number,
  y: number,
  r: number,
  rotation: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  const topY = -r * 0.5;
  ctx.moveTo(0, r);
  ctx.bezierCurveTo(-r * 1.5, topY, -r * 0.5, -r * 1.5, 0, -r * 0.5);
  ctx.bezierCurveTo(r * 0.5, -r * 1.5, r * 1.5, topY, 0, r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

/**
 * 绘制花瓣
 */
const drawPetal = (
  ctx: any,
  x: number,
  y: number,
  r: number,
  rotation: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-r, -r, -r, r, 0, r * 1.5);
  ctx.bezierCurveTo(r, r, r, -r, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

/**
 * 绘制雪花
 */
const drawSnow = (
  ctx: any,
  x: number,
  y: number,
  r: number,
  rotation: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r);
    ctx.moveTo(-r * 0.3, -r * 0.7);
    ctx.lineTo(0, -r * 0.5);
    ctx.lineTo(r * 0.3, -r * 0.7);
    ctx.rotate((60 * Math.PI) / 180);
  }
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = r * 0.2;
  ctx.stroke();
  ctx.restore();
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
  const tc = hexToRgb(config?.color || "#ffaa00");

  // --- 动态生成或修补粒子 ---
  if (W !== lastW || H !== lastH || particles.length < count) {
    lastW = W;
    lastH = H;
    const diff = count - particles.length;
    for (let i = 0; i < diff; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * baseSize + 1,
        vy: (Math.random() * 0.5 + 0.5) * baseSpeed,
        vx: (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.015 + 0.005,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      });
    }
  }

  // 如果滑块把粒子数拉低了，直接砍掉多出来的粒子
  if (particles.length > count) {
    particles.length = count;
  }

  ctx.save();

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    // 让粒子移动 (y 轴往上飘，x 轴左右摇摆)
    p.y -= p.vy;
    p.x += Math.sin(Date.now() * 0.001 + i) * p.vx; // 使用 Sin 函数制造完美随风摇曳
    p.alpha -= p.decay;
    p.rotation += p.rotationSpeed;

    // 如果粒子飘出屏幕顶部或者透明度耗尽，就把它放到屏幕底部
    if (p.y < 0 || p.alpha <= 0) {
      p.y = H + p.r;
      p.x = Math.random() * W; // 随机x轴位置
      p.alpha = Math.random() * 0.8 + 0.2; // 随机透明度
      p.vy = (Math.random() * 0.5 + 0.5) * baseSpeed; // 随机速度
      p.rotation = Math.random() * Math.PI * 2;
    }

    ctx.fillStyle = `rgba(${tc.r}, ${tc.g}, ${tc.b}, ${p.alpha})`;
    ctx.shadowColor = `rgba(${tc.r}, ${tc.g}, ${tc.b}, ${p.alpha})`;
    ctx.shadowBlur = p.r * 3; // 强光晕让它看起来像自发光

    const pattern = config?.pattern || "circle";
    switch (pattern) {
      case "star":
        drawStar(ctx, p.x, p.y, p.r, p.rotation);
        break;
      case "heart":
        drawHeart(ctx, p.x, p.y, p.r, p.rotation);
        break;
      case "petal":
        drawPetal(ctx, p.x, p.y, p.r, p.rotation);
        break;
      case "snow":
        drawSnow(ctx, p.x, p.y, p.r, p.rotation);
        break;
      default:
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }
  ctx.restore();
};
