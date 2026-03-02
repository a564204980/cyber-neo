<template>
    <view class="param-content">
        <view class="param-row">
            <view class="font-bold text-secondary">流动速度</view>
            <Slider :minSize="1" :maxSize="10" v-model="effectStore.neonFlowConfig.speed" />
        </view>
        <view class="param-row">
            <view class="font-bold text-secondary">流光颜色</view>
            <scroll-view scroll-x enable-flex>
                <view class="preset-list">
                    <view v-for="(item, index) in colorPresets" :key="index"
                        :class="{ active: currentPresetIndex === index }" @click="handlePresetChange(index)"
                        class="direction-item">
                        <view class="icon material-icons">{{ item.icon }}</view>
                        <text class="label">{{ item.label }}</text>
                    </view>
                </view>
            </scroll-view>
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary">流动速度</view>
            <Slider :minSize="1" :maxSize="10" v-model="effectStore.neonFlowConfig.speed" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { useEffectStore } from '@/stores'
import { ref } from 'vue'
import Slider from '@/components/common/Slider.vue'

const effectStore = useEffectStore()

const currentPresetIndex = ref(0)


const colorPresets = [
    { label: '赛博朋克', colors: ['#0ff', '#f0f'], icon: 'blur_on' },
    { label: '烈焰流金', colors: ['#ff003c', '#ff8a00'], icon: 'local_fire_department' },
    { label: '极光薄荷', colors: ['#00ff87', '#60efff'], icon: 'waves' },
    { label: '皎洁月光', colors: ['#ffffff', '#a3a3a3'], icon: 'brightness_3' },
]

const handlePresetChange = (index: number) => {
    currentPresetIndex.value = index
    effectStore.neonFlowConfig.colors = colorPresets[index].colors
}
</script>

<style lang="scss" scoped>
.param-panel {
    opacity: 0;
    max-height: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease
}

.param-row {
    font-size: 26rpx;
    margin: 10rpx 0 20rpx;
}

.preset-list {
    display: flex;
    white-space: nowrap;
    width: 100%;
    gap: 20rpx;
    margin-top: 20rpx;
    min-width: 100%;
}


.direction-item {
    padding: 20rpx 40rpx;
    background: #2b2b2b;
    border-radius: 20rpx;
    color: rgba(255, 255, 255, 0.5);
    font-size: 24rpx;
    transition: all 0.3s;
    border: 2rpx solid transparent;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
        background: rgba(255, 0, 127, 0.1);
        color: #ff007f;
        border-color: #ff007f;
        font-weight: bold;
    }
}
</style>