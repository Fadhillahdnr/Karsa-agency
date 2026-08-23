export type PerformanceTier = 'high' | 'medium' | 'low'

interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number
}

/**
 * Classifies the device into a HIGH / MEDIUM / LOW tier used to scale 3D and
 * motion cost. Runs once on the client; signals are static for the session
 * (memory/concurrency don't change at runtime, and viewport-driven scenes
 * should react to their own resize handlers instead of re-classifying here).
 */
export function useDevicePerformance() {
  const tier = ref<PerformanceTier>('high')

  if (import.meta.client) {
    const nav = navigator as NavigatorWithDeviceMemory
    const memory = nav.deviceMemory ?? 8
    const cores = nav.hardwareConcurrency ?? 8
    const dpr = window.devicePixelRatio || 1
    const viewportWidth = window.innerWidth
    const { supported: webglSupported } = useWebGLSupport()
    const { prefersReduced } = useReducedMotion()

    let score = 0
    if (memory < 4) score -= 2
    else if (memory >= 8) score += 1

    if (cores < 4) score -= 2
    else if (cores >= 8) score += 1

    if (viewportWidth < 768) score -= 1
    if (dpr > 2) score -= 1

    if (!webglSupported.value) {
      tier.value = 'low'
    }
    else if (prefersReduced.value) {
      tier.value = 'low'
    }
    else if (score <= -2) {
      tier.value = 'low'
    }
    else if (score <= 0) {
      tier.value = 'medium'
    }
    else {
      tier.value = 'high'
    }
  }

  return { tier: readonly(tier) }
}
