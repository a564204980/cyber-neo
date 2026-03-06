import type { DrawContext } from "./index";

let offsetZ = 0;

// 移除固定主题，改为使用配置颜色

export const drawDynamicGrid = ({ ctx, W, H, config }: DrawContext) => {
  if (!W || !H || !isFinite(W) || !isFinite(H)) return;
  const speed = Number(config?.speed) || 5;
  const gridSize = Number(config?.gridSize) || 40;
  const perspective = Number(config?.perspective) || 120;
  const glowIntensity = Number(config?.glowIntensity) || 10;
  const mainColor = config?.color || "#cc00ff";

  // 铺设暗色拖影背景，形成赛博纵深感
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  // 设置地平线位置为屏幕中上部
  const horizonY = H * 0.4;

  // 建立发光效果
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 1;
  if (glowIntensity > 0) {
    ctx.shadowBlur = glowIntensity;
    ctx.shadowColor = mainColor;
  }
  ctx.beginPath();

  const vanishPointX = W / 2;
  const xLinesCount = Math.floor(W / gridSize) * 2;
  const startX = W / 2 - (xLinesCount / 2) * gridSize;

  // flatTopY：纵线截止的 y 坐标（高于此处用黑色盖住）
  // t = 截止比例，0 = 底部(y=H)，1 = 地平线(y=horizonY)
  const flatTopY = horizonY + (H - horizonY) * 0.3; // 取地平线以下 30% 处截断
  const t = (H - flatTopY) / (H - horizonY); // perspective 插值系数

  for (let i = 0; i <= xLinesCount; i++) {
    const bottomX = startX + i * gridSize;
    // 在 flatTopY 处，此纵线对应的 x 坐标（向消失点插值 t 比例）
    const topX = bottomX + (vanishPointX - bottomX) * t;
    ctx.moveTo(bottomX, H);
    ctx.lineTo(topX, flatTopY);
  }

  offsetZ += speed * 0.5;
  if (offsetZ >= gridSize) offsetZ = 0;

  const zLinesCount = 30;
  for (let i = 0; i < zLinesCount; i++) {
    const z = i * gridSize - offsetZ;
    if (z <= 1) continue;
    const distanceOffset = (perspective * H) / z;
    const y = horizonY + distanceOffset;
    if (y > H || y < flatTopY) continue; // 只画 flatTopY ~ H 之间的横线
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();

  // 遮盖 flatTopY 以上区域（黑色，关闭 shadowBlur 防止光晕泄漏）
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, flatTopY);

  ctx.restore();
};
