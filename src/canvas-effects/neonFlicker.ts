import type { DrawContext } from "./index";

// 十六进制颜色转rgb
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 0, 50]; // 默认红色
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
};
