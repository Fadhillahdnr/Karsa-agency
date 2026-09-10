<script setup lang="ts">
import type { LegalPageRow } from '../../../../server/utils/supabase'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

type ListItem = LegalPageRow & { title: string }

const { authFetch } = useAdminAuth()

const { items: legalPages, loading, error: errorMessage, load: loadLegalPages } = useAdminList<ListItem>(
  () => authFetch<ListItem[]>('/api/admin/legal'),
  'Could not load legal pages.',
)

onMounted(loadLegalPages)
</script>

<template>
  <AdminListPage
    title="Legal pages"
    description="Privacy, Terms, and Terms of Service. Fixed pages — content only, no create/delete. Wording has not been reviewed by qualified legal counsel; review before relying on it commercially."
    :loading="loading"
    :error="errorMessage"
    :empty="false"
  >
    <ul class="mt-6 flex flex-col gap-2">
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
  </AdminListPage>
</template>
