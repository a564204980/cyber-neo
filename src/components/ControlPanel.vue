<template>
    <view class="control-panel" style="color:red">
        <view class="input-area">
            <view class="input-area-head flex align-center justify-between">
                <view class="input-area-head-left">
                    <text class="material-icons">format_size</text>
                    <text>文字内容</text>
                </view>
                <view class="input-area-head-right">0/50</view>
            </view>
            <view class="input-area-body">
                <textarea placeholder="请输入弹幕内容" />
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">

</script>

<style scoped>
.control-panel {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 40rpx 0;
    box-sizing: border-box;
    background: #171717;
    border-top-left-radius: 80rpx;
    border-top-right-radius: 80rpx;
}


.input-area-head-left {
    display: flex;
    align-items: center;
    font-size: 40rpx;
    font-weight: bold;
    gap: 10rpx;
    color: #3b82f5;
}

.input-area-head-left .material-icons {
    font-size: 48rpx;
    margin-right: 10rpx;
}

.input-area-head-right {
    font-size: 24rpx;
    color: #94a3b8;
}
</style>
