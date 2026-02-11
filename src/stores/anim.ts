import { defineStore } from "pinia";
import type { Direction, Effect, ShakeConfig, ZoomConfig } from "@/types/anim";
import { computed, ref } from "vue";

export const useAnimStore = defineStore(
  "anim",
  () => {
    const direction = ref<Direction>("left"); // 方向
    const speed = ref(50); // 速度
    const isLoop = ref(true); // 是否循环
    const effect = ref<Effect>("none"); // 动画效果

    // 缩放配置
    const zoomConfig = ref<ZoomConfig>({
      type: "default", // 缩放类型
      amplitude: 3, // 幅度
      speed: 5, // 速度
      opacity: 1, // 透明度
      enabled: true,
    });

    // 摇摆配置
    const shakeConfig = ref<ShakeConfig>({
      amplitude: 80, // 摇摆幅度
      speed: 5, // 摇摆速度
      isSyncMove: true, // 同步文字移动
      enabled: true, // 是否启用
    });

    // 计算缩放参数
    const zoomParams = computed(() => {
      const { type, amplitude, speed, opacity } = zoomConfig.value;

      if (!type || !zoomConfig.value.enabled) return null;

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

    // 计算摇摆参数
    const shakeParams = computed(() => {
      if (!shakeConfig.value.enabled || effect.value !== "shake") return null;

      const { amplitude, speed } = shakeConfig.value;
      return {
        // 范围1-30，映射角度1-15°
        angle: (amplitude / 30) * 14 + 1,
        // 范围1-30，映射时间0.3-2s
        duration: Math.max(0.3, 2 - (speed / 30) * 1.7),
        easing: "ease-in-out", // 缓动函数
        iterationCount: "infinite", // 动画次数
        animName: "shake", // 动画名称
      };
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
      shakeParams,
      shakeConfig,
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
