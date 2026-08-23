<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: isNotFound.value ? 'Page Not Found' : 'Something Went Wrong',
})

function handleRetry() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex flex-1 items-center">
      <BaseContainer class="py-32">
        <p class="text-eyebrow mb-6">
          {{ error.statusCode }}
        </p>
        <h1 class="font-display text-[length:var(--text-display-2)] font-medium uppercase leading-[1.02] tracking-tight">
          <template v-if="isNotFound">
            Page not found.
          </template>
          <template v-else>
            Something went wrong.
          </template>
        </h1>
        <p class="mt-6 max-w-md text-[length:var(--text-body-lg)] text-[var(--color-text-muted)]">
          <template v-if="isNotFound">
            The page you're looking for doesn't exist or may have moved.
          </template>
          <template v-else>
            An unexpected error occurred on our end. Please try again.
          </template>
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <BaseButton
            variant="primary"
            @click="handleRetry"
          >
            Back to Home
          </BaseButton>
          <BaseButton
            to="/work"
            variant="secondary"
          >
            Explore Work
          </BaseButton>
        </div>
      </BaseContainer>
    </main>
    <SiteFooter />
  </div>
</template>
