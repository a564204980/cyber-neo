import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DEFAULT_COLOR_PRESETS } from "@/config/color-presets";
import type { CustomColorData, ColorConfig, StrokeConfig } from "@/types/style";

const SYSTEM_CONSTRATNTS = {
  fontSize: { min: 50, max: 300, unit: "rpx" },
  strokeWidth: { min: 0, max: 10, unit: "rpx" },
  strokeOpacity: { min: 0, max: 1, step: 0.1 },
  textLength: { max: 50 },
  strokeBlur: { min: 0, max: 100, unit: "rpx" },
} as const;

export const useStyleStore = defineStore(
  "style",
  () => {
    const fontSize = ref(100);
    const colorConfig = ref<ColorConfig>({ type: "preset", presetIndex: 0 });
    const strokeConfig = ref<StrokeConfig>({
      enabled: true,
      colorIndex: 3,
      width: 3,
      opacity: 1,
      colorConfig: {
        type: "preset",
        presetIndex: 0,
        custom: {
          hue: 0,
          saturation: 0,
          lightness: 0,
          alpha: 0,
          color: "",
        },
      },
      blur: 0,
    });

    const colorList = ref([...DEFAULT_COLOR_PRESETS]);

    /**
     * 获取当前颜色
     */
    const currentColor = computed(() => {
      if (colorConfig.value.type === "custom" && colorConfig.value.custom) {
        return colorConfig.value.custom.color;
      } else {
        const index = colorConfig.value.presetIndex ?? 0;
        return colorList.value[index].color;
      }
    });

    /**
     * 获取当前描边
     */
    const currentStroke = computed(() => {
      let color;
      const config = strokeConfig.value.colorConfig;

      if (config?.type === "custom" && config.custom) {
        color = config.custom.color;
      } else {
        const index = config?.presetIndex ?? strokeConfig.value.colorIndex ?? 0;
        color = colorList.value[index].color;
      }
      return {
        color: color,
        width: strokeConfig.value.width,
        opacity: strokeConfig.value.opacity,
        blur: strokeConfig.value.blur,
      };
    });

    /**
     * 设置预设颜色
     * @param index 预设颜色索引
     */
    const updateColor = (index: number) => {
      colorConfig.value = {
        type: "preset",
        presetIndex: index,
      };
    };

    /**
     * 设置自定义颜色
     * @param colorData 自定义颜色数据
     */
    const updateCustomColor = (colorData: CustomColorData) => {
      colorConfig.value = {
        type: "custom",
        custom: colorData,
        presetIndex: colorList.value.length - 1,
      };
    };

    /**
     * 设置字号
     * @param size
     */
    const updateSize = (size: number) => {
      const { min, max } = SYSTEM_CONSTRATNTS.fontSize;
      fontSize.value = Math.min(Math.max(size, min), max);
    };

    /**
     * 设置描边开关
     * @param enabled 描边开关
     */
    const updateStrokeEnabled = (enabled: boolean) => {
      strokeConfig.value.enabled = enabled;
    };

    /**
     * 设置描边粗细
     * @param width 描边粗细
     */
    const updateStrokeWidth = (width: number) => {
      const { min, max } = SYSTEM_CONSTRATNTS.strokeWidth;
      strokeConfig.value.width = Math.min(Math.max(Number(width), min), max);
    };

    /**
     * 设置描边颜色
     * @param index 颜色索引
     */
    const updateStrokeColor = (index: number, target = "preset") => {
      if (index >= 0 && index < colorList.value.length) {
        strokeConfig.value.colorIndex = index;

        strokeConfig.value.colorConfig = {
          type: target === "stroke" ? "custom" : "preset",
          presetIndex: index,
        };
      }
    };

    /**
     * 设置描边自定义颜色
     * @param colorData 自定义颜色数据
     */
    const updateStrokeCustomColor = (colorData: CustomColorData) => {
      strokeConfig.value.colorConfig = {
        type: "custom",
        custom: colorData,
        presetIndex: colorList.value.length - 1,
      };
    };

    /**
     * 设置描边透明度
     * @param opacity 描边透明度
     */
    const updateStrokeOpacity = (opacity: number) => {
      strokeConfig.value.opacity = Math.min(Math.max(opacity, 0), 1);
    };

    /**
     * 设置描边模糊度
     * @param blur 描边模糊度
     */
    const updateStrokeBlur = (blur: number) => {
      const { min, max } = SYSTEM_CONSTRATNTS.strokeBlur;
      strokeConfig.value.blur = Math.min(Math.max(Number(blur), min), max);
    };

    return {
      // 状态
      fontSize,
      colorConfig,
      strokeConfig,
      colorList,
      // 计算属性
      currentColor,
      currentStroke,
      // 方法
      updateColor,
      updateCustomColor,
      updateSize,
      updateStrokeEnabled,
      updateStrokeWidth,
      updateStrokeColor,
      updateStrokeOpacity,
      updateStrokeCustomColor,
      updateStrokeBlur,

      MIN_FONT_SIZE: SYSTEM_CONSTRATNTS.fontSize.min,
      MAX_FONT_SIZE: SYSTEM_CONSTRATNTS.fontSize.max,
      MIN_STROKE_WIDTH: SYSTEM_CONSTRATNTS.strokeWidth.min,
      MAX_STROKE_WIDTH: SYSTEM_CONSTRATNTS.strokeWidth.max,
      MIN_STROKE_OPACITY: SYSTEM_CONSTRATNTS.strokeOpacity.min,
      MAX_STROKE_OPACITY: SYSTEM_CONSTRATNTS.strokeOpacity.max,
      STROKE_OPACITY_STEP: SYSTEM_CONSTRATNTS.strokeOpacity.step,
      MIN_STROKE_BLUR: SYSTEM_CONSTRATNTS.strokeBlur.min,
      MAX_STROKE_BLUR: SYSTEM_CONSTRATNTS.strokeBlur.max,
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
