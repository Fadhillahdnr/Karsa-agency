<script setup lang="ts">
const { user, logout, isAuthenticated } = useAdminAuth()
const route = useRoute()
const sidebarOpen = ref(false)

watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

async function handleLogout() {
  await logout()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg)] lg:flex">
    <AdminSidebar
      v-if="isAuthenticated"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <div class="flex min-h-screen flex-1 flex-col">
      <header
        v-if="isAuthenticated"
        class="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-4 backdrop-blur sm:px-6"
      >
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] lg:hidden"
          aria-label="Open menu"
          @click="sidebarOpen = true"
        >
          <AdminIcon name="menu" />
        </button>

        <div class="hidden lg:block" />

        <div class="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
          <span class="hidden max-w-[16rem] truncate sm:inline">{{ user?.email }}</span>
          <button
            type="button"
            class="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--color-border)] px-4 font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            @click="handleLogout"
          >
            <AdminIcon
              name="logout"
              :size="16"
            />
            <span class="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <slot />
      </main>
    </div>

    <ToastStack />
    <ConfirmDialog />
  </div>
</template>
