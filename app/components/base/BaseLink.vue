<script setup lang="ts">
interface Props {
  to?: string
  href?: string
  external?: boolean
  showArrow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
  external: false,
  showArrow: false,
})

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'a'))
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="group inline-flex items-center gap-1.5 font-body text-sm font-medium text-[var(--color-text)] underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-accent)] hover:decoration-current"
  >
    <slot />
    <span
      v-if="showArrow"
      aria-hidden="true"
      class="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >↗</span>
  </component>
</template>
