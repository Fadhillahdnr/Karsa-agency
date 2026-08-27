<script setup lang="ts">
const { navLinks, primaryCta, site } = useKarsaConfig()
const route = useRoute()
const { t } = useI18n()

const scrolled = ref(false)
const menuOpen = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-[var(--duration-base)]"
    :class="scrolled || menuOpen ? 'bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]' : 'bg-transparent'"
  >
    <a
      href="#main-content"
      class="sr-only-focusable fixed left-4 top-4 z-[60] rounded bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-on-accent)]"
    >
      {{ t('common.skipToContent') }}
    </a>

    <BaseContainer>
      <div class="flex h-[72px] items-center justify-between">
        <NuxtLink
          to="/"
          class="font-display text-lg font-semibold tracking-tight"
          aria-label="Karsa Studio — home"
        >
          {{ (site.name.split(' ')[0] ?? site.name).toUpperCase() }}°
        </NuxtLink>

        <nav
          class="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="font-body text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text)]"
            active-class="!text-[var(--color-text)]"
          >
            {{ link.label }}
          </NuxtLink>
          <BaseButton
            :to="primaryCta.to"
            variant="secondary"
          >
            {{ primaryCta.label }} <span aria-hidden="true">↗</span>
          </BaseButton>
          <LocaleSwitcher />
        </nav>

        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="site-mobile-menu"
          :aria-label="menuOpen ? t('common.closeMenu') : t('common.openMenu')"
          @click="toggleMenu"
        >
          <span class="relative block h-4 w-6">
            <span
              class="absolute left-0 top-0 block h-[1.5px] w-6 bg-current transition-all duration-[var(--duration-fast)]"
              :class="menuOpen ? 'translate-y-[7px] rotate-45' : ''"
            />
            <span
              class="absolute bottom-0 left-0 block h-[1.5px] w-6 bg-current transition-all duration-[var(--duration-fast)]"
              :class="menuOpen ? '-translate-y-[7px] -rotate-45' : ''"
            />
          </span>
        </button>
      </div>
    </BaseContainer>

    <SiteMenu
      :open="menuOpen"
      @close="menuOpen = false"
    />
  </header>
</template>
