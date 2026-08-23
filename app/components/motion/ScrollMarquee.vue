<script setup lang="ts">
import gsap from 'gsap'

interface Props {
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  speed: 40,
})

const trackRef = ref<HTMLElement | null>(null)
const { prefersReduced } = useReducedMotion()

useGsapContext(() => {
  if (!trackRef.value || prefersReduced.value) return

  const width = trackRef.value.scrollWidth / 2
  gsap.to(trackRef.value, {
    x: -width,
    duration: width / props.speed,
    ease: 'none',
    repeat: -1,
  })
}, trackRef)
</script>

<template>
  <div
    class="overflow-hidden"
    role="group"
  >
    <div
      ref="trackRef"
      class="flex w-max gap-12 whitespace-nowrap will-change-transform"
    >
      <div
        class="flex gap-12"
        aria-hidden="false"
      >
        <slot />
      </div>
      <div
        class="flex gap-12"
        aria-hidden="true"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
