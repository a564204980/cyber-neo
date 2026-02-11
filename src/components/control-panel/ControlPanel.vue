<template>
    <view class="control-panel-container direction-column" :style="controlPanelStyle">
        <view class="collapsible-content" :class="{ 'collapsed': activeTab != 0 }">
            <view class="input-area w-full">
                <view class="input-area-head flex items-center justify-between">
                    <view class="input-area-head-left text-primary">
                        <text class="material-icons">format_size</text>
                        <text>文字内容</text>
                    </view>
                    <view class="input-area-head-right text-secondary">{{ `${inputValue.length}/${max}` }}</view>
                </view>
                <view class="input-area-body">
                    <textarea @input="onInput" @confirm="onConfirm" @keydown.enter.prevent="onConfirm"
                        confirm-type="send" :maxlength="max" :value="inputValue" confirm-hold :show-confirm-bar="false"
                        class="w-full h-full input-area-body-input" placeholder="请输入弹幕内容"
                        placeholder-class="input-placeholder" />
                </view>
            </view>

            <Tag @tagClick="onTagClick" class="tag-container" />
        </view>


        <PanelTabs class="panel-tabs" v-model="activeTab" :height="panelTabsHeight" />
    </view>
</template>

<script setup lang="ts">
import { getRects } from "@/utils";
import PanelTabs from "./PanelTabs.vue"
import Tag from "./Tag.vue"
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue';

interface Props {
    value?: string,
    parentHeight?: number
}

const props = defineProps<Props>()

const emits = defineEmits(["send"])
const instance = getCurrentInstance()

const max = 50
const activeTab = ref(0)
const inputValue = ref<string>("")
const panelTabsHeight = ref<number>(0)
const collapsibleContentHeight = ref<number>(0) // 缓存展开时的高度

const controlPanelStyle = computed(() => {
    return {
        height: props.parentHeight + 'px'
    }
})

watch(() => props.value, () => {
    inputValue.value = props.value || ""
})

watch(() => props.parentHeight, async () => {
    await nextTick()
    getNodeInfos()
}, { immediate: true })

watch(activeTab, (val) => {
    if (val === 0 && collapsibleContentHeight.value > 0) {
        panelTabsHeight.value = (props.parentHeight || 0) - collapsibleContentHeight.value
    }
    setTimeout(() => {
        getNodeInfos()
    }, 350)
})



const onInput = (e: any) => {
    inputValue.value = e.detail.value
}

const onConfirm = () => {
    emits("send", inputValue.value)
}


const onTagClick = (item: { label: string }) => {
    inputValue.value = item.label
    emits("send", inputValue.value)
}


const getNodeInfos = async () => {
    const nodes = await getRects([".control-panel-container", ".collapsible-content"], instance) as UniApp.NodeInfo[]
    if (nodes && nodes.length > 0) {
        const contentHeight = nodes[1]?.height || 0
        if (contentHeight > 0) {
            collapsibleContentHeight.value = contentHeight
        }
        panelTabsHeight.value = (props.parentHeight || 0) - contentHeight
    }
}


</script>

<style lang="scss" scoped>
.control-panel-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    gap: 20rpx;
}

.collapsible-content {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 500rpx;
    opacity: 1;
    overflow: hidden;
    flex-shrink: 0;


}

.collapsed {
    max-height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
}



.input-area {
    box-sizing: border-box;
    padding: 40rpx 40rpx 0;
}

.input-area-head-left {
    display: flex;
    align-items: center;
    font-size: 40rpx;
    font-weight: bold;
    gap: 10rpx;
}

.input-area-head-left .material-icons {
    font-size: 48rpx;
    margin-right: 10rpx;
}

.input-area-head-right {
    font-size: 24rpx;
}

.input-area-body {
    margin-top: 20rpx;
    height: 110rpx;
    background-color: #262626;
    border-radius: 20rpx;
    padding: 20rpx;
}

.input-area-body-input {
    color: #fff;
}

.tag-container {
    padding: 0 40rpx;
}
</style>
