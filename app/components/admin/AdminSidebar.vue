<script setup lang="ts">
import type { AdminIconName } from './AdminIcon.vue'
import type { AdminRole } from '../../../server/utils/supabase'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const asideRef = ref<HTMLElement | null>(null)
const { hasRole } = useAdminAuth()

interface NavItem {
  label: string
  to: string
  icon: AdminIconName
  /** Roles that can see this item. Omit for "every active admin". */
  roles?: AdminRole[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

// Mirrors the target sidebar IA (master prompt §27) — groups that don't
// have any real page yet are left out entirely rather than linking to
// pages that don't exist. Add groups back as each milestone builds them.
const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin', icon: 'dashboard' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Homepage', to: '/admin/content/home', icon: 'edit', roles: ['super_admin', 'content_editor'] },
      { label: 'Services', to: '/admin/services', icon: 'projects', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Packages', to: '/admin/packages', icon: 'projects', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Work / Case Studies', to: '/admin/projects', icon: 'projects', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Clients', to: '/admin/clients', icon: 'building', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Testimonials', to: '/admin/testimonials', icon: 'mail', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Insights', to: '/admin/articles', icon: 'edit', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Updates', to: '/admin/updates', icon: 'edit', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'FAQ', to: '/admin/faqs', icon: 'edit', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Careers', to: '/admin/careers', icon: 'building', roles: ['super_admin', 'content_editor', 'viewer'] },
    ],
  },
  {
    label: 'Portfolio / Evidence',
    items: [
      { label: 'Design Showcase', to: '/admin/portfolio/design', icon: 'image', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Photography Portfolio', to: '/admin/portfolio/photography', icon: 'image', roles: ['super_admin', 'content_editor', 'viewer'] },
      { label: 'Videography Portfolio', to: '/admin/portfolio/videography', icon: 'image', roles: ['super_admin', 'content_editor', 'viewer'] },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Leads', to: '/admin/leads', icon: 'leads', roles: ['super_admin', 'sales', 'viewer'] },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Media Library', to: '/admin/media', icon: 'image', roles: ['super_admin', 'content_editor', 'viewer'] },
    ],
  },
  {
    label: 'Site',
    items: [
      { label: 'Legal Pages', to: '/admin/legal', icon: 'edit', roles: ['super_admin', 'content_editor'] },
    ],
  },
]

const visibleGroups = computed(() =>
  navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.roles || hasRole(...item.roles)),
    }))
    .filter(group => group.items.length > 0),
)

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

    <nav class="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-4">
      <div
        v-for="group in visibleGroups"
        :key="group.label"
      >
        <p class="px-3 pb-2 text-xs font-medium tracking-widest text-[var(--color-text-muted)] uppercase">
          {{ group.label }}
        </p>
        <div class="flex flex-col gap-1">
          <NuxtLink
            v-for="item in group.items"
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
        </div>
      </div>
    </nav>

    <div class="border-t border-[var(--color-border)] px-6 py-4 text-xs text-[var(--color-text-muted)]">
      Karsa Agency © {{ new Date().getFullYear() }}
    </div>
  </aside>
</template>
