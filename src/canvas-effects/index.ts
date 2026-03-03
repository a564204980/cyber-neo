import { drawNeonFlow } from "./neonFlow";
import { drawNeonFlicker } from "./neonFlicker";
import { drawRgbGlitch } from "./rgbGlitch";
import {
  EmberTheme,
  FlowDirection,
  GlitchStyle,
  GridStyle,
  LineDashStyle,
  MatrixColorTheme,
} from "@/types/effect";
import { drawHollowPulse } from "./hollowPulse";
import { drawFloatingEmbers } from "./floatingEmbers";
import { drawMatrixRain } from "./matrixRain";
import { drawDynamicGrid } from "./dynamicGrid";
import { drawNeonBorder } from "./neonBorder";

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
  color?: string;
  rotation?: number; // 下拉旋转进度
  config: {
    speed: number; // 动画速度
    glowIntensity: number; // 光晕强度
    breathe?: boolean; // 是否开启明暗脉动/呼吸效果
    breatheSpeed?: number; // 脉动的频率速率
    colors?: string[]; // 自定义流光颜色组
    direction?: FlowDirection; // 流光方向
    intensity?: number; // 故障强度
    style?: GlitchStyle; // 故障风格
    baseWidth?: number; // 线条宽度
    pulseDistortion?: number; // 脉冲扭曲
    lineStyle?: LineDashStyle; // 描边虚实
    particleCount?: number; // 粒子数量
    size?: number; // 大小
    density?: number; // 列密度
    fontSize?: number; // 字符大小
    gridSize?: number; // 网格大小
    perspective?: number; // 透视强度
    colorTheme?: GridStyle | MatrixColorTheme; // 主色调风格
    dotCount?: number; // 圆点数量
    dotSize?: number; // 圆点大小
    cornerRadius?: number; // 圆角半径
    theme?: EmberTheme; // 主题
    color?: string; // 颜色
  };
}

export const effectDrawers: Record<string, (ctx: DrawContext) => void> = {
  "neon-flow": drawNeonFlow,
  "neon-flicker": drawNeonFlicker,
  "rgb-glitch": drawRgbGlitch,
  "hollow-pulse": drawHollowPulse,
  "floating-embers": drawFloatingEmbers,
  "matrix-rain": drawMatrixRain,
  "dynamic-grid": drawDynamicGrid,
  "neon-border": drawNeonBorder,
};
