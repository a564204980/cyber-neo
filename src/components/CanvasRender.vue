<template>
    <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="canvas-full"></canvas>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, onUnmounted, watch } from 'vue';
import { effectDrawers } from "@/canvas-effects"

const props = withDefaults(defineProps<{
    effectType: string
    text: string
    fontSize: number
    isPaused: boolean
    direction: string      // 'left' | 'right' | 'up' | 'down'
    rotation: number
    config: Record<string, any>
}>(), {
    isPaused: false,
    direction: 'left'
})

const instance = getCurrentInstance()
const canvasId = `cr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`

let timer: ReturnType<typeof setInterval> | null = null
let ctx: any = null
let offset = 0
let canvasW = 0
let canvasH = 0

watch(() => props.effectType, () => {
    offset = 0
})

watch(() => props.rotation, () => {
    if (timer) clearInterval(timer)
    timer = null
    ctx = null
    offset = 0
    initCanvas()
})

const initCanvas = () => {
    setTimeout(() => {
        const query = uni.createSelectorQuery().in(instance?.proxy)
        query.select(`#${canvasId}`).fields({ node: true, size: true }, () => { }).exec((res) => {
            if (!res?.[0]?.node) return

            const canvas = res[0].node
            ctx = canvas.getContext("2d")

            canvasW = res[0].width
            canvasH = res[0].height

            const dpr = uni.getWindowInfo().pixelRatio
            canvas.width = canvasW * dpr
            canvas.height = canvasH * dpr
            ctx.scale(dpr, dpr)

            timer = setInterval(draw, 33);
        })
    }, 100)
}

const draw = () => {
    const drawer = effectDrawers[props.effectType]
    if (!drawer) return

    const { textX, textY } = calcTextPosition()

    drawer({
        ctx, W: canvasW, H: canvasH, fontSize: props.fontSize,
        text: props.text, offset, textX, textY,
        config: props.config as any
    })

    offset++
}

const calcTextPosition = () => {
    // 暂停时文字居中
    if (props.isPaused) {
        return { textX: canvasW / 2, textY: canvasH / 2 }
    }

    const textWidth = props.text.length * props.fontSize // 文字的总宽度
    const speed = 2

    // 从右到左
    if (props.direction === "left") {
        const totalDistance = canvasW + textWidth
        const x = canvasW + textWidth / 2 - (offset * speed) % totalDistance
        return { textX: x, textY: canvasH / 2 }
    }

    // 从左侧外 → 右侧外
    if (props.direction === 'right') {
        const totalDistance = canvasW + textWidth
        const x = -textWidth / 2 + (offset * speed) % totalDistance
        return { textX: x, textY: canvasH / 2 }
    }
    // 从底部外 → 顶部外
    if (props.direction === 'up') {
        const totalDistance = canvasH + props.fontSize
        const y = canvasH + props.fontSize / 2 - (offset * speed) % totalDistance
        return { textX: canvasW / 2, textY: y }
    }
    // 从顶部外 → 底部外
    if (props.direction === 'down') {
        const totalDistance = canvasH + props.fontSize
        const y = -props.fontSize / 2 + (offset * speed) % totalDistance
        return { textX: canvasW / 2, textY: y }
    }
    return { textX: canvasW / 2, textY: canvasH / 2 }
}

onMounted(() => {
    initCanvas()
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})

</script>

<style lang="scss" scoped>
.canvas-full {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>