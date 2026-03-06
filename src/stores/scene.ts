import { defineStore } from "pinia";
import { ref } from "vue";
import type { SceneId } from "@/types/scene";
import { SCENE_PRESET_MAP } from "@/config/scene-presets";
import { useStyleStore } from "./style";
import { useAnimStore } from "./anim";
import { useEffectStore } from "./effect";

export const useSceneStore = defineStore("scene", () => {
  // 记录当前激活的场景，null 表示「无预设 / 自定义」
  const activeSceneId = ref<SceneId | null>("default");

  /**
   * 一键应用场景预设
   */
  const applyPreset = (id: SceneId) => {
    const preset = SCENE_PRESET_MAP[id];
    if (!preset) return;

    const styleStore = useStyleStore();
    const animStore = useAnimStore();
    const effectStore = useEffectStore();

    // 先清空所有特效和动画
    effectStore.updateTextEffect("none");
    effectStore.updateCanvasEffect("none");
    animStore.updateEffect("none");
    styleStore.updateStrokeEnabled(false);

    // 样式
    if (preset.style?.fontSize !== undefined)
      styleStore.updateSize(preset.style.fontSize);
    if (preset.style?.colorPresetIndex !== undefined)
      styleStore.updateColor(preset.style.colorPresetIndex);
    if (preset.style?.bgColor !== undefined)
      styleStore.updateBgColor(preset.style.bgColor);

    // 动画方向
    if (preset.anim?.direction !== undefined)
      animStore.updateDirection(preset.anim.direction);
    if (preset.anim?.effect !== undefined)
      animStore.updateEffect(preset.anim.effect);

    // 动画速度
    if (preset.anim?.speed !== undefined) {
      const s = preset.anim.speed;
      animStore.zoomConfig.speed = s;
      animStore.shakeConfig.speed = s;
      animStore.waveConfig.speed = s;
      animStore.jumpConfig.speed = s;
    }

    // 文字特效 & 背景特效
    if (preset.effect?.textEffect !== undefined)
      effectStore.updateTextEffect(preset.effect.textEffect);
    if (preset.effect?.canvasEffect !== undefined)
      effectStore.updateCanvasEffect(preset.effect.canvasEffect);

    // 主题色调不再需要，现已改为颜色面板选择

    // 描边
    const stroke = preset.stroke;
    if (stroke) {
      if (stroke.enabled !== undefined)
        styleStore.updateStrokeEnabled(stroke.enabled);
      if (stroke.colorPresetIndex !== undefined)
        styleStore.updateStrokeColor(stroke.colorPresetIndex);
      if (stroke.width !== undefined)
        styleStore.updateStrokeWidth(stroke.width);
      if (stroke.opacity !== undefined)
        styleStore.updateStrokeOpacity(stroke.opacity);
      if (stroke.blur !== undefined) styleStore.updateStrokeBlur(stroke.blur);
    }

    activeSceneId.value = id;
  };

  /**
   * 清空预设
   */
  const clearPreset = () => {
    activeSceneId.value = null;
  };

  return { activeSceneId, applyPreset, clearPreset };
});
