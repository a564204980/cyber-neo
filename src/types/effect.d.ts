export type TextEffectType =
  | "none"
  | "neon-flow"
  | "neon-flicker"
  | "rgb-glitch"
  | "hollow-pulse"; // 文字特效类型
export type CanvasEffectType = "none" | "aurora" | "floating-embers"; // 背景特效类型
export type FlowDirection =
  | "horizontal"
  | "vertical"
  | "diagonal-down"
  | "diagonal-up"; // 流光方向
export type GlitchStyle = "subtle" | "chaotic" | "vhs"; // 故障风格 微微发抖 狂暴撕裂 磁带
export type LineDashStyle = "solid" | "dashed" | "dotted"; // 描边虚实
export type EmberTheme = "warm" | "cool" | "cyber" | "custom"; // 浮动余烬主题

export interface RgbGlitchConfig {
  enabled: boolean;
  intensity: number; // 故障强度
  speed: number;
  style: GlitchStyle; // 故障风格
}

//
export interface NewoFlickerConfig {
  enabled: boolean;
  colors: string[];
  speed: number;
  glowIntensity: number; // 光晕放大倍数
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

// 爆灯闪缩配置
export interface NeonFlickerConfig {
  enabled: boolean; // 是否开启
  colors: string[]; // 循环颜色列表
  speed: number; // 速度滑块值
  glowIntensity: number; // 光晕强度
}

// 线框律动
export interface HollowPulseConfig {
  enabled: boolean;
  baseWidth: number; // 线条宽度
  pulseDistortion: number; // 脉冲扭曲
  speed: number; // 脉冲速度
  lineStyle: LineDashStyle; // 描边虚实
}

// 极地漫步
export interface AuroraConfig {
  enabled: boolean;
  colors: string[]; // 循环颜色列表
  speed: number; // 速度滑块值
  bandCount: number; // 光带数量
  opacity: number;
}

export interface FloatingEmbersConfig {
  enabled: boolean;
  particleCount: number; // 粒子数量
  speed: number; // 速度
  size: number; // 大小滑块值
  theme: EmberTheme; // 主题
}
