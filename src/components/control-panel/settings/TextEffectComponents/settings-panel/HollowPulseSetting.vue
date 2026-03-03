<template>
    <view class="param-content">
        <view class="param-row">
            <view class="font-bold text-secondary mb-2">灯管粗细</view>
            <Slider :minSize="1" :maxSize="10" v-model="config.baseWidth" />
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary mb-2">贝斯张力</view>
            <Slider :minSize="1" :maxSize="20" v-model="config.pulseDistortion" />
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary mb-2">电子心率</view>
            <Slider :minSize="1" :maxSize="10" v-model="config.speed" />
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary mb-2">发光管做工</view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view class="preset-list">
                    <view v-for="opt in styleOptions" :key="opt.value"
                        :class="{ active: config.lineStyle === opt.value }" @click="handleStyleChange(opt.value)"
                        class="preset-item">
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
import type { LineDashStyle } from '@/types/effect';

const effectStore = useEffectStore()
const config = effectStore.hollowPulseConfig;

const styleOptions: { label: string, value: LineDashStyle, icon: string }[] = [
    { label: '一体成型', value: 'solid', icon: 'power_input' },
    { label: '赛博切片', value: 'dashed', icon: 'more_horiz' },
    { label: '量子尘埃', value: 'dotted', icon: 'blur_on' },
]

const handleStyleChange = (val: LineDashStyle) => {
    config.lineStyle = val
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
    padding: 20rpx 30rpx;
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
