import { defineStore } from "pinia";
import { ref } from "vue";

export const usePopupStore = defineStore("popup", () => {
  const popupRef = ref<any>();
  const currentView = ref<string>();
  const popupData = ref<any>();

  /**
   * 设置弹窗引用
   * @param ref 弹窗引用
   */
  const setPopupRef = (ref: any) => {
    popupRef.value = ref;
  };

  /**
   * 打开弹窗
   * @param viewName 要显示的内容类型
   * @param data 传递的数据
   */
  const open = (viewName: string, data: any = {}) => {
    if (!popupRef.value) return;

    currentView.value = viewName;
    popupData.value = data;
    popupRef.value.open();
  };

  /**
   * 关闭弹窗
   */
  const close = () => {
    if (!popupRef.value) return;

    popupRef.value.close();

    setTimeout(() => {
      currentView.value = "";
      popupData.value = {};
    }, 300);
  };

  return {
    popupRef,
    currentView,
    popupData,
    setPopupRef,
    open,
    close,
  };
});
