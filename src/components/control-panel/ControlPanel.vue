<template>
    <view class="control-panel-container direction-column" :style="controlPanelStyle">
        <view class="collapsible-content" :class="{ 'collapsed': activeTab != 0 }">
            <view class="input-area w-full">
                <view class="input-area-head flex items-center justify-between">
                    <view class="input-area-head-left text-primary">
                        <text class="material-icons">format_size</text>
                        <text>文字内容</text>
                        <button open-type="feedback" class="feedback-btn">意见反馈</button>
                        <button class="multi-line-btn" :class="{ 'multi-line-btn--active': styleStore.isMultiLine }"
                            @click="onMultiLineClick">多行文本</button>
                    </view>
                    <view class="input-area-head-right text-secondary">{{ `${inputValue.length}/${max}` }}</view>
                </view>
                <view class="input-area-body">
                    <textarea @input="onInput" @confirm="onConfirm"
                        :confirm-type="styleStore.isMultiLine ? 'return' : 'send'" :maxlength="max" :value="inputValue"
                        confirm-hold :show-confirm-bar="false" class="w-full h-full input-area-body-input"
                        placeholder="请输入弹幕内容" placeholder-class="input-placeholder" />
                    <view class="send-btn flex items-center justify-center" @click="onConfirm">
                        <text class="material-icons">send</text>
                    </view>
                </view>
            </view>

            <Tag @tagClick="onTagClick" class="tag-container" />
        </view>


        <PanelTabs class="panel-tabs flex-1" style="min-height: 0" v-model="activeTab" />
    </view>
</template>

<script setup lang="ts">
import PanelTabs from "./PanelTabs.vue"
import Tag from "./Tag.vue"
import { computed, ref, watch } from 'vue';
import { useAppStore } from '@/stores/app'
import { useStyleStore } from '@/stores/style'

interface Props {
    value?: string,
    parentHeight?: number
}

const props = defineProps<Props>()

const appStore = useAppStore()
const styleStore = useStyleStore()

const emits = defineEmits(["send"])

const max = 50
const inputValue = ref<string>("")

const controlPanelStyle = computed(() => {
    return {
        height: props.parentHeight + 'px'
    }
})

const activeTab = computed({
    get: () => appStore.activeTab,
    set: (val) => {
        appStore.activeTab = val
    }
})

watch(() => props.value, () => {
    inputValue.value = props.value || ""
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

const onMultiLineClick = () => {
    styleStore.updateMultiLine(!styleStore.isMultiLine)
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
    align-items: flex-end;
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
    position: relative;
}

.input-area-body-input {
    color: #fff;
    width: calc(100% - 100rpx);
}

.send-btn {
    position: absolute;
    right: 15rpx;
    bottom: 15rpx;
    width: 80rpx;
    height: 80rpx;
    background: #7c3aed;
    color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(124, 58, 237, 0.3);

    .material-icons {
        font-size: 40rpx;
    }

    &:active {
        transform: scale(0.95);
        background: #6d28d9;
    }
}

.tag-container {
    padding: 0 10rpx;
}

.feedback-btn {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.06);
    border-radius: 30rpx;
    padding: 0 20rpx;
    height: 48rpx;
    line-height: 48rpx;
    border: none;

    &::after {
        border: none;
    }
}

.multi-line-btn {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.06);
    border-radius: 30rpx;
    padding: 0 20rpx;
    height: 48rpx;
    line-height: 48rpx;
    border: none;
    margin-left: 10rpx;
    transition: all 0.3s ease;

    &--active {
        background: #7c3aed;
        color: #fff;
        box-shadow: 0 0 10rpx rgba(124, 58, 237, 0.4);
    }

    &::after {
        border: none;
    }
}
</style>
