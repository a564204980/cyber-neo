<template>
    <view class="control-panel direction-column">
        <view class="input-area w-full">
            <view class="input-area-head flex items-center justify-between">
                <view class="input-area-head-left text-primary">
                    <text class="material-icons">format_size</text>
                    <text>文字内容</text>
                </view>
                <view class="input-area-head-right text-secondary">{{ `${inputValue.length}/${max}` }}</view>
            </view>
            <view class="input-area-body">
                <textarea @input="onInput" @confirm="onConfirm" @keydown.enter.prevent="onConfirm" confirm-type="send"
                    :maxlength="max" :value="inputValue" confirm-hold :show-confirm-bar="false"
                    class="w-full h-full input-area-body-input" placeholder="请输入弹幕内容"
                    placeholder-class="input-placeholder" />
            </view>
        </view>

        <Tag @tagClick="onTagClick" />

        <PanelTabs />
    </view>
</template>

<script setup lang="ts">
import PanelTabs from "./PanelTabs.vue"
import Tag from "./Tag.vue"
import { ref, watch } from 'vue';

interface Props {
    value?: string
}

const props = defineProps<Props>()

const emits = defineEmits(["send"])

const max = 50
const inputValue = ref<string>("")

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
</script>

<style lang="scss" scoped>
.control-panel {
    width: 100%;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    gap: 20rpx;
}

.input-area {
    box-sizing: border-box;
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
</style>
