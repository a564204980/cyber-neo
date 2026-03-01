import { drawNeonFlow } from "./neonFlow";
// import { drawNeonFlicker } from "./neonFlicker";

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

export const effectDrawers: Record<string, (ctx: DrawContext) => void> = {
  "neon-flow": drawNeonFlow,
  // "neon-flicker": drawNeonFlicker,
};
