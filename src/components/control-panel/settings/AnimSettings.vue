<template>
    <view class="anim-settings">
        <scroll-view scroll-y class="anim-settings-scroll">
            <view style="padding:40rpx">
                <view class="section">
                    <view class="section-title">运动方向</view>
                    <view class="grid-container">
                        <view v-for="item in directionList" :key="item.value"
                            :class="{ active: animStore.direction === item.value }"
                            @click="handleDirectionChange(item.value)" class="direction-item">
                            <view class="icon material-icons">{{ item.icon }}</view>
                            <text class="label">{{ item.label }}</text>
                        </view>
                    </view>
                </view>

                <view class="section">
                    <view class="flex justify-between">
                        <view class="section-title text-white">动画效果</view>
                        <view class="text-secondary more-text">往左滑动查看更多</view>
                    </view>
                    <scroll-view scroll-x enable-flex class="grid-container">
                        <view v-for="item in effectList" :key="item.value"
                            :class="{ active: animStore.effect === item.value }" @click="handleEffectChange(item.value)"
                            class="direction-item">
                            <view class="icon material-icons">{{ item.icon }}</view>
                            <text class="label">{{ item.label }}</text>
                        </view>
                    </scroll-view>
                </view>

                <view class="anim-settings-panel">
                    <view class="font-bold stroke-panel-title flex items-center justify-between text-secondary">
                        <view>动画效果参数</view>
                        <switch :checked="currentEffectEnabled" @change="handleStrokeChange" color="#ff007f"
                            style="transform:scale(0.7)" />
                    </view>

                    <!-- 缩放参数面板 -->
                    <view v-if="animStore.effect === 'zoom'" class="anim-settings-panel-container"
                        :class="{ 'is-show': isShowAnimSetting }">
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">类型</view>
                            <view class="animation-scale-type flex items-center justify-between">
                                <view v-for="(item, index) in scaleTypeList" :key="index" class="animation-scale-item"
                                    :class="{ active: currentScaleTypeIndex === index }"
                                    @click="handleScaleTypeChange(index)">
                                    <text class="material-icons">{{ item.icon }}</text>
                                    <text>{{ item.label }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">速度</view>
                            <Slider :minSize="1" :maxSize="30" v-model="animStore.zoomConfig.speed" />
                        </view>
                        <view class="anim-settings-panel-content flex items-center justify-between">
                            <view class="text-secondary">同步透明</view>
                            <switch :checked="animStore.zoomConfig.opacity === 1" @change="handleOpacityChange"
                                color="#ff007f" style="transform:scale(0.7)" />
                        </view>
                    </view>

                    <!-- 摇摆参数面板 -->
                    <view v-if="animStore.effect === 'shake'" class="anim-settings-panel-container"
                        :class="{ 'is-show': isShowAnimSetting }">
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">幅度</view>
                            <Slider :minSize="1" :maxSize="100" v-model="animStore.shakeConfig.amplitude" />
                        </view>
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">速度</view>
                            <Slider :minSize="1" :maxSize="30" v-model="animStore.shakeConfig.speed" />
                        </view>
                        <view class="anim-settings-panel-content flex items-center justify-between">
                            <view class="text-secondary">同步文字移动</view>
                            <switch @change="handleSyncMoveChange" color="#ff007f" style="transform:scale(0.7)" />
                        </view>
                    </view>

                    <!-- 波浪参数面板 -->
                    <view v-if="animStore.effect === 'wave'" class="anim-settings-panel-container"
                        :class="{ 'is-show': isShowAnimSetting }">
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">幅度</view>
                            <Slider :minSize="1" :maxSize="140" v-model="animStore.waveConfig.amplitude" />
                        </view>
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">速度</view>
                            <Slider :minSize="1" :maxSize="20" v-model="animStore.waveConfig.speed" />
                        </view>
                    </view>

                    <!-- 跳动参数面板 -->
                    <view v-if="animStore.effect === 'jump'" class="anim-settings-panel-container"
                        :class="{ 'is-show': isShowAnimSetting }">
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">幅度</view>
                            <Slider :minSize="1" :maxSize="100" v-model="animStore.jumpConfig.amplitude" />
                        </view>
                        <view class="anim-settings-panel-content">
                            <view class="text-secondary">速度</view>
                            <Slider :minSize="1" :maxSize="30" v-model="animStore.jumpConfig.speed" />
                        </view>
                    </view>
                </view>
            </view>


        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAnimStore } from "@/stores/anim";
import { Direction, Effect } from "@/types/anim";
import Slider from '@/components/common/Slider.vue';

const animStore = useAnimStore();

const directionList = [
    { label: "左", value: "left", icon: "arrow_left_alt" },
    { label: "右", value: "right", icon: "arrow_right_alt" },
    { label: "上", value: "up", icon: "arrow_upward" },
    { label: "下", value: "down", icon: "arrow_downward" },
] as const;

const effectList = [
    { label: "缩放", value: "zoom", icon: "zoom_out_map" },
    { label: "摇摆", value: "shake", icon: "vibration" },
    { label: "波浪", value: "wave", icon: "waves" },
    { label: "跳动", value: "jump", icon: "shuffle" },
] as const;

const scaleTypeList = [
    { label: "默认呼吸", icon: "radio_button_checked", value: "default" },
    { label: "心跳脉冲", icon: "ecg_heart", value: "pulse" },
    { label: "登场柔光", icon: "wand_stars", value: "entry-breathe" },
] as const;

const isShowAnimSetting = ref<boolean>(true)
const currentScaleTypeIndex = ref<number>(0)


const currentEffectEnabled = computed(() => {
    if (animStore.effect === 'zoom') return animStore.zoomConfig.enabled
    if (animStore.effect === 'shake') return animStore.shakeConfig.enabled
    if (animStore.effect === 'wave') return animStore.waveConfig.enabled
    if (animStore.effect === 'jump') return animStore.jumpConfig.enabled
    return false
})

const handleDirectionChange = (dir: Direction) => {
    animStore.updateDirection(dir);
}

const handleEffectChange = (eff: Effect) => {
    animStore.updateEffect(eff);

    if (eff === 'zoom') {
        isShowAnimSetting.value = animStore.zoomConfig.enabled
    } else if (eff === 'shake') {
        isShowAnimSetting.value = animStore.shakeConfig.enabled
    }
}

// 是否开启动画效果
const handleStrokeChange = (e: any) => {
    const configMap = {
        zoom: animStore.zoomConfig,
        shake: animStore.shakeConfig,
        wave: animStore.waveConfig,
        jump: animStore.jumpConfig,
    }

    const config = configMap[animStore.effect as keyof typeof configMap];
    if (config) {
        config.enabled = e.detail.value;
    }

    isShowAnimSetting.value = e.detail.value
}

const handleScaleTypeChange = (index: number) => {
    currentScaleTypeIndex.value = index
    animStore.zoomConfig.type = scaleTypeList[index].value
}

const handleOpacityChange = (e: any) => {
    animStore.zoomConfig.opacity = e.detail.value ? 1 : 0
}

const handleSyncMoveChange = (e: any) => {
    animStore.shakeConfig.isSyncMove = e.detail.value
}

</script>

<style lang="scss" scoped>
.anim-settings {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .section {
        margin-bottom: 20rpx;
    }
}

.more-text {
    padding-right: 20rpx;
}

.anim-settings-scroll {
    flex: 1;
    min-height: 0;
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

.anim-settings-panel {
    padding-left: 10rpx;
}

.anim-settings-panel-content {
    font-size: 26rpx;
    margin: 10rpx 0 20rpx;

}

.anim-settings-panel-container {
    opacity: 0;
    max-height: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease
}

.anim-settings-panel-container.is-show {
    max-height: 800rpx;
    opacity: 1;
}


.animation-scale-type {
    margin-top: 20rpx;
    gap: 20rpx;
}

.animation-scale-item {
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
