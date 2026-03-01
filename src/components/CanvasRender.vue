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
    animEffect: string // 动画类型
    animParams: Record<string, any> | null // 动画参数
}>(), {
    isPaused: false,
    direction: 'left',
    animEffect: 'none',
    animParams: null
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

// 初始化canvas
const initCanvas = () => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }

    setTimeout(() => {
        const query = uni.createSelectorQuery().in(instance?.proxy)
        query.select(`#${canvasId}`).fields({ node: true, size: true }, () => { }).exec((res) => {
            if (!res?.[0]?.node) return

            const canvas = res[0].node
            ctx = canvas.getContext("2d")

            canvasW = res[0].width || uni.getWindowInfo().windowWidth
            canvasH = res[0].height || uni.getWindowInfo().windowHeight

            const dpr = uni.getWindowInfo().pixelRatio
            canvas.width = canvasW * dpr
            canvas.height = canvasH * dpr
            ctx.scale(dpr, dpr)

            if (timer) {
                clearInterval(timer)
            }
            timer = setInterval(draw, 33);
        })
    }, 100)
}

/**
 * 绘制文字
 */
const draw = () => {
    const drawer = effectDrawers[props.effectType]
    if (!drawer) return

    const { textX, textY } = calcTextPosition()
    const anim = calcAnimTransform()

    ctx.clearRect(0, 0, canvasW, canvasH)

    ctx.save()

    const baseY = textY + anim.offsetY + props.fontSize / 2
    ctx.translate(textX, baseY)

    const scaleX = anim.scaleX ?? anim.scale
    const scaleY = anim.scaleY ?? anim.scale
    ctx.rotate(anim.rotate)
    ctx.scale(scaleX, scaleY)

    ctx.translate(-textX, -baseY)

    drawer({
        ctx, W: canvasW, H: canvasH, fontSize: props.fontSize,
        text: props.text, offset, textX, textY: textY + anim.offsetY,
        config: props.config as any
    })

    ctx.restore()
    offset++
}

const calcTextPosition = () => {
    // 暂停时文字居中
    if (props.isPaused) {
        return { textX: canvasW / 2, textY: canvasH / 2 }
    }

    const textWidth = props.text.length * props.fontSize // 文字的总宽度
    const speed = 2

    if (props.direction === "left") {
        const totalDistance = canvasW + textWidth
        const x = canvasW + textWidth / 2 - (offset * speed) % totalDistance
        return { textX: x, textY: canvasH / 2 }
    }
    if (props.direction === 'right') {
        const totalDistance = canvasW + textWidth
        const x = -textWidth / 2 + (offset * speed) % totalDistance
        return { textX: x, textY: canvasH / 2 }
    }
    if (props.direction === 'up') {
        const totalDistance = canvasH + props.fontSize
        const y = canvasH + props.fontSize / 2 - (offset * speed) % totalDistance
        return { textX: canvasW / 2, textY: y }
    }
    if (props.direction === 'down') {
        const totalDistance = canvasH + props.fontSize
        const y = -props.fontSize / 2 + (offset * speed) % totalDistance
        return { textX: canvasW / 2, textY: y }
    }
    return { textX: canvasW / 2, textY: canvasH / 2 }
}

/**
 * 根据动画类型计算当前帧的变换值
 */
const calcAnimTransform = () => {
    const params = props.animParams
    if (!params || props.animEffect === "none") {
        return { scale: 1, rotate: 0, offsetY: 0 }
    }

    const t = Date.now() / 1000
    const duration = params.duration
    const progress = (t % duration) / duration

    // ── 摇摆 (shake) ──
    if (props.animEffect === "shake") {
        const maxAngle = params.angle * (Math.PI / 180)
        let angle = 0
        if (progress < 0.15) {
            angle = maxAngle * (progress / 0.15)
        } else if (progress < 0.30) {
            angle = maxAngle * (1 - ((progress - 0.15) / 0.15) * 1.6)
        } else if (progress < 0.45) {
            angle = maxAngle * (-0.6 + ((progress - 0.30) / 0.15) * 0.95)
        } else if (progress < 0.60) {
            angle = maxAngle * (0.35 - ((progress - 0.45) / 0.15) * 0.55)
        } else if (progress < 0.75) {
            angle = maxAngle * (-0.2 + ((progress - 0.60) / 0.15) * 0.3)
        } else {
            angle = maxAngle * 0.1 * (1 - (progress - 0.75) / 0.25)
        }
        return { scale: 1, rotate: angle, offsetY: 0 }
    }

    // 波浪动画
    if (props.animEffect === "wave") {
        const waveOffset = params.offset
        const y = waveOffset * Math.sin(progress * Math.PI * 2)
        return { scale: 1, rotate: 0, offsetY: y }
    }

    // ── 跳动 (jump) ──
    if (props.animEffect === 'jump') {
        const jumpOffset = params.offset
        let y = 0, scaleX = 1, scaleY = 1

        const t1 = 0.60  // 60% 的时间用于第一次大跳 (0 - 60%)
        const t2 = 0.75  // 15% 的时间用于落地挤压 (60% - 75%)
        // 剩下的 25% 时间用于第二次小跳 (75% - 100%)

        if (progress < t1) {
            // ================= 1. 第一次大抛物线 =================
            const p = progress / t1
            const easeP = Math.sin(p * Math.PI)
            y = -jumpOffset * easeP

            // 速度拉伸，两头最长，最高点恢复
            const stretch = (1 - easeP) * 0.15
            scaleY = 1 + stretch
            scaleX = 1 / scaleY
        } else if (progress < t2) {
            // ================= 2. 第一次落地挤压 =================
            const p = (progress - t1) / (t2 - t1)
            y = 0

            // 挤压弹性波幅
            const squash = Math.sin(p * Math.PI) * 0.1
            scaleY = 1 - squash
            scaleX = 1 / scaleY
        } else {
            // ================= 3. 第二次小抛物线 =================
            const p = (progress - t2) / (1 - t2)
            const easeP = Math.sin(p * Math.PI)
            // 高度只有大跳的 25%
            y = -jumpOffset * 0.25 * easeP

            // 小跳不额外加拉伸，保持基本形状
            scaleX = 1
            scaleY = 1
        }

        return { scale: 1, scaleX, scaleY, rotate: 0, offsetY: y }
    }

    return { scale: 1, rotate: 0, offsetY: 0 }
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
    z-index: 0;
}
</style>