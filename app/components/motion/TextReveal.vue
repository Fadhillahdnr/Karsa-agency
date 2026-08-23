<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  as?: string
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  delay: 0,
})

const rootRef = ref<HTMLElement | null>(null)
const { prefersReduced } = useReducedMotion()

useGsapContext(() => {
  if (!rootRef.value || prefersReduced.value) return

  gsap.registerPlugin(ScrollTrigger)
  gsap.from(rootRef.value, {
    opacity: 0,
    y: 24,
    duration: 0.7,
    delay: props.delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: rootRef.value,
      start: 'top 85%',
      once: true,
    },
  })
}, rootRef)
</script>

<template>
  <component
    :is="as"
    ref="rootRef"
  >
    <slot />
  </component>
</template>
