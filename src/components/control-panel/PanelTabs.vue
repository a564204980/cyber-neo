<template>
    <view class="panel-tabs-wrapper" :style="panelTabsStyle">
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

        <swiper :current="activeTabIndex" @change="onSwiperChange" class="swiper-container" :duration="300"
            :style="{ height: swiperHeight + 'px' }">
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
import { computed, getCurrentInstance, onMounted, ref, watch } from "vue"
import { getRects } from "@/utils"

interface Props {
    modelValue: number,
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    height: 0
})

const emit = defineEmits(['update:modelValue'])
const instance = getCurrentInstance()

const tabs = [
    { label: "样式", value: "style", },
    { label: "动画", value: "anim", },
    { label: "特效", value: "effect", }
]

const activeTabIndex = ref<number>(props.modelValue || 0)
const swiperHeight = ref<number>(0)

watch(() => props.modelValue, (val) => {
    activeTabIndex.value = val
})

const panelTabsStyle = computed(() => {
    getSwiperHeight()
    return {
        height: props.height - 20 + 'px'
    }
})

const onTabClick = (index: number) => {
    activeTabIndex.value = index
    getSwiperHeight()
    emit('update:modelValue', index)
}

const onSwiperChange = (e: any) => {
    activeTabIndex.value = e.detail.current
    emit('update:modelValue', e.detail.current)
}


const getSwiperHeight = async () => {
    const res = await getRects([".panel-tabs", ".tab-indicator-container"], instance) as UniApp.NodeInfo[]
    if (res && res.length > 0) {
        swiperHeight.value = (props.height || 0) - (res[0]?.height || 0) - (res[1]?.height || 0) - 20
    }
}




</script>

<style lang="scss" scoped>
.panel-tabs-wrapper {
    display: flex;
    flex-direction: column;
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
</style>
