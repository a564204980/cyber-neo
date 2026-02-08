import { defineStore } from "pinia";
import type { Direction, Effect } from "@/types/anim";
import { ref } from "vue";

export const useAnimStore = defineStore(
  "anim",
  () => {
    const direction = ref<Direction>("left"); // 方向
    const speed = ref(50); // 速度
    const isLoop = ref(true); // 是否循环
    const effect = ref<Effect>("none");

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
