<template>
    <view class="anim-settings">
        <view class="section">
            <view class="section-title">运动方向</view>
            <view class="grid-container">
                <view v-for="item in directionList" :key="item.value"
                    :class="{ active: animStore.direction === item.value }" @click="handleDirectionChange(item.value)"
                    class="direction-item">
                    <view class="icon material-icons">{{ item.icon }}</view>
                    <text class="label">{{ item.label }}</text>
                </view>
            </view>
        </view>

        <view class="section">
            <view class="section-title">运动方向</view>
            <view class="grid-container">
                <view v-for="item in effectList" :key="item.value" :class="{ active: animStore.effect === item.value }"
                    @click="handleEffectChange(item.value)" class="direction-item">
                    <view class="icon material-icons">{{ item.icon }}</view>
                    <text class="label">{{ item.label }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { useAnimStore } from "@/stores/anim";
import { Direction, Effect } from "@/types/anim";

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
    { label: "随机", value: "shuffle", icon: "shuffle" },
] as const;

const handleDirectionChange = (dir: Direction) => {
    animStore.updateDirection(dir);
}

const handleEffectChange = (eff: Effect) => { }

</script>

<style lang="scss" scoped>
.anim-settings {
    padding: 40rpx;
    color: #fff;
}

.section-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
}

.grid-container {
    display: flex;
    justify-content: space-between;
    gap: 20rpx
}

.direction-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    flex: 1;

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
</style>
