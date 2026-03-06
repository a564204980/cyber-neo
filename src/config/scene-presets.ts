import type { ScenePreset, SceneId } from "@/types/scene";

export const SCENE_PRESETS = [
  {
    id: "default" as SceneId,
    label: "我是弹幕",
    style: {
      fontSize: 180,
      colorPresetIndex: 0,
      bgColor: "#000000",
    },
    anim: { direction: "none", effect: "none", speed: 20 },
    effect: { textEffect: "none", canvasEffect: "none" },
    effectConfig: {},
  },
  {
    id: "concert" as SceneId,
    label: "🎤 演唱会应援",
    style: {
      fontSize: 200,
      colorPresetIndex: 5,
    },
    stroke: {
      enabled: true,
      colorPresetIndex: 0,
      width: 5,
      opacity: 1,
      blur: 70,
    },
    anim: { direction: "none", effect: "none", speed: 28 },
    effect: { textEffect: "neon-flicker", canvasEffect: "neon-border" },
    effectConfig: { gridColor: "#b200ff" },
  },
  {
    id: "airport" as SceneId,
    label: "✈️ 接机举牌",
    style: { fontSize: 260, colorPresetIndex: 0 },
    anim: { direction: "none", effect: "zoom", speed: 2 },
    effect: {},
    effectConfig: {},
  },
  {
    // 🎂 生日表白：温暖浪漫，流光色彩，萤火漂浮
    id: "birthday" as SceneId,
    label: "🎂 生日表白",
    style: { fontSize: 160, colorPresetIndex: 2 }, // 霓虹粉
    anim: { direction: "left", effect: "zoom", speed: 40 }, // 轻柔缩放呼吸感
    effect: { textEffect: "neon-flow", canvasEffect: "floating-embers" },
    effectConfig: { embersTheme: "warm" }, // 暖色萤火
  },
  {
    // 👋 夜市招揽：抢眼、嘈杂感、橙色炽热，疯狂抖动
    id: "nightmarket" as SceneId,
    label: "👋 夜市招揽",
    style: { fontSize: 190, colorPresetIndex: 4 }, // 炽热橙
    anim: { direction: "left", effect: "shake", speed: 28 }, // 快速晃动
    effect: { textEffect: "neon-flicker", canvasEffect: "matrix-rain" },
    effectConfig: { matrixColorTheme: "amber" }, // 琥珀代码雨
  },
  {
    // 🔇 课堂静音：极简低调，字小颜色淡，完全静止
    id: "classroom" as SceneId,
    label: "🔇 课堂静音",
    style: { fontSize: 100, colorPresetIndex: 0 }, // 电光蓝，小字
    anim: { direction: "right", effect: "none", speed: 15 }, // 缓慢无动效
    effect: { textEffect: "hollow-pulse", canvasEffect: "none" }, // 线框+无背景
    effectConfig: {},
  },
  {
    // 📸 拍照打卡：梦幻极光背景，艺术感，赛博紫色调
    id: "photo" as SceneId,
    label: "📸 拍照打卡",
    style: { fontSize: 150, colorPresetIndex: 3 }, // 赛博紫
    anim: { direction: "up", effect: "wave", speed: 50 }, // 向上漂浮感
    effect: { textEffect: "neon-flow", canvasEffect: "aurora" }, // 极光背景
    effectConfig: {},
  },
  {
    // 🌙 夜间安全：超大字、高对比荧光绿、无背景噪点，黑夜中最醒目
    id: "night" as SceneId,
    label: "🌙 夜间安全",
    style: { fontSize: 240, colorPresetIndex: 1 }, // 荧光绿，次大字
    anim: { direction: "left", effect: "none", speed: 20 }, // 静止
    effect: { textEffect: "hollow-pulse", canvasEffect: "none" }, // 无背景干扰
    effectConfig: {},
  },
  {
    // 🎯 活动引导：代码雨赛博感，故障文字，科技感强
    id: "event" as SceneId,
    label: "🎯 活动引导",
    style: { fontSize: 160, colorPresetIndex: 0 }, // 电光蓝
    anim: { direction: "left", effect: "zoom", speed: 55 },
    effect: { textEffect: "rgb-glitch", canvasEffect: "matrix-rain" },
    effectConfig: { matrixColorTheme: "cyber" }, // 赛博粉蓝代码雨
  },
] as const satisfies readonly ScenePreset[];

export const SCENE_PRESET_MAP = Object.fromEntries(
  SCENE_PRESETS.map((p) => [p.id, p])
) as Record<SceneId, ScenePreset>;
