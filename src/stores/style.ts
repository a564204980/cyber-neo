import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useStyleStore = defineStore("style", () => {
  const MAX_FONT_SIZE = 300;
  const MIN_FONT_SIZE = 50;
  const MAX_TEXT_LENGTH = 50;

  const MIN_STROKE_WIDTH = 0;
  const MAX_STROKE_WIDTH = 10;

  const textStyle = ref({
    fontSize: 100,

    // 颜色相关
    activeColorIndex: 0,
    isUsingCustomColor: false,
    customColor: null as string | null,

    // 自定义颜色详细参数
    hue: 0, // 色相
    saturation: 100, // 饱和度
    lightness: 50, // 明度
    alpha: 100, // 透明度

    // 描边相关
    stroke: {
      enabled: true,
      colorIndex: 3,
      width: 3,
      opacity: 1,
    },
  });

  const colorList = [
    { label: "电光蓝", color: "#00e5ff" },
    { label: "荧光绿", color: "#39ff14" },
    { label: "霓虹粉", color: "#ff007f" },
    { label: "赛博紫", color: "#b200ff" },
    { label: "炽热橙", color: "#ff7f00" },
    { label: "自定义", color: "" },
  ];

  const currentTextStyle = computed(() => ({
    color: textStyle.value.isUsingCustomColor
      ? textStyle.value.customColor
      : colorList[textStyle.value.activeColorIndex].color,
    fontSize: textStyle.value.fontSize,
    colorLabel: textStyle.value.isUsingCustomColor
      ? "自定义"
      : colorList[textStyle.value.activeColorIndex].label,
    enabledStroke: textStyle.value.stroke.enabled,
    strokeColor: colorList[textStyle.value.stroke.colorIndex].color,
    strokeWidth: textStyle.value.stroke.width,
    strokeColorIndex: textStyle.value.stroke.colorIndex,
    strokeOpacity: textStyle.value.stroke.opacity,
  }));

  const setColor = (index: number) => {
    textStyle.value.activeColorIndex = index;
    textStyle.value.isUsingCustomColor = false;
  };

  /**
   * 设置自定义颜色
   * @param colorData 调色板返回的颜色数据
   */
  const setCustomColor = (colorData: Record<string, any>) => {
    textStyle.value.customColor = colorData.color;
    textStyle.value.isUsingCustomColor = true;
    textStyle.value.activeColorIndex = colorList.length - 1;
    textStyle.value.hue = colorData.hue;
    textStyle.value.saturation = colorData.saturation;
    textStyle.value.lightness = colorData.lightness;
    textStyle.value.alpha = colorData.alpha;
  };

  /**
   * 设置字号
   * @param size
   */
  const setSize = (size: number) => {
    const validSize = Number(size);
    if (isNaN(validSize)) {
      textStyle.value.fontSize = MIN_FONT_SIZE;
    } else {
      textStyle.value.fontSize = Math.min(
        Math.max(validSize, MIN_FONT_SIZE),
        MAX_FONT_SIZE,
      );
    }
  };

  /**
   * 设置描边开关
   * @param enabled 描边开关
   */
  const setStrokeEnabled = (enabled: boolean) => {
    textStyle.value.stroke.enabled = enabled;
  };

  /**
   * 设置描边粗细
   * @param width 描边粗细
   */
  const setStrokeWidth = (width: number) => {
    const validWidth = Number(width);
    textStyle.value.stroke.width = Math.min(
      Math.max(validWidth, MIN_STROKE_WIDTH),
      MAX_STROKE_WIDTH,
    );
  };

  /**
   * 设置描边颜色
   * @param index 颜色索引
   */
  const setStrokeColor = (index: number) => {
    if (index >= 0 && index < colorList.length) {
      textStyle.value.stroke.colorIndex = index;
    }
  };

  /**
   * 设置描边透明度
   * @param opacity 描边透明度
   */
  const setStrokeOpacity = (opacity: number) => {
    textStyle.value.stroke.opacity = opacity / 10;
  };

  const activeColorIndex = computed(() => textStyle.value.activeColorIndex);
  const fontSize = computed(() => textStyle.value.fontSize);
  const strokeWidth = computed(() => textStyle.value.stroke.width);
  const strokeColorIndex = computed(() => textStyle.value.stroke.colorIndex);

  return {
    textStyle, // 导出完整的 textStyle 对象
    activeColorIndex,
    colorList,
    currentTextStyle,
    setColor,
    fontSize,
    setSize,
    MAX_FONT_SIZE,
    MIN_FONT_SIZE,
    setStrokeWidth,
    setStrokeColor,
    MIN_STROKE_WIDTH,
    MAX_STROKE_WIDTH,
    strokeWidth,
    strokeColorIndex,
    setStrokeEnabled,
    setStrokeOpacity,
    setCustomColor,
  };
});
