<script setup lang="ts">
const { user, logout, isAuthenticated } = useAdminAuth()
const route = useRoute()
const sidebarOpen = ref(false)
const { isLocked } = useScrollLock()

watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

async function handleLogout() {
  await logout()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="h-dvh overflow-hidden bg-[var(--color-bg)] lg:flex">
    <!--
      App-shell scroll model: this root never scrolls. Each pane below
      (sidebar nav, main content) owns its own `overflow-y-auto`, so the
      browser only scrolls whatever pane the cursor is actually over —
      the sidebar list, the header, and the page content all move
      independently instead of one long document scroll.
    -->
    <AdminSidebar
      v-if="isAuthenticated"
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <div class="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      <header
        v-if="isAuthenticated"
        class="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-4 backdrop-blur sm:px-6"
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

      <main
        class="admin-scroll-pane min-h-0 flex-1 overscroll-contain"
        :class="isLocked ? 'overflow-hidden' : 'overflow-y-auto'"
      >
        <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <slot />
        </div>
      </main>
    </div>

    <ToastStack />
    <ConfirmDialog />
  </div>
</template>
