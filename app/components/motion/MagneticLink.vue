<script setup lang="ts">
import gsap from 'gsap'

interface Props {
  strength?: number
}

const props = withDefaults(defineProps<Props>(), {
  strength: 0.35,
})

const rootRef = ref<HTMLElement | null>(null)
const { prefersReduced } = useReducedMotion()

function handleMouseMove(event: MouseEvent) {
  if (!rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  const x = event.clientX - (rect.left + rect.width / 2)
  const y = event.clientY - (rect.top + rect.height / 2)

  gsap.to(rootRef.value, {
    x: x * props.strength,
    y: y * props.strength,
    duration: 0.4,
    ease: 'power3.out',
  })
}

function handleMouseLeave() {
  if (!rootRef.value) return
  gsap.to(rootRef.value, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
}

onMounted(() => {
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (prefersReduced.value || !supportsHover || !rootRef.value) return

  rootRef.value.addEventListener('mousemove', handleMouseMove)
  rootRef.value.addEventListener('mouseleave', handleMouseLeave)
})

onUnmounted(() => {
  rootRef.value?.removeEventListener('mousemove', handleMouseMove)
  rootRef.value?.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<template>
  <span
    ref="rootRef"
    class="inline-block will-change-transform"
  >
    <slot />
  </span>
</template>
