<template>
    <view class="param-content">
        <view class="param-row">
            <view class="font-bold text-secondary mb-2">爆闪频率</view>
            <Slider :minSize="1" :maxSize="20" v-model="config.speed" />
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary mb-2">光晕强度</view>
            <Slider :minSize="1" :maxSize="30" v-model="config.glowIntensity" />
        </view>

        <view class="param-row">
            <view class="flex justify-between">
                <view class="font-bold text-secondary">警铃底色</view>
                <view class="text-secondary more-text">往左滑动查看更多</view>
            </view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view class="preset-list">
                    <view v-for="(item, index) in flickerPresets" :key="index"
                        :class="{ active: currentPresetIndex === index }" @click="handlePresetChange(index)"
                        class="preset-item">
                        <view class="icon material-icons" style="margin-right:8rpx">{{ item.icon }}</view>
                        <text class="label">{{ item.label }}</text>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEffectStore } from '@/stores'
import Slider from '@/components/common/Slider.vue'

const effectStore = useEffectStore()
const config = effectStore.neonFlickerConfig;

const currentPresetIndex = ref(0)

const flickerPresets = [
    { label: '警笛追击', colors: ['#ff003c', '#0066ff'], icon: 'local_police' },   // 经典红蓝
    { label: '极度高温', colors: ['#ff0000', '#ff8a00'], icon: 'warning' },        // 报警红黄
    { label: '故障绿屏', colors: ['#00ff00', '#00aa00'], icon: 'bug_report' },     // 黑客帝国坏屏
    { label: '午夜迪斯科', colors: ['#ff00ff', '#00ffff'], icon: 'nightlife' },    // 迷幻粉蓝
]

const handlePresetChange = (index: number) => {
    currentPresetIndex.value = index
    config.colors = flickerPresets[index].colors
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

.more-text {
    padding-right: 20rpx;
}
</style>
