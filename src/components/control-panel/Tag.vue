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
    { label: "🎂 生日快乐生日快乐生日快乐" },
    { label: "✈️ 接机" },
    { label: "🔥 加油" },
    { label: "👋 你好" },
    { label: "🎂 生日快乐" },
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
    max-width: 200rpx;
}

.tag-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 100%;
}
</style>