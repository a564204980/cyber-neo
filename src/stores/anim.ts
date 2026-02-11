import { defineStore } from "pinia";
import type { Direction, Effect, ZoomConfig } from "@/types/anim";
import { computed, ref } from "vue";

export const useAnimStore = defineStore(
  "anim",
  () => {
    const direction = ref<Direction>("left"); // 方向
    const speed = ref(50); // 速度
    const isLoop = ref(true); // 是否循环
    const effect = ref<Effect>("none");

    // 缩放配置
    const zoomConfig = ref<ZoomConfig>({
      type: "default", // 缩放类型
      amplitude: 3, // 幅度
      speed: 5, // 速度
      opacity: 1, // 透明度
    });

    // 计算缩放参数
    const zoomParams = computed(() => {
      const { type, amplitude, speed, opacity } = zoomConfig.value;

      if (!type) return null;

      const getAmplitude = () => (amplitude / 10) * 0.15;

      const configs = {
        default: () => {
          const amp = getAmplitude();
          return {
            scaleMin: 1.0 - amp,
            scaleMax: 1.0 + amp,
            duration: Math.max(0.5, 4 - (speed / 10) * 6),
            opacity,
            opacityMin: 0.6,
            opacityMax: 1.0,
            easing: "ease-in-out",
            iterationCount: "infinite",
            animName: "zoom-breathe",
          };
        },
        pulse: () => {
          const amp = getAmplitude();
          return {
            scaleMin: 1.0 - amp,
            scaleMax: 1.0 + amp,
            duration: Math.max(0.3, 4 - (speed / 10) * 2.5),
            opacity,
            opacityMin: 0.6,
            opacityMax: 1.0,
            easing: "ease-in-out",
            iterationCount: "infinite",
            animName: "zoom-pulse",
          };
        },
        "entry-breathe": () => {
          const amp = (amplitude / 10) * 0.2;
          return {
            scaleMin: 1.0 - amp,
            scaleMax: 1.05 + amp,
            duration: Math.max(0.5, 4 - (speed / 10) * 5),
            opacity,
            opacityMin: 0.4,
            opacityMax: 0.9,
            easing: "ease-in-out",
            iterationCount: "infinite",
            animName: "zoom-entry-breathe",
          };
        },
        none: () => null,
      };

      const configGenerator = configs[type];
      return configGenerator ? configGenerator() : null;
    });

    /**
     * 更新运动方向
     */
    const updateDirection = (dir: Direction) => {
      direction.value = dir;
    };

    /**
     * 更新运动效果
     */
    const updateEffect = (eff: Effect) => {
      effect.value = eff;
    };

    return {
      updateDirection,
      direction,
      effect,
      updateEffect,
      zoomParams,
      zoomConfig,
    };
  },
  {
    persist: {
      storage: {
        getItem: (key: string) => uni.getStorageSync(key),
        setItem: (key: string, value: string) => uni.setStorageSync(key, value),
      },
    },
  } as any,
);
