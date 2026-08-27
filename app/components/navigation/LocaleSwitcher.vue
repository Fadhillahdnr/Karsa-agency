<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const otherLocales = computed(() =>
  (locales.value as { code: string, name?: string }[]).filter(l => l.code !== locale.value),
)
</script>

<template>
  <div
    class="flex items-center gap-1 text-sm font-medium"
    role="group"
    :aria-label="t('common.language')"
  >
    <span class="text-[var(--color-text)]">{{ locale.toUpperCase() }}</span>
    <NuxtLink
      v-for="other in otherLocales"
      :key="other.code"
      :to="switchLocalePath(other.code as 'en' | 'id')"
      class="text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text)]"
    >
      <span aria-hidden="true">/</span>
      <span class="sr-only">{{ t('common.language') }}:</span>
      {{ other.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>
