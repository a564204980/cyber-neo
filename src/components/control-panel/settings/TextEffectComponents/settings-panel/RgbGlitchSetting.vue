<template>
    <view class="param-content">
        <view class="param-row">
            <view class="font-bold text-secondary mb-2">破坏力度</view>
            <Slider :minSize="1" :maxSize="20" v-model="config.intensity" />
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary mb-2">撕裂速度</view>
            <Slider :minSize="1" :maxSize="10" v-model="config.speed" />
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary mb-2">神经受损程度</view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view class="preset-list">
                    <view v-for="opt in styleOptions" :key="opt.value" :class="{ active: config.style === opt.value }"
                        @click="handleStyleChange(opt.value)" class="preset-item">
                        <view class="icon material-icons" style="margin-right:8rpx">{{ opt.icon }}</view>
                        <text class="label">{{ opt.label }}</text>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useEffectStore } from '@/stores'
import Slider from '@/components/common/Slider.vue'
import type { GlitchStyle } from '@/types/effect';

const effectStore = useEffectStore()
const config = effectStore.rgbGlitchConfig;

const styleOptions: { label: string, value: GlitchStyle, icon: string }[] = [
    { label: '轻微色差', value: 'subtle', icon: 'visibility_off' },       // 只偏移颜色，不切开
    // { label: '暴力撕裂', value: 'chaotic', icon: 'power_off' },            // 切碎，大范围平移
    { label: '复古磁带', value: 'vhs', icon: 'settings_input_hdmi' },      // 充满噪点斑马线
]

const handleStyleChange = (val: GlitchStyle) => {
    config.style = val
}
</script>

<style lang="scss" scoped>
.param-row {
    font-size: 26rpx;
    margin: 10rpx 0 20rpx;
}

.preset-list {
    display: inline-flex;
    white-space: nowrap;
    gap: 20rpx;
    margin-top: 20rpx;
    padding-bottom: 20rpx;
}

.preset-item {
    padding: 20rpx 40rpx;
    background: #2b2b2b;
    border-radius: 20rpx;
    color: rgba(255, 255, 255, 0.5);
    font-size: 24rpx;
    transition: all 0.3s;
    border: 2rpx solid transparent;
    display: flex;
    align-items: center;

    &.active {
        background: rgba(255, 0, 127, 0.1);
        color: #ff007f;
        border-color: #ff007f;
        font-weight: bold;
    }
}
</style>
