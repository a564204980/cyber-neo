<template>
    <view style="padding: 40rpx">
        <view class="section">
            <view class="flex justify-between">
                <view class="section-title text-white">背景特效</view>
            </view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view v-for="item in canvasEffectList" :key="item.value"
                    :class="{ active: effectStore.currentCanvasEffect === item.value }"
                    @click="handleEffectSelect(item.value as any)" class="direction-item">
                    <view class="icon material-icons">{{ item.icon }}</view>
                    <text class="label">{{ item.label }}</text>
                </view>
            </scroll-view>

            <view v-if="currentCanvasEffect !== 'none'"
                class="font-bold stroke-panel-title flex items-center justify-between text-secondary">
                <view>特效参数</view>
                <switch :checked="currentEffectEnabled" @change="handleSwitchChange" color="#ff007f"
                    style="transform:scale(0.7)" />
            </view>

            <!-- 专属星火调节板 -->
            <view class="param-content"
                v-if="effectStore.currentCanvasEffect === 'floating-embers' && currentEffectEnabled">
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">星火浓度 (数量)</view>
                    <!-- 手机端建议10-150，性能极佳 -->
                    <Slider :minSize="10" :maxSize="150" v-model="config.particleCount" />
                </view>

                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">上升气流 (速度)</view>
                    <Slider :minSize="1" :maxSize="10" v-model="config.speed" />
                </view>

                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">流星雨体系</view>
                    <scroll-view scroll-x enable-flex class="grid-container">
                        <view class="preset-list">
                            <view v-for="opt in themeOptions" :key="opt.value"
                                :class="{ active: config.theme === opt.value }" @click="handleThemeChange(opt.value)"
                                class="preset-item">
                                <view class="icon material-icons" style="margin-right:8rpx">{{ opt.icon }}</view>
                                <text class="label">{{ opt.label }}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>

        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useEffectStore } from '@/stores'
import Slider from '@/components/common/Slider.vue'
import type { EmberTheme } from '@/types/effect';

const effectStore = useEffectStore()
const { currentCanvasEffect } = storeToRefs(effectStore)
const config = effectStore.floatingEmbersConfig;

const canvasEffectList = [
    { label: '无', value: 'none', icon: 'block' },
    { label: '浮游星火', value: 'floating-embers', icon: 'local_fire_department' },
] as const

const currentEffectEnabled = computed(() => {
    if (effectStore.currentCanvasEffect === 'floating-embers') return effectStore.floatingEmbersConfig.enabled
    return false
})

const handleEffectSelect = (value: any) => {
    effectStore.updateCanvasEffect(value)
}

const handleSwitchChange = (e: any) => {
    const configMap = {
        'floating-embers': effectStore.floatingEmbersConfig,
    }

    const cfg = configMap[currentCanvasEffect.value as keyof typeof configMap];
    if (cfg) {
        cfg.enabled = e.detail.value;
    }
}

const themeOptions: { label: string, value: EmberTheme, icon: string }[] = [
    { label: '温情余烬', value: 'warm', icon: 'local_fire_department' },
    { label: '深海幽萤', value: 'cool', icon: 'waves' },
    { label: '赛博量子', value: 'cyber', icon: 'blur_on' },
]

const handleThemeChange = (val: EmberTheme) => {
    config.theme = val
}
</script>

<style lang="scss" scoped>
.section {
    margin-bottom: 20rpx;
    height: 100%;
}

.section-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
}

.grid-container {
    display: flex;
    white-space: nowrap;
    width: 100%;
}

.direction-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    flex: 1;
    margin-right: 30rpx;
    flex-shrink: 0;

    &:last-child {
        margin-right: 0;
    }

    .icon {
        width: 120rpx;
        height: 120rpx;
        background: #2b2b2b;
        border-radius: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 60rpx;
        border: 4rpx solid transparent;
        transition: all 0.3s;
        color: #ff007f;
    }

    .label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.5);
    }

    &.active {
        .icon {
            border-color: #ff007f;
            color: #ff007f;
            background: rgba(255, 0, 127, 0.1);
        }
    }
}

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

.param-content {
    margin-top: 20rpx;
}

.stroke-panel-title {
    margin-top: 40rpx;
    margin-bottom: 20rpx;
}
</style>
