<template>
    <view class="style-settings">
        <scroll-view scroll-y class="style-settings-scroll">
            <view class="style-settings-wrapper">
                <view class="flex items-center justify-between style-settings-container">
                    <view class="active-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></view>
                    <view v-for="(item, index) in list" :key="item.value" @click="onItemClick(index)"
                        class="style-item font-bold " :class="index === activeIndex ? 'active' : 'text-secondary'">{{
                            item.label
                        }}
                    </view>
                </view>
            </view>

            <view class="color-panel-container">
                <view class="font-bold color-panel-title">颜色面板</view>
                <ColorPicker :colorPanelList="colorPanelList" :activeColorIndex="activeColorIndex"
                    @colorClick="onColorItemClick" @customColorClick="onCustomColorClick('text')" />
            </view>

            <view class="size-panel-container">
                <view class="font-bold size-panel-title">文字大小</view>
                <Slider @change="onSizeChange" @update:modelValue="onSizeChange" :minSize="store.MIN_FONT_SIZE"
                    :maxSize="store.MAX_FONT_SIZE" />
            </view>

            <view class="stroke-panel-container">
                <view class="font-bold stroke-panel-title flex items-center justify-between">
                    <view>描边</view>
                    <switch :checked="isStrokeEnabled" @change="handleStrokeChange" color="#ff007f"
                        style="transform:scale(0.7)" />
                </view>
                <view class="stroke-panel-color-config-container" :class="{ 'is-show': isStrokeEnabled }">
                    <view class="stroke-panel-color-container">
                        <view class="stroke-panel-color-title">描边颜色</view>
                        <ColorPicker :colorPanelList="colorPanelList" :activeColorIndex="strokeColorIndex"
                            @colorClick="onStrokeColorClick" @customColorClick="onCustomColorClick('stroke')"
                            :size="60" />
                    </view>

                    <view class="stroke-panel-config-container">
                        <view class="stroke-panel-config-title">粗细</view>
                        <Slider @change="onStrokeWidthChange" @update:modelValue="onStrokeWidthChange"
                            :minSize="store.MIN_STROKE_WIDTH" :maxSize="store.MAX_STROKE_WIDTH"
                            :model-value="store.strokeConfig.width" />
                    </view>

                    <view class="stroke-panel-config-container">
                        <view class="stroke-panel-config-title">透明度</view>
                        <Slider v-model="strokeOpacityDisplay" :minSize="store.MIN_STROKE_OPACITY"
                            :maxSize="store.MAX_STROKE_OPACITY * 10" :step="store.STROKE_OPACITY_STEP * 10" />
                    </view>

                    <view class="stroke-panel-config-container">
                        <view class="stroke-panel-config-title">发光/模糊</view>
                        <Slider @change="onStrokeBlurChange" @update:modelValue="onStrokeBlurChange"
                            :minSize="store.MIN_STROKE_BLUR" :maxSize="store.MAX_STROKE_BLUR"
                            :model-value="store.strokeConfig.blur" />
                    </view>
                </view>
            </view>
        </scroll-view>

    </view>
</template>

<script setup lang="ts">
import Slider from '@/components/common/Slider.vue';
import ColorPicker from '@/components/control-panel/common/ColorPicker.vue';

import { computed, ref, nextTick } from 'vue';
import { useStyleStore, usePopupStore, useEffectStore } from '@/stores'

const store = useStyleStore()
const popupStore = usePopupStore()
const effectStore = useEffectStore()

const list = [
    { label: "文字样式", value: "text" },
    { label: "画布样式", value: "canvas" }
]
const colorPanelList = store.colorList

const activeIndex = ref<number>(0)

const activeColorIndex = computed(() => {
    return store.colorConfig.presetIndex ?? -1
})

const isStrokeEnabled = computed({
    get() {
        return store.strokeConfig.enabled
    },
    set(val: boolean) {
        store.updateStrokeEnabled(val)
    }
})

const strokeColorIndex = computed(() => {
    if (store.strokeConfig.colorConfig?.type === 'custom') {
        return colorPanelList.length - 1
    }
    return store.strokeConfig.colorConfig?.presetIndex ?? store.strokeConfig.colorIndex
})

const strokeOpacityDisplay = computed({
    get() {
        return Math.round(store.strokeConfig.opacity * 10)
    },
    set(val: number) {
        store.updateStrokeOpacity(val / 10);
    }
})

const onItemClick = (index: number) => {
    activeIndex.value = index
}

const onColorItemClick = (index: number) => {
    store.updateColor(index)
}

const onSizeChange = (value: number) => {
    store.updateSize(value)
}

/**
 * 描边开关
 * @param e 
 */
const handleStrokeChange = (e: any) => {
    if (effectStore.currentTextEffect !== "none") {
        uni.showToast({
            title: "当前特效已占用描边功能，请先关闭文字特效",
            icon: "none"
        })

        isStrokeEnabled.value = true
        nextTick(() => {
            isStrokeEnabled.value = false
        })
        return
    }

    isStrokeEnabled.value = e.detail.value
}

/**
 * 描边颜色点击
 * @param index 颜色索引
 */
const onStrokeColorClick = (index: number) => {
    store.updateStrokeColor(index)
    console.log("描边颜色")
}

/**
 * 描边粗细改变
 * @param value 描边粗细
 */
const onStrokeWidthChange = (value: number) => {
    store.updateStrokeWidth(value)
}

/**
 * 描边模糊度改变
 * @param value 模糊度
 */
const onStrokeBlurChange = (value: number) => {
    store.updateStrokeBlur(value)
}


/**
 * 自定义颜色点击
 * @param index 颜色索引
 * @param target 颜色类型
 */
const onCustomColorClick = (target: 'text' | 'stroke') => {
    popupStore.open('ColorPicker', { target })
}


</script>

<style lang="scss" scoped>
.style-settings {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.style-settings-scroll {
    flex: 1;
    min-height: 0;
}

.style-settings-wrapper {
    padding: 0 40rpx;
}

.style-settings-container {
    position: relative;
    padding: 6rpx 6rpx;
    background: #212126;
    border-radius: 50rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
}

.active-bg {
    position: absolute;
    top: 6rpx;
    bottom: 6rpx;
    left: 6rpx;
    width: calc((100% - 12rpx) / 2);
    background: #333;
    border-radius: 50rpx;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
}

.style-item {
    flex: 1;
    text-align: center;
    padding: 18rpx 20rpx;
    position: relative;
    z-index: 2;
    transition: color 0.3s;
}

.active {
    color: #fff;
}

.color-panel-container,
.size-panel-container,
.stroke-panel-container {
    margin: 40rpx;
}

.color-panel-title,
.size-panel-title,
.stroke-panel-title {
    font-size: 30rpx;
    margin: 0 20rpx;
}

.stroke-panel-config-container {
    margin: 10rpx 30rpx;
    padding: 10rpx;
    border-left: 4rpx solid #561a3e;
}

.stroke-panel-config-title {
    margin-left: 18rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
}

.stroke-panel-color-config-container {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease
}

.stroke-panel-color-config-container.is-show {
    max-height: 800rpx;
    opacity: 1;
}

.stroke-panel-color-container {
    .stroke-panel-color-title {
        margin-left: 18rpx;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
    }
}
</style>
