import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  TextEffectType,
  CanvasEffectType,
  NeonFlowConfig,
  AuroraConfig,
} from "@/types/effect";

export const useEffectStore = defineStore(
  "effect",
  () => {
    // 当前激活特效
    const currentTextEffect = ref<TextEffectType>("neon-flow");
    const currentCanvasEffect = ref<CanvasEffectType>("none");

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
    });

    const updateTextEffect = (type: TextEffectType) => {
      currentTextEffect.value = type;
      console.log("currentTextEffect", currentTextEffect.value);
    };

    return {
      currentTextEffect,
      currentCanvasEffect,
      neonFlowConfig,
      updateTextEffect,
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
