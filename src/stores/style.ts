import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useStyleStore = defineStore("style", () => {
  const activeColorIndex = ref(0);

  const colorList = [
    { label: "电光蓝", color: "#00e5ff" },
    { label: "荧光绿", color: "#39ff14" },
    { label: "霓虹粉", color: "#ff007f" },
    { label: "赛博紫", color: "#b200ff" },
    { label: "炽热橙", color: "#ff7f00" },
    { label: "纯白热", color: "#ffffff" },

    { label: "荧光绿", color: "#39ff14" },
    { label: "霓虹粉", color: "#ff007f" },
    { label: "赛博紫", color: "#b200ff" },
    { label: "炽热橙", color: "#ff7f00" },
    { label: "纯白热", color: "#ffffff" },
  ];

  const currentColor = computed(() => colorList[activeColorIndex.value]);

  const setColor = (index: number) => {
    activeColorIndex.value = index;
  };

  return {
    activeColorIndex,
    colorList,
    currentColor,
    setColor,
  };
});
