<template>
  <view class="container">
    <view class="preview-area">
      <DanmuBoard />
    </view>
    <ControlPanel class="control-panel" />
  </view>
</template>

<script setup lang="ts">
import DanmuBoard from '@/components/DanmuBoard.vue';
import ControlPanel from '@/components/ControlPanel.vue';

</script>

<style scoped>
.container {
  height: 100vh;
  position: relative;
  background: #000;
}

.preview-area {
  background-color: #000;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
}
</style>
