<script setup lang="ts">
interface Props {
  narrow?: boolean
  as?: string
}

withDefaults(defineProps<Props>(), {
  narrow: false,
  as: 'div',
})
</script>

<template>
  <component
    :is="as"
    class="container-karsa"
    :class="narrow ? 'max-w-[var(--container-narrow)]' : ''"
  >
    <slot />
  </component>
</template>
