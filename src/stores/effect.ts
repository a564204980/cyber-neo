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
  MatrixRainConfig,
  DynamicGridConfig,
  NeonBorderConfig,
} from "@/types/effect";

export const useEffectStore = defineStore(
  "effect",
  () => {
    const currentTextEffect = ref<TextEffectType>("neon-flow");
    const currentCanvasEffect = ref<CanvasEffectType>("floating-embers");

    // 记录设置面板当前 Tab 索引 (0: 文字动效, 1: 背景特效)
    const activeTabIndex = ref<number>(0);

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
      color: "#ffaa00",
      pattern: "circle",
    });

    // 代码雨配置
    const matrixRainConfig = ref<MatrixRainConfig>({
      enabled: true,
      speed: 5,
      density: 20,
      fontSize: 14,
      color: "#39ff14",
    });

    // 动态网格配置
    const dynamicGridConfig = ref<DynamicGridConfig>({
      enabled: true,
      speed: 5,
      gridSize: 40,
      perspective: 120,
      glowIntensity: 10,
      color: "#cc00ff",
    });

    // 霓虹边框配置
    const neonBorderConfig = ref<NeonBorderConfig>({
      enabled: true,
      dotCount: 60,
      dotSize: 5,
      speed: 2,
      glowIntensity: 15,
      cornerRadius: 16,
      color: "#ff003c",
    });

    const updateTextEffect = (type: TextEffectType) => {
      currentTextEffect.value = type;
    };

    // 更新背景特效
    const updateCanvasEffect = (type: CanvasEffectType = "floating-embers") => {
      currentCanvasEffect.value = type;
    };

    // 更新设置面板索引
    const updateActiveTabIndex = (index: number) => {
      activeTabIndex.value = index;
    };

    // 更新动态网格配置
    const updateDynamicGridConfig = (config: DynamicGridConfig) => {
      dynamicGridConfig.value = config;
    };

    // 更新霓虹边框配置
    const updateNeonBorderConfig = (config: NeonBorderConfig) => {
      neonBorderConfig.value = config;
    };

    // 更新霓虹边框颜色
    const updateNeonBorderColor = (color: string) => {
      neonBorderConfig.value.color = color;
    };

    const updateFloatingEmbersColor = (color: string) => {
      floatingEmbersConfig.value.color = color;
    };

    const updateMatrixRainColor = (color: string) => {
      matrixRainConfig.value.color = color;
    };

    const updateDynamicGridColor = (color: string) => {
      dynamicGridConfig.value.color = color;
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
      matrixRainConfig,
      activeTabIndex,
      updateActiveTabIndex,
      dynamicGridConfig,
      updateDynamicGridConfig,
      neonBorderConfig,
      updateNeonBorderConfig,
      updateNeonBorderColor,
      updateFloatingEmbersColor,
      updateMatrixRainColor,
      updateDynamicGridColor,
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
