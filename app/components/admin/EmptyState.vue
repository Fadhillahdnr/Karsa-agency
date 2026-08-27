<script setup lang="ts">
import type { AdminIconName } from './AdminIcon.vue'

defineProps<{
  icon: AdminIconName
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)]">
      <AdminIcon
        :name="icon"
        :size="22"
      />
    </div>
    <p class="font-medium">
      {{ title }}
    </p>
    <p
      v-if="description"
      class="max-w-sm text-sm text-[var(--color-text-muted)]"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.action"
      class="mt-2"
    >
      <slot name="action" />
    </div>
  </div>
</template>
