import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Single Lenis instance for the whole app lifetime, synced to GSAP's ticker
 * so ScrollTrigger stays in lockstep with smooth-scroll. Created once here
 * (not per-component) so route revisits never spawn duplicate instances.
 */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lenis = new Lenis({
    duration: prefersReduced ? 0 : 1.1,
    smoothWheel: !prefersReduced,
    syncTouch: false,
    // Lenis owns wheel/touch input at the window level. Let controls that
    // have their own scroll area keep native input instead (notably the
    // public inquiry textarea; the admin shell is excluded as a whole via
    // `data-lenis-prevent` in its layout).
    prevent: node => node instanceof HTMLElement
      && (node instanceof HTMLTextAreaElement || node.isContentEditable),
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return {
    provide: {
      lenis,
    },
  }
})
