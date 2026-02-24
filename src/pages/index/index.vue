<template>
  <view>
    <CustomNavBar :nav-style="navStyle" v-show="!isFullscreen" />
    <view class="container">

      <view class="preview-area" :style="{
        height: isFullscreen ? '100%' : (100 - panelHeightPercent - 10) + '%',
        transition: isDragging ? 'none' : 'height 0.2s',
        paddingTop: isFullscreen ? '0' : '170rpx'
      }">
        <DanmuBoard class="w-full h-full" :text="danmuText" :rotation="danmuRotation" />
      </view>

      <!-- 添加 flex column 布局 -->
      <view class="control-panel flex direction-column" :style="controlPanelStyle">

        <view class="flex items-center justify-between control-panel-header">
          <view class="text-secondary flex items-center full-screen" @click="isFullscreen = true">
            <text class="material-icons">fullscreen</text>全屏
          </view>
          <!-- 拖拽条部分 -->
          <view class="drag-block-container flex justify-center items-center direction-column" @touchstart="onDragStart"
            @touchmove.stop.prevent="onDragMove" @touchend="onDragEnd">
            <view class="drag-block"></view>
            <view class="text-secondary">下拉预览</view>
          </view>
          <view class="text-secondary flex items-center pause-btn">
            <text class="material-icons">stop_circle</text>暂停
          </view>
        </view>

        <!-- ControlPanel 自动填满剩余空间，且 height:0 确保内部滚动正常 -->
        <ControlPanel v-show="!isFullscreen" @send="onSend" :value="danmuText" class="flex-1 h-0"
          :parentHeight="controlPanelHeight" />
      </view>
    </view>

    <GlobalPopup ref="popupRef" />

  </view>
</template>

<script setup lang="ts">
import DanmuBoard from '@/components/DanmuBoard.vue';
import CustomNavBar from '@/components/CustomNavBar.vue';
import ControlPanel from '@/components/control-panel/ControlPanel.vue';
import GlobalPopup from '@/components/common/GlobalPopup.vue';
import { usePopupStore } from '@/stores';
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { getRects } from '@/utils';

const popupStore = usePopupStore()
const instance = getCurrentInstance()

const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
const windowWidth = uni.getSystemInfoSync().windowWidth

const popupRef = ref()
const danmuText = ref<string>()
const panelHeightPercent = ref<number>(70) // 定义面板的初始高度比例
const startY = ref<number>(0) // 记录触摸开始时的Y坐标
const startHeight = ref<number>(0) // 记录触摸起始时的面板高度
const isDragging = ref(false); // 标记是否正在拖拽
const windowHeight = uni.getSystemInfoSync().windowHeight; // 获取屏幕高度用于计算比例
const controlPanelHeight = ref<number>(0)
const isFullscreen = ref(false) // 是否全屏

// 弹幕旋转角度
const danmuRotation = computed(() => {
  if (isFullscreen.value) {
    return 90;
  }

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


  const bgValue = Math.round(255 * (1 - progress));
  const colorValue = Math.round(255 * progress);
  return {
    color: `rgb(${colorValue}, ${colorValue}, ${colorValue})`,
    backgroundColor: `rgb(${bgValue}, ${bgValue}, ${bgValue})`
  };
})

// 控制面板样式
const controlPanelStyle = computed(() => {
  return {
    height: !isFullscreen.value ? panelHeightPercent.value - 3 + '%' : '0',
    transition: isDragging.value ? 'none' : 'height 0.2s'
  }
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

const getNodeInfos = async () => {
  const nodes = await getRects([".control-panel", ".drag-block-container"], instance) as UniApp.NodeInfo[]
  if (nodes && nodes.length > 0) {
    controlPanelHeight.value = (nodes[0]?.height || 0) - (nodes[1]?.height || 0)
  }
}

onMounted(() => {
  popupStore.setPopupRef(popupRef.value.popupRef)

  getNodeInfos()
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

.control-panel-header {
  padding: 0 40rpx;
}

.drag-block-container {
  padding: 40rpx 0 0;
}

.drag-block {
  width: 100%;
  height: 8rpx;
  background: #454549;
  border-radius: 50rpx;
  margin-bottom: 10rpx;
}

.full-screen,
.pause-btn {
  padding-top: 50rpx;
  gap: 4rpx;
}
</style>
