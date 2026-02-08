<template>
    <scroll-view scroll-x enable-flex class="tag-container">
        <view @click="onTagClick(item)" class="tag-item flex items-center text-white" v-for="item in tagList"
            :key="item.label">
            <text class="tag-text">{{ item.label }}</text>
        </view>
    </scroll-view>
</template>

<script setup lang="ts">
const emit = defineEmits(['tagClick'])

const tagList = [
    { label: "🎤 演唱会应援模式" },
    { label: "✈️ 接机举牌模式" },
    { label: "🎂 生日表白模式" },
    { label: "👋 夜市招揽模式" },
    { label: "🔇 课堂静音模式" },
    { label: "📸 拍照打卡模式" },
    { label: "🌙 夜间安全模式" },
    { label: "🎯 活动引导模式" },
]

const onTagClick = (item: { label: string }) => {
    emit('tagClick', item)
}

</script>

<style scoped lang="scss">
.tag-container {
    display: flex;
    gap: 20rpx;
    width: 100%;
    white-space: nowrap;
}

.tag-item {
    padding: 0 30rpx;
    border-radius: 50rpx;
    background-color: #262626;
    flex-shrink: 0;
    margin-right: 20rpx;
    max-width: 260rpx;
}

.tag-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 100%;
}
</style>