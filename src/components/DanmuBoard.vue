<template>
    <view class="danmu-board">
        <view class="content-wrapper flex items-center" :style="wrapperStyle">
            <!-- 弹幕移动 -->
            <view v-if="showDanmu" class="danmu-mover" :style="animStyle">
                <!-- 动画承载 -->
                <view class="danmu-zoom" :style="effectAnimStyle">
                    <text class="danmu-text" :style="danmuStyle">{{ displayText }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, CSSProperties } from 'vue';
import { useStyleStore, useAnimStore } from '@/stores'
import { hexToRgba } from '@/utils'

const store = useStyleStore()
const animStore = useAnimStore()

const showDanmu = ref(true);

interface Props {
    text?: string
    rotation?: number // 旋转角度
    isPaused?: boolean // 是否暂停
}

const props = withDefaults(defineProps<Props>(), {
    text: '我是弹幕',
    rotation: 0,
    isPaused: false
})

const sysInfo = uni.getWindowInfo();
const windowWidth = sysInfo.windowWidth;
const windowHeight = sysInfo.windowHeight;

const wrapperStyle = computed(() => {
    const progress = props.rotation / 90;
    const calcWidth = windowWidth + (windowHeight - windowWidth) * progress;

    const moveDistance = props.rotation > 0 ? `${calcWidth}px` : "100vw"

    return {
        transform: `rotate(${props.rotation}deg)`,
        transformOrigin: 'center center',
        width: props.rotation > 0 ? `${calcWidth}px` : '100%',
        transition: 'transform 0.1s linear, width 0.1s linear',
        '--move-distance': moveDistance
    }
})

// 弹幕文字样式
const danmuStyle = computed(() => {
    const style: any = {
        color: store.currentColor,
        fontSize: store.fontSize + 'rpx',
    }

    const { color, width, opacity, blur } = store.currentStroke
    const enabled = store.strokeConfig.enabled

    if (enabled && (width > 0 || blur > 0)) {
        const rgbaColor = hexToRgba(color, opacity)
        let shadow = ''

        if (width > 0) {
            shadow = `
                ${width}rpx ${width}rpx 0 ${rgbaColor},
                ${width}rpx ${-width}rpx 0 ${rgbaColor},
                ${-width}rpx ${width}rpx 0 ${rgbaColor},
                ${-width}rpx ${-width}rpx 0 ${rgbaColor}
            `
        }

        if (blur > 0) {
            if (shadow) shadow += ', '
            // 为了提升发光效果，这里叠加了两个模糊半径
            shadow += `0 0 ${blur}rpx ${rgbaColor}, 0 0 ${blur * 1.5}rpx ${rgbaColor}`
        }

        style.textShadow = shadow
    }

    return style
})

// 弹幕移动样式
const animStyle = computed(() => {
    if (props.isPaused) {
        return {
            left: "50%",
            top: "50%",
            transform: 'translateX(-50%) translateY(-50%)',
            animationName: 'none'
        } as CSSProperties
    }

    if (animStore.effect === "shake" && !animStore.shakeConfig.isSyncMove) {
        return {
            left: "50%",
            transform: 'translateX(-50%) translateY(-50%)',
        } as CSSProperties
    }

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

// 弹幕文字内容
const displayText = computed(() => {
    if (animStore.direction === 'right') {
        return props.text.split('').reverse().join('')
    }
    return props.text
})

// 弹幕特效样式
const effectAnimStyle = computed(() => {
    const effect = animStore.effect

    // 缩放效果
    if (effect === 'zoom') {
        const params = animStore.zoomParams
        if (!params) return {}
        const useOpacity = params.opacity === 1
        return {
            '--scale-min': params.scaleMin,
            '--scale-max': params.scaleMax,
            '--opacity-min': useOpacity ? params.opacityMin : 1,
            '--opacity-max': useOpacity ? params.opacityMax : 1,
            animationName: params.animName,
            animationDuration: params.duration + 's',
            animationTimingFunction: params.easing,
            animationIterationCount: params.iterationCount,
        }
    }
    // 摇摆效果
    if (effect === 'shake') {
        console.log("effect", effect)
        const params = animStore.shakeParams
        if (!params) return {}
        return {
            '--shake-angle': params.angle + 'deg',
            animationName: params.animName,
            animationDuration: params.duration + 's',
            animationTimingFunction: params.easing,
            animationIterationCount: params.iterationCount,
        }
    }


    // 波浪效果
    if (effect === "wave") {
        const params = animStore.waveParams
        if (!params) return {}
        return {
            "--wave-offset": params.offset + "px",
            animationName: params.animName,
            animationDuration: params.duration + "s",
            animationTimingFunction: params.easing,
            animationIterationCount: params.iterationCount,
        }
    }

    // 跳动效果
    if (effect === "jump") {
        const params = animStore.jumpParams
        if (!params) return {}
        return {
            "--jump-offset": params.offset + "px",
            "--jump-scale": params.scale,
            animationName: params.animName,
            animationDuration: params.duration + "s",
            animationTimingFunction: params.easing,
            animationIterationCount: params.iterationCount,
        }
    }

    // 无效果
    return {}
})


watch(() => props.text, async () => {
    showDanmu.value = false;
    await nextTick();
    showDanmu.value = true;
});

// CSS动画在运行过程中，不会实时响应CSS自定义变量
watch(() => [animStore.zoomParams, animStore.shakeParams, animStore.waveParams, animStore.jumpParams], async () => {
    showDanmu.value = false;
    await nextTick();
    showDanmu.value = true;
}, { deep: true });

watch(() => props.rotation, () => {
    showDanmu.value = false;
    nextTick(() => {
        showDanmu.value = true;
    })
})


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

.danmu-mover {
    position: absolute;
    top: 50%;
    left: 0;
    white-space: nowrap;
    will-change: transform;
    z-index: 99;
}

.danmu-text {
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

/* 霓虹呼吸效果 */
@keyframes zoom-breathe {
    0% {
        transform: scale(var(--scale-min));
        opacity: var(--opacity-min);
    }

    50% {
        transform: scale(var(--scale-max));
        opacity: var(--opacity-max);
    }

    100% {
        transform: scale(var(--scale-min));
        opacity: var(--opacity-min);
    }
}

/* 霓虹心跳效果 */
@keyframes zoom-pulse {
    0% {
        transform: scale(var(--scale-min));
        opacity: var(--opacity-min);
    }

    40% {
        transform: scale(var(--scale-max));
        opacity: var(--opacity-max);
    }

    50% {
        transform: scale(calc(var(--scale-min) * 0.95));
        opacity: calc(var(--opacity-min) * 0.8);
    }

    60% {
        transform: scale(var(--scale-max));
        opacity: var(--opacity-max);
    }

    100% {
        transform: scale(var(--scale-min));
        opacity: var(--opacity-min);
    }
}

/* 登场柔光效果 - 模拟光晕呼吸 */
@keyframes zoom-entry-breathe {
    0% {
        transform: scale(var(--scale-min));
        opacity: var(--opacity-min);
        filter: blur(0px);
    }

    50% {
        transform: scale(var(--scale-max));
        opacity: var(--opacity-max);
        filter: blur(1px);
    }

    100% {
        transform: scale(var(--scale-min));
        opacity: var(--opacity-min);
        filter: blur(0px);
    }
}

/* 摇摆效果 */
@keyframes shake {
    0% {
        transform: rotate(0deg);
    }

    15% {
        /* 快速甩到最大角度 */
        transform: rotate(var(--shake-angle));
    }

    30% {
        /* 回弹过头，到反方向的60% */
        transform: rotate(calc(var(--shake-angle) * -0.6));
    }

    45% {
        /* 再弹回来，幅度衰减 */
        transform: rotate(calc(var(--shake-angle) * 0.35));
    }

    60% {
        /* 继续衰减 */
        transform: rotate(calc(var(--shake-angle) * -0.2));
    }

    75% {
        transform: rotate(calc(var(--shake-angle) * 0.1));
    }

    100% {
        transform: rotate(0deg);
    }
}

/* 波浪效果 */
@keyframes wave {

    0%,
    100% {
        transform: translateY(calc(var(--wave-offset) * -0.8));
    }

    50% {
        transform: translateY(var(--wave-offset));
    }
}

@keyframes jump {

    0%,
    100% {
        transform: translateY(0) scale(1, 1);
    }

    20% {
        /* 蓄力：轻微压扁 */
        transform: translateY(0) scale(1.1, 0.9);
    }

    45% {
        /* 最高点：轻微拉长 */
        transform: translateY(calc(var(--jump-offset) * -1)) scale(0.9, 1.1);
    }

    70% {
        /* 落地压扁 */
        transform: translateY(0) scale(1.1, 0.9);
    }

    85% {
        /* 小回弹 */
        transform: translateY(calc(var(--jump-offset) * -0.2)) scale(0.95, 1.05);
    }
}
</style>
