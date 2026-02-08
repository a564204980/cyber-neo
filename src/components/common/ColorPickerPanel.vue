<template>
    <view class="color-picker-panel">
        <view class="panel-title">颜色选择</view>

        <!-- 渐变色块（可点击选择颜色） -->
        <view class="color-canvas" @touchstart="onCanvasTouchStart" @touchmove="onCanvasTouchMove"
            @touchend="onCanvasTouchEnd">
            <view class="canvas-inner" :style="canvasStyle">
                <!-- 指示器 -->
                <view class="color-indicator" :style="{ left: selectedX + '%', top: selectedY + '%' }"></view>
            </view>
        </view>

        <!-- 色相滑块 -->
        <view class="hue-slider flex items-center gap-2">
            <view>色相值</view>
            <view class="flex-1">
                <view class="hue-track "></view>
                <Slider v-model="hue" :min-size="0" :max-size="360" :show-value="false" block-size="20"
                    :background-color="alphaGradient" @change="onHueChange" @update:model-value="onHueChange" />
            </view>
        </view>

        <!-- 透明度 -->
        <view class="alpha-slider flex items-center gap-2">
            <view>透明度</view>
            <view class="flex-1">
                <view class="alpha-track "></view>
                <Slider v-model="alpha" :min-size="0" :max-size="100" :show-value="false" block-size="20"
                    :background-color="alphaGradientBg" @change="onAlphaChange" />
            </view>
        </view>


        <!-- 底部按钮 -->
        <view class="action-buttons flex items-center justify-between">
            <view class="btn btn-cancel" @tap="onCancel">取消</view>
            <view class="btn btn-confirm" @tap="onConfirm">确认</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import Slider from './Slider.vue';
import { getRects } from "@/utils"
import { usePopupStore, useStyleStore } from "@/stores";

const props = defineProps<{
    data?: { target: 'text' | 'stroke' }
}>()

const popupStore = usePopupStore()
const styleStore = useStyleStore()


const emit = defineEmits(["confirm", "cancel"])
const instance = getCurrentInstance()

const hue = ref(300) // 色相
const alpha = ref(100) // 透明度
const saturation = ref(100) // 饱和度
const lightness = ref(50) // 明度
const selectedX = ref(50) // 选中点x坐标
const selectedY = ref(50) // 选中点y坐标

let canvasRect = { left: 0, top: 0, width: 0, height: 0 }

// 色相滑块背景
const alphaGradient = computed(() =>
    `linear-gradient(to right,
    hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
    hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%),
    hsl(360,100%,50%)
  )`
)

// 透明度滑块背景
const alphaGradientBg = computed(() => {
    const baseColor = `hsl(${hue.value},${saturation.value}%,${lightness.value}%)`
    return `linear-gradient(to right, transparent, ${baseColor})`
})


const canvasStyle = computed(() => {
    return {
        background: `
            linear-gradient(to right, #fff, transparent),
            linear-gradient(to top, #000, transparent),
            hsl(${hue.value}, 100%, 50%)
        `
    }
})



const updateCanvsRect = async () => {
    const res: UniApp.NodeInfo[] = await getRects(".color-canvas", instance)
    if (res?.[0]) {
        canvasRect = res[0] as any
    }
}


const isCanvasDragging = ref(false)

/**
 * 更新画布上的颜色选择
 */
const updateColorFromCanvas = (clientX: number, clientY: number) => {
    if (!canvasRect.width) return

    let x = clientX - canvasRect.left
    let y = clientY - canvasRect.top

    x = Math.max(0, Math.min(x, canvasRect.width))
    y = Math.max(0, Math.min(y, canvasRect.height))

    selectedX.value = (x / canvasRect.width) * 100
    selectedY.value = (y / canvasRect.height) * 100

    const s_hsv = selectedX.value / 100
    const v_hsv = 1 - (selectedY.value / 100)

    // HSV to HSL 转换
    let l_hsl = v_hsv * (1 - s_hsv / 2)
    let s_hsl = 0
    if (l_hsl === 0 || l_hsl === 1) {
        s_hsl = 0
    } else {
        s_hsl = (v_hsv - l_hsl) / Math.min(l_hsl, 1 - l_hsl)
    }

    lightness.value = l_hsl * 100
    saturation.value = s_hsl * 100
}

/**
 * 触摸开始
 */
const onCanvasTouchStart = async (e: any) => {
    // 每次触摸时重新获取画布位置
    await updateCanvsRect()

    isCanvasDragging.value = true
    const touch = e.touches[0]

    if (touch.x !== undefined) return

    updateColorFromCanvas(touch.clientX, touch.clientY)
}

/**
 * 触摸移动
 */
const onCanvasTouchMove = (e: any) => {
    if (!isCanvasDragging.value) return
    const touch = e.touches[0]
    updateColorFromCanvas(touch.clientX, touch.clientY)
}

/**
 * 触摸结束
 */
const onCanvasTouchEnd = () => {
    isCanvasDragging.value = false
}

const onConfirm = () => {
    const color = `hsla(${hue.value}, ${saturation.value}%, ${lightness.value}%, ${alpha.value / 100})`

    const data = {
        color,
        hue: hue.value,
        saturation: saturation.value,
        lightness: lightness.value,
        alpha: alpha.value
    }

    if (props.data?.target === "stroke") {
        styleStore.updateStrokeCustomColor(data)
    } else {
        styleStore.updateCustomColor(data)

    }

    popupStore.close()
}

const onCancel = () => {
    popupStore.close()
}

const onHueChange = (val: number) => {
    hue.value = val
}

const onAlphaChange = (val: number) => {
    alpha.value = val
}


const initColorFromStore = () => {
    let config

    if (props.data?.target === "stroke") {
        config = styleStore.strokeConfig.colorConfig;
    } else {
        config = styleStore.colorConfig;
    }

    if (config?.type === 'custom' && config.custom) {
        hue.value = config.custom.hue
        saturation.value = config.custom.saturation
        lightness.value = config.custom.lightness
        alpha.value = config.custom.alpha
    } else {
        hue.value = 0
        saturation.value = 100
        lightness.value = 50
        alpha.value = 100
    }

    const l = lightness.value / 100
    const s = saturation.value / 100

    const v = l + s * Math.min(l, 1 - l)
    const s_hsv = v === 0 ? 0 : 2 * (1 - l / v)

    selectedX.value = s_hsv * 100
    selectedY.value = (1 - v) * 100
}

onMounted(() => {
    updateCanvsRect()
    initColorFromStore()
})
</script>

<style scoped lang="scss">
.color-picker-panel {
    padding: 40rpx;
    border-radius: 40rpx 40rpx 0 0;
}

.panel-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 30rpx;
    text-align: center;
}

.color-canvas {
    position: relative;
    width: 100%;
    height: 400rpx;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
}

.canvas-inner {
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #fff, transparent),
        linear-gradient(to bottom, transparent, #000);
}

.action-buttons {
    gap: 40rpx;
}

.btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    font-size: 28rpx;
    font-weight: bold;
}

.btn-confirm {
    background: linear-gradient(135deg, #ff007f, #ff007f);
    color: #fff;
}

.btn-cancel {
    background: transparent;
    border: 2rpx solid #ff007f;
    color: #ff007f;
}

.hue-slider,
.alpha-slider {
    position: relative;
    height: 40rpx;
    margin-bottom: 30rpx;
    border-radius: 20rpx;
}

.hue-track,
.alpha-track {
    position: absolute;
    width: 100%;
    height: 100%;
}

.hue-slider slider {
    position: relative;
    z-index: 2;
}


.color-indicator {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid rgba(194, 194, 194, 0.6);
    background: rgba($color: #333333, $alpha: 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.5);
}
</style>
