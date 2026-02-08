export interface CustomColorData {
  color: string;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}

export interface ColorConfig {
  type: "preset" | "custom"; // 预设颜色或自定义颜色
  presetIndex?: number; // 预设颜色索引
  custom?: {
    color: string;
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
  };
}

export interface StrokeConfig {
  enabled: boolean; // 描边开关
  colorIndex: number; // 描边颜色索引
  width: number; // 描边粗细
  opacity: number; // 描边透明度
  colorConfig: ColorConfig;
}
