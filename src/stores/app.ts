import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const activeTab = ref(0);
  const collapsibleContentHeight = ref(0);
  const danmuText = ref<string>("我是弹幕");

  return {
    activeTab,
    collapsibleContentHeight,
    danmuText,
  };
});
