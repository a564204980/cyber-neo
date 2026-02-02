<template>
    <view class="danmu-board">
        <view class="content-wrapper">
            <text class="danmu-text" :style="danmuStyle">{{ props.text
                }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    text?: string
    textColor?: string
    fontSize?: number
}

const props = withDefaults(defineProps<Props>(), {
    text: '我是弹幕',
    textColor: '#fff',
    fontSize: 100
})

const danmuStyle = computed(() => {
    return {
        color: props.textColor,
        fontSize: props.fontSize + 'rpx'
    }
})
</script>

<style lang="scss" scoped>
.danmu-board {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}


.content-wrapper {
    width: 100%;
    overflow: hidden;
    animation: scroll-left 5s linear infinite;
    will-change: transform;
}

.danmu-text {
    white-space: nowrap;
}

@keyframes scroll-left {
    0% {
        transform: translate(750rpx);
    }

    100% {
        transform: translate(-160%);
    }
}
</style>
