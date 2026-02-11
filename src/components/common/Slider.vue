<template>
    <view class="custom-slider">
        <!-- 容器 -->
        <view class="slider-container">
            <!-- 轨道（应用渐变色背景） -->
            <view class="slider-track" @tap.stop="handleTrackClick" :style="{ background: backgroundColor }">
                <!-- 填充（用半透明遮罩表示未选中区域） -->
                <view class="slider-fill" :style="{ width: `calc(100% - ${fillWidth})` }"></view>
            </view>
            <!-- 滑块 -->
            <view class="slider-thumb" @touchstart.stop="handleTouchStart" @touchend.stop="handleTouchEnd"
                @touchmove.stop.prevent="handleTouchMove" :style="{ left: thumbPosition }"></view>
        </view>
        <view class="value-display" v-if="showValue">{{ currentValue }}</view>
    </view>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { ref } from 'vue';
import { getRects } from "@/utils"
import { getCurrentInstance } from 'vue';
import { onMounted } from 'vue';
import { useStyleStore } from '@/stores'

const store = useStyleStore()

interface Props {
    modelValue?: number; // 当前值
    step?: number; // 步长
    vibrate?: boolean // 是否震动
    activeColor?: string // 激活颜色
    backgroundColor?: string // 轨道颜色
    minSize?: number // 最小值
    maxSize?: number // 最大值
    showValue?: boolean; // 是否显示当前值
    format?: (value: number) => number | string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 100,
    step: 1,
    activeColor: `#ff007f`,
    backgroundColor: `linear-gradient(90deg, #FF69B4 0%, #ff007f 100%)`,
    minSize: 0,
    maxSize: 100,
    showValue: true,
    format: (value: number) => value,
})

const emit = defineEmits<{
    "update:modelValue": [value: number],
    "change": [value: number]
}>()

const instance = getCurrentInstance()

const currentValue = ref<number>(props.modelValue)
const sliderWidth = ref(0)
const isDragging = ref(false)
const trackRect = ref<any>(null)

const fillWidth = computed(() => {
    const percentage = ((currentValue.value - props.minSize) / (props.maxSize - props.minSize)) * 100
    return `${percentage}%`
})

const thumbPosition = computed(() => {
    return fillWidth.value
})

watch(() => props.modelValue, (newValue) => {
    if (newValue !== currentValue.value) {
        currentValue.value = newValue
    }
})

/**
 * 获取滑块容器宽度
*/
const getSliderWidth = async () => {
    const rects = await getRects(".slider-track", instance) as UniApp.NodeInfo[]
    sliderWidth.value = rects[0]?.width ?? 0
    trackRect.value = rects[0]
}

/**
 * 处理触摸开始
*/
const handleTouchStart = async () => {
    isDragging.value = true

    await getSliderWidth()
}

/**
 * 处理触摸移动
*/
const handleTouchMove = async (e: TouchEvent) => {
    if (!isDragging.value || sliderWidth.value === 0) return

    const { left, width } = trackRect.value
    const touch = e.touches[0]

    let offsetX = touch.clientX - left // 触摸点距离轨道左侧的距离

    offsetX = Math.max(0, Math.min(offsetX, width)) // 限制在轨道范围内

    const percentage = offsetX / width // 计算滑块位置百分比

    let newValue = props.minSize + percentage * (props.maxSize - props.minSize)
    newValue = Math.round(newValue / props.step) * props.step

    currentValue.value = newValue
    emit('update:modelValue', newValue)
    emit("change", newValue)
}

/**
 * 处理触摸结束
*/
const handleTouchEnd = () => {
    isDragging.value = false
    emit("change", currentValue.value)
    uni.vibrateShort({ type: 'light' })
}

/**
 * 处理轨道点击
*/
const handleTrackClick = async (e: any) => {
    if (isDragging.value) return
    await getSliderWidth()

    if (!trackRect.value) return
    const { left, width } = trackRect.value
    const offsetX = e.detail.x - left
    const percentage = Math.max(0, Math.min(offsetX / width, 1))
    let newValue = props.minSize + percentage * (props.maxSize - props.minSize)

    if (props.step > 0) {
        newValue = Math.round(newValue / props.step) * props.step
    }

    newValue = parseFloat(newValue.toFixed(2))
    currentValue.value = newValue
    emit('update:modelValue', newValue)
    emit("change", newValue)
    uni.vibrateShort({ type: 'light' })
}

onMounted(() => {
    setTimeout(() => {
        getSliderWidth()
    }, 100)
})

</script>

<style lang="scss" scoped>
.custom-slider {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 20rpx;
}

.slider-container {
    position: relative;
    flex: 1;
    height: 40rpx;
    display: flex;
    align-items: center;
}

.slider-track {
    position: relative;
    width: 100%;
    height: 12rpx;
    border-radius: 50rpx;
    overflow: hidden;
}

.slider-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    // box-shadow: 0 0 10rpx rgba(255, 20, 147, 0.5);
    // background-color: #ff007f;
}

.slider-thumb {
    position: absolute;
    width: 40rpx;
    height: 40rpx;
    background-color: #fff;
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: 0 2rpx 8rpx rgba($color: #000000, $alpha: 0.3);
    border: 6rpx solid #ff007f;
}

.value-display {
    text-align: center;
    font-size: 28rpx;
    color: #fff;
    font-weight: 500;
    margin-left: 10rpx;
}
</style>
