export type TextEffectType = "none" | "neon-flow" | "neon-flicker"; // 文字特效类型
export type CanvasEffectType = "none" | "aurora"; // 背景特效类型
export type IntensityValue = number & { __brand: "Intensity" }; // 光晕强度
export type FlowDirection =
  | "horizontal"
  | "vertical"
  | "diagonal-down"
  | "diagonal-up"; // 流光方向

export interface NewoFlickerConfig {
  enabled: boolean;
  colors: string[];
  speed: number;
  glowIntensity: IntensityValue; // 光晕放大倍数
}

// 霓虹流光配置
export interface NeonFlowConfig {
  enabled: boolean;
  colors: string[]; // 循环颜色列表
  speed: number; // 速度滑块值
  glowIntensity: number; // 光晕强度
  opacity: number;
  breathe: boolean; // 是否开启呼吸脉动
  breatheSpeed: number; // 呼吸脉动速度
  direction: FlowDirection; // 流光方向
}

// 极地漫步
export interface AuroraConfig {
  enabled: boolean;
  colors: string[]; // 循环颜色列表
  speed: number; // 速度滑块值
  bandCount: number; // 光带数量
  opacity: number;
}
