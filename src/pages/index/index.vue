<template>
  <view>
    <CustomNavBar :nav-style="navStyle" />
    <view class="container">

      <view class="preview-area"
        :style="{ height: (100 - panelHeightPercent - 10) + '%', transition: isDragging ? 'none' : 'height 0.2s' }">
        <DanmuBoard class="w-full h-full" :text="danmuText" :rotation="danmuRotation" />
      </view>

      <view class="control-panel"
        :style="{ height: panelHeightPercent - 3 + '%', transition: isDragging ? 'none' : 'height 0.2s' }">
        <view class="drag-block-container w-full flex justify-center items-center direction-column"
          @touchstart="onDragStart" @touchmove.stop.prevent="onDragMove" @touchend="onDragEnd">
          <view class="drag-block"></view>
          <view class="text-secondary ">下拉预览</view>
        </view>
        <ControlPanel @send="onSend" :value="danmuText" />
      </view>
    </view>

    <!-- <uni-popup ref="popup" background-color="#fff">
      <text>这是内容</text>
    </uni-popup> -->

    <GlobalPopup />
  </view>
</template>

<script setup lang="ts">
import DanmuBoard from '@/components/DanmuBoard.vue';
import CustomNavBar from '@/components/CustomNavBar.vue';
import ControlPanel from '@/components/control-panel/ControlPanel.vue';
import GlobalPopup from '@/components/common/GlobalPopup.vue';

import { computed, onMounted, ref } from 'vue';

const popupRef = ref()
const danmuText = ref<string>()
const panelHeightPercent = ref<number>(70) // 定义面板的初始高度比例
const startY = ref<number>(0) // 记录触摸开始时的Y坐标
const startHeight = ref<number>(0) // 记录触摸起始时的面板高度
const isDragging = ref(false); // 标记是否正在拖拽
const windowHeight = uni.getSystemInfoSync().windowHeight; // 获取屏幕高度用于计算比例

// 弹幕旋转角度
const danmuRotation = computed(() => {
  const maxH = 70;
  const minH = 26;
  const current = panelHeightPercent.value;

  // 计算进度
  let progress = (maxH - current) / (maxH - minH)

  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  return progress * 90
})

const navStyle = computed(() => {
  const maxH = 70;
  const minH = 26;
  const current = panelHeightPercent.value;

  let progress = (maxH - current) / (maxH - minH);

  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;

  // 初始状态 (panelHeight=70%, progress=0): 背景白色(255), 文字黑色(0)
  // 结束状态 (panelHeight=26%, progress=1): 背景黑色(0), 文字白色(255)

  const bgValue = Math.round(255 * (1 - progress)); // 255 -> 0
  const colorValue = Math.round(255 * progress);     // 0 -> 255

  return {
    color: `rgb(${colorValue}, ${colorValue}, ${colorValue})`,
    backgroundColor: `rgb(${bgValue}, ${bgValue}, ${bgValue})`
  };
})


const onSend = (value: string) => {
  danmuText.value = value
}



// 触摸开始
const onDragStart = (e: TouchEvent) => {
  isDragging.value = true
  startY.value = e.touches[0].clientY
  startHeight.value = panelHeightPercent.value
}

const onDragMove = (e: TouchEvent) => {
  if (!isDragging.value) return

  const touch = e.touches[0]
  const deltaY = touch.clientY - startY.value // 移动距离

  const deltaPercent = (deltaY / windowHeight) * 100

  let newHeight = startHeight.value - deltaPercent

  // 边界限制
  if (newHeight > 70) newHeight = 70;
  if (newHeight < 26) newHeight = 26;

  panelHeightPercent.value = newHeight;
}

// 拖拽结束
const onDragEnd = (e: TouchEvent) => {
  isDragging.value = false;

  if (panelHeightPercent.value < 50) {
    panelHeightPercent.value = 26;
  } else {
    panelHeightPercent.value = 70;
  }
}


const popup = ref()
onMounted(() => {
  popup.value.open()
})
</script>

<style scoped>
.container {
  height: 100vh;
  position: relative;
  background: #000;
}

.preview-area {
  background-color: #000;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 170rpx;

}

.control-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80%;
  background: #171717;
  border-top-left-radius: 70rpx;
  border-top-right-radius: 70rpx;
  box-sizing: border-box;
}

.drag-block-container {
  padding: 40rpx 0;
}

.drag-block {
  width: 10%;
  height: 8rpx;
  background: #454549;
  border-radius: 50rpx;
  margin-bottom: 10rpx;
}
</style>
