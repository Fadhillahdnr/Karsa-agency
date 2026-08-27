<script setup lang="ts">
import type { AdminIconName } from './AdminIcon.vue'

defineProps<{
  label: string
  value: string | number
  icon: AdminIconName
  hint?: string
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'div'"
    :to="to"
    class="flex items-start justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors"
    :class="to ? 'hover:border-[var(--color-accent)]/50' : ''"
  >
    <div>
      <p class="text-sm text-[var(--color-text-muted)]">
        {{ label }}
      </p>
      <p class="mt-2 font-display text-3xl font-medium">
        {{ value }}
      </p>
      <p
        v-if="hint"
        class="mt-1 text-xs text-[var(--color-text-muted)]"
      >
        {{ hint }}
      </p>
    </div>
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
      <AdminIcon :name="icon" />
    </div>
  </component>
</template>
