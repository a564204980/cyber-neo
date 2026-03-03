import type { Direction, Effect } from "./anim";
import type {
  TextEffectType,
  CanvasEffectType,
  EmberTheme,
  MatrixColorTheme,
  GridStyle,
} from "./effect";

export type SceneId =
  | "concert" // 🎤 演唱会应援模式
  | "airport" // ✈️ 接机举牌模式
  | "birthday" // 🎂 生日表白模式
  | "nightmarket" // 👋 夜市招揽模式
  | "classroom" // 🔇 课堂静音模式
  | "photo" // 📸 拍照打卡模式
  | "night" // 🌙 夜间安全模式
  | "event"; // 🎯 活动引导模式

// 深层可选工具类型：配置字段不必全写
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface ScenePreset {
  id: SceneId;
  label: string;
  style?: {
    fontSize?: number;
    colorPresetIndex?: number;
  };
  stroke?: {
    enabled?: boolean; // 是否开启描边
    colorPresetIndex?: number; // 描边颜色索引（对应 colorList）
    width?: number; // 描边粗细（0-10）
    opacity?: number; // 描边透明度（0-1）
    blur?: number; // 描边模糊（0-100）
  };
  anim?: {
    direction?: Direction;
    effect?: Effect;
    speed?: number;
    opacity?: number;
  };
  effect?: {
    textEffect?: TextEffectType;
    canvasEffect?: CanvasEffectType;
    speed?: number; // 动画速度
    glowIntensity?: number; // 光晕强度
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
  // 特效子配置：细化背景氛围
  effectConfig?: {
    embersTheme?: EmberTheme;
    matrixColorTheme?: MatrixColorTheme;
    gridColorTheme?: GridStyle;
    gridColor?: string;
  };
}
