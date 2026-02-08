<template>
    <view class="panel-tabs-wrapper">
        <view class="flex items-center text-secondary panel-tabs">
            <view v-for="(tab, index) in tabs" :key="tab.value"
                class="panel-tab font-bold flex items-center justify-center" @click="onTabClick(index)"
                :class="{ 'text-primary': activeTabIndex === index }">
                {{ tab.label }}
            </view>
        </view>
        <!-- 滑动指示器 -->
        <view class="tab-indicator-container">
            <view class="tab-indicator" :style="{ transform: `translateX(${activeTabIndex * 100}%)` }"></view>
        </view>

        <swiper :current="activeTabIndex" @change="onSwiperChange" class="swiper-container" :duration="300">
            <swiper-item>
                <StyleSettings />
            </swiper-item>
            <swiper-item>
                <AnimSettings />
            </swiper-item>
            <swiper-item>
                <EffectSettings />
            </swiper-item>
        </swiper>
    </view>
</template>

<script setup lang="ts">
import AnimSettings from "./settings/AnimSettings.vue"
import StyleSettings from "./settings/StyleSettings.vue"
import EffectSettings from "./settings/EffectSettings.vue"
import { ref, watch } from "vue"

interface Props {
    modelValue: number
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const tabs = [
    { label: "样式", value: "style", },
    { label: "动画", value: "anim", },
    { label: "特效", value: "effect", }
]

const activeTabIndex = ref<number>(props.modelValue || 0)

watch(() => props.modelValue, (val) => {
    activeTabIndex.value = val
})

const onTabClick = (index: number) => {
    activeTabIndex.value = index
    emit('update:modelValue', index)
}

const onSwiperChange = (e: any) => {
    activeTabIndex.value = e.detail.current
    emit('update:modelValue', e.detail.current)
}

</script>

<style lang="scss" scoped>
.panel-tabs-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.panel-tabs {
    position: relative;
    border-bottom: 2rpx solid #202025;
    padding: 0 40rpx;
}

.panel-tab {
    width: calc(100% / 3);
    padding: 20rpx;
    transition: color 0.3s ease;
}

.tab-indicator-container {
    position: relative;
    width: 100%;
    height: 4rpx;
    background: transparent;
    overflow: hidden;
}

.tab-indicator {
    position: absolute;
    left: 40rpx;
    width: calc((100% - 80rpx) / 3);
    height: 100%;
    background: #ff007f;
    transition: transform 0.3s ease;
}

.swiper-container {
    height: 500rpx
}
</style>
