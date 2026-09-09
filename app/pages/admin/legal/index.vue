<script setup lang="ts">
import type { LegalPageRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = LegalPageRow & { title: string }

const { authFetch } = useAdminAuth()

const legalPages = ref<ListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadLegalPages() {
  loading.value = true
  errorMessage.value = ''
  try {
    legalPages.value = await authFetch<ListItem[]>('/api/admin/legal')
  }
  catch {
    errorMessage.value = 'Could not load legal pages.'
  }
  finally {
    loading.value = false
  }
}

onMounted(loadLegalPages)
</script>

<template>
  <div>
    <div>
      <h1 class="font-display text-2xl font-medium">
        Legal pages
      </h1>
      <p class="mt-1 text-sm text-[var(--color-text-muted)]">
        Privacy, Terms, and Terms of Service. Fixed pages — content only, no create/delete.
        Wording has not been reviewed by qualified legal counsel; review before relying on it commercially.
      </p>
    </div>

    <p
      v-if="errorMessage"
      role="alert"
      class="mt-6 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger)]/10 p-4 text-sm"
    >
      {{ errorMessage }}
    </p>

    <div
      v-if="loading"
      class="mt-6 flex flex-col gap-3"
    >
      <SkeletonBlock
        v-for="i in 3"
        :key="i"
        height="3.5rem"
        rounded="var(--radius-md)"
      />
    </div>

    <ul
      v-else
      class="mt-6 flex flex-col gap-2"
    >
      <li
        v-for="item in legalPages"
        :key="item.id"
        class="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <NuxtLink :to="`/admin/legal/${item.id}`">
          <p class="font-medium">
            {{ item.title }}
          </p>
          <p class="text-xs text-[var(--color-text-muted)]">
            /{{ item.slug }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
