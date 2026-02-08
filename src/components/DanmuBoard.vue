<template>
    <view class="danmu-board">
        <view class="content-wrapper flex items-center" :style="wrapperStyle">
            <text v-if="showDanmu" class="danmu-text" :style="[danmuStyle, animStyle]">{{ displayText }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useStyleStore, useAnimStore } from '@/stores'
import { hexToRgba } from '@/utils'

const store = useStyleStore()
const animStore = useAnimStore()

const showDanmu = ref(true);

interface Props {
    text?: string
    rotation?: number // 旋转角度
}

const props = withDefaults(defineProps<Props>(), {
    text: '我是弹幕',
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

const danmuStyle = computed(() => {
    const style: any = {
        color: store.currentColor,
        fontSize: store.fontSize + 'rpx',
    }

    const { color, width, opacity } = store.currentStroke
    const enabled = store.strokeConfig.enabled

    if (enabled && width > 0) {
        const rgbaColor = hexToRgba(color, opacity)
        style.textShadow = `
            ${width}rpx ${width}rpx 0 ${rgbaColor},
            ${width}rpx ${-width}rpx 0 ${rgbaColor},
            ${-width}rpx ${width}rpx 0 ${rgbaColor},
            ${-width}rpx ${-width}rpx 0 ${rgbaColor}
        `
    }

    return style
})

const animStyle = computed(() => {
    const direction = animStore.direction

    const animNameMap = {
        left: "scroll-left",
        right: "scroll-right",
        up: "scroll-up",
        down: "scroll-down"
    }

    return {
        animationName: animNameMap[direction] || "scroll-left",
        animationDuration: '10s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite'
    }
})


const displayText = computed(() => {
    if (animStore.direction === 'right') {
        return props.text.split('').reverse().join('')
    }
    return props.text
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
    will-change: transform;
    font-weight: bold;
    z-index: 99;
}
</style>

<style>
@keyframes scroll-left {
    0% {
        transform: translateY(-50%) translateX(var(--move-distance))
    }

    100% {
        transform: translateY(-50%) translateX(-100%);
    }
}

@keyframes scroll-right {
    0% {
        transform: translateY(-50%) translateX(-100%);
    }

    100% {
        transform: translateY(-50%) translateX(100vw);
    }
}

@keyframes scroll-up {
    0% {
        transform: translate(-50%, 100vh);
        top: 0;
        left: 50%;
    }

    100% {
        transform: translate(-50%, -100%);
        top: 0;
        left: 50%;
    }
}

@keyframes scroll-down {
    0% {
        transform: translate(-50%, -100%);
        top: 0;
        left: 50%;
    }

    100% {
        transform: translate(-50%, 100vh);
        top: 0;
        left: 50%;
    }
}
</style>
