export type Direction = "left" | "right" | "up" | "down";

// 动画效果
export type Effect = "zoom" | "shake" | "wave" | "shuffle" | "none";

// 缩放类型
export type ZoomType = "default" | "pulse" | "entry-breathe" | "none";
// 缩放参数
export interface ZoomConfig {
  type: ZoomType;
  amplitude: number; // 幅度滑块值
  speed: number; // 速度滑块值
  opacity: number; // 透明度滑块值
  enabled: boolean; // 是否启用
}

// 摇摆参数
export interface ShakeConfig {
  amplitude: number; // 摇摆幅度
  speed: number; // 摇摆速度
  isSyncMove: boolean; // 同步文字移动
  enabled: boolean; // 是否启用
}
