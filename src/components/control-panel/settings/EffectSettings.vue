<template>
    <view class="settings">
        <scroll-view scroll-y class="settings-scroll">
            <view class="settings-wrapper">
                <view class="flex items-center justify-between settings-container">
                    <view class="active-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></view>
                    <view v-for="(item, index) in list" :key="item.value" @click="onItemClick(index)"
                        class="item font-bold " :class="index === activeIndex ? 'active' : 'text-secondary'">{{
                            item.label
                        }}
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const activeIndex = ref<number>(0)

const list = [
    { label: "文字动效", value: "text" },
    { label: "背景特效", value: "canvas" }
]


const onItemClick = (index: number) => {
    activeIndex.value = index
}
</script>

<style lang="scss" scoped>
.settings {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.settings-scroll {
    flex: 1;
    min-height: 0;
}

.settings-wrapper {
    padding: 0 40rpx;
}

.settings-container {
    position: relative;
    padding: 6rpx 6rpx;
    background: #212126;
    border-radius: 50rpx;
    font-size: 24rpx;
    margin-top: 20rpx;
}

.active-bg {
    position: absolute;
    top: 6rpx;
    bottom: 6rpx;
    left: 6rpx;
    width: calc((100% - 12rpx) / 2);
    background: #333;
    border-radius: 50rpx;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
}

.item {
    flex: 1;
    text-align: center;
    padding: 18rpx 20rpx;
    position: relative;
    z-index: 2;
    transition: color 0.3s;
}
</style>
