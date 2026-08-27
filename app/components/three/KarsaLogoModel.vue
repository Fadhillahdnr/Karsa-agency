<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import type { Group, Mesh, Object3D, Vector3 } from 'three'
import type { PerformanceTier } from '~/composables/useDevicePerformance'

interface Props {
  tier: PerformanceTier
  reducedMotion: boolean
}

const props = defineProps<Props>()

const groupRef = shallowRef<Group | null>(null)

const canPointerParallax = ref(false)
const pointer = { x: 0, y: 0 }
const targetTilt = { x: 0, y: 0 }
const scrollProgress = ref(0)
const isVisible = ref(true)

function handlePointerMove(event: PointerEvent) {
  const x = (event.clientX / window.innerWidth) * 2 - 1
  const y = (event.clientY / window.innerHeight) * 2 - 1
  const strength = props.tier === 'high' ? 1 : 0.4
  targetTilt.x = y * 0.18 * strength
  targetTilt.y = x * 0.28 * strength
}

function handleScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = max > 0 ? window.scrollY / max : 0
}

function handleVisibilityChange() {
  isVisible.value = document.visibilityState === 'visible'
}

onMounted(() => {
  canPointerParallax.value
    = props.tier === 'high' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (canPointerParallax.value) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  const group = groupRef.value
  if (group) {
    group.traverse((child: Object3D) => {
      const mesh = child as Mesh
      mesh.geometry?.dispose?.()
      const material = mesh.material
      if (Array.isArray(material)) material.forEach(m => m.dispose?.())
      else material?.dispose?.()
    })
  }
})

if (!props.reducedMotion) {
  const { onBeforeRender } = useLoop()

  onBeforeRender(({ delta }) => {
    if (!isVisible.value || !groupRef.value) return

    const group = groupRef.value
    pointer.x += (targetTilt.x - pointer.x) * Math.min(delta * 4, 1)
    pointer.y += (targetTilt.y - pointer.y) * Math.min(delta * 4, 1)

    group.rotation.x = pointer.x + Math.sin(Date.now() * 0.0003) * 0.05
    group.rotation.y = pointer.y + scrollProgress.value * Math.PI * 0.6
    group.position.y = Math.sin(Date.now() * 0.0006) * 0.08
  })
}
</script>

<template>
  <TresGroup
    ref="groupRef"
    :position="[1.1, 0, 0] as unknown as Vector3"
  >
    <TresMesh :rotation="[Math.PI / 2, 0, 0]">
      <TresTorusGeometry :args="[1.4, 0.09, tier === 'high' ? 32 : 16, tier === 'high' ? 96 : 48]" />
      <TresMeshStandardMaterial
        color="#242424"
        :roughness="0.55"
        :metalness="0.35"
      />
    </TresMesh>

    <TresMesh :rotation="[Math.PI / 2, 0, 0]">
      <TresTorusGeometry :args="[0.85, 0.07, tier === 'high' ? 32 : 16, tier === 'high' ? 96 : 48]" />
      <TresMeshStandardMaterial
        color="#242424"
        :roughness="0.5"
        :metalness="0.4"
      />
    </TresMesh>

    <TresMesh :position="[0, 1.95, 0] as unknown as Vector3">
      <TresCylinderGeometry :args="[0.045, 0.045, 0.5, 12]" />
      <TresMeshStandardMaterial
        color="#F5F5F5"
        :roughness="0.35"
        :metalness="0.2"
        :emissive="'#8a8a8a'"
        :emissive-intensity="0.4"
      />
    </TresMesh>

    <TresMesh>
      <TresSphereGeometry :args="[0.14, tier === 'high' ? 24 : 12, tier === 'high' ? 24 : 12]" />
      <TresMeshStandardMaterial
        color="#F5F5F5"
        :roughness="0.3"
        :metalness="0.25"
        :emissive="'#8a8a8a'"
        :emissive-intensity="0.5"
      />
    </TresMesh>
  </TresGroup>
</template>
