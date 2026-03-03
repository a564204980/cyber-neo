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

            <view class="font-bold stroke-panel-title flex items-center justify-between text-secondary">
                <view>特效参数</view>
                <switch :checked="currentEffectEnabled" @change="handleSwitchChange" color="#ff007f"
                    style="transform:scale(0.7)" />
            </view>

            <!-- 专属星火调节板 -->
            <view class="param-content"
                v-if="effectStore.currentCanvasEffect === 'floating-embers' && currentEffectEnabled">
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">数量</view>
                    <!-- 手机端建议10-150，性能极佳 -->
                    <Slider :minSize="10" :maxSize="150" v-model="config.particleCount" />
                </view>

                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">速度</view>
                    <Slider :minSize="1" :maxSize="10" v-model="config.speed" />
                </view>

                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">类型</view>
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

            <view class="param-content"
                v-if="effectStore.currentCanvasEffect === 'matrix-rain' && currentEffectEnabled">
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">下落速度</view>
                    <Slider :minSize="1" :maxSize="10" v-model="matrixConfig.speed" />
                </view>
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">列间距 (密度)</view>
                    <Slider :minSize="10" :maxSize="40" v-model="matrixConfig.density" />
                </view>
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">字符大小</view>
                    <Slider :minSize="8" :maxSize="24" v-model="matrixConfig.fontSize" />
                </view>
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">终端配色</view>
                    <scroll-view scroll-x enable-flex class="grid-container">
                        <view class="preset-list">
                            <view v-for="opt in matrixThemeOptions" :key="opt.value"
                                :class="{ active: matrixConfig.colorTheme === opt.value }"
                                @click="matrixConfig.colorTheme = opt.value" class="preset-item">
                                <view class="icon material-icons" style="margin-right:8rpx">{{ opt.icon }}</view>
                                <text class="label">{{ opt.label }}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>

            <view class="param-content"
                v-if="effectStore.currentCanvasEffect === 'dynamic-grid' && currentEffectEnabled">
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">穿梭速度</view>
                    <Slider :minSize="1" :maxSize="10" v-model="dynamicGridConfig.speed" />
                </view>
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">网格大小</view>
                    <Slider :minSize="20" :maxSize="40" v-model="dynamicGridConfig.gridSize" />
                </view>
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">透视深度</view>
                    <Slider :minSize="50" :maxSize="200" v-model="dynamicGridConfig.perspective" />
                </view>
                <view class="param-row">
                    <view class="font-bold text-secondary mb-2">终端配色</view>
                    <scroll-view scroll-x enable-flex class="grid-container">
                        <view class="preset-list">
                            <view v-for="opt in gridStyleOptions" :key="opt.value"
                                :class="{ active: dynamicGridConfig.colorTheme === opt.value }"
                                @click="dynamicGridConfig.colorTheme = opt.value" class="preset-item">
                                <view class="icon material-icons" style="margin-right:8rpx">{{ opt.icon }}</view>
                                <text class="label">{{ opt.label }}</text>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>

            <view class="param-content"
                v-if="effectStore.currentCanvasEffect === 'neon-border' && currentEffectEnabled">
                <view class="param-row">
                    <view class="param-row">
                        <view class="font-bold text-secondary mb-2">圆点总数</view>
                        <Slider :minSize="30" :maxSize="100" v-model="neonBorderConfig.dotCount" />
                    </view>
                    <view class="param-row">
                        <view class="font-bold text-secondary mb-2">圆点半径</view>
                        <Slider :minSize="1" :maxSize="10" v-model="neonBorderConfig.dotSize" />
                    </view>
                    <view class="param-row">
                        <view class="font-bold text-secondary mb-2">移动速度</view>
                        <Slider :minSize="1" :maxSize="10" v-model="neonBorderConfig.speed" />
                    </view>
                    <view class="param-row">
                        <view class="font-bold text-secondary mb-2">边框圆角</view>
                        <Slider :minSize="1" :maxSize="50" v-model="neonBorderConfig.cornerRadius" />
                    </view>
                    <view class="font-bold text-secondary mb-2">边框颜色</view>
                    <ColorPicker :colorPanelList="colorPanelList" :activeColorIndex="strokeColorIndex"
                        @colorClick="onStrokeColorClick" @customColorClick="onCustomColorClick()" :size="60" />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useEffectStore, usePopupStore, useStyleStore } from '@/stores'
import type { EmberTheme, GridStyle, MatrixColorTheme } from '@/types/effect';
import Slider from '@/components/common/Slider.vue'
import ColorPicker from '@/components/control-panel/common/ColorPicker.vue';


const effectStore = useEffectStore()
const store = useStyleStore()
const popupStore = usePopupStore()
const { currentCanvasEffect } = storeToRefs(effectStore)

const colorPanelList = store.colorList

const config = effectStore.floatingEmbersConfig;
const matrixConfig = effectStore.matrixRainConfig;
const dynamicGridConfig = effectStore.dynamicGridConfig;
const neonBorderConfig = effectStore.neonBorderConfig;

const canvasEffectList = [
    { label: '浮游星火', value: 'floating-embers', icon: 'local_fire_department' },
    { label: '代码雨', value: 'matrix-rain', icon: 'code' },
    { label: '动态网格', value: 'dynamic-grid', icon: 'grid_view' },
    { label: '霓虹边框', value: 'neon-border', icon: 'border_all' },
] as const

const currentEffectEnabled = computed(() => {
    if (effectStore.currentCanvasEffect === 'floating-embers') return effectStore.floatingEmbersConfig.enabled
    if (effectStore.currentCanvasEffect === 'matrix-rain') return effectStore.matrixRainConfig.enabled
    if (effectStore.currentCanvasEffect === 'dynamic-grid') return effectStore.dynamicGridConfig.enabled
    if (effectStore.currentCanvasEffect === 'neon-border') return effectStore.neonBorderConfig.enabled
    return false
})


const strokeColorIndex = computed(() => {
    return colorPanelList.findIndex(
        (c) => c.color === effectStore.neonBorderConfig.color
    )
})

const handleEffectSelect = (value: any) => {
    effectStore.updateCanvasEffect(value)
}

const handleSwitchChange = (e: any) => {
    const configMap = {
        'floating-embers': effectStore.floatingEmbersConfig,
        'matrix-rain': effectStore.matrixRainConfig,
        'dynamic-grid': effectStore.dynamicGridConfig,
        'neon-border': effectStore.neonBorderConfig,
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

const matrixThemeOptions: { label: string, value: MatrixColorTheme, icon: string }[] = [
    { label: '经典绿', value: 'green', icon: 'terminal' },
    { label: '琥珀终端', value: 'amber', icon: 'computer' },
    { label: '赛博冰蓝', value: 'cyber', icon: 'ac_unit' },
]

const gridStyleOptions: { label: string, value: GridStyle, icon: string }[] = [
    { label: '赛博粉紫', value: 'synthwave', icon: 'grid_view' },
    { label: '赛博冰蓝', value: 'cyber', icon: 'ac_unit' },
    { label: '黑客绿', value: 'matrix', icon: 'terminal' },
    { label: '血红', value: 'hacker', icon: 'warning' },
]

const handleThemeChange = (val: EmberTheme) => {
    config.theme = val
}

const onStrokeColorClick = (index: number) => {
    if (!colorPanelList[index]) return
    effectStore.updateNeonBorderColor(colorPanelList[index].color)
}

/**
 * 自定义颜色点击
 */
const onCustomColorClick = () => {
    popupStore.open('ColorPicker', { target: 'neon-border' })
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
    padding: 0 30rpx;
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
