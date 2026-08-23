<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import type { Vector3 } from 'three'
import type { PerformanceTier } from '~/composables/useDevicePerformance'

interface Props {
  tier: PerformanceTier
  reducedMotion: boolean
}

const props = defineProps<Props>()

const dpr = computed(() => {
  const cap = props.tier === 'high' ? 1.75 : 1.1
  return Math.min(window.devicePixelRatio || 1, cap)
})

// Always render: for reduced-motion this draws one unchanging frame per tick
// (negligible cost for this low-poly scene) — 'manual' mode would require an
// explicit render() call that nothing here triggers, leaving the canvas blank.
</script>

<template>
  <TresCanvas
    class="!absolute inset-0"
    :dpr="dpr"
    render-mode="always"
    :alpha="true"
    :antialias="tier === 'high'"
    power-preference="low-power"
  >
    <TresPerspectiveCamera
      :position="[0, 0, 6] as unknown as Vector3"
      :fov="35"
    />
    <TresAmbientLight :intensity="0.6" />
    <TresDirectionalLight
      :position="[3, 4, 5] as unknown as Vector3"
      :intensity="1.1"
      color="#F5F5F2"
    />
    <TresDirectionalLight
      :position="[-4, -2, -3] as unknown as Vector3"
      :intensity="0.35"
      color="#4F9D6E"
    />

    <KarsaLogoModel
      :tier="tier"
      :reduced-motion="reducedMotion"
    />
  </TresCanvas>
</template>
