<template>
    <view class="danmu-board">
        <view class="content-wrapper flex items-center" :style="wrapperStyle">
            <text v-if="showDanmu" class="danmu-text" :style="danmuStyle">{{ props.text
            }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useStyleStore } from '@/stores'

const store = useStyleStore()

const showDanmu = ref(true);

interface Props {
    text?: string
    fontSize?: number
    rotation?: number // 旋转角度
}

const props = withDefaults(defineProps<Props>(), {
    text: '我是弹幕',
    fontSize: 100,
    rotation: 0
})

const sysInfo = uni.getSystemInfoSync();
const windowWidth = sysInfo.windowWidth;
const windowHeight = sysInfo.windowHeight;

const wrapperStyle = computed(() => {
    const targetWidth = windowHeight * 0.76;
    const progress = props.rotation / 90;
    const calcWidth = windowWidth + (targetWidth - windowWidth) * progress;

    const moveDistance = props.rotation > 0 ? `${calcWidth}px` : "100vw"

    return {
        transform: `rotate(${props.rotation}deg)`,
        transformOrigin: 'center center',
        width: props.rotation > 0 ? `${calcWidth}px` : '100%',
        transition: 'transform 0.1s linear, width 0.1s linear',
        '--move-distance': moveDistance
    }
})

// 直接使用 store 中的颜色，实现全局同步
const danmuStyle = computed(() => {
    console.log("这是颜色", store.currentColor.color)
    return {
        color: store.currentColor.color,
        fontSize: props.fontSize + 'rpx'
    }
})

watch(() => props.text, async () => {
    showDanmu.value = false;
    await nextTick();
    showDanmu.value = true;
});


</script>

<style lang="scss" scoped>
.danmu-board {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}


.content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: visible;
    flex-shrink: 0;
}

.danmu-text {
    position: absolute;
    top: 50%;
    left: 0;
    white-space: nowrap;
    animation: scroll-left 10s linear infinite;
    will-change: transform;
    font-weight: bold;
    z-index: 99;
}

@keyframes scroll-left {
    0% {
        transform: translateY(-50%) translateX(var(--move-distance))
    }

    100% {
        transform: translateY(-50%) translateX(-100%);
    }
}
</style>
