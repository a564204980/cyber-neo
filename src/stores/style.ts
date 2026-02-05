import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useStyleStore = defineStore("style", () => {
  const MAX_FONT_SIZE = 300;
  const MIN_FONT_SIZE = 50;
  const MAX_TEXT_LENGTH = 50;

  const MIN_STROKE_WIDTH = 0;
  const MAX_STROKE_WIDTH = 10;

  const activeColorIndex = ref(0);
  const fontSize = ref(100);

  // 描边
  const isStrokeEnabled = ref(true);
  const strokeColorIndex = ref(3);
  const strokeWidth = ref(3);
  const strokeOpacity = ref(1);

  const colorList = [
    { label: "电光蓝", color: "#00e5ff" },
    { label: "荧光绿", color: "#39ff14" },
    { label: "霓虹粉", color: "#ff007f" },
    { label: "赛博紫", color: "#b200ff" },
    { label: "炽热橙", color: "#ff7f00" },
  ];

  const currentTextStyle = computed(() => ({
    color: colorList[activeColorIndex.value].color,
    fontSize: fontSize.value,
    colorLabel: colorList[activeColorIndex.value].label,
    enabledStroke: isStrokeEnabled.value,
    strokeColor: colorList[strokeColorIndex.value].color,
    strokeWidth: strokeWidth.value,
    strokeColorIndex: strokeColorIndex.value,
    strokeOpacity: strokeOpacity.value,
  }));

  const setColor = (index: number) => {
    activeColorIndex.value = index;
  };

  /**
   * 设置字号
   * @param size
   */
  const setSize = (size: number) => {
    const validSize = Number(size);
    if (isNaN(validSize)) {
      fontSize.value = MIN_FONT_SIZE;
    } else {
      fontSize.value = Math.min(
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
    isStrokeEnabled.value = enabled;
  };

  /**
   * 设置描边粗细
   * @param width 描边粗细
   */
  const setStrokeWidth = (width: number) => {
    const validWidth = Number(width);
    strokeWidth.value = Math.min(
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
      strokeColorIndex.value = index;
    }
  };

  /**
   * 设置描边透明度
   * @param opacity 描边透明度
   */
  const setStrokeOpacity = (opacity: number) => {
    strokeOpacity.value = opacity / 10;
  };

  return {
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
    setStrokeEnabled,
    setStrokeOpacity,
  };
});
