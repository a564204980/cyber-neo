export type Direction = "left" | "right" | "up" | "down";

export type Effect = "zoom" | "shake" | "wave" | "shuffle" | "none";

// 缩放类型
export type ZoomType = "default" | "pulse" | "entry-breathe" | "none";
// 缩放参数
export interface ZoomConfig {
  type: ZoomType;
  amplitude: number; // 幅度滑块值
  speed: number; // 速度滑块值
  opacity: number; // 透明度滑块值
}
