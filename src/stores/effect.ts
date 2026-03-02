import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  TextEffectType,
  CanvasEffectType,
  NeonFlowConfig,
  AuroraConfig,
  NeonFlickerConfig,
  RgbGlitchConfig,
  HollowPulseConfig,
  FloatingEmbersConfig,
} from "@/types/effect";

export const useEffectStore = defineStore(
  "effect",
  () => {
    // 当前激活特效
    const currentTextEffect = ref<TextEffectType>("neon-flow");
    const currentCanvasEffect = ref<CanvasEffectType>("floating-embers");

    // 霓虹流光配置
    const neonFlowConfig = ref<NeonFlowConfig>({
      enabled: true,
      colors: [
        "#39ff14",
        "#00ffcc",
        "#00f0ff",
        "#aaff00",
        "#ffea00",
        "#ffaa00",
        "#ff4d94",
        "#cc00ff",
        "#39ff14",
      ],
      speed: 1.2,
      glowIntensity: 8,
      breathe: true,
      breatheSpeed: 0.018, // 呼吸频率
      opacity: 1.0,
      direction: "horizontal",
    });

    // 爆灯闪烁配置
    const neonFlickerConfig = ref<NeonFlickerConfig>({
      enabled: true,
      colors: ["#ff003c", "#0066ff"],
      speed: 6,
      glowIntensity: 8,
    });

    // 故障配置
    const rgbGlitchConfig = ref<RgbGlitchConfig>({
      enabled: true,
      intensity: 8,
      speed: 7,
      style: "vhs",
    });

    // 线框律动配置
    const hollowPulseConfig = ref<HollowPulseConfig>({
      enabled: true,
      baseWidth: 2,
      pulseDistortion: 6,
      speed: 4,
      lineStyle: "solid",
    });

    // 浮动余烬配置
    const floatingEmbersConfig = ref<FloatingEmbersConfig>({
      enabled: true,
      particleCount: 50,
      speed: 3,
      size: 4,
      theme: "warm",
    });

    const updateTextEffect = (type: TextEffectType) => {
      currentTextEffect.value = type;
    };

    // 更新背景特效
    const updateCanvasEffect = (type: CanvasEffectType = "floating-embers") => {
      currentCanvasEffect.value = type;
    };

    return {
      currentTextEffect,
      currentCanvasEffect,
      neonFlowConfig,
      updateTextEffect,
      neonFlickerConfig,
      rgbGlitchConfig,
      hollowPulseConfig,
      floatingEmbersConfig,
      updateCanvasEffect,
    };
  },
  {
    persist: {
      storage: {
        getItem: (key: string) => uni.getStorageSync(key),
        setItem: (key: string, value: string) => uni.setStorageSync(key, value),
      },
    },
  } as any
);
