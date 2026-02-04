<template>
    <view>
        <view class="style-settings-wrapper">
            <view class="flex items-center justify-between style-settings-container">
                <view class="active-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></view>
                <view v-for="(item, index) in list" :key="item.value" @click="onItemClick(index)"
                    class="style-item font-bold " :class="index === activeIndex ? 'active' : 'text-secondary'">{{
                        item.label
                    }}
                </view>
            </view>
        </view>

        <view class="color-panel-container">
            <view class="font-bold color-panel-title">颜色面板</view>
            <scroll-view scroll-x enable-flex scroll-with-animation class="color-panel-scroll-wrapper">
                <view class="color-panel-scroll flex">
                    <view v-for="(item, index) in colorPanelList" :key="index" class="color-panel-item"
                        @click="onColorItemClick(index)">
                        <view class="color-panel-orgin" :style="{ backgroundColor: item.color }"
                            :class="index === activeColorIndex ? 'active' : ''"></view>
                        <view class="color-panel-text">{{ item.label }}</view>
                    </view>
                </view>
            </scroll-view>
        </view>

        <view class="size-panel-container">
            <view class="font-bold size-panel-title">文字大小</view>
            <slider value="50" @change="sliderChange" show-value />
        </view>
    </view>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStyleStore } from '@/stores'

const store = useStyleStore()


const list = [
    { label: "文字样式", value: "text" },
    { label: "画布样式", value: "canvas" }
]
const colorPanelList = store.colorList
const activeIndex = ref<number>(0)
const activeColorIndex = ref<number>(store.activeColorIndex)

const onItemClick = (index: number) => {
    activeIndex.value = index
}

const onColorItemClick = (index: number) => {
    store.setColor(index)
    activeColorIndex.value = index
}

const sliderChange = (e: any) => {
    console.log(e.detail.value)
}

</script>

<style lang="scss" scoped>
.style-settings-wrapper {
    padding: 0 40rpx;
}

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

.color-panel-container,
.size-panel-container {
    margin: 20rpx;
}

.color-panel-title,
.size-panel-title {
    font-size: 24rpx;
    margin: 0 20rpx;
}



.color-panel-scroll {
    padding-top: 30rpx;
    position: relative;
    /* 为伪元素提供定位上下文 */

    /* 使用伪元素撑开右侧空间 */
    &::after {
        content: '';
        display: block;
        width: 30rpx;
        flex-shrink: 0;
    }
}

.color-panel-item {
    flex-shrink: 0;
    margin: 0 10rpx;

    &:first-child {
        margin-left: 40rpx;
    }
}



.color-panel-orgin {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    position: relative;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.color-panel-orgin.active {
    transform: scale(1.15);
    border: 6rpx solid #fff;
    box-sizing: border-box;

    box-shadow:
        0 0 10rpx rgba(255, 255, 255, 0.6),
        0 0 30rpx rgba(255, 255, 255, 0.3),
        inset 0 0 10rpx rgba(255, 255, 255, 0.1);

    // 回弹效果
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}


.color-panel-text {
    font-size: 22rpx;
    text-align: center;
    margin-top: 4rpx;
}
</style>
