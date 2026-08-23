export function useReducedMotion() {
  const prefersReduced = ref(false)

  if (import.meta.client) {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = query.matches

    const handleChange = (event: MediaQueryListEvent) => {
      prefersReduced.value = event.matches
    }

    query.addEventListener('change', handleChange)
    onScopeDispose(() => query.removeEventListener('change', handleChange))
  }

  return { prefersReduced: readonly(prefersReduced) }
}
