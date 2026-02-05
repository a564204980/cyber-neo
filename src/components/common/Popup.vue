<template>
    <view v-if="visible" class="popup-wrapper">
        <!-- 遮罩层 -->
        <view class="popup-mask" :class="{ 'popup-mask-show': maskShow }"></view>

        <!-- 内容区域 -->
        <view class="popup-content">
            <slot></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

interface Props {
    visible?: boolean // 是否显示
    position?: "bottom" | "center" | "top" // 弹出位置
    maskClosable?: boolean // 是否点击遮罩层关闭
    borderRadius?: number // 圆角
    backgroundColor?: string // 背景色
    zIndex?: number // 层级
}

const props = withDefaults(defineProps<Props>(), {
    visible: true,
    position: 'bottom',
    maskClosable: true,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    zIndex: 999
})

const emit = defineEmits<{
    "update:visible": [value: boolean],
    "close": [],
    "open": []
}>()

const maskShow = ref(false) // 遮罩层显示状态
const contentShow = ref(false) // 内容区域显示状态

watch(() => props.visible, async (val) => {
    if (val) {
        await nextTick()
        setTimeout(() => {
            maskShow.value = true

        }, 50)
        emit("open")
    } else {
        maskShow.value = false
        emit("close")
    }
})



</script>

<style lang="scss" scoped>
.popup-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
}

.popup-mask {
    position: absolute;
    top: 0;
    ;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color 0.3s ease;
}

.popup-mask-show {
    background-color: rgba(0, 0, 0, 1);
}
</style>