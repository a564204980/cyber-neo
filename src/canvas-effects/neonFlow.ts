/**
 * canvas特效绘制上下文
 */
export interface DrawContext {
  ctx: any;

  W: number; // 画布的实际宽度
  H: number; // 画布的实际高度
  fontSize: number; // 文字大小 (px)
  text: string; // 绘制文字
  offset: number; // 动画进度偏移量
  textX: number;
  textY: number;
  config: {
    speed: number; // 动画速度
    glowIntensity: number; // 光晕强度
    breathe: boolean; // 是否开启明暗脉动/呼吸效果
    breatheSpeed: number; // 脉动的频率速率
  };
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
  ctx.clearRect(0, 0, W, H); // 清除画布

  // 呼吸系数0.2-1.0
  const breathe = config.breathe
    ? 0.6 + 0.4 * Math.sin((Date.now() / 1000) * config.breatheSpeed)
    : 1;

  const baseHue = (offset * config.speed * 2) % 360; // 基础色相

  const textWidth = ctx.measureText(text).width;
  // 渐变方向
  const grad = ctx.createLinearGradient(
    textX - textWidth / 2,
    0,
    textX + textWidth / 2,
    0
  );
  for (let i = 0; i <= 8; i++) {
    grad.addColorStop(i / 8, `hsl(${(baseHue + i * 45) % 360}, 100%, 55%)`); // 渐变颜色
  }

  ctx.fillStyle = grad; // 填充颜色
  ctx.font = `bold ${fontSize + 2}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = `hsl(${baseHue}, 100%, 65%)`;
  ctx.shadowBlur = config.glowIntensity * 3 * breathe;
  ctx.globalAlpha = 0.7 + 0.3 * breathe;

  ctx.fillText(text, textX, textY);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  console.log("基础色相", baseHue);
};
