<template>
    <view style="padding: 40rpx">
        <view class="section">
            <view class="flex justify-between">
                <view class="section-title text-white">文字特效</view>
                <!-- <view class="text-secondary more-text">往左滑动查看更多</view> -->
            </view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view v-for="item in textEffectList" :key="item.value"
                    :class="{ active: effectStore.currentTextEffect === item.value }"
                    @click="handleEffectSelect(item.value as any)" class="direction-item">
                    <view class="icon material-icons">{{ item.icon }}</view>
                    <text class="label">{{ item.label }}</text>
                </view>
            </scroll-view>

            <view v-if="currentTextEffect !== 'none'"
                class="font-bold stroke-panel-title flex items-center justify-between text-secondary">
                <view>特效参数</view>
                <switch :checked="currentEffectEnabled" @change="handleSwitchChange" color="#ff007f"
                    style="transform:scale(0.7)" />
            </view>


            <NeonFlickerSetting v-if="currentTextEffect === 'neon-flicker' && currentEffectEnabled">
            </NeonFlickerSetting>

            <NeonFlowSetting v-if="currentTextEffect === 'neon-flow' && currentEffectEnabled"></NeonFlowSetting>

            <RgbGlitchSetting v-if="currentTextEffect === 'rgb-glitch' && currentEffectEnabled"></RgbGlitchSetting>

            <HollowPulseSetting v-if="currentTextEffect === 'hollow-pulse' && currentEffectEnabled">
            </HollowPulseSetting>
        </view>

    </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useEffectStore } from '@/stores'
import NeonFlowSetting from './settings-panel/NeonFlowSetting.vue';
import NeonFlickerSetting from './settings-panel/NeonFlickerSetting.vue';
import RgbGlitchSetting from './settings-panel/RgbGlitchSetting.vue';
import HollowPulseSetting from './settings-panel/HollowPulseSetting.vue';

const effectStore = useEffectStore()
const { currentTextEffect, neonFlowConfig } = storeToRefs(effectStore)

const currentBlinkTypeIndex = ref<number>(0)

const textEffectList = [
    { label: '爆灯闪烁', value: 'neon-flicker', icon: 'electric_bolt' },
    { label: '霓虹流光', value: 'neon-flow', icon: 'water' },
    { label: 'RGB故障', value: 'rgb-glitch', icon: 'bug_report' },
    { label: '线框律动', value: 'hollow-pulse', icon: 'graphic_eq' },
] as const


const currentEffectEnabled = computed(() => {
    if (effectStore.currentTextEffect === 'neon-flow') return effectStore.neonFlowConfig.enabled
    if (effectStore.currentTextEffect === 'neon-flicker') return effectStore.neonFlickerConfig.enabled
    if (effectStore.currentTextEffect === 'rgb-glitch') return effectStore.rgbGlitchConfig.enabled
    if (effectStore.currentTextEffect === 'hollow-pulse') return effectStore.hollowPulseConfig.enabled
    return false
})

const handleEffectSelect = (value: any) => {
    effectStore.updateTextEffect(value)
}

const handleSwitchChange = (e: any) => {
    const configMap = {
        'neon-flow': effectStore.neonFlowConfig,
        'neon-flicker': effectStore.neonFlickerConfig,
        'rgb-glitch': effectStore.rgbGlitchConfig,
        'hollow-pulse': effectStore.hollowPulseConfig,
    }

    const config = configMap[currentTextEffect.value as keyof typeof configMap];
    if (config) {
        config.enabled = e.detail.value;
    }
}



// 每套预设的 colors[0] 决定警灯第一个颜色，hue-rotate(160deg) 自动算出第二个颜色
const blinkColorPresets: string[][] = [
    ['#8a2be2', '#8a2be2'],
    ['#00ffff', '#00ffff'],
    ['#ff003c', '#ff003c'],
]


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

.more-text {
    padding-right: 20rpx;
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

.param-panel {
    opacity: 0;
    max-height: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease
}


.param-panel.is-show {
    max-height: 800rpx;
    opacity: 1;
}

.param-row {
    font-size: 26rpx;
    margin: 10rpx 0 20rpx;
}

.effect-blink-type {
    margin-top: 20rpx;
    gap: 20rpx;
}

.effect-blink-item {
    padding: 20rpx 0;
    background: #2b2b2b;
    border-radius: 20rpx;
    color: rgba(255, 255, 255, 0.5);
    font-size: 24rpx;
    transition: all 0.3s;
    border: 2rpx solid transparent;
    flex: 1;
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