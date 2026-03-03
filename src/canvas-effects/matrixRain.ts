import type { DrawContext } from "./index";

let columns: number[] = []; // 列表
let cachedW = 0; // 缓存canvas宽度

const CHAR_POOL =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// 随机字符
const randomChar = () =>
  CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];

const themeColorMap: Record<
  string,
  { head: string; body: string; bg: string }
> = {
  green: {
    head: "#ffffff", // 最前端的字符：纯白高亮
    body: "#00ff41", // 拖尾主体：经典 Matrix 绿
    bg: "rgba(0, 0, 0, 0.15)", // 每帧覆盖的黑纱（现在只用来清理极旧的残影）
  },
  amber: {
    head: "#ffffff",
    body: "#ffb000", // 琥珀终端色
    bg: "rgba(0, 0, 0, 0.15)",
  },
  cyber: {
    head: "#ffffff",
    body: "#00f0ff", // 赛博冰蓝
    bg: "rgba(0, 0, 0, 0.15)",
  },
};

export const drawMatrixRain = ({ ctx, W, H, config }: DrawContext) => {
  if (!W || !H || !isFinite(W) || !isFinite(H)) return;
  const speed = Number(config?.speed) || 5;
  const density = Number(config?.density) || 20;
  const charSize = Number(config?.fontSize) || 14;
  const theme = config?.colorTheme || "green";

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

  const colors = themeColorMap[theme] || themeColorMap["green"];

  // 覆盖一层黑纱（比之前厚，让极旧的残影更快消退，视觉更干净）
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, RW, RH);

  ctx.font = `${charSize}px monospace`;
  ctx.textAlign = "center";

  // 每列显式绘制的字符数，用户要求至少 10 个
  const TAIL_LENGTH = 15;

  for (let i = 0; i < colCount; i++) {
    const x = i * density + density / 2; // 列中心 x 坐标
    const y = columns[i];

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = colors.head;
    ctx.shadowColor = colors.body;
    ctx.shadowBlur = charSize * 2;
    ctx.fillText(randomChar(), x, y);
    ctx.shadowBlur = 0;

    // 向上显式画 TAIL_LENGTH 个拖尾字符，透明度线性递减
    for (let j = 1; j <= TAIL_LENGTH; j++) {
      const tailY = y - j * charSize;
      // 越靠尾部越透明，从 0.9 线性降至接近 0
      const alpha = (1 - j / (TAIL_LENGTH + 1)) * 0.95;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = colors.body;
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
