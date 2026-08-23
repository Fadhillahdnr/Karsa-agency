<script setup lang="ts">
interface Props {
  id?: string
  tight?: boolean
  bleed?: boolean
}

withDefaults(defineProps<Props>(), {
  id: undefined,
  tight: false,
  bleed: false,
})
</script>

<template>
  <section
    :id="id"
    class="relative"
    :class="tight ? 'py-[var(--space-16)] md:py-[var(--space-24)]' : 'py-[var(--space-24)] md:py-[var(--space-32)]'"
  >
    <BaseContainer v-if="!bleed">
      <slot />
    </BaseContainer>
    <slot v-else />
  </section>
</template>
