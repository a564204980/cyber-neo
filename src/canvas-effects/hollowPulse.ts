import type { DrawContext } from "./index";

export const drawHollowPulse = ({
  ctx,
  W,
  H,
  fontSize,
  text,
  textX,
  textY,
  color,
  config,
}: DrawContext) => {
  if (!W || !H || !isFinite(W) || !isFinite(H)) return;

  const baseWidth = Number(config?.baseWidth) || 2;
  const pulseDistortion = Number(config?.pulseDistortion) || 5;
  const speed = Number(config?.speed) || 4;
  const lineStyle = config?.lineStyle || "solid";

  const themeColor = color || "#00ffff";

  const safeFontSize = Number(fontSize) || 30;
  ctx.font = `bold ${safeFontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const t = Date.now();
  const cycle = (t * speed * 0.002) % (Math.PI * 2);

  // 采用四次方运算：让波形变成“突然变大然后迅速回落”的心跳形态，而不是平缓的呼吸
  const heartbeat =
    Math.pow(Math.sin(cycle), 4) + Math.pow(Math.sin(cycle * 0.5), 8) * 0.5;

  // 动态线宽：底鼓敲击时线条骤然变粗
  const animatedLineWidth = baseWidth + heartbeat * pulseDistortion;

  ctx.save();

  // 根据字号大小计算断头，保证视觉比例完美
  if (lineStyle === "dashed") {
    ctx.setLineDash([safeFontSize * 0.2, safeFontSize * 0.1]); // 虚线
  } else if (lineStyle === "dotted") {
    ctx.setLineDash([baseWidth * 2, baseWidth * 3]); // 点
  } else {
    ctx.setLineDash([]); // solid 恢复连续的霓虹灯管
  }
  // 反向蠕动
  ctx.lineDashOffset = -(t * speed * 0.02);

  ctx.strokeStyle = themeColor;
  ctx.lineWidth = animatedLineWidth;
  ctx.lineJoin = "round";

  ctx.shadowColor = themeColor;
  ctx.shadowBlur = animatedLineWidth * 3;

  const lines = text.split("\n");
  const lineHeight = safeFontSize * 1.2;
  const totalHeight = lines.length * lineHeight;

  lines.forEach((line, i) => {
    const y = textY - totalHeight / 2 + (i + 0.5) * lineHeight;
    ctx.strokeText(line, textX, y);
  });

  if (heartbeat > 0.8) {
    // 利用globalAlpha填充
    ctx.globalAlpha = (heartbeat - 0.8) * 0.5;
    ctx.fillStyle = themeColor;
    lines.forEach((line, i) => {
      const y = textY - totalHeight / 2 + (i + 0.5) * lineHeight;
      ctx.fillText(line, textX, y);
    });
  }

  ctx.restore();
};
