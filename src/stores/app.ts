import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const activeTab = ref(0);
  const collapsibleContentHeight = ref(0);

  return {
    activeTab,
    collapsibleContentHeight,
  };
});
