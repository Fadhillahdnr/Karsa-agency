<script setup lang="ts">
const { user, logout, isAuthenticated } = useAdminAuth()

async function handleLogout() {
  await logout()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[var(--color-bg)]">
    <header class="border-b border-[var(--color-border)]">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NuxtLink
          to="/admin/projects"
          class="font-display text-lg font-medium"
        >
          Karsa Admin
        </NuxtLink>
        <div
          v-if="isAuthenticated"
          class="flex items-center gap-4 text-sm text-[var(--color-text-muted)]"
        >
          <span>{{ user?.email }}</span>
          <button
            type="button"
            class="rounded-full border border-[var(--color-border)] px-4 py-2 font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            @click="handleLogout"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <slot />
    </main>
  </div>
</template>
