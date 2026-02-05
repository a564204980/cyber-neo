<template>
    <view class="color-picker-panel">
        <view class="panel-title">颜色选择</view>

        <!-- 渐变色块（可点击选择颜色） -->
        <view class="color-canvas" @tap="onCanvasTap">
            <view class="canvas-inner" :style="canvasStyle"></view>
        </view>

        <view class="hue-slider">
            <view class="hue-track"></view>
            <Slider :value="hue" :min="0" :max="360" :show-value="false" block-size="20"
                :background-color="alphaGradient" @changing="onHueChange" />
        </view>


        <!-- 底部按钮 -->
        <view class="action-buttons flex items-center justify-between">
            <view class="btn btn-cancel" @tap="onCancel">取消</view>
            <view class="btn btn-confirm" @tap="onConfirm">确认</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Slider from './Slider.vue';


const emit = defineEmits(["confirm", "cancel"])

const hue = ref(300) // 色相
const saturation = ref(100) // 饱和度
const lightness = ref(50) // 明度

const alphaGradient = computed(() =>
    `linear-gradient(to right,
    hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
    hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%),
    hsl(360,100%,50%)
  )`
)

const canvasStyle = computed(() => {
    return {
        background: `linear-gradient(to bottom, hsl(${hue.value}, 100%, 50%) 0%, 50%, rgba(0, 0, 0, 1) 100%)`
    }
})

const onCanvasTap = () => {
    console.log('canvas tap');
}

const onConfirm = () => { }

const onCancel = () => { }

const onHueChange = (e: any) => {
    hue.value = e.detail.value
}

</script>

<style scoped lang="scss">
.color-picker-panel {
    padding: 40rpx;
    border-radius: 40rpx 40rpx 0 0;
}

.panel-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 30rpx;
    text-align: center;
}

.color-canvas {
    position: relative;
    width: 100%;
    height: 400rpx;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
}

.canvas-inner {
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #fff, transparent),
        linear-gradient(to bottom, transparent, #000);
}

.action-buttons {
    gap: 40rpx;
}

.btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    font-size: 28rpx;
    font-weight: bold;
}

.btn-confirm {
    background: linear-gradient(135deg, #ff007f, #ff007f);
    color: #fff;
}

.btn-cancel {
    background: transparent;
    border: 2rpx solid #ff007f;
    color: #ff007f;
}

.hue-slider {
    position: relative;
    height: 40rpx;
    margin-bottom: 30rpx;
    border-radius: 20rpx;
}

.hue-track {
    position: absolute;
    width: 100%;
    height: 100%;
}

.hue-slider slider {
    position: relative;
    z-index: 2;
}
</style>
