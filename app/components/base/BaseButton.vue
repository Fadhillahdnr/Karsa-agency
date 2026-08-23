<script setup lang="ts">
interface Props {
  to?: string
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
  variant: 'primary',
  type: 'button',
  disabled: false,
  external: false,
})

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
    case 'ghost':
      return 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
    default:
      return 'bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)]'
  }
})
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="!to && !href ? type : undefined"
    :disabled="disabled"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium tracking-tight transition-colors duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:opacity-50"
    :class="variantClass"
  >
    <slot />
  </component>
</template>
