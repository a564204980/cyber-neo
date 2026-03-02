<template>
    <view class="param-content">
        <view class="param-row">
            <view class="font-bold text-secondary">流动速度</view>
            <Slider :minSize="1" :maxSize="10" v-model="config.speed" />
        </view>
        <view class="param-row">
            <view class="font-bold text-secondary">流光颜色</view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view class="preset-list">
                    <view v-for="(item, index) in colorPresets" :key="index"
                        :class="{ active: currentPresetIndex === index }" @click="handlePresetChange(index)"
                        class="preset-item">
                        <view class="icon material-icons">{{ item.icon }}</view>
                        <text class="label">{{ item.label }}</text>
                    </view>
                </view>
            </scroll-view>
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary">光晕强度</view>
            <Slider :minSize="1" :maxSize="50" v-model="config.glowIntensity" :step="1" />
        </view>

        <view class="param-row">
            <view class="font-bold text-secondary">流光方向</view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view class="preset-list">
                    <view v-for="(item, index) in directionOptions" :key="index"
                        :class="{ active: config.direction === item.value }" @click="handleDirectionChange(item.value)"
                        class="preset-item">
                        <view class="icon material-icons">{{ item.icon }}</view>
                        <text class="label">{{ item.label }}</text>
                    </view>
                </view>
            </scroll-view>
        </view>


    </view>
</template>

<script setup lang="ts">
import { useEffectStore } from '@/stores'
import { ref } from 'vue'
import Slider from '@/components/common/Slider.vue'
import { FlowDirection } from '@/types/effect';

const effectStore = useEffectStore()
const config = effectStore.neonFlowConfig;

const currentPresetIndex = ref(0)


const colorPresets = [
    { label: '赛博朋克', colors: ['#00ffff', '#b026ff', '#ff00ff', '#fcee0a', '#ff00ff', '#b026ff'], icon: 'blur_on' },
    { label: '烈焰流金', colors: ['#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#ffbf00', '#ff8000', '#ff4000'], icon: 'local_fire_department' },
    { label: '极光薄荷', colors: ['#00ffa9', '#00e5ff', '#0084ff', '#7000ff', '#0084ff', '#00e5ff'], icon: 'waves' },
    { label: '皎洁月光', colors: ['#4a536b', '#8690a6', '#c4cdd8', '#ffffff', '#c4cdd8', '#8690a6'], icon: 'brightness_3' },
]

const directionOptions: { label: string, value: FlowDirection, icon: string }[] = [
    { label: '横向', value: 'horizontal', icon: 'swap_horiz' },
    { label: '纵向', value: 'vertical', icon: 'swap_vert' },
    { label: '下斜', value: 'diagonal-down', icon: 'call_received' },
    { label: '上斜', value: 'diagonal-up', icon: 'call_made' },
]

const handlePresetChange = (index: number) => {
    currentPresetIndex.value = index
    effectStore.neonFlowConfig.colors = colorPresets[index].colors
}

const handleDirectionChange = (val: FlowDirection) => {
    config.direction = val;
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
    display: inline-flex;
    white-space: nowrap;
    width: 100%;
    gap: 20rpx;
    margin-top: 20rpx;
    min-width: 100%;
}


.preset-item {
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