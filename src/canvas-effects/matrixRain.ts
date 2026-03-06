import type { DrawContext } from "./index";

let columns: number[] = []; // 列表
let cachedW = 0; // 缓存canvas宽度

const CHAR_POOL =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// 随机字符
const randomChar = () =>
  CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];

/**
 * 将十六进制颜色转换为 RGBA，带透明度
 */
const hexToRgba = (hex: string, alpha: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${alpha})`
    : `rgba(255, 255, 255, ${alpha})`;
};

export const drawMatrixRain = ({ ctx, W, H, config }: DrawContext) => {
  if (!W || !H || !isFinite(W) || !isFinite(H)) return;
  const speed = Number(config?.speed) || 5;
  const density = Number(config?.density) || 20;
  const charSize = Number(config?.fontSize) || 14;
  const mainColor = config?.color || "#39ff14";

  const RW = W;
  const RH = H;

  const colCount = Math.floor(RW / density); // 列数

  // 初始化列状态
  if (RW !== cachedW || columns.length !== colCount) {
    cachedW = RW;
    columns = [];
    for (let i = 0; i < colCount; i++) {
      columns[i] = Math.random() * RH; // 随机初始Y位置
    }
  }

  // 覆盖一层黑纱
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, RW, RH);

  ctx.font = `${charSize}px monospace`;
  ctx.textAlign = "center";

  // 每列显式绘制的字符数，用户要求至少 10 个
  const TAIL_LENGTH = 15;

  for (let i = 0; i < colCount; i++) {
    const x = i * density + density / 2; // 列中心 x 坐标
    const y = columns[i];

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = charSize * 2;
    ctx.fillText(randomChar(), x, y);
    ctx.shadowBlur = 0;

    // 向上显式画 TAIL_LENGTH 个拖尾字符，透明度线性递减
    for (let j = 1; j <= TAIL_LENGTH; j++) {
      const tailY = y - j * charSize;
      // 越靠尾部越透明，从 0.9 线性降至接近 0
      const alpha = (1 - j / (TAIL_LENGTH + 1)) * 0.95;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = mainColor;
      ctx.fillText(randomChar(), x, tailY);
    }

    ctx.globalAlpha = 1.0;

    // 推进笔头位置
    columns[i] += charSize * (0.3 + speed * 0.12);

    //  超出画布底部后概率重置到顶
    if (columns[i] > RH && Math.random() > 0.975) {
      columns[i] = 0;
    }
  }
};
