<script setup lang="ts">
withDefaults(defineProps<{ height?: string, width?: string, rounded?: string }>(), {
  height: '1rem',
  width: '100%',
  rounded: 'var(--radius-sm)',
})
</script>

<template>
  <div
    class="animate-pulse bg-[var(--color-surface-raised)]"
    :style="{ height, width, borderRadius: rounded }"
    aria-hidden="true"
  />
</template>
