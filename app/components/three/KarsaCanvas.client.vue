<script setup lang="ts">
const { supported: webglSupported } = useWebGLSupport()
const { prefersReduced } = useReducedMotion()
const { tier } = useDevicePerformance()

const canRender3d = computed(() => webglSupported.value && tier.value !== 'low')
</script>

<template>
  <div class="relative h-full w-full">
    <KarsaLogoScene
      v-if="canRender3d"
      :tier="tier"
      :reduced-motion="prefersReduced"
    />
    <img
      v-else
      src="/brand/karsa-mark.svg"
      alt=""
      aria-hidden="true"
      class="absolute right-[-8%] top-1/2 h-[70vmin] w-[70vmin] max-w-none -translate-y-1/2 opacity-[0.14] md:opacity-20"
    >
  </div>
</template>
