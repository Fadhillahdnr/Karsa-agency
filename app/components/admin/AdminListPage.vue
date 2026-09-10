<script setup lang="ts">
import type { AdminIconName } from './AdminIcon.vue'

withDefaults(defineProps<{
  title: string
  description?: string
  newTo?: string
  newLabel?: string
  loading: boolean
  error?: string
  empty: boolean
  emptyIcon?: AdminIconName
  emptyTitle?: string
  emptyDescription?: string
  skeletonCount?: number
  skeletonHeight?: string
}>(), {
  description: undefined,
  newTo: undefined,
  newLabel: 'New',
  error: '',
  emptyIcon: 'mail',
  emptyTitle: 'Nothing here yet',
  emptyDescription: undefined,
  skeletonCount: 3,
  skeletonHeight: '3.5rem',
})
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-medium">
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="mt-1 text-sm text-[var(--color-text-muted)]"
        >
          {{ description }}
        </p>
      </div>
      <BaseButton
        v-if="newTo"
        :to="newTo"
        variant="primary"
      >
        <AdminIcon
          name="plus"
          :size="16"
        /> {{ newLabel }}
      </BaseButton>
    </div>

    <slot name="filters" />

    <p
      v-if="error"
      role="alert"
      class="mt-6 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ error }}
    </p>

    <div
      v-if="loading"
      class="mt-6 flex flex-col gap-3"
    >
      <SkeletonBlock
        v-for="i in skeletonCount"
        :key="i"
        :height="skeletonHeight"
        rounded="var(--radius-md)"
      />
    </div>

    <EmptyState
      v-else-if="empty"
      class="mt-6"
      :icon="emptyIcon"
      :title="emptyTitle"
      :description="emptyDescription"
    >
      <template
        v-if="newTo"
        #action
      >
        <BaseButton
          :to="newTo"
          variant="secondary"
        >
          {{ newLabel }}
        </BaseButton>
      </template>
    </EmptyState>

    <slot v-else />
  </div>
</template>
