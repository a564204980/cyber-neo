<template>
    <view style="padding: 40rpx;">
        <view class="section">
            <view class="flex justify-between">
                <view class="section-title text-white">文字特效</view>
                <view class="text-secondary more-text">往左滑动查看更多</view>
            </view>
            <scroll-view scroll-x enable-flex class="grid-container">
                <view v-for="item in textEffectList" :key="item.value"
                    :class="{ active: effectStore.currentTextEffect === item.value }"
                    @click="handleEffectSelect(item.value as any)" class="direction-item">
                    <view class="icon material-icons">{{ item.icon }}</view>
                    <text class="label">{{ item.label }}</text>
                </view>
            </scroll-view>

            <view class="font-bold stroke-panel-title flex items-center justify-between text-secondary">
                <view>特效面板参数</view>
                <switch :checked="currentEffectEnabled" @change="handleSwitchChange" color="#ff007f"
                    style="transform:scale(0.7)" />
            </view>
            <view v-if="currentTextEffect === 'neon-flow'">
                <view class="param-row">
                    <view class="text-secondary">类型</view>
                    <view class="effect-blink-type flex items-center justify-between">
                        <view v-for="(item, index) in blinkTypeList" :key="index" class="effect-blink-item"
                            :class="{ active: currentBlinkTypeIndex === index }" @click="handleBlinkTypeChange(index)">
                            <text class="material-icons">{{ item.icon }}</text>
                            <text>{{ item.label }}</text>
                        </view>
                    </view>
                </view>
                <view class="param-panel" :class="{ 'is-show': effectStore.neonFlowConfig.enabled }">
                    <view class="param-row">
                        <view class="text-secondary">闪烁频率</view>
                        <Slider :minSize="1" :maxSize="10" v-model="effectStore.neonFlowConfig.speed" />
                    </view>
                </view>

            </view>

        </view>

    </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useEffectStore } from '@/stores'
import Slider from '@/components/common/Slider.vue';

const effectStore = useEffectStore()
const { currentTextEffect, neonFlowConfig } = effectStore

const currentBlinkTypeIndex = ref<number>(0)

const blinkTypeList = [
    { label: '迷幻酒吧', value: 'blink', icon: "nightlife" },
    { label: '狂欢聚会', value: 'blink2', icon: "celebration" },
    { label: '硬核夜店', value: 'blink3', icon: "flash_on" },
] as const

const textEffectList = [
    { label: '爆灯闪烁', value: 'neon-flow', icon: 'electric_bolt' },
    { label: '霓虹流光', value: 'neon-flow222', icon: 'water' },
] as const

const currentEffectEnabled = computed(() => {
    if (effectStore.currentTextEffect === 'neon-flow') return effectStore.neonFlowConfig.enabled
    return false
})

const handleEffectSelect = (value: any) => {
    effectStore.updateTextEffect(value)
}

const handleSwitchChange = (e: any) => {
    if (!e.detail.value) {
        effectStore.updateTextEffect('none')
        return
    } else {
        effectStore.updateTextEffect('neon-flow')
    }
}



// 每套预设的 colors[0] 决定警灯第一个颜色，hue-rotate(160deg) 自动算出第二个颜色
const blinkColorPresets: string[][] = [
    ['#8a2be2', '#8a2be2'],
    ['#00ffff', '#00ffff'],
    ['#ff003c', '#ff003c'],
]

const handleBlinkTypeChange = (index: number) => {
    currentBlinkTypeIndex.value = index
    effectStore.neonFlowConfig.colors = blinkColorPresets[index]
}

</script>

<style lang="scss" scoped>
.section {
    margin-bottom: 20rpx;
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