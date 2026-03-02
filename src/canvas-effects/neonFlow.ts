import type { DrawContext } from "./index";

/** 辅助函数：十六进制颜色转rgb数组 */
function hexToRgbArr(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 255, 255]; // 默认白色
}

/** 辅助函数：计算在两个颜色（及其数组）之间的线性插值 */
function getLinearGradientColor(colors: string[], phase: number): string {
  if (!colors || colors.length === 0) return "rgb(255,255,255)";
  if (colors.length === 1) return colors[0];

  const totalSegments = colors.length;
  // 确保相位的循环性并通过数组长度放大
  const scaled = (Math.abs(phase) % 1.0) * totalSegments;

  const index1 = Math.floor(scaled) % colors.length;
  const index2 = (index1 + 1) % colors.length;
  const ratio = scaled - Math.floor(scaled);

  const [r1, g1, b1] = hexToRgbArr(colors[index1]);
  const [r2, g2, b2] = hexToRgbArr(colors[index2]);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `rgb(${r},${g},${b})`;
}

/** 手动转换为rgb() */
function hslToRgb(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `rgb(${Math.round(f(0) * 255)},${Math.round(f(8) * 255)},${Math.round(
    f(4) * 255
  )})`;
}

/**
 * 绘制霓虹流光特效
 * @param ctx 绘图上下文
 * @param W 画布宽度
 * @param H 画布高度
 * @param fontSize 字体大小
 * @param text 文本内容
 * @param textX 文本x坐标
 * @param textY 文本y坐标
 * @param offset 偏移量
 * @param config 配置项
 */
export const drawNeonFlow = ({
  ctx,
  W,
  H,
  fontSize,
  text,
  textX,
  textY,
  offset,
  config,
}: DrawContext) => {
  if (!W || !H || !isFinite(W) || !isFinite(H)) return;

  const speed = Number(config?.speed) || 1; // 流动速度
  const glowIntensity = Number(config?.glowIntensity) || 5; // 光晕强度
  const breatheSpeed = Number(config?.breatheSpeed) || 1; // 呼吸速度
  const breatheEnabled = !!config?.breathe; // 是否启用呼吸
  const customColors =
    config?.colors && config.colors.length > 0 ? config.colors : null; // 自定义颜色

  // 呼吸系数 0.2-1.0
  const breathe = breatheEnabled
    ? 0.6 + 0.4 * Math.sin((Date.now() / 1000) * breatheSpeed)
    : 1;

  // 字体设置
  const safeFontSize = Number(fontSize) || 30;
  ctx.font = `bold ${safeFontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const direction = config?.direction || "horizontal";

  let x0 = 0,
    y0 = 0;
  let x1 = 0,
    y1 = 0;

  switch (direction) {
    case "horizontal":
      x0 = 0;
      y0 = 0;
      x1 = W;
      y1 = 0;
      break;
    case "vertical":
      // X 居中对齐，Y 从顶部流到底部
      x0 = W / 2;
      y0 = 0;
      x1 = W / 2;
      y1 = H;
      break;
    case "diagonal-down":
      // 经典的赛博朋克警报扫描角：从左上一直扫到右下
      x0 = 0;
      y0 = 0;
      x1 = W;
      y1 = H;
      break;
    case "diagonal-up":
      // 从左下斜刺到右上角
      x0 = 0;
      y0 = H;
      x1 = W;
      y1 = 0;
      break;
  }

  // 渐变
  const grad = ctx.createLinearGradient(x0, y0, x1, y1); // x0,y0左边，x1,y1右边

  if (customColors) {
    // 【自定义颜色模式】: 利用预设 Hex 色组并控制光站相对滑动，模拟流光流动
    // 全局随时间推移的流逝比率
    const globalPhase = (offset * speed * 0.005) % 1;

    for (let i = 0; i <= 10; i++) {
      const stopPos = i / 10;
      let currentPhase = (stopPos - globalPhase) % 1.0;
      if (currentPhase < 0) currentPhase += 1.0;

      grad.addColorStop(
        stopPos,
        getLinearGradientColor(customColors, currentPhase)
      );
    }

    ctx.shadowColor = customColors[0]; // 发光取主色
    ctx.shadowBlur = glowIntensity * 10 * breathe; // 光晕的扩散半径
  } else {
    const rawHue = (offset * speed * 2) % 360;
    const baseHue = isFinite(rawHue) ? Math.round(rawHue) : 0;

    for (let i = 0; i <= 8; i++) {
      const hue = Math.round((baseHue + i * 45) % 360);
      grad.addColorStop(i / 8, hslToRgb(hue, 100, 55));
    }
    ctx.shadowColor = hslToRgb(baseHue, 100, 65);
  }

  ctx.fillStyle = grad;
  ctx.shadowBlur = glowIntensity * 3 * breathe;
  ctx.globalAlpha = 0.7 + 0.3 * breathe;

  ctx.fillText(text, textX, textY);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
};
