import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Scopes GSAP animations/ScrollTriggers to a component and reverts them on
 * unmount. Prevents the classic "duplicate timeline after route revisit"
 * bug by tying every tween's lifetime to the component instance.
 */
export function useGsapContext(setup: (context: gsap.Context) => void, scope?: Ref<HTMLElement | null | undefined>) {
  let ctx: gsap.Context | undefined

  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
    ctx = gsap.context(setup, scope?.value ?? undefined)
  })

  onUnmounted(() => {
    ctx?.revert()
  })

  return {
    kill: () => ctx?.revert(),
  }
}
