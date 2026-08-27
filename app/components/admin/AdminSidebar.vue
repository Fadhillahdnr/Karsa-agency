<script setup lang="ts">
import type { AdminIconName } from './AdminIcon.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const asideRef = ref<HTMLElement | null>(null)

const navItems: { label: string, to: string, icon: AdminIconName }[] = [
  { label: 'Dashboard', to: '/admin', icon: 'dashboard' },
  { label: 'Projects', to: '/admin/projects', icon: 'projects' },
  { label: 'Leads', to: '/admin/leads', icon: 'leads' },
]

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab' || !asideRef.value) return

  const focusable = asideRef.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
    await nextTick()
    asideRef.value?.querySelector<HTMLElement>('a[href]')?.focus()
  }
  else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
    @click="emit('close')"
  />

  <aside
    ref="asideRef"
    role="navigation"
    aria-label="Admin"
    class="fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-[var(--duration-base)] lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0"
    :class="{ 'translate-x-0': open }"
  >
    <div class="flex items-center justify-between px-6 py-5">
      <NuxtLink
        to="/admin"
        class="font-display text-lg font-medium"
        @click="emit('close')"
      >
        Karsa Admin
      </NuxtLink>
      <button
        type="button"
        class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] lg:hidden"
        aria-label="Close menu"
        @click="emit('close')"
      >
        <AdminIcon name="close" />
      </button>
    </div>

    <nav class="flex flex-1 flex-col gap-1 px-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex min-h-[44px] items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]'"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        @click="emit('close')"
      >
        <AdminIcon :name="item.icon" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="border-t border-[var(--color-border)] px-6 py-4 text-xs text-[var(--color-text-muted)]">
      Karsa Studio © {{ new Date().getFullYear() }}
    </div>
  </aside>
</template>
