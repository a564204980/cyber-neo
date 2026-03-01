import type { DrawContext } from "./index";

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

  const speed = Number(config?.speed) || 1;
  const glowIntensity = Number(config?.glowIntensity) || 5;
  const breatheSpeed = Number(config?.breatheSpeed) || 1;
  const breatheEnabled = !!config?.breathe;

  // 呼吸系数 0.2-1.0
  const breathe = breatheEnabled
    ? 0.6 + 0.4 * Math.sin((Date.now() / 1000) * breatheSpeed)
    : 1;

  const rawHue = (offset * speed * 2) % 360;
  const baseHue = isFinite(rawHue) ? Math.round(rawHue) : 0;

  // font必须在measureText之前设置
  const safeFontSize = Number(fontSize) || 30;
  ctx.font = `bold ${safeFontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  for (let i = 0; i <= 8; i++) {
    const hue = Math.round((baseHue + i * 45) % 360);
    grad.addColorStop(i / 8, hslToRgb(hue, 100, 55));
  }

  ctx.fillStyle = grad;
  ctx.shadowColor = hslToRgb(baseHue, 100, 65);
  ctx.shadowBlur = glowIntensity * 3 * breathe;
  ctx.globalAlpha = 0.7 + 0.3 * breathe;

  ctx.fillText(text, textX, textY);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
};
