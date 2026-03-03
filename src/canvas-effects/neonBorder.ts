import type { DrawContext } from "./index";

/**
 * 解析颜色字符串为 [r, g, b] 数组
 * 支持 #rrggbb、#rgb 以及 hsla(h, s%, l%, a) / hsl(h, s%, l%) 格式
 */
const parseColor = (color: string): [number, number, number] => {
  if (!color || typeof color !== "string") return [255, 0, 230];

  // ── hsla / hsl ──
  const hslaMatch = color.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/
  );
  if (hslaMatch) {
    const h = parseFloat(hslaMatch[1]) / 360;
    const s = parseFloat(hslaMatch[2]) / 100;
    const l = parseFloat(hslaMatch[3]) / 100;
    // HSL → RGB
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
      Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      Math.round(hue2rgb(p, q, h) * 255),
      Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    ];
  }

  // ── hex ──
  const clean = color.replace("#", "");
  if (clean.length === 3) {
    return clean.split("").map((c) => parseInt(c + c, 16)) as [
      number,
      number,
      number
    ];
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }

  return [255, 0, 230]; // 默认粉紫
};

const progressToPoint = (
  p: number, // 0~1，整一圈的进度
  W: number,
  H: number,
  r: number, // 圆角半径
  pad: number // 距画布边缘的内边距
): { x: number; y: number } => {
  const x0 = pad + r; // 左直线起点 x
  const x1 = W - pad - r; // 右直线起点 x
  const y0 = pad + r; // 上直线起点 y
  const y1 = H - pad - r; // 下直线起点 y
  const top = x1 - x0; // 上边直线长度
  const right = y1 - y0; // 右边直线长度
  const bottom = x1 - x0; // 下边直线长度
  const left = y1 - y0; // 左边直线长度
  const total = top + right + bottom + left;
  const dist = (((p % 1) + 1) % 1) * total; // 当前走了多远
  if (dist < top) {
    return { x: x0 + dist, y: pad };
  } else if (dist < top + right) {
    return { x: W - pad, y: y0 + (dist - top) };
  } else if (dist < top + right + bottom) {
    return { x: x1 - (dist - top - right), y: H - pad };
  } else {
    return { x: pad, y: y1 - (dist - top - right - bottom) };
  }
};

export const drawNeonBorder = ({ ctx, W, H, offset, config }: DrawContext) => {
  if (!W || !H) return;
  const dotCount = Number(config?.dotCount) || 30;
  const dotSize = Number(config?.dotSize) || 5;
  const speed = Number(config?.speed) || 1.5;
  const glowIntensity = Number(config?.glowIntensity) || 15;
  const cornerRadius = Number(config?.cornerRadius) || 16;
  const colorHex = (config?.color as string) || "#ff003c";
  const [dr, dg, db] = parseColor(colorHex);
  const pad = dotSize + 2; // 圆点中心距边缘的距离，避免被裁切
  ctx.save();
  // 绘制流动圆点

  ctx.shadowBlur = glowIntensity * 1.5;
  ctx.shadowColor = `rgb(${dr}, ${dg}, ${db})`;
  const baseProgress = (offset * speed) / 1000; // 统一进度，每帧递增
  for (let i = 0; i < dotCount; i++) {
    const p = baseProgress + i / dotCount; // 每个圆点均匀分布在整圈上
    const { x, y } = progressToPoint(p, W, H, cornerRadius, pad);
    // 让每个圆点有轻微的大小脉动，增加"呼吸感"
    const pulse = 0.85 + 0.15 * Math.sin(offset * 0.05 + i * 0.8);
    const r = dotSize * pulse;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${dr}, ${dg}, ${db})`;
    ctx.fill();
  }
  ctx.restore();
};
