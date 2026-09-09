<script setup lang="ts">
import type { ClientApiItem } from '../../../server/api/clients/index.get'

const { t, locale } = useI18n()

const { data: clients } = await useAsyncData(`home-clients-${locale.value}`, () =>
  $fetch<ClientApiItem[]>('/api/clients'),
)
</script>

<template>
  <BaseSection
    v-if="clients?.length"
    tight
    bleed
  >
    <BaseContainer>
      <p class="text-eyebrow mb-8">
        {{ t('clientLogos.eyebrow') }}
      </p>
    </BaseContainer>
    <div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 px-[var(--gutter)]">
      <a
        v-for="client in clients"
        :key="client.slug"
        :href="client.websiteUrl || undefined"
        :target="client.websiteUrl ? '_blank' : undefined"
        :rel="client.websiteUrl ? 'noopener noreferrer' : undefined"
        class="opacity-60 grayscale transition-opacity duration-[var(--duration-base)] hover:opacity-100 hover:grayscale-0"
      >
        <img
          v-if="client.logoUrl"
          :src="client.logoUrl"
          :alt="client.name"
          class="h-8 w-auto object-contain"
          loading="lazy"
        >
        <span
          v-else
          class="font-display text-sm font-medium uppercase"
        >{{ client.name }}</span>
      </a>
    </div>
  </BaseSection>
</template>
