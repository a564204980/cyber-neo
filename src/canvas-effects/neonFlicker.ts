import type { DrawContext } from "./index";

// 十六进制颜色转rgb
const hexToRgbArr = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 0, 50]; // 默认暴力红
};

/**
 * 绘制霓虹闪烁特效
 */
export const drawNeonFlicker = ({
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

  const speed = Number(config?.speed) || 1;
  const glowIntensity = Number(config?.glowIntensity) || 5;
  const colors =
    Array.isArray(config?.colors) && config.colors.length > 0
      ? config.colors
      : ["#FF0000", "#0000FF"];

  const safeFontSize = Number(fontSize) || 30;
  ctx.font = `bold ${safeFontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 生成不规则的闪烁
  const t = Date.now();
  const cycle = (t * speed * 0.005) % (Math.PI * 2);
  const wave = Math.sin(cycle) + Math.sign(cycle * 2.5);
  const colorIndex = Math.floor((cycle / (Math.PI * 2)) * colors.length);
  const currentColorHex = colors[colorIndex] || colors[0];
  const [r, g, b] = hexToRgbArr(currentColorHex);

  let brightness = 1.0;
  if (wave < -1.0) {
    // 波谷极低：电源几乎切断
    // 有 50% 的几率微亮(残红)，50%完全黑掉
    brightness = Math.random() > 0.5 ? 0.2 : 0.0;
  } else if (wave < 0) {
    // 电流不稳区：疯狂抽搐
    // 大多数时候维持一点亮度，偶尔瞬间爆亮闪一下
    brightness = Math.random() > 0.8 ? 1.0 : 0.4;
  } else if (wave > 1.0) {
    // 波峰极高：电源过载
    // 保持高亮，但略微削弱，避免过曝
    brightness = 0.8 + Math.random() * 0.2;
  } else {
    // 正常波动：稳定发光
    brightness = 0.6 + Math.random() * 0.4;
  }

  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
  ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${brightness > 0.5 ? 1 : 0.1})`;
  ctx.shadowBlur = glowIntensity * 5 * brightness;

  // 全局明暗叠加
  ctx.globalAlpha = brightness;

  const lines = text.split("\n");
  const lineHeight = safeFontSize * 1.2;
  const totalHeight = lines.length * lineHeight;

  lines.forEach((line, i) => {
    const y = textY - totalHeight / 2 + (i + 0.5) * lineHeight;
    ctx.fillText(line, textX, y);
  });

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
};
