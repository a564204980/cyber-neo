import type { DrawContext } from "./index";

export const drawRgbGlitch = ({
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

  const intensity = Number(config?.intensity) || 5;
  const speed = Number(config?.speed) || 5;
  const style = config?.style || "chaotic";
  const safeFontSize = Number(fontSize) || 30;
  ctx.font = `bold ${safeFontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const baseColor = color || "white";

  const t = Date.now();

  // 速度越快，触发故障的阈值越低
  const threshold = 1.0 - speed * 0.08;
  const isGlitching = Math.random() > threshold; // 是否触发故障
  const lines = text.split("\n");
  const lineHeight = safeFontSize * 1.2;
  const totalHeight = lines.length * lineHeight;

  if (!isGlitching) {
    ctx.fillStyle = baseColor;
    lines.forEach((line, i) => {
      const y = textY - totalHeight / 2 + (i + 0.5) * lineHeight;
      ctx.fillText(line, textX, y);
    });
    return;
  }

  const offsetR = (Math.random() - 0.5) * intensity * 3;
  const offsetC = (Math.random() - 0.5) * intensity * 3;
  const shakeY = (Math.random() - 0.5) * intensity * 0.5;
  ctx.save();

  ctx.globalCompositeOperation = "screen"; // 叠加模式

  // 如果是狂暴或磁带机模式，把屏幕随意切几道口子，把那几行字推偏
  if (style === "chaotic" || style === "vhs") {
    const sliceCount = style === "chaotic" ? 2 : 5;

    for (let i = 0; i < sliceCount; i++) {
      const h = Math.random() * (safeFontSize * 0.5); // 切口的高度
      const y = textY - safeFontSize / 2 + Math.random() * safeFontSize; // 随机找行切
      const xShift = (Math.random() - 0.5) * intensity * 5; // 推开多远
      // 存下状态开始切割
      ctx.save();
      ctx.beginPath();
      // 在画布上挖一个长条形的矩形洞
      ctx.rect(0, y, W, h);
      ctx.clip(); // 💥 接下来画的所有东西，只有落在这个洞里的才看得见
      // 在洞里偏移着画白色主字，形成物理撕裂感
      ctx.translate(xShift, 0);
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      lines.forEach((line, j) => {
        const lineY = textY + shakeY - totalHeight / 2 + (j + 0.5) * lineHeight;
        ctx.fillText(line, textX, lineY);
      });
      ctx.globalAlpha = 1;
      ctx.restore(); // 还原刀口，准备切下一刀
    }

    // 红色通道错位层
    ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
    lines.forEach((line, i) => {
      const y = textY + shakeY - totalHeight / 2 + (i + 0.5) * lineHeight;
      ctx.fillText(line, textX + offsetR, y);
    });

    // 青色通道错位层（红青结合爆出纯白）
    ctx.fillStyle = "rgba(0, 255, 255, 0.9)";
    lines.forEach((line, i) => {
      const y = textY + shakeY - totalHeight / 2 + (i + 0.5) * lineHeight;
      ctx.fillText(line, textX - offsetC, y);
    });

    if (style === "vhs" && Math.random() > 0.5) {
      ctx.fillStyle = "rgba(255, 255, 255, " + Math.random() * 0.3 + ")";
      ctx.fillRect(
        0,
        textY + (Math.random() - 0.5) * safeFontSize,
        W,
        Number(intensity) * 0.2
      );
    }

    ctx.restore();
  }
};
