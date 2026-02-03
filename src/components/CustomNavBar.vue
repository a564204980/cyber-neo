<template>
    <view class="custom-nav-bar"
        :style="{ paddingTop: statusBarHeight + 'px', backgroundColor: navStyle?.backgroundColor }">
        <view class="nav-content flex items-center justify-center">
            <text class="nav-title" :style="{ color: navStyle?.color }">赛博弹幕</text>
        </view>
    </view>
</template>

<script setup lang="ts">
interface Props {
    navStyle?: {
        color?: string
        backgroundColor?: string
    }
}
const props = defineProps<Props>()


const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0

</script>

<style lang="scss" scoped>
.custom-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    transition: background-color 0.1s linear;
}

.nav-content {
    height: 44px;
    padding: 0 16px
}

.nav-title {
    font-size: 40rpx;
    font-weight: bold;
    transition: color 0.1s linear;
}
</style>