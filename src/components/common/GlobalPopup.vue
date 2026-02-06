<template>
    <uni-popup ref="popupRef" @touchmove.stop.prevent type="bottom" border-radius="40rpx 40rpx 0 0"
        background-color="#1d1d1f">

        <ColorPickerPanel v-if="popupStore.currentView === 'ColorPicker'" />
    </uni-popup>
</template>

<script setup lang="ts">
import ColorPickerPanel from "./ColorPickerPanel.vue";



import { usePopupStore } from "@/stores";
import { nextTick, onMounted, ref } from "vue";

const popupStore = usePopupStore()

const popupRef = ref()




defineExpose({
    popupRef
})

</script>

<style scoped></style>
