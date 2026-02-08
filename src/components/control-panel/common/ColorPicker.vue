<template>
    <view>
        <scroll-view scroll-x enable-flex scroll-with-animation class="color-panel-scroll-wrapper">
            <view class="color-panel-scroll flex">
                <template v-for="(item, index) in colorPanelList" :key="index">
                    <view v-if="item.label !== '自定义'"
                        class="color-panel-item flex direction-column justify-center items-center"
                        @click="onColorItemClick(index)">
                        <view class="color-panel-orgin" :style="[originStyle, { backgroundColor: item.color }]"
                            :class="index === activeColorIndex ? 'active' : ''">
                            <text v-if="activeColorIndex === index" class="material-icons">check</text>
                        </view>
                        <view class="color-panel-text">{{ item.label }}</view>
                    </view>

                    <view v-else @click="onCustomColorClick(index)"
                        class="color-panel-item flex direction-column justify-center items-center">
                        <view class="color-panel-orgin color-panel-custom"
                            :class="index === activeColorIndex ? 'active' : ''" :style="[originStyle]">
                            <text class="material-icons">add</text>
                        </view>
                        <view class="color-panel-text">自定义</view>
                    </view>
                </template>


            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStyleStore } from '@/stores';

const styleStore = useStyleStore()

interface Props {
    colorPanelList: Array<{ label: string, color: string }>
    activeColorIndex: number
    size?: number
}

const props = withDefaults(defineProps<Props>(), {
    colorPanelList: () => [],
    activeColorIndex: 0,
    size: 80
})

const emit = defineEmits(['colorClick', 'customColorClick'])


const originStyle = computed(() => {
    return {
        width: `${props.size}rpx`,
        height: `${props.size}rpx`
    }
})

const onColorItemClick = (index: number) => {
    emit('colorClick', index)
}

const onCustomColorClick = (index: number) => {
    emit('customColorClick', index)
}
</script>

<style lang="scss" scoped>
.color-panel-item {
    flex-shrink: 0;
    margin: 0 10rpx;

    &:first-child {
        margin-left: 40rpx;
    }
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

.color-panel-orgin {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
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
    flex-direction: column;
}

.color-panel-custom {
    border: 5rpx dashed #fff;
    box-sizing: border-box;
}
</style>
