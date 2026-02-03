<template>
    <view>
        <view class="flex items-center justify-between style-settings-container">
            <view class="active-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></view>
            <view v-for="(item, index) in list" :key="item.value" @click="onItemClick(index)"
                class="style-item font-bold " :class="index === activeIndex ? 'active' : 'text-secondary'">{{ item.label
                }}
            </view>
        </view>

        <view class="color-panel-container">
            <view class="font-bold color-panel-title">颜色面板</view>
            <view class="flex items-center color-panel-list">
                <view v-for="(item, index) in colorPanelList" :key="index" class="color-panel-item"
                    :style="{ backgroundColor: item.color }"></view>

            </view>
        </view>
    </view>

</template>

<script setup lang="ts">
import { ref } from 'vue';


const list = [
    { label: "文字样式", value: "text" },
    { label: "画布样式", value: "canvas" }
]
const colorPanelList = [
    { label: "电光蓝", color: "#00e5ff" },
    { label: "荧光绿", color: "#39ff14" },
    { label: "霓虹粉", color: "#ff007f" },
    { label: "赛博紫", color: "#b200ff" },
    { label: "炽热橙", color: "#ff7f00" },
    { label: "深邃黑", color: "#000000" },
]
const activeIndex = ref<number>(0)

const onItemClick = (index: number) => {
    activeIndex.value = index
}


</script>

<style lang="scss" scoped>
.style-settings-container {
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

.style-item {
    flex: 1;
    text-align: center;
    padding: 18rpx 20rpx;
    position: relative;
    z-index: 2;
    transition: color 0.3s;
}

.active {
    color: #fff;
}

.color-panel-container {
    margin-top: 20rpx;
}

.color-panel-title {
    font-size: 24rpx;
}

.color-panel-list {
    gap: 20rpx;
}

.color-panel-item {
    width: 100rpx;
    height: 100rpx;
    border-radius: 100rpx;
    border: 2rpx solid #212126;
}
</style>
