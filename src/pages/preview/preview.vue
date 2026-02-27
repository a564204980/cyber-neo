<template>
    <view @click="handleClose" class="page">
        <DanmuBoard class="w-full h-full" :text="'我是弹幕'" :rotation="90" :is-paused="animStore.isPause" />
    </view>
</template>

<script setup lang="ts">
import DanmuBoard from '@/components/DanmuBoard.vue';
import { useAnimStore } from '@/stores';

const animStore = useAnimStore()

const handleClose = () => {
    uni.redirectTo({
        url: '/pages/index/index'
    })
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    width: 100vw;
}
</style>
