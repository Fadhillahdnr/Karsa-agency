<script setup lang="ts">
type Tone = 'neutral' | 'accent' | 'warning' | 'danger'

const props = defineProps<{ label: string, tone?: Tone }>()

const toneClass: Record<Tone, string> = {
  neutral: 'border-[var(--color-border)] text-[var(--color-text-muted)]',
  accent: 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
  warning: 'border-transparent bg-[var(--color-accent)] text-[var(--color-on-accent)]',
  danger: 'border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap"
    :class="toneClass[props.tone ?? 'neutral']"
  >
    <span
      class="h-1.5 w-1.5 rounded-full bg-current"
      aria-hidden="true"
    />
    {{ props.label }}
  </span>
</template>
