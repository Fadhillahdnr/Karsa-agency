import type Lenis from 'lenis'

/** Accesses the app-wide Lenis instance created in plugins/lenis.client.ts */
export function useLenis() {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$lenis as Lenis | undefined
}
