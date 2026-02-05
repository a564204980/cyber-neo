<template>
    <uni-popup ref="popupRef" @touchmove.stop.prevent type="bottom" border-radius="40rpx 40rpx 0 0"
        background-color="rgba(0, 0, 0, 1)">

        <ColorPickerPanel v-if="popupStore.currentView === 'ColorPicker'" />
    </uni-popup>
</template>

<script setup lang="ts">
import ColorPickerPanel from "./ColorPickerPanel.vue";



import { usePopupStore } from "@/stores";
import { onMounted, ref } from "vue";

const popupStore = usePopupStore()

const popupRef = ref()



onMounted(() => {
    popupStore.setPopupRef(popupRef.value)
})

</script>

<style scoped></style>
