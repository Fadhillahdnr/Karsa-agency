<script setup lang="ts">
interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: 'display-1' | 'display-2' | 'h1' | 'h2' | 'h3'
  eyebrow?: string
}

withDefaults(defineProps<Props>(), {
  as: 'h2',
  size: 'h2',
  eyebrow: undefined,
})

const sizeMap: Record<string, string> = {
  'display-1': 'text-[length:var(--text-display-1)]',
  'display-2': 'text-[length:var(--text-display-2)]',
  'h1': 'text-[length:var(--text-h1)]',
  'h2': 'text-[length:var(--text-h2)]',
  'h3': 'text-[length:var(--text-h3)]',
}
</script>

<template>
  <div>
    <p
      v-if="eyebrow"
      class="text-eyebrow mb-3"
    >
      {{ eyebrow }}
    </p>
    <component
      :is="as"
      class="font-display font-medium text-balance"
      :class="sizeMap[size]"
    >
      <slot />
    </component>
  </div>
</template>
