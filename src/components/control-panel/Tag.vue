<template>
    <scroll-view scroll-x enable-flex class="tag-container">
        <view @click="onTagClick(item)" class="tag-item flex items-center text-white"
            :class="{ 'tag-item--active': activeId === item.id }" v-for="item in tagList" :key="item.id">
            <text class="tag-text">{{ item.label }}</text>
        </view>
    </scroll-view>
</template>

<script setup lang="ts">
import type { SceneId } from '@/types/scene'
import { useSceneStore } from '@/stores/scene'
import { computed } from 'vue'

const sceneStore = useSceneStore()

const emit = defineEmits(['tagClick'])

interface TagItem {
    id: SceneId
    label: string
}

const tagList: TagItem[] = [
    { id: "default", label: "默认" },
    { id: 'concert', label: '🎤 演唱会应援' },
    { id: 'airport', label: '✈️ 接机举牌' },
    // { id: 'birthday', label: '🎂 生日表白模式' },
    // { id: 'nightmarket', label: '👋 夜市招揽模式' },
    // { id: 'classroom', label: '🔇 课堂静音模式' },
    // { id: 'photo', label: '📸 拍照打卡模式' },
    // { id: 'night', label: '🌙 夜间安全模式' },
    // { id: 'event', label: '🎯 活动引导模式' },
]

const activeId = computed(() => sceneStore.activeSceneId)

const onTagClick = (item: TagItem) => {
    sceneStore.applyPreset(item.id)
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

.tag-item--active {
    background-color: #7c3aed;
    box-shadow: 0 0 12rpx rgba(124, 58, 237, 0.7);
}
</style>