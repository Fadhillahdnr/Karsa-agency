export function useWebGLSupport() {
  const supported = ref(true)

  if (import.meta.client) {
    try {
      const canvas = document.createElement('canvas')
      const gl
        = canvas.getContext('webgl2')
          || canvas.getContext('webgl')
          || canvas.getContext('experimental-webgl')
      supported.value = !!gl
    }
    catch {
      supported.value = false
    }
  }

  return { supported: readonly(supported) }
}
